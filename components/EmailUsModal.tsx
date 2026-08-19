"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type EmailForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type EmailFormErrors = Partial<Record<keyof EmailForm, string>>;
type TouchedState = Partial<Record<keyof EmailForm, boolean>>;

const initialForm: EmailForm = { name: "", email: "", subject: "", message: "" };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

const validateField = (name: keyof EmailForm, value: string): string => {
  switch (name) {
    case "name":
      if (!value.trim()) return "Full name is required.";
      if (value.trim().length < 2) return "Name looks too short.";
      if (!NAME_REGEX.test(value.trim()))
        return "Name can only contain letters, spaces, and hyphens.";
      return "";
    case "email":
      if (!value.trim()) return "Email address is required.";
      if (!EMAIL_REGEX.test(value.trim()))
        return "Please enter a valid email address.";
      return "";
    case "subject":
      if (!value.trim()) return "Subject is required.";
      if (value.trim().length < 3) return "Subject looks too short.";
      return "";
    case "message":
      if (!value.trim()) return "Please tell us a bit about what you need.";
      if (value.trim().length < 10)
        return "A few more details would help us respond well.";
      if (!/[a-zA-Z]/.test(value)) return "Message must contain some actual text.";
      return "";
    default:
      return "";
  }
};

const validateAll = (form: EmailForm): EmailFormErrors => {
  const errors: EmailFormErrors = {};
  (Object.keys(form) as (keyof EmailForm)[]).forEach((key) => {
    const err = validateField(key, form[key]);
    if (err) errors[key] = err;
  });
  return errors;
};

const baseFieldClasses =
  "w-full rounded-xl border bg-white/5 px-3 md:px-4 py-2 md:py-3 text-[15px] text-white placeholder-white/30 outline-none transition-colors duration-200";

const getFieldClasses = (hasError: boolean) =>
  `${baseFieldClasses} ${
    hasError
      ? "border-red-500/70 focus:border-red-500"
      : "border-white/10 focus:border-[#00E5E5]"
  }`;

const labelClasses =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-white/50";
const errorTextClasses = "mt-1.5 text-xs text-red-400";

export default function EmailUsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<EmailForm>(initialForm);
  const [errors, setErrors] = useState<EmailFormErrors>({});
  const [touched, setTouched] = useState<TouchedState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const resetAndClose = () => {
    onClose();
    window.setTimeout(() => {
      setForm(initialForm);
      setErrors({});
      setTouched({});
      setIsSubmitted(false);
      setSubmitError(null);
    }, 250);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof EmailForm;
    setForm((prev) => ({ ...prev, [fieldName]: value }));
    if (touched[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: validateField(fieldName, value) }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof EmailForm;
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    setErrors((prev) => ({ ...prev, [fieldName]: validateField(fieldName, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const allErrors = validateAll(form);
    setErrors(allErrors);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(allErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/email-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message.");
      }

      setIsSubmitted(true);
      setForm(initialForm);
      setErrors({});
      setTouched({});
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Object.keys(validateAll(form)).length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={resetAndClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[#00e5e5]/70 bg-black/80 p-7 md:p-8 shadow-[0_0_60px_-15px_rgba(0,229,229,0.25)]"
          >
            <button
              type="button"
              onClick={resetAndClose}
              aria-label="Close"
              className="absolute right-5 top-5 text-white/40 transition-colors hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5">
                <path d="M18 6 6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>

            {isSubmitted ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#00E5E5]/10">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#00E5E5" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Message sent</h3>
                <p className="max-w-xs text-sm leading-6 text-[#8B93A3]">
                  Thanks for reaching out — we&apos;ll reply to your email within one business day.
                </p>
                <button
                  onClick={resetAndClose}
                  className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#00E5E5]"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#00E5E5" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">Email us directly</h3>
                <p className="mb-6 mt-1 text-sm leading-6 text-[#8B93A3]">
                  Share a few details and we&apos;ll get back to you at the email you provide.
                </p>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <label htmlFor="em-name" className={labelClasses}>Full name</label>
                    <input
                      id="em-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Jane Doe"
                      className={getFieldClasses(!!(touched.name && errors.name))}
                    />
                    {touched.name && errors.name && <p className={errorTextClasses}>{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="em-email" className={labelClasses}>Email address</label>
                    <input
                      id="em-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="jane@company.com"
                      className={getFieldClasses(!!(touched.email && errors.email))}
                    />
                    {touched.email && errors.email && <p className={errorTextClasses}>{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="em-subject" className={labelClasses}>Subject</label>
                    <input
                      id="em-subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="What's this about?"
                      className={getFieldClasses(!!(touched.subject && errors.subject))}
                    />
                    {touched.subject && errors.subject && <p className={errorTextClasses}>{errors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="em-message" className={labelClasses}>Message</label>
                    <textarea
                      id="em-message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Tell us briefly what you need help with..."
                      className={`${getFieldClasses(!!(touched.message && errors.message))} resize-none`}
                    />
                    {touched.message && errors.message && <p className={errorTextClasses}>{errors.message}</p>}
                  </div>

                  {submitError && <p className="text-sm text-red-400">{submitError}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#00E5E5] px-6 py-2.5 font-semibold text-black transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                  >
                    {isSubmitting ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}