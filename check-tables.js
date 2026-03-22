import pg from 'pg';

const dbUrl = 'postgresql://postgres:verdanist@localhost:5432/verdanist';

const checkTables = async () => {
  const client = new pg.Client({ 
    connectionString: dbUrl 
  });
  
  try {
    await client.connect();
    console.log('[DB] Connected to verdanist database');
    
    // Check if tables exist
    const result = await client.query(`
      SELECT tablename FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);
    
    console.log('\n[DB] Tables found:');
    result.rows.forEach(row => {
      console.log(`  - ${row.tablename}`);
    });
    
    // Check devices table data
    const devicesResult = await client.query('SELECT * FROM devices LIMIT 5');
    console.log('\n[DB] Sample devices:');
    devicesResult.rows.forEach(device => {
      console.log(`  - ${device.device_id}: ${device.device_name} (${device.location})`);
    });
    
    await client.end();
    console.log('\n[DB] Database check completed successfully!');
    
  } catch (error) {
    console.error('[DB] Error:', error.message);
    process.exit(1);
  }
};

checkTables();
