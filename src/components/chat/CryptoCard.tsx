import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Bitcoin } from "lucide-react";

export type CryptoData = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  marketCap: number;
  volume24h: number;
  history: number[];
};

function fmt(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

export function CryptoCard({ data }: { data: CryptoData }) {
  const positive = data.changePct >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass relative w-full max-w-md overflow-hidden rounded-2xl border border-border/60 p-5 shadow-elegant"
    >
      <div className="absolute inset-0 bg-gradient-crypto opacity-50" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
            <Bitcoin className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold">{data.symbol}</div>
            <div className="text-xs text-muted-foreground">Crypto</div>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${
            positive ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
          }`}
        >
          {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {positive ? "+" : ""}
          {data.changePct.toFixed(2)}%
        </div>
      </div>
      <div className="relative mt-4 text-3xl font-semibold tabular-nums">
        ${data.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
      <div className="relative mt-3 grid grid-cols-2 gap-3 border-t border-border/60 pt-3 text-xs">
        <div>
          <div className="text-muted-foreground">Market Cap</div>
          <div className="font-medium">{fmt(data.marketCap)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">24h Volume</div>
          <div className="font-medium">{fmt(data.volume24h)}</div>
        </div>
      </div>
    </motion.div>
  );
}
