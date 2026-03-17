import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // ✅ Añadido para el modal
import { useCart } from "../context/CartContext"; // ✅ Añadido para el contador
import { CarritoModal } from "./CarritoModal"; // ✅ Añadido para el panel lateral
import { ShoppingCart } from "lucide-react"; // ✅ Icono para el carrito

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- TUS NUEVOS ESTADOS PARA EL CARRITO ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- TU LÓGICA ORIGINAL DE INICIO (MANTENIDA) ---
  const handleInicioClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-md z-50 border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* LOGO (MANTENIDO) */}
          <Link
            to="/"
            onClick={handleInicioClick}
            className="flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="bg-yellow-400 p-2 rounded-full font-black text-green-700 shadow-sm">
              SJ
            </div>
            <span className="text-xl font-black text-green-700 tracking-tighter">
              DISTRIBUIDORA SAN JOSÉ
            </span>
          </Link>

          {/* MENÚ DE NAVEGACIÓN (TODAS TUS RUTAS ORIGINALES) */}
          <div className="flex items-center gap-6">
            <ul className="hidden md:flex items-center gap-6 text-xs font-black text-green-800 uppercase">
              <li>
                <Link
                  to="/"
                  onClick={handleInicioClick}
                  className="hover:text-yellow-500 transition-colors cursor-pointer"
                >
                  Inicio
                </Link>
              </li>

              <li>
                <Link
                  to="/#nosotros"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Nosotros
                </Link>
              </li>

              <li>
                <Link
                  to="/productos"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Productos
                </Link>
              </li>

              <li>
                <Link
                  to="/#locales"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Locales
                </Link>
              </li>

              <li>
                <Link
                  to="/unetes"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Trabaja con nosotros
                </Link>
              </li>

              {/* BOTÓN PROVEEDORES (MANTENIDO) */}
              <li>
                <Link
                  to="/acceso-proveedores"
                  className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-500 hover:text-green-900 transition-all cursor-pointer shadow-md active:scale-95 inline-block"
                >
                  Proveedores
                </Link>
              </li>
            </ul>

            {/* --- NUEVO BOTÓN DE CARRITO (INTEGRADO AL FINAL DEL MENÚ) --- */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-green-900 hover:bg-yellow-400 transition-all group shadow-sm active:scale-90"
            >
              <ShoppingCart size={20} strokeWidth={2.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-md animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MODAL QUE SE ACTIVA DESDE EL NAV */}
      <CarritoModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
