"use server";

import { revalidatePath } from "next/cache";
import { captureToInbox } from "@/lib/actions/inbox";

export async function createEvent(formData: FormData) {
  // Kept as a compatibility alias: all manual events now follow the capture pipeline.
  await captureToInbox(formData);
  const threadId = String(formData.get("thread_id") ?? "");
  const workspaceId = String(formData.get("workspace_id") ?? "");
  if (threadId) revalidatePath(`/thread/${threadId}`);
  if (workspaceId) revalidatePath(`/workspace/${workspaceId}`);
}
