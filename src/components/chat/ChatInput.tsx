import { ArrowUp, Mic, MicOff, Paperclip, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  onSubmit: (text: string, files?: File[]) => void;
  onStop?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
};

type SR = {
  start: () => void;
  stop: () => void;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onend: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

type Attachment = { file: File; url: string };

export function ChatInput({ onSubmit, onStop, disabled, isStreaming }: Props) {
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<SR | null>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
    if (!isStreaming) ref.current?.focus();
  }, [isStreaming]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [value]);

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((a) => URL.revokeObjectURL(a.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addFiles(list: FileList | File[] | null) {
    if (!list) return;
    const files = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    setAttachments((prev) => [
      ...prev,
      ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
  }

  function removeAttachment(i: number) {
    setAttachments((prev) => {
      const next = [...prev];
      const [removed] = next.splice(i, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return next;
    });
  }

  function send() {
    const trimmed = value.trim();
    if ((!trimmed && attachments.length === 0) || disabled) return;
    const files = attachments.map((a) => a.file);
    onSubmit(trimmed, files.length ? files : undefined);
    setValue("");
    setAttachments([]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const files = Array.from(e.clipboardData.files);
    if (files.length) {
      e.preventDefault();
      addFiles(files);
    }
  }

  function toggleMic() {
    type SRCtor = new () => SR;
    const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setValue((v) => (v ? v + " " : "") + transcript);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }

  return (
    <div className="sticky bottom-0 z-10 w-full bg-gradient-to-t from-background via-background to-transparent pb-3 pt-4 sm:pb-4 sm:pt-6">
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-border/60 bg-card px-2.5 py-2 sm:px-3"
      >
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-0.5 pt-1">
            {attachments.map((a, i) => (
              <div key={i} className="group/att relative h-12 w-12 overflow-hidden rounded-md">
                <img src={a.url} alt={a.file.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  className="absolute inset-0 flex items-center justify-center bg-foreground/60 text-background opacity-0 transition-opacity group-hover/att:opacity-100"
                  aria-label="Remove attachment"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex w-full items-end gap-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Attach image"
          >
            <Paperclip className="h-[15px] w-[15px]" />
          </button>
          <textarea
            ref={ref}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            placeholder="Message…"
            className="max-h-[220px] min-h-[28px] flex-1 resize-none border-0 bg-transparent px-1 py-1.5 text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={toggleMic}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
              listening
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            aria-label="Voice input"
          >
            {listening ? <MicOff className="h-[15px] w-[15px]" /> : <Mic className="h-[15px] w-[15px]" />}
          </button>
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background transition hover:opacity-90"
              aria-label="Stop"
            >
              <Square className="h-[14px] w-[14px]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={send}
              disabled={(!value.trim() && attachments.length === 0) || disabled}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Send"
            >
              <ArrowUp className="h-[15px] w-[15px]" />
            </button>
          )}
        </div>
      </motion.div>
      <p className="mx-auto mt-2 max-w-2xl px-4 text-center text-[11px] text-muted-foreground">
        AI can make mistakes. Verify important info.
      </p>
    </div>
  );
}

