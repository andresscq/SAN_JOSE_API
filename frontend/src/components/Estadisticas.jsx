import React, { useState, useEffect } from "react";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Users,
  RefreshCw,
  Loader2,
  Crown,
  BarChart3,
  Zap,
  Clock3,
  Activity,
} from "lucide-react";

const Estadisticas = () => {
  const [data, setData] = useState([]);
  const [datosHorarios, setDatosHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Paleta Vibrante San José
  const COLORES_BARRAS = [
    "#064e3b",
    "#059669",
    "#10b981",
    "#34d399",
    "#60a5fa",
    "#3b82f6",
    "#8b5cf6",
  ];

  // ... (imports y resto del código igual)

  const cargarStats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/vendedores/stats");

      // 1. Procesar Asesores
      if (res.data && Array.isArray(res.data.clicksPorAsesor)) {
        setData(
          res.data.clicksPorAsesor.map((item) => ({
            name: item.nombre.split(" ")[0],
            full: item.nombre,
            value: item.clicks || 0,
          })),
        );
      }

      // 2. Procesar Horas con RELLENO DE CEROS (7am a 10pm)
      if (res.data && Array.isArray(res.data.interaccionesPorHora)) {
        const servidorDatos = res.data.interaccionesPorHora;
        const horarioFijo = [];

        for (let h = 7; h <= 22; h++) {
          const encontrado = servidorDatos.find((d) => parseInt(d.hora) === h);
          horarioFijo.push({
            hora: (h % 12 || 12) + (h >= 12 ? "pm" : "am"),
            cantidad: encontrado ? encontrado.cantidad : 0,
          });
        }
        setDatosHorarios(horarioFijo);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ... (El resto del return del componente se mantiene igual)

  useEffect(() => {
    cargarStats();
  }, []);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  if (loading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-slate-50/50 backdrop-blur-md rounded-[40px] border border-white shadow-xl">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-25"></div>
          <Loader2
            className="relative animate-spin text-green-700 mb-4"
            size={50}
          />
        </div>
        <p className="text-green-800/40 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">
          Sincronizando San José 2026
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-10 pb-10 p-2">
      {/* --- HEADER KPI --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-green-950 via-green-900 to-green-800 p-9 rounded-[45px] text-white shadow-2xl relative overflow-hidden border-b-[10px] border-green-600">
          <Zap className="absolute right-0 top-0 p-8 opacity-10" size={160} />
          <p className="text-green-300 font-black text-[11px] uppercase tracking-[0.4em] mb-4">
            Total Consultas Hoy
          </p>
          <h3 className="text-8xl font-black tracking-tighter italic tabular-nums leading-none">
            {total}
          </h3>
          <p className="flex items-center gap-2 text-green-200/60 font-bold text-xs uppercase tracking-widest mt-4">
            <Activity size={14} className="animate-pulse" /> Tráfico de WhatsApp
            en vivo
          </p>
        </div>

        <div className="bg-white p-9 rounded-[45px] border border-slate-100 shadow-sm flex flex-col justify-between border-b-[10px] border-yellow-400 hover:scale-[1.02] transition-transform">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-200">
            <Crown className="text-white" size={32} />
          </div>
          <h4 className="text-2xl font-black text-green-950 uppercase truncate leading-tight">
            {data[0]?.full || "---"}
          </h4>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-1">
            Líder del Día
          </p>
        </div>

        <div className="bg-white p-9 rounded-[45px] border border-slate-100 shadow-sm flex flex-col justify-between border-b-[10px] border-green-600 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start">
            <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center border border-green-100 text-green-800">
              <Users size={32} />
            </div>
            <button
              onClick={cargarStats}
              className="p-3 bg-slate-50 hover:bg-green-100 rounded-2xl text-slate-300 hover:text-green-800 transition-all"
            >
              <RefreshCw size={22} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <h4 className="text-5xl font-black text-green-950 tabular-nums">
            {data.length}
          </h4>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
            Vendedores Activos
          </p>
        </div>
      </div>

      {/* --- GRÁFICO BARRAS --- */}
      <div className="bg-white p-10 rounded-[55px] shadow-lg border border-slate-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-green-50 rounded-2xl border border-green-100 text-green-800">
            <BarChart3 size={26} />
          </div>
          <h3 className="text-3xl font-black text-green-950 uppercase tracking-tighter italic leading-none">
            Rendimiento por Asesor
          </h3>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11, fontWeight: "900" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc", radius: 20 }}
                contentStyle={{
                  borderRadius: "20px",
                  border: "none",
                  boxShadow: "0 20px 25px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="value" radius={[15, 15, 15, 15]} barSize={55}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORES_BARRAS[index % COLORES_BARRAS.length]}
                    stroke={index === 0 ? "#EAB308" : "none"}
                    strokeWidth={index === 0 ? 5 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- TENDENCIA HORARIA --- */}
      <div className="bg-white p-10 rounded-[55px] shadow-lg border border-slate-100 relative">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-2xl border border-yellow-100 text-yellow-700">
              <Clock3 size={26} />
            </div>
            <h3 className="text-3xl font-black text-green-950 uppercase tracking-tighter italic leading-none">
              Picos de Actividad Real
            </h3>
          </div>
          <div className="bg-green-950 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={14} className="text-yellow-400" /> Historial de
            Hoy
          </div>
        </div>
        <div className="h-[350px] w-full">
          {datosHorarios.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={datosHorarios}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="hora"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: "700" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#cbd5e1", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "20px", border: "none" }}
                />
                <Area
                  type="monotone"
                  dataKey="cantidad"
                  stroke="#10b981"
                  strokeWidth={4}
                  fill="url(#areaGrad)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-300 font-bold uppercase text-xs tracking-[0.3em]">
              Esperando actividad horaria...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
