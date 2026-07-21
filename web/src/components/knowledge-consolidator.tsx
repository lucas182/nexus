"use client";

import { useState } from "react";
import type { Event, KnowledgeType } from "@/types/domain";
import { KNOWLEDGE_TYPE_LABELS } from "@/types/domain";
import { EventItem } from "@/components/event-item";
import { createKnowledge } from "@/lib/actions/knowledge";
import { showToast } from "@/lib/toast";
import { Sparkles } from "lucide-react";

const KNOWLEDGE_TYPES = Object.keys(KNOWLEDGE_TYPE_LABELS) as KnowledgeType[];

export function KnowledgeConsolidator({
  threadId,
  events,
}: {
  threadId: string;
  events: Event[];
}) {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (events.length === 0) {
    return (
      <p className="py-5 text-center text-sm text-text-tertiary">
        Nenhum acontecimento registrado ainda.
      </p>
    );
  }

  if (!selecting) {
    return (
      <>
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
        <button
          onClick={() => setSelecting(true)}
          className="flex items-center gap-1.5 py-2.5 text-xs font-medium text-text-tertiary transition-colors hover:text-accent"
        >
          <Sparkles size={12} strokeWidth={1.5} />
          Consolidar
        </button>
      </>
    );
  }

  return (
    <form
      action={async (formData) => {
        await createKnowledge(formData);
        setSelecting(false);
        setSelected(new Set());
        showToast("Knowledge consolidado");
      }}
    >
      <input type="hidden" name="thread_id" value={threadId} />
      {[...selected].map((id) => (
        <input key={id} type="hidden" name="source_event_ids" value={id} />
      ))}

      <div className="mt-2.5 flex flex-col gap-2 rounded-lg border border-border-light bg-bg p-3">
        <p className="text-[10px] text-text-tertiary">Selecione os eventos que formam este Knowledge:</p>
        <div className="flex flex-wrap gap-1.5">
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => toggle(event.id)}
              className={`rounded-md px-2 py-1 text-[11px] transition-all ${
                selected.has(event.id)
                  ? "bg-accent text-white"
                  : "bg-hover text-text-secondary hover:bg-active"
              }`}
            >
              {event.description.slice(0, 50)}{event.description.length > 50 ? "…" : ""}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-border-light pt-2.5">
          <input
            name="title"
            placeholder="Título"
            required
            className="h-8 rounded-md border border-border bg-surface px-2.5 text-xs text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent"
          />
          <textarea
            name="content"
            placeholder="Conteúdo consolidado"
            required
            className="h-14 resize-none rounded-md border border-border bg-surface px-2.5 py-2 text-xs text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => { setSelecting(false); setSelected(new Set()); }}
            className="h-7 rounded-md px-2.5 text-[11px] text-text-secondary transition-colors hover:bg-hover"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={selected.size === 0}
            className="h-7 rounded-md bg-accent px-2.5 text-[11px] font-medium text-white transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
          >
            Consolidar
          </button>
        </div>
      </div>
    </form>
  );
}
