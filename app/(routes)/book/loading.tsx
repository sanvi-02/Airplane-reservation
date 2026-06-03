export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4" />
      <p className="text-slate-400 font-medium">Loading booking details...</p>
    </main>
  );
}
