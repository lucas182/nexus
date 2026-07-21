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
    <div className="rounded-[7px] border border-border-light bg-surface px-3.5 py-3">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] font-medium uppercase tracking-[0.05em] text-text-quaternary">
          Hoje
        </span>
        {consecutiveActiveDays > 1 && (
          <span className="text-[10px] text-text-quaternary">· {consecutiveActiveDays}d consecutivos</span>
        )}
      </div>
      {hasActivity ? (
        <p className="text-sm text-text-primary leading-relaxed">
          {timeline.captures} {timeline.captures === 1 ? "captura" : "capturas"}
          {timeline.decisions > 0 && (
            <> · {timeline.decisions} {timeline.decisions === 1 ? "decisão" : "decisões"}</>
          )}
          {timeline.knowledgeConsolidated > 0 && (
            <> · {timeline.knowledgeConsolidated} consolidated</>
          )}
        </p>
      ) : (
        <p className="text-sm text-text-quaternary">Nenhuma atividade hoje ainda.</p>
      )}
      {gap && (
        <p className="mt-0.5 text-[11px] text-text-quaternary">Maior intervalo: {gap}</p>
      )}
    </div>
  );
}
