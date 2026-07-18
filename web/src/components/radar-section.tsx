export function RadarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border-light bg-surface p-5">
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-text-tertiary">
        {title}
      </h2>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
