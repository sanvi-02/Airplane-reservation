import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id } });
      if (!booking) throw new Error("Not found");

      await tx.seat.update({
        where: { id: booking.seatId },
        data: { isBooked: false },
      });

      await tx.booking.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Cancellation failed" }, { status: 500 });
  }
}
