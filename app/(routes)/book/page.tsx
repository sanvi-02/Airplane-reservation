import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import { prisma } from "@/lib/db";
import { getLocalSeat } from "@/lib/local-store";

interface Props {
  searchParams: Promise<{ flightId: string; seatId: string }>;
}

export default async function BookPage({ searchParams }: Props) {
  const { flightId, seatId } = await searchParams;

  if (!flightId || !seatId) return notFound();

  const seat = prisma
    ? await prisma.seat.findUnique({
        where: { id: seatId },
        include: { flight: true },
      })
    : await getLocalSeat(seatId);

  if (!seat || seat.flightId !== flightId) return notFound();

  if (seat.isBooked) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-foreground/[0.02] border border-white/10 p-10 text-center max-w-sm w-full animate-[fade-in-up_0.4s_ease-out_both]">
          <p className="text-4xl mb-4 font-light text-red-400">!</p>
          <p className="text-foreground font-serif text-2xl mb-8">
            Seat Unavailable
          </p>
          <a
            href="/search"
            className="inline-block btn-secondary px-8 py-3 text-xs tracking-widest uppercase text-foreground">
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
