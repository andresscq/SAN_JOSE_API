import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Función para manejar el clic en "Inicio" o el "Logo"
  const handleInicioClick = (e) => {
    // Si ya estamos en el Home (/)
    if (location.pathname === "/") {
      e.preventDefault();

      // 1. Subimos suavemente
      window.scrollTo({ top: 0, behavior: "smooth" });

      // 2. Quitamos el hash de la URL sin recargar la página
      // Esto es CLAVE para que luego puedas volver a hacer clic en #locales
      navigate("/", { replace: true });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-md z-50 border-b-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
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

        {/* MENÚ DE NAVEGACIÓN */}
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

          <li className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-green-900 transition-all cursor-pointer shadow-md active:scale-95">
            Proveedores
          </li>
        </ul>
      </div>
    </nav>
  );
};
