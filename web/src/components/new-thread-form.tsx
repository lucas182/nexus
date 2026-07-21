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
        className="mb-2 flex items-center gap-1.5 text-xs font-medium text-text-tertiary transition-colors hover:text-accent"
      >
        <Plus size={12} strokeWidth={1.5} /> Nova Thread
      </button>
    );
  }

  return (
    <form
      action={createThread}
      className="mb-3 animate-field-in rounded-lg border border-border-light bg-surface p-3.5"
    >
      <input type="hidden" name="workspace_id" value={workspaceId} />
      <div className="flex flex-col gap-2">
        <input
          name="title"
          placeholder="Título da Thread"
          required
          autoFocus
          className="h-9 rounded-md border border-border bg-surface px-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent-muted/50"
        />
        <input
          name="objetivo"
          placeholder="Objetivo (opcional)"
          className="h-9 rounded-md border border-border bg-surface px-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent-muted/50"
        />
      </div>
      <div className="mt-2.5 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-8 rounded-md px-3 text-xs text-text-secondary transition-colors hover:bg-hover"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="h-8 rounded-md bg-accent px-3 text-xs font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
        >
          Criar
        </button>
      </div>
    </form>
  );
}
