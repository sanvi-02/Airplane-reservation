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
};

export default function SearchPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setSearched(true);
    setError("");
    setFlights([]);

    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/flights?${query}`);
      if (!res.ok) throw new Error("Flights fetch karne mein problem hui");
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      setError("Flights load nahi ho sake. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <span className="text-2xl font-bold text-white tracking-tight">
            ✈ SkyBook
          </span>
          <span className="text-slate-500 text-sm">Flight Search</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Your Flights
          </h1>
          <p className="text-slate-400 mb-8">
            Destination choose karo, date select karo, aur best seats grab karo.
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

        {!loading && searched && flights.length === 0 && !error && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-medium text-slate-300">
              No flights available
            </p>
            <p className="text-sm mt-1">
              Date ya destination change karke dobara try karo
            </p>
          </div>
        )}

        {!loading && flights.length > 0 && (
          <div>
            <p className="text-slate-400 text-sm mb-4">
              <span className="text-white font-medium">{flights.length}</span>{" "}
              flights found
            </p>
            <div className="flex flex-col gap-4">
              {flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
