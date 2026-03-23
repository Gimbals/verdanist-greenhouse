/**
 * Database migration runner
 * Automatically runs schema.sql on startup
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './client.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');

/**
 * Run database migrations
 */
export async function runMigrations() {
  try {
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(sql);
    console.log('[Database] Schema applied successfully');
    
    // Verify tables exist
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    console.log('[Database] Tables created:', tablesCheck.rows.map(row => row.table_name).join(', '));
    
    return true;
  } catch (err) {
    console.error('[Database] Migration error:', err.message);
    throw err;
  }
}
