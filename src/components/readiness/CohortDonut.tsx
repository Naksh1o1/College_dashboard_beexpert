import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export type Band = "ready" | "developing" | "at-risk";

export function CohortDonut({ 
  kpis, 
  cohort 
}: { 
  kpis: { assessed: number; averageScore: number }; 
  cohort: { label: string; band: Band; count: number; percent: number }[] 
}) {
  const colors: Record<string, string> = { ready: "var(--ready)", developing: "var(--developing)", "at-risk": "var(--at-risk)" };
  return (
    <div className="flex flex-col rounded-[14px] border border-border/70 bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[14px] font-semibold">Cohort Readiness</h3>
        <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{kpis.assessed} assessed</span>
      </div>
      <div className="mt-6 flex flex-1 items-center justify-center gap-16">
        <div className="relative size-[160px] shrink-0">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={[{ v: 1 }]} dataKey="v" innerRadius={58} outerRadius={76} strokeWidth={0}><Cell fill="var(--muted)" /></Pie>
              <Pie data={cohort} dataKey="count" nameKey="label" innerRadius={58} outerRadius={76} paddingAngle={3} cornerRadius={3} strokeWidth={0} startAngle={90} endAngle={-270} isAnimationActive={false}>
                {cohort.map(s => <Cell key={s.band} fill={colors[s.band]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[36px] font-semibold">{kpis.averageScore}</span>
            <span className="mt-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Avg Readiness</span>
          </div>
        </div>
        <ul className="w-full max-w-[320px] space-y-2">
          {cohort.map(s => (
            <li key={s.band} className="flex items-center justify-between rounded-[10px] px-4 py-3 hover:bg-muted/60">
              <span className="flex items-center gap-3 text-[13px] font-medium"><span className="h-4 w-[3px] rounded-full" style={{ backgroundColor: colors[s.band] }} />{s.label}</span>
              <span className="flex items-baseline gap-2.5"><span className="text-[18px] font-semibold">{s.count}</span><span className="text-[11.5px] text-muted-foreground">{s.percent}%</span></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}