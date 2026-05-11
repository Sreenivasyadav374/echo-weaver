import { tool } from "ai";
import { z } from "zod";

/**
 * Tool definitions. Each returns structured JSON; the client maps the
 * tool name to a React component via the component registry.
 */
export const chatTools = {
  showStockPrice: tool({
    description:
      "Show a real-time-looking stock price card for a given ticker symbol. Use when the user asks about a stock.",
    inputSchema: z.object({
      symbol: z.string().describe("Ticker symbol, e.g. AAPL, TSLA, NVDA"),
    }),
    execute: async ({ symbol }) => {
      // Deterministic-ish mock so the UI is meaningful without a paid API.
      const seed = [...symbol.toUpperCase()].reduce((a, c) => a + c.charCodeAt(0), 0);
      const base = 50 + (seed % 400);
      const price = +(base + Math.random() * 5).toFixed(2);
      const change = +((Math.random() - 0.45) * 6).toFixed(2);
      const changePct = +((change / price) * 100).toFixed(2);
      const history = Array.from({ length: 24 }, (_, i) =>
        +(base + Math.sin(i / 3 + seed) * 6 + Math.random() * 2).toFixed(2),
      );
      return {
        symbol: symbol.toUpperCase(),
        name: `${symbol.toUpperCase()} Inc.`,
        price,
        change,
        changePct,
        currency: "USD",
        history,
        updatedAt: new Date().toISOString(),
      };
    },
  }),

  getWeather: tool({
    description: "Get current weather for a city. Use when the user asks about weather.",
    inputSchema: z.object({
      city: z.string().describe("City name, e.g. San Francisco"),
    }),
    execute: async ({ city }) => {
      const conditions = ["Sunny", "Partly cloudy", "Cloudy", "Rainy", "Snowy", "Windy"] as const;
      const seed = [...city.toLowerCase()].reduce((a, c) => a + c.charCodeAt(0), 0);
      const condition = conditions[seed % conditions.length];
      const tempC = 5 + (seed % 25) + Math.round(Math.random() * 4);
      return {
        city,
        condition,
        temperatureC: tempC,
        temperatureF: Math.round(tempC * 1.8 + 32),
        humidity: 30 + (seed % 60),
        wind: 3 + (seed % 20),
        forecast: Array.from({ length: 5 }, (_, i) => ({
          day: ["Mon", "Tue", "Wed", "Thu", "Fri"][i],
          high: tempC + Math.round(Math.random() * 4),
          low: tempC - Math.round(Math.random() * 4),
          condition: conditions[(seed + i) % conditions.length],
        })),
      };
    },
  }),

  showCryptoPrice: tool({
    description: "Show a crypto price widget for a coin symbol like BTC, ETH, SOL.",
    inputSchema: z.object({
      symbol: z.string().describe("Crypto symbol e.g. BTC, ETH"),
    }),
    execute: async ({ symbol }) => {
      const map: Record<string, number> = { BTC: 68000, ETH: 3500, SOL: 180, DOGE: 0.16 };
      const s = symbol.toUpperCase();
      const base = map[s] ?? 100 + Math.random() * 500;
      const price = +(base * (0.95 + Math.random() * 0.1)).toFixed(2);
      const changePct = +((Math.random() - 0.45) * 10).toFixed(2);
      return {
        symbol: s,
        name: s,
        price,
        changePct,
        marketCap: Math.round(price * 19_000_000),
        volume24h: Math.round(price * 500_000),
        history: Array.from({ length: 24 }, () =>
          +(base * (0.95 + Math.random() * 0.1)).toFixed(2),
        ),
      };
    },
  }),

  getGithubRepo: tool({
    description: "Fetch a public GitHub repository's metadata. Input is 'owner/repo'.",
    inputSchema: z.object({
      repo: z.string().describe("Full repo path, e.g. vercel/ai"),
    }),
    execute: async ({ repo }) => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!res.ok) {
          return { error: `GitHub API returned ${res.status}`, repo };
        }
        const data = (await res.json()) as Record<string, unknown>;
        return {
          fullName: data.full_name as string,
          description: data.description as string | null,
          stars: data.stargazers_count as number,
          forks: data.forks_count as number,
          watchers: data.watchers_count as number,
          language: data.language as string | null,
          url: data.html_url as string,
          owner: (data.owner as { login: string; avatar_url: string }) ?? null,
          topics: (data.topics as string[]) ?? [],
          openIssues: data.open_issues_count as number,
        };
      } catch (e) {
        return { error: (e as Error).message, repo };
      }
    },
  }),
};

export type ChatTools = typeof chatTools;
