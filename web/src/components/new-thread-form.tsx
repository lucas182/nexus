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
        <Plus size={12} strokeWidth={1.5} /> Novo assunto
      </button>
    );
  }

  return (
    <form
      action={createThread}
      className="mb-3 animate-field-in rounded-lg border border-border-light bg-surface p-3.5"
    >
      <input type="hidden" name="workspace_id" value={workspaceId} />
      <input
        name="title"
        placeholder="Nome do assunto…"
        required
        autoFocus
        className="h-9 w-full rounded-md border border-border bg-surface px-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent-muted/50"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).form?.requestSubmit();
          }
          if (e.key === "Escape") setOpen(false);
        }}
      />
      <div className="mt-2.5 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-7 rounded-md px-2.5 text-[11px] text-text-secondary transition-colors hover:bg-hover"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="h-7 rounded-md bg-accent px-2.5 text-[11px] font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
        >
          Criar
        </button>
      </div>
    </form>
  );
}
