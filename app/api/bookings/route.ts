import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createLocalBooking } from "@/lib/local-store";
import { nanoid } from "nanoid";
import { sendBookingEmail } from "@/lib/email";
export async function POST(req: NextRequest) {
  const { seatId, passengerName, passengerEmail, paymentId } = await req.json();

  if (!seatId || !passengerName || !passengerEmail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (prisma && !paymentId) {
    return NextResponse.json({ error: "Payment required" }, { status: 400 });
  }

  if (!prisma) {
    const result = await createLocalBooking({
      seatId,
      passengerName,
      passengerEmail,
    });
    return NextResponse.json(result.body, { status: result.status });
  }

  try {
    const seat = await prisma.seat.findUnique({ where: { id: seatId } });
    if (!seat)
      return NextResponse.json({ error: "Seat not found" }, { status: 404 });
    if (seat.isBooked)
      return NextResponse.json(
        { error: "Seat already booked" },
        { status: 409 },
      );

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
        paymentId,
      },
      include: { seat: { include: { flight: true } } },
    });
   await sendBookingEmail(
     booking.passengerEmail,
     booking.passengerName,
     booking.seat.flight.number,
     booking.seat.number,
     booking.referenceCode
   );
    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
