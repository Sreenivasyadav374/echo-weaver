import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, stepCountIs, type UIMessage } from "ai";
import { createOpenRouter, DEFAULT_MODEL } from "@/lib/ai/openrouter";
import { chatTools } from "@/lib/tools";

const SYSTEM_PROMPT = `You are a helpful, friendly AI assistant with access to tools that render rich UI cards.

When users ask about:
- Stocks → call \`showStockPrice\`
- Weather → call \`getWeather\`
- Crypto / coins → call \`showCryptoPrice\`
- GitHub repositories → call \`getGithubRepo\`

After calling a tool, give a short natural-language summary. Use markdown for formatting and \`\`\`language code blocks for code.`;

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
            messages: convertToModelMessages(messages),
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
