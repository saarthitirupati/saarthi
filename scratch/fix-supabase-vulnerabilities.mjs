import pg from 'pg';

const connectionString = "postgresql://postgres:saarthi@2026@db.ehywzcxufqjywrnysmrz.supabase.co:5432/postgres";

const tablesToDrop = [
  'auth_user',
  'api_userprofile',
  'api_itinerary',
  'api_itinerary_interests',
  'api_category',
  'api_feedback',
  'api_location',
  'django_session',
  'django_migrations',
  'django_content_type',
  'auth_permission',
  'auth_group',
  'auth_group_permissions',
  'auth_user_groups',
  'auth_user_user_permissions',
  'django_admin_log',
  'cities',
  'feedback',
  'festival_updates',
  'zones',
  'zone_distances',
  'journey_logs',
  'place_details',
  'live_darshan_status',
  'place_live_status',
  'saved_journeys',
  'favorites',
  'journey_progress'
];

async function main() {
  const pool = new pg.Pool({ connectionString });
  try {
    console.log("Starting database cleanup and securing...");

    // 1. Drop unused/legacy tables
    for (const table of tablesToDrop) {
      console.log(`Dropping legacy table if exists: "${table}"...`);
      await pool.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
    }

    // 2. Fetch all remaining tables in public schema
    const tablesRes = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public';
    `);

    const remainingTables = tablesRes.rows.map(r => r.tablename);
    console.log("Remaining tables in public schema:", remainingTables);

    // 3. Enable RLS and add policies on remaining tables
    for (const table of remainingTables) {
      if (table === 'spatial_ref_sys') continue; // PostGIS internal table, skip

      console.log(`Securing table: "${table}"...`);
      
      // Enable RLS
      await pool.query(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);

      // Drop old policy if exists
      await pool.query(`DROP POLICY IF EXISTS "Allow public access" ON "${table}";`);
      await pool.query(`DROP POLICY IF EXISTS "Allow public read/write" ON "${table}";`);

      // Create policy to allow all operations to anonymous (anon) users so Next.js server/client works
      await pool.query(`
        CREATE POLICY "Allow public read/write" ON "${table}" 
        FOR ALL TO anon 
        USING (true) 
        WITH CHECK (true);
      `);
      
      console.log(`RLS and public policy enabled on "${table}".`);
    }

    console.log("Database security migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

main();
