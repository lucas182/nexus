"use client";

import { useState } from "react";
import type { Event, KnowledgeType } from "@/types/domain";
import { KNOWLEDGE_TYPE_LABELS } from "@/types/domain";
import { EventItem } from "@/components/event-item";
import { createKnowledge } from "@/lib/actions/knowledge";
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
      <p className="py-6 text-center text-sm text-text-tertiary">
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
          className="flex items-center gap-1.5 py-3 text-xs font-medium text-accent hover:underline"
        >
          <Sparkles size={13} /> Consolidar em Knowledge
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
      }}
    >
      <input type="hidden" name="thread_id" value={threadId} />
      {[...selected].map((id) => (
        <input key={id} type="hidden" name="source_event_ids" value={id} />
      ))}

      <p className="pt-3 text-xs text-text-tertiary">
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
            className="mt-1.5"
          />
          <span className="text-sm text-text-primary">{event.description}</span>
        </label>
      ))}

      <div className="mt-3 flex flex-col gap-2 rounded-lg border border-border-light bg-bg p-4">
        <input
          name="title"
          placeholder="Título do Knowledge"
          required
          className="rounded-md border border-border bg-surface px-2 py-1.5 text-sm"
        />
        <select
          name="type"
          defaultValue="consolidatedDecision"
          className="rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-text-secondary"
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
          className="h-20 resize-none rounded-md border border-border bg-surface px-2 py-1.5 text-sm"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setSelecting(false);
              setSelected(new Set());
            }}
            className="rounded-md px-3 py-1.5 text-xs text-text-secondary hover:bg-hover"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={selected.size === 0}
            className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-40"
          >
            Consolidar ({selected.size})
          </button>
        </div>
      </div>
    </form>
  );
}
