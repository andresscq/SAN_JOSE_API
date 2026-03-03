import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { Catalogo } from "./pages/Catalogo";
import { Trabajo } from "./pages/Trabajo";

// Componente para resetear el scroll al cambiar de página
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Rutas Principales */}
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Catalogo />} />
        <Route path="/unetes" element={<Trabajo />} />

        {/* Ruta del Panel de Control */}
        {/* Cambia la ruta del admin por esta: */}
        <Route path="/admin-sj-2026" element={<Admin />} />
        {/* Comodín: Si la ruta no existe, al inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
