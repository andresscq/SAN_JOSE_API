import React, { useState } from "react";
import api from "../api/axios";
import { MessageCircle, Loader2, Send } from "lucide-react";

export const BtnWhatsappSj = ({
  productos = [],
  textoBoton = "Consultar WhatsApp",
  esCarrito = false,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAsignacionTurno = async () => {
    setLoading(true);

    // Normalizamos los productos a un Array
    const listaProductos = Array.isArray(productos) ? productos : [productos];

    try {
      // 1. LLAMADA AL BACKEND: Usamos la ruta completa definida en tu index.js
      const response = await api.post("/api/vendedores/asignar", {
        productos: listaProductos,
      });

      const { telefono, nombre } = response.data;

      // Validación de seguridad por si el empleado no tiene teléfono en la DB
      if (!telefono) {
        throw new Error(
          "El vendedor asignado no tiene un teléfono registrado.",
        );
      }

      // 2. LIMPIEZA TOTAL DEL TELÉFONO
      // Esto elimina espacios, guiones, puntos y el "+" para evitar el error 404 de WA
      const telLimpio = telefono.toString().replace(/\D/g, "");

      // 3. CONSTRUCCIÓN DEL MENSAJE
      let mensajeIntro = `Hola ${nombre}, vengo de la web de Distribuidora San José. `;
      let detallePedido = "";

      if (
        listaProductos.length > 0 &&
        listaProductos[0] !== "" &&
        listaProductos[0] !== undefined
      ) {
        detallePedido = `\n\n*Deseo cotizar:* \n- ${listaProductos.join("\n- ")}`;
      } else {
        detallePedido = `\n\nDeseo información general de sus servicios.`;
      }

      const mensajeFinal = encodeURIComponent(mensajeIntro + detallePedido);

      // 4. APERTURA DE WHATSAPP
      const urlWa = `https://wa.me/${telLimpio}?text=${mensajeFinal}`;

      console.log("Asignación exitosa:", { vendedor: nombre, url: urlWa });
      window.open(urlWa, "_blank");
    } catch (error) {
      console.error("Error en la asignación automática:", error);

      // FALLBACK: Si falla el servidor o la ruta, enviamos al número central de respaldo
      // Asegúrate de que este número sea el correcto de la oficina
      const numeroRespaldo = "593987786722";

      const msgError = encodeURIComponent(
        "Hola, hubo un problema técnico con la asignación automática. Deseo información general.",
      );
      window.open(`https://wa.me/${numeroRespaldo}?text=${msgError}`, "_blank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAsignacionTurno}
      disabled={loading}
      className={`
        w-full flex items-center justify-center gap-3 transition-all duration-300 active:scale-95
        font-black uppercase tracking-widest shadow-lg
        ${loading ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}
        ${
          esCarrito
            ? "bg-yellow-500 text-green-950 py-5 rounded-[25px] text-xs hover:bg-yellow-400 shadow-yellow-200/50"
            : "bg-green-900 text-yellow-400 py-4 rounded-2xl text-[10px] hover:bg-green-800 shadow-green-900/20"
        }
      `}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={esCarrito ? 20 : 16} />
      ) : esCarrito ? (
        <Send size={20} />
      ) : (
        <MessageCircle size={16} />
      )}

      <span>{loading ? "Asignando..." : textoBoton}</span>
    </button>
  );
};
