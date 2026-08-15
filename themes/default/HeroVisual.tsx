export function HeroVisual() {
  return (
    <div className="relative mx-auto h-[360px] w-full max-w-md md:h-[420px]">
      <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,rgba(167,139,250,0.35),transparent_65%)]" />

      <div className="animate-float absolute left-1/2 top-8 z-20 h-[280px] w-[150px] -translate-x-1/2 overflow-hidden rounded-[1.6rem] border-[6px] border-[#1f1638] bg-white shadow-[0_30px_60px_-20px_rgba(91,33,182,0.55)] md:h-[320px] md:w-[170px]">
        <div className="h-full bg-gradient-to-b from-[#7c3aed] via-[#6d28d9] to-[#4c1d95] p-3 text-white">
          <div className="rounded-xl bg-white/15 p-2 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Top pick</p>
            <p className="mt-1 text-sm font-bold">CasinoRank</p>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-16 rounded-xl bg-white/10" />
            <div className="h-10 rounded-xl bg-white/10" />
            <div className="h-10 rounded-xl bg-[var(--accent)]/90" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="h-14 rounded-lg bg-white/10" />
            <div className="h-14 rounded-lg bg-white/10" />
          </div>
        </div>
      </div>

      <div className="animate-float-delay absolute left-2 top-16 z-10 flex h-20 w-14 -rotate-12 items-center justify-center rounded-xl bg-white shadow-xl md:left-0">
        <span className="font-display text-2xl font-black text-[var(--brand)]">A♠</span>
      </div>
      <div className="animate-float absolute bottom-16 left-6 z-10 flex h-20 w-14 rotate-6 items-center justify-center rounded-xl bg-white shadow-xl md:left-4">
        <span className="font-display text-2xl font-black text-[#e11d48]">K♥</span>
      </div>

      <div className="animate-float absolute right-0 top-20 z-30 flex h-28 w-24 flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[#8b5cf6] to-[#5b21b6] text-white shadow-2xl md:right-2">
        <span className="text-xs font-semibold opacity-80">SLOTS</span>
        <span className="mt-1 font-display text-2xl font-black tracking-tight text-[var(--accent)]">
          777
        </span>
      </div>

      <div className="animate-float-delay absolute bottom-10 right-4 z-20 h-14 w-14 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#f59e0b] shadow-xl md:right-8" />
      <div className="animate-float absolute bottom-20 right-16 z-10 h-10 w-10 rounded-full bg-gradient-to-br from-[#a78bfa] to-[var(--brand)] shadow-lg" />
    </div>
  );
}
