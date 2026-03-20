import React from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart, MessageCircle } from "lucide-react";

export const ProductoCard = ({
  id,
  nombre,
  categoria,
  imagen,
  descripcion,
  stock,
  stock_alerta,
}) => {
  // Extraemos las funciones del contexto global
  const { addToCart, sendToWhatsApp } = useCart();

  // Configuración de imagen local/fallback
  const urlImagen = imagen
    ? `http://localhost:3000/${imagen.replace(/^\//, "")}`
    : "https://via.placeholder.com/400?text=Sin+Imagen";

  // Lógica de Stock
  const nStock = parseInt(stock) || 0;
  const nAlerta = parseInt(stock_alerta) || 5;
  const sinStock = nStock <= 0;

  /**
   * ACCIÓN 1: Añadir al carrito (Sin abrir WhatsApp)
   */
  const handleAgregar = () => {
    addToCart({
      id,
      nombre,
      imagen: urlImagen,
      categoria,
      quantity: 1,
    });
  };

  /**
   * ACCIÓN 2: Consulta Directa (Cero retrasos)
   * Enviamos el objeto directamente a la función para que funcione al PRIMER CLIC.
   */
  const handleConsultaDirecta = async () => {
    const productoActual = {
      id,
      nombre,
      imagen: urlImagen,
      categoria,
      quantity: 1,
    };

    // 1. Lo guardamos en el carrito global para persistencia
    addToCart(productoActual);

    // 2. Lo enviamos "por el tubo" directamente a la función del Robin
    try {
      await sendToWhatsApp(productoActual);
    } catch (error) {
      console.error("Error al procesar consulta directa:", error);
    }
  };

  return (
    <div className="bg-white p-5 rounded-[35px] shadow-md border border-gray-100 flex flex-col hover:shadow-2xl transition-all duration-500 h-full group">
      {/* SECCIÓN VISUAL (Imagen + Badge Stock) */}
      <div className="w-full h-48 rounded-[25px] overflow-hidden mb-4 bg-gray-50 relative">
        <img
          src={urlImagen}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />

        <div
          className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg text-white backdrop-blur-sm ${
            sinStock
              ? "bg-gray-500/90"
              : nStock <= nAlerta
                ? "bg-red-600 animate-pulse"
                : "bg-green-600/90"
          }`}
        >
          {sinStock
            ? "AGOTADO"
            : nStock <= nAlerta
              ? `¡ÚLTIMOS ${nStock}!`
              : `${nStock} DISPONIBLES`}
        </div>
      </div>

      {/* DETALLES DEL PRODUCTO */}
      <div className="flex-grow flex flex-col px-1">
        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-1">
          {categoria || "General"}
        </span>

        <h3 className="text-base font-black text-green-950 uppercase leading-tight mb-2 group-hover:text-green-700 transition-colors">
          {nombre}
        </h3>

        <p className="text-[12px] text-gray-500 font-medium italic line-clamp-2 mb-5 leading-relaxed flex-grow">
          {descripcion?.trim()
            ? descripcion
            : "Selección premium para tu negocio."}
        </p>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex flex-col gap-2 mt-auto">
          {/* BOTÓN WHATSAPP (CONSULTA DIRECTA) */}
          <button
            onClick={handleConsultaDirecta}
            disabled={sinStock}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[9px] tracking-widest uppercase transition-all duration-300 active:scale-95 shadow-lg ${
              sinStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 shadow-green-200"
            }`}
          >
            <MessageCircle size={14} />
            {sinStock ? "No disponible" : "Consultar por WhatsApp"}
          </button>

          {/* BOTÓN AÑADIR (CARRITO) */}
          <button
            onClick={handleAgregar}
            disabled={sinStock}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[9px] tracking-widest uppercase transition-all duration-300 active:scale-95 border-2 ${
              sinStock
                ? "bg-gray-100 text-gray-300 border-transparent cursor-not-allowed"
                : "bg-transparent border-green-900 text-green-900 hover:bg-green-900 hover:text-white"
            }`}
          >
            <ShoppingCart size={12} />
            {sinStock ? "Sin existencias" : "Añadir al pedido"}
          </button>
        </div>
      </div>
    </div>
  );
};
