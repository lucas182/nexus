"use client";

import { useRef, useState } from "react";
import type { Thread } from "@/types/domain";
import { THREAD_STATUS_LABELS } from "@/types/domain";
import { updateThreadStatus, updateThreadSummary } from "@/lib/actions/threads";

const STATUSES = Object.keys(THREAD_STATUS_LABELS) as Thread["status"][];

export function ThreadDetailsPanel({
  thread,
  workspaceId,
}: {
  thread: Thread;
  workspaceId: string;
}) {
  const [editing, setEditing] = useState(false);
  const statusFormRef = useRef<HTMLFormElement>(null);

  return (
    <div className="rounded-lg border border-border-light bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
          Detalhes da Thread
        </h2>
        <form ref={statusFormRef} action={updateThreadStatus}>
          <input type="hidden" name="id" value={thread.id} />
          <input type="hidden" name="workspace_id" value={workspaceId} />
          <select
            name="status"
            defaultValue={thread.status}
            onChange={() => statusFormRef.current?.requestSubmit()}
            className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-text-secondary"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {THREAD_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </form>
      </div>

      {editing ? (
        <form
          action={async (formData) => {
            await updateThreadSummary(formData);
            setEditing(false);
          }}
          className="flex flex-col gap-3"
        >
          <input type="hidden" name="id" value={thread.id} />
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs text-text-tertiary">Objetivo</span>
            <input
              name="objetivo"
              defaultValue={thread.objetivo ?? ""}
              className="rounded-md border border-border px-2 py-1.5"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs text-text-tertiary">Resumo Vivo</span>
            <textarea
              name="resumo_vivo"
              defaultValue={thread.resumo_vivo ?? ""}
              className="h-20 resize-none rounded-md border border-border px-2 py-1.5"
            />
          </label>
          <div className="flex justify-end gap-2">
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
      ) : (
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <div className="text-xs text-text-tertiary">Objetivo</div>
            <div className="mt-0.5 text-text-primary">{thread.objetivo || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-text-tertiary">Resumo Vivo</div>
            <div className="mt-0.5 text-text-primary">{thread.resumo_vivo || "—"}</div>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="self-start text-xs font-medium text-accent hover:underline"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  );
}
