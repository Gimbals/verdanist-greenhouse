import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  X,
  Check,
  Bell,
  Droplets,
  Zap,
  Wifi,
  Sprout,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useGreenhouse, type AlertSeverity } from "../context/GreenhouseContext";

const severityConfig: Record<AlertSeverity, { icon: typeof AlertTriangle; color: string; bg: string; border: string; label: string }> = {
  critical: {
    icon: AlertOctagon,
    color: "#dc2626",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.25)",
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    color: "#d97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.25)",
    label: "Warning",
  },
  info: {
    icon: Info,
    color: "#2563eb",
    bg: "rgba(37,99,235,0.07)",
    border: "rgba(37,99,235,0.2)",
    label: "Info",
  },
};

const alertTypeIcon: Record<string, typeof AlertTriangle> = {
  "Soil Moisture": Sprout,
  "High Humidity": Droplets,
  "Pump System": Zap,
  Network: Wifi,
  "Emergency Stop": AlertOctagon,
};

export function AlertPanel() {
  const { alerts, acknowledgeAlert, dismissAlert } = useGreenhouse();
  const unread = alerts.filter((a) => !a.acknowledged);
  const read = alerts.filter((a) => a.acknowledged);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a3a10" }}>
            Alerts & Notifications
          </h2>
          {unread.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-0.5 rounded-full text-white"
              style={{ background: "#dc2626", fontFamily: "Poppins, sans-serif", fontSize: "0.68rem", fontWeight: 700 }}
            >
              {unread.length} New
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-1.5" style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.75rem", color: "#6b8a55" }}>
          <Bell className="w-4 h-4" />
          {alerts.length} total alerts
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(0,0,0,0.06)" }}
      >
        {/* Header Stats */}
        <div
          className="grid grid-cols-3 divide-x"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", divideColor: "rgba(0,0,0,0.07)" }}
        >
          {[
            { label: "Critical", count: alerts.filter((a) => a.severity === "critical").length, color: "#dc2626", bg: "rgba(220,38,38,0.05)" },
            { label: "Warning", count: alerts.filter((a) => a.severity === "warning").length, color: "#d97706", bg: "rgba(217,119,6,0.05)" },
            { label: "Info", count: alerts.filter((a) => a.severity === "info").length, color: "#2563eb", bg: "rgba(37,99,235,0.05)" },
          ].map((s) => (
            <div key={s.label} className="py-3 px-4 text-center" style={{ background: s.bg }}>
              <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.4rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>
                {s.count}
              </div>
              <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.68rem", color: "#8aab6a", marginTop: "2px" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Alerts List */}
        <div className="p-4 flex flex-col gap-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {alerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-10 text-center"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(40,149,27,0.1)" }}>
                  <Check className="w-6 h-6" style={{ color: "#28951B" }} />
                </div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.88rem", color: "#4a6a35", fontWeight: 600 }}>
                  All Clear!
                </div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.75rem", color: "#8aab6a" }}>
                  No active alerts
                </div>
              </motion.div>
            ) : (
              [...unread, ...read].map((alert) => {
                const cfg = severityConfig[alert.severity];
                const TypeIcon = alertTypeIcon[alert.type] || Bell;
                return (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, x: -20, scale: 0.98 }}
                    animate={{ opacity: alert.acknowledged ? 0.65 : 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3 p-3.5 rounded-xl"
                    style={{
                      background: alert.acknowledged ? "rgba(0,0,0,0.03)" : cfg.bg,
                      border: `1.5px solid ${alert.acknowledged ? "rgba(0,0,0,0.07)" : cfg.border}`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: alert.acknowledged ? "rgba(0,0,0,0.06)" : `${cfg.color}18` }}
                    >
                      <TypeIcon className="w-4 h-4" style={{ color: alert.acknowledged ? "#aaa" : cfg.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.8rem", fontWeight: 700, color: alert.acknowledged ? "#888" : "#1a3a10" }}
                        >
                          {alert.type}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            background: alert.acknowledged ? "rgba(0,0,0,0.07)" : `${cfg.color}18`,
                            color: alert.acknowledged ? "#aaa" : cfg.color,
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.62rem",
                            fontWeight: 600,
                          }}
                        >
                          {cfg.label}
                        </span>
                        {!alert.acknowledged && (
                          <span
                            className="px-1.5 py-0.5 rounded-full text-white"
                            style={{ background: "#89CC41", fontFamily: "Poppins, sans-serif", fontSize: "0.55rem", fontWeight: 700 }}
                          >
                            NEW
                          </span>
                        )}
                      </div>
                      <div
                        style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.75rem", color: alert.acknowledged ? "#999" : "#3d5a2a", marginTop: "2px" }}
                      >
                        {alert.message}
                      </div>
                      <div
                        style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.65rem", color: "#aaa", marginTop: "4px" }}
                      >
                        {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!alert.acknowledged && (
                        <motion.button
                          onClick={() => acknowledgeAlert(alert.id)}
                          whileTap={{ scale: 0.9 }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-green-100"
                          title="Acknowledge"
                        >
                          <Check className="w-3.5 h-3.5" style={{ color: "#28951B" }} />
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => dismissAlert(alert.id)}
                        whileTap={{ scale: 0.9 }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-red-50"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
