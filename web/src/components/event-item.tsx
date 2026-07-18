import { Link2 } from "lucide-react";
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
  const attachmentUrl =
    typeof event.metadata?.attachment_url === "string" ? event.metadata.attachment_url : null;

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
        {attachmentUrl && (
          <a
            href={attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-1.5 text-xs text-accent hover:underline"
          >
            <Link2 size={12} />
            <span className="truncate">{attachmentUrl}</span>
          </a>
        )}
      </div>
    </div>
  );
}
