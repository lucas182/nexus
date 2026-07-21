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
    <div className="mx-auto max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-xl font-medium tracking-tight text-text-primary">Hoje</h1>
      </div>

      {/* Personal timeline */}
      <div className="mb-5 animate-slide-up">
        <PersonalTimelineSection timeline={timeline} consecutiveActiveDays={consecutiveActiveDays} />
      </div>

      {/* Continue where you left off */}
      {continueContext && (
        <div className="mb-4 animate-slide-up">
          <ContinueContextCard item={continueContext} />
        </div>
      )}

      {/* Inbox attention banner */}
      {(inboxCount > 0 || inboxOverloadCount > 0) && (
        <Link
          href="/inbox"
          className="group mb-4 flex items-center gap-2 rounded-[7px] border border-accent-muted/40 bg-accent-soft/70 px-3.5 py-2.5 text-sm text-accent transition-all hover:border-accent-muted/60 hover:bg-accent-soft"
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

      {/* Attention — workspaces needing a look */}
      <div className="flex flex-col gap-2">
        {attention.map(({ workspace, context }) => (
          <Link
            key={workspace.id}
            href={`/workspace/${workspace.id}`}
            className="group block rounded-[7px] border border-border-light bg-surface px-3.5 py-3 transition-all hover:border-border hover:shadow-xs"
          >
            <p className="text-sm font-medium text-text-primary">{workspace.name}</p>
            {context.lastDecision && (
              <p className="mt-1 text-sm text-text-secondary leading-snug">{context.lastDecision}</p>
            )}
            {context.majorRisk && (
              <p className="mt-1 text-xs text-red">{context.majorRisk}</p>
            )}
            {context.nextStep && (
              <p className="mt-1.5 text-xs font-medium text-accent">{context.nextStep}</p>
            )}
          </Link>
        ))}
        {attention.length === 0 && inboxCount === 0 && !continueContext && (
          <div className="py-16 text-center">
            <p className="text-sm text-text-quaternary">Nada precisa da sua atenção agora.</p>
          </div>
        )}
      </div>

      {/* Stalled threads */}
      {stalledThreads.length > 0 && (
        <section className="mt-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px flex-1 bg-border-light" />
            <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-text-quaternary">
              Assuntos parados
            </span>
            <span className="h-px flex-1 bg-border-light" />
          </div>
          <div className="rounded-[7px] border border-border-light bg-surface overflow-hidden">
            {stalledThreads.slice(0, 3).map((thread, idx) => (
              <Link
                key={thread.id}
                href={`/thread/${thread.id}`}
                className={`flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors hover:bg-hover ${
                  idx < Math.min(stalledThreads.length, 3) - 1 ? "border-b border-border-light" : ""
                }`}
              >
                <span className="text-text-primary">{thread.title}</span>
                <span className="text-xs text-text-quaternary">
                  {daysSince(thread.updated_at)}d · {thread.workspace_name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent changes */}
      {recentEvents.length > 0 && (
        <section className="mt-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px flex-1 bg-border-light" />
            <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-text-quaternary">
              Mudou recentemente
            </span>
            <span className="h-px flex-1 bg-border-light" />
          </div>
          <div className="rounded-[7px] border border-border-light bg-surface overflow-hidden">
            {recentEvents.slice(0, 5).map((event, idx) => (
              <Link
                key={event.id}
                href={`/thread/${event.thread_id}`}
                className={`flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors hover:bg-hover ${
                  idx < Math.min(recentEvents.length, 5) - 1 ? "border-b border-border-light" : ""
                }`}
              >
                <span className="flex-1 truncate text-text-primary">{event.description}</span>
                <span className="ml-3 flex-shrink-0 text-xs text-text-quaternary">
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
