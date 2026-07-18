import { createClient } from "@/lib/supabase/server";
import type { Thread } from "@/types/domain";

export async function getThreadsByWorkspace(workspaceId: string): Promise<Thread[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("threads")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getThread(id: string): Promise<Thread | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("threads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** All threads across every workspace the current user owns (RLS-scoped). */
export async function getAllThreads(): Promise<Thread[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("threads")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}
