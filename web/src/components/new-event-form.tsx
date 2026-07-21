"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createEvent } from "@/lib/actions/events";

export function NewEventForm({ threadId, workspaceId }: { threadId: string; workspaceId: string }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-text-tertiary transition-colors hover:text-accent"
      >
        <Plus size={12} strokeWidth={1.5} />
        Registrar acontecimento
      </button>
    );
  }

  return (
    <form
      action={async (formData) => { await createEvent(formData); setOpen(false); }}
      className="mt-3 animate-field-in rounded-lg border border-border-light bg-bg p-3.5"
    >
      <input type="hidden" name="thread_id" value={threadId} />
      <input type="hidden" name="workspace_id" value={workspaceId} />
      <textarea
        name="raw_text"
        placeholder="O que aconteceu?"
        required
        autoFocus
        className="h-16 w-full resize-none rounded-md border border-border bg-surface px-2.5 py-2 text-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent-muted/50"
      />
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
          Registrar
        </button>
      </div>
    </form>
  );
}
