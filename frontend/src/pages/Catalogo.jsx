import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { Navbar } from "../components/Navbar";
import { ProductoCard } from "../components/ProductoCard";
import {
  ChevronLeft,
  ChevronRight,
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
  const [scrollPercent, setScrollPercent] = useState(0);

  // --- LÓGICA DE LIMPIEZA REFORZADA ---
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

  // --- FUNCIÓN DE TENDENCIA CORREGIDA (Doble Limpieza) ---
  const esProductoTop = (nombreOriginal) => {
    if (!nombreOriginal || tendencias.length === 0) return false;
    const nombreBase = limpiarNombre(nombreOriginal).toLowerCase();
    return tendencias.some((t) => {
      const nombreTendencia = limpiarNombre(t.nombre_producto).toLowerCase();
      return nombreBase === nombreTendencia && t.total_clicks > 10;
    });
  };

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [resProds, resStats] = await Promise.all([
          api.get("/api/productos"),
          api.get("/api/vendedores/stats"),
        ]);

        const productosLimpios = resProds.data.map((p) => ({
          ...p,
          nombreLimpio: limpiarNombre(p.nombre),
        }));

        setProductos(productosLimpios);
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

  // --- FILTRADO Y ORDENAMIENTO ---
  const filtrados = productos
    .filter((p) => {
      const matchNombre = p.nombreLimpio
        ?.toLowerCase()
        .includes(busqueda.toLowerCase());
      const matchCat =
        categoriaSel === "Todas" || p.nombre_categoria === categoriaSel;
      return matchNombre && matchCat;
    })
    .sort((a, b) => {
      const stockA = parseInt(a.stock) || 0;
      const stockB = parseInt(b.stock) || 0;
      const esTopA = esProductoTop(a.nombre);
      const esTopB = esProductoTop(b.nombre);

      if (stockA > 0 && stockB <= 0) return -1;
      if (stockA <= 0 && stockB > 0) return 1;
      if (stockA > 0 && stockB > 0) {
        if (esTopA && !esTopB) return -1;
        if (!esTopA && esTopB) return 1;
        return stockB - stockA;
      }
      return esTopB - esTopA;
    });

  const listaCarrusel = productos
    .filter((p) => esProductoTop(p.nombre))
    .slice(0, 10);

  // --- MOVIMIENTO FLUIDO ---
  const mover = (dir) => {
    if (carruselRef.current) {
      const { scrollLeft, clientWidth } = carruselRef.current;
      const desplazamiento = clientWidth * 0.8;
      const destino =
        dir === "izq"
          ? scrollLeft - desplazamiento
          : scrollLeft + desplazamiento;
      carruselRef.current.scrollTo({ left: destino, behavior: "smooth" });
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
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-5xl font-black text-green-900 italic uppercase tracking-tighter">
            Nuestro{" "}
            <span className="text-yellow-500 font-black">Inventario</span>
          </h1>
          <p className="text-slate-400 font-bold mt-2 uppercase text-[15px] tracking-[0.4em]">
            Distribuidora San José • Calidad Premium
          </p>
        </header>

        {/* BUSCADOR */}
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

        {/* CATEGORÍAS */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[4px] h-[20px] bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.4)]"></div>
          <p className="text-[21px] font-black text-green-950 tracking-[0.3em] uppercase italic leading-none">
            Nuestras Categorías
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start">
          {categoriasDinamicas.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSel(cat)}
              className={`px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-[0.12em] transition-all duration-300 border-2 ${
                categoriaSel === cat
                  ? "bg-green-900 text-white border-green-900 shadow-md scale-105"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:border-green-600 hover:text-green-800 hover:bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- SECCIÓN CARRUSEL TENDENCIAS --- */}
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
                className="absolute -left-4 top-[40%] -translate-y-1/2 z-30 bg-white/90 backdrop-blur-md p-4 rounded-full shadow-xl opacity-0 group-hover/slider:opacity-100 transition-all hover:scale-110 active:scale-90 border border-slate-100 hidden md:flex"
              >
                <ChevronLeft className="text-green-900" size={24} />
              </button>

              <div
                ref={carruselRef}
                className="flex gap-8 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar pt-4"
                onScroll={(e) => {
                  const { scrollLeft, scrollWidth, clientWidth } = e.target;
                  const totalScrollable = scrollWidth - clientWidth;
                  setScrollPercent(
                    totalScrollable > 0
                      ? (scrollLeft / totalScrollable) * 100
                      : 0,
                  );
                }}
              >
                {listaCarrusel.map((prod) => (
                  <div
                    key={`trend-${prod.id}`}
                    className="min-w-[300px] max-w-[300px] snap-center transform transition-all duration-500 hover:translate-y-[-8px]"
                  >
                    <ProductoCard
                      {...prod}
                      nombre={prod.nombreLimpio}
                      imagen={prod.imagen_url}
                      categoria={prod.nombre_categoria}
                      esTendencia={true}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => mover("der")}
                className="absolute -right-4 top-[40%] -translate-y-1/2 z-30 bg-white/90 backdrop-blur-md p-4 rounded-full shadow-xl opacity-0 group-hover/slider:opacity-100 transition-all hover:scale-110 active:scale-90 border border-slate-100 hidden md:flex"
              >
                <ChevronRight className="text-green-900" size={24} />
              </button>
            </div>

            {/* BARRITA DE PROGRESO DINÁMICA */}
            <div className="max-w-[250px] mx-auto mt-6 bg-slate-200 h-1.5 rounded-full relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-orange-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${Math.max(8, scrollPercent)}%` }}
              ></div>
            </div>
          </section>
        )}

        {/* INVENTARIO COMPLETO */}
        <section>
          <div className="flex items-center gap-3 mb-10 border-b border-slate-100 pb-5">
            <div className="p-3 bg-green-50 rounded-2xl text-green-900 border border-green-100 shadow-inner">
              <PackageCheck size={25} />
            </div>
            <h2 className="text-3xl font-black text-green-950 uppercase italic tracking-tighter">
              Inventario Completo
            </h2>
            <span className="text-[14px] font-bold text-green-900 bg-white px-5 py-2 rounded-full border border-slate-100 ml-auto">
              {filtrados.length} Productos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtrados.map((prod) => (
              <ProductoCard
                key={prod.id}
                {...prod}
                nombre={prod.nombreLimpio}
                imagen={prod.imagen_url}
                categoria={prod.nombre_categoria}
                esTendencia={esProductoTop(prod.nombre)}
              />
            ))}
          </div>

          {filtrados.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200 mt-10">
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
                No hay resultados para tu búsqueda
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
