import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
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

async function main() {
  try {
    await db.connect();
    console.log("Connected to Supabase PostgreSQL.");

    // Enable pgcrypto for UUID generation if needed
    await db.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    const tablesToManage = [
      'cities', 'categories', 'places', 'place_details', 
      'recommendation_rules', 'search_aliases', 'essentials', 
      'recommendation_logs', 'feature_flags', 'live_updates', 
      'alerts', 'festivals'
    ];

    // 1. Cities
    console.log("Setting up 'cities' table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        state TEXT,
        country TEXT DEFAULT 'India',
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    // 2. Categories
    console.log("Setting up 'categories' table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        icon TEXT,
        "displayOrder" INTEGER DEFAULT 0,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    // 3. Places (Basic Information Only)
    console.log("Setting up 'places' table (Basic Info)...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS places (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        coordinates JSONB,
        images TEXT[],
        tags TEXT[],
        "cityId" UUID REFERENCES cities(id),
        "categoryId" UUID REFERENCES categories(id),
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    // Add columns if they don't exist in 'places'
    const basicPlaceColumns = [
      { name: 'cityId', type: 'UUID' },
      { name: 'categoryId', type: 'UUID' },
      { name: 'description', type: 'TEXT' },
      { name: 'coordinates', type: 'JSONB' },
      { name: 'images', type: 'TEXT[]' },
      { name: 'tags', type: 'TEXT[]' },
      { name: 'isActive', type: 'BOOLEAN DEFAULT true' }
    ];

    for (const col of basicPlaceColumns) {
      const res = await db.query(`SELECT 1 FROM information_schema.columns WHERE table_name = 'places' AND column_name = $1`, [col.name]);
      if (res.rows.length === 0) {
        await db.query(`ALTER TABLE places ADD COLUMN "${col.name}" ${col.type}`);
      }
    }

    // 4. Place Details (Everything users read)
    console.log("Setting up 'place_details' table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS place_details (
        "placeId" UUID PRIMARY KEY REFERENCES places(id) ON DELETE CASCADE,
        history TEXT,
        "interestingFacts" TEXT[],
        mythology TEXT,
        architecture TEXT,
        "travelTips" TEXT[],
        "dressCode" TEXT,
        faqs JSONB,
        "bestTime" TEXT,
        "nearbyPlaces" UUID[],
        "createdAt" TIMESTAMPTZ DEFAULT now(),
        "updatedAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    // 5. Recommendation Rules
    console.log("Setting up 'recommendation_rules' table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS recommendation_rules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        context TEXT NOT NULL,
        weight INTEGER NOT NULL DEFAULT 0,
        priority INTEGER NOT NULL DEFAULT 0,
        "isEnabled" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    // 6. Search Aliases
    console.log("Setting up 'search_aliases' table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS search_aliases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        alias TEXT NOT NULL,
        target TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    // 7. Essentials
    console.log("Setting up 'essentials' table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS essentials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "cityId" UUID REFERENCES cities(id) ON DELETE CASCADE,
        section TEXT NOT NULL,
        "cardTitle" TEXT NOT NULL,
        items JSONB NOT NULL,
        tags TEXT[],
        priority INTEGER DEFAULT 0,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    // 8. Recommendation Logs
    console.log("Setting up 'recommendation_logs' table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS recommendation_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        context JSONB NOT NULL,
        "top3" UUID[],
        "clicked" UUID,
        "ignored" UUID[],
        time TEXT,
        weather TEXT,
        "createdAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    // 9. Feature Flags
    console.log("Setting up 'feature_flags' table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS feature_flags (
        name TEXT PRIMARY KEY,
        "isEnabled" BOOLEAN DEFAULT false,
        "updatedAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    // 10. Live Updates, Alerts, Festivals
    console.log("Setting up operational tables (live_updates, alerts, festivals)...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS live_updates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "cityId" UUID REFERENCES cities(id) ON DELETE CASCADE,
        "placeId" UUID REFERENCES places(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        severity TEXT DEFAULT 'info',
        "expiresAt" TIMESTAMPTZ,
        "createdAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "cityId" UUID REFERENCES cities(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS festivals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "cityId" UUID REFERENCES cities(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        "startDate" TIMESTAMPTZ NOT NULL,
        "endDate" TIMESTAMPTZ NOT NULL,
        impact JSONB,
        description TEXT,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    // Enable RLS
    for (const table of tablesToManage) {
      console.log(`Securing table: "${table}" via RLS...`);
      await db.query(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      await db.query(`DROP POLICY IF EXISTS "Allow public read/write" ON "${table}";`);
      await db.query(`
        CREATE POLICY "Allow public read/write" ON "${table}" 
        FOR ALL TO anon 
        USING (true) 
        WITH CHECK (true);
      `);
      await db.query(`GRANT ALL ON TABLE "${table}" TO anon, authenticated, service_role;`);
    }

    console.log("Database schema setup complete! Sprint 1 Master Data and Operations schemas are ready.");
  } catch (err) {
    console.error("Database schema setup failed:", err);
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
