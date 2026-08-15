"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

// ======================================================
// NAV DATA
// "work" has no dedicated listing page yet (only
// projects/[slug]/page.tsx exists), so it scrolls to the
// #work section on the homepage instead of navigating.
// Everything else links to its own route.
// ======================================================

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Our Work", href: "/#work" },
  { label: "Services", href: "/services" },
];

const serviceLinks = [
  { label: "Website Development", href: "/services#website-development" },
  { label: "UI / UX Design", href: "/services#ui-ux-design" },
  { label: "Cyber Security", href: "/services#cyber-security" },
];

const companyLinks = [
  { label: "About", href: "/about-us" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
   { label: "Privacy Policy", href: "/privacy-policy" },
];


const marqueeItems = [
  "Website Development",
  "UI / UX Design",
  "Cyber Security",
  "Secure. Scalable. Built to last.",
];

// ------------------------------------------------------
// SOCIAL LINKS
// Placeholder hrefs — swap in the real profile URLs once
// the Instagram and LinkedIn accounts exist.
// ------------------------------------------------------

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/zknexus",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/zknexus",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="7.5" y1="10.5" x2="7.5" y2="16.5" />
        <circle cx="7.5" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
        <path d="M11.5 16.5v-4a2 2 0 0 1 4 0v4" />
        <line x1="11.5" y1="10.5" x2="11.5" y2="16.5" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0B0C10] text-[#E2E8F0]">
      {/* Faint cyan glow, echoes the hero/about glow but smaller */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-[300px]
          bg-[radial-gradient(circle_at_center,_rgba(0,229,229,0.12)_0%,_transparent_70%)]
          blur-3xl
        "
      />

      {/* ================= MARQUEE ================= */}

      

      {/* ================= MAIN CONTENT ================= */}
      {/*
        Four distinct layouts, one per tier:

        MOBILE  (<640px)  — single column, accordion nav,
                             order: newsletter → brand → nav
        TABLET  (sm–md,
                 640–767)  — same stack, but nav opens into
                             a static 3-col grid instead of
                             an accordion, more breathing room
        MEDIUM  (md–lg,
                 768–1023) — two rows: brand + newsletter
                             side by side on top, nav 3-col
                             full width below
        DESKTOP (lg+,
                 1024px+)  — single row: brand / nav / newsg
      */}

      <div className="relative mx-auto max-w-8xl px-6 py-10 md:py-14 sm:px-10 sm:py-12 md:px-12 md:py-20 lg:px-16 xl:px-20">
        {/* ---------- MOBILE + TABLET (<md) ---------- */}
        <div className="flex flex-col gap-5 sm:gap-12 md:hidden">
          <BrandBlock centered/>
          <NewsletterCard />
          <div className="divide-y divide-white/10 sm:divide-y-0 sm:grid sm:grid-cols-3 sm:gap-10">
            <FooterColumn title="Explore" links={exploreLinks} delay={0.05} />
            <FooterColumn title="Services" links={serviceLinks} delay={0.1} />
            <FooterColumn title="Company" links={companyLinks} delay={0.15} />
          </div>
        </div>

        {/* ---------- MEDIUM (md to just under lg) ---------- */}
        <div className="hidden md:flex md:flex-col md:gap-14 lg:hidden">
          <div className="grid grid-cols-[1.1fr_0.9fr] items-start gap-12">
            <BrandBlock />
            <div className="max-w-md justify-self-end w-full">
              <NewsletterCard />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-12">
            <FooterColumn title="Explore" links={exploreLinks} delay={0.05} />
            <FooterColumn title="Services" links={serviceLinks} delay={0.1} />
            <FooterColumn title="Company" links={companyLinks} delay={0.15} />
          </div>
        </div>

        {/* ---------- DESKTOP (lg+) ---------- */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1.3fr_1fr] lg:items-start lg:gap-10 xl:grid-cols-[1fr_1.15fr_0.85fr] xl:gap-12">
          <BrandBlock />

          <div className="grid grid-cols-3 gap-8 xl:gap-10">
            <FooterColumn title="Explore" links={exploreLinks} delay={0.05} />
            <FooterColumn title="Services" links={serviceLinks} delay={0.1} />
            <FooterColumn title="Company" links={companyLinks} delay={0.15} />
          </div>

          <div className="max-w-sm justify-self-end w-full">
            <NewsletterCard />
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between md:px-12 lg:px-16 xl:px-20">
          <p>© {new Date().getFullYear()} ZK Nexus. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="transition-colors duration-200 hover:text-[#00E5E5]">
              Privacy Policy
            </Link>
            <p>Build faster. Stay secure.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ======================================================
// BRAND BLOCK
// Logo, tagline, socials — shared across all four layout
// tiers instead of being duplicated per breakpoint.
// ======================================================

function BrandBlock({ centered = false }: { centered?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={centered ? "flex flex-col items-center text-center md:items-start md:text-left" : ""}
    >
      <Link href="/" className="inline-flex items-center gap-3">
        <span className=" ">
          <Image
            src="/logo.png"
            alt="ZK Nexus logo"
            width={84}
            height={84}
            className="h-12 w-12 object-contain md:h-[84px] md:w-[84px]"
          />
        </span>
      </Link>

      <p className="mt-5 hidden md:block max-w-xs text-[15px] leading-7 text-[#8B93A3] md:max-w-sm">
        Secure, scalable digital products — websites, interfaces, and
        cybersecurity, built as one connected system.
      </p>

      <div className={`mt-2 md:mt-6 flex items-center gap-4 ${centered ? "justify-center md:justify-start" : ""}`}>
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex h-6 md:h-10 w-6 md:w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors duration-200 hover:border-[#00E5E5]/40 hover:text-[#00E5E5]"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </motion.div>
  );
}

// ======================================================
// NEWSLETTER CARD
// Backend hookup goes in handleSubmit — currently a
// placeholder delay so the loading/success states can be
// seen and reused once the real endpoint is ready.
// ======================================================

function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // ------------------------------------------------
      // BACKEND HOOKUP GOES HERE
      // const res = await fetch("/api/newsletter", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });
      // if (!res.ok) throw new Error("Failed to subscribe.");
      // ------------------------------------------------

      await new Promise((resolve) => setTimeout(resolve, 800)); // placeholder delay

      setIsSubmitted(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-7 md:p-7 lg:p-7"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#00E5E5]/10 blur-[80px]" />

      <div className="relative">
        <p className="mt-1 mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Newsletter
        </p>

        <h3 className="text-md font-bold leading-snug sm:text-xl">
          Stay ahead of the curve.
        </h3>

        <p className="mt-1 text-xs leading-6 text-[#8B93A3] sm:text-[12px]">
          Security tips, product updates, and the occasional launch no
          spam, unsubscribe anytime.
        </p>

        {isSubmitted ? (
          <div className="mt-5 flex items-center gap-2 text-[#00E5E5]">
            <svg
              className="h-5 w-5 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <p className="text-sm font-medium">You&apos;re subscribed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-label="Email address"
                className="w-full min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors duration-200 focus:border-[#00E5E5] sm:py-2 sm:text-[15px]"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#00E5E5] px-4 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:py-2"
              >
                {isSubmitting ? "..." : "Subscribe"}
              </button>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}
          </form>
        )}
      </div>
    </motion.div>
  );
}

// ======================================================
// FOOTER COLUMN
// Two separate blocks rather than one shared list toggled
// by breakpoint CSS:
//
// 1. Mobile accordion (`sm:hidden`) — real useState toggle,
//    plus icon that morphs into a cross.
// 2. Static column (`hidden sm:block`) — always open, used
//    from tablet through desktop.
// ======================================================

function FooterColumn({
  title,
  links,
  delay = 0,
}: {
  title: string;
  links: { label: string; href: string }[];
  delay?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {/* ---------- Mobile accordion ---------- */}
      <div className="py-5 sm:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            {title}
          </span>

          <span className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center">
            <span
              className={`absolute h-[1.5px] w-3 rounded-full bg-white/60 transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
            <span
              className={`absolute h-3 w-[1.5px] rounded-full bg-white/60 transition-all duration-300 ${
                open ? "rotate-90 opacity-0" : "opacity-100"
              }`}
            />
          </span>
        </button>

        <ul
          className={`space-y-4 overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "mt-4 max-h-96 opacity-100" : "mt-0 max-h-0 opacity-0"
          }`}
        >
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group inline-flex items-center gap-1.5 text-[15px] text-white/80 transition-colors duration-200 hover:text-[#00E5E5]"
              >
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#00E5E5] transition-all duration-300 group-hover:w-full" />
                </span>
                <svg
                  className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ---------- Static column (tablet → desktop) ---------- */}
      <div className="hidden sm:block">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          {title}
        </p>

        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group inline-flex items-center gap-1.5 text-[15px] text-white/80 transition-colors duration-200 hover:text-[#00E5E5]"
              >
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#00E5E5] transition-all duration-300 group-hover:w-full" />
                </span>
                <svg
                  className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}