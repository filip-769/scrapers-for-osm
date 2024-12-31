import { parsePhoneNumber } from "https://esm.sh/awesome-phonenumber@5.1.0";
import formatOpeningHours from "../formatOpeningHours.js";

const geojson = {
    type: "FeatureCollection",
    features: []
}

const response = await fetch("https://coop.sk/sk/mapa-predajni");
const html = await response.text();

const json = JSON.parse(html.match(/(?<=locations = )[^;]+/g)[0]);

const potraviny = {
    shop: "convenience",
    branch: "Potraviny",
}

const supermarket = {
    shop: "supermarket",
    branch: "Supermarket"
}

const tempo = {
    shop: "supermarket",
    branch: "Tempo Supermarket"
}

const operators = {
    CJBR: "COOP Jednota Brezno",
    CJCA: "COOP Jednota Čadca",
    CJDS: "COOP Jednota Dunajská Streda",
    CJGA: "COOP Jednota Galanta",
    CJHU: "COOP Jednota Humenné",
    CJKA: "COOP Jednota Krupina",
    CJKN: "COOP Jednota Komárno",
    CJLM: "COOP Jednota Liptovský Mikuláš",
    CJLV: "COOP Jednota Levice",
    CJMI: "COOP Jednota Michalovce",
    CJMT: "COOP Jednota Martin",
    CJNO: "COOP Jednota Námestovo",
    CJNR: "COOP Jednota Nitra",
    CJNZ: "COOP Jednota Nové Zámky",
    CJPD: "COOP Jednota Prievidza",
    CJPO: "COOP Jednota Prešov",
    CJPP: "COOP Jednota Poprad",
    CJRA: "COOP Jednota Revúca",
    CJSE: "COOP Jednota Senica",
    CJTO: "COOP Jednota Topolčany",
    CJTS: "COOP Jednota Trstená",
    CJTT: "COOP Jednota Trnava",
    CJVT: "COOP Jednota Vranov nad Topľou",
    CJZA: "COOP Jednota Žilina",
    CJZC: "COOP Jednota Žarnovica"
}

json.forEach(location => {
    geojson.features.push({
        type: "Feature",
        properties: {
            name: "COOP Jednota",
            brand: "COOP Jednota",
            "brand:wikidata": "Q41629254",

            ...(location[0] === 2 ? supermarket : location[0] === 3 ? tempo : potraviny),
            operator: operators[location[16]],
            
            "contact:phone": tryToParsePhoneNumber(location[12]) || undefined,
            
            opening_hours: formatOpeningHours({
                Mo: location[2].toLowerCase().replace("zatvorené", "off"),
                Tu: location[3].toLowerCase().replace("zatvorené", "off"),
                We: location[4].toLowerCase().replace("zatvorené", "off"),
                Th: location[5].toLowerCase().replace("zatvorené", "off"),
                Fr: location[6].toLowerCase().replace("zatvorené", "off"),
                Sa: location[7].toLowerCase().replace("zatvorené", "off"),
                Su: location[8].toLowerCase().replace("zatvorené", "off")
            })
        },
        geometry: {
            coordinates: [
                +location[10].trim(),
                +location[9].trim()
            ],
            type: "Point"
        }
    })
});

Deno.writeTextFileSync("output.geojson", JSON.stringify(geojson, null, 4));

function tryToParsePhoneNumber(phoneNumber) {
    return phoneNumber.replaceAll("-", ",").replace("  ", ",").replace(/[^\d](?=(\d{1,3} *\/)|(\+421))/g, ",").split(",").filter(x => x.trim().length > 5).map(x => parsePhoneNumber(x, { regionCode: "SK" } )?.number?.e164).filter(x => !!x).join(";");
}