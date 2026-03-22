import { motion } from "motion/react";
import { HelpCircle, Mail, MessageCircle, BookOpen, Shield, ExternalLink } from "lucide-react";

export function HelpPage() {
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
              <HelpCircle className="w-6 h-6" style={{ color: "#28951B" }} />
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
                Help & Support
              </h1>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.82rem",
                  color: "#6b8a55",
                }}
              >
                Find answers and contact support for your greenhouse dashboard
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick help cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-4 lg:col-span-2"
          >
            <div
              className="rounded-2xl p-5"
              style={{
                background: "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                border: "1.5px solid rgba(137,204,65,0.18)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5" style={{ color: "#28951B" }} />
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#1a3a10",
                  }}
                >
                  Common questions
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: "Why is my sensor data not updating?",
                    a: "Check that your devices are online and connected to the configured MQTT broker in System Settings.",
                  },
                  {
                    q: "How do I invite another operator?",
                    a: "Create a new account for them via the registration page and assign roles in System Settings.",
                  },
                  {
                    q: "Can I export historical data?",
                    a: "Use the Reports page to generate charts and export CSV for your greenhouse metrics.",
                  },
                ].map((item) => (
                  <div
                    key={item.q}
                    className="rounded-xl px-4 py-3"
                    style={{ background: "rgba(230,247,134,0.35)" }}
                  >
                    <div
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#1a3a10",
                      }}
                    >
                      {item.q}
                    </div>
                    <div
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "0.75rem",
                        color: "#4a6a35",
                        marginTop: "4px",
                      }}
                    >
                      {item.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(230,247,134,0.35)",
                border: "1.5px solid rgba(137,204,65,0.4)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5" style={{ color: "#28951B" }} />
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#1a3a10",
                  }}
                >
                  Best practices
                </span>
              </div>
              <ul className="list-disc pl-5 space-y-2">
                {[
                  "Keep your Supabase keys and database credentials secret.",
                  "Use strong passwords and enable 2FA where possible.",
                  "Regularly review alert thresholds to match seasonal changes.",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.75rem",
                      color: "#4a6a35",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Contact panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(145deg, #E6F786, #F9FFED)",
                border: "1.5px solid rgba(137,204,65,0.45)",
                boxShadow: "0 4px 18px rgba(137,204,65,0.25)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5" style={{ color: "#28951B" }} />
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#1a3a10",
                  }}
                >
                  Need more help?
                </span>
              </div>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.75rem",
                  color: "#4a6a35",
                  marginBottom: "8px",
                }}
              >
                For technical issues, questions about data, or configuration help,
                reach out to your support contact.
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: "#28951B" }} />
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.78rem",
                      color: "#1a3a10",
                    }}
                  >
                    support@verdanist.greenhouse (contoh)
                  </span>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-4 flex items-center justify-between"
              style={{
                background: "white",
                border: "1px solid rgba(137,204,65,0.25)",
                boxShadow: "0 3px 14px rgba(0,0,0,0.06)",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#1a3a10",
                  }}
                >
                  Documentation
                </div>
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.72rem",
                    color: "#6b8a55",
                  }}
                >
                  Internal docs or knowledge base link can be added here.
                </div>
              </div>
              <ExternalLink className="w-4 h-4" style={{ color: "#28951B" }} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

