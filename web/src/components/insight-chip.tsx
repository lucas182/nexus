import { Sparkles } from "lucide-react";

export function InsightChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-[5px] bg-accent-soft/60 px-2.5 py-1.5 text-[11px] text-accent leading-relaxed">
      <Sparkles size={11} className="mt-0.5 flex-shrink-0" strokeWidth={1.5} />
      <span>{children}</span>
    </div>
  );
}
