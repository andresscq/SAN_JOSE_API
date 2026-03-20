import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const CartContext = createContext();

const STORAGE_KEY = "cart_sanjose_2026";
const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.items && Array.isArray(parsed.items)) {
        if (Date.now() - parsed.timestamp > EXPIRATION_TIME) {
          localStorage.removeItem(STORAGE_KEY);
          return [];
        }
        return parsed.items;
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  // Estado para animaciones de carga en los botones
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        items: cart,
        timestamp: Date.now(),
      }),
    );
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(
        (item) => String(item.id) === String(product.id),
      );
      if (exists) {
        return prev.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const clearCart = () => setCart([]);

  /**
   * ENVÍO A WHATSAPP CON SOPORTE PARA CLIC DIRECTO
   * @param {Object} productoDirecto - Opcional: El producto desde el que se hizo clic
   */
  const sendToWhatsApp = async (productoDirecto = null) => {
    // Si viene un producto directo, mandamos ese. Si no, mandamos el carrito.
    const itemsAEnviar = productoDirecto ? [productoDirecto] : cart;

    if (itemsAEnviar.length === 0) return;

    setLoadingGlobal(true);

    try {
      // 1. Pedir asesor al Backend (POST /asignar)
      const res = await api.post("/api/vendedores/asignar", {
        items: itemsAEnviar,
      });
      const vendedor = res.data;

      if (!vendedor || !vendedor.telefono) {
        throw new Error("No hay asesores disponibles.");
      }

      // 2. Limpiar el teléfono de caracteres extraños
      const telLimpio = vendedor.telefono.toString().replace(/\D/g, "");

      // 3. Construir mensaje
      let mensaje = `Hola ${vendedor.nombre}! \n`;
      mensaje += `Vengo desde la web de Distribuidora San José y quiero cotizar lo siguiente:
\n\n`;

      itemsAEnviar.forEach((item, i) => {
        mensaje += `*${i + 1}.* ${item.nombre}\n`;
        mensaje += `    Cantidad: ${item.quantity || 1}\n`;
        mensaje += `    Categoria: ${item.categoria || "General"}\n\n`;
      });

      mensaje += `_¿Podrían ayudarme con información y precios? Gracias.._`;

      // 4. Abrir WhatsApp
      const url = `https://wa.me/${telLimpio}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank");

      // 5. Limpieza tras éxito
      clearCart();
    } catch (error) {
      console.error("Error en el flujo de WhatsApp:", error);
      alert(
        "Lo sentimos, hubo un error al conectar con el asesor. Inténtalo de nuevo.",
      );
    } finally {
      setLoadingGlobal(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loadingGlobal,
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};
