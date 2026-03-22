import { query } from './client.js';

/**
 * Create a control command (pending) and return it. MQTT publisher will send and update status.
 */
export async function createControlCommand({ deviceId, controlType, command, value = null }) {
  const res = await query(
    `INSERT INTO device_control (device_id, control_type, command, status, value)
     VALUES ($1, $2, $3, 'pending', $4)
     RETURNING control_id, device_id, control_type, command, status, value, created_at`,
    [deviceId, controlType, command, value]
  );
  return res.rows[0];
}

/**
 * Mark control as sent (when we publish to MQTT).
 */
export async function markControlSent(controlId) {
  await query(
    `UPDATE device_control SET status = 'sent', sent_at = NOW(), updated_at = NOW() WHERE control_id = $1`,
    [controlId]
  );
}

/**
 * Get pending control commands (e.g. for retry or status sync).
 */
export async function getPendingControls() {
  const res = await query(
    `SELECT * FROM device_control WHERE status = 'pending' ORDER BY created_at ASC`
  );
  return res.rows;
}

/**
 * Get control history for dashboard.
 */
export async function getControlHistory(deviceId = null, limit = 100) {
  let sql = 'SELECT * FROM device_control WHERE 1=1';
  const params = [];
  if (deviceId) { sql += ' AND device_id = $1'; params.push(deviceId); }
  sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
  params.push(limit);
  const res = await query(sql, params);
  return res.rows;
}
