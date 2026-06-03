import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden selection:bg-blue-500/30">
      {/* Ambient background glows */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <section className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium tracking-wide mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            FLIGHT RESERVATION SYSTEM
          </div>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Search flights, choose a seat, and confirm.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            SkyBook is a focused flight-booking application built with Next.js,
            Prisma, and PostgreSQL. It supports route search, live seat
            availability, and cancellation-ready records.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/search"
              className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              <span>Find Flights</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#features"
              className="inline-flex h-14 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50 backdrop-blur-sm px-8 text-sm font-semibold text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-800 hover:text-white"
            >
              View Features
            </a>
          </div>
        </div>

        <div className="relative z-10 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl shadow-black/50 transition-transform hover:-translate-y-2 duration-500">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-50 blur pointer-events-none" />
          <div className="relative mb-6 flex items-center justify-between border-b border-slate-800/80 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Today
              </p>
              <p className="text-lg font-semibold">Delhi to Mumbai</p>
            </div>
            <span className="rounded bg-emerald-950 px-2 py-1 text-xs font-medium text-emerald-300">
              Seats open
            </span>
          </div>
          {[
            ["SK101", "06:00", "08:10", "₹4,500"],
            ["SK102", "14:00", "16:05", "₹3,800"],
            ["SK301", "19:20", "21:40", "₹5,100"],
          ].map(([flight, depart, arrive, price]) => (
            <div
              key={flight}
              className="grid grid-cols-[70px_1fr_80px] items-center gap-3 border-b border-slate-800 py-4 last:border-0"
            >
              <span className="font-mono text-xs text-slate-400">{flight}</span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold tabular-nums">{depart}</span>
                <span className="h-px flex-1 bg-slate-700" />
                <span className="text-lg font-bold tabular-nums">{arrive}</span>
              </div>
              <span className="text-right text-sm font-semibold">{price}</span>
            </div>
          ))}
        </div>
      </section>

      <section
        id="features"
        className="border-t border-slate-800 bg-slate-900/40 px-6 py-10"
      >
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {[
            ["Search", "Filter by route and travel date."],
            ["Seats", "View availability before booking."],
            ["Records", "Generate references for later lookup."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-lg border border-slate-800 p-5">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
