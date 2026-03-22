import { SystemOverview } from "../components/SystemOverview";
import { MonitoringCards } from "../components/MonitoringCards";
import { ControlPanel } from "../components/ControlPanel";
import { DataAnalytics } from "../components/DataAnalytics";
import { AlertPanel } from "../components/AlertPanel";
import { RealtimeStatus } from "../components/RealtimeStatus";
import { useTheme } from "../context/ThemeContext";

export function DashboardPage() {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen px-2 sm:px-4 lg:px-8 py-4 sm:py-8" style={{ 
      fontFamily: "Poppins, sans-serif",
      background: 'var(--background)',
      color: 'var(--foreground)'
    }}>
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-8">
        {/* Real-time Status */}
        <section className="flex justify-end">
          <RealtimeStatus />
        </section>

        {/* System Overview */}
        <section>
          <SystemOverview />
        </section>

        {/* Monitoring Cards */}
        <section>
          <MonitoringCards />
        </section>

        {/* Control Panel */}
        <section>
          <ControlPanel />
        </section>

        {/* Analytics + Alerts side by side on larger screens */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-8">
          <div className="xl:col-span-2">
            <DataAnalytics />
          </div>
          <div className="xl:col-span-1">
            <AlertPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
