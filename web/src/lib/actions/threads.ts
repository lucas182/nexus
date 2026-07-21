"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCachedUser } from "@/lib/auth";
import type { ThreadStatus } from "@/types/domain";
import { logObservation } from "@/lib/behavior/log";

export async function createThread(formData: FormData) {
  const workspaceId = String(formData.get("workspace_id"));
  const title = String(formData.get("title") ?? "").trim();
  const objetivo = String(formData.get("objetivo") ?? "");
  if (!title) return;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("threads")
    .insert({ workspace_id: workspaceId, title, objetivo })
    .select("id")
    .single();
  if (error) throw error;

  revalidatePath(`/workspace/${workspaceId}`);
  redirect(`/thread/${data.id}?created=1`);
}

export async function updateThreadStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const workspaceId = String(formData.get("workspace_id"));
  const status = String(formData.get("status")) as ThreadStatus;

  const supabase = await createClient();
  const { error } = await supabase.from("threads").update({ status }).eq("id", id);
  if (error) throw error;

  after(() =>
    logObservation(status === "archived" ? "thread_archived" : "thread_status_changed", {
      entityId: id,
      threadId: id,
      workspaceId,
      metadata: { status },
    }),
  );

  revalidatePath(`/thread/${id}`);
  revalidatePath(`/workspace/${workspaceId}`);
}

export async function updateThreadSummary(formData: FormData) {
  const id = String(formData.get("id"));
  const resumo_vivo = String(formData.get("resumo_vivo") ?? "");
  const objetivo = String(formData.get("objetivo") ?? "");

  const supabase = await createClient();
  const { error } = await supabase
    .from("threads")
    .update({ resumo_vivo, objetivo })
    .eq("id", id);
  if (error) throw error;

  revalidatePath(`/thread/${id}`);
}

export async function deleteThread(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const workspaceId = String(formData.get("workspace_id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const user = await getCachedUser();
  if (!user) return;

  // RLS scopes threads to the owner (via workspace → user_id), so the delete
  // only touches the caller's own row. Events cascade via the FK.
  const { error } = await supabase.from("threads").delete().eq("id", id);
  if (error) throw error;

  // thread_id is intentionally omitted: the observations FK cascades on thread
  // delete, so we attach this signal to the (surviving) workspace instead.
  after(() =>
    logObservation("thread_status_changed", {
      entityId: id,
      workspaceId: workspaceId || null,
      metadata: { status: "deleted" },
    }),
  );

  if (workspaceId) {
    revalidatePath(`/workspace/${workspaceId}`);
    redirect(`/workspace/${workspaceId}?deleted=1`);
  }
  revalidatePath("/", "layout");
  redirect("/?deleted=1");
}
