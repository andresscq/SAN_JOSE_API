import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSel, setCategoriaSel] = useState("Todas");
  const [editandoId, setEditandoId] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const [sincronizando, setSincronizando] = useState(false);

  // Estados de formulario (Sin descripción ni stock inicial)
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [producto, setProducto] = useState({
    nombre: "",
    stock_alerta: 5,
    categoria_id: "",
  });
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  const cargarDatos = async () => {
    try {
      const [resCats, resProds] = await Promise.all([
        axios.get("http://localhost:3000/api/productos/categorias"),
        axios.get("http://localhost:3000/api/productos"),
      ]);
      setCategorias(resCats.data);
      setProductos(resProds.data);
    } catch (err) {
      console.error("Error al conectar con el servidor local");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- SINCRONIZACIÓN CONTIFICO ---
  const handleSincronizarContifico = async () => {
    setSincronizando(true);
    try {
      await axios.post("http://localhost:3000/api/productos/sincronizar");
      alert("✅ Sincronización con Contifico completada");
      await cargarDatos();
    } catch (err) {
      alert("❌ Error al sincronizar con Contifico.");
    } finally {
      setSincronizando(false);
    }
  };

  // --- LÓGICA DE CATEGORÍAS (Prioridad y Creación) ---
  const togglePrioridad = async (id, estadoActual) => {
    try {
      await axios.put(
        `http://localhost:3000/api/productos/categorias/${id}/prioridad`,
        {
          es_prioridad: !estadoActual,
        },
      );
      cargarDatos();
    } catch (err) {
      alert("Error al cambiar prioridad");
    }
  };

  const handleCrearCategoria = async () => {
    if (!nuevaCategoria.trim()) return;
    try {
      await axios.post("http://localhost:3000/api/productos/categorias", {
        nombre: nuevaCategoria,
      });
      setNuevaCategoria("");
      cargarDatos();
    } catch (err) {
      alert("Error al crear categoría");
    }
  };

  // --- BORRADO MASIVO ---
  const handleEliminarMasivo = async () => {
    if (!window.confirm(`¿Eliminar ${seleccionados.length} productos?`)) return;
    try {
      await axios.post("http://localhost:3000/api/productos/delete-many", {
        ids: seleccionados,
      });
      setSeleccionados([]);
      cargarDatos();
    } catch (err) {
      alert("Error en borrado masivo");
    }
  };

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // --- GESTIÓN DE PRODUCTOS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("stock_alerta", producto.stock_alerta);
    formData.append("categoria_id", producto.categoria_id);
    if (imagen) formData.append("imagen", imagen);

    try {
      if (editandoId) {
        await axios.put(
          `http://localhost:3000/api/productos/${editandoId}`,
          formData,
        );
      } else {
        await axios.post("http://localhost:3000/api/productos", formData);
      }
      resetFormulario();
      cargarDatos();
      alert("Guardado correctamente");
    } catch (err) {
      alert("Error al guardar producto");
    }
  };

  const resetFormulario = () => {
    setProducto({ nombre: "", stock_alerta: 5, categoria_id: "" });
    setImagen(null);
    setPreview(null);
    setEditandoId(null);
  };

  const prepararEdicion = (prod) => {
    setEditandoId(prod.id);
    setProducto({
      nombre: prod.nombre,
      stock_alerta: prod.stock_alerta,
      categoria_id: prod.categoria_id,
    });
    setPreview(
      prod.imagen_url
        ? `http://localhost:3000/${prod.imagen_url.replace(/^\//, "")}`
        : null,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-10 px-4 md:px-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 gap-6">
        <div>
          <h1 className="text-2xl font-black text-green-950 uppercase tracking-tighter">
            Administración de Inventario
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
            Sincronización directa con Contifico API
          </p>
        </div>

        <button
          onClick={handleSincronizarContifico}
          disabled={sincronizando}
          className={`group flex items-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase transition-all shadow-xl ${sincronizando ? "bg-slate-100 text-slate-400" : "bg-[#002e5d] text-white hover:bg-blue-600"}`}
        >
          <span className={sincronizando ? "animate-spin" : "text-lg"}>
            {sincronizando ? "⏳" : "☁️"}
          </span>
          {sincronizando ? "Sincronizando..." : "Sincronizar con Contifico"}
        </button>
      </div>

      {/* ACCIONES MASIVAS FLOTANTES */}
      {seleccionados.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-6 animate-in fade-in zoom-in">
          <span className="text-[10px] font-black uppercase tracking-widest">
            {seleccionados.length} Seleccionados
          </span>
          <button
            onClick={handleEliminarMasivo}
            className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-2xl text-[10px] font-black uppercase"
          >
            Eliminar 🗑️
          </button>
          <button
            onClick={() => setSeleccionados([])}
            className="text-[10px] font-black uppercase opacity-60"
          >
            Cancelar
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* PANEL IZQUIERDO: CATEGORÍAS (RESTAURADO) */}
          <div className="lg:col-span-4 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 italic">
              Categorías
            </h2>
            <div className="flex gap-2 mb-6">
              <input
                className="flex-grow p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs border-2 border-transparent focus:border-green-900/20"
                placeholder="Nueva..."
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
              />
              <button
                onClick={handleCrearCategoria}
                className="bg-green-900 text-white px-5 rounded-2xl hover:bg-yellow-500 transition-all"
              >
                ➕
              </button>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {categorias.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center bg-slate-50 p-3 px-5 rounded-2xl border border-white group"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePrioridad(c.id, c.es_prioridad)}
                      className={`text-lg transition-all ${c.es_prioridad ? "grayscale-0 scale-110" : "grayscale opacity-20 hover:opacity-100"}`}
                    >
                      ⭐
                    </button>
                    <span className="text-[11px] font-black text-slate-600 uppercase">
                      {c.nombre}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm("¿Eliminar?"))
                        axios
                          .delete(
                            `http://localhost:3000/api/productos/categorias/${c.id}`,
                          )
                          .then(cargarDatos);
                    }}
                    className="text-red-400 hover:text-red-600 font-black text-[10px]"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PANEL DERECHO: FORMULARIO PRODUCTO (SIMPLIFICADO) */}
          <div className="lg:col-span-8 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 italic">
                {editandoId ? "Modificando Producto" : "Nuevo Registro"}
              </h2>
              {editandoId && (
                <button
                  onClick={resetFormulario}
                  className="text-[10px] font-black text-red-500 uppercase"
                >
                  Cancelar Edición X
                </button>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="relative aspect-square bg-slate-50 rounded-[35px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group cursor-pointer">
                {preview ? (
                  <img
                    src={preview}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="text-center opacity-30">
                    <span className="text-4xl block">🖼️</span>
                    <p className="text-[9px] font-black uppercase mt-2">
                      Subir Foto
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setImagen(f);
                      setPreview(URL.createObjectURL(f));
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase ml-2">
                      Nombre del producto
                    </p>
                    <input
                      required
                      className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-green-900/10"
                      value={producto.nombre}
                      onChange={(e) =>
                        setProducto({ ...producto, nombre: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase ml-2">
                      Categoría
                    </p>
                    <select
                      required
                      className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none"
                      value={producto.categoria_id}
                      onChange={(e) =>
                        setProducto({
                          ...producto,
                          categoria_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Seleccionar...</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <p className="text-[9px] font-black text-red-400 uppercase">
                      Alerta Stock Bajo
                    </p>
                    <input
                      type="number"
                      className="bg-transparent w-full font-bold outline-none text-red-500"
                      value={producto.stock_alerta}
                      onChange={(e) =>
                        setProducto({
                          ...producto,
                          stock_alerta: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-900 text-white rounded-2xl font-black uppercase text-[11px] hover:bg-yellow-500 hover:text-green-950 transition-all shadow-lg"
                  >
                    {editandoId ? "Actualizar Producto" : "Guardar Producto"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* BUSCADOR Y FILTROS (ESTILO ORIGINAL) */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="relative">
            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl">
              🔍
            </span>
            <input
              className="w-full p-7 pl-20 bg-white rounded-[35px] shadow-2xl shadow-slate-200/50 outline-none font-bold text-lg border-2 border-transparent focus:border-green-900/10 transition-all"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["Todas", ...categorias.map((c) => c.nombre)].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSel(cat)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${categoriaSel === cat ? "bg-green-900 text-white shadow-lg scale-105" : "bg-white text-slate-400 border border-slate-100"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GRILLA DE PRODUCTOS (RESTAURADA CON SELECTOR) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productos
            .filter(
              (p) =>
                (categoriaSel === "Todas" ||
                  p.nombre_categoria === categoriaSel) &&
                p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
            )
            .map((prod) => {
              const isSelected = seleccionados.includes(prod.id);
              const stockBajo = prod.stock <= prod.stock_alerta;
              return (
                <div
                  key={prod.id}
                  className={`bg-white rounded-[40px] overflow-hidden shadow-sm border-2 transition-all duration-500 relative ${isSelected ? "border-green-500 ring-8 ring-green-50" : "border-slate-50 hover:shadow-2xl"}`}
                >
                  <div
                    onClick={() => toggleSeleccion(prod.id)}
                    className={`absolute top-5 right-5 z-10 w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center ${isSelected ? "bg-green-500 border-green-500 shadow-lg" : "bg-white/50 border-white"}`}
                  >
                    {isSelected && (
                      <span className="text-white text-[10px]">✓</span>
                    )}
                  </div>

                  <div className="h-56 bg-slate-100 relative">
                    <img
                      src={
                        prod.imagen_url
                          ? `http://localhost:3000/${prod.imagen_url.replace(/^\//, "")}`
                          : "https://via.placeholder.com/400"
                      }
                      className="w-full h-full object-cover"
                      alt={prod.nombre}
                    />
                  </div>

                  <div className="p-8">
                    <h3 className="font-black text-slate-900 uppercase text-[13px] mb-2 line-clamp-2 h-10">
                      {prod.nombre}
                    </h3>
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className={`text-[9px] font-black px-4 py-1.5 rounded-full ${stockBajo ? "bg-red-50 text-red-600 animate-pulse" : "bg-green-50 text-green-700"}`}
                      >
                        {prod.stock} DISPONIBLES
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => prepararEdicion(prod)}
                        className="flex-grow bg-yellow-400 text-green-950 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-green-950 hover:text-white transition-all"
                      >
                        Editar
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("¿Eliminar?")) {
                            await axios.delete(
                              `http://localhost:3000/api/productos/${prod.id}`,
                            );
                            cargarDatos();
                          }
                        }}
                        className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AdminProductos;
