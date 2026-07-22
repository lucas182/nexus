import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIService } from "@/ai/ai-service";

const API_KEY = process.env.GEMINI_API_KEY ?? "";
const TIMEOUT_MS = 8_000;

let genAI: GoogleGenerativeAI | null = null;
let model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

function getModel() {
  if (!API_KEY) return null;
  if (!genAI) genAI = new GoogleGenerativeAI(API_KEY);
  if (!model) model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  return model;
}

/**
 * Strips markdown code fences and trims whitespace from Gemini's response.
 * Gemini often wraps JSON in ```json ... ``` blocks.
 */
function cleanJsonResponse(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export const geminiService: AIService = {
  async suggestClassification(rawText: string) {
    const m = getModel();
    if (!m) {
      return { workspaceId: null, threadId: null, confidence: 0 };
    }

    // Sanitize input to prevent prompt injection
    const sanitized = rawText.replace(/"/g, "'").replace(/\n/g, " ").slice(0, 500);

    try {
      const prompt = [
        'You are a classification assistant. Given a text captured by a user, determine which',
        'workspace area and specific subject (thread) it belongs to.',
        '',
        'Respond ONLY with a JSON object. No markdown, no explanation:',
        '{"workspaceName": "<name or null>", "threadName": "<name or null>", "confidence": <0-1 number>}',
        '',
        'Text: ' + sanitized,
      ].join("\n");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const result = await m.generateContent(prompt, { signal: controller.signal });
      clearTimeout(timeoutId);

      const response = result.response;
      const text = cleanJsonResponse(response.text());
      const parsed = JSON.parse(text);

      return {
        workspaceId: null,
        threadId: null,
        confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
        _suggestedWorkspaceName: parsed.workspaceName ?? null,
        _suggestedThreadName: parsed.threadName ?? null,
      };
    } catch (error) {
      console.error("Gemini classification failed:", error);
      return { workspaceId: null, threadId: null, confidence: 0 };
    }
  },

  async summarizeThread(events: { description: string; type: string }[]) {
    const m = getModel();
    if (!m || events.length === 0) return "";

    try {
      const timeline = events
        .map((e) => "[" + e.type + "] " + e.description)
        .join("\n");

      const prompt = [
        "Summarize the following thread events into a concise 2-3 sentence",
        "status summary in Brazilian Portuguese. Focus on what happened,",
        "what was decided, and what's next.",
        "",
        "Events:",
        timeline,
        "",
        "Summary:",
      ].join("\n");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const result = await m.generateContent(prompt, { signal: controller.signal });
      clearTimeout(timeoutId);

      return result.response.text().trim();
    } catch (error) {
      console.error("Gemini summarization failed:", error);
      return "";
    }
  },
};
