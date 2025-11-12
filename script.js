document.getElementById("loadData").addEventListener("click", function() {
    const APP_ID = "6911ca72c30aaf028507d3da";
    const API_KEY = "34257797-9b9a-41d5-8e9d-2756212cb490";
    const OBJECT_KEY = "object_1"; // Replace with your Knack object key

    fetch(`https://api.knack.com/v1/objects/${OBJECT_KEY}/records`, {
        method: "GET",
        headers: {
            "X-Knack-Application-Id": APP_ID,
            "X-Knack-REST-API-Key": API_KEY,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => console.log("Knack Data:", data))
    .catch(error => console.error("Error fetching Knack data:", error));
});
