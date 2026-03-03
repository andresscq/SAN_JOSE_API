// src/components/Hero.jsx

export const Hero = () => {
  return (
    <header className="pt-40 pb-20 bg-yellow-400 px-6 relative">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-block bg-green-700 text-white px-6 py-2 rounded-full text-sm font-black mb-6 shadow-lg animate-bounce uppercase">
          ¡CALIDAD PREMIUM GARANTIZADA!
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-green-900 mb-6 tracking-tighter leading-none drop-shadow-sm uppercase">
          DISTRIBUIDORA <br />
          <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
            SAN JOSÉ
          </span>
        </h1>

        <p className="text-green-800 text-xl md:text-2xl font-bold max-w-2xl mx-auto opacity-90">
          Abasteciendo a hogares y negocios con la frescura que solo el campo
          puede dar.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {/* BOTÓN 1: VA AL CATÁLOGO */}
          <a href="#productos">
            <button className="bg-green-700 text-white px-8 py-4 rounded-2xl font-black hover:bg-green-800 transition-all shadow-xl active:scale-95 uppercase tracking-wider">
              VER PRODUCTOS
            </button>
          </a>

          {/* BOTÓN 2: VA A LAS SEDES/CONTACTO */}
          <a href="">
            <button className="bg-white text-green-800 px-8 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all shadow-xl active:scale-95 uppercase tracking-wider">
              CONTÁCTANOS
            </button>
          </a>
        </div>
      </div>

      {/* --- EL SEPARADOR DE ONDA (WAVE) --- */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[60px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.05,108.5,123.83,110,183.15,92.83c61.42-17.8,111-48.4,168.19-62.25,48.45-11.8,103.24-11,151.2,6.11"
            fill="#ffffff"
          ></path>
        </svg>
      </div>
    </header>
  );
};
