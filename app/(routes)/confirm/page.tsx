"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ref) {
      setError("No reference code provided");
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/lookup?ref=${ref}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load booking");
        setBooking(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [ref]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Loading your confirmation...</p>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="text-xl font-bold text-white mb-2">Oops!</h1>
          <p className="text-slate-400 text-sm mb-6">{error || "Booking not found"}</p>
          <button
            onClick={() => router.push("/search")}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors">
            Back to Search
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Boarding Pass Wrapper */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in-up">
        
        {/* Main Section */}
        <div className="flex-1 p-8 md:p-10 relative">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                BOARDING PASS
              </h1>
              <p className="text-slate-500 font-medium">SkyBook Airlines • Economy Class</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
              ✈
            </div>
          </div>

          {/* Passenger Info */}
          <div className="mb-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Passenger Name</p>
            <p className="text-xl font-bold text-slate-800 uppercase">{booking.passengerName}</p>
          </div>

          {/* Flight Details */}
          <div className="flex flex-wrap gap-y-8 mb-8 border-t border-b border-slate-100 py-6">
            <div className="w-1/2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Flight</p>
              <p className="text-xl font-bold text-slate-800">{booking.seat.flight.flightNumber}</p>
            </div>
            <div className="w-1/2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Seat</p>
              <p className="text-xl font-bold text-blue-600">{booking.seat.seatNumber}</p>
            </div>
            <div className="w-1/2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Origin</p>
              <p className="text-xl font-bold text-slate-800">{booking.seat.flight.origin}</p>
            </div>
            <div className="w-1/2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Destination</p>
              <p className="text-xl font-bold text-slate-800">{booking.seat.flight.destination}</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/search")}
            className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            ← Book another flight
          </button>
        </div>

        {/* Tear-off Section */}
        <div className="w-full md:w-64 bg-slate-50 p-8 border-t md:border-t-0 md:border-l-2 border-dashed border-slate-300 relative flex flex-col justify-between">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-slate-950 rounded-full hidden md:block"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-slate-950 rounded-full hidden md:block"></div>
          
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Booking Ref</p>
            <p className="text-2xl font-black text-slate-800 tracking-widest mb-6">{booking.referenceCode}</p>
            
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Price Paid</p>
            <p className="text-xl font-bold text-green-600">₹{booking.seat.flight.price.toLocaleString("en-IN")}</p>
          </div>

          <div className="mt-8 flex flex-col items-center">
            {/* Fake Barcode */}
            <div className="w-full h-16 bg-[repeating-linear-gradient(90deg,#1e293b_0,#1e293b_2px,transparent_2px,transparent_4px,#1e293b_4px,#1e293b_5px,transparent_5px,transparent_8px,#1e293b_8px,#1e293b_12px,transparent_12px,transparent_14px)] opacity-80 mb-2"></div>
            <p className="text-[10px] font-mono text-slate-400 tracking-[0.3em]">{booking.id.split("-").join("")}</p>
          </div>
        </div>

      </div>
    </main>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </main>
    }>
      <ConfirmContent />
    </Suspense>
  );
}
