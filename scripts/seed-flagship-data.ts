import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PLACES, getPlaceGuideData } from '../src/data/places';

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

    // ==========================================
    // PHASE A: MASTER DATA
    // ==========================================

    // 1. Cities
    console.log("Seeding Cities...");
    const cityRes = await db.query(`
      INSERT INTO cities (name, slug, lat, lng, state) 
      VALUES ('Tirupati', 'tirupati', 13.6288, 79.4192, 'Andhra Pradesh')
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `);
    const cityId = cityRes.rows[0].id;

    // 2. Categories
    console.log("Seeding Categories...");
    const uniqueCategories = [...new Set(PLACES.map(p => p.category))];
    const categoryMap = new Map();
    for (const cat of uniqueCategories) {
      const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const catRes = await db.query(`
        INSERT INTO categories (name, slug, city_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
      `, [cat, slug, cityId]);
      categoryMap.set(cat, catRes.rows[0].id);
    }

    // 3. Places & Place Details
    console.log("Seeding Places and Details...");
    let missingDataCount = 0;

    for (const rawPlace of PLACES) {
      const place = getPlaceGuideData(rawPlace as any);

      // Data Quality Check
      const missing = [];
      if (!place.name) missing.push("Name");
      if (!place.id) missing.push("Slug");
      if (!place.category) missing.push("Category");
      if (!place.coordinates) missing.push("Coordinates");
      if (!place.image) missing.push("Hero image");
      if (!place.images || place.images.length === 0) missing.push("Gallery");
      if (!place.shortIntro) missing.push("Description");
      if (!place.history) missing.push("History");
      if (!place.whyVisit) missing.push("Why visit");
      if (!place.timings && !place.openingTime) missing.push("Timings");
      if (!place.entryFee && place.entryFeeNum === undefined) missing.push("Entry fee");
      if (!place.travelByRTC && !place.travelByCar && !place.travelByBike) missing.push("Travel info");
      
      if (missing.length > 0) {
        console.warn(`[WARNING] Place '${place.name}' is missing fields: ${missing.join(', ')}`);
        missingDataCount++;
      }

      // Upsert Place
      const placeRes = await db.query(`
        INSERT INTO places (name, slug, description, coordinates, images, tags, city_id, "cityId", category_id, "categoryId", "isActive")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8, $8, true)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          coordinates = EXCLUDED.coordinates,
          images = EXCLUDED.images,
          tags = EXCLUDED.tags,
          category_id = EXCLUDED.category_id,
          "categoryId" = EXCLUDED."categoryId"
        RETURNING id
      `, [
        place.name,
        place.id,
        place.shortIntro,
        JSON.stringify(place.coordinates || {}),
        place.images || [place.image],
        place.tags || [],
        cityId,
        categoryMap.get(place.category)
      ]);
      const dbPlaceId = placeRes.rows[0].id;

      // Upsert Place Details
      await db.query(`
        INSERT INTO place_details ("placeId", history, "interestingFacts", mythology, "travelTips", "dressCode", faqs, "bestTime", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
        ON CONFLICT ("placeId") DO UPDATE SET
          history = EXCLUDED.history,
          "interestingFacts" = EXCLUDED."interestingFacts",
          mythology = EXCLUDED.mythology,
          "travelTips" = EXCLUDED."travelTips",
          "dressCode" = EXCLUDED."dressCode",
          faqs = EXCLUDED.faqs,
          "bestTime" = EXCLUDED."bestTime",
          "updatedAt" = now()
      `, [
        dbPlaceId,
        place.history,
        [place.whyVisit], // Storing whyVisit as an interesting fact
        place.spiritualInfo ? place.spiritualInfo.knownFor : null,
        [place.travelByRTC, place.travelByCar, place.travelByBike].filter(Boolean),
        place.visitorTips?.dressCode,
        JSON.stringify(place.visitorTips || {}),
        place.bestTime
      ]);
    }
    console.log(`Seeded ${PLACES.length} places. Data Quality Warnings: ${missingDataCount}`);

    // 4. Search Aliases
    console.log("Seeding Search Aliases...");
    const aliases = [
      { alias: 'Phone', target: 'Mobile Deposit / Locker' },
      { alias: 'Mobile', target: 'Mobile Deposit' },
      { alias: 'Shoes', target: 'Footwear Counter' },
      { alias: 'Slippers', target: 'Footwear Counter' },
      { alias: 'Food', target: 'Annaprasadam' },
      { alias: 'Meals', target: 'Annaprasadam' },
      { alias: 'Bus', target: 'RTC' },
      { alias: 'Parking', target: 'Parking' },
      { alias: 'Medical', target: 'Hospital' },
      { alias: 'Baby', target: 'Baby Care' },
      { alias: 'Wheelchair', target: 'Accessibility' },
      { alias: 'Water', target: 'Drinking Water' },
      { alias: 'Restroom', target: 'Toilets' }
    ];
    await db.query(`TRUNCATE TABLE search_aliases`);
    for (const a of aliases) {
      await db.query(`INSERT INTO search_aliases (alias, target) VALUES ($1, $2)`, [a.alias, a.target]);
    }

    // 5. Essentials
    console.log("Seeding Essentials...");
    await db.query(`TRUNCATE TABLE essentials`);
    await db.query(`
      INSERT INTO essentials ("cityId", section, "cardTitle", items, tags, priority)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      cityId,
      'Temple Rules',
      'Dress Code',
      JSON.stringify([{ type: 'text', content: 'Traditional wear is mandatory for Darshan. Dhoti for men, Sarees for women.' }]),
      ['dress code', 'rules'],
      100
    ]);

    // ==========================================
    // PHASE B: OPERATIONAL DEFAULTS
    // ==========================================

    // 6. Recommendation Rules
    console.log("Seeding Recommendation Rules...");
    const rules = [
      { context: 'Morning', weight: 20, priority: 1, isEnabled: true },
      { context: 'Evening', weight: 15, priority: 1, isEnabled: true },
      { context: 'Rain', weight: 30, priority: 2, isEnabled: true },
      { context: 'Heat', weight: 25, priority: 2, isEnabled: true },
      { context: 'Heavy crowd', weight: 40, priority: 3, isEnabled: true },
      { context: 'Family', weight: 10, priority: 1, isEnabled: true },
      { context: 'Senior', weight: 20, priority: 1, isEnabled: true }
    ];
    await db.query(`TRUNCATE TABLE recommendation_rules`);
    for (const r of rules) {
      await db.query(`
        INSERT INTO recommendation_rules (context, weight, priority, "isEnabled") 
        VALUES ($1, $2, $3, $4)
      `, [r.context, r.weight, r.priority, r.isEnabled]);
    }

    // 7. Feature Flags
    console.log("Seeding Feature Flags...");
    const flags = [
      { name: 'Recommendation Engine', isEnabled: true },
      { name: 'Search', isEnabled: true },
      { name: 'Stories', isEnabled: true },
      { name: 'Explore V2', isEnabled: true },
      { name: 'AI Features', isEnabled: false },
      { name: 'Community', isEnabled: false },
      { name: 'Planner', isEnabled: false }
    ];
    // Don't truncate feature flags in production usually, but for seed we use ON CONFLICT
    for (const f of flags) {
      await db.query(`
        INSERT INTO feature_flags (name, "isEnabled") 
        VALUES ($1, $2)
        ON CONFLICT (name) DO UPDATE SET "isEnabled" = EXCLUDED."isEnabled"
      `, [f.name, f.isEnabled]);
    }

    console.log("✅ Seeding complete!");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
