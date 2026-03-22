import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { TopNavBar } from "./TopNavBar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export function Layout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log('Layout rendered, sidebarOpen:', sidebarOpen);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E6F786]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#28951B]"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#FFFFF0] font-['Poppins']">
      <Sidebar isOpen={sidebarOpen} onClose={() => {
            console.log('Layout onClose called, setting sidebarOpen to false');
            setSidebarOpen(false);
          }} />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopNavBar onMenuClick={() => {
            console.log('Layout onMenuClick called, setting sidebarOpen to true');
            setSidebarOpen(true);
          }} />
        
        <main className="flex-1 pt-20 px-4 pb-8 lg:px-8 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
