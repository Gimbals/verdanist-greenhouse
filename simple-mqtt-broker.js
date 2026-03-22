import net from 'net';
import { EventEmitter } from 'events';

class SimpleMQTTBroker extends EventEmitter {
  constructor() {
    super();
    this.clients = new Set();
    this.topics = new Map();
  }

  start(port = 1883) {
    this.server = net.createServer((socket) => {
      console.log('[MQTT] Client connected');
      
      socket.on('data', (data) => {
        // Simple MQTT packet simulation
        console.log('[MQTT] Received data:', data.length, 'bytes');
        
        // Send mock connection response
        const response = Buffer.from([0x20, 0x02, 0x00, 0x00]); // CONNACK
        socket.write(response);
        
        this.clients.add(socket);
      });

      socket.on('end', () => {
        console.log('[MQTT] Client disconnected');
        this.clients.delete(socket);
      });

      socket.on('error', (err) => {
        console.log('[MQTT] Socket error:', err.message);
        this.clients.delete(socket);
      });
    });

    this.server.listen(port, () => {
      console.log(`[MQTT] Mock broker listening on port ${port}`);
      console.log('[MQTT] Available topics:');
      console.log('  - greenhouse/indoor/sensor/temperature');
      console.log('  - greenhouse/indoor/sensor/humidity');
      console.log('  - greenhouse/outdoor/sensor/soil_moisture');
      console.log('  - greenhouse/indoor/control/fan');
      console.log('  - greenhouse/outdoor/control/pump');
      console.log('  - greenhouse/indoor/status');
      console.log('  - greenhouse/outdoor/status');
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      console.log('[MQTT] Mock broker stopped');
    }
  }
}

const broker = new SimpleMQTTBroker();
broker.start(1883);

process.on('SIGINT', () => {
  broker.stop();
  process.exit(0);
});
