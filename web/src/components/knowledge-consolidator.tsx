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
          Consolidar em Knowledge
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

      <p className="pt-3 text-[10px] text-text-tertiary">
        Selecione os acontecimentos que formam esse Knowledge:
      </p>
      {events.map((event) => (
        <label
          key={event.id}
          className="flex cursor-pointer items-start gap-2 border-b border-border-light py-2 last:border-0"
        >
          <input
            type="checkbox"
            checked={selected.has(event.id)}
            onChange={() => toggle(event.id)}
            className="mt-1"
          />
          <span className="text-sm text-text-primary">{event.description}</span>
        </label>
      ))}

      <div className="mt-3 flex flex-col gap-2.5 rounded-lg border border-border-light bg-bg p-3.5">
        <input
          name="title"
          placeholder="Título do Knowledge"
          required
          className="h-9 rounded-md border border-border bg-surface px-2.5 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent-muted/50"
        />
        <select
          name="type"
          defaultValue="consolidatedDecision"
          className="h-9 rounded-md border border-border bg-surface px-2.5 text-sm text-text-secondary outline-none focus:border-accent focus:ring-2 focus:ring-accent-muted/50"
        >
          {KNOWLEDGE_TYPES.map((t) => (
            <option key={t} value={t}>
              {KNOWLEDGE_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <textarea
          name="content"
          placeholder="Conteúdo consolidado"
          required
          className="h-20 resize-none rounded-md border border-border bg-surface px-2.5 py-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent-muted/50"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setSelecting(false);
              setSelected(new Set());
            }}
            className="h-8 rounded-md px-3 text-xs text-text-secondary transition-colors hover:bg-hover"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={selected.size === 0}
            className="h-8 rounded-md bg-accent px-3 text-xs font-medium text-white transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
          >
            Consolidar ({selected.size})
          </button>
        </div>
      </div>
    </form>
  );
}
