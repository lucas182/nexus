"use client";

import { useState } from "react";
import type { Workspace } from "@/types/domain";
import type { DerivedWorkspaceContext } from "@/lib/data/context";
import { updateWorkspaceContext } from "@/lib/actions/workspaces";

export function WorkspaceContextPanel({ workspace, context }: { workspace: Workspace; context: DerivedWorkspaceContext }) {
  const [editing, setEditing] = useState(false);
  if (editing) return <form action={async (data) => { await updateWorkspaceContext(data); setEditing(false); }} className="rounded-lg border border-border-light bg-surface p-5">
    <input type="hidden" name="id" value={workspace.id} />
    <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-text-tertiary">Corrigir contexto</h2><p className="mb-4 text-xs text-text-tertiary">Use apenas quando a leitura automática não representar bem a situação.</p>
    <div className="flex flex-col gap-3 text-sm">
      <label className="flex flex-col gap-1"><span className="text-xs text-text-tertiary">Objetivo atual</span><input name="context_status" defaultValue={workspace.context_status ?? context.objective ?? ""} className="rounded-md border border-border px-2 py-1.5" /></label>
      <label className="flex flex-col gap-1"><span className="text-xs text-text-tertiary">Maior risco</span><input name="context_maior_risco" defaultValue={workspace.context_maior_risco ?? context.majorRisk ?? ""} className="rounded-md border border-border px-2 py-1.5" /></label>
      <label className="flex flex-col gap-1"><span className="text-xs text-text-tertiary">Última decisão</span><input name="context_decisao_recente" defaultValue={workspace.context_decisao_recente ?? context.lastDecision ?? ""} className="rounded-md border border-border px-2 py-1.5" /></label>
      <label className="flex flex-col gap-1"><span className="text-xs text-text-tertiary">Próximo passo</span><input name="context_proximo_passo" defaultValue={workspace.context_proximo_passo ?? context.nextStep ?? ""} className="rounded-md border border-border px-2 py-1.5" /></label>
    </div><div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setEditing(false)} className="rounded-md px-3 py-1.5 text-xs text-text-secondary hover:bg-hover">Cancelar</button><button type="submit" className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover">Salvar correção</button></div>
  </form>;
  const item = (label: string, value: string | null, className = "text-text-primary") => <div><div className="text-xs text-text-tertiary">{label}</div><div className={`mt-0.5 ${className}`}>{value || "Ainda não há sinal suficiente."}</div></div>;
  return <div className="rounded-lg border border-border-light bg-surface p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Contexto atual</h2><p className="mt-1 text-xs text-text-tertiary">Derivado dos assuntos e acontecimentos deste espaço.</p></div><button onClick={() => setEditing(true)} className="text-xs font-medium text-accent hover:underline">Corrigir</button></div><div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">{item("Objetivo atual", context.objective)}{item("Última decisão", context.lastDecision, "text-accent")}{item("Maior risco", context.majorRisk, "text-red-600")}{item("Próximo passo", context.nextStep, "font-medium text-text-primary")}</div>{context.openThreads.length > 0 && <div className="mt-4 border-t border-border-light pt-3 text-xs text-text-tertiary">Assuntos abertos: {context.openThreads.map((thread) => thread.title).join(" · ")}</div>}</div>;
}
