import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const db = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await db.connect();
  const res = await db.query(`
    SELECT table_name, column_name, data_type, is_nullable
    FROM information_schema.columns 
    WHERE table_name IN ('cities', 'categories', 'places', 'place_details')
  `);
  console.log(res.rows);
  await db.end();
}
main();
