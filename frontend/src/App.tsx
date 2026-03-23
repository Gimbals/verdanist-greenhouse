import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [systemStatus, setSystemStatus] = useState({
    backend: 'loading',
    database: 'loading',
    mqtt: 'loading'
  });

  useEffect(() => {
    // Fetch system health status
    const fetchHealth = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://verdanist-greenhouse.up.railway.app'}/health`);
        const data = await response.json();
        
        setSystemStatus({
          backend: data.status === 'ok' ? 'connected' : 'error',
          database: data.database === 'connected' ? 'ready' : 'error',
          mqtt: 'listening' // We'll assume MQTT is working if backend is up
        });
      } catch (error) {
        setSystemStatus({
          backend: 'error',
          database: 'error',
          mqtt: 'error'
        });
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'connected':
      case 'ready':
      case 'listening':
        return '✅';
      case 'loading':
        return '⏳';
      case 'error':
        return '❌';
      default:
        return '❓';
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
            <span className="status-label">Backend:</span>
            <span className="status-value">{getStatusIcon(systemStatus.backend)} {systemStatus.backend}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Database:</span>
            <span className="status-value">{getStatusIcon(systemStatus.database)} {systemStatus.database}</span>
          </div>
          <div className="status-item">
            <span className="status-label">MQTT:</span>
            <span className="status-value">{getStatusIcon(systemStatus.mqtt)} {systemStatus.mqtt}</span>
          </div>
        </div>
        <div className="footer">
          Deployed on Railway 🚀 | Real-time IoT Monitoring
        </div>
      </div>
    </div>
  )
}

export default App
