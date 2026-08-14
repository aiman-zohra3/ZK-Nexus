"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { Code2, Palette, ShieldCheck, ArrowRight } from "lucide-react";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiFigma,
  SiDocker,
  SiPython,
  SiOwasp,
  SiWireshark,
} from "react-icons/si";

// ======================================================
// SERVICES DATA
// ======================================================

const services = [
  {
    number: "01",
    slug: "website-development",
    title: "Website Development",
    tag: "SCALABLE BUILDS",
    description: "Fast, modern, maintainable applications built to scale.",
    icon: Code2,
  },
  {
    number: "02",
    slug: "ui-ux-design",
    title: "UI / UX Design",
    tag: "PIXEL PERFECT",
    description: "Interfaces people trust, understand, and enjoy using.",
    icon: Palette,
  },
  {
    number: "03",
    slug: "cyber-security",
    title: "Cyber Security",
    tag: "LOCKED DOWN",
    description: "Audits, testing, and protection built into every layer.",
    icon: ShieldCheck,
  },
];

// ======================================================
// TECH STACK DATA
// ======================================================

const techStackRowOne = [
  { name: "Next.js", Icon: SiNextdotjs, color: "#FFFFFF" },      // White
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },  // Official TS blue
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" }, // Tailwind cyan
  { name: "Framer Motion", Icon: SiFramer, color: "#0055FF" },   // Framer blue
  { name: "Figma", Icon: SiFigma, color: "#F24E1E" },            // Figma orange
];

const techStackRowTwo = [
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },          // Docker blue
  { name: "Python", Icon: SiPython, color: "#3776AB" },          // Python blue
  { name: "OWASP", Icon: SiOwasp, color: "#000000" },            // OWASP black
  { name: "Wireshark", Icon: SiWireshark, color: "#1679A7" },    // Wireshark blue
];

// ======================================================
// SERVICE CARD
// ------------------------------------------------------
// Layout behavior (custom breakpoints, arbitrary Tailwind variants):
//   < 500px       -> 3-column grid, icon centered on the TOP border
//   500px - 999px -> single column, 3 stacked rows, icon on the LEFT
//                    border, content to its right, left-aligned
//   >= 1000px     -> back to the 3-column grid / icon-on-top design
// ======================================================

function ServiceCard({ service, index }: { service: (typeof services)[number]; index: number }) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative pt-10 min-[500px]:pt-0 min-[1000px]:pt-10"
    >
      <Link
        href={`/services#${service.slug}`}
        scroll={true}
        className="relative flex h-full flex-col overflow-visible rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-colors duration-300 hover:border-[#00E5E5]/40
          px-8 pb-6 pt-14 text-center
          min-[500px]:pl-10 min-[500px]:pr-6 min-[500px]:py-6 min-[500px]:text-left
          min-[1000px]:px-8 min-[1000px]:pb-6 min-[1000px]:pt-14 min-[1000px]:text-center"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 left-1/2 h-40 w-56 -translate-x-1/2 rounded-full bg-[#00E5E5]/20 blur-3xl transition-opacity duration-300 opacity-60 group-hover:opacity-100"
        />

        {/* icon: top border by default / on large screens, left border on the medium row layout */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2
            left-1/2 top-0
            min-[500px]:left-0 min-[500px]:top-1/2
            min-[1000px]:left-1/2 min-[1000px]:top-0"
        >
          <div className="relative flex h-24 w-24 items-center justify-center min-[500px]:h-20 min-[500px]:w-20 min-[1000px]:h-24 min-[1000px]:w-24">
            <div aria-hidden className="absolute inset-0 rounded-full bg-[#0B0C10]" />
            <div
              aria-hidden
              className="absolute inset-1 rounded-full bg-[#00E5E5]/10 blur-xl transition-all duration-300 group-hover:bg-[#00E5E5]/10 group-hover:scale-110"
            />
            <motion.div
              className="relative"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
            >
              <Icon
                className="h-12 w-12 text-[#00E5E5] drop-shadow-[0_0_14px_rgba(0,229,229,0.65)] transition-transform duration-300
                 group-hover:scale-110 min-[500px]:h-10 min-[500px]:w-10 min-[1000px]:h-12 min-[1000px]:w-12"
                strokeWidth={1.5}
              />
            </motion.div>
          </div>
        </div>

        <span className="relative z-10 text-sm font-medium tracking-[0.3em] text-white/30">
          {service.number}
        </span>

        <div className="relative z-10 mt-4 flex flex-1 flex-col items-center min-[500px]:items-start min-[1000px]:items-center">
          <p className="text-lg font-black text-white md:text-2xl">{service.title}</p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00E5E5]">
            {service.tag}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-gray-400">{service.description}</p>

          <div className="mt-7 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/40 transition-colors duration-300 group-hover:text-white">
            <span>View more</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ======================================================
