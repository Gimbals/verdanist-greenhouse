import { motion } from "motion/react";
import {
  Droplets,
  Thermometer,
  Sprout,
  Zap,
  Waves,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useGreenhouse } from "../context/GreenhouseContext";
import { useTheme } from "../context/ThemeContext";

function getStatus(value: number, type: string, theme: string) {
  const isDark = theme === 'dark';
  if (type === "humidity") {
    if (value >= 85) return { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
    if (value >= 75) return { label: "Warning", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
    return { label: "Normal", color: isDark ? "#89CC41" : "#28951B", bg: isDark ? "rgba(137,204,65,0.1)" : "rgba(40,149,27,0.1)" };
  }
  if (type === "temperature") {
    if (value >= 35) return { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
    if (value >= 32) return { label: "Warning", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
    return { label: "Normal", color: isDark ? "#89CC41" : "#28951B", bg: isDark ? "rgba(137,204,65,0.1)" : "rgba(40,149,27,0.1)" };
  }
  if (type === "soil") {
    if (value <= 25) return { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
    if (value <= 40) return { label: "Warning", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
    return { label: "Normal", color: isDark ? "#89CC41" : "#28951B", bg: isDark ? "rgba(137,204,65,0.1)" : "rgba(40,149,27,0.1)" };
  }
  if (type === "tank") {
    if (value <= 20) return { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
    if (value <= 35) return { label: "Warning", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
    return { label: "Normal", color: isDark ? "#89CC41" : "#28951B", bg: isDark ? "rgba(137,204,65,0.1)" : "rgba(40,149,27,0.1)" };
  }
  return { label: "Normal", color: isDark ? "#89CC41" : "#28951B", bg: isDark ? "rgba(137,204,65,0.1)" : "rgba(40,149,27,0.1)" };
}

function MiniChart({ data, color }: { data: { time: string; value: number }[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={data.slice(-12)}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Tooltip
          contentStyle={{
            background: "white",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontSize: "0.72rem",
            fontFamily: "Poppins, sans-serif",
          }}
          formatter={(val: number) => [val.toFixed(1), ""]}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function WaterTankCard({ value }: { value: number }) {
  const { theme } = useTheme();
  const status = getStatus(value, "tank", theme);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-2xl p-5"
      style={{
        background: '#ffffff',
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
        border: `1.5px solid ${status.color}22`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", color: "var(--muted-foreground)", fontWeight: 500 }}
          >
            Water Tank Level
          </div>
          <div
            className="flex items-end gap-1 mt-1"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <span style={{ fontSize: "2rem", fontWeight: 700, color: "var(--foreground)", lineHeight: 1 }}>
              {Math.round(value)}
            </span>
            <span style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "3px" }}>%</span>
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(118,188,87,0.12)" }}
        >
          <Waves className="w-5 h-5" style={{ color: "#76BC57" }} />
        </div>
      </div>

      {/* Tank visual */}
      <div className="relative w-full h-16 rounded-xl overflow-hidden mb-3" style={{ background: "rgba(230,247,134,0.5)", border: "1.5px solid rgba(137,204,65,0.3)" }}>
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-b-xl"
          style={{ background: `linear-gradient(180deg, ${status.color}55, ${status.color}99)` }}
          animate={{ height: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "#1a3a10" }}>
            {Math.round(value)}% Full
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className="px-2.5 py-1 rounded-full"
          style={{ background: status.bg, color: status.color, fontFamily: "Poppins, sans-serif", fontSize: "0.7rem", fontWeight: 600 }}
        >
          {status.label}
        </span>
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.7rem", color: "#8aab6a" }}>
          ~{Math.round(value * 5)} L remaining
        </span>
      </div>
    </motion.div>
  );
}

function PumpStatusCard({ indoor, outdoor }: { indoor: boolean; outdoor: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="rounded-2xl p-5"
      style={{
        background: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
        border: "1.5px solid rgba(137,204,65,0.25)",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", color: "#6b8a55", fontWeight: 500 }}>
            Pump System
          </div>
          <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a3a10", marginTop: "2px" }}>
            Water Pumps
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(137,204,65,0.12)" }}
        >
          <Zap className="w-5 h-5" style={{ color: "#89CC41" }} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {[
          { label: "Indoor Pump", sublabel: "Misting Room", status: indoor },
          { label: "Outdoor Pump", sublabel: "Polybag Area", status: outdoor },
        ].map(({ label, sublabel, status }) => (
          <div
            key={label}
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: status ? "rgba(40,149,27,0.07)" : "rgba(0,0,0,0.04)" }}
          >
            <div>
              <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#1a3a10" }}>
                {label}
              </div>
              <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.67rem", color: "#8aab6a" }}>
                {sublabel}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: status ? "#28951B" : "#ccc" }}
                animate={status ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span
                className="px-2.5 py-1 rounded-full"
                style={{
                  background: status ? "rgba(40,149,27,0.12)" : "rgba(0,0,0,0.07)",
                  color: status ? "#28951B" : "#888",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                {status ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function MonitoringCards() {
  const { sensorData, humidityHistory, soilHistory, temperatureHistory } = useGreenhouse();
  const { theme } = useTheme();

  const mainCards = [
    {
      label: "Indoor Air Humidity",
      sublabel: "Misting Room",
      value: sensorData.indoorHumidity,
      unit: "%",
      type: "humidity",
      icon: Droplets,
      iconColor: "#4da6ff",
      iconBg: "rgba(77,166,255,0.1)",
      history: humidityHistory,
      chartColor: "#4da6ff",
      delay: 0,
    },
    {
      label: "Indoor Temperature",
      sublabel: "Greenhouse Zone A",
      value: sensorData.indoorTemperature,
      unit: "°C",
      type: "temperature",
      icon: Thermometer,
      iconColor: "#ff7043",
      iconBg: "rgba(255,112,67,0.1)",
      history: temperatureHistory,
      chartColor: "#ff7043",
      delay: 0.08,
    },
    {
      label: "Soil Moisture",
      sublabel: "Outdoor Polybag Area",
      value: sensorData.soilMoisture,
      unit: "%",
      type: "soil",
      icon: Sprout,
      iconColor: "#76BC57",
      iconBg: "rgba(118,188,87,0.12)",
      history: soilHistory,
      chartColor: "#76BC57",
      delay: 0.16,
    },
  ];

  return (
    <div style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="flex items-center justify-between mb-5">
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)" }}>
          Live Sensor Monitoring
        </h2>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ background: 'var(--card)', border: "1px solid var(--border)" }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--primary)" }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.7rem", color: "var(--primary)", fontWeight: 600 }}>
            Real-time
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        {mainCards.map((card) => {
          const status = getStatus(card.value, card.type, theme);
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: card.delay }}
              className="rounded-2xl p-5"
              style={{
                background: '#ffffff',
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                border: `1.5px solid ${status.color}22`,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", color: "var(--muted-foreground)", fontWeight: 500 }}>
                    {card.label}
                  </div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.65rem", color: "var(--muted-foreground)" }}>
                    {card.sublabel}
                  </div>
                </div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: card.iconBg }}
                >
                  <card.icon className="w-4.5 h-4.5" style={{ color: card.iconColor, width: "18px", height: "18px" }} />
                </div>
              </div>

              <div className="flex items-end gap-1 mb-3">
                <motion.span
                  key={Math.round(card.value)}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  style={{ fontFamily: "Poppins, sans-serif", fontSize: "2.2rem", fontWeight: 700, color: "var(--foreground)", lineHeight: 1 }}
                >
                  {card.value.toFixed(1)}
                </motion.span>
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "1rem", color: "var(--muted-foreground)", marginBottom: "3px" }}>
                  {card.unit}
                </span>
              </div>

              <MiniChart data={card.history} color={card.chartColor} />

              <div className="flex items-center justify-between mt-2">
                <span
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    background: status.bg,
                    color: status.color,
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                  }}
                >
                  ● {status.label}
                </span>
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.67rem", color: "#8aab6a" }}>
                  Last 12h trend
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <PumpStatusCard indoor={sensorData.indoorPumpStatus} outdoor={sensorData.outdoorPumpStatus} />
        <WaterTankCard value={sensorData.waterTankLevel} />
      </div>
    </div>
  );
}
