import { Sparkles } from "lucide-react";

export function InsightChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-accent-soft px-3 py-2 text-xs text-accent">
      <Sparkles size={14} className="mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}
