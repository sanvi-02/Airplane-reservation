import "dotenv/config";
import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log("Connected! Seeding...");

  const flights = [
    {
      number: "SK101",
      from: "Delhi",
      to: "Mumbai",
      dep: "2026-06-15 06:00",
      arr: "2026-06-15 08:10",
      price: 4500,
    },
    {
      number: "SK102",
      from: "Delhi",
      to: "Mumbai",
      dep: "2026-06-15 14:00",
      arr: "2026-06-15 16:05",
      price: 3800,
    },
    {
      number: "SK201",
      from: "Mumbai",
      to: "Bangalore",
      dep: "2026-06-15 09:00",
      arr: "2026-06-15 10:30",
      price: 3200,
    },
    {
      number: "SK301",
      from: "Delhi",
      to: "Bangalore",
      dep: "2026-06-15 07:00",
      arr: "2026-06-15 09:30",
      price: 5100,
    },
  ];

  for (const f of flights) {
    const res = await client.query(
      `INSERT INTO "Flight" ("id", "flightNumber", "origin", "destination", "departureTime", "arrivalTime", "price", "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW()) RETURNING id`,
      [f.number, f.from, f.to, f.dep, f.arr, f.price]
    );

    const flightId = res.rows[0].id;
    const cols = ["A", "B", "C", "D", "E", "F"];

    for (let i = 1; i <= 30; i++) {
      const seat = `${Math.ceil(i / 6)}${cols[(i - 1) % 6]}`;
      const booked = Math.random() < 0.3;
      await client.query(
        `INSERT INTO "Seat" ("id", "seatNumber", "isBooked", "flightId")
         VALUES (gen_random_uuid(), $1, $2, $3)`,
        [seat, booked, flightId]
      );
    }

    console.log(`✅ ${f.number} created with 30 seats`);
  }

  console.log("Done!");
  await client.end();
}

main().catch(async (e) => {
  console.error(e);
  await client.end();
  process.exit(1);
});
