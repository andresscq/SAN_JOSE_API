const express = require("express");
const router = express.Router();
const pool = require("../db");
const cron = require("node-cron"); // Necesario para el auto-apagado

// =========================================================
// TAREA AUTOMÁTICA (CRON): Gestión de Estados por Horario
// Se ejecuta cada minuto para revisar si hay que encender/apagar
// =========================================================
cron.schedule("* * * * *", async () => {
  try {
    const configRes = await pool.query(
      "SELECT * FROM configuracion_sistema WHERE id = 1",
    );
    if (configRes.rowCount === 0) return;

    const { hora_apertura, hora_cierre } = configRes.rows[0];

    // Hora actual en Ecuador (formato HH:MM)
    const ahoraEcuador = new Date()
      .toLocaleTimeString("en-GB", {
        timeZone: "America/Guayaquil",
        hour12: false,
      })
      .slice(0, 5);

    const aperturaRecortada = hora_apertura.slice(0, 5);
    const cierreRecortado = hora_cierre.slice(0, 5);

    // 1. AUTO-APAGADO: Si es exactamente la hora de cierre
    if (ahoraEcuador === cierreRecortado) {
      await pool.query(
        "UPDATE empleados SET activo = false WHERE activo = true",
      );
      console.log(
        `[SISTEMA] Horario cumplido (${ahoraEcuador}). Vendedores desactivados.`,
      );
    }

    // 2. AUTO-ENCENDIDO (Opcional): Si es la hora de apertura
    if (ahoraEcuador === aperturaRecortada) {
      await pool.query("UPDATE empleados SET activo = true");
      console.log(
        `[SISTEMA] Iniciando jornada (${ahoraEcuador}). Vendedores activados.`,
      );
    }
  } catch (err) {
    console.error("Error en el cron de horarios:", err.message);
  }
});

// 1. OBTENER TODOS LOS EMPLEADOS
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
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// 2. CREAR UN NUEVO EMPLEADO
router.post("/", async (req, res) => {
  const { nombre, telefono } = req.body;
  if (!nombre || !telefono) {
    return res.status(400).json({ error: "Nombre y teléfono obligatorios" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO empleados (nombre, telefono) VALUES ($1, $2) RETURNING *",
      [nombre, telefono],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "No se pudo crear el empleado" });
  }
});

// 3. ACTUALIZAR UN EMPLEADO
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, activo } = req.body;
  try {
    const result = await pool.query(
      "UPDATE empleados SET nombre = $1, telefono = $2, activo = $3 WHERE id = $4 RETURNING *",
      [nombre, telefono, activo, id],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "No encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

// 4. ELIMINAR UN EMPLEADO
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM empleados WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Empleado eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

// 5. CONFIGURACIÓN GLOBAL
router.get("/configuracion", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM configuracion_sistema WHERE id = 1",
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener configuración" });
  }
});

router.put("/config/update", async (req, res) => {
  const { hora_apertura, hora_cierre, whatsapp_central } = req.body;
  try {
    const result = await pool.query(
      `UPDATE configuracion_sistema 
       SET hora_apertura = $1, hora_cierre = $2, whatsapp_central = $3 
       WHERE id = 1 RETURNING *`,
      [hora_apertura, hora_cierre, whatsapp_central],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar configuración" });
  }
});

// 6. RUTA MAESTRA (ROUND ROBIN)
router.get("/siguiente-turno", async (req, res) => {
  try {
    const configRes = await pool.query(
      "SELECT * FROM configuracion_sistema WHERE id = 1",
    );
    const { hora_apertura, hora_cierre, whatsapp_central } = configRes.rows[0];

    // Hora actual estricta de Ecuador para la validación
    const ahoraEcuador = new Date().toLocaleTimeString("en-GB", {
      timeZone: "America/Guayaquil",
      hour12: false,
    });

    // Validación de horario
    const estaEnHorario =
      ahoraEcuador >= hora_apertura && ahoraEcuador <= hora_cierre;

    if (!estaEnHorario) {
      return res.json({
        nombre: "Atención Central San José",
        telefono: whatsapp_central,
        fueraDeHorario: true,
        mensaje: `Horario finalizado. Atendemos de ${hora_apertura.slice(0, 5)} a ${hora_cierre.slice(0, 5)}.`,
      });
    }

    // Buscar asesor activo
    const queryAsesor = `
      SELECT id, nombre, telefono 
      FROM empleados 
      WHERE activo = true 
      ORDER BY ultima_consulta_at ASC NULLS FIRST 
      LIMIT 1
    `;

    const result = await pool.query(queryAsesor);

    if (result.rowCount === 0) {
      return res.json({
        nombre: "Atención Central San José",
        telefono: whatsapp_central,
        fueraDeHorario: true,
        mensaje: "No hay asesores activos disponibles en este momento.",
      });
    }

    const asesor = result.rows[0];
    await pool.query(
      "UPDATE empleados SET ultima_consulta_at = NOW() WHERE id = $1",
      [asesor.id],
    );

    res.json({ ...asesor, fueraDeHorario: false });
  } catch (err) {
    console.error("Error en Round Robin:", err.message);
    res.status(500).json({ error: "Error al asignar asesor" });
  }
});

module.exports = router;
