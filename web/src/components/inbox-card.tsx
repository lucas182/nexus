"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import type { InboxItem, Thread, Workspace, EventType, ImpactLevel } from "@/types/domain";
import { classifyInboxItem, discardInboxItem } from "@/lib/actions/inbox";
import { EVENT_TYPE_LABELS } from "@/types/domain";

const EVENT_TYPES = Object.keys(EVENT_TYPE_LABELS) as EventType[];
const IMPACT_LEVELS: ImpactLevel[] = ["low", "medium", "high"];

export function InboxCard({
  item,
  workspaces,
  threads,
}: {
  item: InboxItem;
  workspaces: Workspace[];
  threads: Thread[];
}) {
  const suggestedWorkspace = workspaces.find((w) => w.id === item.suggested_workspace_id);
  const suggestedThread = threads.find((t) => t.id === item.suggested_thread_id);

  const [workspaceId, setWorkspaceId] = useState(
    item.suggested_workspace_id ?? workspaces[0]?.id ?? "",
  );
  const threadsForWorkspace = threads.filter((t) => t.workspace_id === workspaceId);
  const [threadId, setThreadId] = useState(
    item.suggested_thread_id ?? threadsForWorkspace[0]?.id ?? "",
  );

  function handleWorkspaceChange(id: string) {
    setWorkspaceId(id);
    const first = threads.find((t) => t.workspace_id === id);
    setThreadId(first?.id ?? "");
  }

  if (workspaces.length === 0) {
    return (
      <div className="mb-4 rounded-lg border border-border-light bg-surface p-4 text-sm text-text-primary">
        {item.raw_text}
        <p className="mt-2 text-xs text-text-tertiary">
          Crie um Workspace antes de classificar este item.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-lg border border-border-light bg-surface p-4">
      <div className="text-sm leading-relaxed text-text-primary">{item.raw_text}</div>

      {item.attachment_url && (
        <a
          href={item.attachment_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-1.5 text-xs text-accent hover:underline"
        >
          <Link2 size={12} />
          <span className="truncate">{item.attachment_url}</span>
        </a>
      )}

      {suggestedWorkspace && suggestedThread && (
        <div className="mt-3 flex items-center justify-between rounded-md border border-border bg-bg px-3 py-2 text-xs">
          <span className="text-text-secondary">
            Sugestão: mover para <strong>{suggestedWorkspace.name}</strong> na Thread{" "}
            <strong>{suggestedThread.title}</strong>
          </span>
          <form action={classifyInboxItem}>
            <input type="hidden" name="inbox_item_id" value={item.id} />
            <input type="hidden" name="thread_id" value={suggestedThread.id} />
            <input type="hidden" name="description" value={item.raw_text} />
            <input type="hidden" name="event_type" value="note" />
            <input type="hidden" name="impact" value="medium" />
            <button
              type="submit"
              className="rounded-full border border-accent-muted bg-accent-soft px-2.5 py-1 font-medium text-accent"
            >
              Confirmar
            </button>
          </form>
        </div>
      )}

      <form
        action={classifyInboxItem}
        className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border-light pt-3"
      >
        <input type="hidden" name="inbox_item_id" value={item.id} />
        <input type="hidden" name="description" value={item.raw_text} />
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={workspaceId}
            onChange={(e) => handleWorkspaceChange(e.target.value)}
            className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-text-secondary"
          >
            {workspaces.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          <select
            name="thread_id"
            value={threadId}
            onChange={(e) => setThreadId(e.target.value)}
            className="max-w-[200px] rounded-md border border-border bg-surface px-2 py-1 text-xs text-text-secondary"
          >
            {threadsForWorkspace.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          <select
            name="event_type"
            defaultValue="note"
            className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-text-secondary"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {EVENT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          <select
            name="impact"
            defaultValue="medium"
            className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-text-secondary"
          >
            {IMPACT_LEVELS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!threadId}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-hover disabled:opacity-40"
          >
            Classificar
          </button>
        </div>
      </form>

      <form action={discardInboxItem} className="mt-2 flex justify-end">
        <input type="hidden" name="inbox_item_id" value={item.id} />
        <button type="submit" className="text-xs text-text-tertiary hover:text-red-600">
          Descartar
        </button>
      </form>
    </div>
  );
}
