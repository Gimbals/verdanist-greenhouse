import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Droplets, Thermometer, Sprout, Waves, Activity, MapPin } from "lucide-react";
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

function SensorDetailCard({
  label,
  sublabel,
  value,
  unit,
  icon: Icon,
  iconColor,
  iconBg,
  history,
  chartColor,
  min,
  max,
  threshold,
  delay = 0,
}: {
  label: string;
  sublabel: string;
  value: number;
  unit: string;
  icon: typeof Droplets;
  iconColor: string;
  iconBg: string;
  history: { time: string; value: number }[];
  chartColor: string;
  min: number;
  max: number;
  threshold: number;
  delay?: number;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl p-6"
      style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(137,204,65,0.18)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: iconBg }}>
            <Icon style={{ color: iconColor, width: "22px", height: "22px" }} />
          </div>
          <div>
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.92rem", fontWeight: 700, color: "#1a3a10" }}>
              {label}
            </div>
            <div className="flex items-center gap-1 mt-0.5" style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.68rem", color: "#8aab6a" }}>
              <MapPin style={{ width: "11px", height: "11px" }} />
              {sublabel}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "2.4rem", fontWeight: 700, color: "#1a3a10", lineHeight: 1 }}>
            {value.toFixed(1)}
          </div>
          <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "1rem", color: "#4a6a35" }}>{unit}</div>
        </div>
      </div>

      {/* Gauge Bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-1.5">
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.68rem", color: "#8aab6a" }}>{min}{unit}</span>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.68rem", color: "#d97706" }}>Threshold: {threshold}{unit}</span>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.68rem", color: "#8aab6a" }}>{max}{unit}</span>
        </div>
        <div className="relative w-full h-3 rounded-full" style={{ background: "rgba(0,0,0,0.07)" }}>
          <div
            className="absolute h-full rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${chartColor}, #89CC41)` }}
          />
          {/* Threshold marker */}
          <div
            className="absolute top-0 h-full w-0.5 rounded-full"
            style={{ left: `${((threshold - min) / (max - min)) * 100}%`, background: "#d97706" }}
          />
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={history} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
          <XAxis dataKey="time" tick={{ fontSize: 9, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} interval={5} />
          <YAxis tick={{ fontSize: 9, fontFamily: "Poppins, sans-serif", fill: "#8aab6a" }} />
          <Tooltip contentStyle={TooltipStyle} />
          <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} fill={`url(#grad-${label})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        {[
          { label: "Min (24h)", value: `${Math.min(...history.map((h) => h.value)).toFixed(1)}${unit}` },
          { label: "Avg (24h)", value: `${(history.reduce((a, b) => a + b.value, 0) / history.length).toFixed(1)}${unit}` },
          { label: "Max (24h)", value: `${Math.max(...history.map((h) => h.value)).toFixed(1)}${unit}` },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10" }}>{s.value}</div>
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.62rem", color: "#8aab6a" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function MonitoringPage() {
  const { sensorData, humidityHistory, soilHistory, temperatureHistory } = useGreenhouse();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen px-4 lg:px-8 py-8" style={{ 
      fontFamily: "Poppins, sans-serif",
      background: 'var(--background)',
      color: 'var(--foreground)'
    }}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(40,149,27,0.12)" }}>
              <Activity className="w-5 h-5" style={{ color: "#28951B" }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a3a10" }}>
                Sensor Monitoring
              </h1>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.82rem", color: "#6b8a55" }}>
                Detailed real-time sensor data with 24-hour history
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SensorDetailCard
            label="Indoor Air Humidity"
            sublabel="Misting Room — Zone A"
            value={sensorData.indoorHumidity}
            unit="%"
            icon={Droplets}
            iconColor="#4da6ff"
            iconBg="rgba(77,166,255,0.1)"
            history={humidityHistory}
            chartColor="#4da6ff"
            min={0}
            max={100}
            threshold={75}
            delay={0}
          />
          <SensorDetailCard
            label="Indoor Temperature"
            sublabel="Greenhouse Zone A"
            value={sensorData.indoorTemperature}
            unit="°C"
            icon={Thermometer}
            iconColor="#ff7043"
            iconBg="rgba(255,112,67,0.1)"
            history={temperatureHistory}
            chartColor="#ff7043"
            min={15}
            max={45}
            threshold={32}
            delay={0.1}
          />
          <SensorDetailCard
            label="Soil Moisture"
            sublabel="Outdoor Polybag Area"
            value={sensorData.soilMoisture}
            unit="%"
            icon={Sprout}
            iconColor="#76BC57"
            iconBg="rgba(118,188,87,0.12)"
            history={soilHistory}
            chartColor="#76BC57"
            min={0}
            max={100}
            threshold={40}
            delay={0.2}
          />
          <SensorDetailCard
            label="Water Tank Level"
            sublabel="Main Reservoir"
            value={sensorData.waterTankLevel}
            unit="%"
            icon={Waves}
            iconColor="#89CC41"
            iconBg="rgba(137,204,65,0.12)"
            history={humidityHistory.map((h, i) => ({ time: h.time, value: Math.max(20, 80 - i * 0.5 + (Math.random() - 0.5) * 3) }))}
            chartColor="#89CC41"
            min={0}
            max={100}
            threshold={30}
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
}
