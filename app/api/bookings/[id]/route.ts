import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cancelLocalBooking } from "@/lib/local-store";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
  }

  if (!prisma) {
    const cancelled = await cancelLocalBooking(id);
    if (!cancelled) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Free up the seat and delete booking in a transaction
    await prisma.$transaction([
      prisma.seat.update({
        where: { id: booking.seatId },
        data: { isBooked: false },
      }),
      prisma.booking.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
