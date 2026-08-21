"use client";

import { useEffect, useRef, useState } from "react";

type CareersTab = "create" | "cvs";

type Department = "Engineering" | "Security" | "Design" | "Operations";
type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

interface Opening {
  id: string;
  title: string;
  dept: Department;
  type: JobType;
  location: string;
  positions: number;
  filled: number;
  description: string | null;
  requirements: string[];
  posted_at: string;
  created_at: string;
  is_published: boolean;
}

interface Application {
  id: string;
  opening_id: string | null;
  name: string;
  email: string;
  portfolio: string | null;
  role: string;
  department: string | null;
  resume_path: string;
  resume_filename: string | null;
  resume_url: string | null;
  is_read: boolean;
  status: "pending" | "hired" | "not_hired";
  created_at: string;
}

const DEPTS: Department[] = ["Engineering", "Security", "Design", "Operations"];
const TYPES: JobType[] = ["Full-time", "Part-time", "Contract", "Internship"];

const TITLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full-Stack Developer",
  "DevOps Engineer",
  "Cybersecurity Analyst",
  "Penetration Tester",
  "UI/UX Designer",
  "Project Manager",
] as const;

type JobTitle = (typeof TITLES)[number];

// Letters, spaces, commas, periods, hyphens — covers "Remote", "Lahore, Pakistan", "Hybrid - NYC"
const LOCATION_REGEX = /^[a-zA-Z À-ÖØ-öø-ÿ,.\-]{2,100}$/;
const HAS_LETTERS = /[a-zA-Z]/;

// ============================================================
// SHARED TOAST SYSTEM — top-right stack, used by every panel
// ============================================================

type ToastType = "error" | "success";
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
type PushToast = (message: string, type?: ToastType) => void;

function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 top-4 z-[200] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-sm ${
            toast.type === "error"
              ? "border-red-500/20 bg-[#1a0f0f]/95 text-red-400"
              : "border-emerald-500/20 bg-[#0f1a15]/95 text-emerald-400"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 h-4 w-4 shrink-0"
          >
            {toast.type === "error" ? (
              <>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </>
            ) : (
              <path d="M20 6 9 17l-5-5" />
            )}
          </svg>
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss"
            className="shrink-0 opacity-60 hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-4 w-4">
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

export default function CareersClient() {
  const [activeTab, setActiveTab] = useState<CareersTab>("create");
  const [toasts, setToasts] = useState<Toast[]>([]);

    const pushToast: PushToast = (message, type = "error") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => {
      // If this exact message is already showing, drop the old one so the new
      // one takes its place (and gets a fresh 5s timer) instead of stacking a duplicate.
      const withoutDuplicate = prev.filter((t) => t.message !== message);
      return [...withoutDuplicate, { id, message, type }];
    });
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex h-full flex-col p-4 sm:p-6 md:p-10">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <div className="mb-6 shrink-0 sm:mb-8">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Careers</h1>
        <p className="mt-1 text-sm text-white/50">
          Manage job openings and review submitted CVs.
        </p>
      </div>

      {/* ── Tab buttons — one row at every breakpoint ── */}
      <div className="mx-auto flex w-full max-w-6xl shrink-0 flex-row gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("create")}
          className={`flex-1 rounded-xl border px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.1em] transition-colors duration-200 sm:text-base ${
            activeTab === "create"
              ? "border-[#00E5E5]/50 bg-[#00E5E5]/10 text-[#00E5E5]"
              : "border-white/10 bg-white/5 text-white/60 hover:bg-white/[0.08] hover:text-white"
          }`}
        >
          Create an Opening
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cvs")}
          className={`flex-1 rounded-xl border px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.1em] transition-colors duration-200 sm:text-base ${
            activeTab === "cvs"
              ? "border-[#00E5E5]/50 bg-[#00E5E5]/10 text-[#00E5E5]"
              : "border-white/10 bg-white/5 text-white/60 hover:bg-white/[0.08] hover:text-white"
          }`}
        >
          CVs
        </button>
      </div>

      {/* ── Panel ── */}
      <div className="mx-auto mt-8 min-h-0 w-full max-w-6xl flex-1">
        {activeTab === "create" ? (
          <CreateOpeningPanel pushToast={pushToast} />
        ) : (
          <CvsPanel pushToast={pushToast} />
        )}
      </div>
    </div>
  );
}

