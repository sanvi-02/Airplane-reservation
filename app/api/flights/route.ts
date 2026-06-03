import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { searchLocalFlights } from "@/lib/local-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");

  if (!origin || !destination || !date) {
    return NextResponse.json(
      { error: "origin, destination, aur date zaroori hain" },
      { status: 400 }
    );
  }

  if (!prisma) {
    return NextResponse.json(
      await searchLocalFlights(origin, destination, date)
    );
  }

  try {
    let flights = await prisma.flight.findMany({
      where: {
        origin,
        destination,
        departureTime: {
          gte: new Date(`${date} 00:00:00`),
          lte: new Date(`${date} 23:59:59`),
        },
      },
      include: {
        _count: {
          select: {
            seats: { where: { isBooked: false } },
          },
        },
      },
      orderBy: { price: "asc" },
    });

    if (flights.length === 0) {
      console.log(`Dynamic seeding flights for route: ${origin} -> ${destination} on ${date}`);
      const SLOTS = ["06:15", "13:40", "19:05"];
      const AIRLINES = [
        { code: "AI", mult: 1.15 },
        { code: "6E", mult: 0.95 },
        { code: "SG", mult: 0.9 },
      ];
      const cols = ["A", "B", "C", "D", "E", "F"];

      for (let s = 0; s < SLOTS.length; s++) {
        const slot = SLOTS[s];
        const airline = AIRLINES[s % AIRLINES.length];
        const flightNumber = `${airline.code}${1000 + Math.floor(Math.random() * 8999)}`;

        const depStr = `${date} ${slot}:00`;
        const durationHours = 2 + s;
        const arrStr = `${date} ${String(parseInt(slot.split(":")[0]) + durationHours).padStart(2, "0")}:30:00`;
        const price = Math.round((3500 + s * 450) * airline.mult);

        const createdFlight = await prisma.flight.create({
          data: {
            flightNumber,
            origin,
            destination,
            departureTime: new Date(depStr),
            arrivalTime: new Date(arrStr),
            price,
          },
        });

        const seatsData = [];
        for (let i = 1; i <= 30; i++) {
          const seatNumber = `${Math.ceil(i / 6)}${cols[(i - 1) % 6]}`;
          const isBooked = Math.random() < 0.3; // 30% seats pre-booked
          seatsData.push({
            seatNumber,
            isBooked,
            flightId: createdFlight.id,
          });
        }

        await prisma.seat.createMany({
          data: seatsData,
        });
      }

      // Re-query the seeded flights
      flights = await prisma.flight.findMany({
        where: {
          origin,
          destination,
          departureTime: {
            gte: new Date(`${date} 00:00:00`),
            lte: new Date(`${date} 23:59:59`),
          },
        },
        include: {
          _count: {
            select: {
              seats: { where: { isBooked: false } },
            },
          },
        },
        orderBy: { price: "asc" },
      });
    }

    const formatted = flights.map((f) => ({
      id: f.id,
      flightNumber: f.flightNumber,
      origin: f.origin,
      destination: f.destination,
      departureTime: new Date(f.departureTime).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      arrivalTime: new Date(f.arrivalTime).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      price: f.price,
      availableSeats: f._count.seats,
      duration: getDuration(f.departureTime, f.arrivalTime),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Flights error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function getDuration(departure: Date, arrival: Date): string {
  const diffMs = new Date(arrival).getTime() - new Date(departure).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

