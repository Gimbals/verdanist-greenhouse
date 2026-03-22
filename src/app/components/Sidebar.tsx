import { NavLink } from "react-router";
import { 
  LayoutDashboard, 
  Activity, 
  Sliders, 
  BarChart3, 
  Settings, 
  Leaf,
  LogOut,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/monitoring", label: "Monitoring", icon: Activity },
  { to: "/control", label: "Control", icon: Sliders },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();
  
  console.log('Sidebar rendered, isOpen:', isOpen);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E6F786]">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-[#E6F786]">
        <div className="w-8 h-8 rounded-lg bg-[#28951B] flex items-center justify-center text-white">
          <Leaf className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-[#1a3a10] text-lg tracking-tight block">Verdanist</span>
          <span className="text-[10px] text-[#4a6a35] uppercase tracking-wider font-semibold">IoT Platform</span>
        </div>
        <button onClick={() => {
            console.log('Sidebar close clicked');
            onClose();
          }} className="ml-auto lg:hidden text-[#4a6a35]">
            <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-[#4a6a35]/60 uppercase tracking-wider px-3 mb-2">Menu</div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => {
              console.log('Sidebar nav clicked:', to, label);
              onClose();
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-[#E6F786] text-[#1a3a10] font-semibold"
                  : "text-[#4a6a35] hover:bg-[#E6F786]/50 hover:text-[#1a3a10]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-[#28951B]" : "text-[#4a6a35] group-hover:text-[#28951B]"
                  }`}
                />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-6 bg-[#28951B] rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-[#E6F786]">
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[#ef4444] hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
