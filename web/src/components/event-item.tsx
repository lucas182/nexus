import type { Event } from "@/types/domain";
import { EventTypeBadge, ImpactLabel } from "@/components/badges";

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventItem({ event }: { event: Event }) {
  return (
    <div className="flex gap-3 border-b border-border-light py-3 last:border-0">
      <div className="mt-0.5">
        <EventTypeBadge type={event.type} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-text-primary">{event.description}</p>
        <div className="mt-1 flex gap-2 text-xs text-text-tertiary">
          <span>{formatDateTime(event.timestamp)}</span>
          <span>·</span>
          <span>
            Impacto: <ImpactLabel impact={event.impact} />
          </span>
        </div>
      </div>
    </div>
  );
}
