import { useState } from "react";
import { motion } from "motion/react";
import {
  Settings,
  Bell,
  Wifi,
  Shield,
  User,
  Save,
  RefreshCw,
  Server,
  Clock,
  Mail,
  Phone,
  Database,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function SettingSection({ title, icon: Icon, children }: { title: string; icon: typeof Settings; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid rgba(137,204,65,0.18)" }}
    >
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ background: "rgba(230,247,134,0.4)", borderBottom: "1px solid rgba(137,204,65,0.15)" }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(40,149,27,0.12)" }}>
          <Icon className="w-4 h-4" style={{ color: "#28951B" }} />
        </div>
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1a3a10" }}>
          {title}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <label style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", color: "#2d4a1e", fontWeight: 600, display: "block", marginBottom: "6px" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => {
          console.log('InputField changed:', label, e.target.value);
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl outline-none transition-all"
        style={{
          background: "rgba(230,247,134,0.3)",
          border: "1.5px solid rgba(137,204,65,0.3)",
          fontFamily: "Poppins, sans-serif",
          fontSize: "0.82rem",
          color: "#1a3a10",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#89CC41")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(137,204,65,0.3)")}
      />
    </div>
  );
}

function ToggleRow({ label, sublabel, enabled, onChange }: { label: string; sublabel?: string; enabled: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
      <div>
        <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#1a3a10" }}>{label}</div>
        {sublabel && <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.67rem", color: "#8aab6a" }}>{sublabel}</div>}
      </div>
      <motion.button
        onClick={onChange}
        whileTap={{ scale: 0.92 }}
        className="relative cursor-pointer"
      >
        <div
          className="w-11 h-6 rounded-full relative transition-all duration-300"
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

export function SettingsPage() {
  const { theme } = useTheme();
  const [mqttBroker, setMqttBroker] = useState("mqtt://broker.hivemq.com:1883");
  const [deviceId, setDeviceId] = useState("GH-SENSOR-001");
  const [apiKey, setApiKey] = useState("••••••••••••••••");
  const [adminName, setAdminName] = useState("Farm Operator");
  const [role, setRole] = useState("Farm Operator");
  const [adminEmail, setAdminEmail] = useState("operator@greenhouse.iot");
  const [adminPhone, setAdminPhone] = useState("+62-812-3456-7890");

  const [notifLow, setNotifLow] = useState(true);
  const [notifHigh, setNotifHigh] = useState(true);
  const [notifPump, setNotifPump] = useState(true);
  const [notifNetwork, setNotifNetwork] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const [autoBackup, setAutoBackup] = useState(true);
  const [dataRetention, setDataRetention] = useState("90");
  const [syncInterval, setSyncInterval] = useState("30");

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    console.log('Settings save clicked');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen px-4 lg:px-8 py-8" style={{ 
      fontFamily: "Poppins, sans-serif",
      background: 'var(--background)',
      color: 'var(--foreground)'
    }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(40,149,27,0.12)" }}>
              <Settings className="w-5 h-5" style={{ color: "#28951B" }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a3a10" }}>
                System Settings
              </h1>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.82rem", color: "#6b8a55" }}>
                Configure devices, notifications, and preferences
              </p>
            </div>
          </div>

          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer transition-all"
            style={{
              background: saved ? "linear-gradient(135deg, #4ade80, #16a34a)" : "linear-gradient(135deg, #28951B, #89CC41)",
              color: "white",
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.82rem",
              fontWeight: 600,
              border: "none",
            }}
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Changes"}
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device / Network */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <SettingSection title="Device & Network" icon={Wifi}>
              <InputField label="MQTT Broker URL" value={mqttBroker} onChange={setMqttBroker} placeholder="mqtt://..." />
              <InputField label="Device ID" value={deviceId} onChange={setDeviceId} placeholder="GH-..." />
              <InputField label="API Key" value={apiKey} onChange={setApiKey} type="password" />
              <div className="flex gap-3 mt-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2"
                  style={{ background: "rgba(137,204,65,0.12)", border: "1.5px solid rgba(137,204,65,0.3)", color: "#28951B", fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", fontWeight: 600 }}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Test Connection
                </motion.button>
              </div>
            </SettingSection>
          </motion.div>

          {/* User Profile */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <SettingSection title="User Profile" icon={User}>
              <InputField label="Full Name" value={adminName} onChange={setAdminName} placeholder="Enter name" />
              <div className="mb-4">
                <label style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", color: "#2d4a1e", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl outline-none"
                  style={{ background: "rgba(230,247,134,0.3)", border: "1.5px solid rgba(137,204,65,0.3)", fontFamily: "Poppins, sans-serif", fontSize: "0.82rem", color: "#1a3a10" }}
                >
                  <option>Greenhouse Owner</option>
                  <option>Farm Operator</option>
                  <option>Technical Supervisor</option>
                </select>
              </div>
              <InputField label="Email" value={adminEmail} onChange={setAdminEmail} type="email" />
              <InputField label="Phone" value={adminPhone} onChange={setAdminPhone} placeholder="+62..." />
            </SettingSection>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SettingSection title="Alert & Notifications" icon={Bell}>
              <ToggleRow label="Low Soil Moisture Alert" sublabel="Notify when soil < threshold" enabled={notifLow} onChange={() => setNotifLow(!notifLow)} />
              <ToggleRow label="High Humidity Warning" sublabel="Notify when humidity > threshold" enabled={notifHigh} onChange={() => setNotifHigh(!notifHigh)} />
              <ToggleRow label="Pump Failure Alert" sublabel="Notify on pump malfunction" enabled={notifPump} onChange={() => setNotifPump(!notifPump)} />
              <ToggleRow label="Network Disconnect Alert" sublabel="Notify on connection loss" enabled={notifNetwork} onChange={() => setNotifNetwork(!notifNetwork)} />
              <div className="pt-2">
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", color: "#1a3a10", fontWeight: 600, marginBottom: "8px" }}>
                  Notification Channels
                </div>
                <ToggleRow label="Email Alerts" sublabel={adminEmail} enabled={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
                <ToggleRow label="SMS Alerts" sublabel={adminPhone} enabled={smsAlerts} onChange={() => setSmsAlerts(!smsAlerts)} />
              </div>
            </SettingSection>
          </motion.div>

          {/* Data & Storage */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <SettingSection title="Data & Storage" icon={Database}>
              <ToggleRow label="Auto Backup" sublabel="Daily backup to cloud storage" enabled={autoBackup} onChange={() => setAutoBackup(!autoBackup)} />
              <div className="pt-3">
                <InputField label="Data Retention (days)" value={dataRetention} onChange={setDataRetention} type="number" />
                <InputField label="Sync Interval (seconds)" value={syncInterval} onChange={setSyncInterval} type="number" />
              </div>
              <div
                className="flex items-center justify-between p-3 rounded-xl mt-2"
                style={{ background: "rgba(230,247,134,0.4)", border: "1px solid rgba(137,204,65,0.2)" }}
              >
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4" style={{ color: "#28951B" }} />
                  <div>
                    <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#1a3a10" }}>
                      Storage Used
                    </div>
                    <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.65rem", color: "#6b8a55" }}>
                      2.4 GB / 10 GB
                    </div>
                  </div>
                </div>
                <div className="w-20">
                  <div className="w-full h-2 rounded-full" style={{ background: "rgba(0,0,0,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: "24%", background: "linear-gradient(90deg, #28951B, #89CC41)" }} />
                  </div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.62rem", color: "#8aab6a", textAlign: "right", marginTop: "2px" }}>
                    24%
                  </div>
                </div>
              </div>
            </SettingSection>
          </motion.div>

          {/* Security */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <SettingSection title="Security & Access" icon={Shield}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Change Password", icon: Shield, color: "#28951B" },
                  { label: "2FA Authentication", icon: Phone, color: "#89CC41" },
                  { label: "API Token Management", icon: Mail, color: "#4da6ff" },
                  { label: "Session Logs", icon: Clock, color: "#76BC57" },
                  { label: "Access Control", icon: User, color: "#8b5cf6" },
                  { label: "Audit Trail", icon: Database, color: "#ff7043" },
                ].map((item) => (
                  <motion.button
                    key={item.label}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all group"
                    style={{
                      background: "rgba(230,247,134,0.3)",
                      border: "1.5px solid rgba(137,204,65,0.2)",
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.color}15` }}>
                        <item.icon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#1a3a10" }}>
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#89CC41] opacity-60 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            </SettingSection>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
