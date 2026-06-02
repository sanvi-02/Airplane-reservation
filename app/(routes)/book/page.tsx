import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import { prisma } from "@/lib/db";

interface Props {
  searchParams: Promise<{ flightId: string; seatId: string }>;
}

export default async function BookPage({ searchParams }: Props) {
  const { flightId, seatId } = await searchParams;

  if (!flightId || !seatId) return notFound();

  const seat = await prisma.seat.findUnique({
    where: { id: seatId },
    include: { flight: true },
  });

  if (!seat || seat.flightId !== flightId) return notFound();

  if (seat.isBooked) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center max-w-sm w-full">
          <p className="text-4xl mb-4">😔</p>
          <p className="text-white font-semibold text-lg mb-2">
            Seat Already Booked
          </p>
          {/* <p className="text-slate-400 text-sm mb-6">
            Yeh seat kisi aur ne le li. Doosri seat chunno.
          </p> */}
          <a
            href="/search"
            className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
            Back to Search
          </a>
        </div>
      </main>
    );
  }

  return (
    <BookingForm
      flightId={flightId}
      seatId={seatId}
      seatNumber={seat.seatNumber}
      flightNumber={seat.flight.flightNumber}
      origin={seat.flight.origin}
      destination={seat.flight.destination}
      price={seat.flight.price}
    />
  );
}
