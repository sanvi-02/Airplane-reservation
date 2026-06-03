"use client";

import { useState, useRef, useEffect } from "react";
import SearchForm from "@/components/SearchForm";
import FlightCard from "@/components/FlightCard";

export type Flight = {
  id: string;
  flightNumber: string;
  airline: string;
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

type SortOrder = "asc" | "desc" | null;

export default function SearchPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [displayedFlights, setDisplayedFlights] = useState<Flight[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [selectedAirline, setSelectedAirline] = useState<string | null>(null);
  const [airlineDropdownOpen, setAirlineDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setAirlineDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setSearched(true);
    setError("");
    setFlights([]);
    setDisplayedFlights([]);
    setSortOrder(null);
    setSelectedAirline(null);

    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/flights?${query}`);
      if (!res.ok) throw new Error("Flights fetch karne mein problem hui");
      const data = await res.json();
      setFlights(data);
      setDisplayedFlights(data);
    } catch (err) {
      setError("Flights load nahi ho sake. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  // Unique airline names
  const airlines = Array.from(
    new Set(flights.map((f) => f.airline ?? f.flightNumber.slice(0, 2)))
  ).sort();

  // Apply sort + airline filter together
  const applyFilters = (
    base: Flight[],
    order: SortOrder,
    airline: string | null
  ) => {
    let result = [...base];
    if (airline) {
      result = result.filter(
        (f) => (f.airline ?? f.flightNumber.slice(0, 2)) === airline
      );
    }
    if (order === "asc") result.sort((a, b) => a.price - b.price);
    if (order === "desc") result.sort((a, b) => b.price - a.price);
    return result;
  };

  const handlePriceSort = () => {
    const next: SortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(next);
    setDisplayedFlights(applyFilters(flights, next, selectedAirline));
  };

  const handleAirlineSelect = (airline: string | null) => {
    setSelectedAirline(airline);
    setAirlineDropdownOpen(false);
    setDisplayedFlights(applyFilters(flights, sortOrder, airline));
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white tracking-tight">
              ✈ SkyBook
            </span>
            <span className="text-slate-500 text-sm">Flight Search</span>
          </div>
  
          <a href="/my-bookings" className="text-sm text-slate-300 hover:text-white border border-slate-600 px-4 py-2 rounded-xl hover:border-slate-400 transition">
            My Bookings
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Your Flights
          </h1>
          <p className="text-slate-400 mb-8">Select destination and seats.</p>
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
            <p className="text-sm mt-1">Try again</p>
          </div>
        )}

        {!loading && flights.length > 0 && (
          <div>
            {/* Header row: count + filters */}
            <div className="flex items-center justify-between mb-4 gap-3">
              <p className="text-slate-400 text-sm">
                <span className="text-white font-medium">
                  {displayedFlights.length}
                </span>{" "}
                of{" "}
                <span className="text-white font-medium">{flights.length}</span>{" "}
                flights
              </p>

              <div className="flex items-center gap-2">
                {/* Airline Filter Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setAirlineDropdownOpen((v) => !v)}
                    className={`flex items-center gap-2 border text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
                      selectedAirline
                        ? "bg-blue-700 border-blue-500 text-white"
                        : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200"
                    }`}>
                    <span>✈ {selectedAirline ?? "Airline"}</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${
                        airlineDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {airlineDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-50 overflow-hidden">
                      <button
                        onClick={() => handleAirlineSelect(null)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                          selectedAirline === null
                            ? "bg-blue-700 text-white"
                            : "text-slate-300 hover:bg-slate-700"
                        }`}>
                        <span>🌐</span>
                        <span>All Airlines</span>
                      </button>

                      <div className="border-t border-slate-700" />

                      {airlines.map((airline) => (
                        <button
                          key={airline}
                          onClick={() => handleAirlineSelect(airline)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                            selectedAirline === airline
                              ? "bg-blue-700 text-white"
                              : "text-slate-300 hover:bg-slate-700"
                          }`}>
                          <span>✈</span>
                          <span>{airline}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Sort Button */}
                <button
                  onClick={handlePriceSort}
                  className={`flex items-center gap-2 border text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
                    sortOrder
                      ? "bg-blue-700 border-blue-500 text-white"
                      : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200"
                  }`}>
                  <span>Price</span>
                  <span className="flex flex-col leading-[10px] text-[10px]">
                    <span
                      className={
                        sortOrder === "asc" ? "text-blue-200" : "text-slate-500"
                      }>
                      ▲
                    </span>
                    <span
                      className={
                        sortOrder === "desc"
                          ? "text-blue-200"
                          : "text-slate-500"
                      }>
                      ▼
                    </span>
                  </span>
                  <span className="text-xs opacity-80">
                    {sortOrder === "asc"
                      ? "Low → High"
                      : sortOrder === "desc"
                      ? "High → Low"
                      : "Sort"}
                  </span>
                </button>
              </div>
            </div>

            {/* Active airline filter badge */}
            {selectedAirline && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-slate-400">Filtering:</span>
                <span className="flex items-center gap-1.5 text-xs bg-blue-950 text-blue-300 border border-blue-700 px-2.5 py-1 rounded-full">
                  ✈ {selectedAirline}
                  <button
                    onClick={() => handleAirlineSelect(null)}
                    className="ml-1 hover:text-white transition-colors font-bold">
                    ×
                  </button>
                </span>
              </div>
            )}

            {/* No results after filter */}
            {displayedFlights.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-slate-300 font-medium">
                  No flights for {selectedAirline}
                </p>
                <button
                  onClick={() => handleAirlineSelect(null)}
                  className="mt-3 text-xs text-blue-400 hover:underline">
                  Clear filter
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {displayedFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
