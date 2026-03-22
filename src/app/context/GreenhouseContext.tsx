import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type SystemMode = "online" | "offline";
export type PumpMode = "auto" | "manual";
export type AlertSeverity = "critical" | "warning" | "info";

export interface Alert {
  id: string;
  type: string;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
  acknowledged: boolean;
}

export interface SensorData {
  indoorHumidity: number;
  indoorTemperature: number;
  soilMoisture: number;
  indoorPumpStatus: boolean;
  outdoorPumpStatus: boolean;
  waterTankLevel: number;
  signalStrength: number;
  lastSync: Date;
}

export interface ControlSettings {
  humidityThreshold: number;
  soilMoistureThreshold: number;
  pumpMode: PumpMode;
  valve1Open: boolean;
  valve2Open: boolean;
  valve3Open: boolean;
  autoScheduleEnabled: boolean;
}

export interface TimeSeriesPoint {
  time: string;
  value: number;
}

export interface GreenhouseContextType {
  systemMode: SystemMode;
  setSystemMode: (mode: SystemMode) => void;
  sensorData: SensorData;
  setSensorData: (data: Partial<SensorData>) => void;
  controlSettings: ControlSettings;
  setControlSettings: (settings: Partial<ControlSettings>) => void;
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  acknowledgeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  humidityHistory: TimeSeriesPoint[];
  soilHistory: TimeSeriesPoint[];
  temperatureHistory: TimeSeriesPoint[];
  weeklyWaterUsage: { day: string; usage: number }[];
  monthlyUptime: { month: string; uptime: number }[];
  toggleIndoorPump: () => void;
  toggleOutdoorPump: () => void;
  emergencyStop: () => void;
}

const GreenhouseContext = createContext<GreenhouseContextType | null>(null);

const generateHistory = (base: number, variance: number, points: number = 24): TimeSeriesPoint[] => {
  const now = new Date();
  return Array.from({ length: points }, (_, i) => {
    const time = new Date(now.getTime() - (points - i) * 60 * 60 * 1000);
    const hours = time.getHours().toString().padStart(2, "0");
    return {
      time: `${hours}:00`,
      value: Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance * 2)),
    };
  });
};

const initialAlerts: Alert[] = [
  {
    id: "1",
    type: "Soil Moisture",
    message: "Outdoor polybag area soil moisture critically low (28%)",
    severity: "critical",
    timestamp: new Date(Date.now() - 5 * 60000),
    acknowledged: false,
  },
  {
    id: "2",
    type: "High Humidity",
    message: "Indoor misting room humidity exceeded threshold (88%)",
    severity: "warning",
    timestamp: new Date(Date.now() - 12 * 60000),
    acknowledged: false,
  },
  {
    id: "3",
    type: "Network",
    message: "Brief network disconnection detected - auto-reconnected",
    severity: "info",
    timestamp: new Date(Date.now() - 32 * 60000),
    acknowledged: true,
  },
  {
    id: "4",
    type: "Pump System",
    message: "Outdoor pump cycle completed successfully",
    severity: "info",
    timestamp: new Date(Date.now() - 58 * 60000),
    acknowledged: true,
  },
];

