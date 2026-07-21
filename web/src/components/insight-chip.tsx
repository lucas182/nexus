import { Sparkles } from "lucide-react";

export function InsightChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-accent-soft/80 px-3 py-2 text-[11px] text-accent leading-relaxed">
      <Sparkles size={12} className="mt-0.5 flex-shrink-0" strokeWidth={1.5} />
      <span>{children}</span>
    </div>
  );
}
