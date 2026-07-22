import { createClient } from "@/lib/supabase/server";
import { getDefaultAIService } from "@/ai/ai-service";
import type { Thread, Workspace } from "@/types/domain";

/**
 * Classification with LLM assistance (Sprint 3).
 * 1. Try AI service first (if GEMINI_API_KEY is configured)
 * 2. Resolve AI-suggested names to actual IDs
 * 3. Fall back to deterministic keyword matching
 * 4. Final fallback: most recently used workspace/thread
 */
export async function suggestClassification(
  rawText: string,
): Promise<{
  workspaceId: string | null;
  threadId: string | null;
  aiConfidence?: number;
}> {
  const supabase = await createClient();
  const lowerText = rawText.toLowerCase();

  // Fetch workspaces and threads once, reused by all strategies
  const [{ data: workspaces }, { data: threads }] = await Promise.all([
    supabase.from("workspaces").select("*"),
    supabase.from("threads").select("*"),
  ]);

  const wsList = (workspaces ?? []) as Workspace[];
  const thList = (threads ?? []) as Thread[];

  // ─── Strategy 1: AI classification ───────────────────────────
  if (wsList.length > 0 && thList.length > 0) {
    const ai = await getDefaultAIService();
    if (ai) {
      try {
        const aiResult = await ai.suggestClassification(rawText);

        if (
          aiResult.confidence > 0.4 &&
          (aiResult._suggestedWorkspaceName || aiResult._suggestedThreadName)
        ) {
          // Resolve AI-suggested names to actual IDs
          const matchedWs = aiResult._suggestedWorkspaceName
            ? wsList.find(
                (w) =>
                  w.name.toLowerCase() ===
                    aiResult._suggestedWorkspaceName!.toLowerCase() ||
                  lowerText.includes(w.name.toLowerCase()),
              )
            : null;

          const matchedThread = aiResult._suggestedThreadName
            ? thList.find(
                (t) =>
                  t.title.toLowerCase() ===
                    aiResult._suggestedThreadName!.toLowerCase() ||
                  lowerText.includes(t.title.toLowerCase()),
              )
            : null;

          if (matchedThread) {
            return {
              workspaceId: matchedThread.workspace_id,
              threadId: matchedThread.id,
              aiConfidence: aiResult.confidence,
            };
          }

          if (matchedWs) {
            const wsThreads = thList.filter(
              (t) => t.workspace_id === matchedWs.id,
            );
            return {
              workspaceId: matchedWs.id,
              threadId: wsThreads[0]?.id ?? null,
              aiConfidence: aiResult.confidence,
            };
          }
        }
      } catch {
        // AI failed — fall through to deterministic strategies
      }
    }
  }

  // ─── Strategy 2: Keyword matching (heuristic) ─────────────────
  const threadMatch = thList.find((t) =>
    lowerText.includes(t.title.toLowerCase()),
  );
  if (threadMatch) {
    return { workspaceId: threadMatch.workspace_id, threadId: threadMatch.id };
  }

  const workspaceMatch = wsList.find((w) =>
    lowerText.includes(w.name.toLowerCase()),
  );
  if (workspaceMatch) {
    const wsThreads = thList.filter(
      (t) => t.workspace_id === workspaceMatch.id,
    );
    return {
      workspaceId: workspaceMatch.id,
      threadId: wsThreads[0]?.id ?? null,
    };
  }

  // ─── Strategy 3: Most recent Event ────────────────────────────
  const { data: lastEvent } = await supabase
    .from("events")
    .select("thread_id")
    .order("timestamp", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastEvent) {
    const lastThread = thList.find((t) => t.id === lastEvent.thread_id);
    if (lastThread) {
      return { workspaceId: lastThread.workspace_id, threadId: lastThread.id };
    }
  }

  return { workspaceId: null, threadId: null };
}
