"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  DollarSign,
  Headphones,
  Check,
  Rocket,
  Layers,
  Zap,
  Heart,
  ArrowRight,
} from "lucide-react";

// ======================================================
// CONTENT
// ======================================================

const uptimeSeries = [40, 55, 48, 62, 58, 74, 68, 82, 78, 90];
const shippedSeries = [6, 9, 7, 11, 8, 13, 10];
const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
const stack = ["React", "Next.js", "FastAPI", "AWS"];

// ======================================================
// FIXED REVEAL ORDER — random-looking but constant every load.
// ======================================================

const REVEAL_ORDER = [4, 8, 1, 6, 9, 0, 10, 3, 7, 2, 5];
const REVEAL_DELAY = 0.2;
const delayFor = (cardIndex: number) =>
  REVEAL_ORDER.indexOf(cardIndex) * REVEAL_DELAY;

// ======================================================
// GLASS SHELL — cyan border + rotating border-beam on hover
// ======================================================

function Shell({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`group relative h-full overflow-hidden rounded-2xl p-[1px] transition-all duration-500 ${className}`}
    >
      {/* static cyan border, fades out on hover to let the beam take over */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[#00E5E5]/25 transition-opacity duration-500 group-hover:opacity-0" />

      {/* rotating conic-gradient beam, hidden until hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-[-60%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#00E5E5_15deg,transparent_60deg)]" />
      </div>

      {/* inner surface, inset by 1px so only the beam shows through as a border */}
      <div className="relative h-full rounded-[15px] border border-white/5 bg-[#0B0C10]/95 p-3.5 backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}

function CardWrap({
  area,
  index,
  className,
  children,
}: {
  area: string;
  index: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ gridArea: area }}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: delayFor(index),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      <Shell className="h-full">{children}</Shell>
    </motion.div>
  );
}

// ======================================================
// MINI VISUALS
// ======================================================

function LineChart() {
  const w = 200;
  const h = 48;
  const max = Math.max(...uptimeSeries);
  const min = Math.min(...uptimeSeries);
  const points = uptimeSeries.map((v, i) => {
    const x = (i / (uptimeSeries.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  });
  const path = `M${points.join(" L")}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-11 w-full overflow-visible">
      <motion.path
        d={path}
        fill="none"
        stroke="#00E5E5"
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: delayFor(0) + 0.2, ease: "easeOut" }}
      />
    </svg>
  );
}

function BarRow() {
  const max = Math.max(...shippedSeries);
  return (
    <div className="mt-3 flex h-16 items-end gap-1.5">
      {shippedSeries.map((v, i) => (
        <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
          <motion.div
            className="w-full rounded-t-sm bg-gradient-to-t from-[#635BFF] to-[#00E5E5]"
            initial={{ height: 0 }}
            whileInView={{ height: `${(v / max) * 100}%` }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: delayFor(2) + i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          <span className="text-[9px] text-white/30">{dayLabels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function Donut() {
  const pct = 99.9;
  const r = 30;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg viewBox="0 0 72 72" className="h-20 w-20 -rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
        <motion.circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="#00E5E5"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (pct / 100) * c }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delayFor(4) + 0.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-base font-bold text-white">99.9%</span>
        <span className="text-[8px] uppercase tracking-wide text-white/40">audit pass</span>
      </div>
    </div>
  );
}

// ======================================================
// SIDEBAR INTRO — sticky-feeling column beside the dashboard
// ======================================================

function SidebarIntro() {
  const scrollToWorkflow = () => {
    document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="hidden h-full flex-col justify-center md:flex"
    >
      <div className="flex items-center gap-1.5 text-white/50">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00E5E5]">
          //
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
          Why choose us
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold leading-tight text-white sm:text-[26px]">
        Built by engineers who ship, not just estimate.
      </p>

      <p className="mt-3 text-sm leading-relaxed text-white/45">
        Every project runs security-first, on fixed timelines, with senior
        engineers only.
      </p>

      <button
        onClick={scrollToWorkflow}
        className="mt-6 inline-flex w-fit items-center gap-1.5 font-mono text-sm font-medium text-[#00E5E5] transition-colors hover:text-white"
      >
        See our process
        <ArrowRight size={14} />
      </button>
    </motion.div>
  );
}

// ======================================================
// SECTION
// ======================================================

const areas = `
  "uptime    response  accounts accounts"
  "uptime    pricing   accounts accounts"
  "security  shipped   darkcta  darkcta"
  "security  shipped   support  support"
  "retention stack     agile    agile"
`;

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0B0C10] px-6 md:px-8 py-20 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[650px] w-[800px] rounded-full bg-[#00E5E5]/6 blur-[200px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5"
        >
          
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#00E5E5]">
           Why us
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 text-3xl font-black uppercase leading-[0.95] text-white sm:text-3xl md:text-5xl"
        >
          Why Companies
          <br />
          Choose <span className="text-[#00E5E5]">ZK Nexus</span>
        </motion.h2>
      </div>

      {/* ================= DASHBOARD + SIDEBAR (3/4 + 1/4) ================= */}

      <div className="relative z-10 mx-auto mt-16 hidden max-w-7xl gap-6 sm:mt-20 md:grid md:grid-cols-[3fr_1fr]">
        {/* dashboard bento — takes 3/4 width */}
        <div
          className="gap-3 md:grid md:[grid-template-columns:1.1fr_1.1fr_1fr_1fr] md:[grid-template-rows:96px_96px_106px_86px_86px]"
          style={{ gridTemplateAreas: areas }}
        >
          {/* uptime — line chart */}
          <CardWrap area="uptime" index={0}>
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center gap-1.5 text-white/50">
                <TrendingUp size={14} className="text-[#00E5E5]" />
                <span className="text-xs uppercase tracking-wide">Uptime</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">99.9%</p>
                <LineChart />
              </div>
            </div>
          </CardWrap>

          {/* response time */}
          <CardWrap area="response" index={1}>
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center gap-1.5 text-white/50">
                <Rocket size={14} className="text-[#635BFF]" />
                <span className="text-xs uppercase tracking-wide">Response</span>
              </div>
              <p className="text-3xl font-bold text-white">
                48H
                <span className="ml-2 text-xs font-normal text-[#00E5E5]">no queue</span>
              </p>
            </div>
          </CardWrap>

          {/* shipped — bar chart */}
          <CardWrap area="shipped" index={2} className="md:block">
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center justify-between text-white/50 ">
                <span className="text-xs uppercase tracking-wide">Projects shipped</span>
                <span className="text-xs text-[#00E5E5]">+12% ↑</span>
              </div>
              <p className="text-2xl font-bold text-white">120+</p>
              <BarRow />
            </div>
          </CardWrap>

          {/* pricing */}
          <CardWrap area="pricing" index={3}>
            <div className="flex h-full items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00E5E5]/10">
                <DollarSign size={16} className="text-[#00E5E5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Fixed pricing</p>
                <p className="text-xs text-white/40">No surprise invoices</p>
              </div>
            </div>
          </CardWrap>

          {/* security — donut */}
          <CardWrap area="security" index={4}>
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <ShieldCheck size={20} className="text-[#00E5E5]" />
              <Donut />
              <span className="text-xs text-white/40">Security-first builds</span>
            </div>
          </CardWrap>

          {/* accounts / team list */}
          <CardWrap area="accounts" index={5}>
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center gap-1.5 text-white/50">
                <Users size={14} className="text-[#635BFF]" />
                <span className="text-xs uppercase tracking-wide">Our team</span>
              </div>
              <div className="mt-2 space-y-2">
                {[
                  { label: "Senior engineers", pct: "100%" },
                  { label: "Security specialists", pct: "on every build" },
                  { label: "Dedicated PM", pct: "included" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between border-b border-white/5 pb-1.5 text-sm">
                    <span className="flex items-center gap-2 text-white/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00E5E5]" />
                      {row.label}
                    </span>
                    <span className="text-xs text-white/40">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardWrap>

          {/* dark accent CTA card */}
          <CardWrap area="darkcta" index={6}>
            <div className="flex h-full flex-col justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Built for scale</p>
              <p className="text-xl font-bold uppercase text-white">
                ZK <span className="text-[#00E5E5]">Nexus</span>
              </p>
            </div>
          </CardWrap>

          {/* support */}
          <CardWrap area="support" index={7}>
            <div className="flex h-full items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Headphones size={16} className="text-[#635BFF]" />
                <div>
                  <p className="text-sm font-bold text-white">90-day support</p>
                  <p className="text-xs text-white/40">Included post-launch</p>
                </div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00E5E5]/15">
                <Check size={16} className="text-[#00E5E5]" />
              </div>
            </div>
          </CardWrap>

          {/* client retention */}
          <CardWrap area="retention" index={8}>
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center gap-1.5 text-white/50">
                <Heart size={14} className="text-[#00E5E5]" />
                <span className="text-xs uppercase tracking-wide">Retention</span>
              </div>
              <p className="text-2xl font-bold text-white">
                40+
                <span className="ml-2 text-xs font-normal text-white/40">clients retained</span>
              </p>
            </div>
          </CardWrap>

          {/* tech stack */}
          <CardWrap area="stack" index={9}>
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center gap-1 text-white/50">
                <Layers size={14} className="text-[#635BFF]" />
                <span className="text-xs uppercase tracking-wide">Modern stack</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-white/60"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </CardWrap>

          {/* agile delivery, wide */}
          <CardWrap area="agile" index={10}>
            <div className="flex h-full items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#635BFF]/15">
                <Zap size={16} className="text-[#635BFF]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Agile delivery</p>
                <p className="text-xs text-white/40">
                  Short sprints, weekly demos, fast feedback loops
                </p>
              </div>
            </div>
          </CardWrap>
        </div>

        {/* sidebar intro — takes 1/4 width */}
        <SidebarIntro />
      </div>

      {/* mobile fallback — stacked, same fixed reveal order via delay.
          "clients retained" + "Agile delivery" and "support" + "pricing"
          are grouped into 2-col rows so they sit side by side. */}
      <div className="relative z-10 mx-auto mt-16 flex max-w-7xl flex-col gap-3 md:hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xl font-bold leading-tight text-white">
            Built by engineers who ship, not just estimate.
          </p>
          <p className="mt-2 text-sm text-white/45">
            Every project runs security-first, on fixed timelines, with senior engineers only.
          </p>
          <button
            onClick={() => document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-4 inline-flex items-center gap-1.5 font-mono text-sm font-medium text-[#00E5E5]"
          >
            See our process
            <ArrowRight size={14} />
          </button>
        </motion.div>

        {[
          { type: "single" as const, i: 0, node: <><div className="flex items-center gap-1.5 text-white/50"><TrendingUp size={14} className="text-[#00E5E5]" /><span className="text-xs uppercase tracking-wide">Uptime</span></div><p className="mt-1.5 text-2xl font-bold text-white">99.9%</p><LineChart /></> },
          { type: "single" as const, i: 4, node: <div className="flex flex-col items-center gap-2"><ShieldCheck size={16} className="text-[#53a0a0]" /><Donut /><span className="text-xs text-white/40">Security-first builds</span></div> },
          { type: "single" as const, i: 2, node: <><p className="text-xs uppercase tracking-wide text-white/50">Projects shipped</p><p className="text-2xl font-bold text-white">120+</p><BarRow /></> },
          { type: "single" as const, i: 5, node: <><div className="flex items-center gap-1.5 text-white/50"><Users size={14} className="text-[#635BFF]" /><span className="text-xs uppercase tracking-wide">Our team</span></div><p className="mt-1.5 text-sm text-white/70">100% senior engineers</p></> },
          { type: "single" as const, i: 1, node: <p className="text-3xl font-bold text-white">48H <span className="ml-2 text-xs font-normal text-[#00E5E5]">no queue</span></p> },
          {
            type: "pair" as const,
            items: [
              { i: 3, node: <><p className="text-xs font-bold text-white">Fixed pricing</p><p className="mt-0.5 text-[11px] text-white/40">No surprise invoices</p></> },
              { i: 7, node: <><p className="text-xs font-bold text-white">90-day support</p><p className="mt-0.5 text-[11px] text-white/40">Included post-launch</p></> },
            ],
          },
          {
            type: "pair" as const,
            items: [
              { i: 8, node: <p className="text-xs font-bold text-white">40+ clients retained</p> },
              { i: 10, node: <p className="text-xs font-bold text-white">Agile delivery</p> },
            ],
          },
        ].map((entry, idx) =>
          entry.type === "single" ? (
            <motion.div
              key={entry.i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.1, delay: delayFor(entry.i), ease: [0.12, 1, 0.26, 1] }}
            >
              <Shell>{entry.node}</Shell>
            </motion.div>
          ) : (
            <div key={`pair-${idx}`} className="grid grid-cols-2 gap-3">
              {entry.items.map(({ i, node }) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.1, delay: delayFor(i), ease: [0.12, 1, 0.26, 1] }}
                >
                  <Shell>{node}</Shell>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}