import { notFound } from "next/navigation";
import { getWorkspace } from "@/lib/data/workspaces";
import { getThreadsByWorkspace } from "@/lib/data/threads";
import { getEventsByThread } from "@/lib/data/events";
import { WorkspaceContextPanel } from "@/components/workspace-context-panel";
import { ThreadCard } from "@/components/thread-card";
import { NewThreadForm } from "@/components/new-thread-form";
import { WorkspaceIcon } from "@/lib/icon-map";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workspace = await getWorkspace(id);
  if (!workspace) notFound();

  const threads = await getThreadsByWorkspace(id);
  const threadsWithEvents = await Promise.all(
    threads.map(async (thread) => ({
      thread,
      events: await getEventsByThread(thread.id),
    })),
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <WorkspaceIcon slug={workspace.icon} size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            {workspace.name}
          </h1>
          {workspace.description && (
            <p className="text-sm text-text-tertiary">{workspace.description}</p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <WorkspaceContextPanel workspace={workspace} />
      </div>

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
            <ThreadCard key={thread.id} thread={thread} recentEvents={events} />
          ))
        )}
      </div>
    </div>
  );
}
