function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (24 * 60 * 60 * 1000));
}

export function ThreadActivityMeter({ lastObservedAt }: { lastObservedAt: string | null }) {
  if (!lastObservedAt) {
    return <span className="text-[11px] text-text-tertiary">Sem atividade registrada</span>;
  }

  const days = daysSince(lastObservedAt);
  if (days === 0) {
    return <span className="text-[11px] text-text-tertiary">Ativa hoje</span>;
  }
  return <span className="text-[11px] text-text-tertiary">Última atividade há {days}d</span>;
}
