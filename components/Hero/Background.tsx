  "use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface Ribbon {
  d: string;
  opacity: number;
  strokeWidth: number;
}

// Builds one dense bundle of near-parallel wavy strands (no center thinning).
function buildWaveBundle(
  width: number,
  height: number,
  {
    strands,
    amplitude,
    frequency,
    phase,
    baseline,
    spread,
    slope,
  }: {
    strands: number;
    amplitude: number;
    frequency: number;
    phase: number;
    baseline: number;
    spread: number;
    slope: number;
  }
): Ribbon[] {
  const lines: Ribbon[] = [];
  const points = 160;

  for (let i = 0; i < strands; i++) {
    const t = i / (strands - 1);
    const strandOffset = (t - 0.5) * spread;
    const strandAmp = amplitude * (0.85 + Math.sin(t * Math.PI) * 0.3);
    const strandFreq = frequency + t * 0.13;
    const strandPhase = phase + t * 0.6;

    let d = "";
    for (let p = 0; p <= points; p++) {
      const xT = p / points;
      const x = xT * width;
      const y =
        baseline +
        strandOffset +
        xT * slope +
        strandAmp * Math.sin(xT * strandFreq * Math.PI * 2 + strandPhase);
      d += p === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }

    lines.push({
      d,
      opacity: 0.28 + (1 - Math.abs(t - 0.5) * 2) * 0.18,
      strokeWidth: 1 + (1 - Math.abs(t - 0.5) * 2) * 0.6,
    });
  }
  return lines;
}

const WIDTH = 1600;
const HEIGHT = 400;
const SHARED_AMPLITUDE = 55; // both bundles use this same value

