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
  Loader2,
  Crown,
  BarChart3,
  Zap,
  Clock3,
  Activity,
  Flame,
  Package,
  Trophy,
  Star,
  CheckCircle2,
} from "lucide-react";

const Estadisticas = () => {
  const [data, setData] = useState([]);
  const [datosHorarios, setDatosHorarios] = useState([]);
  const [productosPopulares, setProductosPopulares] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORES_BARRAS = [
    "#064e3b",
    "#059669",
    "#10b981",
    "#34d399",
    "#60a5fa",
    "#3b82f6",
    "#8b5cf6",
  ];

  const cargarStats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/vendedores/stats");

      if (res.data && res.data.clicksPorAsesor) {
        setData(
          res.data.clicksPorAsesor.map((item) => ({
            name: item.nombre.split(" ")[0],
            full: item.nombre,
            value: item.clicks || 0,
          })),
        );
      }

      if (res.data && res.data.interaccionesPorHora) {
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

      if (res.data && res.data.productosPopulares) {
        setProductosPopulares(res.data.productosPopulares);
      }
    } catch (err) {
      console.error("Error al cargar stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarStats();
  }, []);

  const totalMes = data.reduce((acc, curr) => acc + curr.value, 0);

  if (loading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-slate-50/50 rounded-[45px] border border-white">
        <Loader2 className="animate-spin text-green-700 mb-4" size={50} />
        <p className="text-green-800/40 font-black text-[10px] uppercase tracking-[0.5em]">
          Cargando Dashboard San José...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-10 pb-10 p-2">
      {/* SECCIÓN 1: KPIs SUPERIORES (AJUSTE DE EQUILIBRIO) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
        {/* CARD PRINCIPAL: CONSULTAS (VOLVEMOS AL DISEÑO ORIGINAL PERO AJUSTADO) */}
        <div className="md:col-span-2 bg-gradient-to-br from-green-950 via-green-900 to-green-800 p-10 rounded-[45px] text-white shadow-2xl relative overflow-hidden border-b-[10px] border-green-600 flex flex-col justify-between group">
          <Zap
            className="absolute right-0 top-0 p-8 opacity-10 text-green-400 group-hover:rotate-12 transition-transform duration-700"
            size={180}
          />

          <div className="relative z-10">
            <p className="text-green-300 font-black text-[15px] uppercase tracking-[0.4em] mb-4">
              Consultas este Mes
            </p>
            <h3 className="text-9xl font-black tracking-tighter italic leading-none tabular-nums drop-shadow-xl">
              {totalMes}
            </h3>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-green-200/60 font-bold text-s uppercase tracking-widest mt-4">
            <Activity size={19} className="animate-pulse text-yellow-400" />{" "}
            Rendimiento Acumulado
          </div>
        </div>

        {/* LÍDER DEL MES (AJUSTADO PARA EQUILIBRAR) */}
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 rounded-[45px] shadow-2xl flex flex-col justify-between border-b-[10px] border-yellow-500 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
          <div className="absolute inset-0 bg-yellow-500 blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div className="absolute -right-4 -top-4 opacity-10 z-0">
            <Trophy size={140} className="text-yellow-400 rotate-12" />
          </div>

          <div className="relative z-10 flex-grow">
            <div className="mb-5 bg-gradient-to-br from-yellow-400 to-orange-500 w-14 h-14 rounded-[20px] flex items-center justify-center shadow-xl shadow-yellow-900/50 animate-bounce-slow">
              <Crown className="text-white" size={30} />
            </div>
            <p className="text-yellow-200 font-black text-[12px] uppercase tracking-[0.4em] mb-1.5 flex items-center gap-1.5">
              <Star size={19} className="fill-yellow-400 text-yellow-400" />{" "}
              Asesor del Mes
            </p>
            <h4 className="text-3xl font-black text-green-300 uppercase leading-none italic break-words">
              {data[0]?.full || "---"}
            </h4>
          </div>

          <div className="relative z-10 mt-4 bg-yellow-950/50 px-4 py-2 rounded-xl border border-yellow-800 self-start">
            <span className="text-yellow-300 font-black text-[13px] uppercase tracking-tight italic flex items-center gap-1.5">
              <Trophy size={12} /> Top Rank
            </span>
          </div>
        </div>

        {/* VENDEDORES ACTIVOS (AJUSTADO PARA EQUILIBRAR) */}
        <div className="bg-green-600 p-8 rounded-[45px] shadow-lg flex flex-col justify-between border-b-[10px] border-green-800 text-white relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
            <Users size={160} />
          </div>

          <div className="relative z-10">
            <div className="bg-white/10 w-16 h-16 rounded-3xl flex items-center justify-center border border-white/20 mb-7 shadow-inner">
              <Users size={32} />
            </div>
            <h4 className="text-6xl font-black text-white tabular-nums leading-none drop-shadow-lg">
              {data.length}
            </h4>
            <p className="text-green-100 font-black text-[11px] uppercase tracking-[0.4em] mt-1.5 mb-3">
              Vendedores Activos
            </p>
          </div>

          <div className="relative z-10 bg-green-900/50 px-3.5 py-1.5 rounded-lg border border-green-700/50 self-start flex items-center gap-1.5">
            <CheckCircle2 size={11} className="text-green-300 animate-pulse" />
            <span className="text-green-100 font-bold text-[12px] uppercase tracking-widest">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: GRÁFICO DE ASESORES */}
      <div className="bg-white p-10 rounded-[55px] shadow-lg border border-slate-100 hover:shadow-2xl transition-shadow duration-500">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-green-50 rounded-2xl border border-green-100 text-green-800">
            <BarChart3 size={26} />
          </div>
          <h3 className="text-3xl font-black text-green-950 uppercase tracking-tighter italic leading-none">
            Rendimiento Mensual por Asesor
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
                contentStyle={{ borderRadius: "20px", border: "none" }}
              />
              <Bar dataKey="value" radius={[18, 18, 18, 18]} barSize={60}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORES_BARRAS[index % COLORES_BARRAS.length]}
                    stroke={index === 0 ? "#EAB308" : "none"}
                    strokeWidth={index === 0 ? 6 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECCIÓN 3: PICOS DE ACTIVIDAD */}
      <div className="bg-white p-10 rounded-[55px] shadow-lg border border-slate-100 relative">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-yellow-50 rounded-2xl border border-yellow-100 text-yellow-700">
            <Clock3 size={26} />
          </div>
          <h3 className="text-3xl font-black text-green-950 uppercase tracking-tighter italic leading-none">
            Picos de Actividad (Hoy)
          </h3>
        </div>
        <div className="h-[350px] w-full">
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
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECCIÓN 4: FAVORITOS DE LA SEMANA */}
      <div className="bg-white p-10 rounded-[55px] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="flex items-center gap-5 mb-12 relative z-10">
          <div className="p-5 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-[28px] shadow-xl shadow-orange-100">
            <Flame size={32} fill="white" className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-4xl font-black text-green-950 uppercase tracking-tighter italic leading-none">
              Favoritos de la Semana
            </h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
              <Package size={22} className="text-orange-500" /> Tendencias San
              José
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
          {productosPopulares.length > 0 ? (
            productosPopulares.map((prod, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between p-6 bg-slate-50 hover:bg-white rounded-[35px] border-2 border-transparent hover:border-orange-500/20 hover:shadow-xl transition-all duration-500"
              >
                <div className="flex items-center gap-6">
                  <div className="relative w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[13px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                        {prod.categoria || "GENERAL"}
                      </span>
                    </div>
                    <h5 className="font-black text-green-950 uppercase text-[15px] leading-tight tracking-tight group-hover:text-orange-600 transition-colors">
                      {prod.nombre_producto || "PRODUCTO"}
                    </h5>
                  </div>
                </div>
                <div className="flex flex-col items-end min-w-[90px]">
                  <span className="text-3xl font-black text-green-950 tabular-nums leading-none group-hover:text-orange-600 transition-colors">
                    {prod.total_clicks}
                  </span>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                    Interacciones
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-32 flex flex-col items-center gap-4 opacity-30 italic uppercase text-[10px] tracking-widest">
              Esperando datos semanales...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
