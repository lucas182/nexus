import { getInboxItems } from "@/lib/data/inbox";
import { getWorkspaces } from "@/lib/data/workspaces";
import { getAllThreads } from "@/lib/data/threads";
import { InboxList } from "@/components/inbox-list";

export default async function InboxPage() {
  const [items, workspaces, threads] = await Promise.all([getInboxItems(), getWorkspaces(), getAllThreads()]);
  return (
    <div className="mx-auto max-w-[640px]">
      <div className="mb-7">
        <h1 className="text-xl font-medium tracking-tight text-text-primary">Inbox</h1>
        <p className="mt-1 text-sm text-text-quaternary">Registre primeiro. Quando quiser, confirme o assunto.</p>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-text-quaternary">Inbox limpo. Nada precisa da sua atenção.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs text-text-quaternary">
            {items.length} {items.length === 1 ? "captura" : "capturas"}
          </p>
          <InboxList items={items} workspaces={workspaces} threads={threads} />
        </>
      )}
    </div>
  );
}
