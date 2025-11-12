document.addEventListener("DOMContentLoaded", () => {
    const page = window.location.pathname;

    if (page.includes("shop.html")) {
        fetchKnackData("object_1"); // Replace with your shop object key
    } else if (page.includes("index.html")) {
        fetchKnackData("object_2"); // Replace with your featured products object key
    }
});

function fetchKnackData(objectKey) {
    const APP_ID = "6911ca72c30aaf028507d3da"; // Replace with your Knack App ID
    const API_KEY = "34257797-9b9a-41d5-8e9d-2756212cb490"; // Replace with your Knack API Key

    fetch(`https://api.knack.com/v1/objects/${objectKey}/records`, {
        method: "GET",
        headers: {
            "X-Knack-Application-Id": APP_ID,
            "X-Knack-REST-API-Key": API_KEY,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => displayData(data.records))
    .catch(error => console.error("Error fetching Knack data:", error));
}

function displayData(records) {
    const container = document.getElementById("dataContainer");
    container.innerHTML = ""; // Clear previous data

    if (!records || records.length === 0) {
        container.innerHTML = "<p>No data found.</p>";
        return;
    }

    records.forEach(record => {
        const div = document.createElement("div");
        div.className = "record";
        // Replace field_1 and field_2 with your actual field keys
        div.innerHTML = `
            <strong>${record.field_1 || "No Name"}</strong><br>
            ${record.field_2 || "No Description"}
        `;
        container.appendChild(div);
    });
}
