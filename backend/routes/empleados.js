const express = require("express");
const router = express.Router();
const pool = require("../db");

// 1. OBTENER TODOS LOS EMPLEADOS
// Simplificado: Ya no necesitamos el JOIN con sedes aquí porque la sede es la que apunta al empleado
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre, telefono, activo, ultima_consulta_at 
      FROM empleados 
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener empleados:", err.message);
    res
      .status(500)
      .json({ error: "Error en el servidor al obtener empleados" });
  }
});

// 2. CREAR UN NUEVO EMPLEADO (Versión Limpia)
router.post("/", async (req, res) => {
  const { nombre, telefono } = req.body;

  if (!nombre || !telefono) {
    return res
      .status(400)
      .json({ error: "Nombre y teléfono son obligatorios" });
  }

  try {
    // Solo insertamos datos personales. El estado 'activo' es true por defecto en DB
    const result = await pool.query(
      "INSERT INTO empleados (nombre, telefono) VALUES ($1, $2) RETURNING *",
      [nombre, telefono],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear empleado:", err.message);
    res.status(500).json({ error: "No se pudo crear el empleado" });
  }
});

// 3. ACTUALIZAR UN EMPLEADO EXISTENTE
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, activo } = req.body;

  try {
    const result = await pool.query(
      `UPDATE empleados 
       SET nombre = $1, telefono = $2, activo = $3 
       WHERE id = $4 
       RETURNING *`,
      [nombre, telefono, activo, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar empleado:", err.message);
    res.status(500).json({ error: "Error al actualizar los datos" });
  }
});

// 4. ELIMINAR UN EMPLEADO
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Nota: Si el empleado está asignado a una sede,
    // asegúrate de que en tu DB la relación sea ON DELETE SET NULL
    const result = await pool.query("DELETE FROM empleados WHERE id = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    res.json({ message: "Empleado eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar empleado:", err.message);
    res.status(500).json({ error: "Error de servidor al eliminar" });
  }
});

// 5. RUTA ESPECIAL: OBTENER PRÓXIMO ASESOR (Round Robin)
// Esta es la que usarás para el botón de "Contacto General"
router.get("/siguiente-turno", async (req, res) => {
  try {
    // Buscamos al empleado activo que más tiempo lleve sin atender (NULLS FIRST)
    const result = await pool.query(`
      SELECT id, nombre, telefono 
      FROM empleados 
      WHERE activo = true 
      ORDER BY ultima_consulta_at ASC NULLS FIRST 
      LIMIT 1
    `);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No hay asesores activos" });
    }

    const asesor = result.rows[0];

    // Actualizamos su marca de tiempo para que pase al final de la cola
    await pool.query(
      "UPDATE empleados SET ultima_consulta_at = NOW() WHERE id = $1",
      [asesor.id],
    );

    res.json(asesor);
  } catch (err) {
    console.error("Error en Round Robin:", err.message);
    res.status(500).json({ error: "Error al asignar asesor" });
  }
});

module.exports = router;
