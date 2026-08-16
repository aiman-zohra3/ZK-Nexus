"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ======================================================
// SECTION TAG
// ======================================================

const SectionTag = (title: string) => (
  <div className="mb-8 inline-flex items-center gap-3">
    <p className="mt-3 text-xs font-medium  text-white/60  rounded-full border border-white/10 bg-white/5 px-3 py-1.5 uppercase tracking-[0.08em] ">
      {title}
    </p>
  </div>
);

// ======================================================
// CONTACT CONSTANTS
// ======================================================

const WHATSAPP_NUMBER = "923180540934";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi, I'd like to talk about a project!"
);
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const CALL_NUMBER_DISPLAY = "+92 306 6357672";
const CALL_NUMBER_TEL = "+923067563837";

// ======================================================
// DEVICE DETECTION
// ======================================================

const isMobileOrTablet = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
    navigator.userAgent
  );
};

// ======================================================
// FORM OPTIONS
// ======================================================

const serviceOptions = [
  "Website Development",
  "UI / UX Design",
  "Cyber Security",
  "Not sure yet",
];

const budgetOptions = [
  "Under $2,000",
  "$2,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
];

// ======================================================
// TYPES
// ======================================================

type FormState = {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;
type TouchedState = Partial<Record<keyof FormState, boolean>>;

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  message: "",
};

// ======================================================
// VALIDATION
// ======================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

const validateField = (name: keyof FormState, value: string): string => {
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

    case "company":
      if (value.trim() && value.trim().length < 2)
        return "Company name looks too short.";
      return "";

    case "service":
      if (!value) return "Please select a service.";
      return "";

    case "budget":
      if (!value) return "Please select a budget range.";
      return "";

    case "message":
  if (!value.trim()) return "Please tell us a bit about your project.";
  if (value.trim().length < 10)
    return "Message is a little short — a few more details would help.";
  if (!/[a-zA-Z]/.test(value))
    return "Message must contain some actual text, not just numbers or symbols.";
  return "";

    default:
      return "";
  }
};

const validateAll = (form: FormState): FormErrors => {
  const errors: FormErrors = {};
  (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
    const err = validateField(key, form[key]);
    if (err) errors[key] = err;
  });
  return errors;
};

// ======================================================
// SHARED FIELD STYLES
// ======================================================

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

// ======================================================
// CONTACT PAGE
// ======================================================

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Add this near your other useState declarations
const [nameCharWarning, setNameCharWarning] = useState(false);
const nameWarningTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [callNotice, setCallNotice] = useState(false);

const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
) => {
  const { name, value } = e.target;
  const fieldName = name as keyof FormState;

  let sanitizedValue = value;

  if (fieldName === "name") {
    sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");

    // If the raw input had characters we just stripped out,
    // flash the "letters only" warning briefly.
    if (sanitizedValue !== value) {
      setNameCharWarning(true);

      if (nameWarningTimeout.current) {
        clearTimeout(nameWarningTimeout.current);
      }

      nameWarningTimeout.current = setTimeout(() => {
        setNameCharWarning(false);
      }, 2000);
    } else {
      setNameCharWarning(false);
    }
  }

  setForm((prev) => ({
    ...prev,
    [fieldName]: sanitizedValue,
  }));

  if (touched[fieldName]) {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: validateField(fieldName, sanitizedValue),
    }));
  }
};

