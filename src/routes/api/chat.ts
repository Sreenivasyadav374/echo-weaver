import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, stepCountIs, type UIMessage } from "ai";
import { createOpenRouter, DEFAULT_MODEL } from "@/lib/ai/openrouter";
import { chatTools } from "@/lib/tools";

const SYSTEM_PROMPT = `You are a concise AI assistant.
Tools (call only when clearly relevant; then add 1 short sentence):
- showStockPrice(symbol) — stocks
- getWeather(city) — weather
- showCryptoPrice(symbol) — crypto
- getGithubRepo(repo) — GitHub repos
Markdown allowed. Keep replies brief. If user sends an image, describe/answer about it directly.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
          return new Response("Missing OPENROUTER_API_KEY", { status: 500 });
        }

        let body: { messages?: UIMessage[]; model?: string };
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const messages = body.messages;
        if (!Array.isArray(messages)) {
          return new Response("messages required", { status: 400 });
        }

        const openrouter = createOpenRouter(apiKey);
        const model = openrouter(body.model || DEFAULT_MODEL);

        try {
          const result = streamText({
            model,
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages),
            tools: chatTools,
            stopWhen: stepCountIs(50),
          });

          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (e) {
          console.error("Chat route error:", e);
          return new Response(
            JSON.stringify({ error: (e as Error).message ?? "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
