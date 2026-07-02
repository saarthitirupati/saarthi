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

const FESTIVALS_SEED = [
  {
    slug: 'vaikunta-ekadashi',
    name: 'Vaikunta Ekadashi',
    description: 'The most auspicious day dedicated to Lord Vishnu. The Vaikunta Dwara (gate to heaven) is opened on this day.',
    festival_type: 'Spiritual',
    date: '2026-01-19',
    gravity_score: 10,
    crowd_level: 'EXTREME',
    recommended_time: '3:00 AM - 11:00 PM',
    dress_code: 'Traditional (Mandatory)',
    parking_status: 'FULL',
    visitor_notes: 'Book Vaikunta Dwara Darshanam tickets months in advance.',
    is_major: true,
    image_url: '/images/festivals/vaikunta.jpg',
    status: 'Upcoming'
  },
  {
    slug: 'rathasapthami',
    name: 'Rathasapthami',
    description: 'Often referred to as Surya Jayanthi or the Mini Brahmotsavam. The deity is taken on seven different vahanams in a single day.',
    festival_type: 'Temple Festival',
    date: '2026-01-24',
    gravity_score: 8,
    crowd_level: 'HIGH',
    recommended_time: '5:00 AM - 9:00 PM',
    dress_code: 'Traditional',
    parking_status: 'LIMITED',
    visitor_notes: 'Witness the seven vahanams from the galleries.',
    is_major: true,
    image_url: '/images/festivals/rathasapthami.jpg',
    status: 'Upcoming'
  },
  {
    slug: 'ugadi',
    name: 'Ugadi',
    description: 'The Telugu New Year. Special Panchanga Sravanam is conducted inside the temple.',
    festival_type: 'Cultural',
    date: '2026-03-20',
    gravity_score: 7,
    crowd_level: 'HIGH',
    recommended_time: '6:00 AM - 10:00 PM',
    dress_code: 'Traditional',
    parking_status: 'LIMITED',
    visitor_notes: 'Panchanga Sravanam happens inside the temple.',
    is_major: true,
    image_url: '/images/festivals/ugadi.jpg',
    status: 'Upcoming'
  },
  {
    slug: 'sri-ramanavami',
    name: 'Sri Ramanavami',
    description: 'Celebrates the birth of Lord Rama. A special Asthanam is held in the Tirumala temple.',
    festival_type: 'Spiritual',
    date: '2026-03-28',
    gravity_score: 7,
    crowd_level: 'HIGH',
    recommended_time: '6:00 AM - 9:00 AM',
    dress_code: 'Traditional',
    parking_status: 'LIMITED',
    visitor_notes: 'Special Asthanam is conducted for Lord Rama.',
    is_major: true,
    image_url: '/images/festivals/ramanavami.jpg',
    status: 'Upcoming'
  },
  {
    slug: 'srivari-brahmotsavam',
    name: 'Srivari Brahmotsavam',
    description: 'The grandest nine-day festival in Tirumala, celebrating Lord Venkateswara.',
    festival_type: 'Temple Festival',
    date: '2026-09-17',
    gravity_score: 10,
    crowd_level: 'EXTREME',
    recommended_time: '7:00 AM - 11:00 PM',
    dress_code: 'Traditional',
    parking_status: 'FULL',
    visitor_notes: 'Garuda Seva day will have extreme crowds.',
    is_major: true,
    image_url: '/images/festivals/brahmotsavam.jpg',
    status: 'Upcoming'
  }
];

async function seed() {
  try {
    await db.connect();
    console.log("Connected to Supabase PostgreSQL.");

    // Create extensions
    await db.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // Drop tables if we want a fresh start, or just CREATE IF NOT EXISTS
    // For this migration, we'll ensure the table structure matches the requested schema.
    await db.query(`
      CREATE TABLE IF NOT EXISTS festivals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        festival_type TEXT,
        date DATE NOT NULL,
        city_id UUID,
        place_id UUID,
        gravity_score INTEGER,
        crowd_level TEXT,
        recommended_time TEXT,
        dress_code TEXT,
        parking_status TEXT,
        visitor_notes TEXT,
        is_major BOOLEAN DEFAULT true,
        image_url TEXT,
        status TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Ensured 'festivals' table exists.");

    await db.query(`
      CREATE TABLE IF NOT EXISTS festival_updates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        festival_id UUID REFERENCES festivals(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        severity TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Ensured 'festival_updates' table exists.");

    // Upsert festivals
    for (const festival of FESTIVALS_SEED) {
      const query = `
        INSERT INTO festivals (
          slug, name, description, festival_type, date, gravity_score, 
          crowd_level, recommended_time, dress_code, parking_status, 
          visitor_notes, is_major, image_url, status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          festival_type = EXCLUDED.festival_type,
          date = EXCLUDED.date,
          gravity_score = EXCLUDED.gravity_score,
          crowd_level = EXCLUDED.crowd_level,
          recommended_time = EXCLUDED.recommended_time,
          dress_code = EXCLUDED.dress_code,
          parking_status = EXCLUDED.parking_status,
          visitor_notes = EXCLUDED.visitor_notes,
          is_major = EXCLUDED.is_major,
          image_url = EXCLUDED.image_url,
          status = EXCLUDED.status,
          updated_at = NOW();
      `;
      const values = [
        festival.slug, festival.name, festival.description, festival.festival_type, 
        festival.date, festival.gravity_score, festival.crowd_level, 
        festival.recommended_time, festival.dress_code, festival.parking_status, 
        festival.visitor_notes, festival.is_major, festival.image_url, festival.status
      ];
      await db.query(query, values);
    }
    
    console.log("Seeded festivals successfully!");
  } catch (error) {
    console.error("Error seeding festivals:", error);
  } finally {
    await db.end();
  }
}

seed();
