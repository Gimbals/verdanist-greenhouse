import mqtt from 'mqtt';

import { config, SENSOR_TOPICS_LIST, STATUS_TOPICS_LIST, MQTT_TOPICS } from '../config.js';

import { insertSensorData } from '../db/sensor-data.js';

import { upsertDevice } from '../db/devices.js';

import { insertLog } from '../db/history-log.js';



/**

 * Map MQTT topic to device_id and sensor_type for sensor_data table.

 */

const SENSOR_TOPIC_MAP = {

  [MQTT_TOPICS.sensor.indoorTemperature]: { deviceId: 'indoor-01', sensorType: 'temperature', unit: '°C' },

  [MQTT_TOPICS.sensor.indoorHumidity]: { deviceId: 'indoor-01', sensorType: 'humidity', unit: '%' },

  [MQTT_TOPICS.sensor.outdoorSoilMoisture]: { deviceId: 'outdoor-01', sensorType: 'soil_moisture', unit: '%' },

};



const STATUS_TOPIC_MAP = {

  [MQTT_TOPICS.status.indoor]: { deviceId: 'indoor-01', location: 'indoor' },

  [MQTT_TOPICS.status.outdoor]: { deviceId: 'outdoor-01', location: 'outdoor' },

};



/**

 * Parse payload: MQTT payloads may be JSON or plain number string.

 */

function parsePayload(payload) {

  if (Buffer.isBuffer(payload)) payload = payload.toString();

  if (typeof payload === 'string') {

    const trimmed = payload.trim();

    const num = Number(trimmed);

    if (!Number.isNaN(num)) return num;

    try {

      return JSON.parse(trimmed);

    } catch {

      return trimmed;

    }

  }

  return payload;

}



/**

 * Handle incoming sensor message: store in sensor_data and optionally log.

 */

async function handleSensorMessage(topic, payload) {

  const meta = SENSOR_TOPIC_MAP[topic];

  if (!meta) return;

  const value = parsePayload(payload);

  const num = typeof value === 'object' && value != null && 'value' in value ? value.value : value;

  if (num === undefined || Number.isNaN(Number(num))) return;

  try {

    await insertSensorData({

      deviceId: meta.deviceId,

      sensorType: meta.sensorType,

      value: Number(num),

      unit: meta.unit,

    });

    if (config.nodeEnv === 'development') {

      console.log('[MQTT] sensor', topic, '->', meta.sensorType, num, meta.unit);

    }

  } catch (err) {

    console.error('[MQTT] failed to store sensor data', { topic, err: err.message });

    await insertLog({ deviceId: meta.deviceId, action: 'sensor_store_error', details: { topic, err: err.message }, severity: 'error' });

  }

}



/**

 * Handle status message: update device status (online/offline) and last_seen_at.

 */

async function handleStatusMessage(topic, payload) {

  const meta = STATUS_TOPIC_MAP[topic];

  if (!meta) return;

  const raw = parsePayload(payload);

  let status = 'online';

  let metadata = {};

  if (typeof raw === 'object' && raw !== null) {

    if (typeof raw.status === 'string') status = raw.status;

    if (raw.metadata) metadata = raw.metadata;

  } else if (typeof raw === 'string') {

    status = raw.toLowerCase() === 'offline' ? 'offline' : 'online';

  }

  try {

    await upsertDevice({

      deviceId: meta.deviceId,

      deviceName: meta.location === 'indoor' ? 'ESP32 Indoor Node' : 'ESP32 Outdoor Node',

      location: meta.location,

      status,

      metadata,

    });

    await insertLog({

      deviceId: meta.deviceId,

      action: 'device_status',

      details: { status, topic },

      severity: 'info',

    });

    if (config.nodeEnv === 'development') {

      console.log('[MQTT] status', topic, '->', meta.deviceId, status);

    }

  } catch (err) {

    console.error('[MQTT] failed to update device status', { topic, err: err.message });

  }

}



/**

 * Create MQTT client, subscribe to sensor and status topics, and handle messages.

 */

export function createSubscriber() {

  const { brokerUrl, clientId, username, password } = config.mqtt;

  const options = {

    clientId: clientId + '-sub-' + Math.random().toString(16).substr(2, 8),

    clean: true,

    reconnectPeriod: 5000,

    connectTimeout: 10000,

    keepalive: 60,

  };

  if (username) options.username = username;

  if (password) options.password = password;



  const client = mqtt.connect(brokerUrl, options);



  client.on('connect', () => {
    console.log('[MQTT] Connected to broker:', brokerUrl);
    const topics = [...SENSOR_TOPICS_LIST, ...STATUS_TOPICS_LIST];
    client.subscribe(topics, { qos: 1 }, (err) => {
      if (err) {
        console.error('[MQTT] subscribe error', err);
        return;
      }
      console.log('[MQTT] subscribed to', topics.length, 'topics');
    });
  });

  client.on('reconnect', () => {
    console.log('[MQTT] Reconnecting to broker...');
  });

  client.on('error', (err) => {
    console.error('[MQTT] Connection error:', err.message);
  });



  client.on('message', async (topic, payload) => {

    if (SENSOR_TOPIC_MAP[topic]) {

      await handleSensorMessage(topic, payload);

    } else if (STATUS_TOPIC_MAP[topic]) {

      await handleStatusMessage(topic, payload);

    }

  });



  client.on('error', (err) => console.error('[MQTT] client error', err));

  client.on('close', () => console.log('[MQTT] subscriber connection closed'));

  client.on('offline', () => console.log('[MQTT] subscriber offline'));



  return client;

}

