import Link from "next/link";
import { getInboxCount } from "@/lib/data/inbox";
import { getRecentEventsWithContext } from "@/lib/data/events";
import { getWorkspaces } from "@/lib/data/workspaces";
import { getStalledThreads, getInboxOverloadCount, daysSince } from "@/lib/data/insights";
import { getContinueContext, getDerivedContextsForWorkspaces } from "@/lib/data/context";
import { ContinueContextCard } from "@/components/resume-context-card";
import { PersonalTimelineSection } from "@/components/personal-timeline-section";
import { getDailyTimeline, getConsecutiveActiveDays } from "@/lib/behavior/metrics";

export default async function RadarPage() {
  const [
    inboxCount,
    inboxOverloadCount,
    workspaces,
    stalledThreads,
    recentEvents,
    continueContext,
    timeline,
    consecutiveActiveDays,
  ] = await Promise.all([
    getInboxCount(),
    getInboxOverloadCount(),
    getWorkspaces(),
    getStalledThreads(),
    getRecentEventsWithContext(8),
    getContinueContext(),
    getDailyTimeline(),
    getConsecutiveActiveDays(),
  ]);

  const contexts = await getDerivedContextsForWorkspaces(workspaces);
  const attention = contexts.filter(({ context }) => context.nextStep || context.majorRisk || context.lastDecision).slice(0, 4);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">Hoje</h1>
      </div>

      {/* Personal timeline — "o que eu fiz hoje" */}
      <div className="mb-6 animate-card-in">
        <PersonalTimelineSection timeline={timeline} consecutiveActiveDays={consecutiveActiveDays} />
      </div>

      {/* Continue where you left off */}
      {continueContext && (
        <div className="mb-5 animate-card-in">
          <ContinueContextCard item={continueContext} />
        </div>
      )}

      {/* Inbox attention banner */}
      {(inboxCount > 0 || inboxOverloadCount > 0) && (
        <Link
          href="/inbox"
          className="group mb-5 flex items-center gap-2 rounded-lg border border-accent-muted/50 bg-accent-soft/80 px-4 py-3 text-sm text-accent transition-all hover:border-accent-muted hover:bg-accent-soft"
        >
          <span className="flex-1">
            {inboxOverloadCount > 0
              ? `${inboxOverloadCount} captura${inboxOverloadCount > 1 ? "s" : ""} espera${inboxOverloadCount > 1 ? "m" : ""} atenção há mais de dois dias.`
              : `${inboxCount} captura${inboxCount > 1 ? "s" : ""} aguardando.`}
          </span>
          <span className="text-xs opacity-0 transition-opacity group-hover:opacity-100">
            Ver inbox →
          </span>
        </Link>
      )}

      {/* Attention cards — workspaces needing a look */}
      <div className="flex flex-col gap-2">
        {attention.map(({ workspace, context }) => (
          <Link
            key={workspace.id}
            href={`/workspace/${workspace.id}`}
            className="group block rounded-lg border border-border-light bg-surface p-4 transition-all hover:border-border hover:shadow-sm"
          >
            <p className="text-sm font-medium text-text-primary">{workspace.name}</p>
            {context.lastDecision && (
              <p className="mt-1 text-sm text-text-secondary">{context.lastDecision}</p>
            )}
            {context.majorRisk && (
              <p className="mt-1 text-xs text-red">Atenção: {context.majorRisk}</p>
            )}
            {context.nextStep && (
              <p className="mt-1.5 text-xs font-medium text-accent">{context.nextStep}</p>
            )}
          </Link>
        ))}
        {attention.length === 0 && inboxCount === 0 && !continueContext && (
          <div className="rounded-lg border border-dashed border-border py-12 text-center">
            <p className="text-sm text-text-tertiary">Nada mais merece sua atenção agora.</p>
          </div>
        )}
      </div>

      {/* Stalled threads */}
      {stalledThreads.length > 0 && (
        <section className="mt-7 animate-slide-up">
          <h2 className="mb-2 text-[11px] font-medium uppercase tracking-widest text-text-tertiary">
            Assuntos parados
          </h2>
          <div className="rounded-lg border border-border-light bg-surface overflow-hidden">
            {stalledThreads.slice(0, 3).map((thread) => (
              <Link
                key={thread.id}
                href={`/thread/${thread.id}`}
                className="flex items-center justify-between border-b border-border-light px-4 py-2.5 text-sm last:border-0 transition-colors hover:bg-hover"
              >
                <span className="text-text-primary">{thread.title}</span>
                <span className="text-xs text-text-tertiary">
                  {daysSince(thread.updated_at)}d · {thread.workspace_name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent changes */}
      {recentEvents.length > 0 && (
        <section className="mt-7 animate-slide-up">
          <h2 className="mb-2 text-[11px] font-medium uppercase tracking-widest text-text-tertiary">
            Mudou recentemente
          </h2>
          <div className="rounded-lg border border-border-light bg-surface overflow-hidden">
            {recentEvents.slice(0, 5).map((event) => (
              <Link
                key={event.id}
                href={`/thread/${event.thread_id}`}
                className="flex items-center justify-between border-b border-border-light px-4 py-2.5 text-sm last:border-0 transition-colors hover:bg-hover"
              >
                <span className="flex-1 truncate text-text-primary">{event.description}</span>
                <span className="ml-3 flex-shrink-0 text-xs text-text-tertiary">
                  {event.thread?.workspace?.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
