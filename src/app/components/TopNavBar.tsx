import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Wifi,
  WifiOff,
  User,
  ChevronDown,
  Menu,
  Radio,
} from "lucide-react";
import { useGreenhouse } from "../context/GreenhouseContext";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationCenter } from "./NotificationCenter";
import { LanguageToggle } from "./LanguageToggle";

interface TopNavBarProps {
  onMenuClick: () => void;
}

export function TopNavBar({ onMenuClick }: TopNavBarProps) {
  const { systemMode, setSystemMode, alerts, sensorData } = useGreenhouse();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = alerts.filter((a) => !a.acknowledged).length;
  const isOnline = systemMode === "online";

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard Overview";
    if (path.includes("monitoring")) return "Real-time Monitoring";
    if (path.includes("control")) return "System Control";
    if (path.includes("reports")) return "Data Reports";
    if (path.includes("settings")) return "Settings";
    if (path.includes("profile")) return "My Profile";
    if (path.includes("help")) return "Help & Support";
    return "Dashboard";
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-64 h-16 z-20 bg-white border-b border-[#E6F786] px-4 lg:px-8 flex items-center justify-between shadow-sm"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            console.log('Hamburger menu clicked');
            onMenuClick();
          }}
          className="p-2 -ml-2 rounded-lg text-[#4a6a35] hover:bg-[#E6F786] lg:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-[#1a3a10] hidden sm:block">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Mode Toggle */}
        <motion.button
          onClick={() => setSystemMode(isOnline ? "offline" : "online")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300 border"
          style={{
            background: isOnline ? "rgba(40, 149, 27, 0.1)" : "rgba(239, 68, 68, 0.1)",
            borderColor: isOnline ? "#28951B" : "#ef4444",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: isOnline ? "#28951B" : "#ef4444" }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {isOnline ? (
            <Wifi className="w-3.5 h-3.5 text-[#28951B]" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-red-500" />
          )}
          <span
            className="hidden sm:block font-semibold text-xs uppercase tracking-wide"
            style={{ color: isOnline ? "#28951B" : "#ef4444" }}
          >
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </motion.button>

        {/* Signal Strength - Hidden on small mobile */}
        <div className="hidden sm:flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#4a6a35]" />
          <div className="flex items-end gap-0.5">
            {[3, 5, 7, 9].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-sm transition-all duration-500"
                style={{
                  height: `${h}px`,
                  background: i < Math.ceil((sensorData.signalStrength / 100) * 4) ? "#28951B" : "#E6F786",
                }}
              />
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>

        {/* Language Toggle */}
        <div className="hidden sm:flex items-center">
          <LanguageToggle />
        </div>

        {/* Notifications */}
        <NotificationCenter />

        {/* User Profile - Mobile optimized */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#E6F786] transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E6F786] flex items-center justify-center text-[#28951B]">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-[#1a3a10] text-sm font-semibold leading-none">
                {user?.name || "Admin User"}
              </div>
              <div className="text-[#4a6a35] text-[10px] uppercase font-bold leading-none mt-1">
                Farm Operator
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#4a6a35] hidden lg:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-[#E6F786]"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="px-4 py-2 border-b border-[#E6F786]">
                  <div className="text-sm font-semibold text-[#1a3a10]">{user?.email || "admin@verdanist.com"}</div>
                </div>
                {[
                  { label: "My Profile", path: "/profile" },
                  { label: "System Settings", path: "/settings" },
                  { label: "Help & Support", path: "/help" },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      console.log('Navigation clicked:', item.path, item.label);
                      setProfileOpen(false);
                      navigate(item.path);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#E6F786]/50 text-sm text-[#4a6a35] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-[#E6F786] mt-1 pt-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm text-red-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
