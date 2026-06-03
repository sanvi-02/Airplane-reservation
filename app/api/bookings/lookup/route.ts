import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");

  if (!ref) {
    return NextResponse.json(
      { error: "Reference code is required" },
      { status: 400 }
    );
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { referenceCode: ref },
      include: {
        seat: {
          include: {
            flight: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
