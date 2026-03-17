import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; // ✅ 1. Importar el proveedor

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        {" "}
        {/* ✅ 2. Envolver la App */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
