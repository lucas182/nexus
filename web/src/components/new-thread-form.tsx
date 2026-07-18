"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createThread } from "@/lib/actions/threads";

export function NewThreadForm({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-3 flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
      >
        <Plus size={13} /> Nova Thread
      </button>
    );
  }

  return (
    <form
      action={createThread}
      className="mb-4 rounded-lg border border-border-light bg-surface p-4"
    >
      <input type="hidden" name="workspace_id" value={workspaceId} />
      <div className="flex flex-col gap-2">
        <input
          name="title"
          placeholder="Título da Thread"
          required
          autoFocus
          className="rounded-md border border-border px-2 py-1.5 text-sm"
        />
        <input
          name="objetivo"
          placeholder="Objetivo (opcional)"
          className="rounded-md border border-border px-2 py-1.5 text-sm"
        />
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-3 py-1.5 text-xs text-text-secondary hover:bg-hover"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover"
        >
          Criar
        </button>
      </div>
    </form>
  );
}
