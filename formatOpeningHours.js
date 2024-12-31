// parsing opening hours, made by gpt4o, not checked but seems to work

export default function formatOpeningHours(hours) {
    try {
        const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        let timeToDays = {};

        days.forEach(day => {
            const time = hours[day]?.replaceAll(" ", "");
            if (time) {
                if (!timeToDays[time]) {
                    timeToDays[time] = [];
                }
                timeToDays[time].push(day);
            }
        });

        let result = [];
        for (let time in timeToDays) {
            let daysGroup = groupDays(timeToDays[time]);
            result.push(`${daysGroup} ${formatTime(time)}`);
        }

        return (result.join("; ") === "Mo-Su off" ? undefined : result.join("; ")) || undefined;
    } catch (_) {
        return undefined;
    }
}

function groupDays(days) {
    const dayOrder = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    let ranges = [];
    let rangeStart = days[0];
    let previousDay = days[0];

    for (let i = 1; i < days.length; i++) {
        const currentDay = days[i];
        if (dayOrder.indexOf(currentDay) === dayOrder.indexOf(previousDay) + 1) {
            previousDay = currentDay;
        } else {
            ranges.push(formatRange(rangeStart, previousDay));
            rangeStart = currentDay;
            previousDay = currentDay;
        }
    }
    ranges.push(formatRange(rangeStart, previousDay));

    return ranges.join(",");
}

function formatRange(start, end) {
    return start === end ? start : `${start}-${end}`;
}

function formatTime(time) {
    return time.split("-").map(t => padTime(t)).join("-");
}

function padTime(time) {
    return time.split(":").map(part => part.padStart(2, "0")).join(":");
}
