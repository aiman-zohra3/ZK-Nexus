"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, ArrowRight, CheckCircle2 } from "lucide-react";
import { jobs, remainingSpots, type Job } from "@/data/jobs";

const deptAccent: Record<Job["dept"], string> = {
  Engineering: "text-[#00E5E5]",
  Security: "text-[#F87171]",
  Design: "text-[#635BFF]",
  Operations: "text-[#D9B382]",
};

const values = [
  { label: "Ownership", copy: "You scope it, you ship it, you own the outcome. No hand-offs into the void." },
  { label: "Security by default", copy: "Every engineer here thinks like an attacker, not just a builder." },
  { label: "Remote-first", copy: "We hire on output, not location. Async by default, sync when it matters." },
  { label: "Small, deliberate team", copy: "No 40-person standups. Every hire moves the whole team's ceiling up." },
];

// ======================================================
// VALIDATION
// ======================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s]+$/;
const URL_REGEX = /^https?:\/\/[^\s]+\.[^\s]+$/;

function validateName(value: string): string {
  if (!value.trim()) return "Full name is required.";
  if (value.trim().length < 2) return "Name looks too short.";
  if (!NAME_REGEX.test(value.trim())) return "Name can only contain letters and spaces.";
  return "";
}

function validateEmail(value: string): string {
  if (!value.trim()) return "Email address is required.";
  if (!EMAIL_REGEX.test(value.trim())) return "Please enter a valid email address.";
  return "";
}

function validatePortfolio(value: string): string {
  if (!value.trim()) return ""; // optional
  if (!URL_REGEX.test(value.trim())) return "Please enter a valid URL (starting with http:// or https://).";
  return "";
}

// ======================================================
// SHARED BADGE COMPONENT
// ======================================================

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5"
    >
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#00E5E5]">
        {children}
      </span>
    </motion.div>
  );
}

