import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { ChatSidebar } from "./ChatSidebar";
import { EmptyState } from "./EmptyState";
import { TypingIndicator } from "./TypingIndicator";
import { DEFAULT_MODEL } from "@/lib/ai/openrouter";
import { useTheme } from "@/hooks/use-theme";

export function ChatWindow() {
  const [model, setModel] = useState<string>(DEFAULT_MODEL);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const { theme, toggle: toggleTheme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, regenerate, setMessages } = useChat({
    id: `session-${sessionKey}`,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { model },
    }),
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const isStreaming = status === "submitted" || status === "streaming";

  function handleNewChat() {
    setMessages([]);
    setSessionKey((k) => k + 1);
    setSidebarOpen(false);
  }

  function handleExport() {
    const json = JSON.stringify(messages, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <ChatSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onExport={handleExport}
        model={model}
        onModelChange={setModel}
        theme={theme}
        onToggleTheme={toggleTheme}
        messageCount={messages.length}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Background flourish */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        </div>

        {/* Mobile header */}
        <header className="relative z-10 flex items-center justify-between border-b border-border/60 bg-background/60 px-4 py-3 backdrop-blur-md md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-sm font-semibold">Lovable Chat</div>
          <div className="w-9" />
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="relative z-0 flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyState onSelect={(text) => sendMessage({ text })} />
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <MessageBubble
                    key={m.id}
                    message={m}
                    isLast={i === messages.length - 1 && m.role === "assistant"}
                    onRegenerate={() => regenerate()}
                  />
                ))}
              </AnimatePresence>
              {status === "submitted" &&
                (!lastMessage || lastMessage.role === "user") && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary shadow-glow" />
                    <TypingIndicator />
                  </div>
                )}
            </div>
          )}
        </div>

        <ChatInput
          onSubmit={(text, files) => sendMessage({ text, files })}
          onStop={stop}
          disabled={isStreaming}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
