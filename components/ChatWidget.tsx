"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

// ======================================================
// TYPES
// ======================================================

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
}

interface QuickReply {
  label: string;
  value: string;
  reply?: string; // canned reply, skips the AI call
  opensLeadForm?: boolean;
}

// ======================================================
// QUICK REPLY DATA
// web-dev / security / pricing answer instantly with a
// canned reply (no API call, no cost). "talk" opens the
// inline lead capture form instead of a text reply.
// ======================================================

const QUICK_REPLIES: QuickReply[] = [
  {
    label: "Web dev",
    value: "web-dev",
    reply:
      "We build custom websites and web apps with Next.js and full-stack setups, from scratch or on existing codebases. Want a quote or to see past work?",
  },
  {
    label: "Security",
    value: "security",
    reply:
      "We handle security audits, hardening, and monitoring for web apps and infra. What kind of system are you looking to secure?",
  },
  {
    label: "Pricing",
    value: "pricing",
    reply:
      "Pricing depends on scope, we quote per project after a quick scoping call. Want me to connect you with the team for a quote?",
  },
  {
    label: "Talk to us",
    value: "talk",
    opensLeadForm: true,
  },
];

const GREETING: ChatMessage = {
  id: "greeting",
  role: "bot",
  text: "Hey, welcome to ZK Nexus. What brings you here today?",
};

// Typed phrases that should open the lead form directly, same as
// clicking the "Talk to us" quick-reply button — no Gemini round trip.
const TALK_TO_US_PATTERNS = [
  "talk to us",
  "talk to someone",
  "talk to a human",
  "talk to the team",
  "talk to your team",
  "talk to an agent",
  "speak to someone",
  "speak to a human",
  "speak to the team",
  "speak with someone",
  "speak with the team",
  "contact you",
  "contact the team",
  "contact us",
  "contact form",
  "lead form",
  "open the form",
  "open a form",
  "open lead form",
  "fill the form",
  "fill out the form",
  "connect me with",
  "connect me to",
  "connect with the team",
  "connect with you",
  "get in touch",
  "reach out",
  "reach you",
  "reach the team",
  "get a quote",
  "want a quote",
  "want to contact",
  "i want to contact",
  "how can i contact",
  "how do i contact",
  "leave my details",
  "leave my info",
  "share my details",
];


function isTalkToUsIntent(text: string): boolean {
  const lower = text.toLowerCase();

  if (TALK_TO_US_PATTERNS.some((p) => lower.includes(p))) return true;

  // Catch-all: "form" mentioned alongside an open/show/fill verb —
  // catches phrasings like "can you open that form" or "show me the form".
  if (/\bform\b/.test(lower) && /(open|fill|show|pull up|bring up)/.test(lower)) {
    return true;
  }

  // Bare mention of wanting a quote almost always means "connect me
  // with the team", so send it straight to the form too.
  if (/\bquote\b/.test(lower)) return true;

  return false;
}

// ======================================================
// CHAT WIDGET
// ======================================================

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Lead form state
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadTopic, setLeadTopic] = useState<string | null>(null);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [leadStatus, setLeadStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [leadError, setLeadError] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, showLeadForm, isThinking]);

  // ---------- Click outside to close ----------

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // ---------- Quick replies ----------

  const handleQuickReply = (qr: QuickReply) => {
    setMessages((prev) => [
      ...prev,
      { id: `${qr.value}-u-${Date.now()}`, role: "user", text: qr.label },
    ]);
    setShowQuickReplies(false);

    if (qr.opensLeadForm) {
      setLeadTopic(qr.label);
      setShowLeadForm(true);
      return;
    }

    if (qr.reply) {
      setMessages((prev) => [
        ...prev,
        { id: `${qr.value}-b-${Date.now()}`, role: "bot", text: qr.reply! },
      ]);
    }
  };

  // ---------- Free-text message -> /api/chat ----------

