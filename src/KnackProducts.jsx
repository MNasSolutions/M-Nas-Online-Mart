import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const OBJECT_KEY = "object_2"; // Featured products

export default function KnackProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fnError } = await supabase.functions.invoke('knack-proxy', {
          body: { objectKey: OBJECT_KEY }
        });

        if (fnError) {
          console.error("Error fetching Knack data:", fnError);
          setError("Failed to load products");
          return;
        }

        setProducts(data?.records || []);
      } catch (err) {
        console.error("Error fetching Knack data:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (name, price, image) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price, image });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading products...</div>;
  }

  if (error) {
    return <div className="flex justify-center p-8 text-destructive">{error}</div>;
  }

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
