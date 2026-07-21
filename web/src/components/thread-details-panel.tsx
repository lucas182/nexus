"use client";

import { useRef, useState } from "react";
import type { Thread } from "@/types/domain";
import { THREAD_STATUS_LABELS } from "@/types/domain";
import { updateThreadStatus, updateThreadSummary } from "@/lib/actions/threads";
import { showToast } from "@/lib/toast";

const STATUSES = Object.keys(THREAD_STATUS_LABELS) as Thread["status"][];

export function ThreadDetailsPanel({ thread, workspaceId }: { thread: Thread; workspaceId: string }) {
  const [editing, setEditing] = useState(false);
  const statusFormRef = useRef<HTMLFormElement>(null);
  return (
    <div className="rounded-lg border border-border-light bg-surface p-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-[10px] font-medium uppercase tracking-widest text-text-tertiary">
          Contexto do assunto
        </h2>
        <form ref={statusFormRef} action={updateThreadStatus}>
          <input type="hidden" name="id" value={thread.id} />
          <input type="hidden" name="workspace_id" value={workspaceId} />
          <select
            name="status"
            defaultValue={thread.status}
            onChange={() => statusFormRef.current?.requestSubmit()}
            className="h-7 rounded-md border border-border bg-surface px-2 text-[10px] text-text-secondary outline-none focus:border-accent"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>{THREAD_STATUS_LABELS[status]}</option>
            ))}
          </select>
        </form>
      </div>

      {editing ? (
        <form
          action={async (data) => { await updateThreadSummary(data); setEditing(false); showToast("Assunto atualizado"); }}
          className="flex flex-col gap-3"
        >
          <input type="hidden" name="id" value={thread.id} />
          <label className="flex flex-col gap-1">
            <span className="text-[10px] text-text-tertiary">Objetivo</span>
            <input
              name="objetivo"
              defaultValue={thread.objetivo ?? ""}
              className="h-9 rounded-md border border-border px-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-muted/50"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] text-text-tertiary">Resumo atual</span>
            <textarea
              name="resumo_vivo"
              defaultValue={thread.resumo_vivo ?? ""}
              className="h-16 resize-none rounded-md border border-border px-2.5 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-muted/50"
            />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(false)} className="h-8 rounded-md px-3 text-xs text-text-secondary transition-colors hover:bg-hover">Cancelar</button>
            <button type="submit" className="h-8 rounded-md bg-accent px-3 text-xs font-medium text-white hover:bg-accent-hover active:scale-[0.98]">Salvar</button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <div className="text-[10px] text-text-tertiary">Objetivo</div>
            <div className="mt-0.5 text-text-primary">{thread.objetivo || "Ainda não definido."}</div>
          </div>
          <div>
            <div className="text-[10px] text-text-tertiary">Resumo atual</div>
            <div className="mt-0.5 text-text-primary text-sm leading-relaxed">{thread.resumo_vivo || "O histórico abaixo preserva o contexto."}</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setEditing(true)} className="text-[10px] font-medium text-accent hover:underline">Corrigir</button>
          </div>
        </div>
      )}
    </div>
  );
}
