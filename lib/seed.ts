import "dotenv/config";
import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log("✅ Connected! Seeding...");

  const cities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Goa",
  ];

  const AIRLINES = [
    { code: "AI", mult: 1.15 },
    { code: "6E", mult: 0.95 },
    { code: "SG", mult: 0.9 },
  ];

  const SLOTS = ["06:00", "10:00", "15:00", "20:00"];
  const DATE = "2026-06-15";

  const flights = [];
  let flightNo = 3000;

  for (let i = 0; i < cities.length; i++) {
    for (let j = 0; j < cities.length; j++) {
      if (i === j) continue;

      const duration = 1 + ((i + j) % 3);

      for (let s = 0; s < SLOTS.length; s++) {
        const airline = AIRLINES[s % AIRLINES.length];
        const slot = SLOTS[s];
        const arrHour = parseInt(slot.split(":")[0]) + duration;

        flights.push({
          number: `${airline.code}${flightNo++}`,
          from: cities[i],
          to: cities[j],
          dep: `${DATE} ${slot}:00`,
          arr: `${DATE} ${String(arrHour).padStart(2, "0")}:30:00`,
          price: Math.round((2500 + (i + j) * 350) * airline.mult),
        });
      }
    }
  }

  console.log(`✈️ Creating ${flights.length} flights for June 15...`);

  const cols = ["A", "B", "C", "D", "E", "F"];

  for (const f of flights) {
    const res = await client.query(
      `INSERT INTO "Flight" ("id", "flightNumber", "origin", "destination", "departureTime", "arrivalTime", "price", "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW()) RETURNING id`,
      [f.number, f.from, f.to, f.dep, f.arr, f.price]
    );

    const flightId = res.rows[0].id;

    for (let i = 1; i <= 30; i++) {
      const seatNumber = `${Math.ceil(i / 6)}${cols[(i - 1) % 6]}`;
      await client.query(
        `INSERT INTO "Seat" ("id", "seatNumber", "isBooked", "flightId")
         VALUES (gen_random_uuid(), $1, $2, $3)`,
        [seatNumber, Math.random() < 0.3, flightId]
      );
    }

    console.log(`✅ ${f.number} | ${f.from} → ${f.to} | ${f.dep}`);
  }

  console.log("🎉 Done!");
  console.log(`Total flights: ${flights.length}`);
  await client.end();
}

main().catch(async (err) => {
  console.error("❌ Error:", err);
  await client.end();
  process.exit(1);
});
