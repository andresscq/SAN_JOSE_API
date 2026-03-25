import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export const Sedes = () => {
  const [sedes, setSedes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerSedes = async () => {
      try {
        const respuesta = await api.get("/api/sedes");
        // Traemos las sedes (puedes limitar a 4 para el Home)
        setSedes(respuesta.data.slice(0, 4));
      } catch (error) {
        console.error("Error al cargar sedes:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerSedes();
  }, []);

  if (cargando || sedes.length === 0) return null;

  return (
    <section
      id="locales"
      className="py-24 bg-white px-6 border-t border-slate-100 scroll-mt-32"
    >
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h2 className="text-5xl font-black text-green-900 uppercase italic tracking-tighter leading-none">
            Nuestras <span className="text-yellow-500">Sedes</span>
          </h2>
          <p className="text-slate-400 text-[15px] font-bold uppercase tracking-[0.3em] mt-3">
            Distribuidora San José • Puntos de Atención y Venta
          </p>
        </header>

        {/* Grid de Sedes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sedes.map((sede) => {
            // 1. Limpieza de URL de imagen
            const rutaLimpia = sede.imagen_url
              ? sede.imagen_url.replace(/^\//, "")
              : "";
            const urlImagen = rutaLimpia
              ? `http://localhost:3000/${rutaLimpia}`
              : "https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=800&auto=format&fit=crop";

            // 2. Lógica de WhatsApp usando el TELÉFONO DEL EMPLEADO
            // El backend ahora envía 'telefono_empleado' gracias al LEFT JOIN
            const telefonoDestino = sede.telefono_empleado || "";

            const mensajeWa = encodeURIComponent(
              `¡Hola! Vengo de la web. Deseo más información sobre la sede: ${sede.nombre_sede}`,
            );

            const urlWhatsapp = `https://wa.me/${telefonoDestino}?text=${mensajeWa}`;

            return (
              <div key={sede.id} className="text-center group animate-fadeIn">
                <div className="relative overflow-hidden rounded-[40px] mb-6 aspect-square bg-slate-100 shadow-sm border border-slate-50">
                  <img
                    src={urlImagen}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={sede.nombre_sede}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400?text=San+Jose+Sedes";
                    }}
                  />

                  <div className="absolute inset-0 bg-green-950/70 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 gap-3">
                    {sede.google_maps_link && (
                      <a
                        href={sede.google_maps_link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-yellow-400 text-green-950 font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
                      >
                        📍 Ver Mapa
                      </a>
                    )}

                    {/* El botón de contactar solo funciona si hay un teléfono asignado */}
                    {telefonoDestino ? (
                      <a
                        href={urlWhatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-white text-green-950 font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-lg"
                      >
                        💬 Contactar
                      </a>
                    ) : (
                      <span className="text-white text-[9px] uppercase font-bold opacity-50">
                        Sin contacto asignado
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-black text-green-900 text-lg uppercase leading-tight mb-1 text-[19px]">
                  {sede.nombre_sede}
                </h3>

                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider text-[14px]">
                    {sede.ubicacion}
                  </p>

                  {/* Opcional: Muestra el nombre del asesor si existe */}
                  {sede.nombre_empleado && (
                    <p className="text-yellow-600 text-[16px] font-bold uppercase italic">
                      Asesor: {sede.nombre_empleado}
                    </p>
                  )}

                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                    <p className="text-green-700 text-[12px] font-black uppercase italic text-[18px]">
                      {sede.horario}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTÓN CONOCE TODAS NUESTRAS SEDES */}
        <div className="mt-20 text-center">
          <Link
            to="/todas-las-sedes"
            className="inline-block bg-green-900 text-white px-10 py-5 rounded-[22px] font-black text-[13px] uppercase tracking-[0.2em] shadow-xl shadow-green-100 hover:bg-yellow-500 hover:text-green-900 hover:-translate-y-1 transition-all duration-300"
          >
            Conoce todas nuestras sedes
          </Link>
        </div>
      </div>
    </section>
  );
};
