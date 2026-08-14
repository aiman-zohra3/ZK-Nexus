"use client";

// components/projects/ProjectDetail.jsx

import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Project } from "@/data/projects";
import { useTransitionRouter } from "@/components/Hero/TransitionProvider";

// Colors written as literal arbitrary-value classes (Tailwind's JIT
// scanner needs to see the full class string at build time — no
// runtime concatenation, and no reliance on tailwind.config tokens).
const accentMap = {
  violet: {
    text: "text-[#8B7FFF]",
    border: "border-[#8B7FFF]/40 hover:bg-[#8B7FFF]/10",
    dot: "bg-[#8B7FFF]",
  },
  cyan: {
    text: "text-[#00E5E5]",
    border: "border-[#00E5E5]/40 hover:bg-[#00E5E5]/10",
    dot: "bg-[#00E5E5]",
  },
};

function getAccent(key?: string) {
  return accentMap[key as keyof typeof accentMap] ?? accentMap.cyan;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.35 + i * 0.08, duration: 0.6, ease: "easeInOut" },
  }),
};

export default function ProjectDetail({ project }: { project: Project }) {
  const { navigate } = useTransitionRouter();
  const accent = getAccent(project.accent);

  return (
    <main className="min-h-screen bg-[#0A0A0A] pb-24">
      {/* ── content ── */}
      <div className="mx-auto h-full w-full mt-40 max-w-3xl px-6 md:px-0">
        <motion.span
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className={`inline-block rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${accent.border} ${accent.text}`}
        >
          {project.category}
        </motion.span>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mt-4 font-display text-2xl font-semibold text-white md:text-4xl"
        >
          {project.name}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-4 text-sm leading-relaxed text-white/70 md:text-base"
        >
          {project.landingLine}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-10 grid gap-8 md:grid-cols-2"
        >
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-white/40">
              The problem
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {project.problem}
            </p>
          </div>
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-white/40">
              What we built
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {project.solution}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="mt-10"
        >
          <h2 className="font-mono text-xs uppercase tracking-widest text-white/40">
            What it does, in short
          </h2>
          <ul className="mt-4 space-y-2.5">
            {project.highlights.map((h: string) => (
              <li
                key={h}
                className="flex items-start gap-3 text-sm leading-relaxed text-white/80"
              >
                <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`} />
                {h}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={5}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          {project.stack.map((s: string) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60"
            >
              {s}
            </span>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={6}
          className="mt-8"
        >
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium text-white transition ${accent.border}`}
        >
            View the source
            <span>↗</span>
          </a>
        </motion.div>
      </div>
    </main>
  );
}