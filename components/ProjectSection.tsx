"use client";

// components/projects/ProjectSection.tsx

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion,type Variants  } from "framer-motion";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { useRouter } from "next/navigation";
import CountUp from "react-countup";

const allProjects = projects;

const accentMap = {
  cyan: {
    glow: "rgba(0,229,229,0.55)",
    glowBg: "bg-[#00E5E5]",
    tag: "text-brand-cyan border-brand-cyan/40 bg-brand-cyan/10",
    border: "hover:border-brand-cyan/50",
    text: "text-brand-cyan",
    dot: "bg-brand-cyan",
  },
  purple: {
    glow: "rgba(0,229,229,0.55)",
    glowBg: "bg-[#00E5E5]",
    tag: "text-brand-cyan border-brand-cyan/40 bg-brand-cyan/10",
    border: "hover:border-brand-cyan/50",
    text: "text-brand-cyan",
    dot: "bg-brand-cyan",
  },
};

function getAccent(key?: string) {
  return accentMap[key as keyof typeof accentMap] ?? accentMap.cyan;
}

const openFromCorner: Variants = {
  initial: { x: -70, y: 70, scale: 0.72, opacity: 0, filter: "blur(4px)" },
  animate: {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, scale: 1.03, transition: { duration: 0.25 } },
};

const panelFade: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.25 + i * 0.07,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const AUTOPLAY_MS = 4200;

