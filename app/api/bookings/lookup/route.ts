import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email)
    return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    const bookings = await prisma.booking.findMany({
      where: { passengerEmail: email },
      include: { seat: { include: { flight: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (err) {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
