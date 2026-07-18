import { getInboxItems } from "@/lib/data/inbox";
import { getWorkspaces } from "@/lib/data/workspaces";
import { getAllThreads } from "@/lib/data/threads";
import { InboxCard } from "@/components/inbox-card";

export default async function InboxPage() {
  const [items, workspaces, threads] = await Promise.all([
    getInboxItems(),
    getWorkspaces(),
    getAllThreads(),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-text-primary">
        Inbox ({items.length})
      </h1>
      <p className="mb-6 max-w-md text-sm text-text-tertiary">
        Capturas rápidas aguardando destilação e alocação em contexto.
      </p>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <div className="mb-3 text-2xl opacity-30">✓</div>
          <div className="font-medium text-text-secondary">
            Inbox limpo e mente organizada.
          </div>
          <div className="mt-1 text-xs text-text-tertiary">
            Tudo está no seu devido contexto.
          </div>
        </div>
      ) : (
        items.map((item) => (
          <InboxCard key={item.id} item={item} workspaces={workspaces} threads={threads} />
        ))
      )}
    </div>
  );
}
