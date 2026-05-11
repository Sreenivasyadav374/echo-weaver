import { motion } from "framer-motion";
import { Cloud, CloudRain, CloudSnow, Droplets, Sun, Wind } from "lucide-react";

export type WeatherData = {
  city: string;
  condition: string;
  temperatureC: number;
  temperatureF: number;
  humidity: number;
  wind: number;
  forecast: { day: string; high: number; low: number; condition: string }[];
};

function iconFor(condition: string) {
  const c = condition.toLowerCase();
  if (c.includes("rain")) return CloudRain;
  if (c.includes("snow")) return CloudSnow;
  if (c.includes("cloud")) return Cloud;
  if (c.includes("wind")) return Wind;
  return Sun;
}

export function WeatherCard({ data }: { data: WeatherData }) {
  const Icon = iconFor(data.condition);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass relative w-full max-w-md overflow-hidden rounded-2xl border border-border/60 p-5 shadow-elegant"
    >
      <div className="absolute inset-0 bg-gradient-weather opacity-60" />
      <div className="relative flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Weather</div>
          <div className="mt-0.5 text-xl font-semibold">{data.city}</div>
          <div className="text-sm text-muted-foreground">{data.condition}</div>
        </div>
        <Icon className="h-12 w-12 text-primary" />
      </div>
      <div className="relative mt-3 flex items-end gap-2">
        <div className="text-5xl font-bold tabular-nums">{data.temperatureC}°</div>
        <div className="pb-2 text-sm text-muted-foreground">/ {data.temperatureF}°F</div>
      </div>
      <div className="relative mt-3 flex gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Droplets className="h-3.5 w-3.5" /> {data.humidity}%
        </span>
        <span className="inline-flex items-center gap-1">
          <Wind className="h-3.5 w-3.5" /> {data.wind} km/h
        </span>
      </div>
      <div className="relative mt-4 grid grid-cols-5 gap-2 border-t border-border/60 pt-3">
        {data.forecast.map((f) => {
          const FIcon = iconFor(f.condition);
          return (
            <div key={f.day} className="flex flex-col items-center gap-1 text-xs">
              <span className="text-muted-foreground">{f.day}</span>
              <FIcon className="h-4 w-4 text-primary/80" />
              <span className="tabular-nums">{f.high}°</span>
              <span className="tabular-nums text-muted-foreground">{f.low}°</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
