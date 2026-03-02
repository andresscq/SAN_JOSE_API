import { useEffect, useState } from "react";
import api from "../api/axios";
import { Navbar } from "../components/Navbar";
import { ProductoCard } from "../components/ProductoCard";

export const Home = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await api.get("/api/productos");
        setProductos(respuesta.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerProductos();
  }, []);

  const categoriasAMostrar = ["Huevos", "Lácteos", "Embutidos", "Abarrotes"];

  const sedes = [
    {
      nombre: "Sede Pueblo Blanco",
      dir: "Sector Carcelén, Calle N74",
      hora: "08:00 - 19:00",
      mapa: "https://maps.app.goo.gl/hmJFshmcWvQgkq536",
      img: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=400",
    },
    {
      nombre: "Sede Moran (identificar)",
      dir: "Av. Maldonado y Quitumbe",
      hora: "08:00 - 19:00",
      mapa: "#",
      img: "https://images.unsplash.com/photo-1582560475093-96644486859e?q=80&w=400",
    },
    {
      nombre: "Sede m(identificar)",
      dir: "Cumbayá, Sector Parque",
      hora: "08:00 - 19:00",
      mapa: "#",
      img: "https://images.unsplash.com/photo-1594892153911-370161a0e676?q=80&w=400",
    },
    {
      nombre: "Sede identificar",
      dir: "Calle Guayaquil y Espejo",
      hora: "08:00 - 19:00",
      mapa: "#",
      img: "https://images.unsplash.com/photo-1534073737927-85f1df9744a3?q=80&w=400",
    },
  ];

  return (
    <div
      id="inicio"
      className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden"
    >
      <Navbar />

      {/* --- HERO SECTION --- (INTACTO) */}
      <header className="pt-40 pb-20 bg-yellow-400 px-6 relative">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block bg-green-700 text-white px-6 py-2 rounded-full text-sm font-black mb-6 shadow-lg animate-bounce">
            ¡CALIDAD PREMIUM GARANTIZADA!
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-green-900 mb-6 tracking-tighter leading-none drop-shadow-sm">
            DISTRIBUIDORA <br />{" "}
            <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
              SAN JOSÉ
            </span>
          </h1>
          <p className="text-green-800 text-xl md:text-2xl font-bold max-w-2xl mx-auto opacity-90">
            Abasteciendo a hogares y negocios con la frescura que solo el campo
            puede dar.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {/* BOTÓN 1: VA AL CATÁLOGO (Ruta absoluta) */}
            <a href="/#productos">
              <button className="bg-green-700 text-white px-8 py-4 rounded-2xl font-black hover:bg-green-800 transition-all shadow-xl active:scale-95">
                VER PRODUCTOS
              </button>
            </a>

            <a href="#locales">
              <button className="bg-white text-green-800 px-8 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all shadow-xl active:scale-95">
                CONTÁCTANOS
              </button>
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-[60px]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.05,108.5,123.83,110,183.15,92.83c61.42-17.8,111-48.4,168.19-62.25,48.45-11.8,103.24-11,151.2,6.11"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
      </header>

      {/* --- SECCIÓN: POR QUÉ ELEGIRNOS --- (INTACTO) */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: "🚚",
              t: "Logística Veloz",
              d: "Entrega garantizada en menos de 24h para negocios y hogares.",
            },
            {
              icon: "💰",
              t: "Mejor Precio",
              d: "Sin intermediarios. Precios competitivos de fábrica.",
            },
            {
              icon: "⭐",
              t: "Exelente Calidad ",
              d: "Contamos con productos frescos y de la mejor calidad.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group p-10 bg-slate-50 rounded-[40px] text-center border-b-8 border-yellow-400 hover:bg-green-50 hover:border-green-600 transition-all duration-300"
            >
              <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-green-900 mb-2 uppercase tracking-tight">
                {item.t}
              </h3>
              <p className="text-slate-500 font-medium">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECCIÓN: NOSOTROS --- (INTACTO) */}
      <section
        id="nosotros"
        className="py-24 bg-green-800 px-6 text-white relative"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              MÁS QUE UNA DISTRIBUIDORA, SOMOS TU FAMILIA.
            </h2>
            <p className="text-green-100 text-lg opacity-80">
              En San José nos apasiona la frescura. Trabajamos día a día para
              que cada negocio que confía en nosotros reciba excelencia.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20">
                <h4 className="font-black text-yellow-400 text-lg mb-1">
                  MISIÓN
                </h4>
                <p className="text-sm">
                  Liderar el mercado avícola con honestidad, calidad y
                  eficiencia total.
                </p>
              </div>
              <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20">
                <h4 className="font-black text-yellow-400 text-lg mb-1">
                  VISIÓN
                </h4>
                <p className="text-sm">
                  Ser reconocidos por nuestra calidad de productos y calidez
                  humana.
                </p>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] rounded-[50px] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <img
              src="https://images.unsplash.com/photo-1530519729491-acf5b58d6d0a?q=80&w=800"
              className="w-full h-full object-cover"
              alt="Nosotros"
            />
          </div>
        </div>
      </section>

      {/* --- SECCIÓN: PRODUCTOS AGRUPADOS POR CATEGORÍA --- (MODIFICADO SOLO UBICACIÓN DE BOTÓN) */}
      <section id="productos" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl font-black text-green-900 uppercase">
            Nuestro Catálogo
          </h2>
          <div className="h-2 w-32 bg-yellow-400 rounded-full mt-4"></div>
        </div>

        {cargando ? (
          <div className="h-64 flex items-center justify-center space-x-3">
            <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce [animation-delay:-0.5s]"></div>
          </div>
        ) : (
          <div className="space-y-24">
            {categoriasAMostrar.map((cat) => {
              const productosFiltrados = productos.filter(
                (p) => p.categoria === cat,
              );
              if (productosFiltrados.length === 0) return null;

              return (
                <div key={cat} className="space-y-8">
                  {/* Título de categoría limpio */}
                  <div className="border-b-4 border-slate-100 pb-4">
                    <h3 className="text-4xl font-black text-green-800 uppercase tracking-tighter italic">
                      {cat}
                    </h3>
                  </div>

                  <div className="flex flex-col lg:flex-row items-stretch gap-6">
                    {/* Grid de productos (Máximo 3 para dejar espacio al botón) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-grow">
                      {productosFiltrados.slice(0, 3).map((prod) => (
                        // Dentro del .map de productos en tu Home.jsx:
                        <ProductoCard
                          key={prod.id}
                          nombre={prod.nombre}
                          precio={prod.precio_unidad} // Asegúrate que aquí diga precio_unidad
                          local={prod.nombre_sede}
                          telefono={prod.telefono_vendedor}
                          categoria={prod.categoria}
                        />
                      ))}
                    </div>

                    {/* Botón VER MÁS al lado derecho (Mantiene tu estilo original) */}
                    <div className="lg:w-48 w-full flex items-center">
                      <button className="h-full w-full bg-yellow-400 text-green-900 px-6 py-8 rounded-[35px] font-black text-sm hover:bg-green-700 hover:text-white transition-all shadow-xl active:scale-95 flex flex-col items-center justify-center gap-4">
                        <span className="text-2xl">→</span>
                        <span className="text-center leading-tight">
                          VER MÁS <br /> {cat.toUpperCase()}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* --- SECCIÓN: LOCALES --- (INTACTO) */}
      <section id="locales" className="py-24 bg-yellow-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center text-green-900 mb-16 underline decoration-yellow-400 decoration-8 underline-offset-8">
            VISÍTANOS EN NUESTRAS SEDES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sedes.map((sede, i) => (
              <div
                key={i}
                className="bg-white p-2 rounded-[35px] shadow-xl hover:shadow-2xl transition-shadow group"
              >
                <img
                  src={sede.img}
                  className="h-40 w-full object-cover rounded-[30px] mb-4 group-hover:grayscale transition-all"
                  alt={sede.nombre}
                />
                <div className="px-4 pb-4">
                  <h3 className="font-black text-green-800 text-xl">
                    {sede.nombre}
                  </h3>
                  <p className="text-slate-400 text-[11px] font-bold mb-3 uppercase tracking-widest">
                    {sede.dir}
                  </p>
                  <div className="flex items-center gap-2 mb-4 bg-green-50 p-2 rounded-xl text-green-700 text-xs font-bold">
                    <span>🕒 {sede.hora}</span>
                  </div>
                  <a
                    href={sede.mapa}
                    className="block text-center bg-yellow-400 text-green-900 font-black py-3 rounded-2xl hover:bg-green-700 hover:text-white transition-colors"
                  >
                    VER MAPA
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- (INTACTO) */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 border-b border-white/10 pb-12 mb-10">
          <div>
            <h3 className="text-3xl font-black text-yellow-400 mb-4 tracking-tighter uppercase">
              San José
            </h3>
            <p className="text-slate-400 text-sm">
              Distribución de NO SE COMO SE DICE A VIVERES DE USO DIRARIO con
              una execekeente calidad.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Secciones</h4>
            <ul className="text-slate-400 space-y-2 text-sm">
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">
                <a href="/#inicio">Inicio</a>
              </li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">
                <a href="/#productos">Catálogo de Productos </a>
              </li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">
                Trabaja con nosotros
              </li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors">
                Proveedores
              </li>
            </ul>
          </div>
          <div className="bg-green-800 p-8 rounded-3xl">
            <h4 className="font-black mb-4">¿Necesitas ayuda?</h4>
            <p className="text-xs mb-4">
              Escríbenos directamente a nuestra oficina central.
            </p>
            <button className="w-full bg-yellow-400 text-green-900 font-black py-3 rounded-xl uppercase text-xs tracking-widest">
              Soporte WhatsApp
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500 tracking-widest uppercase">
          <p>© 2026 DISTRIBUIDORA SAN JOSÉ - TODOS LOS DERECHOS RESERVADOS</p>
          <p className="text-yellow-400/50">STEVEN JÁCOME & ANDRÉS CRIOLLO</p>
        </div>
      </footer>
    </div>
  );
};
