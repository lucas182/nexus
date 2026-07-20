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
    <div className={`mb-3 rounded-lg border bg-surface p-4 ${selected ? "border-accent" : "border-border-light"}`}>
      <div className="flex gap-3">
        {onSelect && <input aria-label="Selecionar captura" type="checkbox" checked={selected} onChange={(e) => onSelect(item.id, e.target.checked)} className="mt-1" />}
        <div className="min-w-0 flex-1">
          <div className="text-sm leading-relaxed text-text-primary">{item.raw_text}</div>
          {item.attachment_url && <a href={item.attachment_url} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-1.5 text-xs text-accent hover:underline"><Link2 size={12} /><span className="truncate">{item.attachment_url}</span></a>}

          {suggestedWorkspace && suggestedThread && !advanced ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-accent-soft px-3 py-2 text-xs">
              <span className="text-text-secondary">Parece pertencer a <strong>{suggestedWorkspace.name} · {suggestedThread.title}</strong></span>
              <form action={classifyInboxItem}>
                <input type="hidden" name="inbox_item_id" value={item.id} /><input type="hidden" name="thread_id" value={suggestedThread.id} />
                <button type="submit" className="rounded-full bg-accent px-3 py-1 font-medium text-white">Aceitar</button>
              </form>
            </div>
          ) : !advanced ? (
            <button onClick={() => setAdvanced(true)} className="mt-3 text-xs font-medium text-accent hover:underline">Escolher assunto</button>
          ) : null}

          <button onClick={() => setAdvanced((v) => !v)} className="mt-3 flex items-center gap-1 text-xs text-text-tertiary hover:text-text-secondary"><ChevronDown size={13} className={advanced ? "rotate-180" : ""} /> {advanced ? "Menos opções" : "Mais opções"}</button>

          {advanced && <form action={classifyInboxItem} className="mt-3 border-t border-border-light pt-3">
            <input type="hidden" name="inbox_item_id" value={item.id} />
            <div className="flex flex-wrap gap-2">
              <select name="workspace_id" value={workspaceId} onChange={(e) => changeWorkspace(e.target.value)} className="rounded-md border border-border bg-surface px-2 py-1.5 text-xs">
                <option value="">Área da vida</option>{workspaces.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              <select name="thread_id" value={threadId} onChange={(e) => { setThreadId(e.target.value); setNewThread(""); }} className="max-w-[200px] rounded-md border border-border bg-surface px-2 py-1.5 text-xs">
                <option value="">Escolher assunto</option>{threadsForWorkspace.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
            {workspaceId && !threadId && <input name="new_thread_title" value={newThread} onChange={(e) => setNewThread(e.target.value)} placeholder="ou criar novo assunto…" className="mt-2 w-full rounded-md border border-border px-2 py-1.5 text-xs" />}
            <details className="mt-2"><summary className="cursor-pointer text-xs text-text-tertiary">Detalhes opcionais</summary><div className="mt-2 flex gap-2"><select name="event_type" defaultValue="note" className="rounded-md border border-border bg-surface px-2 py-1 text-xs">{(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((t) => <option key={t} value={t}>{EVENT_TYPE_LABELS[t]}</option>)}</select><select name="impact" defaultValue="medium" className="rounded-md border border-border bg-surface px-2 py-1 text-xs">{(["low", "medium", "high"] as ImpactLevel[]).map((i) => <option key={i} value={i}>{i}</option>)}</select></div></details>
            <div className="mt-3 flex justify-between"><button formAction={discardInboxItem} type="submit" className="text-xs text-text-tertiary hover:text-red-600">Descartar</button><button disabled={!canResolve} type="submit" className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40">Salvar no assunto</button></div>
          </form>}
        </div>
      </div>
    </div>
  );
}
