// src/components/Nosotros.jsx

export const Nosotros = () => {
  return (
    <section className="py-24 bg-green-800 px-6 text-white relative overflow-hidden">
      {/* Decoración de fondo sutil */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Lado Izquierdo: Texto y Tarjetas */}
        <div className="space-y-6 relative z-10">
          <h2
            id="nosotros"
            className="text-4xl md:text-5xl font-black leading-tight uppercase italic tracking-tighter"
          >
            Más que una distribuidora, <br />
            <span className="text-yellow-400">somos tu familia.</span>
          </h2>
          <p className="text-green-100 text-lg opacity-80 font-medium">
            En San José nos apasiona la frescura. Trabajamos día a día para que
            cada negocio que confía en nosotros reciba excelencia y productos de
            primera calidad directamente del campo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
              <h4 className="font-black text-yellow-400 text-lg mb-1 tracking-widest uppercase">
                Misión
              </h4>
              <p className="text-[17px] leading-relaxed ">
                Liderar el mercado avícola y de víveres con honestidad, calidad
                y eficiencia total en cada entrega.
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
              <h4 className="font-black text-yellow-400 text-lg mb-1 tracking-widest uppercase">
                Visión
              </h4>
              <p className="text-[17px] leading-relaxed ">
                Ser reconocidos a nivel nacional por nuestra calidad de
                productos y, sobre todo, por nuestra calidez humana.
              </p>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Imagen con Estilo */}
        <div className="relative h-[400px] md:h-[550px] rounded-[50px] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 group">
          <div className="absolute inset-0 bg-green-900/20 group-hover:bg-transparent transition-colors duration-500"></div>
          <img
            src="https://tse1.explicit.bing.net/th/id/OIP.AwlHVma2aWWgtCHLs6-itAHaE8?pid=ImgDet&w=182&h=121&c=7&dpr=1,3&o=7&rm=3"
            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
            alt="Equipo de Distribuidora San José"
          />
        </div>
      </div>
    </section>
  );
};
