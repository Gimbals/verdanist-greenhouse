import pg from 'pg';
import { config } from '../config.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development' && duration > 100) {
      console.log('[DB] slow query', { text: text.substring(0, 80), duration });
    }
    return res;
  } catch (err) {
    console.error('[DB] query error', { text: text.substring(0, 80), err: err.message });
    throw err;
  }
}

export async function healthCheck() {
  try {
    const res = await pool.query('SELECT 1');
    return res.rowCount === 1;
  } catch (err) {
    console.error('[DB] health check failed', err.message);
    return false;
  }
}
