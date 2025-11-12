import { useEffect, useState } from "react";

const APP_ID = "6911ca72c30aaf028507d3da"; 
const API_KEY = "34257797-9b9a-41d5-8e9d-2756212cb490"; 
const OBJECT_KEY = "object_2"; // Featured products

export default function KnackProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`https://api.knack.com/v1/objects/${OBJECT_KEY}/records`, {
      method: "GET",
      headers: {
        "X-Knack-Application-Id": APP_ID,
        "X-Knack-REST-API-Key": API_KEY,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => setProducts(data.records || []))
      .catch(err => console.error("Error fetching Knack data:", err));
  }, []);

  const addToCart = (name, price, image) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price, image });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
      {products.length === 0 && <p>No products found.</p>}
      {products.map((item, index) => {
        const name = item.field_1 || "No Name";
        const price = item.field_2 ? `₦${item.field_2}` : "Price not available";
        const image = item.field_3 || "https://via.placeholder.com/200";
        return (
          <div key={index} style={{ border: "1px solid #ccc", width: "200px", textAlign: "center", padding: "10px" }}>
            <img src={image} alt={name} style={{ width: "100%", height: "auto" }} />
            <h3>{name}</h3>
            <p>{price}</p>
            <button onClick={() => addToCart(name, price, image)}>Add to Cart</button>
          </div>
        );
      })}
    </div>
  );
}
