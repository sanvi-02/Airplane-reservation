import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950 px-6 py-4 sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-80">
          <span>✈ SkyBook</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/search" className="transition-colors hover:text-white">
            Search Flights
          </Link>
          <Link href="/lookup" className="transition-colors hover:text-white">
            My Booking
          </Link>
        </nav>
      </div>
    </header>
  );
}
