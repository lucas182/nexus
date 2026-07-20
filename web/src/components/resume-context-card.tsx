import Link from "next/link";
import type { ContinueContext, ResumeContext } from "@/lib/data/context";

function timeAgo(value: string) {
  const hours = Math.floor((Date.now() - new Date(value).getTime()) / 3_600_000);
  if (hours < 1) return "há pouco";
  if (hours < 24) return `há ${hours}h`;
  return `há ${Math.floor(hours / 24)} dias`;
}

export function ContinueContextCard({ item }: { item: ContinueContext }) {
  return <div className="rounded-lg border border-border-light bg-surface p-5"><p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Continue de onde parou</p><div className="mt-3"><p className="text-sm font-semibold text-text-primary">{item.workspaceName}</p><p className="text-sm text-text-secondary">{item.threadTitle}</p><p className="mt-1 text-xs text-text-tertiary">Última visita {timeAgo(item.lastVisitedAt)}</p></div><Link href={`/thread/${item.threadId}`} className="mt-4 inline-flex rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover">Continuar</Link></div>;
}

export function ResumeContextCard({ resume }: { resume: ResumeContext }) {
  if (!resume.lastVisitedAt) return null;
  return <div className="rounded-lg border border-border-light bg-surface p-4"><h2 className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Desde a última vez</h2><p className="mt-2 text-sm text-text-primary">{resume.eventsSinceVisit.length === 0 ? "Nada mudou neste assunto desde sua última visita." : `${resume.eventsSinceVisit.length} acontecimento${resume.eventsSinceVisit.length > 1 ? "s" : ""} registrado${resume.eventsSinceVisit.length > 1 ? "s" : ""}.`}</p>{resume.decisionsSinceVisit.length > 0 && <p className="mt-1 text-xs text-accent">Decisão: {resume.decisionsSinceVisit[0].description}</p>}</div>;
}
