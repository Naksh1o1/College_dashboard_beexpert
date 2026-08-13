import { cn } from "@/lib/utils";
import { Users, Gauge, CircleCheck, TrendingUp, TriangleAlert } from "lucide-react";

export function KpiRow({ kpis }: { kpis: { assessed: number; averageScore: number; ready: number; developing: number; atRisk: number } }) {
  const items = [
    { label: "Students Assessed", value: kpis.assessed, hint: "Appeared for the readiness assessment", icon: Users, prominent: true },
    { label: "Average Readiness Score", value: kpis.averageScore, hint: "Cohort average out of 100", icon: Gauge, prominent: true },
    { label: "Ready Students", value: kpis.ready, hint: "Score ≥ 80", icon: CircleCheck, accent: "text-ready", bar: "bg-ready" },
    { label: "Developing Students", value: kpis.developing, hint: "Score 60–79", icon: TrendingUp, accent: "text-developing", bar: "bg-developing" },
    { label: "At Risk Students", value: kpis.atRisk, hint: "Score < 60", icon: TriangleAlert, accent: "text-at-risk", bar: "bg-at-risk" },
  ];
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map(item => (
        <div key={item.label} className={cn("relative flex flex-col overflow-hidden rounded-[14px] border border-border/70 bg-card px-4 pb-3.5 pt-4 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-card-hover)]", item.prominent && "border-primary/20 bg-accent/40")}>
          {item.bar && <span className={cn("absolute inset-x-0 top-0 h-[2px] opacity-80", item.bar)} />}
          <div className="flex items-start justify-between gap-3">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{item.label}</p>
            <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-[9px] border", item.prominent ? "border-primary/20 bg-primary/10 text-primary" : "border-border/70 bg-muted text-muted-foreground", item.accent)}>
              <item.icon className="size-3.5" />
            </span>
          </div>
          <p className={cn("mt-3 font-semibold tabular-nums tracking-tight", item.prominent ? "text-[34px]" : "text-[27px]")}>{item.value}</p>
          <p className="mt-auto pt-2.5 text-[11px] leading-4 text-muted-foreground">{item.hint}</p>
        </div>
      ))}
    </section>
  );
}