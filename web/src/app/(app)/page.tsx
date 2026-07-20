import Link from "next/link";
import { getInboxCount } from "@/lib/data/inbox";
import { getRecentEventsWithContext } from "@/lib/data/events";
import { getWorkspaces } from "@/lib/data/workspaces";
import { getStalledThreads, getInboxOverloadCount, daysSince } from "@/lib/data/insights";
import { getContinueContext, getDerivedWorkspaceContext } from "@/lib/data/context";
import { ContinueContextCard } from "@/components/resume-context-card";

export default async function RadarPage() {
  const [inboxCount, inboxOverloadCount, workspaces, stalledThreads, recentEvents, continueContext] = await Promise.all([
    getInboxCount(), getInboxOverloadCount(), getWorkspaces(), getStalledThreads(), getRecentEventsWithContext(8), getContinueContext(),
  ]);
  const contexts = await Promise.all(workspaces.map(async (workspace) => ({ workspace, context: await getDerivedWorkspaceContext(workspace) })));
  const attention = contexts.filter(({ context }) => context.nextStep || context.majorRisk || context.lastDecision).slice(0, 4);

  return <div className="mx-auto max-w-3xl">
    <h1 className="mb-6 text-2xl font-semibold tracking-tight text-text-primary">Hoje</h1>
    {continueContext && <div className="mb-6"><ContinueContextCard item={continueContext} /></div>}
    {(inboxCount > 0 || inboxOverloadCount > 0) && <Link href="/inbox" className="mb-6 block rounded-lg border border-accent-muted bg-accent-soft p-4 text-sm text-accent">{inboxOverloadCount > 0 ? `${inboxOverloadCount} captura${inboxOverloadCount > 1 ? "s" : ""} espera${inboxOverloadCount > 1 ? "m" : ""} atenção há mais de dois dias.` : `${inboxCount} captura${inboxCount > 1 ? "s" : ""} aguardando um assunto.`}</Link>}
    <div className="flex flex-col gap-3">
      {attention.map(({ workspace, context }) => <Link key={workspace.id} href={`/workspace/${workspace.id}`} className="rounded-lg border border-border-light bg-surface p-5 transition-colors hover:border-border"><p className="text-sm font-semibold text-text-primary">{workspace.name}</p>{context.lastDecision && <p className="mt-2 text-sm text-text-secondary">{context.lastDecision}</p>}{context.majorRisk && <p className="mt-2 text-sm text-red-600">Atenção: {context.majorRisk}</p>}{context.nextStep && <p className="mt-3 text-xs font-medium text-accent">{context.nextStep}</p>}</Link>)}
      {attention.length === 0 && inboxCount === 0 && <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-text-tertiary">Nada mais merece sua atenção agora.</div>}
    </div>
    {stalledThreads.length > 0 && <section className="mt-8"><h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">Assuntos que podem precisar de retomada</h2><div className="rounded-lg border border-border-light bg-surface">{stalledThreads.slice(0, 3).map((thread) => <Link key={thread.id} href={`/thread/${thread.id}`} className="flex items-center justify-between border-b border-border-light px-4 py-3 text-sm last:border-0 hover:bg-hover"><span className="text-text-primary">{thread.title}</span><span className="text-xs text-text-tertiary">{daysSince(thread.updated_at)} dias · {thread.workspace_name}</span></Link>)}</div></section>}
    {recentEvents.length > 0 && <section className="mt-8"><h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">Mudou recentemente</h2><div className="rounded-lg border border-border-light bg-surface">{recentEvents.slice(0, 5).map((event) => <Link key={event.id} href={`/thread/${event.thread_id}`} className="block border-b border-border-light px-4 py-3 text-sm last:border-0 hover:bg-hover"><span className="text-text-primary">{event.description}</span><span className="ml-2 text-xs text-text-tertiary">{event.thread?.workspace?.name}</span></Link>)}</div></section>}
  </div>;
}
