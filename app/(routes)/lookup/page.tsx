"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LookupPage() {
  const router = useRouter();
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
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
    } catch (err) {
      setError("Failed to fetch booking. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
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
    } catch (err) {
      alert("Error cancelling booking.");
    } finally {
      setCanceling(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center pt-20 px-4">
      <div className="max-w-md w-full">
        <Link href="/" className="text-slate-400 hover:text-white mb-6 inline-block text-sm">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">My Booking</h1>
        <p className="text-slate-400 text-sm mb-8">
          Enter your reference code to view or cancel your flight.
        </p>

        <form onSubmit={handleLookup} className="flex gap-3 mb-8">
          <input
            type="text"
            value={ref}
            onChange={(e) => setRef(e.target.value.toUpperCase())}
            placeholder="e.g. A1B2C3D4"
            className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600 font-mono"
            required
          />
          <button
            type="submit"
            disabled={loading || !ref.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {loading ? "Searching..." : "Lookup"}
          </button>
        </form>

        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-300 rounded-xl px-5 py-4 text-sm mb-6">
            {error}
          </div>
        )}

        {booking && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
              <div>
                <p className="text-slate-400 text-xs mb-1">Passenger</p>
                <p className="text-white font-semibold">{booking.passengerName}</p>
                <p className="text-slate-500 text-xs mt-1">{booking.passengerEmail}</p>
              </div>
              <div className="text-right">
                <span className="bg-green-950/50 text-green-400 border border-green-800 text-xs px-2 py-1 rounded font-medium">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Flight</span>
                <span className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded text-sm">
                  {booking.seat.flight.flightNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Route</span>
                <span className="text-white text-sm font-medium">
                  {booking.seat.flight.origin} → {booking.seat.flight.destination}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Seat</span>
                <span className="text-white text-sm font-medium">{booking.seat.seatNumber}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                <span className="text-slate-400 text-sm">Total Paid</span>
                <span className="text-white font-bold">
                  ₹{booking.seat.flight.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={handleCancel}
              disabled={canceling}
              className="w-full bg-red-950/30 hover:bg-red-950 border border-red-900 text-red-400 disabled:opacity-50 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {canceling ? "Cancelling..." : "Cancel Booking"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
