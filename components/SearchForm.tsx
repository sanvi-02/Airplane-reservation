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

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !date) return;
    if (origin === destination) {
      alert("Origin aur destination alag hone chahiye!");
      return;
    }
    onSearch({ origin, destination, date });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
            From
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
            className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select City </option>
            {CITIES.map((city) => (
              <option key={city} value={city} disabled={city === destination}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const temp = origin;
              setOrigin(destination);
              setDestination(temp);
            }}
            className="hidden md:flex absolute -left-5 top-7 z-10 w-8 h-8 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-full items-center justify-center text-slate-300 transition-colors">
            ⇄
          </button>
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
            To
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select City </option>
            {CITIES.map((city) => (
              <option key={city} value={city} disabled={city === origin}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
            Date
          </label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !origin || !destination || !date}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg px-6 py-3 transition-colors text-sm">
        {loading ? "Dhundh raha hai..." : "Flights Dhundho ✈"}
      </button>
    </form>
  );
}
