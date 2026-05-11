import { motion } from "framer-motion";
import { GitFork, Github, Star, CircleDot } from "lucide-react";

export type GithubData =
  | {
      fullName: string;
      description: string | null;
      stars: number;
      forks: number;
      watchers: number;
      language: string | null;
      url: string;
      owner: { login: string; avatar_url: string } | null;
      topics: string[];
      openIssues: number;
    }
  | { error: string; repo: string };

export function GithubCard({ data }: { data: GithubData }) {
  if ("error" in data) {
    return (
      <div className="glass rounded-2xl border border-destructive/40 p-4 text-sm text-destructive">
        Couldn't load <span className="font-mono">{data.repo}</span>: {data.error}
      </div>
    );
  }
  return (
    <motion.a
      href={data.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass relative block w-full max-w-md overflow-hidden rounded-2xl border border-border/60 p-5 shadow-elegant transition hover:border-primary/40"
    >
      <div className="absolute inset-0 bg-gradient-github opacity-40" />
      <div className="relative flex items-start gap-3">
        {data.owner ? (
          <img
            src={data.owner.avatar_url}
            alt={data.owner.login}
            className="h-10 w-10 rounded-full border border-border/60"
          />
        ) : (
          <Github className="h-10 w-10" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-muted-foreground" />
            <div className="truncate font-semibold">{data.fullName}</div>
          </div>
          {data.description && (
            <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{data.description}</div>
          )}
        </div>
      </div>
      {data.topics.length > 0 && (
        <div className="relative mt-3 flex flex-wrap gap-1.5">
          {data.topics.slice(0, 5).map((t) => (
            <span
              key={t}
              className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="relative mt-4 flex items-center gap-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5" /> {data.stars.toLocaleString()}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork className="h-3.5 w-3.5" /> {data.forks.toLocaleString()}
        </span>
        <span className="inline-flex items-center gap-1">
          <CircleDot className="h-3.5 w-3.5" /> {data.openIssues.toLocaleString()}
        </span>
        {data.language && (
          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px]">{data.language}</span>
        )}
      </div>
    </motion.a>
  );
}
