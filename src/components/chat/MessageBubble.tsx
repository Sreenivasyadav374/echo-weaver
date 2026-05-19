import { motion } from "framer-motion";
import { Bot, Check, Copy, RotateCw, User } from "lucide-react";
import { useState } from "react";
import type { UIMessage } from "ai";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ToolRenderer } from "./ToolRenderer";

type Props = {
  message: UIMessage;
  onRegenerate?: () => void;
  isLast?: boolean;
};

export function MessageBubble({ message, onRegenerate, isLast }: Props) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");

  const copy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`group flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-gradient-primary text-primary-foreground shadow-glow"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`flex max-w-[85%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        {message.parts.map((part, idx) => {
          if (part.type === "text") {
            if (!part.text) return null;
            return (
              <div
                key={idx}
                className={
                  isUser
                    ? "rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground shadow-elegant"
                    : "text-foreground"
                }
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {part.text}
                  </div>
                ) : (
                  <MarkdownRenderer content={part.text} />
                )}
              </div>
            );
          }
          if (part.type === "file") {
            const filePart = part as { type: "file"; mediaType?: string; url: string; filename?: string };
            if (filePart.mediaType?.startsWith("image/")) {
              return (
                <img
                  key={idx}
                  src={filePart.url}
                  alt={filePart.filename ?? "attachment"}
                  className="max-h-80 max-w-full rounded-2xl border border-border/60 object-cover shadow-elegant"
                />
              );
            }
            return (
              <a
                key={idx}
                href={filePart.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary underline"
              >
                {filePart.filename ?? "file"}
              </a>
            );
          }
          if (part.type.startsWith("tool-")) {
            return <ToolRenderer key={idx} part={part as never} />;
          }
          return null;
        })}

        {!isUser && text && (
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={copy}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <RotateCw className="h-3 w-3" /> Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
