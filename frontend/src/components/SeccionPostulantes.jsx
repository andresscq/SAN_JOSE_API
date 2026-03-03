import { useState, useEffect } from "react";
import api from "../api/axios";

export const SeccionPostulantes = () => {
  const [postulantes, setPostulantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [idExpandido, setIdExpandido] = useState(null);

  // NUEVO: Estado para el filtro por categoría
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  useEffect(() => {
    obtenerPostulantes();
  }, []);

  const obtenerPostulantes = async () => {
    try {
      const res = await api.get("/api/postulantes");
      setPostulantes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await api.put(`/api/postulantes/${id}/estado`, { estado: nuevoEstado });
      obtenerPostulantes();
    } catch (error) {
      alert("Error al actualizar");
    }
  };

  const eliminarPostulante = async (id) => {
    if (window.confirm("¿Eliminar permanentemente?")) {
      try {
        await api.delete(`/api/postulantes/${id}`);
        obtenerPostulantes();
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  const contactarWhatsApp = (nombre, telefono) => {
    let numLimpio = telefono.replace(/\D/g, "");
    if (numLimpio.startsWith("0")) numLimpio = numLimpio.substring(1);
    const mensaje = encodeURIComponent(
      `Hola ${nombre}, te saludamos de Distribuidora San José. 👋`,
    );
    window.open(`https://wa.me/593${numLimpio}?text=${mensaje}`, "_blank");
  };

  // LÓGICA DE FILTRADO COMBINADA (Búsqueda + Estado)
  const postulantesFiltrados = postulantes.filter((p) => {
    const coincideNombre = p.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const estadoCandidato = p.estado || "Pendiente";
    const coincideEstado =
      filtroEstado === "Todos" || estadoCandidato === filtroEstado;
    return coincideNombre && coincideEstado;
  });

  if (cargando)
    return (
      <div className="p-20 text-center font-black animate-pulse text-green-900">
        CARGANDO...
      </div>
    );

  return (
    <div className="mt-5 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
        <div>
          <h2 className="text-5xl font-black text-green-900 italic uppercase tracking-tighter">
            Panel <span className="text-yellow-500">Talento</span>
          </h2>
          <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-[0.3em]">
            Distribuidora San José
          </p>
        </div>
        <input
          type="text"
          placeholder="BUSCAR NOMBRE..."
          className="w-full md:w-80 p-4 rounded-2xl border-4 border-slate-100 focus:border-yellow-400 outline-none font-black uppercase text-xs shadow-xl transition-all"
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* FILTROS POR ESTADO (NUEVO) */}
      <div className="flex flex-wrap gap-3 mb-10 bg-slate-100 p-2 rounded-[25px] w-fit">
        {["Todos", "Me interesa", "Pendiente", "Rechazado"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFiltroEstado(tab)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              filtroEstado === tab
                ? "bg-green-900 text-white shadow-lg scale-105"
                : "text-slate-500 hover:bg-white hover:text-green-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {postulantesFiltrados.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-[45px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col hover:border-green-200 transition-all duration-300"
          >
            <div className="p-10 flex-grow">
              <div className="flex justify-between items-start mb-8">
                <div className="flex gap-5">
                  <div className="h-16 w-16 bg-green-900 rounded-[22px] flex items-center justify-center text-white text-3xl font-black italic shadow-lg transform -rotate-3">
                    {p.nombre.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">
                      {p.nombre}
                    </h4>
                    <span
                      className={`inline-block px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        (p.estado || "Pendiente") === "Me interesa"
                          ? "bg-yellow-400 text-green-900"
                          : (p.estado || "Pendiente") === "Rechazado"
                            ? "bg-red-100 text-red-600"
                            : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      • {p.estado || "Pendiente"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => eliminarPostulante(p.id)}
                  className="bg-red-50 text-red-300 hover:bg-red-500 hover:text-white w-12 h-12 rounded-2xl transition-all flex items-center justify-center"
                >
                  🗑️
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-5 rounded-[25px]">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
                    Perfil
                  </p>
                  <p className="text-[11px] font-bold text-slate-700 uppercase">
                    {p.edad} Años • {p.estudio}
                  </p>
                </div>
                <div className="bg-green-50/50 p-5 rounded-[25px]">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
                    WhatsApp
                  </p>
                  <p className="text-[11px] font-black text-green-700">
                    {p.telefono}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <div className="bg-slate-50/80 p-6 rounded-[30px] border border-slate-100 relative">
                  <p
                    className={`text-[13px] text-slate-600 leading-relaxed ${idExpandido === p.id ? "" : "line-clamp-2"}`}
                  >
                    {p.experiencia || "Sin experiencia detallada."}
                  </p>
                  {p.experiencia && p.experiencia.length > 90 && (
                    <button
                      onClick={() =>
                        setIdExpandido(idExpandido === p.id ? null : p.id)
                      }
                      className="text-[10px] font-black text-green-800 underline mt-3 block"
                    >
                      {idExpandido === p.id ? "↑ VER MENOS" : "↓ LEER MÁS"}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => actualizarEstado(p.id, "Me interesa")}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-green-900 text-[10px] font-black py-4 rounded-2xl uppercase transition-all shadow-lg active:scale-95"
                >
                  ⭐ Interesa
                </button>
                <button
                  onClick={() => actualizarEstado(p.id, "Pendiente")}
                  className="flex-1 bg-slate-100 text-slate-400 hover:text-green-900 text-[10px] font-black py-4 rounded-2xl uppercase transition-all"
                >
                  ⏳ Espera
                </button>
                <button
                  onClick={() => actualizarEstado(p.id, "Rechazado")}
                  className="flex-1 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white text-[10px] font-black py-4 rounded-2xl uppercase transition-all"
                >
                  ❌ Rechazar
                </button>
              </div>
            </div>

            <div className="bg-slate-900 p-6 flex justify-between items-center px-10">
              <button
                onClick={() => contactarWhatsApp(p.nombre, p.telefono)}
                className="bg-[#25D366] text-white text-[11px] font-black px-6 py-3 rounded-[18px] hover:scale-105 transition-all"
              >
                📱 CONTACTAR
              </button>
              <a
                href={`http://localhost:3000/${p.hoja_de_vida_url?.replace(/\\/g, "/")}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white text-slate-900 px-6 py-3 rounded-[18px] text-[10px] font-black hover:bg-yellow-400 transition-all uppercase"
              >
                VER CV PDF
              </a>
            </div>
          </div>
        ))}
      </div>

      {postulantesFiltrados.length === 0 && (
        <div className="text-center p-20 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-200 mt-10 italic font-black text-slate-400 uppercase tracking-widest">
          No hay candidatos en la categoría: {filtroEstado}
        </div>
      )}
    </div>
  );
};
