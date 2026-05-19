import { motion } from "framer-motion";
import { Bitcoin, Cloud, Github, TrendingUp } from "lucide-react";

const SUGGESTIONS = [
  { icon: TrendingUp, text: "Show me the stock price of NVDA" },
  { icon: Cloud, text: "What's the weather in Tokyo?" },
  { icon: Bitcoin, text: "What's the current price of BTC?" },
  { icon: Github, text: "Tell me about the vercel/ai GitHub repo" },
];

export function EmptyState({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl"
      >
        How can I help you today?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground"
      >
        Ask anything. Live UI for stocks, weather, crypto, and GitHub repos.
      </motion.p>

      <div className="mt-10 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.text}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}
            onClick={() => onSelect(s.text)}
            className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card px-3.5 py-3 text-left text-sm text-muted-foreground transition hover:border-border hover:bg-muted hover:text-foreground"
          >
            <s.icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
            <span className="flex-1 truncate">{s.text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
