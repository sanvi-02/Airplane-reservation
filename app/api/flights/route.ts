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
    const flights = await prisma.flight.findMany({
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
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function getDuration(departure: Date, arrival: Date): string {
  const diffMs = new Date(arrival).getTime() - new Date(departure).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}
