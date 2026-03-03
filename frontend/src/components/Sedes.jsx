// src/components/Sedes.jsx

export const Sedes = () => {
  const sedes = [
    {
      nombre: "Sede Pueblo Blanco",
      dir: "Sector Carcelén, Calle N74",
      hora: "08:00 - 19:00",
      mapa: "https://maps.app.goo.gl/hmJFshmcWvQgkq536",
      img: "https://tse1.explicit.bing.net/th/id/OIP.AwlHVma2aWWgtCHLs6-itAHaE8?pid=ImgDet&w=182&h=121&c=7&dpr=1,3&o=7&rm=3",
    },
    {
      nombre: "Sede Moran (identificar)",
      dir: "Av. Maldonado y Quitumbe",
      hora: "08:00 - 19:00",
      mapa: "#",
      img: "https://tse1.explicit.bing.net/th/id/OIP.AwlHVma2aWWgtCHLs6-itAHaE8?pid=ImgDet&w=182&h=121&c=7&dpr=1,3&o=7&rm=3",
    },
    {
      nombre: "Sede m(identificar)",
      dir: "Cumbayá, Sector Parque",
      hora: "08:00 - 19:00",
      mapa: "#",
      img: "https://tse1.explicit.bing.net/th/id/OIP.AwlHVma2aWWgtCHLs6-itAHaE8?pid=ImgDet&w=182&h=121&c=7&dpr=1,3&o=7&rm=3",
    },
    {
      nombre: "Sede identificar",
      dir: "Calle Guayaquil y Espejo",
      hora: "08:00 - 19:00",
      mapa: "#",
      img: "https://tse1.explicit.bing.net/th/id/OIP.AwlHVma2aWWgtCHLs6-itAHaE8?pid=ImgDet&w=182&h=121&c=7&dpr=1,3&o=7&rm=3",
    },
  ];

  return (
    <section
      id="locales"
      className="py-24 bg-white px-6 border-t border-slate-100 scroll-mt-32" // <--- AGREGA scroll-mt-32
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-black text-center text-green-900 mb-16 uppercase italic">
          Nuestras Sedes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sedes.map((sede, i) => (
            <div key={i} className="text-center group">
              <div className="relative overflow-hidden rounded-[35px] mb-4 aspect-square">
                <img
                  src={sede.img}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={sede.nombre}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={sede.mapa}
                    className="w-full bg-yellow-400 text-green-900 font-black py-3 rounded-2xl text-xs uppercase tracking-widest shadow-lg"
                  >
                    Ver Ubicación
                  </a>
                </div>
              </div>
              <h3 className="font-black text-green-800 text-lg">
                {sede.nombre}
              </h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                {sede.dir}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
