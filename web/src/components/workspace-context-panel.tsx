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
        <h2 className="mb-1 text-[10px] font-medium uppercase tracking-widest text-text-tertiary">Editar contexto</h2>
        <div className="flex flex-col gap-2.5">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] text-text-tertiary">Objetivo</span>
            <input name="context_status" defaultValue={workspace.context_status ?? context.objective ?? ""} className="h-9 rounded-md border border-border px-2.5 text-sm outline-none focus:border-accent" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] text-text-tertiary">Maior risco</span>
            <input name="context_maior_risco" defaultValue={workspace.context_maior_risco ?? context.majorRisk ?? ""} className="h-9 rounded-md border border-border px-2.5 text-sm outline-none focus:border-accent" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] text-text-tertiary">Última decisão</span>
            <input name="context_decisao_recente" defaultValue={workspace.context_decisao_recente ?? context.lastDecision ?? ""} className="h-9 rounded-md border border-border px-2.5 text-sm outline-none focus:border-accent" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] text-text-tertiary">Próximo passo</span>
            <input name="context_proximo_passo" defaultValue={workspace.context_proximo_passo ?? context.nextStep ?? ""} className="h-9 rounded-md border border-border px-2.5 text-sm outline-none focus:border-accent" />
          </label>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" onClick={() => setEditing(false)} className="h-7 rounded-md px-2.5 text-xs text-text-secondary hover:bg-hover">Cancelar</button>
          <button type="submit" className="h-7 rounded-md bg-accent px-2.5 text-xs font-medium text-white hover:bg-accent-hover active:scale-[0.98]">Salvar</button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-[7px] border border-accent-muted/30 bg-accent-soft/40 px-4 py-3.5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.05em] text-accent">Contexto</h2>
        <button onClick={() => setEditing(true)} className="text-[10px] text-text-quaternary transition-colors hover:text-text-secondary">Editar</button>
      </div>
      <div className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
        {context.objective && (
          <div className="col-span-2">
            <div className="text-[10px] text-text-quaternary">Objetivo</div>
            <div className="mt-0.5 text-text-primary leading-relaxed">{context.objective}</div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 col-span-2">
          {context.lastDecision && (
            <div>
              <div className="text-[10px] text-text-quaternary">Última decisão</div>
              <div className="mt-0.5 text-sm text-accent leading-relaxed">{context.lastDecision}</div>
            </div>
          )}
          {context.majorRisk && (
            <div>
              <div className="text-[10px] text-text-quaternary">Maior risco</div>
              <div className="mt-0.5 text-sm text-red leading-relaxed">{context.majorRisk}</div>
            </div>
          )}
        </div>
        {context.nextStep && (
          <div className="col-span-2">
            <div className="text-[10px] text-text-quaternary">Próximo passo</div>
            <div className="mt-0.5 text-sm font-medium text-text-primary leading-relaxed">{context.nextStep}</div>
          </div>
        )}
      </div>
      {context.openThreads.length > 0 && (
        <div className="mt-3 border-t border-accent-muted/20 pt-2.5 text-[10px] text-text-quaternary leading-relaxed">
          {context.openThreads.map((t) => t.title).join(" · ")}
        </div>
      )}
    </div>
  );
}
