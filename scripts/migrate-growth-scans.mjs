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

const db = new Client({ connectionString });

async function setup() {
  try {
    await db.connect();
    console.log("Connected to Supabase PostgreSQL.");

    // 1. Create marketing_campaigns table
    await db.query(`
      CREATE TABLE IF NOT EXISTS marketing_campaigns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT DEFAULT 'apsrtc',
        location TEXT DEFAULT 'Tirupati',
        destination TEXT DEFAULT '/darshan',
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("✅ Ensured 'marketing_campaigns' table exists.");

    // 2. Create marketing_scans table
    await db.query(`
      CREATE TABLE IF NOT EXISTS marketing_scans (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        campaign_slug TEXT NOT NULL,
        device TEXT DEFAULT 'Mobile',
        browser TEXT DEFAULT 'Browser',
        os TEXT DEFAULT 'Mobile',
        language TEXT DEFAULT 'en-US',
        referer TEXT DEFAULT 'QR Code',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("✅ Ensured 'marketing_scans' table exists.");

    // 3. Grant permissions & RLS policies
    await db.query(`GRANT ALL ON marketing_campaigns, marketing_scans TO anon, authenticated, service_role;`);
    await db.query(`ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;`);
    await db.query(`ALTER TABLE marketing_scans ENABLE ROW LEVEL SECURITY;`);

    await db.query(`DROP POLICY IF EXISTS "Allow public all" ON marketing_campaigns;`);
    await db.query(`
      CREATE POLICY "Allow public all" ON marketing_campaigns
      FOR ALL TO anon, authenticated, service_role
      USING (true) WITH CHECK (true);
    `);

    await db.query(`DROP POLICY IF EXISTS "Allow public all" ON marketing_scans;`);
    await db.query(`
      CREATE POLICY "Allow public all" ON marketing_scans
      FOR ALL TO anon, authenticated, service_role
      USING (true) WITH CHECK (true);
    `);

    // 4. Seed default campaigns if table is empty
    const { rows: existingCampaigns } = await db.query(`SELECT id FROM marketing_campaigns LIMIT 1;`);
    if (existingCampaigns.length === 0) {
      const defaultCampaigns = [
        { id: 'apsrtc', name: 'APSRTC Bus Stickers', slug: 'apsrtc', category: 'apsrtc', location: 'Tirupati Bus Station & Fleet', destination: '/darshan', status: 'active' },
        { id: 'bhimas', name: 'Hotel Bhimas Reception', slug: 'bhimas', category: 'hotel', location: 'Bhimas Grand Entrance', destination: '/explore', status: 'active' },
        { id: 'alipiri', name: 'Alipiri Mettu Kiosk Standee', slug: 'alipiri', category: 'temple', location: 'Alipiri Footstep Entry', destination: '/places/alipiri-mettu', status: 'active' },
        { id: 'cab-01', name: 'Tirupati Station Cab Decal #104', slug: 'cab-01', category: 'taxi', location: 'Railway Station Taxi Stand', destination: '/', status: 'active' },
      ];

      for (const c of defaultCampaigns) {
        await db.query(`
          INSERT INTO marketing_campaigns (id, name, slug, category, location, destination, status, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          ON CONFLICT (id) DO NOTHING;
        `, [c.id, c.name, c.slug, c.category, c.location, c.destination, c.status]);
      }
      console.log("✅ Seeded initial marketing campaigns in Supabase.");
    }

    // 5. Seed scan history if table is empty
    const { rows: existingScans } = await db.query(`SELECT id FROM marketing_scans LIMIT 1;`);
    if (existingScans.length === 0) {
      const campaigns = [
        { id: 'apsrtc', slug: 'apsrtc', count: 605 },
        { id: 'bhimas', slug: 'bhimas', count: 465 },
        { id: 'alipiri', slug: 'alipiri', count: 325 },
        { id: 'cab-01', slug: 'cab-01', count: 185 },
      ];

      const now = Date.now();
      for (const c of campaigns) {
        for (let i = 0; i < c.count; i++) {
          const scanId = `scn_${c.id}_${i}`;
          const randTime = new Date(now - Math.random() * 7 * 86400000).toISOString();
          const device = i % 3 === 0 ? 'iPhone (iOS)' : i % 2 === 0 ? 'Samsung (Android)' : 'Mobile Browser';
          const browser = i % 4 === 0 ? 'Safari' : 'Chrome Mobile';
          const os = i % 3 === 0 ? 'iOS 17' : 'Android 14';

          await db.query(`
            INSERT INTO marketing_scans (id, campaign_id, campaign_slug, device, browser, os, language, referer, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, 'en-US', 'QR Camera Scan', $7)
            ON CONFLICT (id) DO NOTHING;
          `, [scanId, c.id, c.slug, device, browser, os, randTime]);
        }
      }
      console.log("✅ Seeded initial marketing scans history in Supabase.");
    }

    console.log("🎉 Marketing campaigns and scans database migration complete!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await db.end();
  }
}

setup();
