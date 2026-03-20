const pool = require("../db");

exports.asignarVendedorRobin = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Buscamos al que tiene la fecha más vieja
    // Agregamos AND telefono IS NOT NULL para evitar errores
    const empleadoQuery = await client.query(`
      SELECT id, nombre, telefono 
      FROM empleados 
      WHERE activo = true 
      AND telefono IS NOT NULL 
      AND telefono != ''
      ORDER BY ultimo_asignado_at ASC NULLS FIRST 
      LIMIT 1
      FOR UPDATE
    `);

    if (empleadoQuery.rows.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ mensaje: "No hay asesores con teléfono configurado." });
    }

    const v = empleadoQuery.rows[0];

    // 2. Actualizamos la fecha (IMPORTANTE: Nombre exacto de tu columna)
    await client.query(
      `UPDATE empleados 
       SET ultimo_asignado_at = clock_timestamp() AT TIME ZONE 'America/Guayaquil', 
           ultima_consulta_at = clock_timestamp() AT TIME ZONE 'America/Guayaquil' 
       WHERE id = $1`,
      [v.id],
    );

    // 3. Insertar interacción
    await client.query(
      `INSERT INTO interacciones (empleado_id, canal, fecha) 
       VALUES ($1, $2, clock_timestamp() AT TIME ZONE 'America/Guayaquil')`,
      [v.id, "whatsapp"],
    );

    await client.query("COMMIT");

    console.log(`✅ Turno asignado a: ${v.nombre}`);
    res.json({ nombre: v.nombre, telefono: v.telefono });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("ERROR EN ROBIN:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  } finally {
    client.release();
  }
};

// ... (Aquí dejas tu función obtenerEstadisticas exactamente como estaba)
/**
 * 2. OBTENER ESTADÍSTICAS (Mantenemos tu lógica intacta)
 */
exports.obtenerEstadisticas = async (req, res) => {
  try {
    // Definimos qué es "HOY" para Ecuador explícitamente
    const hoyEcuador =
      "(clock_timestamp() AT TIME ZONE 'America/Guayaquil')::date";

    // A. Clicks por Asesor
    const statsRes = await pool.query(`
      SELECT 
        e.nombre, 
        COUNT(i.id)::int as clicks
      FROM empleados e
      LEFT JOIN interacciones i ON e.id = i.empleado_id 
        AND i.fecha::date = ${hoyEcuador}
      WHERE e.activo = true
      GROUP BY e.id, e.nombre
      ORDER BY clicks DESC
    `);

    // B. Consulta Horaria
    const horarioRes = await pool.query(`
      SELECT 
        EXTRACT(HOUR FROM (fecha AT TIME ZONE 'America/Guayaquil'))::int AS hora, 
        COUNT(id)::int AS cantidad
      FROM interacciones
      WHERE fecha::date = ${hoyEcuador}
      GROUP BY hora
      ORDER BY hora ASC
    `);

    const dataAsesores = statsRes.rows;
    const totalConsultas = dataAsesores.reduce(
      (acc, curr) => acc + curr.clicks,
      0,
    );

    res.json({
      totalConsultas: totalConsultas,
      clicksPorAsesor: dataAsesores,
      interaccionesPorHora: horarioRes.rows,
    });
  } catch (error) {
    console.error("Error al cargar estadísticas:", error);
    res.status(500).json({ mensaje: "Error al generar reportes" });
  }
};
