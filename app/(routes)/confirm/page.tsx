"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmContent() {
  const params = useSearchParams();

  const ref = params.get("ref");
  const name = params.get("name");
  const flight = params.get("flight");
  const seat = params.get("seat");
  const from = params.get("from");
  const to = params.get("to");
  const price = params.get("price");

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-3xl">✓</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Booking Confirmed!
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Your seat has been reserved successfully.
        </p>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Booking Reference
          </p>
          <p className="text-2xl font-mono font-bold text-blue-600">{ref}</p>
        </div>

        <div className="text-left space-y-3 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Passenger</span>
            <span className="font-medium text-gray-800">{name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Flight</span>
            <span className="font-medium text-gray-800">{flight}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Route</span>
            <span className="font-medium text-gray-800">
              {from} to {to}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Seat</span>
            <span className="font-medium text-gray-800">{seat}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Price</span>
            <span className="font-medium text-gray-800">Rs. {price}</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Fixed the anchor tag below */}
          <a
            href="/my-bookings"
            className="block w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
          >
            View My Bookings
          </a>

          {/* Fixed the anchor tag below */}
          <a
            href="/"
            className="block w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
          >
            Back to Search
          </a>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center p-8">Loading booking details...</div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
