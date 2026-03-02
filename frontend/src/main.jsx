import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HashRouter } from "react-router-dom"; // Cambiamos esto

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      {" "}
      {/* Usar HashRouter en lugar de BrowserRouter */}
      <App />
    </HashRouter>
  </React.StrictMode>,
);
