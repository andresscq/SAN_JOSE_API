const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

// --- 1. CONFIGURACIÓN DE MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- 2. ACCESO PÚBLICO A ARCHIVOS ---
// Permite acceder a los PDFs desde el navegador (http://localhost:3000/uploads/...)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 3. CONFIGURACIÓN DE POSTGRESQL ---
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// --- 4. CONFIGURACIÓN DE MULTER (CARGA DE CVs) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/hojas_de_vida/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos PDF"), false);
    }
  },
});

// --- 5. RUTAS DE RECLUTAMIENTO (GESTIÓN DE TALENTO) ---

// POST: Recibir postulación
app.post("/api/postular", upload.single("archivoPdf"), async (req, res) => {
  const { nombre, edad, estudio, experiencia, telefono } = req.body;
  const hoja_de_vida_url = req.file ? req.file.path : null;

  try {
    const result = await pool.query(
      "INSERT INTO postulantes (nombre, edad, estudio, experiencia, hoja_de_vida_url, telefono, estado) VALUES ($1, $2, $3, $4, $5, $6, 'Pendiente') RETURNING *",
      [nombre, edad, estudio, experiencia, hoja_de_vida_url, telefono],
    );
    res.json({ message: "¡Postulación enviada!", postulante: result.rows[0] });
  } catch (err) {
    console.error("Error al postular:", err.message);
    res.status(500).json({ error: "Error al procesar la postulación" });
  }
});

// GET: Obtener lista de candidatos
app.get("/api/postulantes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM postulantes ORDER BY fecha DESC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener candidatos" });
  }
});

// PUT: Actualizar estado del candidato (Me interesa, Rechazado, etc)
app.put("/api/postulantes/:id/estado", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const result = await pool.query(
      "UPDATE postulantes SET estado = $1 WHERE id = $2 RETURNING *",
      [estado, id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});

// DELETE: Eliminar un candidato
app.delete("/api/postulantes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM postulantes WHERE id = $1", [id]);
    res.json({ message: "Candidato eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

// --- 6. RUTAS DE PRODUCTOS (INVENTARIO) ---

app.get("/api/productos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

app.put("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { precio_unidad } = req.body;
  try {
    const result = await pool.query(
      "UPDATE productos SET precio_unidad = $1 WHERE id = $2 RETURNING *",
      [precio_unidad, id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar precio" });
  }
});

// --- 7. ENCENDER SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SERVIDOR EJECUTÁNDOSE EN: http://localhost:${PORT}`);
});
