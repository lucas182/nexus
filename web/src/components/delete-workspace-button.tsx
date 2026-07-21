"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Trash2, Loader2 } from "lucide-react";

import { deleteWorkspace } from "@/lib/actions/workspaces";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 rounded-md bg-red px-2 py-1 text-[11px] font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending && <Loader2 size={10} className="animate-spin" />}
      {pending ? "Excluindo…" : "Confirmar exclusão"}
    </button>
  );
}

export function DeleteWorkspaceButton({
  workspaceId,
  workspaceName,
}: {
  workspaceId: string;
  workspaceName: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="animate-field-in flex items-center gap-2 rounded-md border border-red-border bg-red-soft py-1.5 pl-3 pr-1.5">
        <span className="text-[11px] text-red">
          Excluir <strong>{workspaceName}</strong>?
        </span>
        <form action={deleteWorkspace}>
          <input type="hidden" name="id" value={workspaceId} />
          <ConfirmButton />
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-md px-2 py-1 text-[11px] text-text-tertiary transition-colors hover:text-text-primary"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      title="Excluir workspace"
      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-red-soft hover:text-red"
    >
      <Trash2 size={14} strokeWidth={1.5} />
    </button>
  );
}