export default function CareersPage() {
  const [activeRole, setActiveRole] = useState<Job | null>(null);

  const hasOpenRoles = jobs.length > 0;

  return (
    <main className="min-h-screen w-full bg-brand-ink text-[#E2E8F0]">
      {/* HERO */}
      {/* HERO */}
<section className="relative overflow-hidden bg-[#0B0C10]">
  <div className="absolute inset-x-0 top-0 h-[300px] sm:h-[450px] bg-[radial-gradient(circle_at_center,_rgba(0,229,229,0.18)_0%,_rgba(0,229,229,0.08)_35%,_transparent_75%)] blur-3xl" />

  <div className="relative mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 pt-32 pb-16 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5"
    >
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#00E5E5]">
        Careers
      </span>
    </motion.div>

    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-[clamp(2.75rem,6vw,4.75rem)] font-black leading-[1.05] text-white">
          Build the systems <br />
          that keep the internet <br />
          <span className="text-[#00E5E5]">honest.</span>
        </h1>
      </motion.div>
    </div>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="mt-8 max-w-2xl text-base md:text-lg leading-7 md:leading-8 text-[#8B93A3] px-2"
    >
      We're a small, remote-first team of developers and security
      engineers building secure, modern digital products.
    </motion.p>
  </div>
</section>
      {/* VALUES */}
      <section className="border-y border-white/10 px-6 py-3 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              
              <h3 className="mt-3 text-lg font-semibold">{v.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8B93A3]">{v.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section className="px-6 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <Badge>Open positions</Badge>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-6xl">
            Where you'd fit in
          </h2>

          <div className="mt-12">
            {hasOpenRoles ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {jobs.map((job, i) => {
                  const remaining = remainingSpots(job);
                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      className="group relative flex flex-col justify-between rounded-xl border border-[#00e5e5]/40 bg-[#111318] p-6 transition-all duration-300  hover:shadow-[0_0_30px_-10px_rgba(0,229,229,0.4)]"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] ${deptAccent[job.dept]}`}
                          >
                            {job.dept}
                          </span>
                          <span className="font-mono text-[10px] text-white/40">
                            {remaining} {remaining === 1 ? "spot" : "spots"} left
                          </span>
                        </div>

                        <h3 className="mt-4 text-xl font-semibold text-white">
                          {job.title}
                        </h3>

                        <div className="mt-2 flex items-center gap-3 font-mono text-xs text-white/40">
                          <span>{job.type}</span>
                          <span className="h-1 w-1 rounded-full bg-white/20" />
                          <span>{job.location}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveRole(job)}
                        className="mt-6 flex w-fit items-center gap-2 rounded-full border border-brand-cyan/50 px-4 py-2 font-mono text-xs font-medium uppercase tracking-[0.1em] text-brand-cyan transition-all duration-300 hover:bg-brand-cyan/10"
                      >
                        Apply Now
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeRole && <ApplyModal role={activeRole} onClose={() => setActiveRole(null)} />}
      </AnimatePresence>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#111318] px-6 py-20 text-center">
      <Badge>No open positions currently</Badge>
      <h3 className="mt-4 max-w-md font-display text-2xl font-semibold">
        We're always excited to connect with talented developers and
        cybersecurity professionals.
      </h3>
      <a
        href="mailto:zknexus@gmail.com"
        className="mt-8 inline-flex items-center gap-2 rounded-lg border border-brand-cyan/50 bg-brand-cyan/10 px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.15em] text-brand-cyan transition-all duration-300 hover:bg-brand-cyan/20"
      >
        Send your resume · zknexus@gmail.com
      </a>
    </div>
  );
}

function ApplyModal({ role, onClose }: { role: Job; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fileName, setFileName] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    portfolio?: string;
  }>({});
  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    portfolio?: boolean;
  }>({});

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const sanitized = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setName(sanitized);
    if (touched.name) {
      setFieldErrors((prev) => ({ ...prev, name: validateName(sanitized) }));
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setFieldErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  }

  function handlePortfolioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPortfolio(value);
    if (touched.portfolio) {
      setFieldErrors((prev) => ({ ...prev, portfolio: validatePortfolio(value) }));
    }
  }

  function handleBlur(field: "name" | "email" | "portfolio") {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validators = { name: validateName, email: validateEmail, portfolio: validatePortfolio };
    const value = field === "name" ? name : field === "email" ? email : portfolio;
    setFieldErrors((prev) => ({ ...prev, [field]: validators[field](value) }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    if (file && file.size > 5 * 1024 * 1024) {
      setError("File is too large. Max size is 5MB.");
      e.target.value = "";
      setFileName("");
      setResumeFile(null);
      return;
    }

    setError(null);
    setFileName(file?.name ?? "");
    setResumeFile(file);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const portfolioErr = validatePortfolio(portfolio);

    setFieldErrors({ name: nameErr, email: emailErr, portfolio: portfolioErr });
    setTouched({ name: true, email: true, portfolio: true });

    if (nameErr || emailErr || portfolioErr) return;

    if (!resumeFile) {
      setError("Please attach your resume.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("portfolio", portfolio);
      formData.append("role", role.title);
      formData.append("department", role.dept);
      formData.append("resume", resumeFile);

      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit application.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-[#111318] p-8"
      >
        <button onClick={onClose} className="absolute right-5 top-5 text-white/40 hover:text-white" aria-label="Close">
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <Badge>Apply for</Badge>
            <h3 className="mt-3 text-2xl font-semibold text-[#00E5E5]">{role.title}</h3>
            <p className="mt-1 text-sm text-white/40">
              {role.dept} · {role.type} · {role.location}
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
              <Field label="Full name" error={touched.name ? fieldErrors.name : undefined}>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={() => handleBlur("name")}
                  placeholder="Jane Doe"
                  className={`w-full rounded-lg border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors duration-200 ${
                    touched.name && fieldErrors.name
                      ? "border-red-500/70 focus:border-red-500"
                      : "border-white/15 focus:border-brand-cyan/60"
                  }`}
                />
              </Field>

              <Field label="Email" error={touched.email ? fieldErrors.email : undefined}>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur("email")}
                  placeholder="jane@email.com"
                  className={`w-full rounded-lg border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors duration-200 ${
                    touched.email && fieldErrors.email
                      ? "border-red-500/70 focus:border-red-500"
                      : "border-white/15 focus:border-brand-cyan/60"
                  }`}
                />
              </Field>

              <Field label="Portfolio / GitHub" error={touched.portfolio ? fieldErrors.portfolio : undefined}>
                <input
                  type="url"
                  value={portfolio}
                  onChange={handlePortfolioChange}
                  onBlur={() => handleBlur("portfolio")}
                  placeholder="https://github.com/janedoe"
                  className={`w-full rounded-lg border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors duration-200 ${
                    touched.portfolio && fieldErrors.portfolio
                      ? "border-red-500/70 focus:border-red-500"
                      : "border-white/15 focus:border-brand-cyan/60"
                  }`}
                />
              </Field>

              <Field label="Resume">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-white/20 bg-white/[0.03] px-4 py-3 text-sm text-white/50 hover:border-brand-cyan/50">
                  <Upload size={16} />
                  {fileName || "Upload PDF (max 5MB)"}
                  <input
                    required
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </Field>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    inline-flex items-center gap-2
                    rounded-full
                    bg-[#00E5E5]
                    px-8
                    py-4
                    font-semibold
                    text-black
                    transition-all
                    duration-300
                    hover:scale-105
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:scale-100
                  "
                >
                  {submitting ? "Submitting..." : "Submit Application →"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 size={40} className="text-brand-cyan" />
            <h3 className="mt-4 text-xl font-semibold">Application received</h3>
            <p className="mt-2 max-w-xs text-sm text-white/50">
              Thanks for applying to {role.title}. We'll review your application and reach out if it's a fit.
            </p>
            <button onClick={onClose} className="mt-6 rounded-lg border border-white/15 px-5 py-2 font-mono text-xs uppercase tracking-[0.1em] text-white/70 hover:border-white/30">
              Close
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">{label}</span>
      {children}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
}