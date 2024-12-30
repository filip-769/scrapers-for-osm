const response = await fetch("https://cjnr.sk/wp-admin/admin-ajax.php?action=store_search&autoload=1");
const data = await response.json();

const geojson = {
    type: "FeatureCollection",
    features: data.map(store => ({
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [parseFloat(store.lng), parseFloat(store.lat)]
        },
        properties: {
            name: "COOP Jednota",
            brand: "COOP Jednota",
            "brand:wikidata": "Q41629254",
            website: store.permalink,
            "contact:phone": store.phone,
            operator: "COOP Jednota Nitra"
        }
    }))
}

Deno.writeTextFileSync("output.geojson", JSON.stringify(geojson, null, 4));