import { motion } from "motion/react";
import { Sliders } from "lucide-react";
import { ControlPanel } from "../components/ControlPanel";
import { useTheme } from "../context/ThemeContext";

export function ControlPage() {
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
              <Sliders className="w-5 h-5" style={{ color: "#28951B" }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a3a10" }}>
                System Control
              </h1>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.82rem", color: "#6b8a55" }}>
                Manage pumps, valves, and automation settings
              </p>
            </div>
          </div>
        </motion.div>

        <ControlPanel />
      </div>
    </div>
  );
}
