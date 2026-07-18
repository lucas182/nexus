/** Sprint 2.5 — frequência de acesso a um Workspace, derivada do Behavior Engine. */
export function WorkspaceActivityBadge({ count, days = 7 }: { count: number; days?: number }) {
  if (count === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-hover px-2 py-0.5 text-xs text-text-tertiary">
      {count} {count === 1 ? "acesso" : "acessos"} nos últimos {days}d
    </span>
  );
}
