import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { Catalogo } from "./pages/Catalogo";

// --- COMPONENTE INTERNO PARA EL SCROLL ---
// Este pequeño bloque se encarga de que las anclas (#nosotros, #locales)
// funcionen aunque cambies de página.
const ScrollToAnchor = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si no hay hash de sección (ej: #nosotros), sube al inicio
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      // Esperamos un momento a que React monte los componentes
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    }
  }, [pathname, hash]); // Solo reacciona cuando cambia la ruta o el ancla

  return null;
};

function App() {
  return (
    <>
      {/* Activamos el controlador de scroll */}
      <ScrollToAnchor />

      <Routes>
        {/* Ruta Principal */}
        <Route path="/" element={<Home />} />

        {/* Nueva Ruta para el Catálogo Completo (con filtros) */}
        <Route path="/productos" element={<Catalogo />} />

        {/* Ruta Administrativa */}
        <Route path="/admin-sj-2026" element={<Admin />} />

        {/* Redirección automática si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
