import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { SeccionPostulantes } from "../components/SeccionPostulantes";
import { SeccionProveedores } from "../components/SeccionProveedores";
import AdminProductos from "../components/AdminProductos";
import { AdminSedes } from "../components/AdminSedes";
import { GestionEmpleados } from "../components/GestionEmpleados";

// --- CORRECCIÓN CRÍTICA DE IMPORTACIÓN ---
// Importamos como 'default' (sin llaves) para que coincida con el archivo Estadisticas.jsx
import Estadisticas from "../components/Estadisticas";

export const Admin = () => {
  // Estado inicial en 'estadisticas' para ver el rendimiento apenas entras
  const [pestana, setPestana] = useState("estadisticas");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {/* --- ENCABEZADO PRINCIPAL --- */}
        <div className="mb-12 animate-fadeIn">
          <h2 className="text-6xl font-black text-green-900 uppercase italic tracking-tighter leading-none">
            Panel{" "}
            <span className="text-yellow-500 underline decoration-4 underline-offset-8">
              Control
            </span>
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.4em] mt-5 ml-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Distribuidora San José • Sistema de Gestión 2026
          </p>
        </div>

        {/* --- NAVEGACIÓN POR PESTAÑAS (TABS) --- */}
        <div className="flex flex-wrap gap-2 mb-12 bg-white p-3 rounded-[35px] shadow-xl shadow-green-900/5 border border-slate-100 inline-flex w-full md:w-auto">
          {/* BOTÓN ESTADÍSTICAS */}
          <button
            onClick={() => setPestana("estadisticas")}
            className={`flex-1 md:flex-none px-8 py-4 rounded-[25px] font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
              pestana === "estadisticas"
                ? "bg-yellow-400 text-green-950 shadow-lg scale-105"
                : "text-slate-400 hover:bg-slate-50 hover:text-green-900"
            }`}
          >
            📊 Estadísticas
          </button>

          <div className="hidden md:block w-[1px] h-10 bg-slate-100 mx-2 self-center"></div>

          {/* BOTÓN INVENTARIO */}
          <button
            onClick={() => setPestana("productos")}
            className={`flex-1 md:flex-none px-8 py-4 rounded-[25px] font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
              pestana === "productos"
                ? "bg-green-900 text-white shadow-lg scale-105"
                : "text-slate-400 hover:bg-slate-50 hover:text-green-900"
            }`}
          >
            📦 Inventario
          </button>

          {/* BOTÓN SEDES */}
          <button
            onClick={() => setPestana("sedes")}
            className={`flex-1 md:flex-none px-8 py-4 rounded-[25px] font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
              pestana === "sedes"
                ? "bg-green-900 text-white shadow-lg scale-105"
                : "text-slate-400 hover:bg-slate-50 hover:text-green-900"
            }`}
          >
            📍 Sedes
          </button>

          {/* BOTÓN EQUIPO */}
          <button
            onClick={() => setPestana("empleados")}
            className={`flex-1 md:flex-none px-8 py-4 rounded-[25px] font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
              pestana === "empleados"
                ? "bg-green-900 text-white shadow-lg scale-105"
                : "text-slate-400 hover:bg-slate-50 hover:text-green-900"
            }`}
          >
            👷 Equipo WA
          </button>

          <div className="hidden md:block w-[1px] h-10 bg-slate-100 mx-2 self-center"></div>

          {/* BOTÓN CANDIDATOS */}
          <button
            onClick={() => setPestana("postulantes")}
            className={`flex-1 md:flex-none px-8 py-4 rounded-[25px] font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
              pestana === "postulantes"
                ? "bg-slate-800 text-white shadow-lg scale-105"
                : "text-slate-400 hover:bg-slate-50 hover:text-green-900"
            }`}
          >
            👥 Candidatos
          </button>

          {/* BOTÓN PROVEEDORES */}
          <button
            onClick={() => setPestana("proveedores")}
            className={`flex-1 md:flex-none px-8 py-4 rounded-[25px] font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
              pestana === "proveedores"
                ? "bg-slate-800 text-white shadow-lg scale-105"
                : "text-slate-400 hover:bg-slate-50 hover:text-green-900"
            }`}
          >
            🚚 Proveedores
          </button>
        </div>

        {/* --- ÁREA DE CARGA DINÁMICA --- */}
        <div className="bg-white/50 rounded-[40px] min-h-[500px] transition-all duration-500">
          {/* Visualización de Estadísticas (AQUÍ USAMOS EL NOMBRE CORRECTO) */}
          {pestana === "estadisticas" && (
            <div className="animate-fadeIn">
              <Estadisticas />
            </div>
          )}

          {/* Gestión de Productos */}
          {pestana === "productos" && (
            <div className="animate-fadeIn">
              <AdminProductos />
            </div>
          )}

          {/* Gestión de Sedes */}
          {pestana === "sedes" && (
            <div className="animate-fadeIn">
              <AdminSedes />
            </div>
          )}

          {/* Gestión de Empleados */}
          {pestana === "empleados" && (
            <div className="animate-fadeIn">
              <GestionEmpleados />
            </div>
          )}

          {/* Recursos Humanos */}
          {pestana === "postulantes" && (
            <div className="animate-fadeIn">
              <SeccionPostulantes />
            </div>
          )}

          {/* Gestión de Proveedores */}
          {pestana === "proveedores" && (
            <div className="animate-fadeIn">
              <SeccionProveedores />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
