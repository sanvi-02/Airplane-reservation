"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ref = searchParams.get("ref");
  const name = searchParams.get("name");
  const flight = searchParams.get("flight");
  const seat = searchParams.get("seat");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const price = searchParams.get("price");

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
        {/* Success icon */}
        <div className="w-16 h-16 bg-green-950 border border-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✅</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          {name}, tumhari booking successful ho gayi!
        </p>

        {/* Reference code */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 mb-6">
          <p className="text-slate-400 text-xs mb-1">Booking Reference</p>
          <p className="text-white font-mono font-bold text-xl tracking-widest">
            {ref}
          </p>
        </div>

        {/* Flight details */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 mb-6 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Flight</span>
            <span className="text-white font-medium text-sm">{flight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Route</span>
            <span className="text-white font-medium text-sm">
              {from} → {to}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Seat</span>
            <span className="text-white font-medium text-sm">{seat}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Price</span>
            <span className="text-white font-medium text-sm">
              ₹{Number(price).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <button
          onClick={() => router.push("/search")}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors">
          Search More Flights
        </button>
      </div>
    </main>
  );
}
