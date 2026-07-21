"use client";

import { useState } from "react";
import { ChevronDown, Link2 } from "lucide-react";
import type { InboxItem, Thread, Workspace, EventType, ImpactLevel } from "@/types/domain";
import { classifyInboxItem, discardInboxItem } from "@/lib/actions/inbox";
import { EVENT_TYPE_LABELS } from "@/types/domain";

export function InboxCard({ item, workspaces, threads, selected, onSelect }: {
  item: InboxItem; workspaces: Workspace[]; threads: Thread[]; selected?: boolean; onSelect?: (id: string, selected: boolean) => void;
}) {
  const suggestedWorkspace = workspaces.find((w) => w.id === item.suggested_workspace_id);
  const suggestedThread = threads.find((t) => t.id === item.suggested_thread_id);
  const [advanced, setAdvanced] = useState(false);
  const [workspaceId, setWorkspaceId] = useState(item.suggested_workspace_id ?? workspaces[0]?.id ?? "");
  const [threadId, setThreadId] = useState(item.suggested_thread_id ?? "");
  const [newThread, setNewThread] = useState("");
  const threadsForWorkspace = threads.filter((t) => t.workspace_id === workspaceId);

  function changeWorkspace(id: string) { setWorkspaceId(id); setThreadId(""); setNewThread(""); }
  const canResolve = Boolean(threadId || (workspaceId && newThread.trim()));

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

          {/* Suggested classification */}
          {suggestedWorkspace && suggestedThread && !advanced ? (
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-md bg-accent-soft/60 px-3 py-2">
              <span className="text-[11px] text-text-secondary">
                Parece pertencer a <strong>{suggestedWorkspace.name} · {suggestedThread.title}</strong>
              </span>
              <form action={classifyInboxItem}>
                <input type="hidden" name="inbox_item_id" value={item.id} />
                <input type="hidden" name="thread_id" value={suggestedThread.id} />
                <button type="submit" className="h-7 rounded-md bg-accent px-2.5 text-[11px] font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]">Aceitar</button>
              </form>
            </div>
          ) : !advanced ? (
            <button onClick={() => setAdvanced(true)} className="mt-2 text-[11px] font-medium text-text-tertiary hover:text-accent transition-colors">Escolher assunto</button>
          ) : null}

          {/* Advanced toggle */}
          <button onClick={() => setAdvanced((v) => !v)} className="mt-1.5 flex items-center gap-1 text-[10px] text-text-tertiary hover:text-text-secondary transition-colors">
            <ChevronDown size={11} strokeWidth={1.5} className={advanced ? "rotate-180" : ""} />
            {advanced ? "Menos opções" : "Mais opções"}
          </button>

          {/* Advanced form */}
          {advanced && (
            <form action={classifyInboxItem} className="mt-2.5 border-t border-border-light pt-2.5">
              <input type="hidden" name="inbox_item_id" value={item.id} />
              <div className="flex flex-wrap gap-2">
                <select
                  name="workspace_id"
                  value={workspaceId}
                  onChange={(e) => changeWorkspace(e.target.value)}
                  className="h-8 rounded-md border border-border bg-surface px-2 text-xs text-text-secondary outline-none focus:border-accent"
                >
                  <option value="">Área da vida</option>
                  {workspaces.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
                <select
                  name="thread_id"
                  value={threadId}
                  onChange={(e) => { setThreadId(e.target.value); setNewThread(""); }}
                  className="h-8 rounded-md border border-border bg-surface px-2 text-xs text-text-secondary outline-none focus:border-accent"
                >
                  <option value="">Escolher assunto</option>
                  {threadsForWorkspace.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>
              {workspaceId && !threadId && (
                <input
                  name="new_thread_title"
                  value={newThread}
                  onChange={(e) => setNewThread(e.target.value)}
                  placeholder="ou criar novo assunto…"
                  className="mt-2 h-8 w-full rounded-md border border-border bg-surface px-2.5 text-xs outline-none placeholder:text-text-tertiary focus:border-accent"
                />
              )}
              <details className="mt-2">
                <summary className="cursor-pointer text-[10px] text-text-tertiary">Detalhes opcionais</summary>
                <div className="mt-2 flex gap-2">
                  <select name="event_type" defaultValue="note" className="h-7 rounded-md border border-border bg-surface px-2 text-[10px] text-text-secondary outline-none">
                    {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((t) => <option key={t} value={t}>{EVENT_TYPE_LABELS[t]}</option>)}
                  </select>
                  <select name="impact" defaultValue="medium" className="h-7 rounded-md border border-border bg-surface px-2 text-[10px] text-text-secondary outline-none">
                    {(["low", "medium", "high"] as ImpactLevel[]).map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </details>
              <div className="mt-3 flex justify-between items-center">
                <button formAction={discardInboxItem} type="submit" className="text-[11px] text-text-tertiary transition-colors hover:text-red">
                  Descartar
                </button>
                <button
                  disabled={!canResolve}
                  type="submit"
                  className="h-7 rounded-md bg-accent px-3 text-[11px] font-medium text-white transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
                >
                  Salvar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
