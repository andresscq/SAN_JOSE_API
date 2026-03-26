import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import api from "../api/axios"; // Importante para la validación
import {
  X,
  Trash2,
  ShoppingBag,
  Loader2,
  Flame,
  Clock,
  ShieldAlert,
  MessageCircle,
} from "lucide-react";

export const CarritoModal = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, sendToWhatsApp } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Estados para el control de horario
  const [fueraDeHorario, setFueraDeHorario] = useState(false);
  const [datosCierre, setDatosCierre] = useState({ mensaje: "", telefono: "" });

  // Verificar horario cada vez que se abre el carrito
  useEffect(() => {
    if (isOpen) {
      const verificarHorario = async () => {
        try {
          const res = await api.get("/api/empleados/siguiente-turno");
          if (res.data.fueraDeHorario) {
            setFueraDeHorario(true);
            setDatosCierre({
              mensaje: res.data.mensaje,
              telefono: res.data.telefono,
            });
          } else {
            setFueraDeHorario(false);
          }
        } catch (error) {
          console.error("Error verificando horario:", error);
        }
      };
      verificarHorario();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      if (fueraDeHorario) {
        // Si está cerrado, mandamos a la central con un mensaje de "Pedido Pendiente"
        const textoCierre = `Hola, mi pedido es:\n${cart.map((i) => `- ${i.nombre} (x${i.quantity})`).join("\n")}\n\nLo envío fuera de horario para que lo procesen mañana.`;
        window.open(
          `https://wa.me/${datosCierre.telefono}?text=${encodeURIComponent(textoCierre)}`,
          "_blank",
        );
        onClose();
      } else {
        // Flujo normal
        await sendToWhatsApp();
        onClose();
      }
    } catch (error) {
      console.error("Error al procesar pedido:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Cabecera */}
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

        {/* --- BANNER DE FUERA DE HORARIO --- */}
        {fueraDeHorario && (
          <div className="bg-orange-50 border-b border-orange-100 p-4 flex items-start gap-3 animate-pulse">
            <div className="bg-orange-500 p-2 rounded-xl text-white">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[11px] font-black text-orange-600 uppercase tracking-widest leading-none mb-1">
                Atención Limitada
              </p>
              <p className="text-[12px] text-orange-900/70 font-medium leading-tight">
                Estamos fuera de horario. Puedes enviar tu pedido a la central y
                lo procesaremos al abrir.
              </p>
            </div>
          </div>
        )}

        {/* Cuerpo del Carrito */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {cart.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                <ShoppingBag size={50} />
              </div>
              <p className="text-slate-400 font-black uppercase text-[18px] tracking-widest">
                Tu lista está vacía
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-4 bg-white p-4 rounded-[25px] border shadow-sm items-center group relative transition-all ${item.esTendencia ? "border-orange-200 bg-orange-50/30" : "border-slate-200"}`}
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                    <img
                      src={
                        item.imagen ||
                        "https://via.placeholder.com/400?text=Sin+Foto"
                      }
                      className="w-full h-full object-cover"
                      alt={item.nombre}
                    />
                    {item.esTendencia && (
                      <div className="absolute top-1 left-1 bg-orange-500 p-1 rounded-full shadow-md z-10">
                        <Flame size={13} fill="white" className="text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-black text-green-950 text-sm uppercase line-clamp-1">
                      {item.nombre}
                    </h4>
                    <p className="text-[15px] text-yellow-600 font-black uppercase tracking-tighter">
                      {item.categoria || "General"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[12px] font-black text-slate-400 uppercase">
                        Cantidad:
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-lg text-xs font-black">
                        {item.quantity}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-300 hover:text-red-500 p-2"
                  >
                    <Trash2 size={23} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="mb-6 flex items-center justify-between px-2">
              <span className="font-black text-slate-400 uppercase text-[16px]">
                Total productos:
              </span>
              <span className="font-black text-green-900 text-xl">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>

            {/* BOTÓN DINÁMICO */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full py-4 rounded-[20px] font-black uppercase tracking-tighter flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg ${
                isProcessing
                  ? "bg-slate-200 text-slate-400"
                  : fueraDeHorario
                    ? "bg-slate-800 text-white hover:bg-slate-900"
                    : "bg-green-600 text-white hover:bg-green-700 shadow-green-200"
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Verificando...
                </>
              ) : fueraDeHorario ? (
                <>
                  <ShieldAlert size={20} /> Enviar a Central (Cerrado)
                </>
              ) : (
                <>Enviar lista a un asesor</>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400 mt-4 uppercase font-bold leading-tight px-4">
              {fueraDeHorario
                ? "Estamos fuera de horario comercial. Tu pedido será recibido por nuestra central de emergencias."
                : "Tu lista será procesada por nuestro sistema para asignarte un asesor de forma inmediata."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
