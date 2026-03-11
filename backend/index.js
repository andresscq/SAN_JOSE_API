const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const fs = require("fs"); // Añadido para verificar carpetas
require("dotenv").config();

const app = express();

// --- 1. CONFIGURACIÓN DE MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- 2. ACCESO PÚBLICO A ARCHIVOS ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 3. CONFIGURACIÓN DE POSTGRESQL ---
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// --- NUEVO: ASEGURAR QUE LAS CARPETAS EXISTAN ---
const carpetas = ["uploads/hojas_de_vida", "uploads/catalogos"];
carpetas.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// --- 4. CONFIGURACIÓN DE MULTER ---

// Almacenamiento para Postulantes (CVs)
const storageCV = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/hojas_de_vida/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

// Almacenamiento para Proveedores (Catálogos)
const storageCat = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/catalogos/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `CAT-${uniqueSuffix}-${file.originalname}`);
  },
});

const uploadCV = multer({
  storage: storageCV,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Solo se permiten archivos PDF"), false);
  },
});

const uploadCat = multer({
  storage: storageCat,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Solo se permiten archivos PDF"), false);
  },
});

// --- RUTA DE LOGIN ---
app.post("/api/login", async (req, res) => {
  const { email, password, rol } = req.body;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = result.rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    if (rol && usuario.rol !== rol) {
      return res.status(403).json({
        error: `Acceso denegado. Esta cuenta es de tipo ${usuario.rol}.`,
      });
    }

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// --- 5. RUTAS DE RECLUTAMIENTO ---

app.post("/api/postular", uploadCV.single("archivoPdf"), async (req, res) => {
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

app.get("/api/postulantes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM postulantes ORDER BY id DESC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener candidatos" });
  }
});

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

app.delete("/api/postulantes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM postulantes WHERE id = $1", [id]);
    res.json({ message: "Candidato eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

// --- NUEVO: RUTA PARA PERFIL DE PROVEEDOR ---

app.post(
  "/api/perfil-proveedor",
  uploadCat.single("catalogo"),
  async (req, res) => {
    const { usuario_id, nombre_empresa, ruc, telefono_corporativo } = req.body;
    const catalogo_url = req.file ? req.file.path : null;

    try {
      const query = `
      INSERT INTO proveedores (usuario_id, nombre_empresa, ruc, telefono_corporativo, catalogo_url)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (usuario_id) 
      DO UPDATE SET 
        nombre_empresa = EXCLUDED.nombre_empresa,
        ruc = EXCLUDED.ruc,
        telefono_corporativo = EXCLUDED.telefono_corporativo,
        catalogo_url = COALESCE(EXCLUDED.catalogo_url, proveedores.catalogo_url);
    `;
      await pool.query(query, [
        usuario_id,
        nombre_empresa,
        ruc,
        telefono_corporativo,
        catalogo_url,
      ]);
      res.json({ message: "Perfil corporativo actualizado correctamente" });
    } catch (err) {
      console.error("Error al actualizar perfil proveedor:", err.message);
      res
        .status(500)
        .json({ error: "Error al actualizar perfil de proveedor" });
    }
  },
);

// --- 6. RUTAS DE PRODUCTOS ---

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

// --- RUTA DE REGISTRO ---
app.post("/api/registro", async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const rolFinal = rol || "postulante";

    const resultUsuario = await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol",
      [nombre, email, hashedPassword, rolFinal],
    );

    const nuevoUsuario = resultUsuario.rows[0];
    const nuevoId = nuevoUsuario.id;

    if (rolFinal === "postulante") {
      await pool.query(
        "INSERT INTO postulantes (nombre, usuario_id, estado) VALUES ($1, $2, $3)",
        [nombre, nuevoId, "Pendiente"],
      );
      console.log(`✅ Postulante vinculado con ID de usuario: ${nuevoId}`);
    } else if (rolFinal === "proveedor") {
      await pool.query(
        "INSERT INTO proveedores (usuario_id, nombre_empresa) VALUES ($1, $2)",
        [nuevoId, nombre],
      );
      console.log(`✅ Proveedor vinculado con ID de usuario: ${nuevoId}`);
    }

    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.error("Error en registro:", err.message);
    if (err.code === "23505") {
      return res.status(400).json({ error: "Este correo ya está registrado" });
    }
    res.status(500).json({ error: "Error al crear la cuenta" });
  }
});

// --- 7. ENCENDER SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SERVIDOR EJECUTÁNDOSE EN: http://localhost:${PORT}`);
});
