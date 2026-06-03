const { PrismaClient } = require('./generated/prisma/index.js');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();

neonConfig.webSocketConstructor = ws;

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  const origin = "Delhi";
  const destination = "Mumbai";
  const date = "2026-06-15";

  console.log("Searching flights with date:", date);
  const d1 = new Date(`${date}T00:00:00`);
  const d2 = new Date(`${date}T23:59:59`);
  console.log("d1:", d1.toISOString(), "d2:", d2.toISOString());

  const flights = await prisma.flight.findMany({
    where: {
      origin,
      destination,
      departureTime: {
        gte: d1,
        lte: d2,
      },
    },
    include: {
      _count: {
        select: {
          seats: { where: { isBooked: false } },
        },
      },
    },
  });

  console.log("Result:", flights);
}

main().catch(console.error).finally(() => prisma.$disconnect());
