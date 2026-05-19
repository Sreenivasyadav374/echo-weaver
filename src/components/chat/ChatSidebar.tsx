import { motion } from "framer-motion";
import { MessageSquarePlus, Moon, Sun, Download, X } from "lucide-react";
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
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border/60 bg-sidebar md:relative md:translate-x-0"
      >
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-4">
          <div>
            <div className="text-sm font-medium tracking-tight">Chat</div>
            <div className="text-[11px] text-muted-foreground">Generative UI</div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={onNewChat}
            className="flex w-full items-center gap-2 rounded-md border border-border/60 bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            <MessageSquarePlus className="h-4 w-4" />
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <div className="mb-2 px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Current session
          </div>
          <div className="rounded-md border border-border/60 bg-card px-3 py-2.5 text-sm">
            <div className="truncate font-medium">Active conversation</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{messageCount} messages</div>
          </div>
        </div>

        <div className="space-y-2 border-t border-border/60 p-3">
          <label className="block">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Model
            </span>
            <select
              value={model}
              onChange={(e) => onModelChange(e.target.value)}
              className="w-full rounded-md border border-border/60 bg-card px-2.5 py-1.5 text-xs outline-none focus:border-foreground/40"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-1.5">
            <button
              onClick={onExport}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border/60 px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <button
              onClick={onToggleTheme}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border/60 px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
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