// ============================================================
// CREATE / EDIT / PUBLISH / UNPUBLISH OPENINGS
// ============================================================

const emptyForm = {
  title: TITLES[0] as JobTitle,
  dept: "Engineering" as Department,
  type: "Full-time" as JobType,
  location: "Remote",
  positions: "1",
  filled: "0",
  description: "",
  requirements: "",
  postedAt: new Date().toISOString().slice(0, 10),
};

function CreateOpeningPanel({ pushToast }: { pushToast: PushToast }) {
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  // editingId === null means "create new". Otherwise we're editing that opening's id.
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState<JobTitle>(emptyForm.title);
  const [dept, setDept] = useState<Department>(emptyForm.dept);
  const [type, setType] = useState<JobType>(emptyForm.type);
  const [location, setLocation] = useState(emptyForm.location);
  const [positions, setPositions] = useState(emptyForm.positions);
  const [filled, setFilled] = useState(emptyForm.filled);
  const [description, setDescription] = useState(emptyForm.description);
  const [requirements, setRequirements] = useState(emptyForm.requirements);
  const [postedAt, setPostedAt] = useState(emptyForm.postedAt);

  const [submitting, setSubmitting] = useState(false);

  // Tracks which opening (if any) currently has an unpublish/publish request in flight,
  // so we can disable just that card's button instead of the whole list.
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchOpenings = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/admin/careers/openings");
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setOpenings(body.openings ?? []);
      }
    } catch (err) {
      console.error("Failed to load openings:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchOpenings();
  }, []);

  const resetForm = () => {
    setTitle(emptyForm.title);
    setDept(emptyForm.dept);
    setType(emptyForm.type);
    setLocation(emptyForm.location);
    setPositions(emptyForm.positions);
    setFilled(emptyForm.filled);
    setDescription(emptyForm.description);
    setRequirements(emptyForm.requirements);
    setPostedAt(new Date().toISOString().slice(0, 10));
    setEditingId(null);
  };

  const startEdit = (job: Opening) => {
    setEditingId(job.id);
    setTitle(job.title as JobTitle);
    setDept(job.dept);
    setType(job.type);
    setLocation(job.location);
    setPositions(String(job.positions));
    setFilled(String(job.filled));
    setDescription(job.description ?? "");
    setRequirements((job.requirements ?? []).join("\n"));
    setPostedAt(job.posted_at ? job.posted_at.slice(0, 10) : new Date().toISOString().slice(0, 10));
    // Scroll the form into view — uses scrollIntoView (not window.scrollTo) since the
    // form lives inside its own overflow-y-auto container, not the page itself.
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cancelEdit = () => {
    resetForm();
  };

  const handleTogglePublish = async (job: Opening) => {
    // Guard: can't republish an opening with zero spots left — the admin
    // needs to raise positions or lower filled first.
    if (!job.is_published) {
      const availableSpots = job.positions - job.filled;
      if (availableSpots <= 0) {
        pushToast(
          `"${job.title}" has 0 spots available. Increase positions before publishing.`,
          "error"
        );
        return;
      }
    }

    setTogglingId(job.id);
    try {
      const res = await fetch(`/api/admin/careers/openings/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !job.is_published }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || "Failed to update opening.");
      }

      // If we happen to be editing the one we just unpublished, exit edit mode.
      if (editingId === job.id) resetForm();

      fetchOpenings();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update opening.";
      pushToast(message, "error");
      console.error("Failed to toggle publish state:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedLocation = location.trim();
    const trimmedDescription = description.trim();
    const requirementLines = requirements
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    if (!TITLES.includes(title)) {
      pushToast("Please select a valid job title.", "error");
      return;
    }

    if (!trimmedLocation) {
      pushToast("Location is required.", "error");
      return;
    }
    if (!LOCATION_REGEX.test(trimmedLocation)) {
      pushToast("Location contains invalid characters — letters, spaces, commas, and hyphens only.", "error");
      return;
    }

    const positionsNum = Number(positions);
    const filledNum = Number(filled);

    if (!Number.isInteger(positionsNum) || positionsNum < 1) {
      pushToast("Positions available must be a whole number of at least 1.", "error");
      return;
    }
    if (!Number.isInteger(filledNum) || filledNum < 0) {
      pushToast("Positions filled cannot be negative.", "error");
      return;
    }
    if (filledNum > positionsNum) {
      pushToast("Positions filled can't exceed positions available.", "error");
      return;
    }

    if (!trimmedDescription) {
      pushToast("Description is required.", "error");
      return;
    }
    if (trimmedDescription.length < 10) {
      pushToast("Description should be at least 10 characters.", "error");
      return;
    }
    if (!HAS_LETTERS.test(trimmedDescription)) {
      pushToast("Description must contain actual text, not just numbers or symbols.", "error");
      return;
    }

    if (requirementLines.length === 0) {
      pushToast("At least one requirement is needed.", "error");
      return;
    }
    if (requirementLines.some((line) => line.length < 3 || !HAS_LETTERS.test(line))) {
      pushToast("Each requirement should be at least 3 characters of actual text.", "error");
      return;
    }

    setSubmitting(true);

    const payload = {
      title,
      dept,
      type,
      location: trimmedLocation,
      positions: positionsNum,
      filled: filledNum,
      description: trimmedDescription,
      requirements: requirementLines,
      postedAt,
    };

    try {
      const res = await fetch(
        editingId ? `/api/admin/careers/openings/${editingId}` : "/api/admin/careers/openings",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body.error || "Failed to save opening.");
      }

      pushToast(editingId ? "Changes saved." : "Opening published.", "success");
      resetForm();
      fetchOpenings();
    } catch (err) {
      pushToast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const published = openings.filter((o) => o.is_published);
  const unpublished = openings.filter((o) => !o.is_published);

  return (
    <div className="flex h-full flex-col gap-8 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/25">
      {/* ── Form ── */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-8"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-white/60">
            {editingId ? "Editing opening" : "New opening"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="font-mono text-xs uppercase tracking-[0.1em] text-white/40 hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Job title" full>
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value as JobTitle)}
              className={inputClass}
            >
              {TITLES.map((t) => (
                <option key={t} value={t} className="bg-[#111318]">
                  {t}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Department">
            <select value={dept} onChange={(e) => setDept(e.target.value as Department)} className={inputClass}>
              {DEPTS.map((d) => (
                <option key={d} value={d} className="bg-[#111318]">
                  {d}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Job type">
            <select value={type} onChange={(e) => setType(e.target.value as JobType)} className={inputClass}>
              {TYPES.map((t) => (
                <option key={t} value={t} className="bg-[#111318]">
                  {t}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Location">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Remote"
              className={inputClass}
            />
          </FormField>

          <FormField label="Posted date">
            <input
              type="date"
              value={postedAt}
              onChange={(e) => setPostedAt(e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Positions available">
            <input
              type="number"
              min={1}
              value={positions}
              onChange={(e) => setPositions(e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Positions filled">
            <input
              type="number"
              min={0}
              value={filled}
              onChange={(e) => setFilled(e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Description *" full>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What this role will own day to day..."
              className={`${inputClass} resize-none`}
            />
          </FormField>

          <FormField label="Requirements (one per line) *" full>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
              placeholder={"2+ years with React/Next.js\nStrong CSS fundamentals"}
              className={`${inputClass} resize-none`}
            />
          </FormField>
        </div>

        <div className="mt-6 flex flex-col-reverse justify-center gap-3 sm:flex-row sm:justify-end">
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="w-full rounded-full border border-white/15 px-8 py-3 font-semibold text-white/70 transition-colors duration-200 hover:bg-white/[0.05] sm:w-auto"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#00E5E5] px-8 py-3 font-semibold text-black transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:w-auto"
          >
            {submitting
              ? editingId
                ? "Saving..."
                : "Publishing..."
              : editingId
              ? "Save changes"
              : "Publish"}
          </button>
        </div>
      </form>

      {/* ── Published openings ── */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Published openings</h2>

        {loadingList ? (
          <p className="text-sm text-white/40">Loading...</p>
        ) : published.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center text-white/50">
            No openings published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((job) => (
              <OpeningCard
                key={job.id}
                job={job}
                isToggling={togglingId === job.id}
                onEdit={() => startEdit(job)}
                onTogglePublish={() => handleTogglePublish(job)}
                toggleLabel="Unpublish"
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Unpublished openings ── */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Unpublished openings</h2>

        {loadingList ? (
          <p className="text-sm text-white/40">Loading...</p>
        ) : unpublished.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center text-white/50">
            Nothing unpublished right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unpublished.map((job) => (
              <OpeningCard
                key={job.id}
                job={job}
                isToggling={togglingId === job.id}
                onEdit={() => startEdit(job)}
                onTogglePublish={() => handleTogglePublish(job)}
                toggleLabel="Publish"
                dimmed
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OpeningCard({
  job,
  isToggling,
  onEdit,
  onTogglePublish,
  toggleLabel,
  dimmed,
}: {
  job: Opening;
  isToggling: boolean;
  onEdit: () => void;
  onTogglePublish: () => void;
  toggleLabel: "Publish" | "Unpublish";
  dimmed?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/[0.02] p-5 ${
        dimmed ? "opacity-60" : ""
      }`}
    >
      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[#00E5E5]">
        {job.dept}
      </span>
      <h3 className="mt-3 text-base font-semibold text-white">{job.title}</h3>
      <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs text-white/40">
        <span>{job.type}</span>
        <span className="h-1 w-1 rounded-full bg-white/20" />
        <span>{job.location}</span>
      </div>
      <p className="mt-3 text-xs text-white/40">
        {Math.max(job.positions - job.filled, 0)} of {job.positions} spot(s) open
      </p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-lg border border-white/15 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-white/70 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onTogglePublish}
          disabled={isToggling}
          className={`flex-1 rounded-lg border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
            toggleLabel === "Unpublish"
              ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
              : "border-[#00E5E5]/40 text-[#00E5E5] hover:bg-[#00E5E5]/10"
          }`}
        >
          {isToggling ? "..." : toggleLabel}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// CVs / APPLICATIONS SHEET
// ============================================================

const STATUS_FILTER_OPTIONS: { value: "all" | "pending" | "hired" | "not_hired"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "hired", label: "Hired" },
  { value: "not_hired", label: "Not Hired" },
];

function StatusFilterDropdown({
  value,
  onChange,
}: {
  value: "all" | "pending" | "hired" | "not_hired";
  onChange: (value: "all" | "pending" | "hired" | "not_hired") => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    STATUS_FILTER_OPTIONS.find((o) => o.value === value)?.label ?? "All statuses";

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] py-2 pl-4 pr-3 text-sm text-white outline-none transition-colors duration-200 hover:bg-white/[0.06] focus:border-[#00E5E5]/60"
      >
        {selectedLabel}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-white/10 bg-[#111318] shadow-xl">
          {STATUS_FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 ${
                option.value === value
                  ? "bg-[#00E5E5]/10 text-[#00E5E5]"
                  : "text-white/70 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatAppliedDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CvsPanel({ pushToast }: { pushToast: PushToast }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "hired" | "not_hired">("all");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/careers/applications");
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setApplications(body.applications ?? []);
      } else {
        pushToast(body.error || "Failed to load applications.", "error");
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
      pushToast("Failed to load applications.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const decide = async (id: string, status: "hired" | "not_hired") => {
    const previous = applications;
    const target = applications.find((a) => a.id === id);
    setUpdatingId(id);

    // Optimistic update — flips the row's color and swaps buttons for text immediately.
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );

    try {
      const res = await fetch(`/api/admin/careers/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        pushToast(body.error || "Failed to update application status.", "error");
        setApplications(previous);
        return;
      }

      const label = status === "hired" ? "Hired" : "Not Hired";
      pushToast(
        target ? `${target.name} marked as ${label}.` : `Marked as ${label}.`,
        "success"
      );
    } catch (err) {
      console.error("Failed to update application status:", err);
      pushToast("Failed to update application status.", "error");
      setApplications(previous);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-white/40">Loading...</p>;
  }

  if (applications.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
        <p className="text-white/50">No applications submitted yet.</p>
      </div>
    );
  }

  const filteredApplications =
    statusFilter === "all"
      ? applications
      : applications.filter((a) => a.status === statusFilter);

  return (
    <div className="flex h-full flex-col">
      {/* ── Filter dropdown ── */}
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <p className="text-xs text-white/40">
          Showing {filteredApplications.length} of {applications.length}
        </p>
        <StatusFilterDropdown value={statusFilter} onChange={setStatusFilter} />
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10">
        <div className="h-full overflow-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/25">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-white/10 bg-[#111318] text-xs font-semibold uppercase tracking-[0.1em] text-white/40">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Portfolio</th>
                <th className="px-5 py-3">Resume</th>
                <th className="px-5 py-3">Applied</th>
                <th className="px-5 py-3 text-right">Decision</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => {
                const isPending = app.status === "pending";
                return (
                  <tr
                    key={app.id}
                    className={`border-b border-white/5 transition-colors duration-150 ${
                      isPending
                        ? "bg-[#00E5E5]/[0.06] font-semibold text-white"
                        : "bg-transparent text-white/50"
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {isPending && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#00E5E5]" />
                        )}
                        {app.name}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/70">{app.email}</td>
                    <td className="px-5 py-4">{app.role}</td>
                    <td className="px-5 py-4 text-white/60">
                      {app.department || <span className="text-white/30">—</span>}
                    </td>
                    <td className="max-w-[160px] truncate px-5 py-4">
                      {app.portfolio ? (
                        <a
                          href={app.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00E5E5] hover:underline"
                        >
                          Link
                        </a>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {app.resume_url ? (
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00E5E5] hover:underline"
                        >
                          {app.resume_filename || "Download"}
                        </a>
                      ) : (
                        <span className="text-white/30">Unavailable</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-white/40">
                      {formatAppliedDate(app.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      {isPending ? (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => decide(app.id, "hired")}
                            disabled={updatingId === app.id}
                            className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-colors duration-150 hover:border-emerald-500/50 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {updatingId === app.id ? "..." : "Hired"}
                          </button>
                          <button
                            type="button"
                            onClick={() => decide(app.id, "not_hired")}
                            disabled={updatingId === app.id}
                            className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors duration-150 hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {updatingId === app.id ? "..." : "Not Hired"}
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-semibold uppercase tracking-[0.1em] ${
                            app.status === "hired" ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {app.status === "hired" ? "Hired" : "Not Hired"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right-edge fade + swipe hint — mobile only, hints there's more to scroll */}
        <div className="pointer-events-none absolute right-0 top-0 flex h-full w-10 items-center justify-end bg-gradient-to-l from-[#0B0C10] to-transparent md:hidden">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1 h-4 w-4 animate-pulse text-white/40"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SHARED FORM HELPERS
// ============================================================

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors duration-200 focus:border-[#00E5E5]/60";

function FormField({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-2 ${full ? "sm:col-span-2" : ""}`}>
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">{label}</span>
      {children}
    </label>
  );
}