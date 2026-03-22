import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { useGreenhouse } from '../context/GreenhouseContext';
import { SensorData, ControlSettings } from '../context/GreenhouseContext';

interface SensorDataUpdate {
  indoorHumidity: number;
  indoorTemperature: number;
  soilMoisture: number;
  waterTankLevel: number;
  timestamp: string;
}

interface DeviceStatusUpdate {
  indoorPumpStatus: boolean;
  outdoorPumpStatus: boolean;
  valve1Open: boolean;
  valve2Open: boolean;
  valve3Open: boolean;
  timestamp: string;
}

interface AlertUpdate {
  id: string;
  type: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
}

export const useRealtimeData = () => {
  const { 
    setSensorData, 
    setControlSettings, 
    addAlert,
    sensorData 
  } = useGreenhouse();
  
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const wsUrl = `ws://localhost:3002/ws`;
  const { 
    isConnected, 
    lastMessage, 
    sendMessage, 
    connectionError 
  } = useWebSocket(wsUrl);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    const { type, data } = lastMessage;
    
    switch (type) {
      case 'sensor_data':
        handleSensorDataUpdate(data);
        break;
      case 'device_status':
        handleDeviceStatusUpdate(data);
        break;
      case 'alert':
        handleAlertUpdate(data);
        break;
      case 'control_update':
        handleControlUpdate(data);
        break;
      default:
        console.warn('Unknown WebSocket message type:', type);
    }
    
    setLastUpdate(new Date());
  }, [lastMessage]);

  const handleSensorDataUpdate = useCallback((data: SensorDataUpdate) => {
    setSensorData({
      indoorHumidity: data.indoorHumidity,
      indoorTemperature: data.indoorTemperature,
      soilMoisture: data.soilMoisture,
      waterTankLevel: data.waterTankLevel,
      lastSync: new Date(data.timestamp),
    });
  }, [setSensorData]);

  const handleDeviceStatusUpdate = useCallback((data: DeviceStatusUpdate) => {
    setControlSettings({
      valve1Open: data.valve1Open,
      valve2Open: data.valve2Open,
      valve3Open: data.valve3Open,
    });
    
    // Update pump status in sensor data
    setSensorData({
      indoorPumpStatus: data.indoorPumpStatus,
      outdoorPumpStatus: data.outdoorPumpStatus,
      lastSync: new Date(data.timestamp),
    });
  }, [setControlSettings, setSensorData]);

  const handleAlertUpdate = useCallback((data: AlertUpdate) => {
    addAlert({
      type: data.type,
      message: data.message,
      severity: data.severity,
      timestamp: new Date(data.timestamp),
      acknowledged: false,
    });
  }, [addAlert]);

  const handleControlUpdate = useCallback((data: any) => {
    // Handle control command confirmations
    console.log('Control update received:', data);
  }, []);

  // Send control commands via WebSocket
  const sendControlCommand = useCallback((command: {
    device: string;
    action: string;
    value?: any;
  }) => {
    sendMessage({
      type: 'control_command',
      data: command,
      timestamp: new Date().toISOString(),
    });
  }, [sendMessage]);

  // Request manual data refresh
  const requestDataRefresh = useCallback(() => {
    sendMessage({
      type: 'refresh_request',
      data: { timestamp: new Date().toISOString() },
    });
  }, [sendMessage]);

  // Toggle real-time updates
  const toggleRealtime = useCallback(() => {
    setIsRealtimeActive(prev => !prev);
  }, []);

  useEffect(() => {
    setIsRealtimeActive(isConnected);
  }, [isConnected]);

  return {
    isConnected,
    isRealtimeActive,
    lastUpdate,
    connectionError,
    sendControlCommand,
    requestDataRefresh,
    toggleRealtime,
    lastMessage,
  };
};
