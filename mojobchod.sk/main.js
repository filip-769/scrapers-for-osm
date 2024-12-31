import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.48";
import formatOpeningHours from "../formatOpeningHours.js";

const response = await fetch("https://www.mojobchod.sk/sxa/search/results??s=%7B0F3B38A3-7330-4544-B95B-81FC80A6BB6F%7D&v=%7BB8B34A56-8B36-413F-80FE-BD59F6E8C781%7D&p=2500&o=Title%252CAscending&g=");
const data = await response.json();

const geojson = {
    type: "FeatureCollection",
    features: data.Results.map(store => {
        const doc = new DOMParser().parseFromString(store.Html, "text/html");

        const days = {};

        doc.querySelectorAll(".day").forEach(el => {
            days[el.querySelector(".day-title").textContent] = el.querySelector(".day-hours").textContent.replace(" - ", "-");
        })

        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [store.Geospatial.Longitude, store.Geospatial.Latitude]
            },
            properties: {
                name: doc.querySelector(".sl-store-name").textContent.trim(),
                brand: "Môj obchod",
                "brand:wikidata": "Q126736496",
                website: "https://www.mojobchod.sk" + doc.querySelector(".btn-primary").getAttribute("href"),
                shop: "convenience",
                opening_hours: formatOpeningHours({
                    Mo: days["Pondelok"] || "off",
                    Tu: days["Utorok"] || "off",
                    We: days["Streda"] || "off",
                    Th: days["Štvrtok"] || "off",
                    Fr: days["Piatok"] || "off",
                    Sa: days["Sobota"] || "off",
                    Su: days["Nedela"] || "off"
                })
            }
        }
    })
}

Deno.writeTextFileSync("output.geojson", JSON.stringify(geojson, null, 4));