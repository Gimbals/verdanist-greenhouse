import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  CloudOff,
  Cloud,
  ToggleLeft,
  ToggleRight,
  Sliders,
  AlertOctagon,
  Settings2,
  CheckCircle,
  Cpu,
  Wifi,
  Power,
} from "lucide-react";
import { useGreenhouse } from "../context/GreenhouseContext";

function SliderControl({
  label,
  value,
  min,
  max,
  unit,
  onChange,
  color,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.8rem", color: "#2d4a1e", fontWeight: 500 }}>
          {label}
        </span>
        <span
          className="px-2.5 py-0.5 rounded-full"
          style={{ background: `${color}20`, color, fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", fontWeight: 700 }}
        >
          {value}{unit}
        </span>
      </div>
      <div className="relative w-full h-2 rounded-full" style={{ background: "rgba(0,0,0,0.07)" }}>
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ width: `${((value - min) / (max - min)) * 100}%`, background: `linear-gradient(90deg, ${color}, #89CC41)` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 1 }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.62rem", color: "#8aab6a" }}>{min}{unit}</span>
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.62rem", color: "#8aab6a" }}>{max}{unit}</span>
      </div>
    </div>
  );
}

function ToggleSwitch({ enabled, onChange, label, sublabel }: { enabled: boolean; onChange: () => void; label: string; sublabel?: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: enabled ? "rgba(40,149,27,0.06)" : "rgba(0,0,0,0.03)" }}>
      <div>
        <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#1a3a10" }}>{label}</div>
        {sublabel && <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.67rem", color: "#8aab6a" }}>{sublabel}</div>}
      </div>
      <motion.button
        onClick={() => {
          console.log('ToggleSwitch clicked, enabled:', !enabled);
          onChange();
        }}
        className="relative flex items-center cursor-pointer"
        whileTap={{ scale: 0.92 }}
      >
        <div
          className="w-12 h-6 rounded-full relative transition-all duration-300"
          style={{ background: enabled ? "linear-gradient(90deg, #28951B, #89CC41)" : "#d1d5db" }}
        >
          <motion.div
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            animate={{ left: enabled ? "calc(100% - 20px)" : "4px" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      </motion.button>
    </div>
  );
}

function ValveControl() {
  const { controlSettings, setControlSettings } = useGreenhouse();
  const valves = [
    { key: "valve1Open" as const, label: "Valve 1", sub: "Main inlet" },
    { key: "valve2Open" as const, label: "Valve 2", sub: "Zone B" },
    { key: "valve3Open" as const, label: "Valve 3", sub: "Drainage" },
  ];

  return (
    <div className="mt-4">
      <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#1a3a10", marginBottom: "10px" }}>
        Valve Control
      </div>
      <div className="flex gap-3">
        {valves.map((v) => (
          <motion.button
            key={v.key}
            onClick={() => {
              console.log('Valve clicked:', v.key, 'current state:', controlSettings[v.key]);
              setControlSettings({ [v.key]: !controlSettings[v.key] });
            }}
            whileTap={{ scale: 0.92 }}
            className="flex-1 p-3 rounded-xl text-center transition-all duration-200 cursor-pointer"
            style={{
              background: controlSettings[v.key] ? "rgba(40,149,27,0.1)" : "rgba(0,0,0,0.04)",
              border: `1.5px solid ${controlSettings[v.key] ? "#89CC41" : "rgba(0,0,0,0.08)"}`,
            }}
          >
            <div
              className="w-5 h-5 mx-auto mb-1.5 rounded-full flex items-center justify-center"
              style={{ background: controlSettings[v.key] ? "#28951B" : "#ccc" }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "#1a3a10" }}>{v.label}</div>
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.6rem", color: "#8aab6a" }}>{v.sub}</div>
            <div
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.65rem", fontWeight: 700, color: controlSettings[v.key] ? "#28951B" : "#aaa", marginTop: "4px" }}
            >
              {controlSettings[v.key] ? "OPEN" : "CLOSED"}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function ControlPanel() {
  const {
    systemMode,
    setSystemMode,
    sensorData,
    controlSettings,
    setControlSettings,
    toggleIndoorPump,
    toggleOutdoorPump,
    emergencyStop,
  } = useGreenhouse();

  // Debug logging
  console.log('ControlPanel rendered, controlSettings:', controlSettings);

  const [activeTab, setActiveTab] = useState<"online" | "offline">(systemMode as "online" | "offline");
  const isOnline = systemMode === "online";

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a3a10" }}>
          Control Panel
        </h2>
        {/* Mode Tabs */}
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ background: "rgba(0,0,0,0.06)" }}
        >
          {["online", "offline"].map((mode) => (
            <motion.button
              key={mode}
              onClick={() => {
                setActiveTab(mode as "online" | "offline");
                setSystemMode(mode as "online" | "offline");
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg cursor-pointer transition-all duration-200"
              style={{
                background: activeTab === mode ? "white" : "transparent",
                boxShadow: activeTab === mode ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {mode === "online" ? (
                <Cloud className="w-3.5 h-3.5" style={{ color: activeTab === mode ? "#28951B" : "#888" }} />
              ) : (
                <CloudOff className="w-3.5 h-3.5" style={{ color: activeTab === mode ? "#d97706" : "#888" }} />
              )}
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: activeTab === mode ? (mode === "online" ? "#28951B" : "#d97706") : "#888",
                }}
              >
                {mode === "online" ? "Online" : "Offline"}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "online" ? (
          <motion.div
            key="online"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Online Mode Banner */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-5"
              style={{ background: "rgba(40,149,27,0.08)", border: "1px solid rgba(40,149,27,0.2)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(40,149,27,0.15)" }}>
                <Cloud className="w-4 h-4" style={{ color: "#28951B" }} />
              </div>
              <div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#1a3a10" }}>
                  Cloud Control Mode Active
                </div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.67rem", color: "#5a8040" }}>
                  Connected to IoT Cloud • MQTT Broker Online
                </div>
              </div>
              <div className="ml-auto">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: "#28951B" }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Pump Controls */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1.5px solid rgba(137,204,65,0.2)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4" style={{ color: "#89CC41" }} />
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10" }}>
                    Pump Controls
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <ToggleSwitch
                    label="Indoor Pump"
                    sublabel="Misting room irrigation"
                    enabled={sensorData.indoorPumpStatus}
                    onChange={toggleIndoorPump}
                  />
                  <ToggleSwitch
                    label="Outdoor Pump"
                    sublabel="Polybag area watering"
                    enabled={sensorData.outdoorPumpStatus}
                    onChange={toggleOutdoorPump}
                  />
                  <ToggleSwitch
                    label="Auto Schedule"
                    sublabel="AI-driven watering schedule"
                    enabled={controlSettings.autoScheduleEnabled}
                    onChange={() => setControlSettings({ autoScheduleEnabled: !controlSettings.autoScheduleEnabled })}
                  />
                </div>
                <ValveControl />
              </div>

              {/* Threshold & Mode Settings */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1.5px solid rgba(137,204,65,0.2)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sliders className="w-4 h-4" style={{ color: "#76BC57" }} />
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10" }}>
                    Threshold Settings
                  </span>
                </div>

                <SliderControl
                  label="Humidity Threshold"
                  value={controlSettings.humidityThreshold}
                  min={40}
                  max={95}
                  unit="%"
                  color="#4da6ff"
                  onChange={(v) => setControlSettings({ humidityThreshold: v })}
                />
                <SliderControl
                  label="Soil Moisture Threshold"
                  value={controlSettings.soilMoistureThreshold}
                  min={20}
                  max={80}
                  unit="%"
                  color="#76BC57"
                  onChange={(v) => setControlSettings({ soilMoistureThreshold: v })}
                />

                <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#1a3a10", marginBottom: "12px" }}>
                    Operation Mode
                  </div>
                  <div className="flex gap-3">
                    {["auto", "manual"].map((m) => (
                      <motion.button
                        key={m}
                        onClick={() => setControlSettings({ pumpMode: m as "auto" | "manual" })}
                        whileTap={{ scale: 0.94 }}
                        className="flex-1 py-2.5 rounded-xl cursor-pointer transition-all duration-200"
                        style={{
                          background: controlSettings.pumpMode === m
                            ? "linear-gradient(135deg, #28951B, #89CC41)"
                            : "rgba(0,0,0,0.04)",
                          border: `1.5px solid ${controlSettings.pumpMode === m ? "#89CC41" : "rgba(0,0,0,0.08)"}`,
                          color: controlSettings.pumpMode === m ? "white" : "#888",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        {m === "auto" ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <Settings2 className="w-3.5 h-3.5" />
                            Auto
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <ToggleRight className="w-3.5 h-3.5" />
                            Manual
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="offline"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Offline Mode Banner */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-5"
              style={{ background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.25)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(217,119,6,0.15)" }}>
                <Cpu className="w-4 h-4" style={{ color: "#d97706" }} />
              </div>
              <div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#92400e" }}>
                  Local Microcontroller Mode
                </div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.67rem", color: "#b45309" }}>
                  Backup automation system active • Operating independently
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Local Status */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1.5px solid rgba(217,119,6,0.2)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Cpu className="w-4 h-4" style={{ color: "#d97706" }} />
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10" }}>
                    Local System Status
                  </span>
                </div>

                {[
                  { label: "Backup Controller", status: "Active", ok: true },
                  { label: "Local Sensor Network", status: "Connected", ok: true },
                  { label: "Cloud Sync", status: "Paused", ok: false },
                  { label: "Emergency Protocols", status: "Ready", ok: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.8rem", color: "#2d4a1e" }}>{item.label}</span>
                    <span
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{
                        background: item.ok ? "rgba(40,149,27,0.1)" : "rgba(217,119,6,0.1)",
                        color: item.ok ? "#28951B" : "#d97706",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    >
                      {item.ok ? <CheckCircle className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </div>
                ))}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 w-full py-3 rounded-xl cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #d97706, #f59e0b)",
                    color: "white",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    border: "none",
                  }}
                  onClick={() => setSystemMode("online")}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Cloud className="w-4 h-4" />
                    Reconnect to Cloud
                  </div>
                </motion.button>
              </div>

              {/* Manual Override + Emergency */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1.5px solid rgba(239,68,68,0.15)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Power className="w-4 h-4" style={{ color: "#ef4444" }} />
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10" }}>
                    Manual Override
                  </span>
                </div>

                <div className="flex flex-col gap-3 mb-5">
                  <ToggleSwitch
                    label="Manual Indoor Pump"
                    sublabel="Override automation"
                    enabled={sensorData.indoorPumpStatus}
                    onChange={toggleIndoorPump}
                  />
                  <ToggleSwitch
                    label="Manual Outdoor Pump"
                    sublabel="Override automation"
                    enabled={sensorData.outdoorPumpStatus}
                    onChange={toggleOutdoorPump}
                  />
                </div>

                <div
                  className="p-4 rounded-xl mb-4"
                  style={{ background: "rgba(239,68,68,0.05)", border: "1.5px dashed rgba(239,68,68,0.3)" }}
                >
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.75rem", color: "#dc2626", fontWeight: 600, marginBottom: "4px" }}>
                    ⚠ Emergency Stop Zone
                  </div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.67rem", color: "#b91c1c", marginBottom: "12px" }}>
                    Immediately disables all pumps and closes all valves
                  </div>
                  <motion.button
                    onClick={() => {
              console.log('Emergency stop clicked');
              emergencyStop();
            }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #dc2626, #ef4444)",
                      color: "white",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      border: "none",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <AlertOctagon className="w-4 h-4" />
                    EMERGENCY STOP
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
