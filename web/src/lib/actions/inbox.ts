"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { suggestClassification } from "@/lib/heuristics";

export async function captureToInbox(formData: FormData) {
  const rawText = String(formData.get("raw_text") ?? "").trim();
  const attachmentUrl = String(formData.get("attachment_url") ?? "").trim();
  if (!rawText) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const suggestion = await suggestClassification(rawText);

  const { error } = await supabase.from("inbox_items").insert({
    user_id: user.id,
    raw_text: rawText,
    attachment_url: attachmentUrl || null,
    suggested_workspace_id: suggestion.workspaceId,
    suggested_thread_id: suggestion.threadId,
  });

  if (error) throw error;

  revalidatePath("/", "layout");
}

export async function classifyInboxItem(formData: FormData) {
  const inboxItemId = String(formData.get("inbox_item_id"));
  const threadId = String(formData.get("thread_id"));
  const eventType = String(formData.get("event_type") ?? "note");
  const impact = String(formData.get("impact") ?? "medium");
  const description = String(formData.get("description") ?? "");

  const supabase = await createClient();

  const { data: inboxItem } = await supabase
    .from("inbox_items")
    .select("attachment_url")
    .eq("id", inboxItemId)
    .maybeSingle();

  const metadata = inboxItem?.attachment_url
    ? { attachment_url: inboxItem.attachment_url }
    : {};

  const { error: eventError } = await supabase.from("events").insert({
    thread_id: threadId,
    type: eventType,
    description,
    impact,
    metadata,
  });
  if (eventError) throw eventError;

  const { error: inboxError } = await supabase
    .from("inbox_items")
    .update({ status: "classified" })
    .eq("id", inboxItemId);
  if (inboxError) throw inboxError;

  revalidatePath("/", "layout");
}

export async function discardInboxItem(formData: FormData) {
  const inboxItemId = String(formData.get("inbox_item_id"));

  const supabase = await createClient();
  const { error } = await supabase
    .from("inbox_items")
    .update({ status: "discarded" })
    .eq("id", inboxItemId);
  if (error) throw error;

  revalidatePath("/", "layout");
}
