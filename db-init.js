require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect().then(() => {
  const query = `
    CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      snippet TEXT,
      "fullText" TEXT,
      image TEXT,
      "readTime" TEXT
    )
  `;
  return client.query(query);
}).then(() => {
  console.log('Stories table created successfully');
  client.end();
}).catch(err => {
  console.error('Error creating table:', err);
  client.end();
});
