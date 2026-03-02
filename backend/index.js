const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE LA CONEXIÓN A POSTGRESQL ---
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // ssl: { rejectUnauthorized: false }, // Activar solo en producción (Render/Railway)
});

// --- RUTA DE PRUEBA ---
app.get("/", (req, res) => {
  res.send("Servidor de Distribuidora San José funcionando 🚀");
});

// --- RUTA PARA OBTENER PRODUCTOS ---
// Esta ruta alimenta tu Home.jsx
app.get("/api/productos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        nombre, 
        precio_unidad, 
        categoria, 
        nombre_sede, 
        telefono_vendedor
      FROM productos
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error en GET /api/productos:", err.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// --- RUTA PARA ACTUALIZAR PRECIOS ---
app.put("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { precio_unidad } = req.body;

  try {
    const result = await pool.query(
      "UPDATE productos SET precio_unidad = $1 WHERE id = $2 RETURNING *",
      [precio_unidad, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({
      message: "Precio actualizado correctamente",
      producto: result.rows[0],
    });
  } catch (err) {
    console.error("Error en PUT /api/productos:", err.message);
    res.status(500).json({ error: "Error en el servidor al actualizar" });
  }
});

// --- ENCENDER EL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ✅ SERVIDOR SAN JOSÉ CONECTADO
  📍 URL: http://localhost:${PORT}
  📁 API PRODUCTOS: http://localhost:${PORT}/api/productos
  `);
});
