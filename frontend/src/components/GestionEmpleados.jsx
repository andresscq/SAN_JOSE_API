import React, { useState, useEffect } from "react";
import api from "../api/axios";
import {
  Users,
  Search,
  Trash2,
  Edit2,
  Phone,
  Plus,
  CheckCircle,
  XCircle,
  User,
  MessageCircle,
  X,
} from "lucide-react";

export const GestionEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    telefono: "",
    activo: true,
  });

  const cargarEmpleados = async () => {
    try {
      const res = await api.get("/api/empleados");
      setEmpleados(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al cargar empleados:", err);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = editando ? editando : nuevoEmpleado;
      if (editando) {
        await api.put(`/api/empleados/${editando.id}`, payload);
      } else {
        await api.post("/api/empleados", payload);
      }
      setEditando(null);
      setNuevoEmpleado({ nombre: "", telefono: "", activo: true });
      cargarEmpleados();
    } catch (err) {
      alert("Error al procesar la solicitud");
    }
  };

  const togglEstado = async (emp) => {
    try {
      await api.put(`/api/empleados/${emp.id}`, {
        ...emp,
        activo: !emp.activo,
      });
      cargarEmpleados();
    } catch (err) {
      alert("No se pudo cambiar el estado");
    }
  };

  const eliminarEmpleado = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      try {
        await api.delete(`/api/empleados/${id}`);
        cargarEmpleados();
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  const empleadosFiltrados = empleados.filter((emp) => {
    const n = (emp.nombre || "").toLowerCase();
    const t = emp.telefono || "";
    const coincideBusqueda =
      n.includes(busqueda.toLowerCase()) || t.includes(busqueda);
    const coincideFiltro =
      filtro === "todos"
        ? true
        : filtro === "activos"
          ? emp.activo
          : !emp.activo;
    return coincideBusqueda && coincideFiltro;
  });

  return (
    <div className="p-4 md:p-10 bg-[#FAFAFA] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-10">
          <h1 className="text-5xl font-black text-green-900 uppercase italic tracking-tighter leading-none">
            Equipo <span className="text-yellow-500">Ventas</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] mt-3 uppercase tracking-[0.4em]">
            Distribuidora San José • Control de Asesores
          </p>
        </header>

        {/* FORMULARIO DE REGISTRO */}
        <section className="mb-12">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-[40px] shadow-2xl shadow-green-900/5 border border-slate-100 flex flex-wrap gap-6 items-end relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-yellow-400"></div>

            <div className="flex-1 min-w-[280px] space-y-2">
              <label className="text-[10px] font-black text-green-800/40 uppercase ml-2 tracking-widest">
                Nombre del Asesor
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-800/30"
                  size={18}
                />
                <input
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-12 rounded-2xl font-bold text-green-900 outline-none focus:border-yellow-400 transition-all text-sm uppercase"
                  placeholder="NOMBRE COMPLETO"
                  value={editando ? editando.nombre : nuevoEmpleado.nombre}
                  onChange={(e) =>
                    editando
                      ? setEditando({ ...editando, nombre: e.target.value })
                      : setNuevoEmpleado({
                          ...nuevoEmpleado,
                          nombre: e.target.value,
                        })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex-1 min-w-[250px] space-y-2">
              <label className="text-[10px] font-black text-green-800/40 uppercase ml-2 tracking-widest">
                WhatsApp
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-800/30"
                  size={18}
                />
                <input
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-12 rounded-2xl font-bold text-green-900 outline-none focus:border-yellow-400 transition-all text-sm"
                  placeholder="593..."
                  value={editando ? editando.telefono : nuevoEmpleado.telefono}
                  onChange={(e) =>
                    editando
                      ? setEditando({ ...editando, telefono: e.target.value })
                      : setNuevoEmpleado({
                          ...nuevoEmpleado,
                          telefono: e.target.value,
                        })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="bg-green-900 text-yellow-400 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-yellow-400 hover:text-green-900 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                {editando ? <Edit2 size={16} /> : <Plus size={18} />}
                {editando ? "Guardar" : "Agregar"}
              </button>
              {editando && (
                <button
                  type="button"
                  onClick={() => setEditando(null)}
                  className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </form>
        </section>

        {/* BARRA DE BÚSQUEDA Y FILTROS JUNTOS */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10 items-center justify-between bg-white p-3 rounded-[30px] shadow-xl shadow-green-900/5 border border-slate-50">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-green-800/30"
              size={20}
            />
            <input
              type="text"
              placeholder="BUSCAR ASESOR O CELULAR..."
              className="w-full bg-transparent p-4 pl-16 outline-none font-bold text-green-900 text-sm uppercase placeholder:text-slate-300"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 w-full lg:w-auto">
            {["todos", "activos", "inactivos"].map((t) => (
              <button
                key={t}
                onClick={() => setFiltro(t)}
                className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                  filtro === t
                    ? "bg-green-900 text-yellow-400 shadow-md scale-105"
                    : "text-slate-400 hover:text-green-900"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* GRILLA DE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {empleadosFiltrados.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-[45px] p-8 shadow-2xl shadow-green-900/5 border border-white hover:border-green-900 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-2xl font-black italic shadow-lg ${emp.activo ? "bg-yellow-400 text-green-900" : "bg-slate-200 text-slate-400"}`}
                >
                  {emp.nombre.charAt(0)}
                </div>
                <button
                  onClick={() => togglEstado(emp)}
                  className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm transition-all ${emp.activo ? "bg-green-100 text-green-800" : "bg-red-50 text-red-400"}`}
                >
                  ● {emp.activo ? "Activo" : "Inactivo"}
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-900 uppercase italic truncate">
                  {emp.nombre}
                </h3>
                <p className="flex items-center gap-2 text-green-700/60 font-bold text-sm mt-1">
                  <MessageCircle size={14} className="text-yellow-500" />
                  {emp.telefono}
                </p>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-50">
                <button
                  onClick={() => {
                    setEditando(emp);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 bg-slate-50 hover:bg-yellow-400 p-4 rounded-2xl flex items-center justify-center transition-all text-slate-400 hover:text-green-900"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => eliminarEmpleado(emp.id, emp.nombre)}
                  className="flex-1 bg-slate-50 hover:bg-red-500 p-4 rounded-2xl flex items-center justify-center transition-all text-slate-400 hover:text-white"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {empleadosFiltrados.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[50px] border-4 border-dashed border-green-50 opacity-40">
            <Users className="mx-auto text-green-900/10 mb-4" size={50} />
            <p className="text-green-900/20 font-black uppercase text-xs">
              Sin asesores registrados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
