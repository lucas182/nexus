import Link from "next/link";
import type { ContinueContext, ResumeContext } from "@/lib/data/context";

function timeAgo(value: string) {
  const hours = Math.floor((Date.now() - new Date(value).getTime()) / 3_600_000);
  if (hours < 1) return "agora";
  if (hours < 24) return `há ${hours}h`;
  return `há ${Math.floor(hours / 24)}d`;
}

export function ContinueContextCard({ item }: { item: ContinueContext }) {
  return (
    <div className="rounded-lg border border-accent-muted/50 bg-accent-soft/50 p-3.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-text-secondary">
            Continue de <strong>{item.workspaceName}</strong> · {item.threadTitle}
          </p>
          <p className="text-[10px] text-text-tertiary mt-0.5">última visita {timeAgo(item.lastVisitedAt)}</p>
        </div>
        <Link
          href={`/thread/${item.threadId}`}
          className="flex-shrink-0 rounded-md bg-accent px-2.5 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
        >
          Continuar
        </Link>
      </div>
    </div>
  );
}

export function ResumeContextCard({ resume }: { resume: ResumeContext }) {
  if (!resume.lastVisitedAt) return null;
  const count = resume.eventsSinceVisit.length;
  return (
    <div className="rounded-lg border border-border-light bg-surface p-3">
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <span className="text-text-tertiary">Desde sua última visita</span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span>
          {count === 0
            ? "Nada mudou."
            : `${count} ${count === 1 ? "novo acontecimento" : "novos acontecimentos"}`}
        </span>
        {resume.decisionsSinceVisit.length > 0 && (
          <>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="text-accent">
              {resume.decisionsSinceVisit.length} {" "}
              {resume.decisionsSinceVisit.length === 1 ? "decisão" : "decisões"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
