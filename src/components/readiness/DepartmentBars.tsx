export function DepartmentBars({ departments }: { departments: { name: string; score: number }[] }) {
  const sorted = [...departments].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const worst = sorted.at(-1);

  if (!best || !worst) return null;

  return (
    <div className="flex flex-col rounded-[14px] border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-[14px] font-semibold">Readiness by Department</h3>
        <div className="flex gap-2 text-[9.5px] uppercase tracking-wider font-medium text-muted-foreground">
          <span>Top <b className="text-foreground">{best.name}</b></span>
          <span className="opacity-50">·</span>
          <span>Lowest <b className="text-at-risk">{worst.name}</b></span>
        </div>
      </div>
      <ul className="mt-6 flex flex-1 flex-col gap-4">
        {sorted.map(d => {
          const isWorst = d.name === worst.name;
          return (
            <li key={d.name} className="group grid grid-cols-[84px_1fr_26px] items-center gap-3">
              <span className="truncate text-[12px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{d.name}</span>
              <span className="h-[3px] w-full overflow-hidden rounded-full bg-muted">
                <span 
                  className="block h-full rounded-full transition-all duration-500" 
                  style={{ width: `${d.score}%`, backgroundColor: isWorst ? "var(--at-risk)" : "var(--primary)" }} 
                />
              </span>
              <span className="text-right text-[11px] font-semibold tabular-nums">{d.score}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}