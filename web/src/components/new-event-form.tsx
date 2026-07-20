"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createEvent } from "@/lib/actions/events";

/** Contextual capture uses the exact same pipeline as global capture, then resolves immediately. */
export function NewEventForm({ threadId, workspaceId }: { threadId: string; workspaceId: string }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-3 flex items-center gap-1.5 text-xs font-medium text-accent hover:underline">
        <Plus size={13} /> Registrar acontecimento
      </button>
    );
  }

  return (
    <form
      action={async (formData) => { await createEvent(formData); setOpen(false); }}
      className="mt-3 rounded-lg border border-border-light bg-bg p-4"
    >
      <input type="hidden" name="thread_id" value={threadId} />
      <input type="hidden" name="workspace_id" value={workspaceId} />
      <textarea name="raw_text" placeholder="O que aconteceu?" required autoFocus className="h-16 w-full resize-none rounded-md border border-border bg-surface px-2 py-1.5 text-sm outline-none" />
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="rounded-md px-3 py-1.5 text-xs text-text-secondary hover:bg-hover">Cancelar</button>
        <button type="submit" className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover">Registrar</button>
      </div>
    </form>
  );
}
