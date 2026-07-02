import pg from 'pg';

const connectionString = "postgresql://postgres:saarthi@2026@db.ehywzcxufqjywrnysmrz.supabase.co:5432/postgres";

async function main() {
  const pool = new pg.Pool({ connectionString });
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'places';
    `);
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
