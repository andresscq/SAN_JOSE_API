import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import {
  ShoppingCart,
  MessageCircle,
  Flame,
  Clock,
  X,
  ShieldAlert,
} from "lucide-react";

export const ProductoCard = ({
  id,
  nombre,
  categoria,
  imagen,
  descripcion, // Se mantiene en los props por si la lógica lo usa, pero no se renderiza
  stock,
  stock_alerta,
  esTendencia,
}) => {
  const { addToCart, sendToWhatsApp } = useCart();

  // --- ESTADOS PARA EL MODAL DE HORARIO ---
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datosCierre, setDatosCierre] = useState({ mensaje: "", telefono: "" });

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
      esTendencia,
      quantity: 1,
    });
  };

  // --- LÓGICA DE CONSULTA CON VERIFICACIÓN DE HORARIO ---
  const handleConsultaDirecta = async () => {
    const productoActual = {
      id,
      nombre,
      imagen: urlImagen,
      categoria,
      esTendencia,
      quantity: 1,
    };

    try {
      const res = await api.get("/api/empleados/siguiente-turno");

      if (res.data.fueraDeHorario) {
        setDatosCierre({
          mensaje: res.data.mensaje,
          telefono: res.data.telefono,
        });
        setMostrarModal(true);
      } else {
        addToCart(productoActual);
        await sendToWhatsApp(productoActual);
      }
    } catch (error) {
      console.error("Error al procesar consulta:", error);
      alert("Lo sentimos, no pudimos conectar con un asesor.");
    }
  };

  return (
    <div
      className={`bg-white p-5 rounded-[35px] shadow-md border flex flex-col hover:shadow-2xl transition-all duration-500 h-full group relative ${esTendencia ? "border-orange-400/40 shadow-orange-50" : "border-gray-100"}`}
    >
      {/* -------------------------------------------------------------------------------- */}
      {/* NUEVO MODAL DE HORARIO */}
      {/* -------------------------------------------------------------------------------- */}
      {mostrarModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-green-950/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative text-center border border-gray-100 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-green-50 rounded-full"></div>

            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-green-800 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-5 mx-auto border border-green-100">
                <Clock className="text-green-600" size={32} />
              </div>

              <h2 className="text-[20px] font-black text-green-950 uppercase italic leading-tight mb-2 tracking-tighter">
                Horario <span className="text-green-600">Cerrado</span>
              </h2>

              <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-7 px-2">
                {datosCierre.mensaje}
              </p>

              <div className="w-full space-y-3">
                <div className="bg-gray-50 p-3.5 rounded-xl flex items-center justify-between border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert size={16} className="text-gray-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Atención Central
                    </span>
                  </div>
                  <span className="text-green-950 font-bold text-sm">
                    {datosCierre.telefono}
                  </span>
                </div>

                <a
                  href={`https://wa.me/${datosCierre.telefono}?text=Hola, dejo este mensaje fuera de horario para consultar stock de: ${nombre}`}
                  target="_blank"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-md shadow-green-100 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Dejar mensaje en Central
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO DE LA CARD */}
      {esTendencia && (
        <div className="absolute -top-3 left-6 z-20 flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1 rounded-full shadow-lg shadow-orange-200">
          <Flame size={15} fill="white" className="animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest">
            Tendencia
          </span>
        </div>
      )}

      <div className="w-full h-48 rounded-[25px] overflow-hidden mb-4 relative bg-gray-50">
        <img
          src={urlImagen}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div
          className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-[11px] font-black shadow-lg text-white backdrop-blur-sm ${sinStock ? "bg-gray-500/90" : nStock <= nAlerta ? "bg-red-600 animate-pulse" : "bg-green-600/90"}`}
        >
          {sinStock
            ? "AGOTADO"
            : nStock <= nAlerta
              ? `¡ÚLTIMOS ${nStock}!`
              : `${nStock} DISPONIBLES`}
        </div>
      </div>

      <div className="flex-grow flex flex-col px-1">
        <span className="text-[17px] font-black text-green-800 uppercase tracking-[0.2em] mb-1">
          {categoria || "General"}
        </span>
        <h3 className="text-[18px] font-black uppercase leading-tight mb-6 text-green-950">
          {nombre}
        </h3>

        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={handleConsultaDirecta}
            disabled={sinStock}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all duration-300 active:scale-95 shadow-lg ${sinStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700 shadow-green-200"}`}
          >
            <MessageCircle size={18} />
            {sinStock ? "No disponible" : "Consultar por WhatsApp"}
          </button>

          <button
            onClick={handleAgregar}
            disabled={sinStock}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all duration-300 active:scale-95 border-2 ${sinStock ? "bg-gray-100 text-gray-300 border-transparent cursor-not-allowed" : "bg-transparent border-green-900 text-green-900 hover:bg-green-900 hover:text-white"}`}
          >
            <ShoppingCart size={18} />
            {sinStock ? "Sin existencias" : "Añadir al pedido"}
          </button>
        </div>
      </div>
    </div>
  );
};
