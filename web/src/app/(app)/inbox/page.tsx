import { getInboxItems } from "@/lib/data/inbox";
import { getWorkspaces } from "@/lib/data/workspaces";
import { getAllThreads } from "@/lib/data/threads";
import { InboxList } from "@/components/inbox-list";

export default async function InboxPage() {
  const [items, workspaces, threads] = await Promise.all([getInboxItems(), getWorkspaces(), getAllThreads()]);
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">Inbox</h1>
        <p className="mt-1 text-sm text-text-tertiary">Registre primeiro. Quando quiser, confirme o assunto.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <div className="mb-2 text-2xl text-text-tertiary/40">✓</div>
          <p className="font-medium text-text-secondary">Inbox limpo.</p>
          <p className="mt-1 text-xs text-text-tertiary">Nada precisa da sua atenção agora.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs text-text-tertiary">
            {items.length} {items.length === 1 ? "captura" : "capturas"} aguardando
          </p>
          <InboxList items={items} workspaces={workspaces} threads={threads} />
        </>
      )}
    </div>
  );
}
