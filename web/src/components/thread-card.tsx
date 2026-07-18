import Link from "next/link";
import type { Event, Thread } from "@/types/domain";
import { ThreadStatusBadge } from "@/components/badges";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function ThreadCard({ thread, recentEvents }: { thread: Thread; recentEvents: Event[] }) {
  return (
    <Link
      href={`/thread/${thread.id}`}
      className="mb-3 block rounded-lg border border-border-light bg-surface p-4 transition-colors hover:border-border"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">{thread.title}</h3>
        <ThreadStatusBadge status={thread.status} />
      </div>

      {recentEvents.length > 0 ? (
        <div className="mt-2 flex flex-col gap-1 border-t border-border-light pt-2">
          {recentEvents.slice(-3).map((e) => (
            <div key={e.id} className="flex items-center justify-between text-xs">
              <span className="truncate text-text-secondary">{e.description}</span>
              <span className="ml-2 flex-shrink-0 text-text-tertiary">
                {formatDate(e.timestamp)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2 text-xs text-text-tertiary">Sem acontecimentos registrados</div>
      )}
    </Link>
  );
}
