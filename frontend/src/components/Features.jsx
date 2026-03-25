import React from "react";
import { Truck, BadgePercent, ShieldCheck } from "lucide-react";

export const Features = () => {
  const beneficios = [
    {
      // EFECTO: CAMIÓN EN CARRETERA
      icon: (
        <div className="flex flex-col items-center">
          <div className="text-cyan-600 animate-truck-drive">
            <Truck size={42} strokeWidth={1.5} />
          </div>
          {/* Línea de carretera debajo del camión */}
          <div className="w-10 h-1 bg-slate-200 rounded-full mt-1 overflow-hidden relative">
            <div className="absolute w-4 h-full bg-cyan-400 road-line"></div>
          </div>
        </div>
      ),
      t: "Logística Veloz",
      d: "Entrega garantizada en menos de 24h para negocios y hogares.",
      gradient: "from-cyan-400 to-blue-600",
      shadowHover: "shadow-blue-500/20",
    },
    {
      // EFECTO: MONEDA CON BRILLO LUXURY
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg animate-shine">
          <BadgePercent size={34} strokeWidth={2} />
        </div>
      ),
      t: "Mejor Precio",
      d: "Sin intermediarios. Precios competitivos directos de fábrica.",
      gradient: "from-yellow-400 to-red-600",
      shadowHover: "shadow-orange-500/20",
    },
    {
      // EFECTO: RADAR DE SEGURIDAD PREMIUM
      icon: (
        <div className="relative flex items-center justify-center">
          {/* Ondas de radar de fondo */}
          <div className="absolute w-12 h-12 bg-green-500 rounded-full radar-wave"></div>
          <div className="absolute w-12 h-12 bg-green-400 rounded-full radar-wave [animation-delay:0.5s]"></div>

          <div className="relative text-green-700 bg-white rounded-full p-1">
            <ShieldCheck size={42} strokeWidth={1.5} />
          </div>
        </div>
      ),
      t: "Excelente Calidad",
      d: "Productos frescos bajo los más estrictos estándares premium.",
      gradient: "from-green-400 to-emerald-800",
      shadowHover: "shadow-green-500/20",
    },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-[20px] font-black uppercase tracking-[0.5em] text-green-900/40 mb-3">
          ¿Por qué confiar en nosotros?
        </h2>
        <h1 className="text-4xl md:text-5xl font-black text-green-900 tracking-tighter italic mb-5">
          Calidad <span className="text-yellow-400">Garantizada</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {beneficios.map((item, i) => (
          <div
            key={i}
            className={`group relative p-12 bg-white rounded-[55px] text-center transition-all duration-500 border border-slate-100 shadow-[0_15px_50px_-20px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] ${item.shadowHover} hover:-translate-y-4 overflow-hidden`}
          >
            {/* Efecto de aura de color en hover */}
            <div
              className={`absolute -top-40 -right-40 w-80 h-80 bg-slate-50 rounded-full group-hover:bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 group-hover:blur-[100px] transition-all duration-1000 -z-10`}
            />

            {/* Contenedor del Icono */}
            <div className="inline-flex items-center justify-center w-24 h-24 mb-12 rounded-[35px] bg-slate-50 shadow-inner relative group-hover:scale-110 transition-transform duration-500">
              {item.icon}
            </div>

            <h3 className="text-2xl font-black text-green-950 mb-5 uppercase tracking-tighter italic transition-colors group-hover:text-green-900">
              {item.t}
            </h3>

            <p className="text-slate-600 font-medium leading-relaxed text-[18px] group-hover:text-slate-900 transition-colors">
              {item.d}
            </p>

            {/* Barra Inferior de Progreso en Hover */}
            <div
              className={`absolute bottom-0 left-0 w-0 group-hover:w-full h-2.5 bg-gradient-to-r ${item.gradient} transition-all duration-1000 ease-out`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
