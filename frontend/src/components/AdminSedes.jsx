import React, { useState, useEffect } from "react";
import api from "../api/axios";

export const AdminSedes = () => {
  const [sedes, setSedes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    nombre_sede: "",
    ubicacion: "",
    horario: "08:00 - 19:00",
    empleado_id: "",
    google_maps_link: "",
    imagen: null,
  });

  const cargarSedes = async () => {
    try {
      const res = await api.get("/api/sedes");
      setSedes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al cargar sedes", err);
    }
  };

  const cargarEmpleados = async () => {
    try {
      const res = await api.get("/api/empleados");
      // Filtramos solo los activos para que aparezcan en el selector
      setEmpleados(
        res.data.filter((emp) => emp.activo === 1 || emp.activo === true),
      );
    } catch (err) {
      console.error("Error al cargar empleados", err);
    }
  };

  useEffect(() => {
    cargarSedes();
    cargarEmpleados();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imagen: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("nombre_sede", formData.nombre_sede);
    data.append("ubicacion", formData.ubicacion);
    data.append("horario", formData.horario);
    // IMPORTANTE: Si no hay asesor, mandamos cadena vacía para que el backend maneje el NULL
    data.append("empleado_id", formData.empleado_id || "");
    data.append("google_maps_link", formData.google_maps_link);

    if (formData.imagen) {
      data.append("imagen", formData.imagen);
    }

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editandoId) {
        await api.put(`/api/sedes/${editandoId}`, data, config);
      } else {
        await api.post("/api/sedes", data, config);
      }

      cerrarModal();
      cargarSedes();
    } catch (error) {
      console.error("Error al enviar:", error.response?.data || error.message);
      alert("Error al procesar la sede");
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditandoId(null);
    setPreviewImage(null);
    setFormData({
      nombre_sede: "",
      ubicacion: "",
      horario: "08:00 - 19:00",
      empleado_id: "",
      google_maps_link: "",
      imagen: null,
    });
  };

  const prepararEdicion = (sede) => {
    setEditandoId(sede.id);
    setFormData({
      nombre_sede: sede.nombre_sede || "",
      ubicacion: sede.ubicacion || "",
      horario: sede.horario || "08:00 - 19:00",
      // CORRECCIÓN: Convertimos el ID a String para que el <select> haga match correctamente
      empleado_id: sede.empleado_id ? String(sede.empleado_id) : "",
      google_maps_link: sede.google_maps_link || "",
      imagen: null,
    });
    setPreviewImage(
      sede.imagen_url ? `http://localhost:3000${sede.imagen_url}` : null,
    );
    setModalAbierto(true);
  };

  const eliminarSede = async (id) => {
    if (window.confirm("¿Eliminar esta sede definitivamente?")) {
      try {
        await api.delete(`/api/sedes/${id}`);
        cargarSedes();
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div className="p-8 bg-slate-50/50 min-h-screen">
      {/* Cabecera Principal */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
        <div>
          <h2 className="text-[40px] font-black text-green-900 uppercase italic leading-none tracking-tighter text-center md:text-left">
            Gestión de <span className="text-yellow-500">Sedes</span>
          </h2>
          <p className="text-slate-400 text-[14px] font-black uppercase tracking-[0.4em] mt-2 text-center md:text-left">
            Infraestructura San José 2026
          </p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-green-900 text-white px-10 py-5 rounded-[25px] font-black text-[12px] uppercase tracking-widest hover:bg-yellow-500 hover:text-green-900 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(20,83,45,0.3)] active:scale-95"
        >
          + Nueva Sede Corporativa
        </button>
      </div>

      {/* Grid de Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {sedes.map((s) => (
          <div
            key={s.id}
            className="group bg-white rounded-[50px] overflow-hidden border border-green-900 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_-20px_rgba(20,83,45,0.15)] transition-all duration-700 hover:-translate-y-3"
          >
            <div className="relative h-[220px] overflow-hidden">
              <img
                src={
                  s.imagen_url
                    ? `http://localhost:3000${s.imagen_url}`
                    : "https://via.placeholder.com/400?text=San+Jose"
                }
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt="sede"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 to-transparent"></div>
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl">
                <p className="text-[14px] font-black text-green-900 uppercase italic">
                  🕒 {s.horario}
                </p>
              </div>
            </div>

            <div className="p-8 pt-10 relative">
              <h4 className="text-[24px] font-black text-green-900 uppercase italic leading-none mb-3">
                {s.nombre_sede}
              </h4>
              <p className="text-slate-400 font-bold text-[15px] mb-6 line-clamp-1">
                {s.ubicacion}
              </p>

              {/* Info del Asesor */}
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 mb-8 flex items-center gap-4 group-hover:bg-green-50 transition-colors">
                <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center text-white font-black text-[10px]">
                  {s.nombre_empleado?.charAt(0) || "S"}
                </div>
                <div>
                  <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">
                    Responsable
                  </p>
                  <p className="text-[14px] font-black text-green-900 uppercase italic">
                    {s.nombre_empleado || "Sin asignar (Central)"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => prepararEdicion(s)}
                  className="flex-1 py-4 bg-green-900 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-yellow-500 hover:text-green-900 transition-all shadow-lg"
                >
                  Configurar
                </button>
                <button
                  onClick={() => eliminarSede(s.id)}
                  className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[16px] uppercase hover:bg-red-500 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Rediseñado */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-green-950/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-lg p-10 rounded-[55px] shadow-2xl relative animate-in zoom-in duration-300"
          >
            <h3 className="text-[29px] font-black text-green-900 mb-8 uppercase italic tracking-tighter text-center">
              Panel de <span className="text-yellow-500">Sede</span>
            </h3>

            <div className="space-y-4">
              <div className="flex justify-center mb-8">
                <label className="relative w-36 h-36 rounded-[35px] overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 cursor-pointer flex flex-col items-center justify-center hover:border-green-500 transition-colors">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-2xl block">📸</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Subir Fachada
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-black text-green-900 uppercase ml-3">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-4 bg-slate-100 rounded-2xl text-[12px] font-bold outline-none border-2 border-transparent focus:border-green-600 focus:bg-white"
                    value={formData.nombre_sede}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre_sede: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-black text-green-900 uppercase ml-3">
                    Asesor
                  </label>
                  <select
                    className="w-full p-4 bg-slate-100 rounded-2xl text-[12px] font-bold outline-none border-2 border-transparent focus:border-green-600 focus:bg-white cursor-pointer"
                    value={formData.empleado_id}
                    onChange={(e) =>
                      setFormData({ ...formData, empleado_id: e.target.value })
                    }
                  >
                    <option value="">Atención Central</option>
                    {empleados.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-black text-green-900 uppercase ml-3">
                  Dirección
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-4 bg-slate-100 rounded-2xl text-[12px] font-bold outline-none border-2 border-transparent focus:border-green-600"
                  value={formData.ubicacion}
                  onChange={(e) =>
                    setFormData({ ...formData, ubicacion: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  className="w-full p-4 bg-slate-100 rounded-2xl text-[12px] font-bold outline-none border-2 border-transparent focus:border-green-600"
                  value={formData.horario}
                  onChange={(e) =>
                    setFormData({ ...formData, horario: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="w-full p-4 bg-slate-100 rounded-2xl text-[12px] font-bold outline-none border-2 border-transparent focus:border-green-600"
                  value={formData.google_maps_link}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      google_maps_link: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button
                type="button"
                onClick={cerrarModal}
                className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black uppercase text-[12px] tracking-widest shadow-xl hover:bg-red-700 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-900 text-white py-4 rounded-2xl font-black uppercase text-[12px] tracking-widest shadow-xl hover:bg-yellow-500 hover:text-green-900 transition-all"
              >
                {editandoId ? "Actualizar" : "Guardar Sede"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
