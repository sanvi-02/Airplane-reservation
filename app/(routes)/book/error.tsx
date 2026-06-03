"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="bg-foreground/[0.02] border border-white/10 p-10 text-center max-w-md w-full animate-[fade-in-up_0.4s_ease-out_both]">
        <p className="text-4xl mb-4 font-light text-red-400">!</p>
        <h2 className="text-2xl font-serif text-foreground mb-4">Something went wrong!</h2>
        <p className="text-foreground/50 text-sm mb-10 tracking-widest uppercase">
          We could not load the booking page. The server might be busy or unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => reset()}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground text-xs font-bold tracking-widest uppercase py-4 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/search"
            className="flex-1 btn-secondary text-xs font-bold tracking-widest uppercase py-4 transition-colors flex items-center justify-center"
          >
            Back to Search
          </a>
        </div>
      </div>
    </main>
  );
}
