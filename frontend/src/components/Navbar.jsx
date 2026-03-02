import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-md z-50 border-b-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo: Al dar clic vuelve al Inicio y sube al principio */}
        <Link
          to="/#inicio"
          className="flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="bg-yellow-400 p-2 rounded-full font-black text-green-700 shadow-sm">
            SJ
          </div>
          <span className="text-xl font-black text-green-700 tracking-tighter">
            DISTRIBUIDORA SAN JOSÉ
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-6 text-xs font-black text-green-800 uppercase">
          {/* Navegación al Inicio (usando ancla para forzar el scroll arriba) */}
          <li>
            <a
              href="/#inicio"
              className="hover:text-yellow-500 transition-colors cursor-pointer"
            >
              Inicio
            </a>
          </li>

          {/* Scroll a secciones del Home */}
          <li>
            <a
              href="/#nosotros"
              className="hover:text-yellow-500 transition-colors cursor-pointer"
            >
              Nosotros
            </a>
          </li>

          {/* Navegación a la página de catálogo (Filtros) */}
          <li>
            <Link
              to="/productos"
              className="hover:text-yellow-500 transition-colors cursor-pointer"
            >
              Productos
            </Link>
          </li>

          <li>
            <a
              href="/#locales"
              className="hover:text-yellow-500 transition-colors cursor-pointer"
            >
              Locales
            </a>
          </li>

          <li className="hover:text-yellow-500 cursor-pointer transition-colors">
            Trabaja con nosotros
          </li>

          <li className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition-all cursor-pointer">
            Proveedores
          </li>
        </ul>
      </div>
    </nav>
  );
};