// TECH BADGE (static, expands to reveal name on hover)
// Sizes scale down on smaller screens; row never wraps.
// ======================================================

function TechBadge({
  tech,
  index,
}: {
  tech: { name: string; Icon: React.ComponentType<{ className?: string }>; color: string };
  index: number;
}) {
  const { name, Icon, color } = tech;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group/badge relative flex h-10 flex-shrink-0 items-center overflow-hidden rounded-full border border-white/10
       bg-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:border-[#00E5E5]/40 hover:bg-white/[0.07]
       sm:h-12 md:h-14 lg:h-16"
    >
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full
         transition-transform duration-300 group-hover/badge:scale-105
          md:h-14 md:w-14 lg:h-16 lg:w-16"
        style={{ backgroundColor: `${color}1A` }}
      >
        <Icon className="h-5 w-5  md:h-7 md:w-7 lg:h-8 lg:w-8" style={{ color }} />
      </div>

      <span className="max-w-0 overflow-hidden whitespace-nowrap pr-0 text-xs font-medium text-white opacity-0 transition-all duration-300 ease-out
       group-hover/badge:max-w-[160px] group-hover/badge:pr-6 group-hover/badge:pl-3 group-hover/badge:opacity-100
       sm:text-sm ">
        {name}
      </span>
    </motion.div>
  );
}

// ======================================================
// TECH ROW (badges separated by dots) — always 5 / 4 items
// on one line, never wraps, shrinks on small screens.
// ======================================================

function TechRow({ items }: { items: typeof techStackRowOne }) {
  return (
    <div
      className="flex w-full flex-nowrap items-center justify-center gap-2 overflow-x-auto px-1
       [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
       sm:gap-4 sm:overflow-visible md:gap-6 lg:gap-9"
    >
      {items.map((tech, index) => (
        <div key={tech.name} className="flex flex-shrink-0 items-center gap-2 sm:gap-4 md:gap-6 lg:gap-9">
          <TechBadge tech={tech} index={index} />
          {index < items.length - 1 && (
            <span aria-hidden className="h-1 w-1 flex-shrink-0 rounded-full bg-white/20" />
          )}
        </div>
      ))}
    </div>
  );
}

// ======================================================
// SERVICES SECTION
// ======================================================

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20, mass: 1.2 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20, mass: 1.2 });

  const maskImage = useMotionTemplate`radial-gradient(circle 350px at ${smoothX}px ${smoothY}px, black 0%, black 30%, transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-[#0B0C10] px-6 md:px-14 lg:px-28 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[#0B0C10]/80" />

      <div className="relative z-10 mx-auto max-w-6xl px-auto">
        {/* Top row: heading left, description right */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5"
            >
              <span className="font-mono text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#00E5E5]">
                Our Services
              </span>
            </motion.div>

            <h2 className="mt-8 text-4xl font-black leading-[1.02] text-white md:text-6xl">
              WHAT WE BUILD
            </h2>
          </div>

          <p className="text-xs md:text-sm leading-relaxed text-gray-400 lg:max-w-xl lg:justify-self-end lg:text-right">
            We design, build, and secure digital products end to end — blending clean engineering with sharp visual design so every launch feels fast, polished, and protected from day one.
          </p>
        </div>

        {/* Cards row / stack */}
        <div className="mt-10 md:mt-16 grid  gap-3  min-[1000px]:grid-cols-3 min-[1000px]:gap-5 lg:mt-20">
          {services.map((service, index) => (
            <ServiceCard key={service.number} service={service} index={index} />
          ))}
        </div>

        {/* Built with — static tech stack row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-4 md:mt-10 rounded-3xl border border-white/10 bg-white/[0.02] px-6 py-8 md:py-12 backdrop-blur-sm sm:px-10 lg:mt-32 lg:py-16"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5"
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#00E5E5]">
                Built with
              </span>
            </motion.div>

            <h3 className="mt-4 text-lg md:text-2xl font-black text-white md:text-3xl">
              THE TOOLS BEHIND EVERY BUILD
            </h3>
          </div>

          <div className="mt-10 md:mt-14 flex flex-col items-center gap-6 sm:gap-8">
            <TechRow items={techStackRowOne} />
            <TechRow items={techStackRowTwo} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}