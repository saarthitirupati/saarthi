import pg from 'pg';

const connectionString = "postgresql://postgres:saarthi@2026@db.ehywzcxufqjywrnysmrz.supabase.co:5432/postgres";

async function main() {
  const pool = new pg.Pool({ connectionString });
  try {
    const res = await pool.query(`
      SELECT 
        table_name, 
        column_name
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND (
          column_name LIKE '%password%' 
          OR column_name LIKE '%token%'
          OR column_name LIKE '%secret%'
          OR column_name LIKE '%email%'
          OR column_name LIKE '%phone%'
        )
      ORDER BY table_name, column_name;
    `);
    console.log("Sensitive Columns found:");
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
