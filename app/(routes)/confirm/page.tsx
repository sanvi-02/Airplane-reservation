"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

type Booking = {
  id: string;
  referenceCode: string;
  passengerName: string;
  seat: {
    seatNumber: string;
    flight: {
      flightNumber: string;
      origin: string;
      destination: string;
      price: number;
    };
  };
};

function ConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ref) {
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/lookup?ref=${ref}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load booking");
        setBooking(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [ref]);

  if (!ref) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-foreground/[0.02] border border-white/10 p-10 text-center">
          <p className="text-4xl mb-4 font-light text-accent">?</p>
          <h1 className="text-2xl font-serif text-foreground mb-2">Missing Reference</h1>
          <p className="text-foreground/50 text-sm mb-8 tracking-widest uppercase">No reference code provided</p>
          <button
            onClick={() => router.push("/search")}
            className="btn-secondary px-8 py-3 text-xs tracking-widest uppercase">
            Back to Search
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-foreground/60 animate-pulse">
          <div className="w-10 h-10 border border-foreground/20 border-t-accent rounded-full animate-spin" />
          <p className="text-sm tracking-widest uppercase">Retrieving Itinerary...</p>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-foreground/[0.02] border border-white/10 p-10 text-center animate-[fade-in-up_0.4s_ease-out_both]">
          <p className="text-4xl mb-4 font-light text-red-400">!</p>
          <h1 className="text-2xl font-serif text-foreground mb-2">Retrieval Failed</h1>
          <p className="text-foreground/50 text-sm mb-8 tracking-widest uppercase">{error || "Booking not found"}</p>
          <button
            onClick={() => router.push("/search")}
            className="btn-secondary px-8 py-3 text-xs tracking-widest uppercase">
            Back to Search
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background overflow-hidden selection:bg-accent/30 py-20 px-4 sm:px-8 flex flex-col items-center justify-center">
      {/* Decorative large SVG arc in the background right */}
      <div className="absolute right-[-20%] top-[-10%] z-0 h-[120%] w-3/4 animate-slow-pan opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 100 1000 Q 500 100 1000 500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-4xl animate-[fade-in-up_0.8s_ease-out_both]">
        <div className="text-center mb-12">
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-4">Reservation Confirmed</p>
          <h1 className="font-serif text-5xl font-light text-foreground">Your Itinerary</h1>
        </div>

        {/* Premium Dark Boarding Pass */}
        <div className="w-full bg-[#161412] border border-white/10 flex flex-col md:flex-row relative">

          {/* Main Section */}
          <div className="flex-1 p-8 md:p-12 relative border-b md:border-b-0 md:border-r border-dashed border-white/10">
            {/* Cutouts */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border-r border-white/10 hidden md:block"></div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border-l border-white/10 hidden md:block z-10"></div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-8 h-8 rounded-full bg-background border-t border-white/10 md:hidden"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-12 pb-6 border-b border-white/5">
              <div>
                <h2 className="text-xl font-serif tracking-widest text-foreground uppercase">SkyBook Reserve</h2>
                <p className="text-[10px] text-accent tracking-[0.2em] uppercase mt-1">Premium Economy</p>
              </div>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-accent rotate-45">
                <path d="M17.8 19.2L16 11l4-4c1.1-1.1 1.1-2.9 0-4s-2.9-1.1-4 0l-4 4-8.2-1.8-1.8 1.8 7 3.5-3.5 3.5-2.5-1-1.5 1.5 3.5 3.5 3.5 3.5 1.5-1.5-1-2.5 3.5-3.5 3.5 7 1.8-1.8z"></path>
              </svg>
            </div>

            {/* Passenger Info */}
            <div className="mb-10">
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2">Passenger</p>
              <p className="text-2xl font-light text-foreground tracking-wide">{booking.passengerName}</p>
            </div>

            {/* Flight Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2">Flight</p>
                <p className="text-lg font-light text-foreground">{booking.seat.flight.flightNumber}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2">Seat</p>
                <p className="text-lg font-serif text-accent">{booking.seat.seatNumber}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2">Origin</p>
                <p className="text-lg font-light text-foreground">{booking.seat.flight.origin}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2">Dest</p>
                <p className="text-lg font-light text-foreground">{booking.seat.flight.destination}</p>
              </div>
            </div>
          </div>

          {/* Tear-off Section */}
          <div className="w-full md:w-72 p-8 md:p-12 relative flex flex-col justify-center bg-black/20">
            {/* Cutout for mobile */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-8 h-8 rounded-full bg-background border-b border-white/10 md:hidden"></div>

            <div className="mb-10 text-center md:text-left">
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2">Reference Code</p>
              <p className="text-3xl font-serif text-accent tracking-widest">{booking.referenceCode}</p>
            </div>

            <div className="mb-10 text-center md:text-left">
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2">Total Paid</p>
              <p className="text-xl font-light text-foreground">₹{booking.seat.flight.price.toLocaleString("en-IN")}</p>
            </div>

            <div className="mt-auto flex flex-col items-center">
              {/* Fake Barcode - Dark theme compatible */}
              <div className="w-full h-12 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.8)_0,rgba(255,255,255,0.8)_2px,transparent_2px,transparent_4px,rgba(255,255,255,0.5)_4px,rgba(255,255,255,0.5)_5px,transparent_5px,transparent_8px,rgba(255,255,255,0.9)_8px,rgba(255,255,255,0.9)_12px,transparent_12px,transparent_14px)] opacity-50 mb-3 mix-blend-screen"></div>
              <p className="text-[8px] font-mono text-foreground/30 tracking-[0.4em]">{booking.id.split("-").join("").substring(0, 16)}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-xs tracking-widest uppercase text-foreground/50 hover:text-accent transition-colors pb-1 border-b border-transparent hover:border-accent">
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-foreground/60 animate-pulse">
          <div className="w-10 h-10 border border-foreground/20 border-t-accent rounded-full animate-spin" />
          <p className="text-sm tracking-widest uppercase">Loading...</p>
        </div>
      </main>
    }>
      <ConfirmContent />
    </Suspense>
  );
}
