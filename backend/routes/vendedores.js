const express = require("express");
const router = express.Router();
const vendedoresController = require("../controllers/vendedoresController");

/**
 * --- RUTAS DE GESTIÓN DE ASESORES (ROUND ROBIN) ---
 */

// 1. ASIGNAR ASESOR (CADA CLIC EN WHATSAPP)
// Cambiado a POST para poder recibir la lista de productos en el body
router.post("/asignar", vendedoresController.asignarVendedorRobin);

// 2. OBTENER ESTADÍSTICAS PARA EL ADMIN
// Esta ruta alimenta los gráficos de barras verdes y amarillas
router.get("/stats", vendedoresController.obtenerEstadisticas);

/**
 * --- RUTAS DE CRUD (OPCIONAL/SI LAS TIENES) ---
 * Asegúrate de que los nombres coincidan con tu controlador
 */

// Si tienes un CRUD para el Admin, se vería algo así:
// router.get('/', vendedoresController.getVendedores);
// router.post('/', vendedoresController.createVendedor);
// router.put('/:id', vendedoresController.updateVendedor);
// router.delete('/:id', vendedoresController.deleteVendedor);

module.exports = router;
