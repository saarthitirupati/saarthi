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

    // Create table live_metrics if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS live_metrics (
        id INTEGER PRIMARY KEY,
        crowd_wait_minutes INTEGER DEFAULT 45,
        parking_status TEXT DEFAULT 'available',
        parking_location TEXT DEFAULT 'Near Alipiri',
        next_bus_minutes INTEGER DEFAULT 12,
        crowd_level TEXT DEFAULT 'Moderate',
        sarva_darshan_wait TEXT DEFAULT '16-20 hours',
        special_entry_wait TEXT DEFAULT '3-5 hours',
        divya_darshan_wait TEXT DEFAULT '1-1.5 hours',
        srivani_darshan_wait TEXT DEFAULT 'Depends on slot',
        darshans_json TEXT,
        ssd_token_status TEXT DEFAULT 'closed-for-day',
        ssd_next_token_time TEXT DEFAULT '2:20 AM',
        ssd_token_slots TEXT,
        ssd_notice TEXT,
        ssd_timings_guide TEXT,
        ssd_counters TEXT,
        laddu_availability TEXT DEFAULT 'available',
        weather TEXT DEFAULT 'Auto (API)',
        best_time TEXT,
        notice TEXT,
        seva_status TEXT DEFAULT 'All sevas open',
        darshan_speed TEXT DEFAULT 'normal',
        full_status_json TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("✅ Ensured 'live_metrics' table exists with all columns.");

    // Enable RLS and public policies
    await db.query(`ALTER TABLE live_metrics ENABLE ROW LEVEL SECURITY;`);
    await db.query(`DROP POLICY IF EXISTS "Allow public read/write" ON live_metrics;`);
    await db.query(`
      CREATE POLICY "Allow public read/write" ON live_metrics 
      FOR ALL TO anon, authenticated, service_role
      USING (true) 
      WITH CHECK (true);
    `);

    // Insert or update row id = 1
    const statusJsonPath = path.resolve(__dirname, '../data/status.json');
    let statusData = {
      waitTime: "24-27 hours",
      crowdLevel: "low",
      ssdTokenStatus: "closed-for-day",
      ssdNextTokenTime: "2:20 AM",
      ssdTimingsGuide: "Offline free SSD tokens are released daily starting early morning (~2:00 - 3:00 AM)."
    };
    if (fs.existsSync(statusJsonPath)) {
      statusData = JSON.parse(fs.readFileSync(statusJsonPath, 'utf8'));
    }
    const fullJsonStr = JSON.stringify(statusData);

    await db.query(`
      INSERT INTO live_metrics (
        id, crowd_wait_minutes, crowd_level, ssd_token_status, ssd_next_token_time, 
        ssd_timings_guide, full_status_json, updated_at
      )
      VALUES (1, 45, $1, $2, $3, $4, $5, NOW())
      ON CONFLICT (id) DO UPDATE
      SET 
        crowd_level = EXCLUDED.crowd_level,
        ssd_token_status = EXCLUDED.ssd_token_status,
        ssd_next_token_time = EXCLUDED.ssd_next_token_time,
        ssd_timings_guide = EXCLUDED.ssd_timings_guide,
        full_status_json = EXCLUDED.full_status_json,
        updated_at = NOW();
    `, [
      statusData.crowdLevel || 'low',
      statusData.ssdTokenStatus || 'closed-for-day',
      statusData.ssdNextTokenTime || '2:20 AM',
      statusData.ssdTimingsGuide || '',
      fullJsonStr
    ]);
    console.log("✅ Successfully initialized and synchronized live_metrics row 1 in Supabase!");

  } catch (error) {
    console.error("Error migrating live_metrics:", error);
  } finally {
    await db.end();
  }
}

setup();
