"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import type { InboxItem, Thread, Workspace } from "@/types/domain";
import { classifyInboxItem, discardInboxItem } from "@/lib/actions/inbox";

export function InboxCard({ item, workspaces, threads, selected, onSelect }: {
  item: InboxItem; workspaces: Workspace[]; threads: Thread[]; selected?: boolean; onSelect?: (id: string, selected: boolean) => void;
}) {
  const suggestedWorkspace = workspaces.find((w) => w.id === item.suggested_workspace_id);
  const suggestedThread = threads.find((t) => t.id === item.suggested_thread_id);
  const hasSuggestion = Boolean(suggestedWorkspace && suggestedThread);
  const [showPicker, setShowPicker] = useState(false);
  const [workspaceId, setWorkspaceId] = useState(item.suggested_workspace_id ?? "");
  const [threadId, setThreadId] = useState(item.suggested_thread_id ?? "");
  const [newThread, setNewThread] = useState("");
  const threadsForWorkspace = threads.filter((t) => t.workspace_id === workspaceId);
  const canResolve = Boolean(threadId || (workspaceId && newThread.trim()));
  // Reset picker when suggestion context changes
  if (hasSuggestion && !showPicker && (workspaceId !== item.suggested_workspace_id || threadId !== item.suggested_thread_id)) {
    // controlled via setShowPicker — no-op to satisfy React rules
  }

  return (
    <div className={`mb-2 rounded-lg border bg-surface p-3.5 transition-colors ${selected ? "border-accent bg-accent-soft/30" : "border-border-light"}`}>
      <div className="flex gap-2.5">
        {onSelect && (
          <input
            aria-label="Selecionar captura"
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(item.id, e.target.checked)}
            className="mt-1 flex-shrink-0"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="text-sm leading-relaxed text-text-primary">{item.raw_text}</div>
          {item.attachment_url && (
            <a href={item.attachment_url} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-accent hover:underline">
              <Link2 size={10} strokeWidth={1.5} />
              <span className="truncate max-w-[240px]">{item.attachment_url}</span>
            </a>
          )}

          {/* Suggestion: one-click accept or show selector */}
          {hasSuggestion && !showPicker ? (
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-md bg-accent-soft/60 px-3 py-2">
              <span className="text-[11px] text-text-secondary">
                → <strong>{suggestedWorkspace!.name} · {suggestedThread!.title}</strong>
              </span>
              <div className="flex gap-1.5">
                <form action={classifyInboxItem}>
                  <input type="hidden" name="inbox_item_id" value={item.id} />
                  <input type="hidden" name="thread_id" value={suggestedThread!.id} />
                  <button type="submit" className="h-7 rounded-md bg-accent px-2.5 text-[11px] font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]">Aceitar</button>
                </form>
                <button onClick={() => { setShowPicker(true); setWorkspaceId(""); }} className="h-7 rounded-md px-2.5 text-[11px] text-text-secondary transition-colors hover:bg-hover">
                  Outro
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2.5">
              {/* Inline classifier */}
              <div className="flex flex-wrap gap-1.5">
                <select
                  value={workspaceId}
                  onChange={(e) => { setWorkspaceId(e.target.value); setThreadId(""); setNewThread(""); }}
                  className="h-7 rounded-md border border-border bg-surface px-2 text-[11px] text-text-secondary outline-none focus:border-accent"
                >
                  <option value="">Área</option>
                  {workspaces.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
                {workspaceId && (
                  <select
                    value={threadId}
                    onChange={(e) => { setThreadId(e.target.value); setNewThread(""); }}
                    className="h-7 rounded-md border border-border bg-surface px-2 text-[11px] text-text-secondary outline-none focus:border-accent"
                  >
                    <option value="">Assunto</option>
                    {threadsForWorkspace.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                )}
                {workspaceId && !threadId && (
                  <input
                    value={newThread}
                    onChange={(e) => setNewThread(e.target.value)}
                    placeholder="ou novo assunto…"
                    className="h-7 rounded-md border border-border bg-surface px-2 text-[11px] text-text-secondary outline-none placeholder:text-text-tertiary focus:border-accent"
                  />
                )}
                {canResolve && (
                  <form action={classifyInboxItem}>
                    <input type="hidden" name="inbox_item_id" value={item.id} />
                    <input type="hidden" name="workspace_id" value={workspaceId} />
                    {threadId && <input type="hidden" name="thread_id" value={threadId} />}
                    <input type="hidden" name="new_thread_title" value={newThread} />
                    <button type="submit" className="h-7 rounded-md bg-accent px-2 text-[11px] font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]">→</button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Discard — quiet, never prominent */}
      <form action={discardInboxItem} className="mt-1.5 flex justify-end">
        <input type="hidden" name="inbox_item_id" value={item.id} />
        <button type="submit" className="text-[10px] text-text-tertiary transition-colors hover:text-red/60">Descartar</button>
      </form>
    </div>
  );
}
