import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const { seatId, passengerName, passengerEmail } = await req.json();

  if (!seatId || !passengerName || !passengerEmail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const seat = await prisma.seat.findUnique({ where: { id: seatId } });
    if (!seat) return NextResponse.json({ error: "Seat not found" }, { status: 404 });
    if (seat.isBooked) return NextResponse.json({ error: "Seat already booked" }, { status: 409 });

    await prisma.seat.update({
      where: { id: seatId },
      data: { isBooked: true },
    });

    const booking = await prisma.booking.create({
      data: {
        referenceCode: nanoid(8).toUpperCase(),
        passengerName,
        passengerEmail,
        seatId,
      },
      include: { seat: { include: { flight: true } } },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}