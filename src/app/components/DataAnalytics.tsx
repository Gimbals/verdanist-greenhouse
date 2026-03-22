import React from "react";
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
  RadialBarChart,
  RadialBar,
} from "recharts";
import { TrendingUp, BarChart3, Droplets, Activity } from "lucide-react";
import { useGreenhouse } from "../context/GreenhouseContext";

const CustomTooltipStyle = {
  background: "white",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  fontSize: "0.75rem",
  fontFamily: "Poppins, sans-serif",
  padding: "10px 14px",
};

export function DataAnalytics() {
  const { humidityHistory, soilHistory, temperatureHistory, weeklyWaterUsage, monthlyUptime } = useGreenhouse();
  const [waterView, setWaterView] = React.useState<"weekly" | "monthly">("weekly");

  const combinedData = humidityHistory.map((h, i) => ({
    time: h.time,
    humidity: parseFloat(h.value.toFixed(1)),
    temperature: parseFloat((temperatureHistory[i]?.value || 28).toFixed(1)),
    soil: parseFloat((soilHistory[i]?.value || 50).toFixed(1)),
  }));

  const uptimeData = [
    { name: "Uptime", value: 99.6, fill: "#28951B" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a3a10" }}>
          Data Analytics
        </h2>
        <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.75rem", color: "#6b8a55" }}>
          Last 24 hours
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Humidity Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(77,166,255,0.15)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(77,166,255,0.1)" }}>
                <Droplets className="w-4 h-4" style={{ color: "#4da6ff" }} />
              </div>
              <div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#1a3a10" }}>
                  Humidity Trend
                </div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.67rem", color: "#8aab6a" }}>
                  Indoor air humidity over time
                </div>
              </div>
            </div>
            <div
              className="px-2.5 py-1 rounded-full"
              style={{ background: "rgba(77,166,255,0.1)", color: "#4da6ff", fontFamily: "Poppins, sans-serif", fontSize: "0.7rem", fontWeight: 600 }}
            >
              24h
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={combinedData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <defs>
                <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4da6ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4da6ff" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} interval={5} />
              <YAxis tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} domain={[0, 100]} />
              <Tooltip contentStyle={CustomTooltipStyle} formatter={(v: number) => [`${v}%`, "Humidity"]} />
              <Area type="monotone" dataKey="humidity" stroke="#4da6ff" strokeWidth={2.5} fill="url(#humGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Soil Moisture Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(118,188,87,0.2)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(118,188,87,0.12)" }}>
                <Activity className="w-4 h-4" style={{ color: "#76BC57" }} />
              </div>
              <div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#1a3a10" }}>
                  Soil Moisture Trend
                </div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.67rem", color: "#8aab6a" }}>
                  Outdoor polybag area
                </div>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={combinedData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <defs>
                <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#76BC57" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#76BC57" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} interval={5} />
              <YAxis tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} domain={[0, 100]} />
              <Tooltip contentStyle={CustomTooltipStyle} formatter={(v: number) => [`${v}%`, "Soil Moisture"]} />
              <Area type="monotone" dataKey="soil" stroke="#76BC57" strokeWidth={2.5} fill="url(#soilGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Water Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(137,204,65,0.2)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(137,204,65,0.12)" }}>
                <BarChart3 className="w-4 h-4" style={{ color: "#89CC41" }} />
              </div>
              <div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#1a3a10" }}>
                  Water Usage
                </div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.67rem", color: "#8aab6a" }}>
                  Liters consumed
                </div>
              </div>
            </div>
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: "rgba(0,0,0,0.05)" }}>
              {["weekly", "monthly"].map((v) => (
                <button
                  key={v}
                  onClick={() => setWaterView(v as "weekly" | "monthly")}
                  className="px-2.5 py-1 rounded-md transition-all cursor-pointer"
                  style={{
                    background: waterView === v ? "white" : "transparent",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color: waterView === v ? "#28951B" : "#888",
                    boxShadow: waterView === v ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {v === "weekly" ? "Week" : "Month"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyWaterUsage} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#89CC41" />
                  <stop offset="100%" stopColor="#28951B" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
              <YAxis tick={{ fontSize: 10, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
              <Tooltip contentStyle={CustomTooltipStyle} formatter={(v: number) => [`${v}L`, "Usage"]} />
              <Bar dataKey="usage" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* System Uptime + Multi-sensor Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(40,149,27,0.15)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(40,149,27,0.1)" }}>
                <TrendingUp className="w-4 h-4" style={{ color: "#28951B" }} />
              </div>
              <div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#1a3a10" }}>
                  Multi-Sensor Overview
                </div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.67rem", color: "#8aab6a" }}>
                  Humidity vs Temp vs Soil
                </div>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={combinedData.filter((_, i) => i % 2 === 0)} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} interval={3} />
              <YAxis tick={{ fontSize: 9, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
              <Tooltip contentStyle={CustomTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "0.7rem", fontFamily: "Poppins, sans-serif" }} />
              <Line type="monotone" dataKey="humidity" stroke="#4da6ff" strokeWidth={2} dot={false} name="Humidity %" />
              <Line type="monotone" dataKey="temperature" stroke="#ff7043" strokeWidth={2} dot={false} name="Temp °C" />
              <Line type="monotone" dataKey="soil" stroke="#76BC57" strokeWidth={2} dot={false} name="Soil %" />
            </LineChart>
          </ResponsiveContainer>

          {/* Uptime Summary */}
          <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            {[
              { label: "Monthly Uptime", value: "99.6%", color: "#28951B" },
              { label: "Avg Response", value: "42ms", color: "#89CC41" },
              { label: "Data Points", value: "8,640", color: "#76BC57" },
            ].map((s) => (
              <div key={s.label} className="flex-1 text-center">
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "1rem", fontWeight: 700, color: s.color }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.62rem", color: "#8aab6a" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
