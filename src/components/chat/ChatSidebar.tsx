import { motion } from "framer-motion";
import { MessageSquarePlus, Moon, Sun, Sparkles, Download } from "lucide-react";
import { AVAILABLE_MODELS } from "@/lib/ai/openrouter";

type Props = {
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onExport: () => void;
  model: string;
  onModelChange: (m: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  messageCount: number;
};

export function ChatSidebar({
  open,
  onClose,
  onNewChat,
  onExport,
  model,
  onModelChange,
  theme,
  onToggleTheme,
  messageCount,
}: Props) {
  return (
    <>
      {/* mobile overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-background/70 backdrop-blur-sm transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="glass fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border/60 md:relative md:translate-x-0"
      >
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold">Lovable Chat</div>
            <div className="text-[11px] text-muted-foreground">Generative UI · OpenRouter</div>
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={onNewChat}
            className="group flex w-full items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-3 py-2.5 text-sm font-medium transition hover:border-primary/40 hover:bg-primary/10"
          >
            <MessageSquarePlus className="h-4 w-4 text-primary" />
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <div className="mb-2 px-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            Current session
          </div>
          <div className="rounded-xl border border-border/60 bg-card/40 px-3 py-2.5 text-sm">
            <div className="truncate font-medium">Active conversation</div>
            <div className="text-xs text-muted-foreground">{messageCount} messages</div>
          </div>
        </div>

        <div className="space-y-2 border-t border-border/60 p-3">
          <label className="block">
            <span className="mb-1 block text-[11px] uppercase tracking-wider text-muted-foreground">
              Model
            </span>
            <select
              value={model}
              onChange={(e) => onModelChange(e.target.value)}
              className="w-full rounded-lg border border-border/60 bg-card px-2.5 py-2 text-xs outline-none focus:border-primary/60"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-2">
            <button
              onClick={onExport}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 px-2 py-2 text-xs hover:bg-muted"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <button
              onClick={onToggleTheme}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 px-2 py-2 text-xs hover:bg-muted"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
