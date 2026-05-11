import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";

export type StockData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  currency: string;
  history: number[];
  updatedAt: string;
};

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const w = 160;
  const h = 44;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const stroke = positive ? "hsl(142 76% 56%)" : "hsl(0 84% 65%)";
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export function StockCard({ data }: { data: StockData }) {
  const positive = data.change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="glass relative w-full max-w-md overflow-hidden rounded-2xl border border-border/60 p-5 shadow-elegant"
    >
      <div className="absolute inset-0 bg-gradient-card opacity-50" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Stock</div>
          <div className="mt-0.5 text-2xl font-bold tracking-tight">{data.symbol}</div>
          <div className="text-xs text-muted-foreground">{data.name}</div>
        </div>
        <Sparkline data={data.history} positive={positive} />
      </div>
      <div className="relative mt-4 flex items-end justify-between">
        <div className="text-3xl font-semibold tabular-nums">
          ${data.price.toFixed(2)}
          <span className="ml-1 text-xs font-normal text-muted-foreground">{data.currency}</span>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${
            positive ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
          }`}
        >
          {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {positive ? "+" : ""}
          {data.change.toFixed(2)} ({data.changePct.toFixed(2)}%)
        </div>
      </div>
    </motion.div>
  );
}
