import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";

import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Nosotros } from "../components/Nosotros";
import { ProductShowcase } from "../components/ProductShowcase";
import { Sedes } from "../components/Sedes";
import { Footer } from "../components/Footer";

export const Home = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { hash } = useLocation();

  // 1. Cargar productos
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await api.get("/api/productos");
        setProductos(respuesta.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerProductos();
  }, []);

  // 2. SCROLL MANUAL DE ALTA PRECISIÓN
  useEffect(() => {
    // Solo actuamos si hay un hash (#locales, #nosotros, etc.)
    if (hash) {
      const ejecutarScroll = () => {
        const id = hash.replace("#", "");
        const elemento = document.getElementById(id);

        if (elemento) {
          // Usamos getBoundingClientRect para calcular la posición real
          const yOffset = -100; // Espacio para la Navbar
          const y =
            elemento.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: "smooth" });
        }
      };

      // Si terminó de cargar, ejecutamos. Si no, esperamos.
      if (!cargando) {
        // Un pequeño delay para que el navegador "dibuje" los productos antes de saltar
        const timer = setTimeout(ejecutarScroll, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [hash, cargando]); // Se dispara al cambiar el hash O al terminar de cargar

  return (
    <div
      id="inicio"
      className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden"
    >
      <Navbar />
      <Hero />
      <Features />
      <Nosotros />
      <ProductShowcase productos={productos} cargando={cargando} />
      <Sedes />
      <Footer />
    </div>
  );
};
