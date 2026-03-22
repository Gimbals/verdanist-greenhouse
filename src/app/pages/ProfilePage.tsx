import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Mail, Shield, Bell, Activity, Leaf, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setNameInput(user.name);
    }
  }, [user?.name]);

  const displayName = user?.name || "Farm Operator";
  const email = user?.email || "operator@greenhouse.iot";

  const canSave = !isLoading && !saving && nameInput.trim() !== "" && nameInput.trim() !== user?.name;

  const handleSave = async () => {
    if (!canSave) return;
    try {
      setSaving(true);
      await updateProfile({ name: nameInput.trim() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 lg:px-8 py-8" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="max-w-[960px] mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(40,149,27,0.12)" }}
            >
              <User className="w-6 h-6" style={{ color: "#28951B" }} />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#1a3a10",
                }}
              >
                My Profile
              </h1>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.82rem",
                  color: "#6b8a55",
                }}
              >
                Account identity and greenhouse operator details
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 rounded-2xl"
            style={{
              background: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              border: "1.5px solid rgba(137,204,65,0.18)",
            }}
          >
            <div
              className="flex items-center gap-4 px-5 py-4 border-b"
              style={{
                background: "rgba(230,247,134,0.4)",
                borderColor: "rgba(137,204,65,0.15)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(40,149,27,0.12)" }}
              >
                <Leaf className="w-6 h-6" style={{ color: "#28951B" }} />
              </div>
              <div className="flex-1 min-w-0">
                <label
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "#6b8a55",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Display name
                </label>
                <div className="flex items-center gap-2">
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-2 rounded-xl outline-none text-sm flex-1 min-w-0"
                    style={{
                      background: "rgba(230,247,134,0.35)",
                      border: "1.5px solid rgba(137,204,65,0.4)",
                      fontFamily: "Poppins, sans-serif",
                      color: "#1a3a10",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.75rem",
                    color: "#8aab6a",
                    marginTop: "4px",
                  }}
                >
                  Primary operator profile
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={!canSave}
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #28951B, #89CC41)",
                  color: "white",
                  border: "none",
                  fontFamily: "Poppins, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save"}
              </motion.button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.78rem",
                    color: "#2d4a1e",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  Email address
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(40,149,27,0.08)" }}
                  >
                    <Mail className="w-4 h-4" style={{ color: "#28951B" }} />
                  </div>
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.85rem",
                      color: "#1a3a10",
                    }}
                  >
                    {email}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: "rgba(230,247,134,0.4)",
                    border: "1px solid rgba(137,204,65,0.25)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4" style={{ color: "#28951B" }} />
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#1a3a10",
                      }}
                    >
                      Authentication
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.75rem",
                      color: "#6b8a55",
                    }}
                  >
                    This account is managed by Supabase Auth. Password and Google login
                    can be configured in your authentication settings.
                  </p>
                </div>

                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: "rgba(230,247,134,0.2)",
                    border: "1px solid rgba(137,204,65,0.25)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-4 h-4" style={{ color: "#28951B" }} />
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#1a3a10",
                      }}
                    >
                      Notification preference
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.75rem",
                      color: "#6b8a55",
                    }}
                  >
                    Notification channels and alert rules are configured in System
                    Settings. Your email will be used for critical alerts.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Side summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div
              className="rounded-2xl p-4"
              style={{
                background: "linear-gradient(145deg, #E6F786, #F9FFED)",
                border: "1px solid rgba(137,204,65,0.4)",
                boxShadow: "0 4px 18px rgba(137,204,65,0.25)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5" style={{ color: "#28951B" }} />
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#1a3a10",
                  }}
                >
                  Account status
                </span>
              </div>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.74rem",
                  color: "#4a6a35",
                }}
              >
                You are signed in as{" "}
                <span style={{ fontWeight: 600 }}>{displayName}</span>. Keep your
                credentials safe and do not share them with others.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

