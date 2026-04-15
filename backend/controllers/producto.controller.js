const pool = require("../db");
const {
  fetchCategoriasContifico,
  fetchProductosContifico,
} = require("../services/contifico.service");

// --- 1. LÓGICA DE SINCRONIZACIÓN ---
const ejecutarSincronizacionFisica = async () => {
  // Capturamos la hora exacta del inicio
  const horaInicio = new Date().toLocaleString("es-EC", {
    timeZone: "America/Guayaquil",
  });
  console.log(`\n[${horaInicio}] 🔄 Iniciando sincronización automática...`);

  const [categoriasAPI, productosAPI] = await Promise.all([
    fetchCategoriasContifico(),
    fetchProductosContifico(),
  ]);

  // 1. Mapa de Categorías
  const mapaCategorias = {};
  for (const cat of categoriasAPI) {
    if (cat.tipo_producto === "PROD") {
      const resCat = await pool.query(
        `INSERT INTO categorias (nombre, contifico_id) 
         VALUES ($1, $2) 
         ON CONFLICT (contifico_id) 
         DO UPDATE SET nombre = EXCLUDED.nombre 
         RETURNING id`,
        [cat.nombre.toUpperCase(), cat.id],
      );
      if (resCat.rows.length > 0) {
        mapaCategorias[cat.id] = resCat.rows[0].id;
      }
    }
  }

  // 2. Sincronizar Productos (Filtro Activos 'A')
  let contador = 0;
  for (const prod of productosAPI) {
    // Si el estado es 'I', lo borramos de nuestra DB
    if (prod.estado === "I") {
      await pool.query(
        `DELETE FROM productos WHERE contifico_external_id = $1 OR nombre = $2`,
        [prod.id, prod.nombre],
      );
      continue;
    }

    // Solo procesamos si el estado es exactamente 'A'
    if (prod.estado === "A") {
      const categoriaInternaId = mapaCategorias[prod.categoria_id] || null;
      const stockBruto =
        prod.cantidad_stock ?? prod.stock ?? prod.cantidad ?? 0;
      const stockEntero = Math.round(parseFloat(stockBruto));

      await pool.query(
        `INSERT INTO productos (nombre, stock, categoria_id, descripcion, contifico_external_id, estado)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (nombre) 
         DO UPDATE SET 
            stock = EXCLUDED.stock,
            categoria_id = EXCLUDED.categoria_id,
            descripcion = EXCLUDED.descripcion,
            contifico_external_id = EXCLUDED.contifico_external_id,
            estado = EXCLUDED.estado`,
        [
          prod.nombre,
          stockEntero,
          categoriaInternaId,
          prod.descripcion || "",
          prod.id,
          "activo",
        ],
      );
      contador++;
    }
  }

  // LOG FINAL EN CONSOLA
  const horaFin = new Date().toLocaleString("es-EC", {
    timeZone: "America/Guayaquil",
  });
  console.log(
    `[${horaFin}] ✅ ÉXITO: Se sincronizaron ${contador} productos activos.\n`,
  );

  return contador;
};

// --- 2. CONTROLADOR ---
const sincronizarTodo = async (req, res) => {
  try {
    const contador = await ejecutarSincronizacionFisica();
    res.json({
      success: true,
      message: `Sincronización lista: ${contador} productos en catálogo.`,
    });
  } catch (error) {
    const horaError = new Date().toLocaleString("es-EC", {
      timeZone: "America/Guayaquil",
    });
    console.error(`[${horaError}] ❌ Error en sincronización:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sincronizarTodo, ejecutarSincronizacionFisica };
