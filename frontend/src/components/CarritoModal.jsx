import React from "react";
import { useCart } from "../context/CartContext";
import { X, Trash2, ShoppingBag, MessageCircle } from "lucide-react";

export const CarritoModal = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, sendToWhatsApp } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Fondo oscuro traslúcido con desenfoque */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel Lateral */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Cabecera Estilo San José */}
        <div className="p-6 border-b-4 border-yellow-400 flex justify-between items-center bg-green-900 text-white">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} className="text-yellow-400" />
            <h2 className="font-black uppercase italic tracking-tighter text-xl">
              Tu Pedido
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-transform hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cuerpo: Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {cart.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                <ShoppingBag size={40} />
              </div>
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
                Tu lista está vacía
              </p>
              <button
                onClick={onClose}
                className="text-green-800 font-black uppercase text-[10px] underline"
              >
                Volver al catálogo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                // Construcción de URL de imagen idéntica a ProductoCard
                const urlImagen = item.imagen
                  ? `http://localhost:3000/${item.imagen.replace(/^\//, "")}`
                  : "https://via.placeholder.com/400?text=Sin+Foto";

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-white p-4 rounded-[25px] border border-slate-200 shadow-sm items-center group"
                  >
                    {/* Imagen del producto */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                      <img
                        src={urlImagen}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={item.nombre}
                      />
                    </div>

                    {/* Info del producto */}
                    <div className="flex-1">
                      <h4 className="font-black text-green-950 text-sm uppercase leading-tight line-clamp-1">
                        {item.nombre}
                      </h4>
                      <p className="text-[10px] text-yellow-600 font-black uppercase tracking-tighter">
                        {item.categoria || "General"}
                      </p>

                      {/* Badge de Cantidad (Sin Precio) */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase">
                          Cantidad:
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-lg text-xs font-black">
                          {item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Botón Eliminar */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer: Acción de WhatsApp */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="font-black text-slate-400 uppercase text-[10px]">
                Total de productos:
              </span>
              <span className="font-black text-green-900">{cart.length}</span>
            </div>

            <button
              onClick={sendToWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-3 active:scale-95"
            >
              <MessageCircle size={18} />
              Consultar Disponibilidad
            </button>

            <p className="text-[9px] text-center text-slate-400 mt-4 uppercase font-bold leading-tight px-4">
              Tu lista será enviada a uno de nuestros asesores para brindarte
              atención inmediata.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
