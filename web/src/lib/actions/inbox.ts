"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { suggestClassification } from "@/lib/heuristics";
import { logObservation } from "@/lib/behavior/log";
import type { EventType, ImpactLevel } from "@/types/domain";

type Classification = {
  inboxItemId: string;
  threadId?: string;
  workspaceId?: string;
  newThreadTitle?: string;
  eventType?: EventType;
  impact?: ImpactLevel;
};

function optionalString(value: FormDataEntryValue | null) {
  const result = String(value ?? "").trim();
  return result || undefined;
}

async function createEventFromCapture(input: Classification) {
  const supabase = await createClient();
  const { data: item, error: itemError } = await supabase
    .from("inbox_items")
    .select("id, raw_text, attachment_url, status")
    .eq("id", input.inboxItemId)
    .maybeSingle();
  if (itemError) throw itemError;
  if (!item || item.status !== "pending") return;

  let threadId = input.threadId;
  let workspaceId = input.workspaceId;
  if (!threadId && input.newThreadTitle && workspaceId) {
    const { data: newThread, error } = await supabase
      .from("threads")
      .insert({ workspace_id: workspaceId, title: input.newThreadTitle, status: "in_progress" })
      .select("id")
      .single();
    if (error) throw error;
    threadId = newThread.id;
  }
  if (!threadId) throw new Error("Escolha ou crie um assunto para esta captura.");

  const { data: thread, error: threadError } = await supabase
    .from("threads")
    .select("workspace_id")
    .eq("id", threadId)
    .maybeSingle();
  if (threadError) throw threadError;
  if (!thread) throw new Error("Assunto não encontrado.");
  workspaceId = thread.workspace_id;
  await supabase.from("threads").update({ status: "in_progress" }).eq("id", threadId).eq("status", "created");

  const metadata = {
    source: "capture",
    ...(item.attachment_url ? { attachment_url: item.attachment_url } : {}),
  };
  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({
      thread_id: threadId,
      type: input.eventType ?? "note",
      impact: input.impact ?? "medium",
      description: item.raw_text,
      metadata,
      source_inbox_item_id: item.id,
    })
    .select("id")
    .single();

  // A unique source_inbox_item_id makes retry safe after a network interruption.
  if (eventError && eventError.code !== "23505") throw eventError;

  const { error: inboxError } = await supabase
    .from("inbox_items")
    .update({ status: "classified" })
    .eq("id", item.id)
    .eq("status", "pending");
  if (inboxError) throw inboxError;

  await logObservation("inbox_item_classified", {
    entityId: item.id,
    threadId,
    workspaceId,
  });
  if (event) {
    await logObservation("event_created", {
      entityId: event.id,
      threadId,
      workspaceId,
      metadata: { event_type: input.eventType ?? "note", source: "capture" },
    });
  }
}

/** One capture primitive. With a known subject it becomes an Event immediately; otherwise it waits in Inbox. */
export async function captureToInbox(formData: FormData) {
  const rawText = optionalString(formData.get("raw_text"));
  const attachmentUrl = optionalString(formData.get("attachment_url"));
  const contextualThreadId = optionalString(formData.get("thread_id"));
  const contextualWorkspaceId = optionalString(formData.get("workspace_id"));
  if (!rawText) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const suggestion = contextualThreadId
    ? { workspaceId: contextualWorkspaceId ?? null, threadId: contextualThreadId }
    : await suggestClassification(rawText);
  const { data: inserted, error } = await supabase
    .from("inbox_items")
    .insert({
      user_id: user.id,
      raw_text: rawText,
      attachment_url: attachmentUrl ?? null,
      suggested_workspace_id: suggestion.workspaceId,
      suggested_thread_id: suggestion.threadId,
    })
    .select("id")
    .single();
  if (error) throw error;

  await logObservation("capture_created", {
    entityId: inserted.id,
    workspaceId: suggestion.workspaceId ?? undefined,
    threadId: suggestion.threadId ?? undefined,
  });

  if (contextualThreadId) {
    await createEventFromCapture({
      inboxItemId: inserted.id,
      threadId: contextualThreadId,
      workspaceId: contextualWorkspaceId,
    });
  }
  revalidatePath("/", "layout");
}

export async function classifyInboxItem(formData: FormData) {
  await createEventFromCapture({
    inboxItemId: String(formData.get("inbox_item_id")),
    threadId: optionalString(formData.get("thread_id")),
    workspaceId: optionalString(formData.get("workspace_id")),
    newThreadTitle: optionalString(formData.get("new_thread_title")),
    eventType: (optionalString(formData.get("event_type")) as EventType | undefined) ?? "note",
    impact: (optionalString(formData.get("impact")) as ImpactLevel | undefined) ?? "medium",
  });
  revalidatePath("/", "layout");
}

export async function classifyInboxItems(formData: FormData) {
  const itemIds = formData.getAll("inbox_item_ids").map(String).filter(Boolean);
  const workspaceId = optionalString(formData.get("workspace_id"));
  const threadId = optionalString(formData.get("thread_id"));
  const newThreadTitle = optionalString(formData.get("new_thread_title"));
  if (!itemIds.length || (!threadId && !(workspaceId && newThreadTitle))) return;

  let createdThreadId = threadId;
  for (const inboxItemId of itemIds) {
    await createEventFromCapture({
      inboxItemId,
      threadId: createdThreadId,
      workspaceId,
      newThreadTitle: createdThreadId ? undefined : newThreadTitle,
    });
    if (!createdThreadId && newThreadTitle && workspaceId) {
      const supabase = await createClient();
      const { data } = await supabase
        .from("threads")
        .select("id")
        .eq("workspace_id", workspaceId)
        .eq("title", newThreadTitle)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      createdThreadId = data?.id;
    }
  }
  revalidatePath("/", "layout");
}

export async function discardInboxItem(formData: FormData) {
  const inboxItemId = String(formData.get("inbox_item_id"));
  const supabase = await createClient();
  const { error } = await supabase.from("inbox_items").update({ status: "discarded" }).eq("id", inboxItemId);
  if (error) throw error;
  revalidatePath("/", "layout");
}
