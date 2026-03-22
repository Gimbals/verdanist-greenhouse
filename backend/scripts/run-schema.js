/**
 * Run database/schema.sql against DATABASE_URL.
 * Usage: node scripts/run-schema.js
 * Requires: pg and fs. DATABASE_URL in .env.
 */
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
const sql = fs.readFileSync(schemaPath, 'utf8');

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await client.connect();
  await client.query(sql);
  console.log('Schema applied successfully.');
  await client.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
