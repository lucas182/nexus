"use client";

import { useState } from "react";
import type { Workspace } from "@/types/domain";
import { updateWorkspaceContext } from "@/lib/actions/workspaces";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function WorkspaceContextPanel({ workspace }: { workspace: Workspace }) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <div className="rounded-lg border border-border-light bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
            Contexto do Workspace
          </h2>
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-accent hover:underline"
          >
            Editar
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <div className="text-xs text-text-tertiary">Status Atual</div>
            <div className="mt-0.5 text-text-primary">
              {workspace.context_status || "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-tertiary">Última Atualização</div>
            <div className="mt-0.5 text-text-primary">
              {formatDate(workspace.context_updated_at)}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-tertiary">Maior Risco</div>
            <div className="mt-0.5 text-red-600">
              {workspace.context_maior_risco || "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-tertiary">Decisão mais Recente</div>
            <div className="mt-0.5 text-accent">
              {workspace.context_decisao_recente || "—"}
            </div>
          </div>
          <div className="col-span-1 border-t border-border-light pt-3 sm:col-span-2">
            <div className="text-xs text-text-tertiary">Próximo Passo Sugerido</div>
            <div className="mt-0.5 font-medium text-text-primary">
              {workspace.context_proximo_passo || "—"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      action={async (formData) => {
        await updateWorkspaceContext(formData);
        setEditing(false);
      }}
      className="rounded-lg border border-border-light bg-surface p-5"
    >
      <input type="hidden" name="id" value={workspace.id} />
      <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-text-tertiary">
        Editando Contexto
      </h2>
      <div className="flex flex-col gap-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-text-tertiary">Status Atual</span>
          <input
            name="context_status"
            defaultValue={workspace.context_status ?? ""}
            className="rounded-md border border-border px-2 py-1.5"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-text-tertiary">Maior Risco</span>
          <input
            name="context_maior_risco"
            defaultValue={workspace.context_maior_risco ?? ""}
            className="rounded-md border border-border px-2 py-1.5"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-text-tertiary">Decisão mais Recente</span>
          <input
            name="context_decisao_recente"
            defaultValue={workspace.context_decisao_recente ?? ""}
            className="rounded-md border border-border px-2 py-1.5"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-text-tertiary">Próximo Passo Sugerido</span>
          <input
            name="context_proximo_passo"
            defaultValue={workspace.context_proximo_passo ?? ""}
            className="rounded-md border border-border px-2 py-1.5"
          />
        </label>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-md px-3 py-1.5 text-xs text-text-secondary hover:bg-hover"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
