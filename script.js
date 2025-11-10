const APP_ID = "6911ca72c30aaf028507d3da";       // replace with your Knack App ID
const API_KEY = "34257797-9b9a-41d5-8e9d-2756212cb490";     // replace with your Knack API Key
const url = "https://api.knack.com/v1/objects/object_1/records"; // your products object key

fetch(url, {
  method: "GET",
  headers: {
    "X-Knack-Application-Id": 6911ca72c30aaf028507d3da,
    "X-Knack-REST-API-Key": 34257797-9b9a-41d5-8e9d-2756212cb490,
    "Content-Type": "application/json"
  }
})
.then(res => res.json())
.then(data => {
  const container = document.getElementById("productsContainer");
  data.records.forEach(product => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${product.field_1}</h3>      <!-- product name -->
      <p>Price: ${product.field_2}</p>  <!-- product price -->
    `;
    container.appendChild(div);
  });
})
.catch(err => console.error(err));
