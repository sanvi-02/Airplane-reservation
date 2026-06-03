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
    <div className="bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-2xl p-5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
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
              <p className="text-xs text-slate-600">Direct Flight</p>
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

        <div className="hidden md:block w-px h-16 bg-slate-700" />

        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:min-w-[130px]">
          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              ₹{flight.price.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-slate-500">per person</p>
          </div>
          <button
            onClick={() => router.push(`/seats?flightId=${flight.id}`)}
            disabled={isFull}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
            {isFull ? "Unavailable" : "Available"}
          </button>
        </div>
      </div>
    </div>
  );
}
