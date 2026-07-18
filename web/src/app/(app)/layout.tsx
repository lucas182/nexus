import { getWorkspaces } from "@/lib/data/workspaces";
import { getInboxCount } from "@/lib/data/inbox";
import { getMostActiveWorkspace } from "@/lib/behavior/metrics";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const [workspaces, inboxCount, mostActiveWorkspace, { data: { user } }] = await Promise.all([
    getWorkspaces(),
    getInboxCount(),
    getMostActiveWorkspace(),
    supabase.auth.getUser(),
  ]);

  return (
    <AppShell
      workspaces={workspaces}
      inboxCount={inboxCount}
      mostActiveWorkspaceId={mostActiveWorkspace?.workspace_id ?? null}
      userEmail={user?.email ?? null}
    >
      {children}
    </AppShell>
  );
}
