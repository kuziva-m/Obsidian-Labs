import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./lib/CartContext"; // 1. Import the Provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        {" "}
        {/* 2. WRAP APP HERE */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
