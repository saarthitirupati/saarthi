import pg from 'pg';

const connectionString = "postgresql://postgres:saarthi@2026@db.ehywzcxufqjywrnysmrz.supabase.co:5432/postgres";

async function main() {
  const pool = new pg.Pool({ connectionString });
  try {
    const res = await pool.query(`
      SELECT 
        schemaname, 
        tablename, 
        rowsecurity
      FROM pg_tables t
      JOIN pg_class c ON c.relname = t.tablename
      WHERE schemaname = 'public';
    `);
    console.log("Tables and RLS status:");
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
