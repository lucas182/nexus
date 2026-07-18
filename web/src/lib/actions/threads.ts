"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ThreadStatus } from "@/types/domain";

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
  redirect(`/thread/${data.id}`);
}

export async function updateThreadStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const workspaceId = String(formData.get("workspace_id"));
  const status = String(formData.get("status")) as ThreadStatus;

  const supabase = await createClient();
  const { error } = await supabase.from("threads").update({ status }).eq("id", id);
  if (error) throw error;

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
