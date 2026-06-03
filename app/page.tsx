import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("isLoggedIn")?.value === "true";

  if (!isLoggedIn) {
    redirect("/signup");
  }
  const actions = [
    {
      title: "Search",
      copy: "Find available flights by route and date.",
      href: "/search",
      cta: "Search flights",
      delay: "animate-[fade-in-up_0.8s_ease-out_0.2s_both]",
      size: "col-span-1 md:col-span-2 md:row-span-2 min-h-[300px]",
    },
    {
      title: "Seats",
      copy: "Choose a seat after selecting a flight.",
      href: "/search",
      cta: "Start with search",
      delay: "animate-[fade-in-up_0.8s_ease-out_0.4s_both]",
      size: "col-span-1 min-h-[200px] mt-8 md:mt-0",
    },
    {
      title: "Records",
      copy: "Use a reference code to view or cancel a booking.",
      href: "/lookup",
      cta: "Find booking",
      delay: "animate-[fade-in-up_0.8s_ease-out_0.6s_both]",
      size: "col-span-1 min-h-[200px] mt-8 md:mt-0",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground selection:bg-accent/30">
      {/* Decorative large SVG arc in the background right */}
      <div className="absolute right-[-10%] top-[-10%] z-0 h-[120%] w-3/4 animate-slow-pan opacity-10 pointer-events-none">
        <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 100 1000 Q 500 100 1000 500"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-white"
          />
          <circle cx="100" cy="1000" r="4" fill="currentColor" />
          <circle cx="1000" cy="500" r="4" fill="currentColor" />
        </svg>
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-24 sm:pt-32 pb-20">
        {/* Asymmetric Hero layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Replaced uppercase label with thin rule & muted label */}
            <div className="mb-8 flex items-center gap-4 animate-[fade-in-up_0.8s_ease-out_both]">
              <div className="h-px w-12 bg-accent/50"></div>
              {/* <span className="text-sm font-medium tracking-wide text-foreground/60">
                Premium Reservations
              </span> */}
            </div>

            <h1 className="font-serif text-5xl font-light tracking-tight sm:text-7xl leading-[1.1]">
              <span className="inline-block animate-slide-up-word [animation-delay:0.1s]">Book</span>{" "}
              <span className="inline-block animate-slide-up-word [animation-delay:0.15s]">flights</span>{" "}
              <span className="inline-block animate-slide-up-word [animation-delay:0.2s]">without</span>{" "}
              <span className="inline-block animate-slide-up-word [animation-delay:0.25s]">any</span>{" "}
              <span className="inline-block animate-slide-up-word [animation-delay:0.3s] font-medium italic text-accent pr-4">
                noise.
              </span>
            </h1>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-foreground/60 animate-[fade-in-up_0.8s_ease-out_0.4s_both]">
              Search by route, select a seat, confirm passenger details, and use
              your reference code to manage the booking later.
            </p>

            {/* Micro-detail: Boarding pass line */}
            <div className="mt-10 flex items-center gap-2 opacity-50 animate-[fade-in-up_0.8s_ease-out_0.5s_both]">
              <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              <div className="h-px w-32 border-b border-dashed border-accent/60"></div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent rotate-45">
                <path d="M17.8 19.2L16 11l4-4c1.1-1.1 1.1-2.9 0-4s-2.9-1.1-4 0l-4 4-8.2-1.8-1.8 1.8 7 3.5-3.5 3.5-2.5-1-1.5 1.5 3.5 3.5 3.5 3.5 1.5-1.5-1-2.5 3.5-3.5 3.5 7 1.8-1.8z"></path>
              </svg>
              <div className="h-px w-8 border-b border-dashed border-accent/60"></div>
              <div className="w-1.5 h-1.5 rounded-full border border-accent"></div>
            </div>

            <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center animate-[fade-in-up_0.8s_ease-out_0.6s_both]">
              <Link
                href="/search"
                className="shimmer-bg inline-flex h-14 items-center justify-center rounded-full px-8 text-sm font-medium tracking-wide text-[#12100e] transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(201,151,74,0.3)]"
              >
                Search flights
              </Link>
              <Link
                href="/lookup"
                className="btn-secondary inline-flex h-14 items-center justify-center rounded-none border border-foreground/20 px-8 text-sm font-medium tracking-wide text-foreground"
              >
                My booking
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            {/* Subtle radial gradient/vignette for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_70%)] z-10 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Cards Section: Masonry-style / staggered */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-0">
          {actions.map((action, idx) => (
            <Link
              key={action.title}
              href={action.href}
              className={`group flex flex-col justify-between p-10 transition-all duration-500 hover:bg-foreground/[0.02] ${action.size} ${action.delay}`}
            >
              <div>
                <h2 className="font-serif text-3xl font-light">{action.title}</h2>
                <p className="mt-4 max-w-sm text-base leading-relaxed text-foreground/50 transition-colors group-hover:text-foreground/70">
                  {action.copy}
                </p>
              </div>
              <div className="mt-12 flex items-center gap-3 text-sm tracking-widest uppercase text-accent transition-transform group-hover:translate-x-2">
                <span>{action.cta}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="relative z-10 mx-auto max-w-7xl px-6 py-8 border-t border-white/5">
        <div className="flex justify-between items-center text-xs tracking-widest text-foreground/40 uppercase">


        </div>
      </footer>
    </main>
  );
}
