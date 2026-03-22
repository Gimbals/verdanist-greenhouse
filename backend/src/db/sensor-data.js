import { query } from './client.js';

/**
 * Insert sensor reading from MQTT into sensor_data table.
 * @param {Object} params - { deviceId, sensorType, value, unit }
 */
export async function insertSensorData({ deviceId, sensorType, value, unit = null }) {
  const res = await query(
    `INSERT INTO sensor_data (device_id, sensor_type, value, unit, timestamp)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING data_id, device_id, sensor_type, value, unit, timestamp`,
    [deviceId, sensorType, parseFloat(value), unit]
  );
  return res.rows[0];
}

/**
 * Get latest sensor readings per device/sensor (for dashboard "current" view).
 */
export async function getLatestSensorData(deviceId = null) {
  const subQuery = `
    SELECT DISTINCT ON (device_id, sensor_type) data_id, device_id, sensor_type, value, unit, timestamp
    FROM sensor_data
    ${deviceId ? 'WHERE device_id = $1' : ''}
    ORDER BY device_id, sensor_type, timestamp DESC
  `;
  const res = await query(deviceId ? subQuery : subQuery.replace('$1', 'NULL'), deviceId ? [deviceId] : []);
  return res.rows;
}

/**
 * Get historical sensor data with optional filters (for charts).
 */
export async function getSensorDataHistory({ deviceId, sensorType, from, to, limit = 500 }) {
  let sql = `
    SELECT data_id, device_id, sensor_type, value, unit, timestamp
    FROM sensor_data
    WHERE 1=1
  `;
  const params = [];
  let i = 1;
  if (deviceId) { sql += ` AND device_id = $${i++}`; params.push(deviceId); }
  if (sensorType) { sql += ` AND sensor_type = $${i++}`; params.push(sensorType); }
  if (from) { sql += ` AND timestamp >= $${i++}`; params.push(from); }
  if (to) { sql += ` AND timestamp <= $${i++}`; params.push(to); }
  sql += ` ORDER BY timestamp DESC LIMIT $${i}`;
  params.push(limit);

  const res = await query(sql, params);
  return res.rows;
}
