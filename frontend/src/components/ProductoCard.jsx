import React from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart, MessageCircle, Flame } from "lucide-react";

export const ProductoCard = ({
  id,
  nombre,
  categoria,
  imagen,
  descripcion,
  stock,
  stock_alerta,
  esTendencia,
}) => {
  const { addToCart, sendToWhatsApp } = useCart();

  const urlImagen = imagen
    ? `http://localhost:3000/${imagen.replace(/^\//, "")}`
    : "https://via.placeholder.com/400?text=Sin+Imagen";

  const nStock = parseInt(stock) || 0;
  const nAlerta = parseInt(stock_alerta) || 5;
  const sinStock = nStock <= 0;

  const handleAgregar = () => {
    addToCart({
      id,
      nombre,
      imagen: urlImagen,
      categoria,
      esTendencia, // Esto ya lo tienes y es lo que enviará el dato al carrito
      quantity: 1,
    });
  };

  const handleConsultaDirecta = async () => {
    const productoActual = {
      id,
      nombre,
      imagen: urlImagen,
      categoria,
      esTendencia, // Me aseguro de que este objeto también lleve la tendencia
      quantity: 1,
    };
    addToCart(productoActual);
    try {
      await sendToWhatsApp(productoActual);
    } catch (error) {
      console.error("Error al procesar consulta directa:", error);
    }
  };

  return (
    <div
      className={`bg-white p-5 rounded-[35px] shadow-md border flex flex-col hover:shadow-2xl transition-all duration-500 h-full group relative ${
        esTendencia
          ? "border-orange-400/40 shadow-orange-50"
          : "border-gray-100"
      }`}
    >
      {/* BADGE DE TENDENCIA 🔥 */}
      {esTendencia && (
        <div className="absolute -top-3 left-6 z-20 flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1 rounded-full shadow-lg shadow-orange-200">
          <Flame size={15} fill="white" className="animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest">
            Tendencia
          </span>
        </div>
      )}

      {/* SECCIÓN VISUAL */}
      <div className="w-full h-48 rounded-[25px] overflow-hidden mb-4 relative bg-gray-50">
        <img
          src={urlImagen}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />

        {/* Badge de Stock */}
        <div
          className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-[11px] font-black shadow-lg text-white backdrop-blur-sm ${
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
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[17px] font-black text-green-800 uppercase tracking-[0.2em]">
            {categoria || "General"}
          </span>
        </div>

        <h3 className="text-[18px] text-base font-black uppercase leading-tight mb-2 text-green-950 ">
          {nombre}
        </h3>

        <p className="text-[16px] text-gray-500 font-medium italic line-clamp-2 mb-5 leading-relaxed flex-grow">
          {descripcion?.trim()
            ? descripcion
            : "Selección premium para tu negocio."}
        </p>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={handleConsultaDirecta}
            disabled={sinStock}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all duration-300 active:scale-95 shadow-lg ${
              sinStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 shadow-green-200"
            }`}
          >
            <MessageCircle size={18} />
            {sinStock ? "No disponible" : "Consultar por WhatsApp"}
          </button>

          <button
            onClick={handleAgregar}
            disabled={sinStock}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all duration-300 active:scale-95 border-2 ${
              sinStock
                ? "bg-gray-100 text-gray-300 border-transparent cursor-not-allowed"
                : "bg-transparent border-green-900 text-green-900 hover:bg-green-900 hover:text-white"
            }`}
          >
            <ShoppingCart size={18} />
            {sinStock ? "Sin existencias" : "Añadir al pedido"}
          </button>
        </div>
      </div>
    </div>
  );
};
