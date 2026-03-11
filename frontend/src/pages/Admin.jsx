import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { SeccionPostulantes } from "../components/SeccionPostulantes";
import { SeccionProveedores } from "../components/SeccionProveedores"; // ✅ Importación vital

export const Admin = () => {
  // Estado para controlar qué sección vemos
  const [pestana, setPestana] = useState("productos");

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {/* ENCABEZADO */}
        <div className="mb-10 animate-fadeIn">
          <h2 className="text-5xl font-black text-green-900 uppercase italic tracking-tighter leading-none">
            Panel de <span className="text-yellow-500">Administración</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3 ml-1">
            Distribuidora San José • Gestión de Contenido Corporativo
          </p>
        </div>

        {/* NAVEGADOR DE SECCIONES (TABS) */}
        <div className="flex flex-wrap gap-3 mb-12 bg-white p-2 rounded-[30px] shadow-sm inline-flex border border-slate-100">
          <button
            onClick={() => setPestana("productos")}
            className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
              pestana === "productos"
                ? "bg-green-900 text-white shadow-xl scale-105"
                : "text-slate-400 hover:bg-slate-50 hover:text-green-900"
            }`}
          >
            📦 Inventario
          </button>

          <button
            onClick={() => setPestana("postulantes")}
            className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
              pestana === "postulantes"
                ? "bg-green-900 text-white shadow-xl scale-105"
                : "text-slate-400 hover:bg-slate-50 hover:text-green-900"
            }`}
          >
            👥 RRHH / Candidatos
          </button>

          <button
            onClick={() => setPestana("proveedores")}
            className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
              pestana === "proveedores"
                ? "bg-green-900 text-white shadow-xl scale-105"
                : "text-slate-400 hover:bg-slate-50 hover:text-green-900"
            }`}
          >
            🚚 Proveedores
          </button>
        </div>

        {/* ÁREA DE CONTENIDO DINÁMICO */}
        <div className="transition-all duration-500 min-h-[400px]">
          {/* SECCIÓN 1: PRODUCTOS */}
          {pestana === "productos" && (
            <div className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100 animate-fadeIn text-center">
              <h3 className="text-2xl font-black text-green-900 uppercase italic mb-4">
                Control de <span className="text-yellow-500">Precios</span>
              </h3>
              <div className="border-2 border-dashed border-slate-100 rounded-3xl p-20">
                <p className="text-slate-300 font-bold uppercase text-xs tracking-widest">
                  Módulo de inventario en desarrollo
                </p>
              </div>
            </div>
          )}

          {/* SECCIÓN 2: RRHH */}
          {pestana === "postulantes" && <SeccionPostulantes />}

          {/* SECCIÓN 3: PROVEEDORES */}
          {pestana === "proveedores" && <SeccionProveedores />}
        </div>
      </div>
    </div>
  );
};
