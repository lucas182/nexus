/**
 * Isolation boundary for LLM integration (Sprint 3).
 * Nothing in the app should import a provider SDK directly.
 * Swap provider by changing which service is exported at the bottom of this file.
 */
export interface AIService {
  /**
   * Suggest workspace and thread for a raw text capture.
   * Returns suggested names (resolved to IDs by the caller) and a confidence score.
   */
  suggestClassification(rawText: string): Promise<{
    workspaceId: string | null;
    threadId: string | null;
    confidence: number;
    /** AI-inferred workspace name — resolved to an ID by heuristics.ts */
    _suggestedWorkspaceName?: string | null;
    /** AI-inferred thread name — resolved to an ID by heuristics.ts */
    _suggestedThreadName?: string | null;
  }>;

  summarizeThread(events: { description: string; type: string }[]): Promise<string>;
}

/**
 * Default AI service instance.
 * Falls back to Gemini if GEMINI_API_KEY is set, otherwise returns null.
 * The caller (heuristics.ts) handles the fallback to keyword matching.
 */
export async function getDefaultAIService(): Promise<AIService | null> {
  if (process.env.GEMINI_API_KEY) {
    const { geminiService } = await import("@/ai/gemini-service");
    return geminiService;
  }
  return null;
}
