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
    <div className="sticky bottom-0 z-10 w-full bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pb-3 pt-4 sm:pb-4 sm:pt-6">
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto flex w-full max-w-3xl flex-col gap-2 rounded-xl border-[0.5px] border-zinc-800 bg-zinc-900/30 px-2.5 py-2 transition-colors focus-within:border-zinc-700/80 sm:px-3"
      >
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-0.5 pt-1">
            {attachments.map((a, i) => (
              <div
                key={i}
                className="group/att relative h-12 w-12 overflow-hidden rounded-md border-[0.5px] border-zinc-800"
              >
                <img src={a.url} alt={a.file.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950/90 text-zinc-200 ring-[0.5px] ring-zinc-700 hover:bg-zinc-900"
                  aria-label="Remove attachment"
                >
                  <X className="h-2.5 w-2.5" />
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
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-200"
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
            className="max-h-[220px] min-h-[28px] flex-1 resize-none border-0 bg-transparent px-1 py-1.5 text-sm leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-500"
          />
          <button
            type="button"
            onClick={toggleMic}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
              listening
                ? "bg-zinc-100 text-zinc-950"
                : "text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-200"
            }`}
            aria-label="Voice input"
          >
            {listening ? <MicOff className="h-[15px] w-[15px]" /> : <Mic className="h-[15px] w-[15px]" />}
          </button>
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-950 transition hover:opacity-90"
              aria-label="Stop"
            >
              <Square className="h-[14px] w-[14px]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={send}
              disabled={(!value.trim() && attachments.length === 0) || disabled}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Send"
            >
              <ArrowUp className="h-[15px] w-[15px]" />
            </button>
          )}
        </div>
      </motion.div>
      <p className="mx-auto mt-2 max-w-3xl px-4 text-center font-mono text-xs text-zinc-500">
        AI can make mistakes. Verify important info.
      </p>
    </div>
  );
}


