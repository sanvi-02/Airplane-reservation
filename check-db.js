const pg = require('pg');
require('dotenv').config();

async function check() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  const res = await client.query('SELECT DISTINCT DATE("departureTime") FROM "Flight" ORDER BY DATE("departureTime") ASC');
  console.log('Available Dates in DB:', res.rows.map(r => r.date));
  
  const sample = await client.query('SELECT "departureTime", pg_typeof("departureTime") FROM "Flight" LIMIT 5');
  console.log('Sample Raw departureTimes:', sample.rows);
  await client.end();
}
check().catch(console.error);
