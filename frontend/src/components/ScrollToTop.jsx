import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si no hay un #ancla, sube al inicio
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      // Si hay un #ancla (como #nosotros), espera un poquito a que cargue y baja
      setTimeout(() => {
        const element = document.getElementById(hash.replace("#", ""));
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [pathname, hash]);

  return null;
};
