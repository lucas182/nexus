import { createClient } from "@/lib/supabase/server";
import type { Knowledge } from "@/types/domain";

export async function getKnowledgeByThread(threadId: string): Promise<Knowledge[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge")
    .select("*")
    .eq("thread_id", threadId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}
