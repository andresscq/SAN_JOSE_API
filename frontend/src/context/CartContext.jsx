import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Estado del carrito con persistencia en LocalStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart_sanjose_2026");
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en el teléfono del cliente automáticamente
  useEffect(() => {
    localStorage.setItem("cart_sanjose_2026", JSON.stringify(cart));
  }, [cart]);

  // AGREGAR AL CARRITO (Corregido para evitar duplicados accidentales)
  const addToCart = (product) => {
    setCart((prev) => {
      // Forzamos comparación de ID como String para seguridad
      const exists = prev.find(
        (item) => String(item.id) === String(product.id),
      );

      if (exists) {
        return prev.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      // Si es nuevo, lo agregamos con cantidad 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const clearCart = () => setCart([]);

  // LÓGICA DE ENVÍO Y REPARTO (ROUND ROBIN)
  const sendToWhatsApp = async () => {
    if (cart.length === 0) return;

    try {
      // 1. Obtener empleados activos
      const res = await api.get("/api/empleados");
      const activos = res.data.filter((emp) => emp.activo);

      if (activos.length === 0) {
        alert(
          "Lo sentimos, no hay asesores disponibles en este momento. Por favor, intenta más tarde.",
        );
        return;
      }

      // 2. Selección de vendedor (Round Robin)
      let index = parseInt(localStorage.getItem("last_vendedor_idx")) || 0;
      // Si el index guardado es mayor que la cantidad actual de empleados, lo reseteamos
      if (index >= activos.length) index = 0;

      const vendedor = activos[index];

      // Actualizamos para el siguiente cliente
      const nextIndex = (index + 1) % activos.length;
      localStorage.setItem("last_vendedor_idx", nextIndex);

      // 3. Armar el mensaje profesional
      let mensaje = `¡Hola *${vendedor.nombre}*! 👋\n`;
      mensaje += `Vengo de la web y deseo consultar disponibilidad de estos productos:\n\n`;

      cart.forEach((item, i) => {
        mensaje += `*${i + 1}.* ${item.nombre}\n`;
        mensaje += `   📦 Cantidad: ${item.quantity}\n`;
        mensaje += `   🏷️ Cat: ${item.categoria || "General"}\n\n`;
      });

      mensaje += `_Quedo atento a su respuesta, muchas gracias._`;

      // 4. Abrir WhatsApp (Móvil y Web)
      const url = `https://wa.me/${vendedor.telefono}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank");

      // Opcional: Limpiar carrito tras envío exitoso
      // clearCart();
    } catch (error) {
      console.error("Error en el sistema de reparto:", error);
      alert("Hubo un error al conectar con el asesor.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        sendToWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
