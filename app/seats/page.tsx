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

export default function SeatsPage() {
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
        if (!res.ok) throw new Error("Seats load nahi ho sake");
        const data = await res.json();
        setFlight(data.flight);
        setSeats(data.seats);
      } catch (err) {
        setError("Seats load karne mein problem hui");
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
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
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
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (error || !flight) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <p className="text-4xl mb-3">✈</p>
          <p className="text-red-400">{error || "Flight nahi mili"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-400 hover:underline text-sm">
            ← Go Back
          </button>
        </div>
      </main>
    );
  }

  const availableCount = seats.filter((s) => !s.isBooked).length;

  return (
    <main className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white transition-colors">
            ←
          </button>
          <span className="text-xl font-bold text-white">✈ SkyBook</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Flight Info */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">
              {flight.flightNumber}
            </span>
            <span className="text-slate-400 text-sm">
              {formatDate(flight.departureTime)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-2xl font-bold text-white">
                {formatTime(flight.departureTime)}
              </p>
              <p className="text-slate-400 text-sm">{flight.origin}</p>
            </div>
            <div className="flex-1 flex items-center gap-1">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-slate-500 text-xs">✈</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {formatTime(flight.arrivalTime)}
              </p>
              <p className="text-slate-400 text-sm">{flight.destination}</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-700 border border-slate-600" />
            <span className="text-slate-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-950 border border-red-800" />
            <span className="text-slate-400">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 border border-blue-500" />
            <span className="text-slate-400">Selected</span>
          </div>
          <span className="text-slate-500 ml-auto">
            {availableCount} seats available
          </span>
        </div>

        {/* Seat Grid */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-7 gap-2 mb-3 px-1">
            <div />
            {["A", "B", "C", "D", "E", "F"].map((col) => (
              <div
                key={col}
                className="text-center text-xs text-slate-500 font-medium">
                {col}
              </div>
            ))}
          </div>
          {Array.from({ length: 5 }, (_, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-7 gap-2 mb-2">
              <div className="flex items-center justify-center text-xs text-slate-600">
                {rowIdx + 1}
              </div>
              {seats.slice(rowIdx * 6, rowIdx * 6 + 6).map((seat) => {
                const isSelected = selectedSeats.some((s) => s.id === seat.id);
                return (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isBooked}
                    title={seat.seatNumber}
                    className={`h-9 rounded text-xs font-medium transition-all ${
                      seat.isBooked
                        ? "bg-red-950 border border-red-900 text-red-700 cursor-not-allowed"
                        : isSelected
                        ? "bg-blue-600 border border-blue-400 text-white scale-105"
                        : "bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700 cursor-pointer"
                    }`}>
                    {seat.seatNumber}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Book Now */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
          {selectedSeats.length > 0 ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">
                  {selectedSeats.length} seat
                  {selectedSeats.length > 1 ? "s" : ""} selected
                </p>
                <p className="text-white font-bold text-xl">
                  {selectedSeats.map((s) => s.seatNumber).join(", ")}
                </p>
                <p className="text-slate-400 text-sm mt-0.5">
                  ₹
                  {(flight.price * selectedSeats.length).toLocaleString(
                    "en-IN"
                  )}{" "}
                  total
                </p>
              </div>
              <button
                onClick={() =>
                  router.push(
                    `/booking?flightId=${flightId}&seatIds=${selectedSeats
                      .map((s) => s.id)
                      .join(",")}`
                  )
                }
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Book Now →
              </button>
            </div>
          ) : (
            <p className="text-slate-500 text-sm text-center">
             Select seats from above
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
