import React, { useState, useEffect } from 'react'
import './App.css'
import { firebaseService } from './firebase-service.js'

interface Device {
  name?: string;
  type?: string;
  location?: string;
  status?: string;
  lastSeen?: string;
  sensors?: Record<string, number>;
  controls?: Record<string, string>;
}

interface Devices {
  [key: string]: Device;
}

interface SystemStatus {
  firebase: string;
  devices: string;
  connection: string;
}

function App() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    firebase: 'loading',
    devices: 'loading',
    connection: 'loading'
  });

  const [devices, setDevices] = useState<Devices>({});

  useEffect(() => {
    // Check Firebase connection
    const checkFirebaseConnection = async () => {
      try {
        const isConnected = await firebaseService.healthCheck();
        setSystemStatus(prev => ({
          ...prev,
          firebase: isConnected ? 'connected' : 'error',
          connection: isConnected ? 'online' : 'offline'
        }));

        // Subscribe to all devices
        firebaseService.getAllDevices((deviceData: Devices) => {
          setDevices(deviceData || {});
          setSystemStatus(prev => ({
            ...prev,
            devices: deviceData ? 'ready' : 'error'
          }));
        });
      } catch (error) {
        setSystemStatus({
          firebase: 'error',
          devices: 'error',
          connection: 'offline'
        });
      }
    };

    checkFirebaseConnection();
  }, []);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'connected':
      case 'ready':
      case 'online':
        return '✅';
      case 'loading':
        return '⏳';
      case 'error':
      case 'offline':
        return '❌';
      default:
        return '❓';
    }
  };

  const handleControlChange = async (deviceId: string, controlType: string, value: string) => {
    try {
      await firebaseService.updateControl(deviceId, controlType, value);
      console.log(`Control updated: ${deviceId}.${controlType} = ${value}`);
    } catch (error) {
      console.error('Failed to update control:', error);
    }
  };

  return (
    <div className="app-container">
      <div>
        <h1 className="title">
          🌱 Verdanist IoT Greenhouse
        </h1>
        <p className="subtitle">
          Smart Monitoring & Automation System
        </p>
        
        <div className="status-card">
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', textAlign: 'center' }}>
            System Status
          </h2>
          <div className="status-item">
            <span className="status-label">Frontend:</span>
            <span className="status-value">✅ Active</span>
          </div>
          <div className="status-item">
            <span className="status-label">Firebase:</span>
            <span className="status-value">{getStatusIcon(systemStatus.firebase)} {systemStatus.firebase}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Devices:</span>
            <span className="status-value">{getStatusIcon(systemStatus.devices)} {systemStatus.devices}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Connection:</span>
            <span className="status-value">{getStatusIcon(systemStatus.connection)} {systemStatus.connection}</span>
          </div>
        </div>

        {/* Device Cards */}
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', textAlign: 'center' }}>
            Device Monitoring
          </h2>
          {Object.entries(devices).map(([deviceId, device]) => (
            <div key={deviceId} className="status-card" style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                {device?.name || deviceId}
              </h3>
              
              {/* Sensors */}
              {device?.sensors && (
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>
                    Sensors:
                  </h4>
                  {Object.entries(device.sensors).map(([sensorType, value]) => (
                    <div key={sensorType} className="status-item">
                      <span className="status-label">{sensorType}:</span>
                      <span className="status-value">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Controls */}
              {device?.controls && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>
                    Controls:
                  </h4>
                  {Object.entries(device.controls).map(([controlType, value]) => (
                    <div key={controlType} className="status-item">
                      <span className="status-label">{controlType}:</span>
                      <select 
                        value={value} 
                        onChange={(e) => handleControlChange(deviceId, controlType, e.target.value)}
                        style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          border: '1px solid #d1d5db',
                          fontSize: '14px'
                        }}
                      >
                        <option value="off">Off</option>
                        <option value="on">On</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="footer">
          Powered by Firebase + Vercel 🚀 | Real-time IoT Monitoring
        </div>
      </div>
    </div>
  )
}

export default App
