import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { getWorkspace } from "@/lib/data/workspaces";
import { getThreadsByWorkspace } from "@/lib/data/threads";
import { getEventsByThreadIds } from "@/lib/data/events";
import { WorkspaceContextPanel } from "@/components/workspace-context-panel";
import { ThreadCard } from "@/components/thread-card";
import { NewThreadForm } from "@/components/new-thread-form";
import { getStalledThreads, daysSince } from "@/lib/data/insights";
import { InsightChip } from "@/components/insight-chip";
import { logObservation } from "@/lib/behavior/log";
import { CreatedToast } from "@/components/created-toast";
import { getDerivedWorkspaceContext, getWorkspaceResumeContext } from "@/lib/data/context";
import { ResumeContextCard } from "@/components/resume-context-card";

export default async function WorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; deleted?: string }>;
}) {
  const { id } = await params;
  const { created, deleted } = await searchParams;
  const workspace = await getWorkspace(id);
  if (!workspace) notFound();

  const threads = await getThreadsByWorkspace(id);
  const [eventsByThread, stalledThreadsRaw, resume] = await Promise.all([
    getEventsByThreadIds(threads.map((t) => t.id)),
    getStalledThreads(),
    getWorkspaceResumeContext(id),
  ]);

  const threadsWithEvents = threads.map((thread) => ({
    thread,
    events: eventsByThread.get(thread.id) ?? [],
  }));

  const eventsDesc = [...eventsByThread.values()]
    .flat()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const threadsByUpdatedDesc = [...threads].sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at),
  );
  const derivedContext = await getDerivedWorkspaceContext(workspace, {
    threads: threadsByUpdatedDesc,
    events: eventsDesc,
  });

  const stalledThreads = stalledThreadsRaw.filter((t) => t.workspace_id === id);

  after(() => logObservation("workspace_opened", { workspaceId: id }));

  return (
    <div className="mx-auto max-w-[640px]">
      {created === "1" && <CreatedToast label={`Workspace "${workspace.name}" criado`} />}
      {deleted === "1" && <CreatedToast label={`Thread removida`} />}

      {/* Back link + header */}
      <div className="mb-7">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-text-quaternary transition-colors hover:text-text-secondary mb-3"
        >
          ← Radar
        </Link>
        <h1 className="text-xl font-medium tracking-tight text-text-primary">{workspace.name}</h1>
        {workspace.description && (
          <p className="mt-0.5 text-sm text-text-quaternary">{workspace.description}</p>
        )}
      </div>

      {/* Context panel */}
      <div className="mb-5">
        <WorkspaceContextPanel workspace={workspace} context={derivedContext} />
      </div>

      {/* Resume */}
      <div className="mb-5">
        <ResumeContextCard resume={resume} />
      </div>

      {/* Stalled threads alerts */}
      {stalledThreads.length > 0 && (
        <div className="mb-5 flex flex-col gap-2">
          {stalledThreads.map((t) => (
            <InsightChip key={t.id}>
              A Thread <strong>{t.title}</strong> está sem novos acontecimentos há{" "}
              {daysSince(t.updated_at)} dias.
            </InsightChip>
          ))}
        </div>
      )}

      {/* Threads */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-text-quaternary">Assuntos</span>
          <span className="h-px flex-1 bg-border-light" />
        </div>
        <NewThreadForm workspaceId={workspace.id} />
        {threadsWithEvents.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-text-quaternary">Nenhum assunto ainda.</p>
          </div>
        ) : (
          threadsWithEvents.map(({ thread, events }, i) => (
            <div key={thread.id} className="animate-slide-up" style={{ animationDelay: `${Math.min(i, 6) * 30}ms` }}>
              <ThreadCard thread={thread} recentEvents={events} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
