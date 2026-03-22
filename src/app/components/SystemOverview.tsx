import { motion } from "motion/react";
import {
  Wifi,
  WifiOff,
  Clock,
  Radio,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useGreenhouse } from "../context/GreenhouseContext";
import { useTheme } from "../context/ThemeContext";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";

export function SystemOverview() {
  const { systemMode, sensorData } = useGreenhouse();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isOnline = systemMode === "online";

  const cards = [
    {
      label: t("dashboard.systemStatus"),
      value: isOnline ? t("dashboard.operational") : t("dashboard.local"),
      icon: isOnline ? CheckCircle2 : AlertTriangle,
      color: 'var(--primary)',
      bg: '#ffffff',
      borderColor: 'var(--border)',
      sub: isOnline ? t("dashboard.allSystemsNominal") : t("dashboard.microcontrollerActive"),
    },
    {
      label: t("dashboard.connection"),
      value: isOnline ? t("dashboard.cloudConnected") : t("dashboard.disconnected"),
      icon: isOnline ? Wifi : WifiOff,
      color: 'var(--primary)',
      bg: '#ffffff',
      borderColor: 'var(--border)',
      sub: isOnline ? t("dashboard.mqttBrokerActive") : t("dashboard.noCloudSync"),
    },
    {
      label: t("dashboard.lastSync"),
      value: formatDistanceToNow(sensorData.lastSync, { addSuffix: true }),
      icon: Clock,
      color: 'var(--primary)',
      bg: '#ffffff',
      borderColor: 'var(--border)',
      sub: sensorData.lastSync.toLocaleTimeString(),
    },
    {
      label: t("dashboard.signalStrength"),
      value: `${Math.round(sensorData.signalStrength)}%`,
      icon: Radio,
      color: 'var(--primary)',
      bg: '#ffffff',
      borderColor: 'var(--border)',
      sub: sensorData.signalStrength > 80 ? t("dashboard.excellent") : sensorData.signalStrength > 60 ? t("dashboard.good") : t("dashboard.weak"),
      hasBar: true,
    },
    {
      label: t("dashboard.activeDevices"),
      value: "8 / 10",
      icon: Server,
      color: 'var(--primary)',
      bg: '#ffffff',
      borderColor: 'var(--border)',
      sub: t("dashboard.sensorsOffline"),
    },
    {
      label: t("dashboard.systemUptime"),
      value: "99.6%",
      icon: Activity,
      color: 'var(--primary)',
      bg: '#ffffff',
      borderColor: 'var(--border)',
      sub: t("dashboard.last30Days"),
    },
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: "Poppins, sans-serif",
      background: 'var(--background)',
      color: 'var(--foreground)'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
          style={{ 
            background: 'var(--card)', 
            border: '1px solid var(--border)' 
          }}
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: isOnline ? 'var(--primary)' : 'var(--destructive)' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span style={{ 
            fontFamily: "Poppins, sans-serif", 
            fontSize: "0.78rem", 
            color: 'var(--foreground)', 
            fontWeight: 600 
          }}>
            {isOnline ? t("dashboard.liveMonitoringActive") : t("dashboard.offlineMode")}
          </span>
        </div>
        <h1
          className=""
          style={{ 
            fontFamily: "Poppins, sans-serif", 
            fontSize: "1.9rem", 
            fontWeight: 700, 
            lineHeight: 1.2,
            color: 'var(--foreground)'
          }}
        >
          {t("dashboard.dashboardTitle")}
        </h1>
        <p
          className="mt-2"
          style={{ 
            fontFamily: "Poppins, sans-serif", 
            fontSize: "0.92rem",
            color: 'var(--muted-foreground)'
          }}
        >
          {t("dashboard.dashboardSubtitle")}
        </p>
      </motion.div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{
              background: "white",
              border: `1.5px solid ${card.borderColor}`,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center justify-between">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: card.bg }}
              >
                <card.icon className="w-4.5 h-4.5" style={{ color: card.color, width: "18px", height: "18px" }} />
              </div>
            </div>
            <div>
              <div
                className="truncate"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#1a3a10" }}
              >
                {card.value}
              </div>
              <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.68rem", color: "#6b8a55", marginTop: "1px" }}>
                {card.label}
              </div>
            </div>
            {card.hasBar && (
              <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.07)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${card.color}, #89CC41)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${sensorData.signalStrength}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            )}
            <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.67rem", color: "#8aab6a" }}>
              {card.sub}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
