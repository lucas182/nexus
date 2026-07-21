export function WorkspaceActivityBadge({ count, days = 7 }: { count: number; days?: number }) {
  if (count === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-hover px-1.5 py-0.5 text-[10px] text-text-tertiary">
      {count} {count === 1 ? "acesso" : "acessos"} em {days}d
    </span>
  );
}
