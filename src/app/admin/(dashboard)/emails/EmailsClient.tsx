"use client";

import { useState } from "react";
import type { EmailInquiry } from "./page";

const AVATAR_COLORS = [
  "#00E5E5", "#7C7CFF", "#FF7CA3", "#FFB86B", "#6BFFB8", "#FF6B6B",
];

function getAvatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EmailsClient({
  initialEmails,
}: {
  initialEmails: EmailInquiry[];
}) {
  const [emails, setEmails] = useState<EmailInquiry[]>(initialEmails);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyNotice, setReplyNotice] = useState(false);

  const total = emails.length;
  const unreadCount = emails.filter((e) => !e.is_read).length;
  const readCount = total - unreadCount;
  const selectedEmail = emails.find((e) => e.id === selectedId) ?? null;

  const openEmail = async (id: string) => {
    setSelectedId(id);
    setReplyNotice(false);

    const target = emails.find((e) => e.id === id);
    if (!target || target.is_read) return; // already read, nothing to do

    // Optimistic update — flip to read immediately in UI
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_read: true } : e))
    );

    try {
      const res = await fetch(`/api/admin/emails/${id}/read`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed");
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
      // Revert optimistic update
      setEmails((prev) =>
        prev.map((e) => (e.id === id ? { ...e, is_read: false } : e))
      );
    }
  };

  const closeEmail = () => {
    setSelectedId(null);
    setReplyNotice(false);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Emails</h1>
        <p className="mt-1 text-sm text-white/50">
          Quick inquiries submitted through the &quot;Email Us&quot; form.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
            Total
          </p>
          <p className="mt-2 text-3xl font-bold text-white">{total}</p>
        </div>
        <div className="rounded-2xl border border-[#00E5E5]/20 bg-[#00E5E5]/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#00E5E5]/70">
            Unread
          </p>
          <p className="mt-2 text-3xl font-bold text-[#00E5E5]">{unreadCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
            Read
          </p>
          <p className="mt-2 text-3xl font-bold text-white/70">{readCount}</p>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-white/10">
        {total === 0 ? (
          <div className="flex items-center justify-center bg-white/[0.02] py-16">
            <p className="text-white/50">No messages yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-xs font-semibold uppercase tracking-[0.1em] text-white/40">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Message</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => openEmail(item.id)}
                    className={`cursor-pointer border-b border-white/5 transition-colors duration-150 ${
                      item.is_read
                        ? "bg-transparent text-white/50 hover:bg-white/[0.03]"
                        : "bg-[#00E5E5]/[0.06] font-semibold text-white hover:bg-[#00E5E5]/[0.1]"
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {!item.is_read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#00E5E5]" />
                        )}
                        {item.name}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/70">{item.email}</td>
                    <td className="max-w-xs truncate px-5 py-4 text-white/50">
                      {item.message}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-white/40">
                      {formatDate(item.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Email detail modal ── */}
      {selectedEmail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeEmail}
          />

          <div className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0B0C10] shadow-[0_0_60px_-15px_rgba(0,229,229,0.25)]">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-white">
                  New inquiry from {selectedEmail.name}
                </h2>
                <p className="mt-1 text-xs text-white/40">
                  {formatDate(selectedEmail.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEmail}
                aria-label="Close"
                className="text-white/40 transition-colors hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  className="h-5 w-5"
                >
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sender row */}
            <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black"
                style={{ backgroundColor: getAvatarColor(selectedEmail.email) }}
              >
                {getInitials(selectedEmail.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {selectedEmail.name}{" "}
                  <span className="font-normal text-white/40">
                    &lt;{selectedEmail.email}&gt;
                  </span>
                </p>
                <p className="text-xs text-white/40">to me</p>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="whitespace-pre-wrap text-[15px] leading-7 text-white/80">
                {selectedEmail.message}
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-6 py-4">
              {replyNotice && (
                <p className="mb-3 text-xs text-[#00E5E5]">
                  Reply functionality is coming soon.
                </p>
              )}
              <button
                type="button"
                onClick={() => setReplyNotice(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:border-[#00E5E5]/50 hover:text-[#00E5E5]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M9 17l-5-5 5-5" />
                  <path d="M4 12h11a5 5 0 0 1 5 5v1" />
                </svg>
                Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}