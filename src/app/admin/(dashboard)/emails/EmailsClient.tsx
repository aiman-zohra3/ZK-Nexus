"use client";

import { useState } from "react";
import type { EmailInquiry } from "./page";

const AVATAR_COLORS = [
  "#00E5E5", "#7C7CFF", "#FF7CA3", "#FFB86B", "#6BFFB8", "#FF6B6B",
];

interface EmailReply {
  id: string;
  message: string;
  created_at: string;
}

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Delete confirmation (replaces window.confirm)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Reply history
  const [replies, setReplies] = useState<EmailReply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [replySent, setReplySent] = useState(false);

  // Stat-card filter (Total / Unread / Read)
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");

  const total = emails.length;
  const unreadCount = emails.filter((e) => !e.is_read).length;
  const readCount = total - unreadCount;
  const filteredEmails =
    statusFilter === "all"
      ? emails
      : emails.filter((e) => (statusFilter === "unread" ? !e.is_read : e.is_read));
  const selectedEmail = emails.find((e) => e.id === selectedId) ?? null;
  const deleteTarget = emails.find((e) => e.id === deleteConfirmId) ?? null;

  const markAsRead = async (id: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_read: true } : e))
    );

    try {
      const res = await fetch(`/api/admin/emails/${id}/read`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Mark as read failed:", res.status, body);
        setEmails((prev) =>
          prev.map((e) => (e.id === id ? { ...e, is_read: false } : e))
        );
      }
    } catch (err) {
      console.error("Mark as read network error:", err);
      setEmails((prev) =>
        prev.map((e) => (e.id === id ? { ...e, is_read: false } : e))
      );
    }
  };

  const fetchReplies = async (id: string) => {
    setLoadingReplies(true);
    setReplies([]);
    try {
      const res = await fetch(`/api/admin/emails/${id}/replies`);
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setReplies(body.replies ?? []);
      } else {
        console.error("Failed to fetch replies:", body.error);
      }
    } catch (err) {
      console.error("Fetch replies network error:", err);
    } finally {
      setLoadingReplies(false);
    }
  };

  const openEmail = (id: string) => {
    if (!id) return;
    setSelectedId(id);
    setShowReplyBox(false);
    setReplyText("");
    setReplyError(null);
    setReplySent(false);

    const target = emails.find((e) => e.id === id);
    if (target && !target.is_read) {
      markAsRead(id);
    }

    fetchReplies(id);
  };

  const closeEmail = () => {
    setSelectedId(null);
    setShowReplyBox(false);
    setReplyText("");
    setReplyError(null);
    setReplySent(false);
    setReplies([]);
  };

  // Step 1: open confirmation modal instead of window.confirm
  const requestDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeleteConfirmId(id);
  };

  const cancelDelete = () => setDeleteConfirmId(null);

  // Step 2: actually perform the delete once confirmed
  const confirmDelete = async () => {
    const id = deleteConfirmId;
    if (!id) return;

    const previousEmails = emails;
    setDeleteConfirmId(null);
    setDeletingId(id);
    setEmails((prev) => prev.filter((email) => email.id !== id));
    if (selectedId === id) closeEmail();

    try {
      const res = await fetch(`/api/admin/emails/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error(`Delete failed (status ${res.status}):`, body.error || body);
        setEmails(previousEmails);
      }
    } catch (err) {
      console.error("Delete network error:", err);
      setEmails(previousEmails);
    } finally {
      setDeletingId(null);
    }
  };

  const sendReply = async () => {
    if (!selectedEmail || !replyText.trim()) return;

    setIsReplying(true);
    setReplyError(null);

    try {
      const res = await fetch(`/api/admin/emails/${selectedEmail.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText.trim() }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body.error || "Failed to send reply.");
      }

      const sentAt = new Date().toISOString();

      setEmails((prev) =>
        prev.map((e) =>
          e.id === selectedEmail.id
            ? { ...e, replied: true, replied_at: sentAt, is_read: true }
            : e
        )
      );

      // Prepend the new reply to the local history immediately
      setReplies((prev) => [
        { id: `temp-${sentAt}`, message: replyText.trim(), created_at: sentAt },
        ...prev,
      ]);

      setReplySent(true);
      setReplyText("");
      setShowReplyBox(false);
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "Failed to send reply.");
    } finally {
      setIsReplying(false);
    }
  };

   return (
    <div className="flex h-full flex-col p-6 md:p-10">
      <div className="mb-8 shrink-0">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Emails</h1>
        <p className="mt-1 text-sm text-white/50">
          Quick inquiries submitted through the &quot;Email Us&quot; form.
        </p>
      </div>

            {/* ── Stat cards (now double as filters) ── */}
      <div className="mb-8 grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`rounded-2xl border p-4 md:p-5 text-left transition-colors duration-200 ${
            statusFilter === "all"
              ? "border-white/30 bg-white/10"
              : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
            Total
          </p>
          <p className="mt-2 text-xl md:text-3xl font-bold text-white">{total}</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("unread")}
          className={`rounded-2xl border p-4 md:p-5 text-left transition-colors duration-200 ${
            statusFilter === "unread"
              ? "border-[#00E5E5]/60 bg-[#00E5E5]/10"
              : "border-[#00E5E5]/20 bg-[#00E5E5]/5 hover:bg-[#00E5E5]/[0.08]"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#00E5E5]/70">
            Unread
          </p>
          <p className="mt-2 text-xl md:text-3xl font-bold text-[#00E5E5]">{unreadCount}</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("read")}
          className={`rounded-2xl border p-4 md:p-5 text-left transition-colors duration-200 ${
            statusFilter === "read"
              ? "border-white/30 bg-white/10"
              : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
            Read
          </p>
          <p className="mt-2 text-xl md:text-3xl font-bold text-white/70">{readCount}</p>
        </button>
      </div>

      {/* ── Table ── */}
            {/* ── Table ── */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10">
        {total === 0 ? (
          <div className="flex h-full items-center justify-center bg-white/[0.02] py-16">
            <p className="text-white/50">No messages yet.</p>
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="flex h-full items-center justify-center bg-white/[0.02] py-16">
            <p className="text-white/50">
              No {statusFilter === "unread" ? "unread" : "read"} messages.
            </p>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-white/10 bg-[#111318] text-xs font-semibold uppercase tracking-[0.1em] text-white/40">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3">Message</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmails.map((item) => {
                  if (!item.id) return null;
                  return (
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
                      <td className="max-w-[160px] truncate px-5 py-4 text-white/60">
                        {item.subject || <span className="text-white/30">—</span>}
                      </td>
                      <td className="max-w-xs truncate px-5 py-4 text-white/50">
                        {item.message}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-white/40">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => requestDelete(item.id, e)}
                          disabled={deletingId === item.id}
                          aria-label="Delete email"
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors duration-150 hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                            <path d="M3 6h18" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                          </svg>
                          {deletingId === item.id ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={cancelDelete}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0B0C10] p-6 shadow-[0_0_60px_-15px_rgba(255,0,0,0.2)]">
            <h3 className="text-lg font-bold text-white">Delete this email?</h3>
            <p className="mt-2 text-sm text-white/50">
              The message from{" "}
              <span className="font-semibold text-white/80">{deleteTarget.name}</span>{" "}
              (<span className="text-white/60">{deleteTarget.email}</span>) will be
              permanently removed. This can&apos;t be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={cancelDelete}
                className="text-sm font-semibold text-white/50 transition-colors hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex items-center gap-2 rounded-full  px-4 py-1.5 text-sm font-semibold border border-white/20 text-red-700 transition-transform duration-200 hover:scale-[1.02]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
                  {selectedEmail.subject || `New inquiry from ${selectedEmail.name}`}
                </h2>
                <p className="mt-1 text-xs text-white/40">
                  {formatDate(selectedEmail.created_at)}
                  {selectedEmail.replied && (
                    <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                      Replied
                    </span>
                  )}
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

            {/* Body + reply history (scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="whitespace-pre-wrap text-[15px] leading-7 text-white/80">
                {selectedEmail.message}
              </p>

              {/* ── Previous replies ── */}
              {loadingReplies ? (
                <p className="mt-6 text-xs text-white/30">Loading previous replies…</p>
              ) : replies.length > 0 ? (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                    Previous Replies ({replies.length})
                  </p>
                  <div className="space-y-5">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-4"
                      >
                        <p className="text-xs font-semibold text-emerald-400">
                          {formatDate(reply.created_at)}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/70">
                          {reply.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-6 py-4">
              {replySent && (
                <p className="mb-3 text-xs text-emerald-400">
                  Reply sent to {selectedEmail.email}.
                </p>
              )}

              {showReplyBox ? (
                <div className="space-y-3">
                  <textarea
                    autoFocus
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Write your reply to ${selectedEmail.name}...`}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white placeholder-white/30 outline-none transition-colors duration-200 focus:border-[#00E5E5]"
                  />
                  {replyError && <p className="text-xs text-red-400">{replyError}</p>}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={sendReply}
                      disabled={isReplying || !replyText.trim()}
                      className="inline-flex items-center gap-2 rounded-full bg-[#00E5E5] px-5 py-2.5 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                    >
                      {isReplying ? "Sending…" : "Send Reply"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReplyBox(false);
                        setReplyError(null);
                      }}
                      disabled={isReplying}
                      className="text-sm font-semibold text-white/50 transition-colors hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyBox(true);
                    setReplySent(false);
                    setReplyError(null);
                  }}
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
                  {selectedEmail.replied ? "Reply Again" : "Reply"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}