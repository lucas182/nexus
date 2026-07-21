import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { getWorkspace } from "@/lib/data/workspaces";
import { getThreadsByWorkspace } from "@/lib/data/threads";
import { getEventsByThreadIds } from "@/lib/data/events";
import { WorkspaceContextPanel } from "@/components/workspace-context-panel";
import { ThreadCard } from "@/components/thread-card";
import { NewThreadForm } from "@/components/new-thread-form";
import { WorkspaceIcon } from "@/lib/icon-map";
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
    <div className="mx-auto max-w-2xl">
      {created === "1" && <CreatedToast label={`Workspace "${workspace.name}" criado`} />}
      {deleted === "1" && <CreatedToast label={`Thread removida do workspace`} />}

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5 text-xs text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary transition-colors">Radar</Link>
        <span className="text-text-tertiary/50">/</span>
        <span className="text-text-secondary">{workspace.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <WorkspaceIcon slug={workspace.icon} size={18} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-text-primary">
              {workspace.name}
            </h1>
            {workspace.description && (
              <p className="mt-0.5 text-sm text-text-tertiary">{workspace.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Context panel */}
      <div className="mb-6">
        <WorkspaceContextPanel workspace={workspace} context={derivedContext} />
      </div>

      {/* Resume */}
      <div className="mb-6">
        <ResumeContextCard resume={resume} />
      </div>

      {/* Stalled threads alerts */}
      {stalledThreads.length > 0 && (
        <div className="mb-6 flex flex-col gap-2">
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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Assuntos</h2>
        </div>
        <NewThreadForm workspaceId={workspace.id} />
        {threadsWithEvents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-10 text-center">
            <p className="text-sm text-text-tertiary">Nenhuma Thread ainda. Crie a primeira acima.</p>
          </div>
        ) : (
          threadsWithEvents.map(({ thread, events }, i) => (
            <div key={thread.id} className="animate-card-in" style={{ animationDelay: `${Math.min(i, 6) * 30}ms` }}>
              <ThreadCard thread={thread} recentEvents={events} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
