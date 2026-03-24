// Firebase service for Verdanist Greenhouse
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';
import firebaseConfig from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Firebase services
export const firebaseService = {
  // Get real-time data for a device
  subscribeToDevice: (deviceId, callback) => {
    const deviceRef = ref(database, `devices/${deviceId}`);
    return onValue(deviceRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  },

  // Update sensor data
  updateSensorData: async (deviceId, sensorData) => {
    const deviceRef = ref(database, `devices/${deviceId}`);
    const updates = {
      'sensors': sensorData,
      'lastSeen': new Date().toISOString(),
      'status': 'online'
    };
    return update(deviceRef, updates);
  },

  // Update control commands
  updateControl: async (deviceId, controlType, command) => {
    const deviceRef = ref(database, `devices/${deviceId}/controls/${controlType}`);
    return set(deviceRef, command);
  },

  // Get all devices
  getAllDevices: (callback) => {
    const devicesRef = ref(database, 'devices');
    return onValue(devicesRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  },

  // Health check
  healthCheck: async () => {
    try {
      const testRef = ref(database, '.info/connected');
      return new Promise((resolve) => {
        onValue(testRef, (snapshot) => {
          resolve(snapshot.val() === true);
        });
      });
    } catch (error) {
      return false;
    }
  }
};

export default firebaseService;
