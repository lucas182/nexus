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
      className="flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending && <Loader2 size={12} className="animate-spin" />}
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
      <div className="animate-field-in flex items-center gap-2 rounded-md border border-red-100 bg-red-50 py-1.5 pl-3 pr-1.5">
        <span className="text-xs text-red-700">
          Excluir <strong>{workspaceName}</strong> e tudo dentro dele?
        </span>
        <form action={deleteWorkspace}>
          <input type="hidden" name="id" value={workspaceId} />
          <ConfirmButton />
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-md px-2 py-1 text-xs text-text-tertiary hover:text-text-primary"
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
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 size={15} strokeWidth={1.5} />
    </button>
  );
}
