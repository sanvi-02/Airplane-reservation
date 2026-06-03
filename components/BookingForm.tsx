"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  flightId: string;
  seatId: string;
  seatNumber: string;
  flightNumber: string;
  origin: string;
  destination: string;
  price: number;
}

export default function BookingForm({
  flightId,
  seatId,
  seatNumber,
  flightNumber,
  origin,
  destination,
  price,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name || !email) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId,
          passengerName: name,
          passengerEmail: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Booking failed");
        return;
      }

      router.push(`/confirm?ref=${data.referenceCode}`);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="max-w-md mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-white mb-2">Complete Booking</h1>
        <p className="text-slate-400 text-sm mb-8">
          Review your details and confirm.
        </p>

        {/* Flight Summary */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">
              {flightNumber}
            </span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <p className="text-xl font-bold text-white">{origin}</p>
              <p className="text-slate-400 text-xs">Origin</p>
            </div>
            <div className="flex-1 flex items-center gap-1">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-slate-500 text-xs">✈</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-white">{destination}</p>
              <p className="text-slate-400 text-xs">Destination</p>
            </div>
          </div>
          <div className="flex justify-between border-t border-slate-700 pt-3">
            <div>
              <p className="text-slate-400 text-xs">Seat</p>
              <p className="text-white font-semibold">{seatNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs">Price</p>
              <p className="text-white font-semibold">
                ₹{price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800 text-red-300 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-xl transition-colors">
            {loading ? "Booking..." : "Confirm Booking →"}
          </button>
        </div>
      </div>
    </main>
  );
}
