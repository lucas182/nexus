"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createKnowledge(formData: FormData) {
  const threadId = String(formData.get("thread_id"));
  const type = String(formData.get("type") ?? "consolidatedDecision");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const sourceEventIds = formData.getAll("source_event_ids").map(String);

  if (!title || !content || sourceEventIds.length === 0) return;

  const supabase = await createClient();
  const { error } = await supabase.from("knowledge").insert({
    thread_id: threadId,
    type,
    title,
    content,
    source_event_ids: sourceEventIds,
  });
  if (error) throw error;

  revalidatePath(`/thread/${threadId}`);
}
