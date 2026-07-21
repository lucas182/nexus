import { getWorkspaces } from "@/lib/data/workspaces";
import { getInboxCount } from "@/lib/data/inbox";
import { AppShell } from "@/components/app-shell";
import { getCachedUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [workspaces, inboxCount, user] = await Promise.all([
    getWorkspaces(),
    getInboxCount(),
    getCachedUser(),
  ]);
  return <AppShell workspaces={workspaces} inboxCount={inboxCount} userEmail={user?.email ?? null}>{children}</AppShell>;
}
