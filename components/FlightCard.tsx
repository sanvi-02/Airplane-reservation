"use client";

import { useRouter } from "next/navigation";
import { Flight } from "@/app/search/page";

type Props = { flight: Flight };

export default function FlightCard({ flight }: Props) {
  const router = useRouter();

  const seatsLeft = flight.availableSeats;
  const isAlmostFull = seatsLeft <= 5;
  const isFull = seatsLeft === 0;

  return (
    <div className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/80 hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-2xl p-6 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 text-sm shadow-inner border border-slate-700">
              ✈
            </div>
            <span className="text-xs font-mono bg-slate-800/80 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-md">
              {flight.flightNumber}
            </span>
            {isAlmostFull && !isFull && (
              <span className="text-xs bg-orange-950 text-orange-400 border border-orange-800 px-2 py-0.5 rounded">
                Only {seatsLeft} seats left!
              </span>
            )}
            {isFull && (
              <span className="text-xs bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded">
                Full
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white tabular-nums">
                {flight.departureTime}
              </p>
              <p className="text-sm text-slate-400 font-medium">
                {flight.origin}
              </p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <p className="text-xs text-slate-500">{flight.duration}</p>
              <div className="w-full flex items-center gap-1">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-slate-500 text-xs">✈</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>
              <p className="text-xs text-slate-600">Direct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white tabular-nums">
                {flight.arrivalTime}
              </p>
              <p className="text-sm text-slate-400 font-medium">
                {flight.destination}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-px h-16 bg-gradient-to-b from-slate-800 via-slate-600 to-slate-800" />

        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:min-w-[140px]">
          <div className="text-right">
            <p className="text-3xl font-extrabold text-white tracking-tight">
              ₹{flight.price.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">per person</p>
          </div>
          <button
            onClick={() => router.push(`/seats?flightId=${flight.id}`)}
            disabled={isFull}
            className="relative overflow-hidden group/btn bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] whitespace-nowrap active:scale-95">
            <span className="relative z-10">{isFull ? "Unavailable" : "Select Seat"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
