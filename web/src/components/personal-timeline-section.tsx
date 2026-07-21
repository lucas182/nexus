import type { DailyTimeline } from "@/lib/behavior/metrics";

function formatGap(minutes: number | null): string | null {
  if (minutes === null) return null;
  if (minutes < 60) return `${Math.round(minutes)}min`;
  const hours = minutes / 60;
  return `${hours.toFixed(hours >= 10 ? 0 : 1)}h`;
}

export function PersonalTimelineSection({
  timeline,
  consecutiveActiveDays,
}: {
  timeline: DailyTimeline;
  consecutiveActiveDays: number;
}) {
  const gap = formatGap(timeline.longestGapMinutes);
  const hasActivity = timeline.captures + timeline.decisions + timeline.knowledgeConsolidated > 0;

  return (
    <div className="rounded-lg border border-border-light bg-surface p-3.5">
      <h2 className="text-[10px] font-medium uppercase tracking-widest text-text-tertiary">
        Timeline Pessoal — Hoje
      </h2>
      {hasActivity ? (
        <p className="mt-1.5 text-sm text-text-primary">
          {timeline.captures} {timeline.captures === 1 ? "captura" : "capturas"} ·{" "}
          {timeline.decisions} {timeline.decisions === 1 ? "decisão" : "decisões"} ·{" "}
          {timeline.knowledgeConsolidated}{" "}
          {timeline.knowledgeConsolidated === 1 ? "Knowledge" : "Knowledges"}
        </p>
      ) : (
        <p className="mt-1.5 text-sm text-text-tertiary">Nenhuma atividade registrada hoje ainda.</p>
      )}
      {(gap || consecutiveActiveDays > 1) && (
        <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-text-tertiary">
          {gap && <span>Maior intervalo: {gap}</span>}
          {consecutiveActiveDays > 1 && <span>{consecutiveActiveDays} dias consecutivos</span>}
        </div>
      )}
    </div>
  );
}
