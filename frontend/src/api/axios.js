import axios from "axios";

const api = axios.create({
  // Dejamos la base solo hasta el puerto.
  // Así en el Home usas api.get("/api/productos") y funciona perfecto.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
