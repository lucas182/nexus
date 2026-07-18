// Rendered from a "use client" component tree (ThreadDetailsPanel) — kept free of any
// server-only import (e.g. src/lib/data/insights.ts pulls in next/headers transitively).
function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (24 * 60 * 60 * 1000));
}

/** Sprint 2.5 — dias desde a última Observation (visita, evento, consolidação) na Thread. */
export function ThreadActivityMeter({ lastObservedAt }: { lastObservedAt: string | null }) {
  if (!lastObservedAt) {
    return <span className="text-xs text-text-tertiary">Sem atividade registrada</span>;
  }

  const days = daysSince(lastObservedAt);
  if (days === 0) {
    return <span className="text-xs text-text-tertiary">Ativa hoje</span>;
  }
  return <span className="text-xs text-text-tertiary">Última atividade há {days}d</span>;
}
