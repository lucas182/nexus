"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createEvent(formData: FormData) {
  const threadId = String(formData.get("thread_id"));
  const workspaceId = String(formData.get("workspace_id") ?? "");
  const type = String(formData.get("type") ?? "note");
  const impact = String(formData.get("impact") ?? "medium");
  const description = String(formData.get("description") ?? "").trim();
  if (!description) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .insert({ thread_id: threadId, type, impact, description });
  if (error) throw error;

  revalidatePath(`/thread/${threadId}`);
  if (workspaceId) revalidatePath(`/workspace/${workspaceId}`);
}
