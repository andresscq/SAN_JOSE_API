import { useEffect, useState } from "react";
import api from "../api/axios";
import { Navbar } from "../components/Navbar";
import { ProductoCard } from "../components/ProductoCard";

export const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSel, setCategoriaSel] = useState("Todas");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        // Asegúrate de que esta ruta coincida con tu backend
        const respuesta = await api.get("/api/productos");
        setProductos(respuesta.data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerProductos();
  }, []);

  // 1. Categorías automáticas basadas en los productos existentes
  const categoriasDinamicas = [
    "Todas",
    ...new Set(productos.map((p) => p.nombre_categoria).filter(Boolean)),
  ];

  // 2. Filtro inteligente (Busca por nombre y filtra por categoría)
  const filtrados = productos.filter((p) => {
    const matchNombre = p.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());
    const matchCat =
      categoriaSel === "Todas" || p.nombre_categoria === categoriaSel;
    return matchNombre && matchCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-32 pb-20 px-6">
        {/* Encabezado */}
        <header className="mb-12">
          <h1 className="text-5xl font-black text-green-900 italic uppercase tracking-tighter">
            Nuestro <span className="text-yellow-500">Inventario</span>
          </h1>
          <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-[0.4em]">
            Distribuidora San José • Calidad garantizada 2026
          </p>
        </header>

        {/* Buscador Estilizado */}
        <div className="relative mb-8 group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">
            🔍
          </div>
          <input
            type="text"
            placeholder="¿Qué producto buscas hoy? (ej: Queso, Jamón, Aceite...)"
            className="w-full p-6 pl-16 bg-white rounded-[30px] shadow-sm outline-none border-2 border-transparent focus:border-green-900/10 font-bold transition-all text-green-950 placeholder:text-slate-300"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Filtros por Píldoras */}
        <div className="flex flex-wrap gap-3 mb-16 justify-center md:justify-start">
          {categoriasDinamicas.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSel(cat)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                categoriaSel === cat
                  ? "bg-green-900 text-white border-green-900 shadow-xl scale-105"
                  : "bg-white text-slate-400 hover:text-green-900 border-slate-100 shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Productos o Cargando */}
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[50px] shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-900 border-b-2 mb-4"></div>
            <p className="text-green-900 font-black text-[10px] uppercase tracking-widest animate-pulse">
              Sincronizando Almacén...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filtrados.map((prod) => (
                <ProductoCard
                  key={prod.id}
                  id={prod.id} // ✅ VITAL: Identificador único para el carrito
                  nombre={prod.nombre}
                  categoria={prod.nombre_categoria}
                  imagen={prod.imagen_url} // ✅ Pasa el nombre del archivo (ej: "uploads/imagen.png")
                  descripcion={prod.descripcion}
                  stock={prod.stock}
                  stock_alerta={prod.stock_alerta}
                />
              ))}
            </div>

            {/* Mensaje cuando no hay resultados */}
            {filtrados.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[50px] border-2 border-dashed border-slate-100 shadow-inner">
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-4">
                  No encontramos coincidencias para "{busqueda}"
                </p>
                <button
                  onClick={() => {
                    setBusqueda("");
                    setCategoriaSel("Todas");
                  }}
                  className="px-6 py-3 bg-green-50 text-green-900 font-black rounded-xl text-[10px] uppercase hover:bg-green-900 hover:text-white transition-all"
                >
                  Ver todo el inventario
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
