import { getWorkspaces } from "@/lib/data/workspaces";
import { getInboxCount } from "@/lib/data/inbox";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [workspaces, inboxCount] = await Promise.all([
    getWorkspaces(),
    getInboxCount(),
  ]);

  return (
    <AppShell workspaces={workspaces} inboxCount={inboxCount}>
      {children}
    </AppShell>
  );
}
