"use client";

import { useRef, useState } from "react";
import type { Thread } from "@/types/domain";
import { THREAD_STATUS_LABELS } from "@/types/domain";
import { updateThreadStatus, updateThreadSummary } from "@/lib/actions/threads";
import { showToast } from "@/lib/toast";

const STATUSES = Object.keys(THREAD_STATUS_LABELS) as Thread["status"][];

export function ThreadDetailsPanel({ thread, workspaceId }: { thread: Thread; workspaceId: string }) {
  const [editField, setEditField] = useState<string | null>(null);
  const statusFormRef = useRef<HTMLFormElement>(null);

  return (
    <div className="rounded-lg border border-border-light bg-surface p-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-[10px] font-medium uppercase tracking-widest text-text-tertiary">
          Sobre este assunto
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

      <div className="flex flex-col gap-2.5 text-sm">
        <div
          className="group cursor-pointer rounded-md px-2.5 py-2 transition-colors hover:bg-hover"
          onClick={() => setEditField(editField === "objetivo" ? null : "objetivo")}
        >
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-text-tertiary">Objetivo</div>
            <span className="text-[10px] text-text-tertiary/0 transition-colors group-hover:text-text-tertiary">
              {editField === "objetivo" ? "" : "Editar"}
            </span>
          </div>
          {editField === "objetivo" ? (
            <form
              action={async (data) => { await updateThreadSummary(data); setEditField(null); showToast("Atualizado"); }}
              className="mt-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <input type="hidden" name="id" value={thread.id} />
              <input
                name="objetivo"
                defaultValue={thread.objetivo ?? ""}
                placeholder="O que este assunto busca alcançar?"
                autoFocus
                className="h-9 w-full rounded-md border border-border bg-surface px-2.5 text-sm text-text-primary outline-none placeholder:text-text-tertiary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); (e.target as HTMLInputElement).form?.requestSubmit(); }
                  if (e.key === "Escape") setEditField(null);
                }}
              />
            </form>
          ) : (
            <div className="mt-0.5 text-text-primary">{thread.objetivo || "—"}</div>
          )}
        </div>

        <div
          className="group cursor-pointer rounded-md px-2.5 py-2 transition-colors hover:bg-hover"
          onClick={() => setEditField(editField === "resumo" ? null : "resumo")}
        >
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-text-tertiary">Resumo</div>
            <span className="text-[10px] text-text-tertiary/0 transition-colors group-hover:text-text-tertiary">
              {editField === "resumo" ? "" : "Editar"}
            </span>
          </div>
          {editField === "resumo" ? (
            <form
              action={async (data) => { await updateThreadSummary(data); setEditField(null); showToast("Atualizado"); }}
              className="mt-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <input type="hidden" name="id" value={thread.id} />
              <textarea
                name="resumo_vivo"
                defaultValue={thread.resumo_vivo ?? ""}
                placeholder="Resumo do andamento..."
                autoFocus
                className="h-16 w-full resize-none rounded-md border border-border bg-surface px-2.5 py-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setEditField(null);
                }}
              />
              <div className="mt-1.5 flex justify-end">
                <button type="submit" className="h-7 rounded-md bg-accent px-3 text-[11px] font-medium text-white hover:bg-accent-hover active:scale-[0.98]">Salvar</button>
              </div>
            </form>
          ) : (
            <div className="mt-0.5 leading-relaxed text-text-primary">{thread.resumo_vivo || "—"}</div>
          )}
        </div>
      </div>
    </div>
  );
}
