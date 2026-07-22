"use client";

import { useRef, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type { Thread } from "@/types/domain";
import { THREAD_STATUS_LABELS } from "@/types/domain";
import { updateThreadStatus, updateThreadSummary, generateThreadSummary } from "@/lib/actions/threads";
import { showToast } from "@/lib/toast";

const STATUSES = Object.keys(THREAD_STATUS_LABELS) as Thread["status"][];

export function ThreadDetailsPanel({ thread, workspaceId }: { thread: Thread; workspaceId: string }) {
  const [editField, setEditField] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const statusFormRef = useRef<HTMLFormElement>(null);

  async function handleGenerateSummary() {
    setSummarizing(true);
    try {
      const result = await generateThreadSummary(thread.id);
      if (result.success) showToast("Resumo gerado por IA");
      else if (result.summary) showToast(result.summary);
    } catch {
      showToast("Erro ao gerar resumo");
    } finally {
      setSummarizing(false);
    }
  }

  return (
    <div className="rounded-[7px] border border-border-light bg-surface px-3.5 py-3">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.05em] text-text-quaternary">
          Sobre este assunto
        </h2>
        <form ref={statusFormRef} action={updateThreadStatus}>
          <input type="hidden" name="id" value={thread.id} />
          <input type="hidden" name="workspace_id" value={workspaceId} />
          <select
            name="status"
            defaultValue={thread.status}
            onChange={() => statusFormRef.current?.requestSubmit()}
            className="h-6 rounded-[4px] border border-border bg-surface px-1.5 text-[10px] text-text-secondary outline-none focus:border-accent"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>{THREAD_STATUS_LABELS[status]}</option>
            ))}
          </select>
        </form>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        {/* Objective */}
        <div
          className="group cursor-pointer rounded-[5px] px-2.5 py-1.5 -mx-1 transition-colors hover:bg-hover"
          onClick={() => setEditField(editField === "objetivo" ? null : "objetivo")}
        >
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-text-tertiary">Objetivo</div>
          </div>
          {editField === "objetivo" ? (
            <form
              action={async (data) => { await updateThreadSummary(data); setEditField(null); showToast("Atualizado"); }}
              className="mt-1"
              onClick={(e) => e.stopPropagation()}
            >
              <input type="hidden" name="id" value={thread.id} />
              <input
                name="objetivo"
                defaultValue={thread.objetivo ?? ""}
                placeholder="O que este assunto busca alcançar?"
                autoFocus
                className="h-8 w-full rounded-[5px] border border-border bg-surface px-2 text-sm text-text-primary outline-none placeholder:text-text-quaternary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); (e.target as HTMLInputElement).form?.requestSubmit(); }
                  if (e.key === "Escape") setEditField(null);
                }}
              />
            </form>
          ) : (
            <div className="mt-0.5 text-text-secondary leading-relaxed">{thread.objetivo || <span className="text-text-quaternary">—</span>}</div>
          )}
        </div>

        {/* Summary */}
        <div
          className="group rounded-[5px] px-2.5 py-1.5 -mx-1"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] text-text-tertiary">Resumo</div>
            <button
              onClick={handleGenerateSummary}
              disabled={summarizing}
              className="flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[10px] text-text-quaternary transition-all duration-150 hover:bg-accent-soft hover:text-accent disabled:opacity-50"
            >
              {summarizing ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <Sparkles size={10} strokeWidth={1.5} />
              )}
              {summarizing ? "Resumindo…" : "Resumir com IA"}
            </button>
          </div>
          {/* Click on the summary text to edit inline */}
          <div
            className="cursor-pointer transition-colors hover:bg-hover rounded-[4px] -mx-1 px-1 py-0.5"
            onClick={() => setEditField(editField === "resumo" ? null : "resumo")}
          >
            {editField === "resumo" ? (
              <form
                action={async (data) => { await updateThreadSummary(data); setEditField(null); showToast("Atualizado"); }}
                className="mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <input type="hidden" name="id" value={thread.id} />
                <textarea
                  name="resumo_vivo"
                  defaultValue={thread.resumo_vivo ?? ""}
                  placeholder="Resumo do andamento..."
                  autoFocus
                  className="h-14 w-full resize-none rounded-[5px] border border-border bg-surface px-2 py-1.5 text-sm text-text-primary outline-none placeholder:text-text-quaternary"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setEditField(null);
                  }}
                />
                <div className="mt-1.5 flex justify-end">
                  <button type="submit" className="h-7 rounded-[5px] bg-accent px-2.5 text-[11px] font-medium text-white transition-all duration-150 hover:bg-accent-hover active:scale-[0.97]">Salvar</button>
                </div>
              </form>
            ) : (
              <div className="mt-0.5 text-text-secondary leading-relaxed">{thread.resumo_vivo || <span className="text-text-quaternary">—</span>}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
