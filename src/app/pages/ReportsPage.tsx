import { useState } from "react";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DataExport } from "../components/DataExport";
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useGreenhouse } from "../context/GreenhouseContext";
import { useTheme } from "../context/ThemeContext";

const TooltipStyle = {
  background: "white",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  fontSize: "0.75rem",
  fontFamily: "Poppins, sans-serif",
  padding: "10px 14px",
};

const monthlyData = [
  { month: "Sep", humidity: 72, soil: 58, water: 320, temp: 27.5, uptime: 99.2 },
  { month: "Oct", humidity: 68, soil: 62, water: 295, temp: 26.8, uptime: 98.7 },
  { month: "Nov", humidity: 75, soil: 55, water: 340, temp: 25.2, uptime: 99.8 },
  { month: "Dec", humidity: 80, soil: 48, water: 410, temp: 24.1, uptime: 97.4 },
  { month: "Jan", humidity: 78, soil: 52, water: 380, temp: 25.8, uptime: 99.1 },
  { month: "Feb", humidity: 73, soil: 56, water: 355, temp: 27.2, uptime: 99.6 },
];

const weeklyPumpCycles = [
  { day: "Mon", indoor: 8, outdoor: 6 },
  { day: "Tue", indoor: 7, outdoor: 5 },
  { day: "Wed", indoor: 9, outdoor: 7 },
  { day: "Thu", indoor: 8, outdoor: 6 },
  { day: "Fri", indoor: 10, outdoor: 8 },
  { day: "Sat", indoor: 6, outdoor: 4 },
  { day: "Sun", indoor: 5, outdoor: 3 },
];

const systemHealthData = [
  { name: "Optimal", value: 68, color: "#28951B" },
  { name: "Warning", value: 22, color: "#F6F05F" },
  { name: "Critical", value: 10, color: "#ef4444" },
];

