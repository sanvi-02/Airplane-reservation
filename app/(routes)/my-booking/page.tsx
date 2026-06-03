import BookingLookup from "@/components/BookingLookup";

export default function MyBookingsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
        My Bookings
      </h1>
      <p className="text-center text-sm text-gray-500 mb-8">
        Enter your email to view and manage your bookings
      </p>
      <BookingLookup />
    </main>
  );
}
