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
    <div className="group relative flex flex-col md:flex-row md:items-center justify-between gap-8 py-8 border-b border-white/5 transition-all hover:bg-foreground/[0.02]">
      {/* Decorative vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>
      
      <div className="flex-1 pl-4 md:pl-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-xs tracking-widest uppercase text-foreground/50 font-medium">
            Flight <span className="text-accent ml-1">{flight.flightNumber}</span>
          </div>
          {isAlmostFull && !isFull && (
            <span className="text-[10px] tracking-widest uppercase text-accent border border-accent/30 px-2 py-0.5 rounded-sm">
              {seatsLeft} left
            </span>
          )}
          {isFull && (
            <span className="text-[10px] tracking-widest uppercase text-red-400 border border-red-400/30 px-2 py-0.5 rounded-sm">
              Full
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="text-left w-20">
            <p className="text-3xl font-light text-foreground tracking-tight tabular-nums">
              {flight.departureTime}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1">
              {flight.origin}
            </p>
          </div>
          
          <div className="flex-1 flex flex-col items-center max-w-[200px]">
            <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2">{flight.duration}</p>
            <div className="w-full flex items-center gap-2">
              <div className="flex-1 h-px bg-white/10" />
              <div className="w-1.5 h-1.5 rounded-full border border-accent" />
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-accent mt-2">Direct</p>
          </div>

          <div className="text-right w-20">
            <p className="text-3xl font-light text-foreground tracking-tight tabular-nums">
              {flight.arrivalTime}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1">
              {flight.destination}
            </p>
          </div>
        </div>
      </div>

      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 pr-4 md:pr-6 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 pl-0 md:pl-8">
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Per Person</p>
          <p className="text-4xl font-serif text-foreground">
            <span className="text-accent text-xl mr-1">₹</span>
            {flight.price.toLocaleString("en-IN")}
          </p>
        </div>
        <button
          onClick={() => router.push(`/seats?flightId=${flight.id}`)}
          disabled={isFull}
          className="btn-secondary px-8 py-3 text-xs tracking-widest uppercase font-medium disabled:opacity-50 disabled:pointer-events-none">
          {isFull ? "Unavailable" : "Select"}
        </button>
      </div>
    </div>
  );
}
