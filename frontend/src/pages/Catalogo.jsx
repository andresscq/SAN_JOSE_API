import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { Navbar } from "../components/Navbar";
import { ProductoCard } from "../components/ProductoCard";
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Loader2,
  Flame,
  PackageCheck,
} from "lucide-react";

export const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [tendencias, setTendencias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSel, setCategoriaSel] = useState("Todas");
  const [cargando, setCargando] = useState(true);

  const carruselRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [resProds, resStats] = await Promise.all([
          api.get("/api/productos"),
          api.get("/api/vendedores/stats"),
        ]);
        setProductos(resProds.data);
        setTendencias(resStats.data.productosPopulares || []);
      } catch (error) {
        console.error("Error al sincronizar catálogo:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarTodo();
  }, []);

  const categoriasDinamicas = [
    "Todas",
    ...new Set(productos.map((p) => p.nombre_categoria).filter(Boolean)),
  ];

  const esProductoTop = (nombre) => {
    return tendencias.some(
      (t) => t.nombre_producto === nombre && t.total_clicks > 10,
    );
  };

  const filtrados = productos
    .filter((p) => {
      const matchNombre = p.nombre
        ?.toLowerCase()
        .includes(busqueda.toLowerCase());
      const matchCat =
        categoriaSel === "Todas" || p.nombre_categoria === categoriaSel;
      return matchNombre && matchCat;
    })
    .sort((a, b) => esProductoTop(b.nombre) - esProductoTop(a.nombre));

  const listaCarrusel = productos
    .filter((p) => esProductoTop(p.nombre))
    .slice(0, 10);

  const mover = (dir) => {
    if (carruselRef.current) {
      const { scrollLeft, clientWidth } = carruselRef.current;
      const x =
        dir === "izq" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      carruselRef.current.scrollTo({ left: x, behavior: "smooth" });
    }
  };

  if (cargando) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-green-900 mb-4" size={40} />
        <p className="text-green-900/50 font-black text-[10px] uppercase tracking-[0.5em]">
          Sincronizando Almacén...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-32 px-6">
        {/* Encabezado */}
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-5xl font-black text-green-900 italic uppercase tracking-tighter">
            Nuestro{" "}
            <span className="text-yellow-500 font-black">Inventario</span>
          </h1>
          <p className="text-slate-400 font-bold mt-2 uppercase text-[15px] tracking-[0.4em]">
            Distribuidora San José • Calidad Premium
          </p>
        </header>
        {/* Buscador */}
        <div className="relative mb-8">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30">
            🔍
          </div>
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full p-6 pl-16 bg-white rounded-[30px] shadow-sm outline-green-900 border-2 border-transparent focus:border-green-900/10 font-bold transition-all text-sm"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[4px] h-[20px] bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.4)]"></div>
          <p className="text-[19px] md:text-[19px] font-black text-green-900 tracking-[0.3em] uppercase italic leading-none">
            Todas nuestras categorías
          </p>
        </div>
        {/* Categorías */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start">
          {categoriasDinamicas.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSel(cat)}
              className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.12em] transition-all duration-300 border-2 ${
                categoriaSel === cat
                  ? "bg-green-900 text-white border-green-900 shadow-md scale-105"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:border-green-600 hover:text-green-800 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                {categoriaSel === cat && (
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                )}
                {cat}
              </div>
            </button>
          ))}
        </div>
        {/* SECCIÓN CARRUSEL TENDENCIAS (Cards Pequeñas, Títulos Grandes) */}
        {!busqueda && categoriaSel === "Todas" && listaCarrusel.length > 0 && (
          <section className="mb-24 relative group/slider">
            <div className="flex items-center gap-3 mb-8 px-2 border-b border-orange-100 pb-4">
              <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-100">
                <Flame size={22} fill="white" className="animate-pulse" />
              </div>
              <h2 className="text-3xl font-black text-green-950 uppercase italic tracking-tighter">
                Favoritos de la Semana
              </h2>
            </div>

            <div className="relative px-2">
              <button
                onClick={() => mover("izq")}
                className="absolute -left-2 top-1/2 -translate-y-1/2 z-30 bg-white p-3 rounded-full shadow-2xl opacity-0 group-hover/slider:opacity-100 transition-all hover:scale-110 active:scale-90"
              >
                <ChevronLeft className="text-green-900" size={20} />
              </button>

              <div
                ref={carruselRef}
                className="flex gap-4 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar pt-4" // pt-4 para el badge
                onScroll={(e) => {
                  const container = e.target;
                  setScrollIndex(
                    Math.round(container.scrollLeft / container.clientWidth),
                  );
                }}
              >
                {listaCarrusel.map((prod) => (
                  <div
                    key={`trend-${prod.id}`}
                    className="min-w-[70%] sm:min-w-[40%] lg:min-w-[25%] snap-center transform scale-[0.98] transition-transform duration-300 hover:scale-100"
                  >
                    <ProductoCard
                      {...prod}
                      imagen={prod.imagen_url}
                      categoria={prod.nombre_categoria}
                      esTendencia={true}
                      compactaTendencia={true} // ✅ Nueva prop para el diseño compacto
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => mover("der")}
                className="absolute -right-2 top-1/2 -translate-y-1/2 z-30 bg-white p-3 rounded-full shadow-2xl opacity-0 group-hover/slider:opacity-100 transition-all hover:scale-110 active:scale-90"
              >
                <ChevronRight className="text-green-900" size={20} />
              </button>
            </div>

            {/* Paginación */}
            <div className="flex justify-center gap-2 mt-2">
              {Array.from({
                length: Math.ceil(
                  listaCarrusel.length / (window.innerWidth < 768 ? 1 : 4),
                ),
              }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    scrollIndex === i
                      ? "w-10 bg-orange-500"
                      : "w-2 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </section>
        )}
        {/* SECCIÓN INVENTARIO COMPLETO (Título Título Claro) */}
        <section>
          <div className="flex items-center gap-3 mb-10 border-b border-slate-100 pb-5">
            <div className="p-3 bg-green-50 rounded-2xl text-green-900 border border-green-100 shadow-inner">
              <PackageCheck size={25} />
            </div>
            <h2 className="text-3xl font-black text-green-950 uppercase italic tracking-tighter">
              Inventario Completo
            </h2>
            <div className="h-px bg-slate-100 flex-grow ml-4 hidden md:block"></div>
            <span className="text-[14px] font-bold text-green-900 bg-white px-5 py-2 rounded-full border border-slate-100 shadow-sm ml-auto">
              {filtrados.length} Productos Encontrados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtrados.map((prod) => (
              <ProductoCard
                key={prod.id}
                {...prod}
                imagen={prod.imagen_url}
                categoria={prod.nombre_categoria}
                esTendencia={esProductoTop(prod.nombre)}
              />
            ))}
          </div>

          {filtrados.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200 mt-10">
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
                No se encontraron productos en esta búsqueda
              </p>
            </div>
          )}
        </section>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
