import pg from 'pg';

const connectionString = "postgresql://postgres:saarthi@2026@db.ehywzcxufqjywrnysmrz.supabase.co:5432/postgres";

async function main() {
  const pool = new pg.Pool({ connectionString });
  try {
    console.log("Enabling real-time replication for user_events table...");
    // 1. Add table to supabase_realtime publication
    await pool.query(`
      ALTER PUBLICATION supabase_realtime ADD TABLE user_events;
    `);
    console.log("Realtime enabled successfully for user_events!");
  } catch (err) {
    if (err.message.includes("already exists") || err.message.includes("already a member")) {
      console.log("Realtime is already enabled for user_events.");
    } else {
      console.error("Error enabling realtime:", err);
    }
  } finally {
    await pool.end();
  }
}

main();
