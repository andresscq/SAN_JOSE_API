import React from "react";
import { Link } from "react-router-dom";
import { ProductoCard } from "./ProductoCard";

export const ProductShowcase = ({ productos, categorias, cargando }) => {
  const limpiarNombre = (n) => {
    if (!n) return "";
    let nombreCortado = n;
    const corteDolarParentesis = n.indexOf("($");
    const matchParentesisNumero = n.match(/\(\d+[\.,]/);
    const corteNumeroDecimal = matchParentesisNumero
      ? matchParentesisNumero.index
      : -1;
    const corteDolarSuelto = n.indexOf(" $");
    const indices = [
      corteDolarParentesis,
      corteNumeroDecimal,
      corteDolarSuelto,
    ].filter((i) => i !== -1);

    if (indices.length > 0) {
      nombreCortado = n.substring(0, Math.min(...indices));
    }
    return nombreCortado.trim();
  };

  const categoriasPrioritarias = categorias
    ? categorias
        .filter((c) => c.es_prioridad)
        .map((c) => c.nombre.toUpperCase())
    : [];

  const categoriasConStock = [
    ...new Set(productos.map((p) => p.nombre_categoria?.toUpperCase())),
  ].filter(Boolean);

  const listaFinal = categoriasPrioritarias
    .filter((cat) => categoriasConStock.includes(cat))
    .slice(0, 3);

  return (
    <section id="productos" className="py-24 px-6 scroll-mt-32 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <h2 className="text-5xl font-black text-green-900 uppercase italic tracking-tighter text-center md:text-left">
            Selección <span className="text-yellow-500">Premium</span>
          </h2>
          <div className="h-1 flex-grow mx-8 bg-slate-100 hidden md:block rounded-full"></div>
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase text-[15px]">
            Stock Actualizado
          </p>
        </div>

        {cargando ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center font-black text-green-800 animate-pulse uppercase tracking-widest text-[10px]">
            <div className="text-6xl mb-6">📦</div>
            Sincronizando Almacén...
          </div>
        ) : listaFinal.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-[45px] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
              No hay categorías destacadas configuradas
            </p>
          </div>
        ) : (
          <div className="space-y-32">
            {listaFinal.map((cat) => {
              const filtrados = productos
                .filter((p) => p.nombre_categoria?.toUpperCase() === cat)
                .sort(
                  (a, b) => (parseInt(b.stock) || 0) - (parseInt(a.stock) || 0),
                );

              const productosAMostrar = filtrados.slice(0, 3);

              return (
                <div key={cat} className="group/cat">
                  {/* items-stretch es vital aquí */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                    {/* Banner Lateral */}
                    <div className="md:col-span-4 bg-green-900 rounded-[45px] p-10 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                      <div className="relative z-10">
                        <span className="text-yellow-400 font-black text-[22px] tracking-[0.3em] uppercase">
                          Especialidad
                        </span>
                        <h3 className="text-5xl font-black uppercase italic mt-2 leading-none tracking-tighter">
                          {cat}
                        </h3>
                        <div className="h-[6px] w-[60px] mt-6 bg-yellow-500 rounded-full transition-all duration-500 group-hover/cat:w-[120px]"></div>
                      </div>
                      <div className="relative z-10 mt-12">
                        <p className="text-green-100/80 font-medium mb-10 text-[19px] leading-relaxed line-clamp-3">
                          {categorias.find(
                            (c) => c.nombre.toUpperCase() === cat,
                          )?.descripcion ||
                            `Calidad premium en productos de ${cat.toLowerCase()}.`}
                        </p>
                        <Link
                          to="/productos"
                          className="inline-block w-full bg-yellow-400 text-green-950 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl text-center active:scale-95"
                        >
                          Explorar Todo
                        </Link>
                      </div>
                    </div>

                    {/* Grid de Productos - LA SOLUCIÓN ESTÁ AQUÍ */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {productosAMostrar.map((prod) => (
                        <div key={prod.id} className="flex flex-col h-full">
                          {/* El div superior tiene h-full y flex-col, esto obliga a la card a estirarse */}
                          <div className="flex-grow flex flex-col h-full [&>div]:flex-grow [&>div]:flex [&>div]:flex-col">
                            <ProductoCard
                              id={prod.id}
                              nombre={limpiarNombre(prod.nombre)}
                              categoria={prod.nombre_categoria}
                              imagen={prod.imagen_url}
                              descripcion={prod.descripcion}
                              stock={prod.stock}
                              stock_alerta={prod.stock_alerta}
                            />
                          </div>
                        </div>
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
