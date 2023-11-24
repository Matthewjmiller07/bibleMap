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
        displayLocations(data.book); // Now passing the book name to the function
    } catch (error) {
        console.error('Error fetching text:', error);
    }
}

function displayText(data) {
    const resultDiv = document.getElementById('textResult');
    resultDiv.innerHTML = `<h2>${data.book}</h2><p>${data.text.join('<br>')}</p>`;
}

let map;
function initMap() {
    map = L.map('map').setView([31.7683, 35.2137], 10); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map);
}

function displayLocations(book) {
    const kmlFile = book.replace(/\s+/g, '') + '.kml'; // Construct KML filename from the book name

    map.eachLayer(function(layer) {
        if (!!layer.toGeoJSON) {
            map.removeLayer(layer);
        }
    });

    const customLayer = omnivore.kml(kmlFile)
        .on('ready', function() {
            this.eachLayer(function(layer) {
                layer.addTo(map);
            });
            map.fitBounds(customLayer.getBounds());
        })
        .on('error', function() {
            console.log('Error loading KML:', kmlFile);
        });
}

document.addEventListener('DOMContentLoaded', initMap);
