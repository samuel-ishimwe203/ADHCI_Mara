import dotenv from 'dotenv';
import { Pool } from 'pg';
import path from 'path'; // For explicit file path

// Debug: Check if conflicting env var exists (common on Windows)
if (process.env.DATABASE_URL !== undefined) {
  console.log('Warning: DATABASE_URL already set (conflicting?), unsetting...');
  delete process.env.DATABASE_URL;
}

// Explicitly load .env from project root (fixes CWD/encoding issues)
const envPath = path.resolve(process.cwd(), '.env');
console.log('Looking for .env at:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('dotenv load error:', result.error);
} else if (result.parsed) {
  console.log('dotenv loaded successfully, parsed keys:', Object.keys(result.parsed));
}

// Debug: Log the raw env var
console.log('Raw DATABASE_URL:', process.env.DATABASE_URL);
console.log('DATABASE_URL type:', typeof process.env.DATABASE_URL);
console.log('DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 'undefined');

// If defined, try parsing manually
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('Parsed username:', url.username);
    console.log('Parsed password type:', typeof url.password);
    console.log('Parsed password (masked):', url.password ? url.password.substring(0, 3) + '...' : 'None/Missing');
  } catch (parseErr) {
    console.error('URL parse error:', parseErr);
  }
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()')
  .then(r => console.log('DB Connected:', r.rows[0]))
  .catch(e => console.error('DB Error:', e))
  .finally(() => pool.end());