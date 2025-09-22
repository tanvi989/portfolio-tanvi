"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Msg = { id: string; role: "user" | "bot"; text: string; ts: number };
const LS_KEY = "tanvi-chat";

const SUGGESTIONS = [
  "Show featured projects",
  "What are your top skills?",
  "How can I contact you?",
  "Are you available this month?",
];

function uid() {
  return Math.random().toString(36).slice(2);
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // restore chat history
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setMsgs(JSON.parse(saved));
      else
        setMsgs([
          {
            id: uid(),
            role: "bot",
            text:
              "Hi! I’m Tanvi’s assistant 👋\nAsk about projects, skills, availability, or say ‘contact’.",
            ts: Date.now(),
          },
        ]);
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(msgs));
    } catch {}
  }, [msgs]);

  // auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing, open]);

  // external opener (from FloatingActions button)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chatbot", handler as any);
    return () => window.removeEventListener("open-chatbot", handler as any);
  }, []);

  const handleSend = async (textRaw?: string) => {
    const text = (textRaw ?? input).trim();
    if (!text) return;
    setInput("");

    const userMsg: Msg = { id: uid(), role: "user", text, ts: Date.now() };
    setMsgs((m) => [...m, userMsg]);

    setTyping(true);
    const reply = await botReply(text);
    setTyping(false);

    const botMsg: Msg = { id: uid(), role: "bot", text: reply, ts: Date.now() };
    setMsgs((m) => [...m, botMsg]);
  };

  // very light intent engine (you can tailor answers)
  const botReply = async (q: string): Promise<string> => {
    const s = q.toLowerCase();

    // contact
    if (/(contact|email|mail|reach|connect)/.test(s)) {
      return [
        "You can reach Tanvi at **you@example.com**.",
        "Also see the contact page → /contact.",
        "Quick links: WhatsApp (FAB), Call, or the form.",
      ].join("\n");
    }

    // availability
    if (/(available|availability|free|capacity)/.test(s)) {
      return "Tanvi is currently **taking new projects this month**. Share timeline/scope on /contact and she’ll reply within 24h.";
    }

    // skills
    if (/(skill|stack|tech)/.test(s)) {
      return [
        "Top skills: React, TypeScript, Next.js, Node.js, Python, AWS.",
        "Explore more on → /skills (filter by category).",
      ].join("\n");
    }

    // projects
    if (/(project|portfolio|work|case)/.test(s)) {
      return [
        "Featured projects include E-Commerce Platform, SaaS Analytics, IoT Fleet Monitor, and more.",
        "Browse → /projects (filter by tag, search, sort).",
      ].join("\n");
    }

    // pricing / rates (generic)
    if (/(price|rate|cost|budget|hire)/.test(s)) {
      return "Rates vary by scope/complexity. Share a brief (goals, timeline, constraints) via /contact to get a tailored estimate.";
    }

    // greetings
    if (/(hello|hey|hi|how are you)/.test(s)) {
      return "Hey! How can I help today — projects, skills, availability, or something else?";
    }

    // default
    return "Got it! I can help with **projects**, **skills**, **availability**, or **contact**. Try: “Show featured projects” or “How can I contact you?”.";
  };

  // message renderer (with minimal markdown for **bold** + links)
 // replace your renderText with this:
const renderText = (t: string) => {
  // 1) split into link vs non-link chunks first
  const linkTokens = t.split(/(\/[a-zA-Z0-9\-_/]+)/g);

  const out: React.ReactNode[] = [];
  linkTokens.forEach((tok, i) => {
    // if it's a route-like token, render as <a>
    if (/^\/[a-zA-Z0-9\-_/]+$/.test(tok)) {
      out.push(
        <a key={`link-${i}`} href={tok} className="text-[var(--accent)] hover:opacity-80">
          {tok}
        </a>
      );
      return;
    }

    // 2) within plain text chunks, support **bold**
    const boldTokens = tok.split(/(\*\*[^*]+\*\*)/g);
    boldTokens.forEach((seg, j) => {
      if (!seg) return;
      if (/^\*\*.+\*\*$/.test(seg)) {
        out.push(<strong key={`b-${i}-${j}`}>{seg.slice(2, -2)}</strong>);
      } else {
        out.push(<span key={`t-${i}-${j}`}>{seg}</span>);
      }
    });
  });

  return out;
};

  return (
    <>
      {/* launcher for small screens if you don't use FloatingActions */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 md:hidden flex items-center justify-center w-14 h-14 rounded-full bg-[var(--accent)] shadow-xl"
        aria-label="Open chatbot"
      >
        <i className={`text-white text-2xl ${open ? "fas fa-times" : "fas fa-robot"}`} />
      </button>

      {/* chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] max-w-sm mac-card rounded-2xl shadow-2xl overflow-hidden">
          {/* header */}
          <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-primary)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fas fa-robot text-[var(--accent)]" />
              <div className="font-semibold">Tanvi’s Assistant</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="opacity-70 hover:opacity-100"
              aria-label="Close"
            >
              <i className="fas fa-times" />
            </button>
          </div>

          {/* messages */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[var(--accent)]/90 text-[var(--bg-primary)]"
                      : "bg-[var(--border)]/40 text-[var(--text-primary)]"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{renderText(m.text)}</div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg bg-[var(--border)]/40 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* suggestions */}
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-xs px-2 py-1 rounded border border-[var(--border)] hover:border-[var(--accent)]/60"
              >
                {s}
              </button>
            ))}
          </div>

          {/* input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[var(--border)] bg-[var(--bg-primary)] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 px-3 py-2 rounded-lg border bg-transparent border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              className="mac-button px-4 py-2 rounded-lg font-medium"
              aria-label="Send"
            >
              <i className="fas fa-paper-plane" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
