import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { SeccionPostulantes } from "../components/SeccionPostulantes";

export const Admin = () => {
  // Estado para controlar qué vemos (Productos o Candidatos)
  const [pestana, setPestana] = useState("productos");

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {/* ENCABEZADO */}
        <div className="mb-10">
          <h2 className="text-5xl font-black text-green-900 uppercase italic tracking-tighter">
            Panel de <span className="text-yellow-500">Administración</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 ml-1">
            Distribuidora San José • Gestión de Contenido
          </p>
        </div>

        {/* NAVEGADOR DE SECCIONES (TABS) */}
        <div className="flex gap-4 mb-12 bg-white p-2 rounded-[25px] shadow-sm inline-flex border border-slate-100">
          <button
            onClick={() => setPestana("productos")}
            className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
              pestana === "productos"
                ? "bg-green-900 text-white shadow-xl scale-105"
                : "text-slate-400 hover:bg-slate-50 hover:text-green-900"
            }`}
          >
            📦 Inventario y Precios
          </button>

          <button
            onClick={() => setPestana("postulantes")}
            className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
              pestana === "postulantes"
                ? "bg-green-900 text-white shadow-xl scale-105"
                : "text-slate-400 hover:bg-slate-50 hover:text-green-900"
            }`}
          >
            👥 Candidatos (RRHH)
          </button>
        </div>

        {/* ÁREA DE CONTENIDO */}
        <div className="transition-all duration-500">
          {pestana === "productos" ? (
            <div className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100 animate-fadeIn text-center">
              <h3 className="text-2xl font-black text-green-900 uppercase italic mb-4">
                Control de <span className="text-yellow-500">Precios</span>
              </h3>
              <div className="border-2 border-dashed border-slate-100 rounded-3xl p-20">
                <p className="text-slate-300 font-bold uppercase text-xs tracking-widest">
                  Sección de inventario conectada a PostgreSQL
                </p>
              </div>
            </div>
          ) : (
            /* Cargamos el componente que ya corregimos antes */
            <SeccionPostulantes />
          )}
        </div>
      </div>
    </div>
  );
};
