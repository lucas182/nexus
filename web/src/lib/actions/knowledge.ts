"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logObservation } from "@/lib/behavior/log";

export async function createKnowledge(formData: FormData) {
  const threadId = String(formData.get("thread_id"));
  const type = String(formData.get("type") ?? "consolidatedDecision");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const sourceEventIds = formData.getAll("source_event_ids").map(String);

  if (!title || !content || sourceEventIds.length === 0) return;

  const supabase = await createClient();
  const [{ data, error }, { data: thread }] = await Promise.all([
    supabase
      .from("knowledge")
      .insert({
        thread_id: threadId,
        type,
        title,
        content,
        source_event_ids: sourceEventIds,
      })
      .select("id")
      .single(),
    supabase.from("threads").select("workspace_id").eq("id", threadId).maybeSingle(),
  ]);
  if (error) throw error;

  after(() =>
    logObservation("knowledge_consolidated", {
      entityId: data.id,
      threadId,
      workspaceId: thread?.workspace_id,
      metadata: { knowledge_type: type, source_event_count: sourceEventIds.length },
    }),
  );

  revalidatePath(`/thread/${threadId}`);
}