export default function ProjectSection() {
  const router = useRouter();

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (allProjects.length < 2) return;

    const id = setInterval(() => {
      setActive((i) => (i + 1) % allProjects.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(id);
  }, []);

  const activeProject = allProjects[active];
  const firstSentence =
    activeProject.description?.match(/^.*?[.!?](?=\s|$)/)?.[0] ??
    activeProject.description ??
    "";

  const accent = getAccent(activeProject.accent);

  function handleVisit() {
    router.push(`/projects/${activeProject.slug}`);
  }

  return (
    <section id="work" className="bg-[#0B0C10] py-0 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-4 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-6 text-center sm:gap-8 md:gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:text-left">
          {/* Left */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5"
            >
              <span className="font-mono text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#00E5E5]">
                Our Projects
              </span>
            </motion.div>

            {/* Heading — scales smoothly across all breakpoints */}
            <h2 className="pt-6 pb-2 font-display text-white text-3xl font-black uppercase leading-[0.95] sm:py-8 sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
              Solutions That
              <br />
              Drive <span className="text-[#00E5E5]">Results</span>
            </h2>
          </div>

          {/* Right */}
          <div className="max-w-md md:max-w-xl lg:text-right">
            <p className="block text-xs md:text-sm leading-relaxed text-brand-mist/70 sm:text-base text-gray-400">
              From enterprise platforms to modern web applications, every project is
              crafted with a focus on performance, security, scalability, and
              exceptional user experience.
            </p>
          </div>
        </div>

        {/* ======================================================
            CARD DESIGN — now shown from `sm` upward.
            - sm/md: single column, cards on top, compact mobile panel below
            - lg+: original two-column row (cards left, full panel right)
        ====================================================== */}
        <div className="mt-8 md:mt-10 grid grid-cols-1 items-start gap-8 sm:gap-10 md:gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-24">
          {/* LEFT — stack frame (cards) */}
          <div className="relative order-1 mx-auto aspect-square w-full max-w-lg md:order-1 md:max-w-xl lg:max-w-xl">
            {/* Peeking cards behind the active one */}
            {[1, 2].map((offset) => {
              const p = allProjects[(active + offset) % allProjects.length];
              return (
                <div
                  key={`peek-${p.slug}-${offset}`}
                  className="absolute inset-0 rounded-[28px] border border-white/8 bg-brand-surface"
                  style={{
                    transform: `translate(${offset * 14}px, ${offset * 12}px) scale(${1 - offset * 0.05})`,
                    zIndex: 10 - offset,
                    opacity: 0.5,
                  }}
                />
              );
            })}

            {/* Active card — opens from bottom-left corner to fill the frame. Swipeable on touch. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.slug}
                variants={openFromCorner}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ transformOrigin: "bottom left" }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(e, info) => {
                  const threshold = 60;
                  if (info.offset.x < -threshold) {
                    setActive((i) => (i + 1) % allProjects.length);
                  } else if (info.offset.x > threshold) {
                    setActive((i) => (i - 1 + allProjects.length) % allProjects.length);
                  }
                }}
                className="absolute inset-0 z-20 flex cursor-grab flex-col active:cursor-grabbing"
              >
                <div className="flex h-full flex-col rounded-[24px] border border-white/10 bg-white/[0.13] p-2 shadow-[0_35px_90px_rgba(0,0,0,.45)] backdrop-blur-xl sm:rounded-[28px] sm:p-2.5 md:rounded-[34px] md:p-3">
                  <div className="relative flex-1 overflow-hidden rounded-[18px] border border-white/10 bg-brand-surface sm:rounded-[22px] md:rounded-[26px]">
                    <Image
                      src={activeProject.image}
                      alt={activeProject.name}
                      fill
                      className="pointer-events-none object-cover"
                      sizes="(max-width: 768px) 100vw, 500px"
                      priority={active === 0}
                      draggable={false}
                    />
                  </div>

                  <div className="mt-2 flex  items-center justify-between rounded-[16px] bg-gradient-to-b from-[#4cc2bc] via-[#45b0a7] to-[#3fbabc] px-3.5 py-3.5 sm:mt-2.5 sm:rounded-[18px] sm:px-4 sm:py-4 md:mt-3 md:rounded-[22px] md:px-5 md:py-5">
                    <div>
                      <h3 className="text-base font-semibold text-white sm:text-lg md:text-xl lg:text-[22px]">
                        {activeProject.name}
                      </h3>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-white/60 sm:text-[10px] md:text-xs">
                        {activeProject.category}
                      </p>
                    </div>
                    <button
                      onClick={handleVisit}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-base text-white transition hover:bg-white/20 sm:h-9 sm:w-9 sm:text-lg md:h-11 md:w-11 md:text-xl"
                    >
                      ↗
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-2 sm:-bottom-10">
              {allProjects.map((p, i) => (
                <button
                  key={p.slug}
                  aria-label={`Show ${p.name}`}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? `w-6 ${accent.glowBg}` : "w-1.5 bg-white/15"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* TABLET/SM — compact info panel (hidden below 640px, shown sm up to lg) */}
          <div className="order-2 mt-10 hidden px-2 sm:mt-12 sm:block lg:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.slug}
                variants={panelFade}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center text-center"
              >
                <span
                  className={`inline-block w-fit rounded-full border border-white/20 text-[#00e5e5] px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${accent.tag}`}
                >
                  {activeProject.category}
                </span>

                <h3 className="mt-3 font-display text-xl font-semibold text-white sm:text-2xl">
                  {activeProject.name}
                </h3>

                <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-brand-mist/70">
                  {firstSentence}
                </p>

                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {activeProject.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/20 bg-brand-surface px-3 py-1 text-[11px] text-brand-mist/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleVisit}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border bg-[#00e5e5] px-4 py-2.5 text-sm font-medium text-black"
                >
                  View project details
                  <span>↗</span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* DESKTOP — full detail panel (lg and up) */}
          <div className="order-2 hidden min-w-0 lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.slug}
                variants={panelFade}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col"
              >
                <motion.span
                  variants={fadeUp}
                  custom={0}
                  className={`inline-block w-fit rounded-full border border-white/20 text-[#00e5e5] px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${accent.tag}`}
                >
                  {activeProject.category}
                </motion.span>

                <motion.h3
                  variants={fadeUp}
                  custom={1}
                  className="mt-4 text-white font-display text-2xl font-semibold text-brand-mist sm:mt-5 sm:text-3xl md:text-3xl lg:text-4xl"
                >
                  {activeProject.name}
                </motion.h3>

                <motion.p
                  variants={fadeUp}
                  custom={2}
                  className="mt-3 max-w-lg text-sm leading-relaxed text-white text-brand-mist/70 sm:mt-4"
                >
                  {firstSentence}
                </motion.p>

                <motion.div variants={fadeUp} custom={3} className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                  {activeProject.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border text-gray-200 border-white/20 bg-brand-surface px-3 py-1.5 text-xs text-brand-mist/60"
                    >
                      {tech}
                    </span>
                  ))}
                </motion.div>

                {/* Metrics row */}
                {activeProject.metrics && activeProject.metrics.length > 0 && (
                  <motion.div
                    variants={fadeUp}
                    custom={5}
                    className="mt-5 flex flex-wrap items-start justify-between gap-6 border-t border-white/20 pt-3 sm:gap-8"
                  >
                    {activeProject.metrics.map((metric) => (
                      <div key={metric.label} className="min-w-[100px] flex-1 sm:min-w-[110px]">
                        <h4
                          className={`font-display text-[#00e5e5] text-2xl font-black tracking-tight sm:text-3xl md:text-4xl ${accent.text}`}
                        >
                          <CountUp
                            start={0}
                            end={metric.value}
                            duration={2.2}
                            decimals={metric.decimals ?? 0}
                            prefix={metric.prefix}
                            suffix={metric.suffix}
                          />
                        </h4>

                        <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white text-brand-mist/55 sm:text-xs">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}

                <motion.div variants={fadeUp} custom={4} className="mt-6 sm:mt-8">
                  <button
                    type="button"
                    onClick={handleVisit}
                    className={`inline-flex items-center gap-2 rounded-full border bg-[#00e5e5] text-black px-4 py-2 text-sm font-medium transition sm:py-3 ${accent.border}`}
                  >
                    View project details
                    <span>↗</span>
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}