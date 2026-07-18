"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { MoreHorizontal, Trash2, Loader2 } from "lucide-react";

import { deleteWorkspace } from "@/lib/actions/workspaces";

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-1.5 rounded-md bg-red-600 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending && <Loader2 size={11} className="animate-spin" />}
      {pending ? "Excluindo…" : "Confirmar exclusão"}
    </button>
  );
}

export function WorkspaceRowMenu({
  workspaceId,
  workspaceName,
}: {
  workspaceId: string;
  workspaceName: string;
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirming(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex-shrink-0">
      <button
        type="button"
        title="Mais ações"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-5 w-5 items-center justify-center rounded text-text-tertiary opacity-0 transition-opacity hover:bg-active hover:text-text-primary focus-visible:opacity-100 group-hover:opacity-100 ${
          open ? "opacity-100" : ""
        }`}
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <div className="animate-field-in absolute right-0 top-6 z-50 w-52 rounded-md border border-border-light bg-surface p-1 shadow-lg">
          {confirming ? (
            <div className="flex flex-col gap-2 p-1.5">
              <p className="text-xs text-text-secondary">
                Excluir <strong className="text-text-primary">{workspaceName}</strong> e tudo
                dentro dele? Isso não pode ser desfeito.
              </p>
              <form action={deleteWorkspace}>
                <input type="hidden" name="id" value={workspaceId} />
                <ConfirmButton />
              </form>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-xs text-text-tertiary hover:text-text-primary"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-text-secondary hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={13} strokeWidth={1.5} />
              Excluir workspace
            </button>
          )}
        </div>
      )}
    </div>
  );
}
