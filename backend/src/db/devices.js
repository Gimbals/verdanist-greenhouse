import { query } from './client.js';

/**
 * Upsert device and set status / last_seen_at.
 */
export async function upsertDevice({ deviceId, deviceName, location, status = 'online', metadata = {} }) {
  const res = await query(
    `INSERT INTO devices (device_id, device_name, location, status, last_seen_at, metadata, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), $5::jsonb, NOW())
     ON CONFLICT (device_id) DO UPDATE SET
       status = EXCLUDED.status,
       last_seen_at = NOW(),
       metadata = COALESCE(devices.metadata, '{}') || EXCLUDED.metadata,
       updated_at = NOW()
     RETURNING device_id, device_name, location, status, last_seen_at, metadata, created_at, updated_at`,
    [deviceId, deviceName || deviceId, location, status, JSON.stringify(metadata)]
  );
  return res.rows[0];
}

/**
 * Get all devices or by location.
 */
export async function getDevices(location = null) {
  const sql = location
    ? 'SELECT * FROM devices WHERE location = $1 ORDER BY device_id'
    : 'SELECT * FROM devices ORDER BY location, device_id';
  const res = await query(sql, location ? [location] : []);
  return res.rows;
}

/**
 * Get single device by id.
 */
export async function getDeviceById(deviceId) {
  const res = await query('SELECT * FROM devices WHERE device_id = $1', [deviceId]);
  return res.rows[0] || null;
}
