import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
      process.env[key.trim()] = value.join('=').trim();
    }
  });
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("No DATABASE_URL found in .env.local");
  process.exit(1);
}

const db = new Client({
  connectionString,
});

async function setup() {
  try {
    await db.connect();
    console.log("Connected to Supabase PostgreSQL.");

    // Add new columns to live_metrics if they don't exist
    await db.query(`
      ALTER TABLE live_metrics
      ADD COLUMN IF NOT EXISTS crowd_level TEXT DEFAULT 'Moderate',
      ADD COLUMN IF NOT EXISTS sarva_darshan_wait TEXT DEFAULT '16-20 hours',
      ADD COLUMN IF NOT EXISTS special_entry_wait TEXT DEFAULT '3-5 hours',
      ADD COLUMN IF NOT EXISTS divya_darshan_wait TEXT DEFAULT '1-1.5 hours',
      ADD COLUMN IF NOT EXISTS srivani_darshan_wait TEXT DEFAULT 'Depends on slot';
    `);
    console.log("Added detailed darshan columns to 'live_metrics'.");

  } catch (error) {
    console.error("Error migrating live_metrics:", error);
  } finally {
    await db.end();
  }
}

setup();
