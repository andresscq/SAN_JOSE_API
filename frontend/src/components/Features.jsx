// src/components/Features.jsx

export const Features = () => {
  const beneficios = [
    {
      icon: "🚚",
      t: "Logística Veloz",
      d: "Entrega garantizada en menos de 24h para negocios y hogares.",
    },
    {
      icon: "💰",
      t: "Mejor Precio",
      d: "Sin intermediarios. Precios competitivos de fábrica.",
    },
    {
      icon: "⭐",
      t: "Excelente Calidad",
      d: "Contamos con productos frescos y de la mejor calidad bajo estándares premium.",
    },
  ];

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {beneficios.map((item, i) => (
          <div
            key={i}
            className="group p-10 bg-slate-50 rounded-[40px] text-center border-b-8 border-yellow-400 hover:bg-green-50 hover:border-green-600 transition-all duration-300 shadow-sm hover:shadow-xl"
          >
            <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">
              {item.icon}
            </div>
            <h3 className="text-xl font-black text-green-900 mb-2 uppercase tracking-tight">
              {item.t}
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {item.d}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
