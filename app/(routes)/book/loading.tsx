export default function Loading() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-foreground/60 animate-pulse">
        <div className="w-10 h-10 border border-foreground/20 border-t-accent rounded-full animate-spin" />
        <p className="text-sm tracking-widest uppercase">Loading booking details...</p>
      </div>
    </main>
  );
}