const handleBlur = (
  e: React.FocusEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
) => {
  const { name, value } = e.target;
  const fieldName = name as keyof FormState;

  setTouched((prev) => ({ ...prev, [fieldName]: true }));
  setErrors((prev) => ({
    ...prev,
    [fieldName]: validateField(fieldName, value),
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate everything, mark everything touched so errors surface
    const allErrors = validateAll(form);
    setErrors(allErrors);
    setTouched({
      name: true,
      email: true,
      company: true,
      service: true,
      budget: true,
      message: true,
    });

    if (Object.keys(allErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
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
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    Object.keys(validateAll(form)).length === 0;

  // ---------- CONTACT METHOD ACTIONS ----------

  const handleCallClick = () => {
    if (isMobileOrTablet()) {
      window.location.href = `tel:${CALL_NUMBER_TEL}`;
    } else {
      setCallNotice(true);
      window.setTimeout(() => setCallNotice(false), 3500);
    }
  };

  const handleMailClick = () => {
  const RECIPIENT = "aiman@gmail.com";
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isMobile = isIOS || isAndroid;

  if (!isMobile) {
    // Desktop — mail.google.com is a normal https URL, not a custom
    // app scheme, so it always loads (shows a login screen if you're
    // logged out). No Outlook/mailto race needed, just open it fresh.
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT}`,
      "_blank",
      "noopener,noreferrer"
    );
    return;
  }

  if (isAndroid) {
    // Android Chrome blocks bare custom schemes (googlegmail://) via
    // location.href — they fail silently, so a JS-timer mailto
    // fallback fires anyway and Android shows its app chooser even
    // with Gmail installed. intent:// is the scheme Chrome actually
    // honors: it launches Gmail directly, and its own
    // S.browser_fallback_url handles "Gmail not installed" natively,
    // no timer needed.
    window.location.href =
      `intent://co?to=${RECIPIENT}#Intent;` +
      `scheme=googlegmail;` +
      `package=com.google.android.gm;` +
      `S.browser_fallback_url=${encodeURIComponent(`mailto:${RECIPIENT}`)};` +
      `end`;
    return;
  }

  // iOS — bare custom schemes work, but the first-launch "Open in
  // Gmail?" confirmation dialog can delay the actual app-switch past
  // a short fallback timer, so mailto: fires early and shows Mail's
  // chooser even with Gmail installed. Give more time, and listen for
  // `blur` too — it tends to fire the instant the dialog appears /
  // app switch begins, ahead of visibilitychange.
  const fallbackTimer = window.setTimeout(() => {
    window.location.href = `mailto:${RECIPIENT}`;
  }, 1500);

  const cancelFallback = () => {
    window.clearTimeout(fallbackTimer);
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", onHide);
    window.removeEventListener("blur", onHide);
  };

  const onHide = () => {
    if (document.hidden || document.hasFocus() === false) cancelFallback();
  };

  document.addEventListener("visibilitychange", onHide);
  window.addEventListener("pagehide", cancelFallback);
  window.addEventListener("blur", onHide);

  window.location.href = `googlegmail:///co?to=${RECIPIENT}`;
};

  const handleMailClick = () => {
  const RECIPIENT = "aiman@gmail.com";
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isMobile = isIOS || isAndroid;

  if (!isMobile) {
    // Desktop — mail.google.com is a normal https URL, not a custom
    // app scheme, so it always loads (shows a login screen if you're
    // logged out). No Outlook/mailto race needed, just open it fresh.
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT}`,
      "_blank",
      "noopener,noreferrer"
    );
    return;
  }

  if (isAndroid) {
    // Android Chrome blocks bare custom schemes (googlegmail://) via
    // location.href — they fail silently, so a JS-timer mailto
    // fallback fires anyway and Android shows its app chooser even
    // with Gmail installed. intent:// is the scheme Chrome actually
    // honors: it launches Gmail directly, and its own
    // S.browser_fallback_url handles "Gmail not installed" natively,
    // no timer needed.
    window.location.href =
      `intent://co?to=${RECIPIENT}#Intent;` +
      `scheme=googlegmail;` +
      `package=com.google.android.gm;` +
      `S.browser_fallback_url=${encodeURIComponent(`mailto:${RECIPIENT}`)};` +
      `end`;
    return;
  }

  // iOS — bare custom schemes work, but two things can go wrong with
  // naive detection:
  // 1) If Gmail IS installed, a first-launch "Open in Gmail?" prompt
  //    can delay the real app-switch past a short timer.
  // 2) If Gmail is NOT installed, Safari shows a native "invalid
  //    address" alert — which also blurs the page, just like a real
  //    app switch would. Listening to `blur` can't tell these apart,
  //    so it wrongly cancels the fallback even when nothing opened.
  // pagehide / visibilitychange(document.hidden) only fire on a real
  // backgrounding event, not from an alert stealing focus, so those
  // are the only signals we trust — at the cost of a longer timer.
  const fallbackTimer = window.setTimeout(() => {
    window.location.href = `mailto:${RECIPIENT}`;
  }, 1500);

  const cancelFallback = () => {
    window.clearTimeout(fallbackTimer);
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", cancelFallback);
  };

  const onHide = () => {
    if (document.hidden) cancelFallback();
  };

  document.addEventListener("visibilitychange", onHide);
  window.addEventListener("pagehide", cancelFallback);

  window.location.href = `googlegmail:///co?to=${RECIPIENT}`;
};

  const contactMethods = [
    {
      id: "call",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#00E5E5" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
      ),
      heading: "Call Us",
      copy: `${CALL_NUMBER_DISPLAY} · Mon–Sat, 10am–8pm PKT`,
      onClick: handleCallClick,
    },
    {
      id: "mail",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#00E5E5" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 6-10 7L2 6" />
        </svg>
      ),
      heading: "Email Us",
      copy: "Best for detailed briefs & proposals",
      onClick: handleMailClick,
    },
    {
      id: "whatsapp",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#00E5E5" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M21 11.5a8.5 8.5 0 0 1-12.36 7.56L3 21l2.02-5.4A8.5 8.5 0 1 1 21 11.5Z" />
          <path d="M8.5 10.5c.3 2.2 2.3 4.2 4.5 4.5" />
        </svg>
      ),
      heading: "WhatsApp",
      copy: "Fastest way to reach our team directly",
      onClick: handleWhatsAppClick,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0B0C10] text-[#E2E8F0]">
      {/* Radial Cyan Glow */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[450px]
          bg-[radial-gradient(circle_at_center,_rgba(0,229,229,0.18)_0%,_rgba(0,229,229,0.08)_35%,_transparent_75%)]
          blur-3xl
        "
      />

      {/* ================= HERO ================= */}

      {/* ================= HERO ================= */}
<section className="relative mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 py-28 md:py-32 text-center">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 sm:px-4"
  >
    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00E5E5] sm:text-xs">
     Contact Us
    </span>
  </motion.div>

  <div className="overflow-hidden">
    <motion.div
      initial={{ y: "100%" }}
      whileInView={{ y: "0%" }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="mt-6 max-w-4xl font-black uppercase leading-[1.05] text-white  sm:leading-[0.95]"
    style={{ fontSize: "clamp(2rem, 6vw + 0.5rem, 3.75rem)" }}>
        Let&apos;s build something <br />
        <span className="text-[#00E5E5]">secure.</span>
      </h1>
    </motion.div>
  </div>

  <motion.p
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: 0.3 }}
    className="mt-5 max-w-xl text-sm leading-relaxed text-white/50 sm:mt-7 sm:text-base md:text-lg"
  >
    Have a project in mind or just questions? Our team responds quickly and is ready to help bring your vision to life.
  </motion.p>
</section>

      {/* ================= CONTACT METHODS + EMAIL FORM ================= */}

      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* ---------- CONTACT METHODS CARD ---------- */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -6 }}
            className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10 backdrop-blur-xl"
          >
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2f6065]/60 blur-[100px]" />

            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-10 md:h-14 w-10 md:w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00E5E5"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7"
                  >
                    <path d="M21 11.5a8.5 8.5 0 0 1-12.36 7.56L3 21l2.02-5.4A8.5 8.5 0 1 1 21 11.5Z" />
                    <path d="M8.5 10.5c.3 2.2 2.3 4.2 4.5 4.5" />
                  </svg>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5E5] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E5E5]" />
                  </span>
                  <span className="text-xs font-medium uppercase tracking-tight md:tracking-wider text-white/60">
                    Online now
                  </span>
                </div>
              </div>

              <h3 className="mb-2 text-xl md:text-2xl font-bold leading-tight">
                GET IN TOUCH
              </h3>

              <p className="text-xs md:text-base leading-5 md:leading-7 text-[#8B93A3]">
                Pick whichever works best for you — call, email, or message
                us on WhatsApp.
              </p>

              {/* ---------- CLICKABLE CONTACT CARDS ---------- */}

              <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6">
                {contactMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={method.onClick}
                    className="
                      group relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border
                      border-white/10 bg-white/[0.03] p-3 md:p-5 text-left
                      transition-all duration-300
                      hover:-translate-y-1 hover:border-[#00E5E5]/50
                      hover:shadow-[0_0_30px_-8px_rgba(0,229,229,0.5)]
                      focus:outline-none focus-visible:border-[#00E5E5]/50
                    "
                  >
                    <div className="flex  h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00E5E5]/10 transition-colors duration-300 group-hover:bg-[#00E5E5]/20">
                      {method.icon}
                    </div>

                    <div className="flex flex-col">
                      <h4 className="text-md font-bold leading-tight text-white md:text-xl">
                        {method.heading}
                      </h4>

                      <AnimatePresence mode="wait">
                        {method.id === "call" && callNotice ? (
                          <motion.p
                            key="notice"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.25 }}
                            className="text-xs md:text-sm leading-relaxed text-[#00E5E5]"
                          >
                            Calling is only available on phone or tablet —
                            try WhatsApp or email instead.
                          </motion.p>
                        ) : (
                          <motion.p
                            key="copy"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.25 }}
                            className="mt-2 text-xs md:text-sm leading-relaxed text-[#8B93A3]"
                          >
                            {method.copy}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ---------- EMAIL FORM CARD ---------- */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 md:p-10 backdrop-blur-xl"
          >
            {SectionTag("Send a Message")}

            {isSubmitted ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <h3 className="mb-3 text-3xl font-bold text-[#56a2b4]">
                  Message sent.
                </h3>
                <p className="max-w-sm text-base leading-7 text-[#8B93A3]">
                  Thanks for reaching out — we&apos;ll get back to you
                  within one business day.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-xs md:text-sm font-semibold uppercase tracking-[0.15em] text-[#00E5E5]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
  <label htmlFor="name" className={labelClasses}>
    Full name
  </label>
  <input
    id="name"
    name="name"
    type="text"
    value={form.name}
    onChange={handleChange}
    onBlur={handleBlur}
    placeholder="Jane Doe"
    className={getFieldClasses(
      !!(touched.name && errors.name) || nameCharWarning
    )}
  />
  {nameCharWarning ? (
    <p className={errorTextClasses}>Only letters are allowed.</p>
  ) : (
    touched.name &&
    errors.name && <p className={errorTextClasses}>{errors.name}</p>
  )}
</div>

                  <div>
                    <label htmlFor="email" className={labelClasses}>
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="jane@company.com"
                      className={getFieldClasses(
                        !!(touched.email && errors.email)
                      )}
                    />
                    {touched.email && errors.email && (
                      <p className={errorTextClasses}>{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className={labelClasses}>
                    Company{" "}
                    <span className="normal-case text-white/30">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={form.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your company name"
                    className={getFieldClasses(
                      !!(touched.company && errors.company)
                    )}
                  />
                  {touched.company && errors.company && (
                    <p className={errorTextClasses}>{errors.company}</p>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="service" className={labelClasses}>
                      Service interested in
                    </label>
                    <div className="relative">
                      <select
                        id="service"
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`${getFieldClasses(
                          !!(touched.service && errors.service)
                        )} appearance-none pr-10`}
                      >
                        <option value="" disabled className="bg-[#0B0C10]">
                          Select a service
                        </option>
                        {serviceOptions.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-[#0B0C10]"
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                    {touched.service && errors.service && (
                      <p className={errorTextClasses}>{errors.service}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="budget" className={labelClasses}>
                      Budget range
                    </label>
                    <div className="relative">
                      <select
                        id="budget"
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`${getFieldClasses(
                          !!(touched.budget && errors.budget)
                        )} appearance-none pr-10`}
                      >
                        <option value="" disabled className="bg-[#0B0C10]">
                          Select a range
                        </option>
                        {budgetOptions.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-[#0B0C10]"
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                    {touched.budget && errors.budget && (
                      <p className={errorTextClasses}>{errors.budget}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={labelClasses}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tell us a bit about your project..."
                    className={`${getFieldClasses(
                      !!(touched.message && errors.message)
                    )} resize-none`}
                  />
                  {touched.message && errors.message && (
                    <p className={errorTextClasses}>{errors.message}</p>
                  )}
                </div>

                {submitError && (
                  <p className="text-sm text-red-400">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="
                    inline-flex items-center gap-2
                    rounded-full
                    bg-[#00E5E5]
                    px-6
                    py-1
                    font-semibold
                    text-black
                    transition-all
                    duration-300
                    hover:scale-105
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    disabled:hover:scale-100
                  "
                >
                  {isSubmitting ? "Sending..." : "Send Message →"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </section>
  );
}