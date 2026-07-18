import { notFound } from "next/navigation";
import { getWorkspace } from "@/lib/data/workspaces";
import { getThreadsByWorkspace } from "@/lib/data/threads";
import { getEventsByThread } from "@/lib/data/events";
import { WorkspaceContextPanel } from "@/components/workspace-context-panel";
import { ThreadCard } from "@/components/thread-card";
import { NewThreadForm } from "@/components/new-thread-form";
import { WorkspaceIcon } from "@/lib/icon-map";
import { getStalledThreads, daysSince } from "@/lib/data/insights";
import { InsightChip } from "@/components/insight-chip";
import { logObservation } from "@/lib/behavior/log";
import { getWorkspaceActivityCount, getThreadActivityMap } from "@/lib/behavior/metrics";
import { WorkspaceActivityBadge } from "@/components/workspace-activity-badge";
import { CreatedToast } from "@/components/created-toast";
import { DeleteWorkspaceButton } from "@/components/delete-workspace-button";

export default async function WorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const workspace = await getWorkspace(id);
  if (!workspace) notFound();

  await logObservation("workspace_opened", { workspaceId: id });

  const threads = await getThreadsByWorkspace(id);
  const threadsWithEvents = await Promise.all(
    threads.map(async (thread) => ({
      thread,
      events: await getEventsByThread(thread.id),
    })),
  );

  const [stalledThreadsRaw, activityCount, threadActivity] = await Promise.all([
    getStalledThreads(),
    getWorkspaceActivityCount(id),
    getThreadActivityMap(threads.map((t) => t.id)),
  ]);
  const stalledThreads = stalledThreadsRaw.filter((t) => t.workspace_id === id);

  return (
    <div className="mx-auto max-w-2xl">
      {created === "1" && <CreatedToast label={`Workspace "${workspace.name}" criado`} />}
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <WorkspaceIcon slug={workspace.icon} size={20} strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                {workspace.name}
              </h1>
              <WorkspaceActivityBadge count={activityCount} />
            </div>
            {workspace.description && (
              <p className="text-sm text-text-tertiary">{workspace.description}</p>
            )}
          </div>
        </div>
        <DeleteWorkspaceButton workspaceId={workspace.id} workspaceName={workspace.name} />
      </div>

      <div className="mb-8">
        <WorkspaceContextPanel workspace={workspace} />
      </div>

      {stalledThreads.length > 0 && (
        <div className="mb-8 flex flex-col gap-2">
          {stalledThreads.map((t) => (
            <InsightChip key={t.id}>
              A Thread <strong>{t.title}</strong> está sem novos acontecimentos há{" "}
              {daysSince(t.updated_at)} dias.
            </InsightChip>
          ))}
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Assuntos Vivos (Threads)</h2>
        </div>
        <NewThreadForm workspaceId={workspace.id} />
        {threadsWithEvents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-text-tertiary">
            Nenhuma Thread ainda. Crie a primeira acima.
          </div>
        ) : (
          threadsWithEvents.map(({ thread, events }) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              recentEvents={events}
              lastObservedAt={threadActivity[thread.id]?.last_observed_at ?? null}
            />
          ))
        )}
      </div>
    </div>
  );
}
