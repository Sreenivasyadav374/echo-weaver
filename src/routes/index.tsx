import { createFileRoute } from "@tanstack/react-router";
import { ChatWindow } from "@/components/chat/ChatWindow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lovable AI Chat — Generative UI Assistant" },
      {
        name: "description",
        content:
          "A premium AI chat experience with generative UI: live stock, weather, crypto, and GitHub cards.",
      },
      { property: "og:title", content: "Lovable AI Chat — Generative UI Assistant" },
      {
        property: "og:description",
        content: "Streaming AI chat with tool-rendered interactive cards.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <ChatWindow />;
}
