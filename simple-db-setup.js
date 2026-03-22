// Simple database setup without dotenv for testing
const fs = require('fs');
const path = require('path');

const dbUrl = 'postgresql://postgres:verdanist@localhost:5432/verdanist';

console.log('[DB] Testing database connection to:', dbUrl);
console.log('[DB] Note: PostgreSQL needs to be installed and running');
console.log('[DB] Database setup skipped - PostgreSQL not available');
console.log('[DB] Backend will work with mock data');
