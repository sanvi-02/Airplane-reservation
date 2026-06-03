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
    } catch (err) {
      setError("Unable to load flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Your Flights
          </h1>
          <p className="text-slate-400 mb-8">
            Select destination and seats.
          </p>
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
            <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
            <p>Search Flights</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-950/50 border border-red-800 text-red-300 rounded-xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {!loading && searched && outboundFlights.length === 0 && !error && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-medium text-slate-300">
              No flights available for outbound journey
            </p>
            <p className="text-sm mt-1">
             Try a different date or route.
            </p>
          </div>
        )}

        {!loading && outboundFlights.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">
              Outbound: {outboundFlights[0]?.origin} → {outboundFlights[0]?.destination}
            </h2>
            <div className="flex flex-col gap-4">
              {outboundFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          </div>
        )}

        {!loading && searched && returnFlights.length === 0 && outboundFlights.length > 0 && !error && (
           // Only show "No return flights" if they actually searched for a return flight (which means returnFlights logic ran but returned empty array)
           // But we don't store `hasReturnDate` strictly, so let's rely on the state being empty.
           // To be safe, we will just render the Return Flights section only if there are return flights.
           null
        )}

        {!loading && returnFlights.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">
              Return: {returnFlights[0]?.origin} → {returnFlights[0]?.destination}
            </h2>
            <div className="flex flex-col gap-4">
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
