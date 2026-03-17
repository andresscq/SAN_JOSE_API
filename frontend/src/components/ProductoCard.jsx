import React from "react";
import { useCart } from "../context/CartContext"; // Importamos el contexto del carrito
import { ShoppingCart } from "lucide-react";

export const ProductoCard = ({
  id, // Asegúrate de recibir el id de la DB
  nombre,
  categoria,
  imagen,
  descripcion,
  stock,
  stock_alerta,
}) => {
  const { addToCart } = useCart();

  // 1. Configuración de la imagen con fallback
  const urlImagen = imagen
    ? `http://localhost:3000/${imagen.replace(/^\//, "")}`
    : "https://via.placeholder.com/400?text=Sin+Foto";

  // 2. Lógica de Stock
  const nStock = parseInt(stock) || 0;
  const nAlerta = parseInt(stock_alerta) || 5;
  const sinStock = nStock <= 0;

  // 3. Manejo de clic para agregar al carrito
  const handleAgregar = () => {
    // IMPORTANTE: Pasamos los datos exactos que el CartContext necesita
    addToCart({
      id,
      nombre,
      imagen, // Pasamos la ruta base para que el modal la procese
      categoria,
    });
  };

  return (
    <div className="bg-white p-5 rounded-[35px] shadow-md border border-gray-100 flex flex-col hover:shadow-2xl transition-all duration-500 h-full group">
      {/* IMAGEN Y BADGE DE STOCK */}
      <div className="w-full h-48 rounded-[25px] overflow-hidden mb-4 bg-gray-50 relative">
        <img
          src={urlImagen}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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

      <div className="flex-grow flex flex-col px-1">
        {/* CATEGORÍA */}
        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-1">
          {categoria || "General"}
        </span>

        {/* TÍTULO */}
        <h3 className="text-base font-black text-green-950 uppercase leading-tight mb-2 group-hover:text-green-700 transition-colors">
          {nombre}
        </h3>

        {/* DESCRIPCIÓN */}
        <p className="text-[12px] text-gray-500 font-medium italic line-clamp-3 mb-5 leading-relaxed flex-grow">
          {descripcion && descripcion.trim() !== ""
            ? descripcion
            : "Calidad premium seleccionada para tu hogar."}
        </p>

        {/* BOTÓN DE ACCIÓN (Añadir al Carrito) */}
        <button
          onClick={handleAgregar}
          disabled={sinStock}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all duration-300 active:scale-95 shadow-lg ${
            sinStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-green-900 text-white hover:bg-yellow-500 hover:text-green-900 hover:shadow-yellow-200/50"
          }`}
        >
          <ShoppingCart size={14} />
          {sinStock ? "Sin existencias" : "Añadir a la lista"}
        </button>
      </div>
    </div>
  );
};
