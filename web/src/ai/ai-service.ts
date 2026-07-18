/**
 * Isolation boundary for any future LLM integration (Sprint 3).
 * Nothing in the app should import a provider SDK (OpenAI, Anthropic, etc.)
 * directly — it should depend on this interface instead, so the provider
 * can be swapped without touching the rest of the codebase.
 *
 * No implementation ships in the MVP. This is a stub only.
 */
export interface AIService {
  suggestClassification(rawText: string): Promise<{
    workspaceId: string | null;
    threadId: string | null;
    confidence: number;
  }>;

  summarizeThread(events: { description: string; type: string }[]): Promise<string>;
}
