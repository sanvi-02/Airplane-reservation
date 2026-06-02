"use client";

import { useState } from "react";

interface Flight {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
}

interface Seat {
  seatNumber: string;
  flight: Flight;
}

interface Booking {
  id: string;
  referenceCode: string;
  passengerName: string;
  passengerEmail: string;
  createdAt: string;
  seat: Seat;
}

export default function BookingLookup() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function handleLookup() {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError("");
    setSearched(false);

    try {
      const res = await fetch(
        `/api/bookings/lookup?email=${encodeURIComponent(email)}`,
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Lookup failed");
        return;
      }
      setBookings(data);
      setSearched(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId: string) {
    setCancellingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("Cancellation failed. Try again.");
        return;
      }
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      setSuccessMessage("Booking cancelled successfully."); // ← add this
    } catch {
      setError("Something went wrong.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Email search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLookup}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition w-full sm:w-auto"
        >
          {loading ? "Searching..." : "Find Bookings"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {successMessage && (
        <p className="text-green-600 text-sm mb-4 text-center">
          {successMessage}
        </p>
      )}

      {/* Results */}
      {searched && bookings.length === 0 && (
        <p className="text-center text-gray-500 text-sm">
          No bookings found for this email.
        </p>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            {/* Reference + cancel */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Reference
                </p>
                <p className="font-mono font-bold text-blue-600 text-lg">
                  {booking.referenceCode}
                </p>
              </div>
              <button
                onClick={() => handleCancel(booking.id)}
                disabled={cancellingId === booking.id}
                className="text-sm text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 disabled:opacity-50 transition"
              >
                {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
              </button>
            </div>

            {/* Booking details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Passenger</span>
                <span className="font-medium text-gray-800">
                  {booking.passengerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Flight</span>
                <span className="font-medium text-gray-800">
                  {booking.seat.flight.flightNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Route</span>
                <span className="font-medium text-gray-800">
                  {booking.seat.flight.origin} →{" "}
                  {booking.seat.flight.destination}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Seat</span>
                <span className="font-medium text-gray-800">
                  {booking.seat.seatNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Booked on</span>
                <span className="font-medium text-gray-800">
                  {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
