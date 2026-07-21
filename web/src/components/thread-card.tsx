import Link from "next/link";
import type { Event, Thread } from "@/types/domain";
import { ThreadStatusBadge } from "@/components/badges";
import { ThreadRowMenu } from "@/components/thread-row-menu";

export function ThreadCard({
  thread,
  recentEvents,
  eventCount,
}: {
  thread: Thread;
  recentEvents: Event[];
  eventCount?: number;
}) {
  const count = eventCount ?? recentEvents.length;

  return (
    <div className="group relative mb-2">
      <Link
        href={`/thread/${thread.id}`}
        className="block rounded-lg border border-border-light bg-surface p-3.5 transition-all hover:border-border hover:shadow-xs"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-text-primary">{thread.title}</h3>
            {recentEvents.length > 0 ? (
              <p className="mt-1 text-xs text-text-tertiary line-clamp-1">
                {recentEvents[recentEvents.length - 1].description}
              </p>
            ) : (
              <p className="mt-1 text-xs text-text-tertiary">Sem acontecimentos</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {count > 0 && (
              <span className="text-[10px] text-text-tertiary">{count} eve{count > 1 ? "ntos" : "nto"}</span>
            )}
            <ThreadStatusBadge status={thread.status} />
          </div>
        </div>
      </Link>

      <div className="absolute right-2 top-2.5">
        <ThreadRowMenu
          threadId={thread.id}
          workspaceId={thread.workspace_id}
          threadTitle={thread.title}
          eventCount={count}
        />
      </div>
    </div>
  );
}
