export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`skeleton rounded-md opacity-0 animate-[fade-in_0.2s_ease-out_0.15s_forwards] ${className}`}
      aria-hidden
    />
  );
}

export function SkeletonCard({ lines = 2 }: { lines?: number }) {
  return (
    <div className="rounded-[8px] border border-border-light bg-surface p-4 opacity-0 animate-[fade-in_0.2s_ease-out_0.15s_forwards]">
      <div className="skeleton rounded-md h-3.5 w-1/3" />
      <div className="mt-3 flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton rounded-md h-2.5 ${i === lines - 1 ? "w-1/2" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}