export function GreenhouseProvider({ children }: { children: React.ReactNode }) {
  const [systemMode, setSystemMode] = useState<SystemMode>("online");
  const [sensorData, setSensorDataState] = useState<SensorData>({
    indoorHumidity: 72,
    indoorTemperature: 28.4,
    soilMoisture: 45,
    indoorPumpStatus: true,
    outdoorPumpStatus: false,
    waterTankLevel: 68,
    signalStrength: 87,
    lastSync: new Date(),
  });

  const [controlSettings, setControlSettingsState] = useState<ControlSettings>({
    humidityThreshold: 75,
    soilMoistureThreshold: 50,
    pumpMode: "auto",
    valve1Open: true,
    valve2Open: false,
    valve3Open: true,
    autoScheduleEnabled: true,
  });

  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  // Helper function to update sensor data
  const setSensorData = (data: Partial<SensorData>) => {
    setSensorDataState((prev: SensorData) => ({ ...prev, ...data }));
  };

  // Helper function to add new alert
  const addAlert = (alert: Omit<Alert, 'id'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
    };
    setAlerts((prev: Alert[]) => [newAlert, ...prev]);
  };

  // Helper function to update control settings
  const setControlSettingsFn = (settings: Partial<ControlSettings>) => {
    setControlSettingsState((prev: ControlSettings) => ({ ...prev, ...settings }));
  };
  const [humidityHistory, setHumidityHistory] = useState<TimeSeriesPoint[]>(generateHistory(70, 15));
  const [soilHistory, setSoilHistory] = useState<TimeSeriesPoint[]>(generateHistory(50, 20));
  const [temperatureHistory] = useState<TimeSeriesPoint[]>(generateHistory(28, 8));

  const weeklyWaterUsage = [
    { day: "Mon", usage: 42 },
    { day: "Tue", usage: 38 },
    { day: "Wed", usage: 55 },
    { day: "Thu", usage: 48 },
    { day: "Fri", usage: 61 },
    { day: "Sat", usage: 35 },
    { day: "Sun", usage: 29 },
  ];

  const monthlyUptime = [
    { month: "Sep", uptime: 99.2 },
    { month: "Oct", uptime: 98.7 },
    { month: "Nov", uptime: 99.8 },
    { month: "Dec", uptime: 97.4 },
    { month: "Jan", uptime: 99.1 },
    { month: "Feb", uptime: 99.6 },
  ];

  // Simulate real-time sensor updates
  useEffect(() => {
    if (systemMode === "offline") return;
    const interval = setInterval(() => {
      setSensorDataState((prev: SensorData) => ({
        ...prev,
        indoorHumidity: Math.max(30, Math.min(95, prev.indoorHumidity + (Math.random() - 0.5) * 3)),
        indoorTemperature: Math.max(20, Math.min(38, prev.indoorTemperature + (Math.random() - 0.5) * 0.8)),
        soilMoisture: Math.max(15, Math.min(85, prev.soilMoisture + (Math.random() - 0.5) * 2)),
        waterTankLevel: Math.max(10, Math.min(100, prev.waterTankLevel - Math.random() * 0.3)),
        signalStrength: Math.max(60, Math.min(100, prev.signalStrength + (Math.random() - 0.5) * 5)),
        lastSync: new Date(),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [systemMode]);

  const setControlSettings = useCallback((settings: Partial<ControlSettings>) => {
    setControlSettingsState((prev) => ({ ...prev, ...settings }));
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleIndoorPump = useCallback(() => {
    setSensorDataState((prev: SensorData) => ({ ...prev, indoorPumpStatus: !prev.indoorPumpStatus }));
  }, []);

  const toggleOutdoorPump = useCallback(() => {
    setSensorDataState((prev: SensorData) => ({ ...prev, outdoorPumpStatus: !prev.outdoorPumpStatus }));
  }, []);

  const emergencyStop = useCallback(() => {
    setSensorDataState((prev: SensorData) => ({ ...prev, indoorPumpStatus: false, outdoorPumpStatus: false }));
    setControlSettingsFn({ valve1Open: false, valve2Open: false, valve3Open: false });
    const newAlert: Alert = {
      id: Date.now().toString(),
      type: "Emergency Stop",
      message: "Emergency stop activated — all pumps and valves disabled",
      severity: "critical",
      timestamp: new Date(),
      acknowledged: false,
    };
    setAlerts((prev: Alert[]) => [newAlert, ...prev]);
  }, [setControlSettingsFn]);

  return (
    <GreenhouseContext.Provider
      value={{
        systemMode,
        setSystemMode,
        sensorData,
        setSensorData,
        controlSettings,
        setControlSettings: setControlSettingsFn,
        alerts,
        addAlert,
        acknowledgeAlert,
        dismissAlert,
        humidityHistory,
        soilHistory,
        temperatureHistory,
        weeklyWaterUsage,
        monthlyUptime,
        toggleIndoorPump,
        toggleOutdoorPump,
        emergencyStop,
      }}
    >
      {children}
    </GreenhouseContext.Provider>
  );
}

export function useGreenhouse() {
  const ctx = useContext(GreenhouseContext);
  if (!ctx) throw new Error("useGreenhouse must be used within GreenhouseProvider");
  return ctx;
}
