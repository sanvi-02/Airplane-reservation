import BookingLookup from "@/components/BookingLookup";

export default function MyBookingsPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/search" className="text-2xl font-bold text-white tracking-tight">
              ✈ SkyBook
            </a>
            <span className="text-slate-500 text-sm">My Bookings</span>
          </div>
          
          <a href="/search"
            className="text-sm text-slate-300 hover:text-white border border-slate-600 px-4 py-2 rounded-xl hover:border-slate-400 transition"
          >
            Search Flights
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
        <p className="text-slate-400 mb-8">
          Enter your email to view and manage your bookings
        </p>
        <BookingLookup />
      </div>
    </main>
  );
}