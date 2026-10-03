"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageSquare, X } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { profile } from "@/data/portfolio";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  `Who is ${profile.firstName}?`,
  `What has ${profile.firstName} built?`,
  "Which project is the most technical?",
  `How can I contact ${profile.firstName}?`,
];
const MAX_CHARS = 800;
const ease = [0.16, 1, 0.3, 1] as const;

/** Light formatting for model output: **bold**, list bullets, and clickable links. */
function Answer({ text }: { text: string }) {
  const cleaned = text.replace(/^\s*[-*]\s+/gm, "• ").replace(/^#+\s*/gm, "");
  const parts = cleaned.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-white">
            <Linkified text={part} />
          </strong>
        ) : (
          <Linkified key={i} text={part} />
        ),
      )}
    </>
  );
}

/** Turns URLs and email addresses in an answer into links. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
          const clean = part.replace(/[.,]$/, "");
          return (
            <Fragment key={i}>
              <a href={clean} target="_blank" rel="noopener noreferrer" className="underline decoration-ember underline-offset-2">
                {clean.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
              {part.slice(clean.length)}
            </Fragment>
          );
        }
        if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
          const clean = part.replace(/[.,]$/, "");
          return (
            <Fragment key={i}>
              <a href={`mailto:${clean}`} className="underline decoration-ember underline-offset-2">
                {clean}
              </a>
              {part.slice(clean.length)}
            </Fragment>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, busy]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const history: Message[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setError(null);
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
      }
      if (!answer.trim()) throw new Error("No answer came back — please try again.");
    } catch (err) {
      if (controller.signal.aborted) return;
      setMessages(history); // drop the empty assistant bubble
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
            exit={{ opacity: 0, y: 16, transition: { duration: 0.2 } }}
            aria-label={`Open chat: ask about ${profile.firstName}`}
            className="label-mono fixed bottom-5 right-5 z-[60] flex items-center gap-3 border border-white/20 bg-ink px-3.5 py-3.5 text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-colors hover:bg-crimson sm:px-4 md:bottom-8 md:right-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-ember/70" />
              <span className="relative h-2 w-2 rounded-full bg-ember" />
            </span>
            <span className="hidden sm:inline">Ask about {profile.firstName}</span>
            <MessageSquare aria-hidden="true" className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="false"
            aria-label={`Chat about ${profile.name}`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease }}
            className="fixed inset-x-0 bottom-0 z-[60] flex h-[85svh] origin-bottom-right flex-col border border-white/15 bg-ink text-white shadow-[0_20px_80px_rgba(0,0,0,0.5)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(620px,calc(100svh-6rem))] sm:w-[400px]"
          >
            {/* header */}
            <div className="flex items-start justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="label-mono flex items-center gap-2 text-ember">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                  Assistant
                </p>
                <p className="display mt-2 text-2xl">Ask about {profile.firstName}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="-mr-1 p-1 text-white/60 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* messages */}
            <div ref={listRef} data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5" aria-live="polite">
              {messages.length === 0 && (
                <div>
                  <p className="text-[0.95rem] leading-relaxed text-white/70">
                    Hi — I can answer questions about {profile.firstName}&apos;s experience, projects and skills, based
                    on this site and resume.
                  </p>
                  <div className="mt-5 flex flex-col items-start gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="label-mono border border-white/20 px-3 py-2 text-left text-white/80 transition-colors hover:border-ember hover:text-white"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <p className="max-w-[85%] whitespace-pre-wrap bg-crimson px-3.5 py-2.5 text-[0.92rem] leading-relaxed">
                      {m.content}
                    </p>
                  </div>
                ) : (
                  <div key={i} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-ember" />
                    <p className="whitespace-pre-wrap text-[0.95rem] leading-relaxed text-white/85">
                      {m.content ? (
                        <Answer text={m.content} />
                      ) : (
                        <span className="inline-flex gap-1 py-1" aria-label="Thinking">
                          {[0, 1, 2].map((d) => (
                            <span
                              key={d}
                              className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50"
                              style={{ animationDelay: `${d * 120}ms` }}
                            />
                          ))}
                        </span>
                      )}
                    </p>
                  </div>
                ),
              )}

              {error && <p className="label-mono text-ember">{error}</p>}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-white/10 p-3"
            >
              <div className="flex items-end gap-2 border border-white/15 px-3 py-2 focus-within:border-white/40">
                <label htmlFor="chat-input" className="sr-only">
                  Your question
                </label>
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_CHARS}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder={`Ask anything about ${profile.firstName}…`}
                  data-no-focus-ring
                  className="max-h-28 flex-1 resize-none bg-transparent py-1.5 text-[0.95rem] text-white outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send"
                  className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center bg-ember text-white transition-opacity disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
              <p className="label-mono mt-2 px-1 text-[0.58rem] text-white/30">
                AI answers can be imperfect — for anything important, email {profile.email}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
