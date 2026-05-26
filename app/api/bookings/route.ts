import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const { seatId, passengerName, passengerEmail } = await req.json();

  if (!seatId || !passengerName || !passengerEmail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const seat = await tx.seat.findUnique({ where: { id: seatId } });
      if (!seat) throw new Error("Seat not found");
      if (seat.isBooked) throw new Error("Seat already booked");

      await tx.seat.update({
        where: { id: seatId },
        data: { isBooked: true },
      });

      return tx.booking.create({
        data: {
          referenceCode: nanoid(8).toUpperCase(),
          passengerName,
          passengerEmail,
          seatId,
        },
        include: { seat: { include: { flight: true } } },
      });
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
