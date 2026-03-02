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
        const respuesta = await api.get("/api/productos");
        setProductos(respuesta.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerProductos();
  }, []);

  // --- MAGIA: ESTA LÍNEA CREA LOS BOTONES SOLA ---
  // Toma todos los productos, saca las categorías y elimina las repetidas
  const categoriasDinamicas = [
    "Todas",
    ...new Set(productos.map((p) => p.categoria)),
  ];

  // Filtrado
  const filtrados = productos.filter((p) => {
    const matchNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchCat = categoriaSel === "Todas" || p.categoria === categoriaSel;
    return matchNombre && matchCat;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-32 pb-20 px-6">
        <h1 className="text-5xl font-black text-green-900 mb-10 italic uppercase">
          Inventario Total
        </h1>

        {/* Buscador */}
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          className="w-full p-5 bg-white rounded-3xl shadow-sm mb-6 outline-none border-2 border-transparent focus:border-yellow-400 font-bold"
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {/* Botones de Categorías Automáticos */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categoriasDinamicas.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSel(cat)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                categoriaSel === cat
                  ? "bg-green-700 text-white shadow-md"
                  : "bg-white text-slate-400 hover:bg-yellow-100 hover:text-green-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grilla de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtrados.map((prod) => (
            <ProductoCard
              key={prod.id}
              nombre={prod.nombre}
              precio={prod.precio_unidad}
              local={prod.nombre_sede}
              telefono={prod.telefono_vendedor}
            />
          ))}
        </div>
      </main>
    </div>
  );
};
