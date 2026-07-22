"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
    <motion.div 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative mb-2"
    >
      <Link
        href={`/thread/${thread.id}`}
        className="block rounded-[8px] border border-border-light bg-surface px-4 py-3.5 transition-all duration-150 hover:border-border hover:shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-text-primary">{thread.title}</h3>
            {recentEvents.length > 0 ? (
              <p className="mt-1.5 text-xs text-text-quaternary line-clamp-1 leading-snug">
                {recentEvents[recentEvents.length - 1].description}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {count > 0 && (
              <span className="text-[10px] text-text-quaternary">{count}</span>
            )}
            <ThreadStatusBadge status={thread.status} />
          </div>
        </div>
      </Link>

      <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 md:opacity-0 opacity-100">
        <ThreadRowMenu
          threadId={thread.id}
          workspaceId={thread.workspace_id}
          threadTitle={thread.title}
          eventCount={count}
        />
      </div>
    </motion.div>
  );
}
