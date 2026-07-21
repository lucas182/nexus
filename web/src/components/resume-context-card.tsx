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
    <div className="rounded-[7px] border border-accent-muted/40 bg-accent-soft/50 px-3.5 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-text-secondary truncate">
            Continue de <span className="font-medium text-text-primary">{item.workspaceName}</span>
            {item.threadTitle && <> · {item.threadTitle}</>}
          </p>
          <p className="text-[10px] text-text-quaternary mt-0.5">{timeAgo(item.lastVisitedAt)}</p>
        </div>
        <Link
          href={`/thread/${item.threadId}`}
          className="flex-shrink-0 rounded-[5px] bg-accent px-2.5 py-1.5 text-[11px] font-medium text-white transition-all duration-150 hover:bg-accent-hover active:scale-[0.97]"
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
    <div className="text-xs text-text-quaternary leading-relaxed">
      {count === 0
        ? "Nada mudou desde sua última visita."
        : `${count} ${count === 1 ? "novo acontecimento" : "novos acontecimentos"}`}
      {resume.decisionsSinceVisit.length > 0 && (
        <> · <span className="text-accent">{resume.decisionsSinceVisit.length} {resume.decisionsSinceVisit.length === 1 ? "decisão" : "decisões"}</span></>
      )}
    </div>
  );
}
