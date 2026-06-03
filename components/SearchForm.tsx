"use client";

import { useState } from "react";
import { SearchParams } from "@/app/search/page";

type Props = {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
};

const CITIES = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Goa",
];

export default function SearchForm({ onSearch, loading }: Props) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !date) return;
    if (origin === destination) {
      alert("Origin and destination cannot be the same!");
      return;
    }
    onSearch({ origin, destination, date, ...(returnDate && { returnDate }) });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-foreground/[0.02] border border-white/5 p-8 relative">
      
      {/* Top right decorative detail */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent/40" />
      {/* Bottom left decorative detail */}
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-accent/40" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="relative">
          <label className="block text-[10px] text-foreground/40 mb-2 uppercase tracking-[0.2em]">
            Origin
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
            className="w-full bg-transparent border-0 border-b border-white/20 text-foreground py-2 text-sm focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer">
            <option value="" className="bg-[#12100E] text-foreground/50">Select City</option>
            {CITIES.map((city) => (
              <option key={city} value={city} disabled={city === destination} className="bg-[#12100E]">
                {city}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-0 top-8 text-accent/50 text-xs">▼</div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const temp = origin;
              setOrigin(destination);
              setDestination(temp);
            }}
            className="hidden md:flex absolute -left-6 top-8 z-10 w-6 h-6 items-center justify-center text-accent/50 hover:text-accent hover:rotate-180 transition-all duration-500">
            ⇄
          </button>
          <label className="block text-[10px] text-foreground/40 mb-2 uppercase tracking-[0.2em]">
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className="w-full bg-transparent border-0 border-b border-white/20 text-foreground py-2 text-sm focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer">
            <option value="" className="bg-[#12100E] text-foreground/50">Select City</option>
            {CITIES.map((city) => (
              <option key={city} value={city} disabled={city === origin} className="bg-[#12100E]">
                {city}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-0 top-8 text-accent/50 text-xs">▼</div>
        </div>

        <div>
          <label className="block text-[10px] text-foreground/40 mb-2 uppercase tracking-[0.2em]">
            Departure Date
          </label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-transparent border-0 border-b border-white/20 text-foreground py-2 text-sm focus:outline-none focus:border-accent transition-colors cursor-pointer [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="block text-[10px] text-foreground/40 mb-2 uppercase tracking-[0.2em]">
            Return Date <span className="opacity-50">(Opt)</span>
          </label>
          <input
            type="date"
            value={returnDate}
            min={date || today}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-white/20 text-foreground py-2 text-sm focus:outline-none focus:border-accent transition-colors cursor-pointer [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={loading || !origin || !destination || !date}
          className="shimmer-bg inline-flex h-12 items-center justify-center rounded-full px-8 text-xs font-bold tracking-widest uppercase text-[#12100E] transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(201,151,74,0.3)] disabled:opacity-50 disabled:pointer-events-none disabled:grayscale">
          {loading ? "Searching..." : "Search Flights"}
        </button>
      </div>
    </form>
  );
}
