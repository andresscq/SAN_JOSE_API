import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-[#0a0f0d] text-white pt-20 pb-10 px-6 border-t-8 border-yellow-400">
      <div className="max-w-7xl mx-auto">
        {/* Cuerpo Principal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Columna 1: Branding e Información Importante */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
              San José <br />
              <span className="text-yellow-400">Distribuidora</span>
            </h3>
            <p className="text-slate-400 text-base leading-relaxed max-w-md font-medium">
              Distribución de productos de primera necesidad con los más altos
              estándares y una excelente calidad directamente a tu negocio y
              hogar. Nos enfocamos en la frescura diaria y el servicio
              personalizado.
            </p>
            {/* Pequeño distintivo de confianza */}
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12 bg-yellow-400"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400">
                Tu Confianza, Nuestra Promesa
              </span>
            </div>
          </div>

          {/* Columna 2: Navegación Estilizada */}
          <div className="md:col-span-3">
            <h4 className="font-black text-sm uppercase tracking-widest text-white mb-8 border-b border-white/10 pb-2 inline-block">
              Navegación
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Inicio", link: "/#inicio" },
                { name: "Nosotros", link: "/#nosotros" },
                { name: "Catálogo de Productos", link: "/productos" },
                { name: "Trabaja con nosotros", link: "#" },
                { name: "Proveedores", link: "#" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className="text-slate-400 hover:text-yellow-400 font-bold text-sm transition-all flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Tarjeta de Contacto (Estilo Hero) */}
          <div className="md:col-span-4">
            <div className="bg-green-900/20 border border-green-500/30 p-8 rounded-3xl relative overflow-hidden group">
              {/* Efecto de luz de fondo */}
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-2 uppercase italic tracking-tighter text-white">
                  ¿Necesitas <span className="text-yellow-400">Ayuda?</span>
                </h4>
                <p className="text-slate-400 text-s font-bold mb-8 leading-relaxed">
                  Escríbenos directamente para pedidos mayoristas, soporte
                  técnico o dudas sobre el catálogo.
                </p>
                <a
                  href={`https://wa.me/593987786722?text=${encodeURIComponent(
                    "¡Hola! Vengo de la página web de Distribuidora San José. Me gustaría recibir más información sobre sus productos.",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 text-white font-black text-center py-4 rounded-xl uppercase text-xs tracking-widest hover:bg-yellow-500 hover:text-green-950 transition-all shadow-lg active:scale-95"
                >
                  Hablar con Asesor
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria minimalista */}
        <div className="h-px w-full bg-white/5 mb-10"></div>

        {/* Copyright y Créditos Finales */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">
              © 2026 DISTRIBUIDORA SAN JOSÉ - TODOS LOS DERECHOS RESERVADOS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
