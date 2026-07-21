export function RadarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border-light bg-surface p-4">
      <h2 className="mb-3 text-[10px] font-medium uppercase tracking-widest text-text-tertiary">
        {title}
      </h2>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}
