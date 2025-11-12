import React from "react";
import ReactDOM from "react-dom/client";
import KnackProducts from "./KnackProducts";
import ShopProducts from "./ShopProducts";
import Cart from "./Cart";
import Checkout from "./Checkout";

const page = window.location.pathname;

const App = () => {
  if (page.includes("shop")) return <ShopProducts />;
  if (page.includes("cart")) return <Cart />;
  if (page.includes("checkout")) return <Checkout />;
  return <KnackProducts />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <h1>M Nas Online Mart</h1>
    <App />
  </React.StrictMode>
);
