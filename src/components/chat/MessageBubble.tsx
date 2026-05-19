import { motion } from "framer-motion";
import { Check, Copy, RotateCw } from "lucide-react";
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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group flex w-full flex-col gap-2"
    >
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {isUser ? "You" : "Assistant"}
      </div>

      <div className="flex flex-col gap-2.5">
        {message.parts.map((part, idx) => {
          if (part.type === "text") {
            if (!part.text) return null;
            return (
              <div key={idx} className="text-foreground">
                {isUser ? (
                  <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
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
                  className="max-h-80 max-w-sm rounded-lg border border-border/60 object-cover"
                />
              );
            }
            return (
              <a
                key={idx}
                href={filePart.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-foreground underline underline-offset-2"
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
          <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
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
