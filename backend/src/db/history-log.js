import { query } from './client.js';

/**
 * Insert an audit/event log entry.
 */
export async function insertLog({ deviceId, action, details = {}, severity = 'info' }) {
  const res = await query(
    `INSERT INTO history_log (device_id, action, details, severity, timestamp)
     VALUES ($1, $2, $3::jsonb, $4, NOW())
     RETURNING log_id, device_id, action, details, severity, timestamp`,
    [deviceId, action, JSON.stringify(details), severity]
  );
  return res.rows[0];
}

/**
 * Get recent logs for dashboard.
 */
export async function getHistoryLogs({ deviceId, action, from, to, limit = 200 }) {
  let sql = 'SELECT * FROM history_log WHERE 1=1';
  const params = [];
  let i = 1;
  if (deviceId) { sql += ` AND device_id = $${i++}`; params.push(deviceId); }
  if (action) { sql += ` AND action = $${i++}`; params.push(action); }
  if (from) { sql += ` AND timestamp >= $${i++}`; params.push(from); }
  if (to) { sql += ` AND timestamp <= $${i++}`; params.push(to); }
  sql += ` ORDER BY timestamp DESC LIMIT $${i}`;
  params.push(limit);
  const res = await query(sql, params);
  return res.rows;
}
