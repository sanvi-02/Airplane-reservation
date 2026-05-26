import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await db.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id: params.id } });
      if (!booking) throw new Error("Not found");

      await tx.seat.update({
        where: { id: booking.seatId },
        data: { isBooked: false },
      });

      await tx.booking.delete({ where: { id: params.id } });
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Cancellation failed" }, { status: 500 });
  }
}
