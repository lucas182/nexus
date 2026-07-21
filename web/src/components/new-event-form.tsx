"use client";

import { useRef, useState } from "react";
import { createEvent } from "@/lib/actions/events";

export function NewEventForm({ threadId, workspaceId }: { threadId: string; workspaceId: string }) {
  const [recent, setRecent] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(formData: FormData) {
    const text = String(formData.get("raw_text") ?? "").trim();
    if (!text) return;
    await createEvent(formData);
    setRecent(text);
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.focus();
  }

  return (
    <div className="mt-3">
      <form action={handleSubmit} className="flex items-start gap-2">
        <input type="hidden" name="thread_id" value={threadId} />
        <input type="hidden" name="workspace_id" value={workspaceId} />
        <textarea
          ref={inputRef}
          name="raw_text"
          placeholder="O que aconteceu? Enter para registrar"
          className="h-9 min-h-[36px] flex-1 resize-none rounded-[5px] border border-border-light bg-surface px-3 py-1.5 text-sm text-text-primary outline-none transition-all duration-150 placeholder:text-text-quaternary/80 focus:border-accent"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              (e.target as HTMLTextAreaElement).form?.requestSubmit();
            }
          }}
        />
        <button
          type="submit"
          className="flex-shrink-0 rounded-[5px] bg-accent px-3 py-1.5 text-xs font-medium text-white transition-all duration-150 hover:bg-accent-hover active:scale-[0.97]"
        >
          Enviar
        </button>
      </form>
      {recent && (
        <p className="mt-1 text-[10px] text-text-quaternary/70">Registrado: {recent.slice(0, 60)}</p>
      )}
    </div>
  );
}
