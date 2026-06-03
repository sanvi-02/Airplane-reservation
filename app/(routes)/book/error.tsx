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
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center max-w-md w-full">
        <p className="text-5xl mb-4">⚠️</p>
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong!</h2>
        <p className="text-slate-400 text-sm mb-6">
          We couldn't load the booking page. The server might be busy or unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
          >
            Try Again
          </button>
          <a
            href="/search"
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
          >
            Back to Search
          </a>
        </div>
      </div>
    </main>
  );
}
