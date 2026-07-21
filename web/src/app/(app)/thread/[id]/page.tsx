import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { getThread } from "@/lib/data/threads";
import { getWorkspace } from "@/lib/data/workspaces";
import { getEventsByThread } from "@/lib/data/events";
import { getKnowledgeByThread } from "@/lib/data/knowledge";
import { ThreadDetailsPanel } from "@/components/thread-details-panel";
import { NewEventForm } from "@/components/new-event-form";
import { KnowledgeTypeBadge } from "@/components/badges";
import { KnowledgeConsolidator } from "@/components/knowledge-consolidator";
import { ThreadRowMenu } from "@/components/thread-row-menu";
import { logObservation } from "@/lib/behavior/log";
import { getThreadResumeContext } from "@/lib/data/context";
import { ResumeContextCard } from "@/components/resume-context-card";
import { CreatedToast } from "@/components/created-toast";

export default async function ThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const thread = await getThread(id);
  if (!thread) notFound();

  const [workspace, events, knowledgeItems, resume] = await Promise.all([
    getWorkspace(thread.workspace_id),
    getEventsByThread(id),
    getKnowledgeByThread(id),
    getThreadResumeContext(id),
  ]);
  if (!workspace) notFound();

  after(() =>
    logObservation("thread_opened", { threadId: id, workspaceId: thread.workspace_id }),
  );

  return (
    <div className="mx-auto max-w-2xl">
      {created === "1" && <CreatedToast label={`Assunto "${thread.title}" criado`} />}

      {/* Title + workspace context */}
      <div className="mb-7">
        <Link
          href={`/workspace/${workspace.id}`}
          className="inline-flex items-center gap-1 text-xs text-text-quaternary transition-colors hover:text-text-secondary mb-3"
        >
          ← {workspace.name}
        </Link>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-medium leading-snug tracking-tight text-text-primary">
            {thread.title}
          </h1>
          <div className="mt-1 flex-shrink-0">
            <ThreadRowMenu
              threadId={thread.id}
              workspaceId={workspace.id}
              threadTitle={thread.title}
              eventCount={events.length}
            />
          </div>
        </div>
      </div>

      {/* Thread context panel */}
      <div className="mb-5">
        <ThreadDetailsPanel
          thread={thread}
          workspaceId={workspace.id}
        />
      </div>

      {/* Resume from last visit */}
      <div className="mb-5">
        <ResumeContextCard resume={resume} />
      </div>

      {/* Knowledge items */}
      {knowledgeItems.length > 0 && (
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-text-quaternary">Knowledge</span>
            <span className="h-px flex-1 bg-border-light" />
          </div>
          <div className="flex flex-col gap-2">
            {knowledgeItems.map((k) => (
              <div key={k.id} className="rounded-[7px] border border-border-light bg-surface px-3.5 py-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-sm font-medium text-text-primary">{k.title}</span>
                  <KnowledgeTypeBadge type={k.type} />
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{k.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-text-quaternary">Timeline</span>
          <span className="h-px flex-1 bg-border-light" />
        </div>
        <div className="rounded-[7px] border border-border-light bg-surface px-3.5">
          <KnowledgeConsolidator threadId={thread.id} events={events} />
        </div>
        <NewEventForm threadId={thread.id} workspaceId={workspace.id} />
      </div>
    </div>
  );
}
