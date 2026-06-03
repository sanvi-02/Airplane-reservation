"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import FlightCard from "@/components/FlightCard";

export type Flight = {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  duration: string;
};

export type SearchParams = {
  origin: string;
  destination: string;
  date: string;
  returnDate?: string;
};

export default function SearchPage() {
  const [outboundFlights, setOutboundFlights] = useState<Flight[]>([]);
  const [returnFlights, setReturnFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setSearched(true);
    setError("");
    setOutboundFlights([]);
    setReturnFlights([]);

    try {
      const outboundQuery = new URLSearchParams({ origin: params.origin, destination: params.destination, date: params.date }).toString();
      const res = await fetch(`/api/flights?${outboundQuery}`);
      if (!res.ok) throw new Error("Failed to fetch flights");
      const data = await res.json();
      setOutboundFlights(data);

      if (params.returnDate) {
        const returnQuery = new URLSearchParams({ origin: params.destination, destination: params.origin, date: params.returnDate }).toString();
        const returnRes = await fetch(`/api/flights?${returnQuery}`);
        if (!returnRes.ok) throw new Error("Failed to fetch return flights");
        const returnData = await returnRes.json();
        setReturnFlights(returnData);
      }
    } catch {
      setError("Unable to load flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden selection:bg-accent/30">
      {/* Decorative large SVG arc in the background right */}
      <div className="absolute right-[-20%] top-[-10%] z-0 h-[120%] w-3/4 animate-slow-pan opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 100 1000 Q 500 100 1000 500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white" />
        </svg>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-24">
        <div className="mb-16 animate-[fade-in-up_0.8s_ease-out_both]">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-8 bg-accent/50"></div>
            <span className="text-xs uppercase tracking-widest text-foreground/50">
              Find your journey
            </span>
          </div>
          <h1 className="font-serif text-5xl font-light text-foreground mb-4">
            Search Flights
          </h1>
          <p className="text-foreground/60 text-lg max-w-xl">
            Select your origin, destination, and dates to discover the perfect itinerary.
          </p>
          <div className="mt-10">
            <SearchForm onSearch={handleSearch} loading={loading} />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-24 text-foreground/60 animate-pulse">
            <div className="w-10 h-10 border border-foreground/20 border-t-accent rounded-full animate-spin" />
            <p className="text-sm tracking-widest uppercase">Searching...</p>
          </div>
        )}

        {!loading && error && (
          <div className="border border-red-900/50 bg-red-950/20 text-red-400 rounded-none p-5 text-sm mb-10">
            {error}
          </div>
        )}

        {!loading && searched && outboundFlights.length === 0 && !error && (
          <div className="text-center py-24 text-foreground/50 animate-[fade-in-up_0.8s_ease-out_both]">
            <p className="text-4xl mb-4 font-light text-accent">!</p>
            <p className="text-xl font-serif text-foreground/80 mb-2">
              No flights available for outbound journey
            </p>
            <p className="text-sm">
              Try adjusting your route or dates.
            </p>
          </div>
        )}

        {!loading && outboundFlights.length > 0 && (
          <div className="mb-16 animate-[fade-in-up_0.8s_ease-out_both]">
            <h2 className="text-2xl font-serif font-light text-foreground mb-8 border-b border-white/10 pb-4">
              Outbound <span className="text-accent italic text-xl ml-2">{outboundFlights[0]?.origin} — {outboundFlights[0]?.destination}</span>
            </h2>
            <div className="flex flex-col gap-6">
              {outboundFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          </div>
        )}

        {!loading && returnFlights.length > 0 && (
          <div className="animate-[fade-in-up_0.8s_ease-out_both]">
            <h2 className="text-2xl font-serif font-light text-foreground mb-8 border-b border-white/10 pb-4">
              Return <span className="text-accent italic text-xl ml-2">{returnFlights[0]?.origin} — {returnFlights[0]?.destination}</span>
            </h2>
            <div className="flex flex-col gap-6">
              {returnFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
