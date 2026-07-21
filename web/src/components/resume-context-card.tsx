import Link from "next/link";
import type { ContinueContext, ResumeContext } from "@/lib/data/context";

function timeAgo(value: string) {
  const hours = Math.floor((Date.now() - new Date(value).getTime()) / 3_600_000);
  if (hours < 1) return "há pouco";
  if (hours < 24) return `há ${hours}h`;
  return `há ${Math.floor(hours / 24)} dias`;
}

export function ContinueContextCard({ item }: { item: ContinueContext }) {
  return (
    <div className="rounded-lg border border-accent-muted/50 bg-accent-soft/50 p-4">
      <p className="text-[10px] font-medium uppercase tracking-widest text-text-tertiary">Continue de onde parou</p>
      <div className="mt-2.5">
        <p className="text-sm font-medium text-text-primary">{item.workspaceName}</p>
        <p className="text-sm text-text-secondary mt-0.5">{item.threadTitle}</p>
        <p className="mt-1 text-[11px] text-text-tertiary">Última visita {timeAgo(item.lastVisitedAt)}</p>
      </div>
      <Link
        href={`/thread/${item.threadId}`}
        className="mt-3 inline-flex h-7 items-center rounded-md bg-accent px-3 text-[11px] font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
      >
        Continuar
      </Link>
    </div>
  );
}

export function ResumeContextCard({ resume }: { resume: ResumeContext }) {
  if (!resume.lastVisitedAt) return null;
  return (
    <div className="rounded-lg border border-border-light bg-surface p-3.5">
      <h2 className="text-[10px] font-medium uppercase tracking-widest text-text-tertiary">Desde a última vez</h2>
      <p className="mt-1.5 text-sm text-text-primary">
        {resume.eventsSinceVisit.length === 0
          ? "Nada mudou neste assunto desde sua última visita."
          : `${resume.eventsSinceVisit.length} acontecimento${resume.eventsSinceVisit.length > 1 ? "s" : ""} registrado${resume.eventsSinceVisit.length > 1 ? "s" : ""}.`}
      </p>
      {resume.decisionsSinceVisit.length > 0 && (
        <p className="mt-1 text-[11px] text-accent">Decisão: {resume.decisionsSinceVisit[0].description}</p>
      )}
    </div>
  );
}
