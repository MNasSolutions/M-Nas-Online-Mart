// Replace these with your Knack credentials
const APP_ID = "6911ca72c30aaf028507d3da";
const API_KEY = "34257797-9b9a-41d5-8e9d-2756212cb490";

// Replace object_1 with your Products object key from Knack
const url = "https://api.knack.com/v1/objects/object_1/records";

// Fetch products from Knack
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
    div.classList.add("product-card");
    div.innerHTML = `
      <img src="${product.field_3}" alt="${product.field_1}"> <!-- field_3 = image URL -->
      <h3>${product.field_1}</h3> <!-- field_1 = product name -->
      <p>₦${product.field_2}</p> <!-- field_2 = price -->
    `;
    container.appendChild(div);
  });
})
.catch(err => console.error("Error fetching products:", err));
