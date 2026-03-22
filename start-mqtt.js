const mqtt = require('mqtt');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple MQTT broker simulation for development
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('MQTT Broker Simulation Running\n');
});

// Mock MQTT broker that accepts connections
const mockMQTTBroker = {
  clients: new Map(),
  
  simulateConnection: () => {
    console.log('[MQTT] Mock broker started on port 1883');
    console.log('[MQTT] Accepting connections for topics:');
    console.log('  - greenhouse/indoor/sensor/temperature');
    console.log('  - greenhouse/indoor/sensor/humidity'); 
    console.log('  - greenhouse/outdoor/sensor/soil_moisture');
    console.log('  - greenhouse/indoor/control/fan');
    console.log('  - greenhouse/outdoor/control/pump');
    console.log('  - greenhouse/indoor/status');
    console.log('  - greenhouse/outdoor/status');
  }
};

server.listen(1883, () => {
  mockMQTTBroker.simulateConnection();
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('[MQTT] Mock broker stopped');
    process.exit(0);
  });
});
