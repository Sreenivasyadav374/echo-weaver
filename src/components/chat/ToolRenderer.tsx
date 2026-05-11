import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { StockCard, type StockData } from "./StockCard";
import { WeatherCard, type WeatherData } from "./WeatherCard";
import { CryptoCard, type CryptoData } from "./CryptoCard";
import { GithubCard, type GithubData } from "./GithubCard";

/**
 * Component registry: maps tool name -> renderer.
 * We never store React elements in state; we render from structured data.
 */
const REGISTRY: Record<string, (output: unknown) => JSX.Element> = {
  showStockPrice: (o) => <StockCard data={o as StockData} />,
  getWeather: (o) => <WeatherCard data={o as WeatherData} />,
  showCryptoPrice: (o) => <CryptoCard data={o as CryptoData} />,
  getGithubRepo: (o) => <GithubCard data={o as GithubData} />,
};

const LABELS: Record<string, string> = {
  showStockPrice: "Fetching stock price",
  getWeather: "Checking weather",
  showCryptoPrice: "Loading crypto price",
  getGithubRepo: "Loading repository",
};

type ToolPart = {
  type: string; // "tool-<name>" in AI SDK v5+
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

export function ToolRenderer({ part }: { part: ToolPart }) {
  // part.type is like "tool-showStockPrice"
  const toolName = part.type.startsWith("tool-") ? part.type.slice(5) : part.type;
  const label = LABELS[toolName] ?? `Running ${toolName}`;

  if (part.state === "input-streaming" || part.state === "input-available") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass flex w-full max-w-md items-center gap-3 rounded-2xl border border-border/60 p-4 text-sm"
      >
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-muted-foreground">{label}…</span>
      </motion.div>
    );
  }

  if (part.state === "output-error") {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
        Tool failed: {part.errorText ?? "Unknown error"}
      </div>
    );
  }

  const renderer = REGISTRY[toolName];
  if (!renderer) {
    return (
      <pre className="overflow-x-auto rounded-xl border border-border/60 bg-muted/40 p-3 text-xs">
        {JSON.stringify(part.output, null, 2)}
      </pre>
    );
  }
  return renderer(part.output);
}
