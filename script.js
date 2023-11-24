document.getElementById('fetchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const reference = document.getElementById('reference').value;
    fetchText(reference);
});

async function fetchText(ref) {
    try {
        const response = await fetch(`http://www.sefaria.org/api/texts/${ref}`);
        const data = await response.json();
        displayText(data);
        displayLocations(ref); // Call to display locations related to the reference
    } catch (error) {
        console.error('Error fetching text:', error);
    }
}

function displayText(data) {
    const resultDiv = document.getElementById('textResult');
    resultDiv.innerHTML = `<h2>${data.book}</h2><p>${data.text.join('<br>')}</p>`;
    // Additional code to handle other data fields
}

// Initialize the map using Leaflet
let map;
function initMap() {
    map = L.map('map').setView([31.7683, 35.2137], 10); // Example coordinates (Jerusalem)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map);
}

// Function to display locations from the KML file
function displayLocations(ref) {
    const kmlFile = 'gen.kml'; // Path to your KML file

    // Clear previous layers
    map.eachLayer(function(layer) {
        if (!!layer.toGeoJSON) {
            map.removeLayer(layer);
        }
    });

    // Add new layer from KML
    const customLayer = omnivore.kml(kmlFile)
        .on('ready', function() {
            // Example: Display all locations from KML
            // Implement logic here to filter locations based on the ref
            this.eachLayer(function(layer) {
                layer.addTo(map);
            });
            map.fitBounds(customLayer.getBounds());
        })
        .on('error', function() {
            console.log('Error loading KML');
        });
}

document.addEventListener('DOMContentLoaded', initMap);
