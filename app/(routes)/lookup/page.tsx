"use client";

import { useState } from "react";
import Link from "next/link";

type Booking = {
  id: string;
  referenceCode: string;
  passengerName: string;
  passengerEmail: string;
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

export default function LookupPage() {
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [canceling, setCanceling] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.trim()) return;

    setLoading(true);
    setError("");
    setBooking(null);

    try {
      const res = await fetch(`/api/bookings/lookup?ref=${encodeURIComponent(ref.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Booking not found");
        return;
      }

      setBooking(data);
    } catch {
      setError("Failed to fetch booking. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) return;

    setCanceling(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to cancel booking");
        return;
      }

      alert("Booking cancelled successfully.");
      setBooking(null);
      setRef("");
    } catch {
      alert("Error cancelling booking.");
    } finally {
      setCanceling(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden selection:bg-accent/30 pt-20 px-6 pb-20">
      {/* Decorative large SVG arc in the background left */}
      <div className="absolute left-[-20%] top-[10%] z-0 h-[100%] w-1/2 animate-slow-pan opacity-[0.02] pointer-events-none transform -scale-x-100">
        <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 100 1000 Q 500 100 1000 500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white" />
        </svg>
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        <Link href="/" className="text-xs uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors mb-10 inline-flex items-center gap-2">
          ← Back
        </Link>
        <h1 className="text-5xl font-serif font-light text-foreground mb-4">My Booking</h1>
        <p className="text-foreground/60 text-lg mb-12">
          Enter your reference code to view or cancel your flight.
        </p>

        <form onSubmit={handleLookup} className="flex gap-4 mb-12">
          <input
            type="text"
            value={ref}
            onChange={(e) => setRef(e.target.value.toUpperCase())}
            placeholder="e.g. A1B2C3D4"
            className="flex-1 bg-transparent border-0 border-b border-white/20 text-foreground py-3 focus:outline-none focus:border-accent transition-colors placeholder:text-foreground/30 font-mono text-lg uppercase tracking-wider"
            required
          />
          <button
            type="submit"
            disabled={loading || !ref.trim()}
            className="btn-secondary px-8 text-xs font-bold tracking-widest uppercase disabled:opacity-50 disabled:pointer-events-none">
            {loading ? "Searching..." : "Lookup"}
          </button>
        </form>

        {error && (
          <div className="border border-red-900/50 bg-red-950/20 text-red-400 rounded-none p-5 text-sm mb-10 animate-[fade-in-up_0.3s_ease-out_both]">
            {error}
          </div>
        )}

        {booking && (
          <div className="border border-white/10 bg-foreground/[0.02] p-8 relative animate-[fade-in-up_0.6s_ease-out_both]">
            {/* Top corner details */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent/40" />
            
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2">Passenger</p>
                <p className="text-xl font-light text-foreground">{booking.passengerName}</p>
                <p className="text-sm font-serif text-accent italic mt-1">{booking.passengerEmail}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-[#12100E] bg-accent px-3 py-1 font-bold">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-foreground/40">Flight</span>
                <span className="text-foreground text-sm font-mono tracking-widest border border-white/10 px-2 py-1">
                  {booking.seat.flight.flightNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-foreground/40">Route</span>
                <span className="text-foreground text-sm font-medium">
                  {booking.seat.flight.origin} <span className="text-accent mx-2">→</span> {booking.seat.flight.destination}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-foreground/40">Seat</span>
                <span className="text-foreground text-lg font-light">{booking.seat.seatNumber}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-6 mt-6">
                <span className="text-xs uppercase tracking-widest text-foreground/40">Total Paid</span>
                <span className="text-3xl font-serif text-foreground">
                  <span className="text-accent text-xl mr-1">₹</span>
                  {booking.seat.flight.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={handleCancel}
              disabled={canceling}
              className="w-full border border-red-900/50 bg-red-950/10 hover:bg-red-950/30 text-red-400 disabled:opacity-50 font-medium tracking-widest uppercase py-4 transition-colors text-xs">
              {canceling ? "Cancelling..." : "Cancel Booking"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
