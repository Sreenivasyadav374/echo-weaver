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
      className={`group flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-full flex-col gap-2 ${
          isUser ? "items-end" : "w-full items-start"
        }`}
      >
        {message.parts.map((part, idx) => {
          if (part.type === "text") {
            if (!part.text) return null;
            if (isUser) {
              return (
                <div
                  key={idx}
                  className="max-w-[85%] whitespace-pre-wrap break-words rounded-xl rounded-tr-none border border-zinc-800/40 bg-zinc-900/60 px-3.5 py-2 text-sm font-normal leading-relaxed text-zinc-100"
                >
                  {part.text}
                </div>
              );
            }
            return (
              <div
                key={idx}
                className="w-full text-sm font-normal leading-relaxed text-zinc-100"
              >
                <MarkdownRenderer content={part.text} />
              </div>
            );
          }
          if (part.type === "file") {
            const filePart = part as {
              type: "file";
              mediaType?: string;
              url: string;
              filename?: string;
            };
            if (filePart.mediaType?.startsWith("image/")) {
              return (
                <img
                  key={idx}
                  src={filePart.url}
                  alt={filePart.filename ?? "attachment"}
                  className="max-h-80 max-w-sm rounded-lg border-[0.5px] border-zinc-800 object-cover"
                />
              );
            }
            return (
              <a
                key={idx}
                href={filePart.url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-zinc-500 underline underline-offset-2 hover:text-zinc-300"
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
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
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
