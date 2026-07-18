import Link from "next/link";
import { notFound } from "next/navigation";
import { getThread } from "@/lib/data/threads";
import { getWorkspace } from "@/lib/data/workspaces";
import { getEventsByThread } from "@/lib/data/events";
import { getKnowledgeByThread } from "@/lib/data/knowledge";
import { ThreadDetailsPanel } from "@/components/thread-details-panel";
import { EventItem } from "@/components/event-item";
import { NewEventForm } from "@/components/new-event-form";
import { KnowledgeTypeBadge } from "@/components/badges";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = await getThread(id);
  if (!thread) notFound();

  const [workspace, events, knowledgeItems] = await Promise.all([
    getWorkspace(thread.workspace_id),
    getEventsByThread(id),
    getKnowledgeByThread(id),
  ]);
  if (!workspace) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-1.5 text-xs text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">
          Radar
        </Link>
        <span>/</span>
        <Link href={`/workspace/${workspace.id}`} className="hover:text-text-secondary">
          {workspace.name}
        </Link>
        <span>/</span>
        <span className="text-text-secondary">{thread.title}</span>
      </div>

      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-text-primary">
        {thread.title}
      </h1>

      <div className="mb-6">
        <ThreadDetailsPanel thread={thread} workspaceId={workspace.id} />
      </div>

      {knowledgeItems.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-semibold text-text-primary">Knowledge Consolidado</h2>
          <div className="flex flex-col gap-2">
            {knowledgeItems.map((k) => (
              <div key={k.id} className="rounded-lg border border-border-light bg-surface p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">{k.title}</span>
                  <KnowledgeTypeBadge type={k.type} />
                </div>
                <p className="text-xs text-text-secondary">{k.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-2 text-sm font-semibold text-text-primary">Timeline de Acontecimentos</h2>
        <div className="rounded-lg border border-border-light bg-surface px-4">
          {events.length === 0 ? (
            <p className="py-6 text-center text-sm text-text-tertiary">
              Nenhum acontecimento registrado ainda.
            </p>
          ) : (
            events.map((event) => <EventItem key={event.id} event={event} />)
          )}
        </div>
        <NewEventForm threadId={thread.id} workspaceId={workspace.id} />
      </div>
    </div>
  );
}
