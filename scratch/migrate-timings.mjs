import pg from 'pg';

const connectionString = "postgresql://postgres:saarthi@2026@db.ehywzcxufqjywrnysmrz.supabase.co:5432/postgres";

async function main() {
  const pool = new pg.Pool({ connectionString });
  try {
    console.log("Altering column timings to jsonb...");
    await pool.query(`
      ALTER TABLE places 
      ALTER COLUMN timings TYPE jsonb 
      USING to_jsonb(timings);
    `);
    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

main();
