import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import { prisma } from "@/lib/db";

interface Props {
  searchParams: Promise<{ flightId: string; seatId: string }>;
}

export default async function BookPage({ searchParams }: Props) {
  const { flightId, seatId } = await searchParams;

  if (!flightId || !seatId) return notFound();

  // fetch seat + flight from DB directly (server component)
  const seat = await prisma.seat.findUnique({
    where: { id: seatId },
    include: { flight: true },
  });

  if (!seat || seat.flightId !== flightId) return notFound();
  if (seat.isBooked) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <p className="text-red-500 text-lg font-medium">
          This seat is already booked.
        </p>
        <a href="/" className="text-blue-600 underline text-sm mt-2 block">
          Go back to search
        </a>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Complete Your Booking
      </h1>
      <p className="text-center text-sm text-gray-500 mb-6">
        Review your seat and enter passenger details
      </p>
      <BookingForm
        flightId={flightId}
        seatId={seatId}
        seatNumber={seat.seatNumber}
        flightNumber={seat.flight.flightNumber}
        origin={seat.flight.origin}
        destination={seat.flight.destination}
        price={seat.flight.price}
      />
    </main>
  );
}
