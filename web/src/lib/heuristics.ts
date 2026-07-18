import { createClient } from "@/lib/supabase/server";
import type { Thread, Workspace } from "@/types/domain";

/**
 * Deterministic classification suggestion for a captured Inbox item.
 * Explicitly NOT AI (per MVP_BLUEPRINT.md section 10) — just keyword
 * matching against workspace/thread names, falling back to whatever
 * workspace/thread received the most recent Event.
 */
export async function suggestClassification(
  rawText: string,
): Promise<{ workspaceId: string | null; threadId: string | null }> {
  const supabase = await createClient();
  const lowerText = rawText.toLowerCase();

  const { data: workspaces } = await supabase.from("workspaces").select("*");
  const { data: threads } = await supabase.from("threads").select("*");

  if (!workspaces?.length || !threads?.length) {
    return { workspaceId: null, threadId: null };
  }

  const threadMatch = (threads as Thread[]).find((t) =>
    lowerText.includes(t.title.toLowerCase()),
  );
  if (threadMatch) {
    return { workspaceId: threadMatch.workspace_id, threadId: threadMatch.id };
  }

  const workspaceMatch = (workspaces as Workspace[]).find((w) =>
    lowerText.includes(w.name.toLowerCase()),
  );
  if (workspaceMatch) {
    const wsThreads = (threads as Thread[]).filter(
      (t) => t.workspace_id === workspaceMatch.id,
    );
    return {
      workspaceId: workspaceMatch.id,
      threadId: wsThreads[0]?.id ?? null,
    };
  }

  // Fallback: workspace/thread of the most recently created Event.
  const { data: lastEvent } = await supabase
    .from("events")
    .select("thread_id")
    .order("timestamp", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastEvent) {
    const lastThread = (threads as Thread[]).find((t) => t.id === lastEvent.thread_id);
    if (lastThread) {
      return { workspaceId: lastThread.workspace_id, threadId: lastThread.id };
    }
  }

  return { workspaceId: null, threadId: null };
}
