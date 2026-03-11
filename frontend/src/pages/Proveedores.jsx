import { useState, useEffect } from "react";
import { AuthProveedor } from "../components/AuthProveedor";
import { Navbar } from "../components/Navbar";
import { FormProveedor } from "../components/FormProveedor";

export const Proveedores = () => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviado, setEnviado] = useState(false); // Estado para el mensaje de éxito

  useEffect(() => {
    const session = localStorage.getItem("usuario_distribuidora");
    if (session) {
      const datosUser = JSON.parse(session);

      // Candado de seguridad por rol
      if (datosUser.rol !== "proveedor") {
        console.warn("Acceso denegado: Rol incorrecto");
        localStorage.removeItem("usuario_distribuidora");
        setUsuario(null);
      } else {
        setUsuario(datosUser);
      }
    }
    setCargando(false);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario_distribuidora");
    window.location.reload();
  };

  if (cargando)
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-green-900">
        CARGANDO PANEL CORPORATIVO...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="pt-32 pb-20 px-6 flex justify-center">
        {!usuario ? (
          // Vista de Login/Registro si no hay sesión
          <AuthProveedor alEntrar={() => window.location.reload()} />
        ) : enviado ? (
          // --- VISTA DE ÉXITO (Aparece tras actualizar el perfil) ---
          <div className="max-w-2xl w-full text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-white p-12 md:p-20 rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-t-[12px] border-green-500">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-4xl font-black text-green-900 uppercase italic mb-4">
                ¡Perfil <span className="text-yellow-500">Actualizado!</span>
              </h2>

              <p className="text-slate-500 font-bold leading-relaxed mb-10">
                Hemos recibido la información de tu empresa y el catálogo en
                PDF. Nuestro equipo revisará los precios y productos. Pronto nos
                pondremos en contacto contigo.
              </p>

              <button
                onClick={() => setEnviado(false)}
                className="bg-green-900 text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-yellow-500 transition-all shadow-lg active:scale-95"
              >
                Volver a mi Panel
              </button>
            </div>
          </div>
        ) : (
          // --- PANEL PRINCIPAL DE GESTIÓN ---
          <div className="max-w-6xl w-full">
            <div className="relative bg-white p-8 md:p-14 rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-t-[12px] border-yellow-400">
              <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="text-center md:text-left">
                  <h1 className="text-5xl font-black text-green-900 uppercase italic leading-none mb-2">
                    Panel <span className="text-yellow-500">Corporativo</span>
                  </h1>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">
                    Sesión iniciada como: {usuario.nombre}
                  </p>
                </div>

                <button
                  onClick={cerrarSesion}
                  className="bg-red-50 text-red-600 px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  Cerrar Sesión
                </button>
              </div>

              <div className="grid lg:grid-cols-5 gap-12">
                {/* COLUMNA IZQUIERDA: Formulario */}
                <div className="lg:col-span-3 space-y-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-8 w-2 bg-green-600 rounded-full"></div>
                    <h3 className="text-xl font-black text-green-900 uppercase italic">
                      Datos de la Empresa
                    </h3>
                  </div>

                  <FormProveedor
                    usuarioId={usuario.id}
                    alEnviar={() => setEnviado(true)} // Activa la vista de éxito
                  />
                </div>

                {/* COLUMNA DERECHA: Info Adicional */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-50 p-8 rounded-[40px] border-2 border-slate-100 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:rotate-12 transition-transform duration-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-32 w-32"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>

                    <h4 className="text-green-900 font-black uppercase text-sm mb-4 italic tracking-tight">
                      Estatus de Proveedor
                    </h4>

                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[11px] font-bold text-slate-600 uppercase">
                          Verificado
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Su perfil es visible para nuestro sistema de logística.
                        Asegúrese de que su <b>RUC</b> sea válido para evitar
                        retrasos en facturación.
                      </p>

                      <div className="pt-4 border-t border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
                          Formato de Catálogo:
                        </p>
                        <ul className="text-[10px] font-bold text-green-800 space-y-2 italic">
                          <li className="flex items-center gap-2">
                            <span className="h-1 w-1 bg-green-800 rounded-full"></span>{" "}
                            PDF (Máximo 10MB)
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1 w-1 bg-green-800 rounded-full"></span>{" "}
                            Listado de Precios 2026
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-400 p-8 rounded-[40px] shadow-[0_20px_40px_rgba(234,179,8,0.2)]">
                    <h4 className="text-green-950 font-black uppercase text-sm mb-2 italic">
                      Línea Mayorista
                    </h4>
                    <p className="text-[11px] font-bold text-green-900/70 mb-4 leading-snug">
                      Para convenios de exclusividad o entregas de gran volumen,
                      contacte directamente a gerencia.
                    </p>
                    <a
                      href="mailto:proveedores@distribuidora.com"
                      className="inline-block text-[10px] font-black uppercase bg-green-950 text-white px-6 py-3 rounded-full hover:bg-white hover:text-green-950 transition-colors shadow-md"
                    >
                      Enviar Correo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