const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setShowQuickReplies(false);

    // Abandoning an open lead form by typing a new message instead —
    // close it and reset so it comes back clean if reopened later.
    if (showLeadForm) {
      setShowLeadForm(false);
      setLeadTopic(null);
      setLeadName("");
      setLeadEmail("");
      setLeadMessage("");
      setLeadStatus("idle");
      setLeadError("");
    }

    // Typed "talk to us" (or similar) opens the same lead form as the
    // quick-reply button, instead of going through the Gemini call.
    if (isTalkToUsIntent(trimmed)) {
      setLeadTopic("Talk to us");
      setShowLeadForm(true);
      return;
    }

    setIsThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get a reply.");
      }

      setMessages((prev) => [
        ...prev,
        { id: `b-${Date.now()}`, role: "bot", text: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-err-${Date.now()}`,
          role: "bot",
          text: "Sorry, something went wrong on my end. Try again, or tap \"Talk to us\" to reach the team directly.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  // ---------- Lead form submit -> /api/chat/lead ----------

  const handleLeadSubmit = async () => {
    if (!leadName.trim() || !leadEmail.trim()) {
      setLeadError("Please fill in your name and email.");
      return;
    }

    setLeadStatus("sending");
    setLeadError("");

    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName.trim(),
          email: leadEmail.trim(),
          message: leadMessage.trim(),
          topic: leadTopic,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send.");
      }

      setLeadStatus("sent");
      setMessages((prev) => [
        ...prev,
        {
          id: `lead-sent-${Date.now()}`,
          role: "bot",
          text: `Thanks ${leadName.trim()}, that's sent through. We'll email you at ${leadEmail.trim()} shortly.`,
        },
      ]);
      setTimeout(() => {
        setShowLeadForm(false);
        setLeadName("");
        setLeadEmail("");
        setLeadMessage("");
        setLeadStatus("idle");
      }, 1200);
    } catch (err) {
      setLeadStatus("error");
      setLeadError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-6 right-6 md:bottom-16 md:right-16 z-50 flex flex-col items-end gap-3.5"
    >
      {/* ================= PANEL ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-[340px] max-w-[90vw] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_40px_rgba(0,229,229,0.08)]"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-4.5 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#00E5E5]/30 bg-[#00E5E5]/10 text-sm font-medium text-[#00E5E5]">
                Z
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-[#F5F5F5]">
                  ZK Nexus
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-[#8A8F98]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00E5E5]" />
                  online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex max-h-[380px] flex-col gap-3 overflow-y-auto px-4.5 py-4"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "bot"
                      ? "max-w-[85%] self-start rounded-xl rounded-tl-sm border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5"
                      : "max-w-[80%] self-end rounded-xl rounded-br-sm bg-[#00E5E5] px-3.5 py-2.5"
                  }
                >
                  <p
                    className={
                      m.role === "bot"
                        ? "text-[13px] leading-relaxed text-[#D8DADE]"
                        : "text-[13px] leading-relaxed text-[#0B0C10]"
                    }
                  >
                    {m.text}
                  </p>
                </div>
              ))}

              {isThinking && (
                <div className="flex max-w-[60%] items-center gap-2 self-start rounded-xl rounded-tl-sm border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5">
                  <Loader2 size={13} className="animate-spin text-[#00E5E5]" />
                  <span className="text-[12px] text-[#8A8F98]">typing...</span>
                </div>
              )}

              {showQuickReplies && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr.value}
                      onClick={() => handleQuickReply(qr)}
                      className="rounded-[10px] border border-[#00E5E5]/25 bg-[#00E5E5]/[0.06] px-2 py-2.5 text-xs text-[#00E5E5] transition-colors hover:bg-[#00E5E5]/[0.12]"
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Inline lead capture form */}
              {showLeadForm && (
                <div className="flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] p-3.5">
                  <p className="text-[12px] text-[#8A8F98]">
                    Leave your details and we&apos;ll reach out
                  </p>
                  <input
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Your name"
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#F5F5F5] placeholder:text-[#5F636A] focus:outline-none focus:border-[#00E5E5]/40"
                  />
                  <input
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="Your email"
                    type="email"
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#F5F5F5] placeholder:text-[#5F636A] focus:outline-none focus:border-[#00E5E5]/40"
                  />
                  <textarea
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    placeholder="What do you need help with? (optional)"
                    rows={2}
                    className="resize-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#F5F5F5] placeholder:text-[#5F636A] focus:outline-none focus:border-[#00E5E5]/40"
                  />
                  {leadError && (
                    <p className="text-[11px] text-red-400">{leadError}</p>
                  )}
                  <button
                    onClick={handleLeadSubmit}
                    disabled={leadStatus === "sending" || leadStatus === "sent"}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-[#00E5E5] px-3 py-2 text-xs font-medium text-[#0B0C10] transition-opacity disabled:opacity-60"
                  >
                    {leadStatus === "sending" && (
                      <Loader2 size={13} className="animate-spin" />
                    )}
                    {leadStatus === "sent"
                      ? "Sent"
                      : leadStatus === "sending"
                        ? "Sending..."
                        : "Send"}
                  </button>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 border-t border-white/[0.06] px-4.5 py-3.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                disabled={isThinking}
                className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#F5F5F5] placeholder:text-[#5F636A] focus:outline-none focus:border-[#00E5E5]/40 disabled:opacity-60"
              />
              <button
                onClick={handleSend}
                disabled={isThinking}
                aria-label="Send message"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#00E5E5] text-[#0B0C10] transition-transform active:scale-95 disabled:opacity-60"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= FAB ================= */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="relative flex h-[58px] w-[58px] md:h-[72px] md:w-[72px] items-center justify-center rounded-full transition-colors"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="flex h-full w-full items-center justify-center rounded-full bg-[#00E5E5] shadow-[0_0_24px_rgba(0,229,229,0.3)]"
            >
              <X size={20} className="text-[#0B0C10]" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: 90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="relative flex h-full w-full items-center justify-center rounded-full border border-[#00E5E5]/40 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_24px_rgba(0,229,229,0.12)]"
            >
              <MessageCircle size={28} className="text-[#00E5E5]" />
              <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0B0C10] bg-[#00E5E5]" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}