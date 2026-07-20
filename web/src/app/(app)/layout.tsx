import { getWorkspaces } from "@/lib/data/workspaces";
import { getInboxCount } from "@/lib/data/inbox";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const [workspaces, inboxCount, { data: { user } }] = await Promise.all([getWorkspaces(), getInboxCount(), supabase.auth.getUser()]);
  return <AppShell workspaces={workspaces} inboxCount={inboxCount} userEmail={user?.email ?? null}>{children}</AppShell>;
}
