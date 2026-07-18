import { createClient } from "@/lib/supabase/server";
import type { InboxItem } from "@/types/domain";

export async function getInboxItems(): Promise<InboxItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inbox_items")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getInboxCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("inbox_items")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) throw error;
  return count ?? 0;
}
