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
    <div className="flex gap-2.5 border-b border-border-light py-2.5 last:border-0">
      <div className="mt-0.5 flex-shrink-0">
        <EventTypeBadge type={event.type} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-text-primary leading-relaxed">{event.description}</p>
        <div className="mt-0.5 flex flex-wrap gap-x-2 text-[10px] text-text-tertiary">
          <span>{formatDateTime(event.timestamp)}</span>
          <span>·</span>
          <span><ImpactLabel impact={event.impact} /></span>
        </div>
        {attachmentUrl && (
          <a
            href={attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-[10px] text-accent hover:underline"
          >
            <Link2 size={10} strokeWidth={1.5} />
            <span className="truncate max-w-[200px]">{attachmentUrl}</span>
          </a>
        )}
      </div>
    </div>
  );
}
