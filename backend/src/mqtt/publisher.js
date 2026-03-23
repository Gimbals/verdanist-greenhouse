import mqtt from 'mqtt';
import { config, MQTT_TOPICS } from '../config.js';
import { getPendingControls, markControlSent } from '../db/device-control.js';
import { insertLog } from '../db/history-log.js';

/**
 * Map device_id + control_type to MQTT control topic.
 */
const CONTROL_TOPIC_MAP = {
  'indoor-01': {
    fan: MQTT_TOPICS.control.indoorFan,
  },
  'outdoor-01': {
    pump: MQTT_TOPICS.control.outdoorPump,
  },
};

/**
 * Serialize control command for MQTT payload. ESP32 can expect e.g. "on" | "off" | JSON.
 */
function controlPayload(command, value) {
  if (value != null) {
    return JSON.stringify({ command: String(command).toLowerCase(), value: Number(value) });
  }
  return String(command).toLowerCase();
}

/**
 * Publish a single control command to MQTT and mark as sent.
 */
export async function publishControl(client, { control_id, device_id, control_type, command, value }) {
  const topicMap = CONTROL_TOPIC_MAP[device_id];
  if (!topicMap) {
    console.warn('[MQTT] unknown device for control', device_id);
    return false;
  }
  const topic = topicMap[control_type];
  if (!topic) {
    console.warn('[MQTT] unknown control type', control_type, 'for', device_id);
    return false;
  }
  const payload = controlPayload(command, value);
  return new Promise((resolve) => {
    client.publish(topic, payload, { qos: 1 }, async (err) => {
      if (err) {
        console.error('[MQTT] publish error', { topic, err: err.message });
        await insertLog({
          deviceId: device_id,
          action: 'control_publish_failed',
          details: { topic, command, err: err.message },
          severity: 'error',
        });
        resolve(false);
        return;
      }
      await markControlSent(control_id);
      await insertLog({
        deviceId: device_id,
        action: 'control_sent',
        details: { topic, command, value },
        severity: 'info',
      });
      if (config.nodeEnv === 'development') {
        console.log('[MQTT] published', topic, payload);
      }
      resolve(true);
    });
  });
}

/**
 * Process all pending control commands in DB (e.g. after API enqueues them).
 */
export async function processPendingControls(client) {
  const pending = await getPendingControls();
  for (const row of pending) {
    await publishControl(client, row);
  }
}

/**
 * Create MQTT client for publishing. Can be shared with subscriber or separate.
 */
export function createPublisher() {
  const { brokerUrl, clientId, username, password } = config.mqtt;
  const options = {
    clientId: clientId + '-pub-' + Math.random().toString(16).substr(2, 8),
    clean: true,
    reconnectPeriod: 5000,
    connectTimeout: 10000,
    keepalive: 60,
    protocol: 'wss',
  };
  if (username) options.username = username;
  if (password) options.password = password;

  const client = mqtt.connect(brokerUrl, options);

  client.on('connect', () => {
    console.log('[MQTT] Publisher connected to broker:', brokerUrl);
    processPendingControls(client).catch((err) => console.error('[MQTT] process pending controls', err));
  });

  client.on('reconnect', () => {
    console.log('[MQTT] Publisher reconnecting...');
  });

  client.on('error', (err) => {
    console.error('[MQTT] Publisher connection error:', err.message);
    // Don't reconnect immediately on certain errors
    if (err.message.includes('ECONNRESET') || err.message.includes('ECONNREFUSED')) {
      console.log('[MQTT] Publisher will reconnect in 10 seconds...');
      setTimeout(() => {
        if (!client.connected) {
          client.reconnect();
        }
      }, 10000);
    }
  });

  client.on('close', () => console.log('[MQTT] Publisher connection closed'));

  return client;
}

/**
 * Publish control command immediately (from API). Use this when API receives a control request.
 */
export function publishControlNow(client, { deviceId, controlType, command, value }) {
  const topicMap = CONTROL_TOPIC_MAP[deviceId];
  if (!topicMap) return Promise.resolve(false);
  const topic = topicMap[controlType];
  if (!topic) return Promise.resolve(false);
  const payload = controlPayload(command, value);
  return new Promise((resolve) => {
    if (!client || !client.connected) {
      console.error('[MQTT] publisher not connected');
      resolve(false);
      return;
    }
    client.publish(topic, payload, { qos: 1 }, (err) => {
      if (err) {
        console.error('[MQTT] publish error', err.message);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}
