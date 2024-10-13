// Create a map object centered on America
var map = L.map('map').setView([37.0902, -95.7129], 4);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Determine marker size based on magnitude
function getMarkerSize(magnitude) {
    return magnitude * 5; // Adjust the multiplier as needed
}

// Determine marker color based on depth, red for deep and green for shallow
function getColor(depth) {
    return depth > 100 ? '#FF0000' :
           depth > 50  ? '#FFA500' :
           depth > 10  ? '#FFFF00' :
                         '#00FF00'; 
}

// Fetch earthquake GeoJSON data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson')
    .then(response => response.json())
    .then(data => {
        // Loop through each feature in the data
        data.features.forEach(feature => {
            var coords = feature.geometry.coordinates;
            var magnitude = feature.properties.mag;
            var depth = coords[2];
            var markerSize = getMarkerSize(magnitude);
            var markerColor = getColor(depth);

            // Create a marker for each earthquake
            var marker = L.circleMarker([coords[1], coords[0]], {
                radius: markerSize,
                fillColor: markerColor,
                color: markerColor,
                fillOpacity: 0.5,
                stroke: false
            }).addTo(map);

            // Create a popup that provides additional information about the earthquake when its associated marker is clicked
            marker.bindPopup(`<strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`);
        });

        // Create a legend
        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function () {
            var div = L.DomUtil.create('div', 'info legend');
            var depths = [0, 10, 50, 100];
            var labels = [];

            // Loop through depth intervals and generate a label
            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
            }
            return div;
        };

        legend.addTo(map);
    });
 