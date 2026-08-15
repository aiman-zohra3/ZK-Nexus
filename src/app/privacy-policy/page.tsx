"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import CTASection from "@/components/CTASection";
import { sections, lastUpdated, intro, contactEmail } from "@/data/privacy";

// ======================================================
// SHARED SECTION TAG
// ======================================================

function SectionTag({ title }: { title: string }) {
  return (
    <div className="mb-8 inline-flex items-center gap-3">
      <div className="h-px w-12 bg-gradient-to-r from-white/40 to-white/20" />
      <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-white/80">
        {title}
      </p>
      <div className="h-px w-12 bg-gradient-to-r from-white/20 to-white/40" />
    </div>
  );
}

// ======================================================
// PRIVACY POLICY PAGE
// ======================================================

export default function PrivacyPolicyPage() {
  const [activeId, setActiveId] = useState(sections[0].id);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
    }
  };

  return (
    <main className="relative overflow-hidden bg-[#0B0C10] text-[#E2E8F0]">
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

      <section className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-6 py-28 md:py-32 text-center">
        <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 sm:px-4"
  >
    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00E5E5] sm:text-xs">
    Legal
    </span>
  </motion.div>

        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="mt-6 max-w-4xl font-black uppercase leading-[1.05] text-white  sm:leading-[0.95]"
    style={{ fontSize: "clamp(2rem, 6vw + 0.5rem, 3.75rem)" }}>
              Privacy <span className="text-[#56a2b4]">Policy</span>
            </h1>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 max-w-xl text-sm leading-relaxed text-white/50 sm:mt-7 sm:text-base md:text-lg"
        >
          How ZK Nexus collects, uses, and protects your information when you
          visit our website or work with us.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 font-mono text-xs uppercase tracking-[0.15em] text-white/60"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#00E5E5]" />
          Last Updated: {lastUpdated}
        </motion.div>
      </section>

      {/* ================= CONTENT ================= */}

      <section className="mx-auto max-w-7xl px-6 pb-32 pt-12">
        <div className="grid gap-16 lg:grid-cols-[280px_1fr]">
          {/* TABLE OF CONTENTS */}

          <nav className="hidden lg:block">
            <div className="sticky top-32">
              <SectionTag title="Contents" />
              <ul className="space-y-1 border-l border-white/10">
                {sections.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => scrollTo(s.id)}
                      className={`
                        relative block w-full py-2.5 pl-5 text-left text-sm transition-colors duration-200
                        ${
                          activeId === s.id
                            ? "text-[#00E5E5]"
                            : "text-[#8B93A3] hover:text-white/80"
                        }
                      `}
                    >
                      {activeId === s.id && (
                        <motion.span
                          layoutId="privacy-toc-line"
                          className="absolute left-[-1px] top-0 h-full w-px bg-[#00E5E5]"
                          transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        />
                      )}
                      <span className="mr-2 font-mono text-xs text-white/30">
                        {s.number}
                      </span>
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* SECTIONS */}

          <div className="space-y-24">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl text-lg leading-8 text-[#8B93A3]"
            >
              {intro}
            </motion.p>

            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.03 }}
                className="scroll-mt-32 border-t border-white/10 pt-12"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-[#00E5E5]">
                    {section.number}
                  </span>
                  <h2 className="text-3xl font-black md:text-4xl">
                    {section.title}
                  </h2>
                </div>

                <div className="mt-8 space-y-8">
                  {section.content.map((block, i) => (
                    <div key={i}>
                      {block.heading && (
                        <h3 className="mb-3 text-xl font-bold text-[#56a2b4]">
                          {block.heading}
                        </h3>
                      )}

                      <p className="max-w-3xl text-base leading-8 text-[#8B93A3]">
                        {block.body}
                      </p>

                      {block.list.length > 0 && (
                        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                          {block.list.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/80"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00E5E5]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                {/* Contact card on final section */}
                {section.id === "contact-us" && (
                  <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
                    <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2f6065]/60 blur-[100px]" />
                    <div className="relative z-10 grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                          Email
                        </p>
                        <p className="mt-2 text-lg font-bold text-[#56a2b4]">
                          {contactEmail}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                          Contact Form
                        </p>
                        <p className="mt-2 text-lg font-bold text-[#56a2b4]">
                          Available on our website
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto">
        <CTASection />
      </section>
    </main>
  );
}