const pool = require("../db");
const {
  fetchCategoriasContifico,
  fetchProductosContifico,
} = require("../services/contifico.service");

// --- 1. LÓGICA PURA (Independiente de Express) ---
// Esta es la función que el Cron Job y el Controlador llamarán
const ejecutarSincronizacionFisica = async () => {
  console.log("🔄 Iniciando sincronización de Distribuidora San José...");

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

  // 2. Sincronizar Productos
  let contador = 0;
  for (const prod of productosAPI) {
    const categoriaInternaId = mapaCategorias[prod.categoria_id] || null;
    const stockBruto = prod.cantidad_stock ?? prod.stock ?? prod.cantidad ?? 0;
    const stockEntero = Math.round(parseFloat(stockBruto));

    await pool.query(
      `INSERT INTO productos (nombre, stock, categoria_id, descripcion, contifico_external_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (nombre) 
       DO UPDATE SET 
          stock = EXCLUDED.stock,
          categoria_id = EXCLUDED.categoria_id,
          descripcion = EXCLUDED.descripcion,
          contifico_external_id = EXCLUDED.contifico_external_id`,
      [
        prod.nombre,
        stockEntero,
        categoriaInternaId,
        prod.descripcion || "",
        prod.id,
      ],
    );
    contador++;
  }

  return contador; // Devolvemos el total para usarlo en los logs o respuestas
};

// --- 2. CONTROLADOR PARA LA RUTA API ---
const sincronizarTodo = async (req, res) => {
  try {
    const contador = await ejecutarSincronizacionFisica();

    console.log(`✅ Sincronización exitosa: ${contador} productos procesados.`);

    res.json({
      success: true,
      message: `Sincronización lista: ${contador} productos actualizados (Stock en números enteros).`,
    });
  } catch (error) {
    console.error("❌ Error en el controlador:", error.message);
    res.status(500).json({
      error: "Error al sincronizar con la base de datos",
      detalle: error.message,
    });
  }
};

// --- 3. EXPORTACIÓN DE AMBAS ---
module.exports = {
  sincronizarTodo,
  ejecutarSincronizacionFisica,
};