export default function Background() {

  const router = useRouter();
  const pathname = usePathname();

  // Same logic as Navbar's handleNavClick — scroll if already on the
  // target page, otherwise route there then scroll once mounted.
  function handleWorkClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const targetPath = "/";
    const hash = "work";

    if (pathname === targetPath) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${hash}`);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  }

  // ...(bundleA, bundleB, renderBundle unchanged)
  // Upper bundle
  const bundleA = useMemo(
    () =>
      buildWaveBundle(WIDTH, HEIGHT, {
        strands: 14,
        amplitude: SHARED_AMPLITUDE,
        frequency: 1.1,
        phase: 0,
        baseline: HEIGHT * 0.32,
        spread: 90,
        slope: 0,
      }),
    []
  );

  // Lower bundle
  const bundleB = useMemo(
    () =>
      buildWaveBundle(WIDTH, HEIGHT, {
        strands: 14,
        amplitude: SHARED_AMPLITUDE,
        frequency: 1.35,
        phase: 2.3,
        baseline: HEIGHT * 0.62,
        spread: 100,
        slope: 0,
      }),
    []
  );

  const renderBundle = (bundle: Ribbon[], gradientId: string) => (
    <g stroke={`url(#${gradientId})`} fill="none">
      {bundle.map((r, i) => (
        <path key={i} d={r.d} strokeWidth={r.strokeWidth} opacity={r.opacity} strokeLinecap="round" />
      ))}
    </g>
  );

  return (
    <div className="relative w-full overflow-hidden bg-[#0B0C10] -mt-3">
      {/* ===== Background layer (decorative, non-interactive) ===== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Ambient cyan glow */}
        <div
          className="absolute left-1/2 top-32 h-[400px] w-[900px] -translate-x-1/2 rounded-full blur-[180px]"
          style={{ background: "rgba(0,229,229,0.10)" }}
        />

        {/* Entrance wrapper: slides + fades in from the left on page load */}
        <motion.div
          initial={{ x: "-25%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.1, 1, 0.3, 1] }}
          className="absolute top-32 left-0 w-full h-[340px] overflow-hidden"
        >
          {/* Infinite seamless scroller: moves LEFT -> RIGHT continuously */}
          <motion.div
            className="absolute top-0 left-0 h-full flex"
            style={{ width: WIDTH * 2 }}
            initial={{ x: -WIDTH }}
            animate={{ x: [-WIDTH, 0] }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          >
            {[0, 1].map((copy) => (
              <svg
                key={copy}
                width={WIDTH}
                height={HEIGHT}
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="shrink-0"
              >
                <defs>
                  <linearGradient id={`gradA-${copy}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00E5E5" stopOpacity="0.1" />
                    <stop offset="20%" stopColor="#00E5E5" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#00c2c2" stopOpacity="0.6" />
                    <stop offset="80%" stopColor="#00E5E5" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#00E5E5" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id={`gradB-${copy}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#39c9d9" stopOpacity="0.1" />
                    <stop offset="20%" stopColor="#39c9d9" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#0aa8b8" stopOpacity="0.6" />
                    <stop offset="80%" stopColor="#39c9d9" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#39c9d9" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {renderBundle(bundleA, `gradA-${copy}`)}
                {renderBundle(bundleB, `gradB-${copy}`)}
              </svg>
            ))}
          </motion.div>
        </motion.div>

        {/* Edge fade — blends into the section's own black background, not white */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 55%, rgba(0,0,0,1) 100%)",
          }}
        />
      </div>

      {/* ===== Hero content (interactive, sits above background) ===== */}
      {/* ===== Hero content (interactive, sits above background) =====
    pt-24/sm:pt-32 clears the fixed navbar (h-12 mobile / h-20 sm+)
    plus breathing room, instead of the old uniform py-24 which
    wasn't enough to clear the header on mobile. */}
<div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 pb-16 pt-24 text-center sm:px-6 sm:pb-24 sm:pt-28">
  {/* ── Eyebrow: terminal-style status line instead of a pill badge ── */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 sm:px-4"
  >
    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00E5E5] sm:text-xs">
     Welcome To ZK Nexus
    </span>
  </motion.div>

  {/* ── Heading: fluid clamp() size so it scales smoothly from 320px
      up instead of jumping from one fixed size to another. The old
      text-5xl (48px) as the mobile *starting point* was the bug —
      this now starts around 32px on the smallest phones. ── */}
  <motion.h1
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.7 }}
    className="mt-6 max-w-4xl font-black uppercase leading-[1.05] text-white sm:mt-8 sm:leading-[0.95]"
    style={{ fontSize: "clamp(2rem, 6vw + 0.5rem, 3.75rem)" }}
  >
    Build digital
    <br />
    products that Scale.
  </motion.h1>

  {/* ── Description ── */}
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.25, duration: 0.7 }}
    className="mt-5 max-w-xl text-sm leading-relaxed text-white/50 sm:mt-7 sm:text-base md:text-lg"
  >
    Secure, scalable, intelligent software for startups and enterprise 
    from AI platforms and SaaS products to full cybersecurity coverage.
  </motion.p>

  {/* ── CTAs: full-width stacked on very small screens, side by side from xs up ── */}
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.7 }}
  className="mt-8 flex w-full flex-col items-stretch gap-3 xs:w-auto xs:flex-row xs:items-center sm:mt-10 sm:gap-4 md:w-full md:flex-row md:items-center md:justify-center md:gap-3"
>
  <Link
    href="/contact"
    className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#00E5E5] px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_-6px_rgba(0,229,229,0.6)] sm:px-7 sm:py-3.5 md:px-5 md:py-2.5 md:text-xs lg:px-6 lg:py-3 lg:text-sm"
  >
    Start Your Project
    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Link>

  <Link
    href="/#work"
    onClick={handleWorkClick}
    className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition-all duration-300 hover:border-[#00E5E5]/50 hover:text-white sm:px-7 sm:py-3.5 md:px-5 md:py-2.5 md:text-xs lg:px-6 lg:py-3 lg:text-sm"
  >
    View Our Work
    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M14 3h7v7M21 3L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Link>
</motion.div>

  {/* ── Small capability strip — wraps instead of overflowing on tiny screens ── */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6, duration: 0.8 }}
    className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[10px] tracking-[0.15em] text-white/30 sm:mt-16 sm:gap-6 sm:text-[11px]"
  >
    <span>WEB DEVELOPMENT</span>
    <span className="h-3 w-px bg-white/15" />
    <span>UI / UX</span>
    <span className="h-3 w-px bg-white/15" />
    <span>CYBERSECURITY</span>
  </motion.div>
</div>
    </div>
  );
}