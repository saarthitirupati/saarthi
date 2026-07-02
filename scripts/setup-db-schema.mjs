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

    // 1. Alter 'places' table to add Sprint 1 columns
    console.log("Updating 'places' table columns...");
    const placesColumns = [
      { name: 'architecture', type: 'TEXT' },
      { name: 'importance', type: 'TEXT' },
      { name: 'deity', type: 'TEXT' },
      { name: 'deityType', type: 'TEXT' },
      { name: 'builtBy', type: 'TEXT' },
      { name: 'keyPoojas', type: 'TEXT[]' },
      { name: 'breakTimings', type: 'JSONB' },
      { name: 'isHiddenGem', type: 'BOOLEAN DEFAULT false' },
      { name: 'rituals', type: 'JSONB' },
      { name: 'facilities', type: 'JSONB' },
      { name: 'difficulty', type: 'TEXT' },
      { name: 'bestSeason', type: 'TEXT' },
      { name: 'relatedPlaces', type: 'TEXT[]' },
      { name: 'nearbyTemples', type: 'TEXT[]' }
    ];

    for (const col of placesColumns) {
      const checkQuery = `
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'places' AND column_name = $1
      `;
      const res = await db.query(checkQuery, [col.name]);
      if (res.rows.length === 0) {
        console.log(`Adding column "${col.name}" to 'places'...`);
        await db.query(`ALTER TABLE places ADD COLUMN "${col.name}" ${col.type}`);
      }
    }

    // 2. Alter 'stories' table to add missing fields
    console.log("Updating 'stories' table columns...");
    const storiesColumns = [
      { name: 'slug', type: 'TEXT' },
      { name: 'category', type: 'TEXT' },
      { name: 'keyTakeaway', type: 'TEXT' },
      { name: 'audioUrl', type: 'TEXT' },
      { name: 'relatedTemple', type: 'TEXT' },
      { name: 'tags', type: 'TEXT[]' },
      { name: 'isActive', type: 'BOOLEAN DEFAULT true' },
      { name: 'publishDate', type: 'DATE' },
      { name: 'createdAt', type: 'TIMESTAMPTZ DEFAULT now()' }
    ];

    for (const col of storiesColumns) {
      const checkQuery = `
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stories' AND column_name = $1
      `;
      const res = await db.query(checkQuery, [col.name]);
      if (res.rows.length === 0) {
        console.log(`Adding column "${col.name}" to 'stories'...`);
        await db.query(`ALTER TABLE stories ADD COLUMN "${col.name}" ${col.type}`);
      }
    }

    // 3. Create 'quizzes' table
    console.log("Ensuring 'quizzes' table exists...");
    await db.query(`DROP TABLE IF EXISTS quizzes`);
    await db.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question TEXT NOT NULL,
        difficulty TEXT DEFAULT 'beginner',
        category TEXT,
        image TEXT,
        options JSONB NOT NULL,
        "correctAnswer" TEXT NOT NULL,
        explanation TEXT,
        "relatedStory" TEXT,
        "relatedTemple" TEXT REFERENCES places(id) ON DELETE SET NULL,
        "xpReward" INTEGER DEFAULT 10,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    // 4. Create 'encyclopedia' table
    console.log("Ensuring 'encyclopedia' table exists...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS encyclopedia (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT,
        keywords TEXT[],
        content TEXT NOT NULL,
        summary TEXT,
        "coverImage" TEXT,
        "references" JSONB,
        "relatedTemples" TEXT[],
        "relatedArticles" UUID[],
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    // 5. Create 'user_events' table
    console.log("Ensuring 'user_events' table exists...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "sessionId" TEXT NOT NULL,
        "eventType" TEXT NOT NULL,
        "entityType" TEXT,
        "entityId" TEXT,
        metadata JSONB,
        "createdAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    console.log("Database schema setup complete!");
  } catch (err) {
    console.error("Database schema setup failed:", err);
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
