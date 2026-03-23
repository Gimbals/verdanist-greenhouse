import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/verdanist',
  mqtt: {
    brokerUrl: process.env.MQTT_BROKER || 'mqtt://broker.hivemq.com:1883',
    clientId: process.env.MQTT_CLIENT_ID || 'verdanist-backend',
    username: process.env.MQTT_USERNAME || undefined,
    password: process.env.MQTT_PASSWORD || undefined,
  },
  apiKey: process.env.API_KEY || undefined,
};

// MQTT topics (single source of truth)
export const MQTT_TOPICS = {
  sensor: {
    indoorTemperature: 'greenhouse/indoor/sensor/temperature',
    indoorHumidity: 'greenhouse/indoor/sensor/humidity',
    outdoorSoilMoisture: 'greenhouse/outdoor/sensor/soil_moisture',
  },
  control: {
    indoorFan: 'greenhouse/indoor/control/fan',
    outdoorPump: 'greenhouse/outdoor/control/pump',
  },
  status: {
    indoor: 'greenhouse/indoor/status',
    outdoor: 'greenhouse/outdoor/status',
  },
};

export const SENSOR_TOPICS_LIST = [
  MQTT_TOPICS.sensor.indoorTemperature,
  MQTT_TOPICS.sensor.indoorHumidity,
  MQTT_TOPICS.sensor.outdoorSoilMoisture,
];

export const STATUS_TOPICS_LIST = [
  MQTT_TOPICS.status.indoor,
  MQTT_TOPICS.status.outdoor,
];
