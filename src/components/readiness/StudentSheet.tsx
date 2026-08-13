import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { dimensions } from "./DimensionGrid";
import { cn } from "@/lib/utils";
import { InsightStudent } from "./AiInsights";

export function StudentSheet({ student, onOpenChange }: { student: InsightStudent | null; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog.Root open={!!student} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l bg-background p-6 shadow-2xl">
          <Dialog.Close className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted">
            <X className="size-4" />
          </Dialog.Close>
          {student && (
            <>
              <Dialog.Title className="text-lg font-semibold">{student.name}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                {student.department} · Placement readiness detail
              </Dialog.Description>
              <div className="mt-6 space-y-5 pb-8">
                <div className="rounded-xl border bg-muted/40 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Readiness score</p>
                  <p className={cn("mt-1 text-4xl font-semibold", student.score >= 80 ? "text-ready" : student.score >= 60 ? "text-developing" : "text-critical")}>
                    {student.score}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {student.score >= 80 ? "Ready" : student.score >= 60 ? "Developing" : "At Risk"}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI insight</h4>
                  <p className="mt-1.5 text-sm leading-relaxed">{student.insight}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recommended action</h4>
                  <p className="mt-1.5 text-sm leading-relaxed">{student.recommendation}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dimensions tracked</h4>
                  <ul className="mt-2 space-y-1.5">
                    {dimensions.map(d => (
                      <li key={d.title} className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-xs">
                        <span className="font-medium">{d.title}</span>
                        <span className="text-muted-foreground">{d.analyzedVia}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}