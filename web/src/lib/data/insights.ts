import { createClient } from "@/lib/supabase/server";

const STALLED_THREAD_DAYS = 7;
const INBOX_OVERLOAD_HOURS = 48;

export interface StalledThread {
  id: string;
  title: string;
  updated_at: string;
  workspace_id: string;
  workspace_name: string;
}

/** Threads in progress with no new Event in STALLED_THREAD_DAYS days (bumped via DB trigger on each Event insert). */
export async function getStalledThreads(): Promise<StalledThread[]> {
  const supabase = await createClient();
  const cutoff = new Date(Date.now() - STALLED_THREAD_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("threads")
    .select("id, title, updated_at, workspace_id, workspace:workspaces(name)")
    .eq("status", "in_progress")
    .lt("updated_at", cutoff)
    .order("updated_at", { ascending: true });

  if (error) throw error;

  return (data as unknown as Array<{
    id: string;
    title: string;
    updated_at: string;
    workspace_id: string;
    workspace: { name: string } | null;
  }>).map((t) => ({
    id: t.id,
    title: t.title,
    updated_at: t.updated_at,
    workspace_id: t.workspace_id,
    workspace_name: t.workspace?.name ?? "",
  }));
}

/** Pending Inbox items older than INBOX_OVERLOAD_HOURS hours — a signal of attention overload. */
export async function getInboxOverloadCount(): Promise<number> {
  const supabase = await createClient();
  const cutoff = new Date(Date.now() - INBOX_OVERLOAD_HOURS * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("inbox_items")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")
    .lt("created_at", cutoff);

  if (error) throw error;
  return count ?? 0;
}

export function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (24 * 60 * 60 * 1000));
}
