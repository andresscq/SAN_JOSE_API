import { useState } from "react";
import api from "../api/axios";

export const FormProveedor = ({ usuarioId, alEnviar }) => {
  const [formData, setFormData] = useState({
    nombre_empresa: "",
    ruc: "",
    telefono_corporativo: "",
  });
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  // --- 1. VALIDACIÓN MATEMÁTICA DE RUC (Ecuador) ---
  const validarRUC = (ruc) => {
    if (ruc.length !== 13 || !/^\d+$/.test(ruc)) return false;
    if (ruc.slice(10, 13) === "000") return false;

    const cedula = ruc.slice(0, 10);
    const provincia = parseInt(cedula.slice(0, 2));
    if (provincia < 1 || provincia > 24) return false;

    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let d = parseInt(cedula[i]) * (i % 2 === 0 ? 2 : 1);
      if (d > 9) d -= 9;
      suma += d;
    }
    const verificador = (10 - (suma % 10)) % 10;
    return verificador === parseInt(cedula[9]);
  };

  // --- 2. MANEJO DE INPUTS CON RESTRICCIONES EN VIVO ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Solo permitir números en RUC y Teléfono
    if (
      (name === "ruc" || name === "telefono_corporativo") &&
      value !== "" &&
      !/^\d+$/.test(value)
    ) {
      return;
    }

    if (name === "ruc" && value.length > 13) return;

    if (name === "telefono_corporativo") {
      if (value.length > 10) return;
      // Obligar a que empiece con 0 (Celular 09 o Fijo 02, 04, etc.)
      if (value.length === 1 && value !== "0") return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // --- 3. ENVÍO DE DATOS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!validarRUC(formData.ruc)) {
      setMensaje("❌ RUC inválido. Verifique los 13 dígitos.");
      return;
    }

    if (formData.telefono_corporativo.length < 9) {
      setMensaje(
        "❌ El teléfono debe tener al menos 9 dígitos (Fijo) o 10 (Celular).",
      );
      return;
    }

    if (!archivo) {
      setMensaje("❌ El catálogo PDF es obligatorio.");
      return;
    }

    setCargando(true);
    const data = new FormData();
    data.append("usuario_id", usuarioId);
    data.append("nombre_empresa", formData.nombre_empresa);
    data.append("ruc", formData.ruc);
    data.append("telefono_corporativo", formData.telefono_corporativo);
    data.append("catalogo", archivo);

    try {
      await api.post("/api/perfil-proveedor", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alEnviar(); // Dispara la vista de éxito en Proveedores.jsx
    } catch (err) {
      setMensaje("❌ Error en el servidor. Intente más tarde.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre Empresa */}
      <div>
        <label className="block text-[13px] font-black uppercase text-slate-400 mb-2 italic tracking-widest">
          Razón Social / Nombre Comercial
        </label>
        <input
          type="text"
          name="nombre_empresa"
          value={formData.nombre_empresa}
          onChange={handleChange}
          placeholder="Ej. Distribuidora San José S.A."
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-yellow-400 outline-none transition-all font-bold text-green-900"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* RUC */}
        <div>
          <label className="block text-[13px] font-black uppercase text-slate-400 mb-2 italic tracking-widest">
            RUC (13 dígitos)
          </label>
          <input
            type="text"
            name="ruc"
            value={formData.ruc}
            onChange={handleChange}
            placeholder="17XXXXXXXX001"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-yellow-400 outline-none transition-all font-bold text-green-900"
            required
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-[13px] font-black uppercase text-slate-400 mb-2 italic tracking-widest">
            Teléfono (Fijo o Celular)
          </label>
          <input
            type="text"
            name="telefono_corporativo"
            value={formData.telefono_corporativo}
            onChange={handleChange}
            placeholder="09XXXXXXXX / 02XXXXXXX"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-yellow-400 outline-none transition-all font-bold text-green-900"
            required
          />
        </div>
      </div>

      {/* Upload PDF */}
      <div>
        <label className="block text-[13px] font-black uppercase text-slate-400 mb-2 italic tracking-widest">
          Catálogo de Productos
        </label>
        <div className="relative border-2 border-dashed border-slate-200 rounded-[30px] p-10 text-center hover:border-green-500 transition-all bg-slate-50/50 group">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.size > 10 * 1024 * 1024) {
                alert("Archivo demasiado grande (Máximo 10MB)");
                e.target.value = "";
              } else {
                setArchivo(file);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            required={!archivo}
          />
          <div className="space-y-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mx-auto text-slate-300 group-hover:text-green-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-[13px] font-black text-slate-400 uppercase tracking-tighter">
              {archivo ? (
                <span className="text-green-600">✅ {archivo.name}</span>
              ) : (
                "Arrastra tu catálogo PDF aquí o haz clic"
              )}
            </p>
          </div>
        </div>
      </div>

      {mensaje && (
        <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase italic animate-pulse">
          {mensaje}
        </div>
      )}

      <button
        type="submit"
        disabled={cargando}
        className={`w-full py-5 rounded-[25px] font-black uppercase tracking-widest text-[15px] transition-all shadow-xl ${
          cargando
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-green-950 text-white hover:bg-yellow-500 hover:text-green-950 active:scale-95"
        }`}
      >
        {cargando ? "SUBIENDO INFORMACIÓN..." : "ACTUALIZAR PERFIL CORPORATIVO"}
      </button>
    </form>
  );
};
