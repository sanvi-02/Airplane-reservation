import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("isLoggedIn")?.value === "true";

  return (
    <header className="sticky top-0 z-50 border-t border-t-white/10 bg-background/60 px-6 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="SkyBook Home"
        >
          {/* Custom minimal SVG glyph */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent transition-transform duration-500 group-hover:rotate-45"
          >
            <path d="M12 2L12 22" />
            <path d="M2 12L22 12" />
            <path d="M12 2C17.5228 2 22 6.47715 22 12" />
          </svg>
          <span className="font-serif text-xl tracking-wide text-foreground">SkyBook</span>
        </Link>
        <nav className="flex items-center gap-8 text-sm uppercase tracking-widest text-foreground/80">
          {isLoggedIn ? (
            <>
              <Link href="/search" className="link-underline pb-1 transition-colors hover:text-accent">
                Search
              </Link>
              <Link href="/lookup" className="link-underline pb-1 transition-colors hover:text-accent">
                Records
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className="link-underline pb-1 transition-colors hover:text-accent">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
