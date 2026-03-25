const pool = require("../db");

/**
 * 1. ASIGNAR VENDEDOR (ROUND ROBIN) Y REGISTRAR PRODUCTOS
 */
exports.asignarVendedorRobin = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // A. Buscar el asesor que más tiempo lleva sin recibir un turno
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
      return res.status(404).json({ mensaje: "No hay asesores configurados." });
    }

    const v = empleadoQuery.rows[0];

    // B. Actualizar marca de tiempo del asesor (Ecuador)
    await client.query(
      `UPDATE empleados 
       SET ultimo_asignado_at = clock_timestamp() AT TIME ZONE 'America/Guayaquil', 
           ultima_consulta_at = clock_timestamp() AT TIME ZONE 'America/Guayaquil' 
       WHERE id = $1`,
      [v.id],
    );

    // C. Registrar la interacción general del asesor
    await client.query(
      `INSERT INTO interacciones (empleado_id, canal, fecha) 
       VALUES ($1, $2, clock_timestamp() AT TIME ZONE 'America/Guayaquil')`,
      [v.id, "whatsapp"],
    );

    // D. Registrar productos consultados (si vienen en el body)
    const { items } = req.body;
    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO interacciones_productos (producto_id, nombre_producto, categoria, fecha) 
           VALUES ($1, $2, $3, clock_timestamp() AT TIME ZONE 'America/Guayaquil')`,
          [item.id || null, item.nombre, item.categoria || "General"],
        );
      }
    }

    await client.query("COMMIT");
    console.log(`✅ Turno: ${v.nombre}`);
    res.json({ nombre: v.nombre, telefono: v.telefono });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("ERROR EN ASIGNACIÓN:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  } finally {
    client.release();
  }
};

/**
 * 2. OBTENER ESTADÍSTICAS (MES, SEMANA, DÍA)
 */
exports.obtenerEstadisticas = async (req, res) => {
  try {
    // Definición de constantes de tiempo para PostgreSQL (Ecuador)
    const ahora = "(clock_timestamp() AT TIME ZONE 'America/Guayaquil')";
    const hoy = `${ahora}::date`;
    const hace7Dias = `${ahora} - INTERVAL '7 days'`;
    const hace30Dias = `${ahora} - INTERVAL '30 days'`;

    // A. RENDIMIENTO VENDEDORES (Rango: ÚLTIMOS 30 DÍAS)
    const statsRes = await pool.query(`
      SELECT 
        e.nombre, 
        COUNT(i.id)::int as clicks
      FROM empleados e
      LEFT JOIN interacciones i ON e.id = i.empleado_id 
        AND i.fecha >= ${hace30Dias}
      WHERE e.activo = true
      GROUP BY e.id, e.nombre
      ORDER BY clicks DESC
    `);

    // B. CONSULTA HORARIA (Rango: SOLO HOY)
    const horarioRes = await pool.query(`
      SELECT 
        EXTRACT(HOUR FROM (fecha AT TIME ZONE 'America/Guayaquil'))::int AS hora, 
        COUNT(id)::int AS cantidad
      FROM interacciones
      WHERE fecha::date = ${hoy}
      GROUP BY hora
      ORDER BY hora ASC
    `);

    // C. TOP 10 PRODUCTOS (Solo productos que EXISTEN en la tabla productos)
    // C. TOP 10 PRODUCTOS (Solo si existen y superan los 10 clicks)
    const productosRes = await pool.query(`
  SELECT 
    ip.nombre_producto, 
    ip.categoria,
    COUNT(*)::int as total_clicks
  FROM interacciones_productos ip
  INNER JOIN productos p ON ip.producto_id = p.id 
  WHERE ip.fecha >= ${hace7Dias}
  GROUP BY ip.nombre_producto, ip.categoria
  HAVING COUNT(*) > 10 -- 👈 FILTRO CRÍTICO: Solo entran al top si tienen más de 10 interacciones
  ORDER BY total_clicks DESC
  LIMIT 10
`);

    const dataAsesores = statsRes.rows;

    // El total acumulado que verá el admin en el KPI principal será el del MES
    const totalConsultasMes = dataAsesores.reduce(
      (acc, curr) => acc + curr.clicks,
      0,
    );

    res.json({
      totalConsultas: totalConsultasMes,
      clicksPorAsesor: dataAsesores, // El primero de esta lista es el Líder del Mes
      interaccionesPorHora: horarioRes.rows,
      productosPopulares: productosRes.rows,
    });
  } catch (error) {
    console.error("ERROR EN ESTADÍSTICAS:", error);
    res.status(500).json({ mensaje: "Error al generar reportes" });
  }
};
