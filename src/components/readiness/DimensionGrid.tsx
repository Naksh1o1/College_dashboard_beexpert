import * as Icons from "lucide-react";

export const dimensions = [
  { icon: "ClipboardCheck", title: "Assessment Performance", description: "Consistency and clearance in technical/aptitude tests.", analyzedVia: "Clearance rate" },
  { icon: "MessagesSquare", title: "Interview Performance", description: "Success rate in mock and real interview scenarios.", analyzedVia: "Conversion rate" },
  { icon: "FileUser", title: "Profile / Resume Readiness", description: "Completeness of academic and portfolio data.", analyzedVia: "Profile strength" },
  { icon: "Send", title: "Application Activity", description: "Volume and pacing of active job applications.", analyzedVia: "Application count" },
  { icon: "Target", title: "Skill / Job Alignment", description: "Alignment of demonstrated skills to role requirements.", analyzedVia: "Match percentage" },
  { icon: "Route", title: "Placement Progress", description: "Progression through the placement funnel.", analyzedVia: "Current stage" },
];

export function DimensionGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {dimensions.map((d, i) => {
        const Icon = (Icons as any)[d.icon] ?? Icons.Circle;
        return (
          <div key={d.title} className="group relative flex h-full flex-col overflow-hidden rounded-[14px] border border-border/70 bg-card p-4 pl-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[var(--shadow-card-hover)]">
            <span className="absolute inset-y-4 left-0 w-[2px] rounded-full bg-primary/15 group-hover:bg-primary/45" />
            <div className="flex items-start justify-between">
              <span className="flex size-8 items-center justify-center rounded-[10px] border border-primary/15 bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground/60">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-3.5 text-[13.5px] font-semibold">{d.title}</h3>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{d.description}</p>
            <p className="mt-auto border-t border-border/60 pt-2.5 mt-3.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
              Analyzed via <span className="text-foreground/80">{d.analyzedVia}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}