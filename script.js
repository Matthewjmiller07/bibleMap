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
        // Fetch and display locations from KML for the verse if needed
    } catch (error) {
        console.error('Error fetching text:', error);
    }
}

function displayText(data) {
    const resultDiv = document.getElementById('textResult');
    resultDiv.innerHTML = `<h2>${data.book}</h2><p>${data.text.join('<br>')}</p>`;
    // Additional code to handle other data fields
}

// Function to handle KML file and display locations
// This will depend on the format of your KML file and how it correlates with the verses
