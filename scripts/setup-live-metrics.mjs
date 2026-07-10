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

    await db.query(`
      CREATE TABLE IF NOT EXISTS live_metrics (
        id INTEGER PRIMARY KEY,
        crowd_wait_minutes INTEGER NOT NULL,
        parking_status TEXT NOT NULL,
        parking_location TEXT NOT NULL,
        next_bus_minutes INTEGER NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Ensured 'live_metrics' table exists.");

    // Enable RLS and public policies
    console.log("Enabling RLS on 'live_metrics'...");
    await db.query(`ALTER TABLE live_metrics ENABLE ROW LEVEL SECURITY;`);
    await db.query(`DROP POLICY IF EXISTS "Allow public read/write" ON live_metrics;`);
    await db.query(`
      CREATE POLICY "Allow public read/write" ON live_metrics 
      FOR ALL TO anon 
      USING (true) 
      WITH CHECK (true);
    `);

    // Insert default row (id = 1)
    await db.query(`
      INSERT INTO live_metrics (id, crowd_wait_minutes, parking_status, parking_location, next_bus_minutes)
      VALUES (1, 45, 'Available', 'Near Alipiri', 12)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("Inserted initial live_metrics row.");

  } catch (error) {
    console.error("Error setting up live_metrics:", error);
  } finally {
    await db.end();
  }
}

setup();
