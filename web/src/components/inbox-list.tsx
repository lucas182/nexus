"use client";

import { useMemo, useState } from "react";
import type { InboxItem, Thread, Workspace } from "@/types/domain";
import { classifyInboxItems } from "@/lib/actions/inbox";
import { InboxCard } from "@/components/inbox-card";

export function InboxList({ items, workspaces, threads }: { items: InboxItem[]; workspaces: Workspace[]; threads: Thread[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [workspaceId, setWorkspaceId] = useState("");
  const [threadId, setThreadId] = useState("");
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const threadsForWorkspace = useMemo(() => threads.filter((thread) => thread.workspace_id === workspaceId), [threads, workspaceId]);
  const canResolve = selected.size > 0 && Boolean(threadId || (workspaceId && newThreadTitle.trim()));
  function toggle(id: string, checked: boolean) { setSelected((prev) => { const next = new Set(prev); if (checked) next.add(id); else next.delete(id); return next; }); }
  return (
    <>
      {items.length > 1 && (
        <div className="mb-3 flex items-center justify-between text-[11px] text-text-tertiary">
          <label className="flex items-center gap-2 cursor-pointer hover:text-text-secondary transition-colors">
            <input type="checkbox" checked={selected.size === items.length}
              onChange={(e) => setSelected(e.target.checked ? new Set(items.map((item) => item.id)) : new Set())} />
            Selecionar todas
          </label>
          {selected.size > 0 && <span>{selected.size} selecionada{selected.size > 1 ? "s" : ""}</span>}
        </div>
      )}
      {selected.size > 0 && (
        <form action={classifyInboxItems} className="sticky top-2 z-10 mb-3 rounded-lg border border-accent-muted bg-surface p-3 shadow-sm">
          {[...selected].map((id) => <input key={id} type="hidden" name="inbox_item_ids" value={id} />)}
          <p className="mb-2 text-[11px] font-medium text-text-primary">Resolver capturas selecionadas</p>
          <div className="flex flex-wrap gap-2">
            <select name="workspace_id" value={workspaceId}
              onChange={(e) => { setWorkspaceId(e.target.value); setThreadId(""); setNewThreadTitle(""); }}
              className="h-8 rounded-md border border-border bg-surface px-2 text-xs text-text-secondary outline-none focus:border-accent">
              <option value="">Área da vida</option>
              {workspaces.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            <select name="thread_id" value={threadId}
              onChange={(e) => { setThreadId(e.target.value); setNewThreadTitle(""); }}
              className="h-8 rounded-md border border-border bg-surface px-2 text-xs text-text-secondary outline-none focus:border-accent">
              <option value="">Escolher assunto</option>
              {threadsForWorkspace.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
          {workspaceId && !threadId && (
            <input name="new_thread_title" value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              placeholder="ou criar novo assunto…"
              className="mt-2 h-8 w-full rounded-md border border-border bg-surface px-2.5 text-xs outline-none placeholder:text-text-tertiary focus:border-accent" />
          )}
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={() => setSelected(new Set())}
              className="h-7 rounded-md px-3 text-[11px] text-text-secondary transition-colors hover:bg-hover">Cancelar</button>
            <button disabled={!canResolve} type="submit"
              className="h-7 rounded-md bg-accent px-3 text-[11px] font-medium text-white transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none">Salvar</button>
          </div>
        </form>
      )}
      {items.map((item, i) => (
        <div key={item.id} className="animate-card-in" style={{ animationDelay: `${Math.min(i, 6) * 30}ms` }}>
          <InboxCard item={item} workspaces={workspaces} threads={threads} selected={selected.has(item.id)} onSelect={toggle} />
        </div>
      ))}
    </>
  );
}
