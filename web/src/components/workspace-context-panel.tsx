"use client";

import { useState } from "react";
import type { Workspace } from "@/types/domain";
import type { DerivedWorkspaceContext } from "@/lib/data/context";
import { updateWorkspaceContext } from "@/lib/actions/workspaces";
import { showToast } from "@/lib/toast";

export function WorkspaceContextPanel({ workspace, context }: { workspace: Workspace; context: DerivedWorkspaceContext }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <form
        action={async (data) => { await updateWorkspaceContext(data); setEditing(false); showToast("Contexto atualizado"); }}
        className="rounded-lg border border-border-light bg-surface p-4"
      >
        <input type="hidden" name="id" value={workspace.id} />
        <h2 className="mb-1 text-[10px] font-medium uppercase tracking-widest text-text-tertiary">Corrigir contexto</h2>
        <p className="mb-3 text-[10px] text-text-tertiary">Use apenas quando a leitura automática não representar bem a situação.</p>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] text-text-tertiary">Objetivo atual</span>
            <input name="context_status" defaultValue={workspace.context_status ?? context.objective ?? ""} className="h-9 rounded-md border border-border px-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-muted/50" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] text-text-tertiary">Maior risco</span>
            <input name="context_maior_risco" defaultValue={workspace.context_maior_risco ?? context.majorRisk ?? ""} className="h-9 rounded-md border border-border px-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-muted/50" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] text-text-tertiary">Última decisão</span>
            <input name="context_decisao_recente" defaultValue={workspace.context_decisao_recente ?? context.lastDecision ?? ""} className="h-9 rounded-md border border-border px-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-muted/50" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] text-text-tertiary">Próximo passo</span>
            <input name="context_proximo_passo" defaultValue={workspace.context_proximo_passo ?? context.nextStep ?? ""} className="h-9 rounded-md border border-border px-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-muted/50" />
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setEditing(false)} className="h-8 rounded-md px-3 text-xs text-text-secondary hover:bg-hover">Cancelar</button>
          <button type="submit" className="h-8 rounded-md bg-accent px-3 text-xs font-medium text-white hover:bg-accent-hover active:scale-[0.98]">Salvar</button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-lg border border-border-light bg-surface p-4">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <h2 className="text-[10px] font-medium uppercase tracking-widest text-text-tertiary">Contexto atual</h2>
          <p className="mt-0.5 text-[10px] text-text-tertiary">Derivado dos assuntos e acontecimentos</p>
        </div>
        <button onClick={() => setEditing(true)} className="text-[10px] font-medium text-accent hover:underline flex-shrink-0">Corrigir</button>
      </div>
      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div>
          <div className="text-[10px] text-text-tertiary">Objetivo</div>
          <div className="mt-0.5 text-text-primary">{context.objective || "Ainda não há sinal suficiente."}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-tertiary">Última decisão</div>
          <div className="mt-0.5 text-accent">{context.lastDecision || "Ainda não há sinal suficiente."}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-tertiary">Maior risco</div>
          <div className="mt-0.5 text-red">{context.majorRisk || "Ainda não há sinal suficiente."}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-tertiary">Próximo passo</div>
          <div className="mt-0.5 font-medium text-text-primary">{context.nextStep || "Ainda não há sinal suficiente."}</div>
        </div>
      </div>
      {context.openThreads.length > 0 && (
        <div className="mt-3 border-t border-border-light pt-3 text-[10px] text-text-tertiary">
          Assuntos abertos: {context.openThreads.map((t) => t.title).join(" · ")}
        </div>
      )}
    </div>
  );
}
