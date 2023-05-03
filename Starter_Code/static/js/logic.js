// Creating our initial map object:
var myMap = L.map("map", {
    center: [10, 0],
    zoom: 2.5
});

// Adding a tile layer (the background map image) to the map:
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Link to get the GeoJSON data.
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Getting our GeoJSON data
d3.json(url).then(function (data) {
    eqfeatures = data.features

    function markerSize(mag) {
        return mag * 45000;
    }

    // define depth and color scale
    var depth = [-10, 10, 30, 50, 70, 90],
        colors = ['#FFEDA0', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026'];

    function markerColor(eqDepth) {
        if (eqDepth <= depth[1]) { return colors[0]; }
        else if (eqDepth <= depth[2]) { return colors[1]; }
        else if (eqDepth <= depth[3]) { return colors[2]; }
        else if (eqDepth <= depth[4]) { return colors[3]; }
        else if (eqDepth <= depth[5]) { return colors[4]; }
        else { return colors[5]; }
    }

    // Loop through the data.
    for (var i = 0; i < eqfeatures.length; i++) {

        // Set the data location property to a variable.
        var location = eqfeatures[i].geometry;

        // Check for the location property.
        if (location) {

            // Create a circle, and pass in some initial options.
            (L.circle([location.coordinates[1], location.coordinates[0]], {
                color: markerColor(location.coordinates[2]),
                fillColor: markerColor(location.coordinates[2]),
                fillOpacity: 0.9,
                radius: markerSize(eqfeatures[i].properties.mag),
                title: `Earthquake record at ${eqfeatures[i].properties.place}`
            }).bindPopup(`Location: ${eqfeatures[i].properties.place}<br> Earthquake Magnitude: ${eqfeatures[i].properties.mag}<br> Earthquake Depth: ${location.coordinates[2]}`)).addTo(myMap)
        }
    }


    // Set up the legend.
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');

        for (var i = 0; i < colors.length-1; i++) {
            div.innerHTML += '<i style="background-color:' + colors[i] + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    
    // Adding the legend to the map
    legend.addTo(myMap);

});


