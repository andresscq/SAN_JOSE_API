const cron = require("node-cron");
// Importamos la función lógica que ya creamos en el controlador
// (Asegúrate de que la ruta sea correcta según tu carpeta)
// Asegúrate de incluir el punto entre producto y controller
const {
  ejecutarSincronizacionFisica,
} = require("../controllers/producto.controller");

const sincronizarContifico = async () => {
  console.log(
    "--- 🔄 Iniciando Sincronización Automática: Contífico -> PostgreSQL ---",
  );
  try {
    // Usamos la función que ya sabe manejar el stock entero, categorías y ON CONFLICT
    const total = await ejecutarSincronizacionFisica();

    console.log(
      `✅ Inventario sincronizado: ${total} productos procesados a las ${new Date().toLocaleString()}`,
    );
  } catch (error) {
    console.error("❌ Fallo en el ciclo de sincronización:", error.message);
  }
};

const iniciarCron = () => {
  // '0,30 * * * *' ejecuta al minuto 0 y 30 de cada hora
  cron.schedule("0,30 * * * *", () => {
    sincronizarContifico();
  });
  console.log("⏰ Cron Job de Distribuidora San José activo: Cada 30 min.");
};

module.exports = { iniciarCron };
