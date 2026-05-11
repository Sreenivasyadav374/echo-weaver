import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * OpenRouter provider via the AI SDK (OpenAI-compatible).
 * Server-only — never import in client code.
 */
export function createOpenRouter(apiKey: string) {
  return createOpenAICompatible({
    name: "openrouter",
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    headers: {
      "HTTP-Referer": "https://lovable.dev",
      "X-Title": "Lovable AI Chat",
    },
  });
}

export const DEFAULT_MODEL = "google/gemini-2.0-flash-001";

export const AVAILABLE_MODELS = [
  { id: "google/gemini-2.0-flash-001", label: "Gemini 2.0 Flash" },
  { id: "openai/gpt-4o-mini", label: "GPT-4o mini" },
  { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { id: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B" },
] as const;
