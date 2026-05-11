import { ArrowUp, Mic, MicOff, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  onSubmit: (text: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
};

// Minimal SpeechRecognition type (browser-only, vendor-prefixed)
type SR = {
  start: () => void;
  stop: () => void;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onend: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

export function ChatInput({ onSubmit, onStop, disabled, isStreaming }: Props) {
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const recRef = useRef<SR | null>(null);

  // autofocus on mount
  useEffect(() => {
    ref.current?.focus();
  }, []);

  // re-focus after streaming completes
  useEffect(() => {
    if (!isStreaming) ref.current?.focus();
  }, [isStreaming]);

  // auto-resize
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [value]);

  function send() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
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
    <div className="sticky bottom-0 z-10 w-full bg-gradient-to-t from-background via-background to-transparent pb-4 pt-6">
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass mx-auto flex w-full max-w-3xl items-end gap-2 rounded-3xl border border-border/60 p-2 pl-4 shadow-elegant"
      >
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Message AI…  (Enter to send, Shift+Enter for newline)"
          className="max-h-[220px] min-h-[28px] flex-1 resize-none border-0 bg-transparent py-2.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={toggleMic}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
            listening ? "bg-destructive text-destructive-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
          aria-label="Voice input"
        >
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-glow transition hover:scale-105"
            aria-label="Stop"
          >
            <Square className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={send}
            disabled={!value.trim() || disabled}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            aria-label="Send"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </motion.div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">
        AI can make mistakes. Verify important info.
      </p>
    </div>
  );
}
