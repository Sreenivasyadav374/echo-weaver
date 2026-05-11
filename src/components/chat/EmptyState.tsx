import { motion } from "framer-motion";
import { Bitcoin, Cloud, Github, Sparkles, TrendingUp } from "lucide-react";

const SUGGESTIONS = [
  { icon: TrendingUp, text: "Show me the stock price of NVDA", color: "text-emerald-400" },
  { icon: Cloud, text: "What's the weather in Tokyo?", color: "text-sky-400" },
  { icon: Bitcoin, text: "What's the current price of BTC?", color: "text-amber-400" },
  { icon: Github, text: "Tell me about the vercel/ai GitHub repo", color: "text-purple-400" },
];

export function EmptyState({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow"
      >
        <Sparkles className="h-7 w-7 text-primary-foreground" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-primary bg-clip-text text-4xl font-bold tracking-tight text-transparent"
      >
        How can I help you today?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-2 max-w-md text-sm text-muted-foreground"
      >
        Ask anything. I can render live UI for stocks, weather, crypto, and GitHub repos.
      </motion.p>

      <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            onClick={() => onSelect(s.text)}
            className="glass group flex items-center gap-3 rounded-2xl border border-border/60 p-4 text-left text-sm transition hover:border-primary/40 hover:shadow-glow"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted ${s.color}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <span className="flex-1 text-foreground/90 group-hover:text-foreground">{s.text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
