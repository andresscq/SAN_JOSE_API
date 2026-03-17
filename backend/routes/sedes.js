const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 1. Asegurar carpeta de subida
const uploadDir = path.join(__dirname, "../uploads/sedes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/sedes/");
  },
  filename: (req, file, cb) => {
    cb(null, `sede-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// --- RUTAS API ---

// OBTENER SEDES (Con JOIN para ver qué empleado está asignado)
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT s.*, e.nombre as nombre_empleado, e.telefono as telefono_empleado
      FROM sedes s
      LEFT JOIN empleados e ON s.empleado_id = e.id
      ORDER BY s.id ASC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener sedes" });
  }
});

// CREAR SEDE (Cambiamos telefono_vendedor por empleado_id)
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const {
      nombre_sede,
      ubicacion,
      horario,
      empleado_id, // 👈 Nuevo campo
      google_maps_link,
    } = req.body;

    const imagen_url = req.file ? `/uploads/sedes/${req.file.filename}` : null;

    const result = await pool.query(
      "INSERT INTO sedes (nombre_sede, ubicacion, horario, empleado_id, google_maps_link, imagen_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        nombre_sede,
        ubicacion,
        horario,
        empleado_id || null, // Guardamos el ID del empleado
        google_maps_link,
        imagen_url,
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la sede" });
  }
});

// ACTUALIZAR SEDE
router.put("/:id", upload.single("imagen"), async (req, res) => {
  const { id } = req.params;
  const {
    nombre_sede,
    ubicacion,
    horario,
    empleado_id, // 👈 Nuevo campo
    google_maps_link,
  } = req.body;

  try {
    let query = `
      UPDATE sedes 
      SET nombre_sede = $1, ubicacion = $2, horario = $3, empleado_id = $4, google_maps_link = $5
    `;
    let params = [
      nombre_sede,
      ubicacion,
      horario,
      empleado_id || null,
      google_maps_link,
    ];

    if (req.file) {
      const imagen_url = `/uploads/sedes/${req.file.filename}`;
      query += ", imagen_url = $6 WHERE id = $7";
      params.push(imagen_url, id);
    } else {
      query += " WHERE id = $6";
      params.push(id);
    }

    const result = await pool.query(query, params);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Sede no encontrada" });

    res.json({ message: "Sede actualizada con éxito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar la sede" });
  }
});

// ELIMINAR SEDE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM sedes WHERE id = $1", [id]);
    res.json({ message: "Sede eliminada" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

module.exports = router;
