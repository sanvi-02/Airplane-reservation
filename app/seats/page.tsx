"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Seat = {
  id: string;
  seatNumber: string;
  isBooked: boolean;
  flightId: string;
};

type Flight = {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
};

import { Suspense, Fragment } from "react";

function SeatsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const flightId = searchParams.get("flightId");

  const [flight, setFlight] = useState<Flight | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!flightId) return;
    const fetchSeats = async () => {
      try {
        const res = await fetch(`/api/seats?flightId=${flightId}`);
        if (!res.ok) throw new Error("Failed to load seats");
        const data = await res.json();
        setFlight(data.flight);
        setSeats(data.seats);
      } catch {
        setError("There was a problem loading the seat map.");
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [flightId]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) return;
    setSelectedSeats((prev) =>
      prev.find((s) => s.id === seat.id)
        ? []
        : [seat]
    );
  };

  const formatTime = (dt: string) =>
    new Date(dt).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const formatDate = (dt: string) =>
    new Date(dt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-foreground/60 animate-pulse">
          <div className="w-10 h-10 border border-foreground/20 border-t-accent rounded-full animate-spin" />
          <p className="text-sm tracking-widest uppercase">Loading Seats...</p>
        </div>
      </main>
    );
  }

  if (error || !flight) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-foreground/60 animate-[fade-in-up_0.8s_ease-out_both]">
          <p className="text-4xl mb-4 font-light text-accent">!</p>
          <p className="text-xl font-serif text-foreground/80 mb-4">{error || "Flight not found"}</p>
          <button
            onClick={() => router.back()}
            className="text-xs uppercase tracking-widest text-accent hover:text-white transition-colors">
            ← Return to Search
          </button>
        </div>
      </main>
    );
  }

  const availableCount = seats.filter((s) => !s.isBooked).length;

  return (
    <main className="min-h-screen bg-background relative overflow-hidden selection:bg-accent/30 pb-20">
      {/* Decorative large SVG arc in the background right */}
      <div className="absolute left-[-20%] top-[-10%] z-0 h-[120%] w-3/4 animate-slow-pan opacity-[0.03] pointer-events-none transform -scale-x-100">
        <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 100 1000 Q 500 100 1000 500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 animate-[fade-in-up_0.8s_ease-out_both]">
        <button
          onClick={() => router.back()}
          className="text-xs uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors mb-10 flex items-center gap-2">
          ← Back
        </button>

        {/* Flight Info Boarding Pass Style */}
        <div className="border border-white/10 bg-foreground/[0.02] p-8 relative mb-12">
          {/* Decorative notches */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border-r border-white/10"></div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border-l border-white/10"></div>
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-dashed border-white/10">
            <span className="text-xs tracking-widest uppercase text-foreground/50">
              Flight <span className="text-accent ml-1">{flight.flightNumber}</span>
            </span>
            <span className="text-xs tracking-widest uppercase text-foreground/50">
              {formatDate(flight.departureTime)}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="w-20">
              <p className="text-3xl font-light text-foreground tabular-nums">
                {formatTime(flight.departureTime)}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1">{flight.origin}</p>
            </div>
            
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 h-px bg-white/10" />
              <div className="w-1.5 h-1.5 rounded-full border border-accent" />
              <div className="flex-1 h-px bg-white/10" />
            </div>
            
            <div className="text-right w-20">
              <p className="text-3xl font-light text-foreground tabular-nums">
                {formatTime(flight.arrivalTime)}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1">{flight.destination}</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-8 mb-10 text-[10px] uppercase tracking-widest text-foreground/50">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-white/20" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/5 border border-white/5 text-transparent flex items-center justify-center text-[8px]">×</div>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent" />
            <span className="text-accent">Selected</span>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="relative mx-auto max-w-fit mb-16">
          {/* Fuselage shape outline */}
          <div className="absolute -top-16 -bottom-8 -left-8 -right-8 border border-white/10 rounded-t-[140px] rounded-b-[60px] pointer-events-none" />
          
          <div className="relative z-10 p-4">
            <div className="grid grid-cols-[30px_1fr_1fr_1fr_30px_1fr_1fr_1fr] min-w-[320px] gap-3 mb-6 px-2 border-b border-white/5 pb-6">
              <div />
              {["A", "B", "C"].map((col) => (
                <div key={col} className="text-center text-[10px] text-foreground/40 font-medium">{col}</div>
              ))}
              <div /> {/* Aisle gap */}
              {["D", "E", "F"].map((col) => (
                <div key={col} className="text-center text-[10px] text-foreground/40 font-medium">{col}</div>
              ))}
            </div>
            
            {Array.from({ length: 5 }, (_, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-[30px_1fr_1fr_1fr_30px_1fr_1fr_1fr] min-w-[320px] gap-3 mb-4">
                <div className="flex items-center justify-center text-[10px] text-foreground/30 font-medium">
                  {rowIdx + 1}
                </div>
                {seats.slice(rowIdx * 6, rowIdx * 6 + 6).map((seat, i) => {
                  const isSelected = selectedSeats.some((s) => s.id === seat.id);
                  const button = (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.isBooked}
                      title={seat.seatNumber}
                      className={`h-10 text-[10px] font-medium transition-all duration-300 ${
                        seat.isBooked
                          ? "bg-white/5 border border-white/5 text-foreground/20 cursor-not-allowed"
                          : isSelected
                          ? "bg-accent text-[#12100E] shadow-[0_0_15px_rgba(201,151,74,0.4)] scale-105"
                          : "bg-transparent border border-white/20 text-foreground/60 hover:border-accent hover:text-accent cursor-pointer"
                      }`}>
                      {seat.isBooked ? "×" : seat.seatNumber}
                    </button>
                  );

                  return (
                    <Fragment key={seat.id}>
                      {button}
                      {i === 2 && <div className="w-full" />}
                    </Fragment>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Book Now */}
        <div className="border-t border-white/10 pt-8 mt-8">
          {selectedSeats.length > 0 ? (
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                  {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected
                </p>
                <p className="text-3xl font-light text-foreground mb-1">
                  {selectedSeats.map((s) => s.seatNumber).join(", ")}
                </p>
                <p className="text-sm font-serif text-accent">
                  ₹{(flight.price * selectedSeats.length).toLocaleString("en-IN")} total
                </p>
              </div>
              <button
                onClick={() => router.push(`/book?flightId=${flightId}&seatId=${selectedSeats[0].id}`)}
                className="shimmer-bg inline-flex h-12 items-center justify-center rounded-full px-8 text-xs font-bold tracking-widest uppercase text-[#12100E] transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(201,151,74,0.3)]">
                Book Now
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[10px] uppercase tracking-widest text-foreground/30">
                Select seats from the map above to continue
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function SeatsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-foreground/60 animate-pulse">
          <div className="w-10 h-10 border border-foreground/20 border-t-accent rounded-full animate-spin" />
          <p className="text-sm tracking-widest uppercase">Loading...</p>
        </div>
      </main>
    }>
      <SeatsContent />
    </Suspense>
  );
}
