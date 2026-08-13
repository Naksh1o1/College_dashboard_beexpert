import { Sparkles, ArrowRight, ClipboardCheck, MessagesSquare, Send, FileUser, Target, TriangleAlert, BadgeCheck, Activity, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Priority = "Critical" | "High Priority" | "Medium Priority" | "Low Priority";
export type InsightGroup = {
  id: string;
  name: string;
  students: number;
  priority: Priority;
  explanation: string;
};

const styles: Record<Priority, { dot: string; accent: string; badge: string; strong: boolean }> = {
  Critical: { dot: "bg-critical", accent: "bg-critical", badge: "text-critical", strong: true },
  "High Priority": { dot: "bg-at-risk", accent: "bg-at-risk", badge: "text-at-risk", strong: true },
  "Medium Priority": { dot: "bg-developing", accent: "bg-developing", badge: "text-developing", strong: false },
  "Low Priority": { dot: "bg-ready", accent: "bg-ready", badge: "text-ready", strong: false },
};

const icons: Record<string, LucideIcon> = {
  "assessment-gaps": ClipboardCheck,
  "interview-gaps": MessagesSquare,
  "application-gaps": Send,
  "profile-gaps": FileUser,
  "skill-gaps": Target,
  "at-risk": TriangleAlert,
  "placement-ready": BadgeCheck,
  "high-potential": Activity,
};

export function AiInsights({ insightGroups }: { insightGroups: InsightGroup[] }) {
  const total = insightGroups.reduce((a, g) => a + g.students, 0);

  return (
    <section className="overflow-hidden rounded-[16px] border border-primary/15 bg-accent/30 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold">AI Student Intelligence</h2>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">AI-detected patterns across the assessed student cohort.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:flex">
            Detection <ArrowRight className="size-3" /> Insight <ArrowRight className="size-3" /> Action
          </span>
          <span className="rounded-full border border-primary/20 bg-card px-3 py-1 text-[11px] font-semibold text-primary">
            {total} Active Insights
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
        {insightGroups.map((g, i) => {
          const st = styles[g.priority];
          const Icon = icons[g.id] ?? Sparkles;
          return (
            <div
              key={g.id}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-[13px] border border-border/70 p-4",
                i % 2 === 0 ? "bg-card" : "bg-card/70",
              )}
            >
              <span className={cn("absolute inset-x-0 top-0 h-[2px]", st.accent, st.strong ? "opacity-90" : "opacity-45")} />
              <div className="flex items-start justify-between">
                <span className="flex size-7 items-center justify-center rounded-[9px] border bg-muted/70 text-muted-foreground">
                  <Icon className="size-3.5" />
                </span>
                <span className={cn("mt-1 size-1.5 rounded-full", st.dot)} />
              </div>
              <h3 className="mt-3 text-[13.5px] font-semibold">{g.name}</h3>
              <p className="mt-1 text-[11.5px] text-muted-foreground">
                <b className="text-foreground">{g.students}</b> {g.students === 1 ? "student affected" : "students affected"}
              </p>
              <span className={cn("mt-2 w-fit text-[9.5px] font-semibold uppercase tracking-[0.14em]", st.badge)}>{g.priority}</span>
              <p className="mt-2.5 flex-1 text-[11.5px] leading-relaxed text-muted-foreground">{g.explanation}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}