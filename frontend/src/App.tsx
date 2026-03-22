import React from 'react'
import './App.css'

function App() {
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
            <span className="status-value">✅ Connected</span>
          </div>
          <div className="status-item">
            <span className="status-label">Database:</span>
            <span className="status-value">✅ Ready</span>
          </div>
          <div className="status-item">
            <span className="status-label">MQTT:</span>
            <span className="status-value">✅ Listening</span>
          </div>
        </div>
        <div className="footer">
          Deployed on Railway 🚀 | Free Forever Hosting
        </div>
      </div>
    </div>
  )
}

export default App