export function ReportsPage() {
  const { weeklyWaterUsage, monthlyUptime } = useGreenhouse();
  const { theme } = useTheme();
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");

  const kpis = [
    { label: "Avg Humidity", value: "73.5%", change: "+2.1%", trend: "up", color: "#4da6ff" },
    { label: "Avg Soil Moisture", value: "55.2%", change: "-3.4%", trend: "down", color: "#76BC57" },
    { label: "Water Consumed", value: "355 L", change: "-6.6%", trend: "down", color: "#89CC41" },
    { label: "System Uptime", value: "99.6%", change: "+0.5%", trend: "up", color: "#28951B" },
    { label: "Avg Temperature", value: "27.2°C", change: "+1.4°C", trend: "up", color: "#ff7043" },
    { label: "Pump Cycles", value: "53 / wk", change: "0%", trend: "neutral", color: "#8b5cf6" },
  ];

  return (
    <div id="export-content" className="min-h-screen px-4 lg:px-8 py-8" style={{ 
      fontFamily: "Poppins, sans-serif",
      background: 'var(--background)',
      color: 'var(--foreground)'
    }}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(40,149,27,0.12)" }}>
              <BarChart3 className="w-5 h-5" style={{ color: "#28951B" }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a3a10" }}>
                Reports & Analytics
              </h1>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.82rem", color: "#6b8a55" }}>
                Historical trends and performance insights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-xl p-1 gap-1" style={{ background: "rgba(0,0,0,0.06)" }}>
              {["weekly", "monthly"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p as "weekly" | "monthly")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  style={{
                    background: period === p ? "white" : "transparent",
                    boxShadow: period === p ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: period === p ? "#28951B" : "#888",
                  }}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {p === "weekly" ? "Weekly" : "Monthly"}
                </button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #28951B, #89CC41)",
                color: "white",
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.8rem",
                fontWeight: 600,
                border: "none",
              }}
            >
              <Download className="w-4 h-4" />
              Export PDF
            </motion.button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4"
              style={{ background: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: `1.5px solid ${kpi.color}22` }}
            >
              <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.67rem", color: "#8aab6a", marginBottom: "6px" }}>
                {kpi.label}
              </div>
              <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a3a10" }}>
                {kpi.value}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {kpi.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" style={{ color: "#28951B" }} />
                ) : kpi.trend === "down" ? (
                  <TrendingDown className="w-3 h-3" style={{ color: "#ef4444" }} />
                ) : (
                  <Minus className="w-3 h-3" style={{ color: "#888" }} />
                )}
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.65rem",
                    color: kpi.trend === "up" ? "#28951B" : kpi.trend === "down" ? "#ef4444" : "#888",
                    fontWeight: 600,
                  }}
                >
                  {kpi.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-6"
            style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(137,204,65,0.18)" }}
          >
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10", marginBottom: "16px" }}>
              6-Month Humidity & Soil Trends
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <defs>
                  <linearGradient id="humMonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4da6ff" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4da6ff" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="soilMonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#76BC57" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#76BC57" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
                <Tooltip contentStyle={TooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "0.72rem", fontFamily: "Poppins, sans-serif" }} />
                <Area type="monotone" dataKey="humidity" stroke="#4da6ff" strokeWidth={2} fill="url(#humMonGrad)" name="Humidity %" />
                <Area type="monotone" dataKey="soil" stroke="#76BC57" strokeWidth={2} fill="url(#soilMonGrad)" name="Soil Moisture %" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Water Usage Monthly */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl p-6"
            style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(137,204,65,0.18)" }}
          >
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10", marginBottom: "16px" }}>
              Monthly Water Consumption (L)
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <defs>
                  <linearGradient id="waterGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#89CC41" />
                    <stop offset="100%" stopColor="#28951B" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
                <Tooltip contentStyle={TooltipStyle} formatter={(v: number) => [`${v}L`, "Water Used"]} />
                <Bar dataKey="water" fill="url(#waterGrad2)" radius={[8, 8, 0, 0]} maxBarSize={50} name="Water (L)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pump Cycles Weekly */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-6"
            style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(137,204,65,0.18)" }}
          >
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10", marginBottom: "16px" }}>
              Weekly Pump Activation Cycles
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyPumpCycles} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
                <Tooltip contentStyle={TooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "0.72rem", fontFamily: "Poppins, sans-serif" }} />
                <Bar dataKey="indoor" fill="#4da6ff" radius={[4, 4, 0, 0]} maxBarSize={24} name="Indoor Pump" />
                <Bar dataKey="outdoor" fill="#76BC57" radius={[4, 4, 0, 0]} maxBarSize={24} name="Outdoor Pump" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* System Health + Uptime */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl p-6"
            style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(137,204,65,0.18)" }}
          >
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10", marginBottom: "16px" }}>
              System Health Distribution
            </div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie
                    data={systemHealthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {systemHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TooltipStyle} formatter={(v: number) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 flex flex-col gap-3">
                {systemHealthData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", color: "#1a3a10", fontWeight: 600 }}>
                          {d.name}
                        </span>
                        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", color: "#4a6a35", fontWeight: 700 }}>
                          {d.value}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full mt-1" style={{ background: "rgba(0,0,0,0.07)" }}>
                        <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.color }} />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-2 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.72rem", color: "#8aab6a" }}>
                    Overall System Score
                  </div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#28951B" }}>
                    8.7 / 10
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Temperature & Uptime Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6"
          style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(137,204,65,0.18)" }}
        >
          <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10", marginBottom: "16px" }}>
            Temperature vs System Uptime (6 Months)
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 0, left: -5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
              <YAxis yAxisId="temp" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} domain={[20, 35]} />
              <YAxis yAxisId="uptime" orientation="right" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} domain={[95, 100]} />
              <Tooltip contentStyle={TooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "0.72rem", fontFamily: "Poppins, sans-serif" }} />
              <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#ff7043" strokeWidth={2.5} dot={{ fill: "#ff7043", r: 4 }} name="Avg Temp (°C)" />
              <Line yAxisId="uptime" type="monotone" dataKey="uptime" stroke="#28951B" strokeWidth={2.5} dot={{ fill: "#28951B", r: 4 }} name="Uptime %" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* 6-Month Humidity & Soil Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-6"
              style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(137,204,65,0.18)" }}
            >
              <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10", marginBottom: "16px" }}>
                6-Month Humidity & Soil Trends
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 0, left: -5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
                  <YAxis tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
                  <Tooltip contentStyle={TooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "0.72rem", fontFamily: "Poppins, sans-serif" }} />
                  <Area type="monotone" dataKey="humidity" stackId="1" stroke="#28951B" fill="#28951B" fillOpacity={0.6} name="Avg Humidity %" />
                  <Area type="monotone" dataKey="soil" stackId="1" stroke="#89CC41" fill="#89CC41" fillOpacity={0.6} name="Avg Soil Moisture %" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Monthly Water Consumption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-6"
              style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(137,204,65,0.18)" }}
            >
              <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10", marginBottom: "16px" }}>
                Monthly Water Consumption (L)
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 0, left: -5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
                  <YAxis tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
                  <Tooltip contentStyle={TooltipStyle} />
                  <Bar dataKey="water" fill="#28951B" radius={[8, 8, 0, 0]} name="Water Used" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Weekly Pump Activation Cycles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-6"
              style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(137,204,65,0.18)" }}
            >
              <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10", marginBottom: "16px" }}>
                Weekly Pump Activation Cycles
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={weeklyPumpCycles} margin={{ top: 5, right: 20, bottom: 0, left: -5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
                  <YAxis tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
                  <Tooltip contentStyle={TooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "0.72rem", fontFamily: "Poppins, sans-serif" }} />
                  <Line type="monotone" dataKey="indoor" stroke="#28951B" strokeWidth={2.5} dot={{ fill: "#28951B", r: 4 }} name="Indoor Pump" />
                  <Line type="monotone" dataKey="outdoor" stroke="#ff7043" strokeWidth={2.5} dot={{ fill: "#ff7043", r: 4 }} name="Outdoor Pump" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* System Health Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl p-6"
              style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(137,204,65,0.18)" }}
            >
              <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10", marginBottom: "16px" }}>
                System Health Distribution
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={systemHealthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {systemHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "0.72rem", fontFamily: "Poppins, sans-serif" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {systemHealthData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", color: "#4a6a35", fontWeight: 700 }}>
                        {d.name}
                      </span>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", color: "#4a6a35", fontWeight: 700 }}>
                        {d.value}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full mt-1" style={{ background: "rgba(0,0,0,0.07)" }}>
                      <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.color }} />
                    </div>
                  </div>
                ))}
                <div className="mt-2 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.72rem", color: "#8aab6a" }}>
                    Overall System Score
                  </div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#28951B" }}>
                    8.7 / 10
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Temperature & Uptime Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl p-6 mt-6"
            style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(137,204,65,0.18)" }}
          >
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10", marginBottom: "16px" }}>
              Temperature vs System Uptime (6 Months)
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 0, left: -5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
                <YAxis yAxisId="temp" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} domain={[20, 35]} />
                <YAxis yAxisId="uptime" orientation="right" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} domain={[95, 100]} />
                <Tooltip contentStyle={TooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "0.72rem", fontFamily: "Poppins, sans-serif" }} />
                <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#ff7043" strokeWidth={2.5} dot={{ fill: "#ff7043", r: 4 }} name="Avg Temp (°C)" />
                <Line yAxisId="uptime" type="monotone" dataKey="uptime" stroke="#28951B" strokeWidth={2.5} dot={{ fill: "#28951B", r: 4 }} name="Uptime %" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Data Export Sidebar */}
        <div className="lg:col-span-1">
          <DataExport />
        </div>
      </div>
    </div>
  );
}
