import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setupDatabase() {
  const client = new pg.Client({ 
    connectionString: process.env.DATABASE_URL.replace('verdanist', 'postgres')
  });
  
  try {
    await client.connect();
    console.log('[DB] Connected to PostgreSQL server');
    
    // Create database if not exists
    try {
      await client.query('CREATE DATABASE verdanist');
      console.log('[DB] Database "verdanist" created');
    } catch (err) {
      if (err.code === '42P04') {
        console.log('[DB] Database "verdanist" already exists');
      } else {
        throw err;
      }
    }
    
    await client.end();
    
    // Connect to verdanist database and run schema
    const verdanistClient = new pg.Client({ 
      connectionString: process.env.DATABASE_URL 
    });
    
    await verdanistClient.connect();
    console.log('[DB] Connected to verdanist database');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'backend', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await verdanistClient.query(statement + ';');
        } catch (err) {
          // Ignore errors for CREATE EXTENSION IF NOT EXISTS
          if (!statement.includes('CREATE EXTENSION')) {
            console.log('[DB] Error executing statement:', err.message);
            console.log('[DB] Statement:', statement.substring(0, 100) + '...');
          }
        }
      }
    }
    
    console.log('[DB] Schema applied successfully');
    await verdanistClient.end();
    
  } catch (error) {
    console.error('[DB] Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
