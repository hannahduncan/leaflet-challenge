var map = L.map("map", {
    center: [33.8366, -117.9143],
    zoom: 5
});

// Adding tile layer
var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(map);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function(data) {

    function colorPicker(depth) {
        if (depth<5) {
            color = "green"
        }
        else if (depth>5 && depth<10) {
            color = "yellow"
        }
        else {
            color = "red"
        }
        return color
    };

    var features = data.features
    var mags = []
    var coordinates = []
    var depths = []

    for (var i=0; i<features.length; i++) {
        mags.push(features[i].properties.mag)
        coordinates.push(features[i].geometry.coordinates.slice(0,2).reverse())
        depths.push(features[i].geometry.coordinates[2])
    }

    for (var i=0; i<coordinates.length; i++) {
            L.circle(coordinates[i], {
            color: colorPicker(depths[i]),
            fillColor: colorPicker(depths[i]),
            fillOpacity: .8,
            radius: mags[i] * 10000
        }).bindPopup(
            `<p> Magnitude: ${mags[i]} <br>
            Location: (${coordinates[i]}) <br>
            Depth: ${depths[i]} </p>`).addTo(map);
    };
    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = [0, 5, 10];
        var colors = ["green","yellow","red"]
        var labels = [];

        // Add min & max
        var legendInfo = "<h1>Earthquake Depths</h1>" +
        "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
        // colors.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding legend to the map
    legend.addTo(map);
    
})