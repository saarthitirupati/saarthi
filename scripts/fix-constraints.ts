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
  try {
    await db.query(`ALTER TABLE cities ADD COLUMN IF NOT EXISTS lat FLOAT;`);
    await db.query(`ALTER TABLE cities ADD COLUMN IF NOT EXISTS lng FLOAT;`);
    await db.query(`ALTER TABLE categories ADD CONSTRAINT categories_slug_key UNIQUE (slug);`);
  } catch (e) {
    console.error("Constraint might exist:", (e as any).message);
  }
  
  try {
    await db.query(`ALTER TABLE places ADD CONSTRAINT places_slug_key UNIQUE (slug);`);
  } catch (e) {
    console.error("Constraint might exist:", (e as any).message);
  }

  try {
    await db.query(`ALTER TABLE feature_flags ADD CONSTRAINT feature_flags_name_key UNIQUE (name);`);
  } catch (e) {
    console.error("Constraint might exist:", (e as any).message);
  }
  
  await db.end();
}
main();
