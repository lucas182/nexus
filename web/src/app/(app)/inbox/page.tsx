import { getInboxItems } from "@/lib/data/inbox";
import { getWorkspaces } from "@/lib/data/workspaces";
import { getAllThreads } from "@/lib/data/threads";
import { InboxList } from "@/components/inbox-list";

export default async function InboxPage() {
  const [items, workspaces, threads] = await Promise.all([getInboxItems(), getWorkspaces(), getAllThreads()]);
  return <div className="mx-auto max-w-2xl">
    <h1 className="mb-1 text-2xl font-semibold tracking-tight text-text-primary">Inbox ({items.length})</h1>
    <p className="mb-6 max-w-md text-sm text-text-tertiary">Registre primeiro. Quando quiser, confirme o assunto — o restante é opcional.</p>
    {items.length === 0 ? <div className="rounded-lg border border-dashed border-border py-16 text-center"><div className="mb-3 text-2xl opacity-30">✓</div><div className="font-medium text-text-secondary">Inbox limpo.</div><div className="mt-1 text-xs text-text-tertiary">Nada precisa da sua atenção agora.</div></div> : <InboxList items={items} workspaces={workspaces} threads={threads} />}
  </div>;
}
