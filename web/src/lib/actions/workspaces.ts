"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCachedUser } from "@/lib/auth";

export async function createWorkspace(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const icon = String(formData.get("icon") ?? "home");
  const description = String(formData.get("description") ?? "");
  if (!name) return;

  const supabase = await createClient();
  const user = await getCachedUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("workspaces")
    .insert({ user_id: user.id, name, icon, description })
    .select("id")
    .single();
  if (error) throw error;

  revalidatePath("/", "layout");
  redirect(`/workspace/${data.id}?created=1`);
}

export async function deleteWorkspace(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const user = await getCachedUser();
  if (!user) return;

  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateWorkspaceContext(formData: FormData) {
  const id = String(formData.get("id"));
  const context_status = String(formData.get("context_status") ?? "");
  const context_maior_risco = String(formData.get("context_maior_risco") ?? "");
  const context_decisao_recente = String(formData.get("context_decisao_recente") ?? "");
  const context_proximo_passo = String(formData.get("context_proximo_passo") ?? "");

  const supabase = await createClient();
  const { error } = await supabase
    .from("workspaces")
    .update({
      context_status,
      context_maior_risco,
      context_decisao_recente,
      context_proximo_passo,
    })
    .eq("id", id);
  if (error) throw error;

  revalidatePath(`/workspace/${id}`);
}
