import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getLocalSeats } from "@/lib/local-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const flightId = searchParams.get("flightId");

  if (!flightId) {
    return NextResponse.json(
      { error: "flightId zaroori hai" },
      { status: 400 }
    );
  }

  if (!prisma) {
    const result = await getLocalSeats(flightId);
    if (!result) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  }

  try {
    const flight = await prisma.flight.findUnique({ where: { id: flightId } });

    if (!flight) {
      return NextResponse.json({ error: "Flight nahi mili" }, { status: 404 });
    }

    const seats = await prisma.seat.findMany({
      where: { flightId },
      orderBy: { seatNumber: "asc" },
    });

    return NextResponse.json({ flight, seats });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { seatId } = await req.json();

  if (!seatId) {
    return NextResponse.json({ error: "seatId zaroori hai" }, { status: 400 });
  }

  if (!prisma) {
    return NextResponse.json(
      { error: "Seat locking is handled when the booking is confirmed." },
      { status: 405 }
    );
  }

  try {
    const seat = await prisma.seat.findUnique({ where: { id: seatId } });

    if (!seat) {
      return NextResponse.json({ error: "Seat nahi mili" }, { status: 404 });
    }

    if (seat.isBooked) {
      return NextResponse.json(
        { error: "Seat already booked hai" },
        { status: 409 }
      );
    }

    const updated = await prisma.seat.update({
      where: { id: seatId },
      data: { isBooked: true },
    });

    return NextResponse.json({ success: true, seat: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
