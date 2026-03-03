import { Link } from "react-router-dom"; // Importamos Link
import { ProductoCard } from "./ProductoCard";

export const ProductShowcase = ({ productos, cargando }) => {
  const categoriasAMostrar = ["Huevos", "Lácteos", "Embutidos", "Víveres"];

  return (
    <section id="productos" className="py-24 px-6 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <h2 className="text-5xl font-black text-green-900 uppercase italic tracking-tighter text-center md:text-left">
            Selección <span className="text-yellow-500">Premium</span>
          </h2>
          <div className="h-1 flex-grow mx-8 bg-slate-200 hidden md:block rounded-full"></div>
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">
            Stock Actualizado 2026
          </p>
        </div>

        {cargando ? (
          <div className="min-h-[80vh] flex flex-col items-center justify-center font-black text-green-800 animate-pulse uppercase tracking-widest">
            <div className="text-6xl mb-4">📦</div>
            Cargando inventario...
          </div>
        ) : (
          <div className="space-y-32">
            {categoriasAMostrar.map((cat) => {
              const filtrados = productos.filter((p) => p.categoria === cat);
              if (filtrados.length === 0) return null;

              return (
                <div key={cat} className="group/cat">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 bg-green-900 rounded-[45px] p-10 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl min-h-[400px]">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                      <div className="relative z-10">
                        <span className="text-yellow-400 font-black text-sm tracking-[0.3em] uppercase">
                          Categoría
                        </span>
                        <h3 className="text-5xl font-black uppercase italic mt-2 leading-none">
                          {cat}
                        </h3>
                      </div>
                      <div className="relative z-10">
                        <p className="text-green-200 font-medium mb-8 text-sm opacity-80 leading-relaxed">
                          Contamos con los mejores {cat.toLowerCase()} de la
                          región, procesados con frescura diaria.
                        </p>

                        {/* --- BOTÓN ACTUALIZADO AQUÍ --- */}
                        <Link
                          to="/productos"
                          className="inline-block bg-yellow-400 text-green-950 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors w-full md:w-auto shadow-lg text-center"
                        >
                          Ver Todo
                        </Link>
                      </div>
                    </div>

                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filtrados.slice(0, 3).map((prod) => (
                        <ProductoCard
                          key={prod.id}
                          nombre={prod.nombre}
                          precio={prod.precio_unidad}
                          local={prod.nombre_sede}
                          telefono={prod.telefono_vendedor}
                          categoria={prod.categoria}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
