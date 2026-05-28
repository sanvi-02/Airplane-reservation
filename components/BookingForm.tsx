"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  flightId: string;
  seatId: string;
  seatNumber: string;
  flightNumber: string;
  origin: string;
  destination: string;
  price: number;
}

export default function BookingForm({
  flightId,
  seatId,
  seatNumber,
  flightNumber,
  origin,
  destination,
  price,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name || !email) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId,
          passengerName: name,
          passengerEmail: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Booking failed");
        return;
      }

      // redirect to confirm page with booking details in URL
      router.push(
        `/confirm?ref=${data.referenceCode}&name=${encodeURIComponent(name)}&flight=${flightNumber}&seat=${seatNumber}&from=${origin}&to=${destination}&price=${price}`,
      );
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      {/* Flight summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-gray-500">Flight</p>
        <p className="font-semibold text-lg">
          {flightNumber} · {origin} → {destination}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Seat <span className="font-medium text-gray-800">{seatNumber}</span>
        </p>
        <p className="text-sm text-gray-500">
          Price <span className="font-medium text-gray-800">₹{price}</span>
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
