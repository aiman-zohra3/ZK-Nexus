"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Code2, Palette, Shield, Lock, CheckCircle2, PackageCheck, Rocket,
  ChevronLeft, ChevronRight, RotateCw, Star, MoreVertical, Plus, X,
  Signal, Wifi, BatteryFull,
} from "lucide-react";

const tabs = [
  { title: "Web Development", icon: Code2 },
  { title: "UI/UX Design", icon: Palette },
  { title: "Cybersecurity", icon: Shield },
];

// ─────────────────────────────────────────────────────────────
// Shared data — lifted out so both the desktop browser mockup
// and the mobile phone mockup render from the same source.
// ─────────────────────────────────────────────────────────────

const webSteps = [
  { label: "Install dependencies", icon: PackageCheck, done: true },
  { label: "Run test suite", icon: CheckCircle2, done: true },
  { label: "Build production bundle", icon: Code2, done: true },
  { label: "Deploy to edge", icon: Rocket, done: false },
];

const webCodeLines = [
  [
    { t: "import ", c: "#00E5E5" },
    { t: "{ createServerFn }", c: "#E5E7EB" },
    { t: " from ", c: "#00E5E5" },
    { t: '"@tanstack/react-start"', c: "#00E5E5" },
  ],
  [],
  [
    { t: "export const ", c: "#00E5E5" },
    { t: "deployApp", c: "#E5E7EB" },
    { t: " = createServerFn()", c: "#8B8F98" },
  ],
  [
    { t: "  .handler(", c: "#8B8F98" },
    { t: "async ", c: "#00E5E5" },
    { t: "({ data }) => {", c: "#E5E7EB" },
  ],
  [
    { t: "    const secureBuild = ", c: "#E5E7EB" },
    { t: "await ", c: "#00E5E5" },
    { t: "verifyIntegrity(data)", c: "#E5E7EB" },
  ],
  [
    { t: "    return ", c: "#00E5E5" },
    { t: "edgeDeploy(secureBuild)", c: "#00E5E5" },
  ],
  [{ t: "  })", c: "#8B8F98" }],
];

// Properties shown in the UI/UX inspector panel — mirrors what a
// designer would actually be checking when a component is selected.
const uiProperties = [
  { label: "Width", value: "1140px" },
  { label: "Height", value: "320px" },
  { label: "Padding", value: "48 / 64" },
  { label: "Radius", value: "16px" },
  { label: "Font", value: "Space Grotesk" },
];

const uiLayers = [
  { name: "Navbar", type: "Frame" },
  { name: "Hero Section", type: "Frame", active: true },
  { name: "Service Cards", type: "Group" },
  { name: "CTA Button", type: "Component" },
  { name: "Footer", type: "Frame" },
];

const securityScanQueue = [
  "Network perimeter",
  "Dependency vulnerabilities",
  "Encryption at rest",
];

const securityItems = [{ title: "TLS 1.3 Active", icon: Lock, status: "Secure" }];

export default function Browser1() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Each screen now holds for 9s (was 4s) — +5s dwell time per tab.
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % 3);
    }, 9000);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="relative mx-auto mt-20 w-full max-w-7xl px-6">
      {/* Ambient glow */}
      <motion.div
        animate={{ opacity: [0.4, 0.5, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-24 left-1/3 h-40 w-80 rounded-full bg-[#00E5E5] blur-[130px]"
      />

      {/* ============================================================
          DESKTOP / TABLET — unchanged browser window, md and up
         ============================================================ */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative hidden sm:block"
      >
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0B0C10] shadow-[0_40px_90px_-30px_rgba(0,229,229,0.25),0_0_0_1px_rgba(0,0,0,0.4)]">
          {/* Tab strip */}
          <div className="flex items-end gap-2 border-b border-white/10 px-4 pt-3">
            <div className="flex gap-2 pb-3.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]/70" />
            </div>

            <div className="ml-2 flex items-center gap-2 rounded-t-xl border-x border-t border-white/10 bg-[#111318] px-4 py-2.5">
              <div className="h-3 w-3 shrink-0 rounded-[3px] bg-[#00E5E5]" />
              <span className="text-xs font-medium text-white/70">ZK Nexus — Dashboard</span>
              <X size={11} className="ml-3 shrink-0 text-white/20" />
            </div>

            <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-lg text-white/20">
              <Plus size={13} />
            </div>
          </div>

          {/* URL bar */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <ChevronLeft size={15} className="text-white/20" />
              <ChevronRight size={15} className="text-white/20" />
              <RotateCw size={12} className="text-white/20" />
            </div>

            <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
              <Lock size={10} className="shrink-0 text-[#00E5E5]" />
              <span className="text-sm text-white/60">zknexus.dev/dashboard</span>
            </div>

            <Star size={14} className="text-white/20" />
            <MoreVertical size={14} className="text-white/20" />
          </div>

          {/* Navbar */}
          <div className="flex items-center justify-between border-b border-white/10 px-8 py-5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center text-lg font-bold text-[#00E5E5]">ZK</div>
              <h2 className="text-lg font-bold text-white">Nexus</h2>
            </div>

            <div className="flex items-center gap-3">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.title}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                      active === index
                        ? "bg-[#00E5E5] text-black shadow-md shadow-cyan-500/20"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animated Screens */}
          <div className="relative h-[720px] overflow-hidden bg-[#0B0C10] p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {active === 0 && <WebScreen key="web" />}
              {active === 1 && <UiScreen key="ui" />}
              {active === 2 && <SecurityScreen key="security" />}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ============================================================
          MOBILE — phone frame, below md
         ============================================================ */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative mx-auto w-full max-w-[320px] sm:hidden"
      >
        <div className="overflow-hidden rounded-[40px] border-[6px] border-[#1a1c22] bg-[#0B0C10] shadow-[0_30px_70px_-25px_rgba(0,229,229,0.3),0_0_0_1px_rgba(0,0,0,0.4)]">
          {/* Status bar with notch */}
          <div className="relative flex items-center justify-between bg-[#0B0C10] px-6 pb-1.5 pt-2.5">
            <span className="text-[11px] font-semibold text-white">9:41</span>
            <div className="absolute left-1/2 top-1.5 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
            <div className="flex items-center gap-1 text-white/80">
              <Signal size={12} />
              <Wifi size={12} />
              <BatteryFull size={14} />
            </div>
          </div>

          {/* App header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#00E5E5]">ZK</span>
              <span className="text-sm font-bold text-white">Nexus</span>
            </div>
            <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[9px] text-white/40">
              {tabs[active].title}
            </span>
          </div>

          {/* Screen content */}
          <div className="relative h-[520px] overflow-y-auto bg-[#0B0C10] px-4 py-4">
            <AnimatePresence mode="wait">
              {active === 0 && <MobileWebScreen key="web-m" />}
              {active === 1 && <MobileUiScreen key="ui-m" />}
              {active === 2 && <MobileSecurityScreen key="security-m" />}
            </AnimatePresence>
          </div>

          {/* Bottom tab bar */}
          <div className="flex items-center justify-around border-t border-white/10 bg-[#111318] px-2 pt-2.5">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.title}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition-colors duration-300 ${
                    active === index ? "text-[#00E5E5]" : "text-white/35"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-[9px] font-medium leading-none">
                    {tab.title.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center bg-[#111318] pb-2 pt-2">
            <div className="h-1 w-28 rounded-full bg-white/25" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          DESKTOP SCREENS                                   */
/* -------------------------------------------------------------------------- */

function WebScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="grid h-[470px] grid-cols-[190px_1fr] gap-4">
        <div className="flex flex-col rounded-2xl border border-white/10 bg-[#111318] p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-white/40">
            Pipeline
          </p>

          <div className="space-y-1">
            {webSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    step.done ? "text-white" : "text-white/40"
                  }`}
                >
                  {step.done ? (
                    <Icon size={14} className="shrink-0 text-[#00E5E5]" />
                  ) : (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Icon size={14} className="shrink-0 text-white/40" />
                    </motion.div>
                  )}
                  <span className="truncate">{step.label}</span>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/30">
              Branch
            </p>
            <div className="flex items-center gap-1.5 font-mono text-xs text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00E5E5]" />
              main
            </div>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D0E12]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <div className="h-2 w-2 rounded-full bg-red-400/60" />
            <div className="h-2 w-2 rounded-full bg-yellow-400/60" />
            <div className="h-2 w-2 rounded-full bg-green-400/60" />
            <span className="ml-2 font-mono text-[11px] text-white/40">deploy.ts</span>
          </div>

          <div className="flex-1 px-4 py-4 font-mono text-[13px] leading-7">
            {webCodeLines.map((line, i) => (
              <div key={i} className="flex">
                <span className="w-6 select-none text-right text-white/20">{i + 1}</span>
                <span className="ml-4">
                  {line.map((tok, j) => (
                    <span key={j} style={{ color: tok.c }}>
                      {tok.t}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-white/10 px-4 py-3">
            <div>
              <p className="text-[11px] text-white/40">Build time</p>
              <p className="font-semibold text-white">12.4s</p>
            </div>
            <div>
              <p className="text-[11px] text-white/40">Bundle size</p>
              <p className="font-semibold text-white">84 kb</p>
            </div>
            <div>
              <p className="text-[11px] text-white/40">Edge regions</p>
              <p className="font-semibold text-white">14</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111318] px-6 py-4">
        <div className="flex items-center gap-2 text-white">
          <CheckCircle2 size={18} className="text-[#00E5E5]" />
          Build deployed successfully
        </div>
        <span className="font-mono text-xs text-white/40">zknexus.dev · 200 OK · 84ms</span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// UI/UX SCREEN — rebuilt to match the dark/cyan/black system and
// to read as a clear "design inspector": Layers → Canvas Preview
// → Properties, so what's happening is obvious at a glance.
// ─────────────────────────────────────────────────────────────

function UiScreen() {
  const [step, setStep] = useState(-1); // -1 = loading, 0 = navbar, 1 = hero, 2 = cta, 3 = dims (final)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(0), 600),  // navbar appears
      setTimeout(() => setStep(1), 1700), // hero content appears
      setTimeout(() => setStep(2), 2800), // cta appears
      setTimeout(() => setStep(3), 3600), // dashed selection + dimension label — total 4s build
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const activeLayer =
    step === 0 ? "Navbar" : step === 1 ? "Hero Section" : step === 2 ? "CTA Button" : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="grid h-[470px] grid-cols-[190px_1fr_210px] gap-4">
        {/* Layers — left edge lights up cyan for the layer currently being built */}
        <div className="flex flex-col rounded-2xl border border-white/10 bg-[#111318] p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-white/40">
            Layers
          </p>

          <div className="space-y-1">
            {uiLayers.map((layer, i) => {
              const isActive = layer.name === activeLayer;
              return (
                <motion.div
                  key={layer.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  className={`flex items-center justify-between rounded-lg border-l-2 px-3 py-2 text-sm transition-colors duration-300 ${
                    isActive
                      ? "border-[#00E5E5] bg-[#00E5E5]/10 text-white font-medium"
                      : layer.active
                      ? "border-transparent bg-[#00E5E5]/5 text-white/70"
                      : "border-transparent text-white/50"
                  }`}
                >
                  <span className="truncate">{layer.name}</span>
                  <span className="font-mono text-[10px] text-white/30">{layer.type}</span>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">
              Palette
            </p>
            <div className="flex gap-2">
              <div className="h-7 w-7 rounded-full border border-white/10 bg-[#0B0C10]" />
              <div className="h-7 w-7 rounded-full border border-white/10 bg-[#00E5E5]" />
              <div className="h-7 w-7 rounded-full border border-white/10 bg-white" />
            </div>
          </div>
        </div>

        {/* Canvas Preview — builds up: navbar -> hero -> cta -> dashed selection */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D0E12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:16px_16px] p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
              Canvas Preview
            </span>
            <span className="rounded-full bg-[#00E5E5]/10 px-2.5 py-1 text-[10px] font-medium text-[#00E5E5]">
              {activeLayer ? `${activeLayer} — Building` : step === 3 ? "Hero Section — Selected" : "Idle"}
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center">
            {step === -1 ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
                <Palette size={48} className="text-[#00E5E5]" />
              </motion.div>
            ) : (
              <div className="relative w-full">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111318] shadow-lg shadow-black/40">
                  {/* Navbar — step 0+ */}
                  <AnimatePresence>
                    {step >= 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative flex items-center justify-between border-b border-white/10 px-5 py-3"
                      >
                        
                        <div className="h-4 w-17 px-2 rounded-full bg-[#00E5E5] text-black text-xs" >Navbar</div>
                        <div className="flex gap-3">
                          <div className="h-2 w-8 rounded-full bg-white/10" />
                          <div className="h-2 w-8 rounded-full bg-white/10" />
                          <div className="h-2 w-8 rounded-full bg-white/10" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hero content — step 1+ */}
                  <div className="relative px-5 py-8 text-center">
                    <AnimatePresence>
                      {step >= 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="relative"
                        >
                          
                          <div className="mx-auto h-3.5 w-52 rounded-full bg-white text-xs text-black font-bold" >Hero Section</div>
                          <div className="mx-auto mt-3 h-2 w-64 rounded-full bg-white/20" />
                          <div className="mx-auto mt-1.5 h-2 w-48 rounded-full bg-white/20" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* CTA — step 2+ */}
                    <AnimatePresence>
                      {step >= 2 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.35 }}
                          className="relative mx-auto mt-4 w-fit"
                        >
                          
                          <div className="h-7 w-28 rounded-lg bg-[#00E5E5] text-xs py-1 text-black " >CTA Button</div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Dashed selection overlay — step 3 only */}
                    <AnimatePresence>
                      {step === 3 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="pointer-events-none absolute inset-2 rounded-md border-2 border-dashed border-[#00E5E5]/50"
                        >
                          {["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"].map((pos) => (
                            <div key={pos} className={`absolute h-2 w-2 rounded-[2px] bg-[#00E5E5] ${pos}`} />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Service card row — appears alongside hero for context */}
                  <AnimatePresence>
                    {step >= 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="grid grid-cols-3 gap-3 px-5 pb-6"
                      >
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                            <div className="h-6 w-6 rounded-md bg-[#00E5E5]/20" />
                            <div className="mt-2 h-1.5 w-full rounded-full bg-white/10" />
                            <div className="mt-1 h-1.5 w-2/3 rounded-full bg-white/10" />
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dimension label — step 3 only, appears last */}
                <AnimatePresence>
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-[#00E5E5] px-2 py-0.5 font-mono text-[10px] font-semibold text-black"
                    >
                      1140 × 320 — Hero Section
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Properties inspector */}
        <div className="flex flex-col rounded-2xl border border-white/10 bg-[#111318] p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-white/40">
            Properties
          </p>
          <div className="space-y-2.5">
            {uiProperties.map((prop) => (
              <div key={prop.label} className="flex items-center justify-between text-sm">
                <span className="text-white/40">{prop.label}</span>
                <span className="font-mono text-white/80">{prop.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/30">
              Type
            </p>
            <div className="flex items-center gap-1.5 text-sm text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00E5E5]" />
              Component
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-white/10 bg-[#111318] px-6 py-4">
        <div className="flex items-end gap-4">
          <span className="font-black text-white" style={{ fontSize: 26 }}>Aa</span>
          <span className="font-black text-white" style={{ fontSize: 18 }}>Aa</span>
          <span className="font-medium text-white/50" style={{ fontSize: 13 }}>Aa</span>
          <span className="font-mono text-[11px] text-white/40">Space Grotesk / Inter</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/50">
          <CheckCircle2 size={16} className="text-[#00E5E5]" />
          Synced — 12 components
        </div>
      </div>
    </motion.div>
  );
}

function SecurityScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="grid gap-6 lg:grid-cols-[1.1fr_1fr]"
    >
      <div className="flex flex-col gap-4">
        <div className="relative flex h-[420px] flex-col items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[#0D0E12]">
          <div className="absolute left-6 top-6 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5E5] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E5E5]" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
              Live monitoring
            </span>
          </div>

          {/* Radar scanner — static rings + single rotating sweep, icon fixed on top */}
          {/* Activity rings — Network / Data / Access */}
<motion.div
  animate={{ scale: [1, 1.03, 1] }}
  transition={{ duration: 3, repeat: Infinity }}
  className="relative flex h-56 w-56 items-center justify-center"
>
  <svg width="224" height="224" viewBox="0 0 224 224" className="-rotate-90">
    {/* Network ring */}
    <circle cx="112" cy="112" r="96" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
    <motion.circle
      cx="112" cy="112" r="96" fill="none" stroke="#00E5E5" strokeWidth="10" strokeLinecap="round"
      strokeDasharray={603}
      initial={{ strokeDashoffset: 603 }}
      animate={{ strokeDashoffset: 603 * (1 - 0.84) }}
      transition={{ duration: 2.2, delay: 0.1, ease: "easeOut" }}
    />
    {/* Data ring */}
    <circle cx="112" cy="112" r="74" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
    <motion.circle
      cx="112" cy="112" r="74" fill="none" stroke="#5dca6b" strokeWidth="10" strokeLinecap="round"
      strokeDasharray={465}
      initial={{ strokeDashoffset: 465 }}
      animate={{ strokeDashoffset: 465 * (1 - 0.89) }}
      transition={{ duration: 1.9, delay: 0.25, ease: "easeOut" }}
    />
    {/* Access ring */}
    <circle cx="112" cy="112" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
    <motion.circle
      cx="112" cy="112" r="52" fill="none" stroke="#f2ef23" strokeWidth="10" strokeLinecap="round"
      strokeDasharray={327}
      initial={{ strokeDashoffset: 327 }}
      animate={{ strokeDashoffset: 327 * (1 - 0.95) }}
      transition={{ duration: 1., delay: 0.4, ease: "easeOut" }}
    />
  </svg>

  {/* Center shield */}
  <div className="absolute rounded-full bg-[#111318] p-5 shadow-[0_0_30px_rgba(0,229,229,0.15)]">
    <Shield size={44} className="text-[#00E5E5]" />
  </div>
</motion.div>

{/* Ring legend */}
<div className="mt-5 flex items-center gap-5 text-xs">
  <span className="flex items-center gap-1.5 text-white/60">
    <span className="h-1.5 w-1.5 rounded-full bg-[#00E5E5]" /> Network 84%
  </span>
  <span className="flex items-center gap-1.5 text-white/60">
    <span className="h-1.5 w-1.5 rounded-full bg-[#5DCAA5]" /> Data 89%
  </span>
  <span className="flex items-center gap-1.5 text-white/60">
    <span className="h-1.5 w-1.5 rounded-full bg-[#F2A623]" /> Access 95%
  </span>
</div>

          <p className="absolute bottom-6 font-mono text-[11px] text-white/40">
            Last scan completed 2 min ago
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-white/10 bg-[#111318] p-6">
            <h3 className="text-3xl font-black text-white">99.9%</h3>
            <p className="mt-2 text-white/50">System Uptime</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#111318] p-6">
            <h3 className="text-3xl font-black text-white">0</h3>
            <p className="mt-2 text-white/50">Threats Detected</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-[#111318] p-5">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-white/40">
            Scan queue
          </p>
          <div className="space-y-2.5">
            {securityScanQueue.map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i, duration: 0.3 }}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-white/70">{label}</span>
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15 * i + 0.3 }}>
                  <CheckCircle2 size={14} className="text-[#00E5E5]" />
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>

        {securityItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-center justify-between rounded-3xl border border-white/10 bg-[#111318] px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-[#00E5E5]/10 p-3">
                  <Icon size={18} className="text-[#00E5E5]" />
                </div>
                <p className="font-medium text-white">{item.title}</p>
              </div>
              <span className="rounded-full bg-[#00E5E5]/10 px-4 py-2 text-sm font-medium text-[#00E5E5]">
                {item.status}
              </span>
            </div>
          );
        })}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0D0E12]">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-2.5">
            <div className="h-2 w-2 rounded-full bg-red-400/60" />
            <div className="h-2 w-2 rounded-full bg-yellow-400/60" />
            <div className="h-2 w-2 rounded-full bg-green-400/60" />
            <span className="ml-2 font-mono text-[11px] text-white/40">security.log</span>
          </div>

          <div className="p-5 font-mono text-[13px]">
            <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} className="space-y-2.5">
              {[
                { time: "04:12:01", msg: "Port scan blocked", ip: "10.0.4.12" },
                { time: "04:12:04", msg: "SSL certificate verified", ip: "—" },
                { time: "04:12:09", msg: "Firewall ruleset updated", ip: "—" },
              ].map((log) => (
                <div key={log.msg} className="flex items-center gap-2 text-white/50">
                  <span className="text-white/30">{log.time}</span>
                  <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                    OK
                  </span>
                  <span className="text-white/80">{log.msg}</span>
                  {log.ip !== "—" && <span className="ml-auto text-white/30">{log.ip}</span>}
                </div>
              ))}
              <p className="pt-1 font-semibold text-[#00E5E5]">All systems protected.</p>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ boxShadow: ["0 0 0px rgba(0,229,229,0)", "0 0 24px rgba(0,229,229,0.15)", "0 0 0px rgba(0,229,229,0)"] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="rounded-3xl border border-[#00E5E5]/20 bg-[#00E5E5]/5 p-4"
        >
          <p className="text-sm font-medium text-white/70">Security Score</p>
          <h2 className="mt-2 text-4xl font-black text-white">99.9%</h2>
          <p className="mt-2 text-white/50">Enterprise-grade protection enabled.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                       MOBILE SCREENS — phone-frame layouts                 */
/* -------------------------------------------------------------------------- */

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111318] px-2 py-2.5 text-center">
      <p className="text-[9px] text-white/40">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function MobileWebScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35 }}
      className="space-y-3.5"
    >
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-3.5">
        <p className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-white/40">
          Pipeline
        </p>
        <div className="space-y-1">
          {webSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] ${
                  step.done ? "text-white" : "text-white/40"
                }`}
              >
                {step.done ? (
                  <Icon size={14} className="shrink-0 text-[#00E5E5]" />
                ) : (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Icon size={14} className="shrink-0 text-white/40" />
                  </motion.div>
                )}
                <span className="truncate">{step.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D0E12]">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-red-400/60" />
          <div className="h-2 w-2 rounded-full bg-yellow-400/60" />
          <div className="h-2 w-2 rounded-full bg-green-400/60" />
          <span className="ml-1 font-mono text-[10px] text-white/40">deploy.ts</span>
        </div>
        <div className="overflow-x-auto px-3 py-3 font-mono text-[11px] leading-6">
          {webCodeLines.slice(0, 5).map((line, i) => (
            <div key={i} className="flex whitespace-nowrap">
              <span className="w-4 select-none text-right text-white/20">{i + 1}</span>
              <span className="ml-3">
                {line.map((tok, j) => (
                  <span key={j} style={{ color: tok.c }}>
                    {tok.t}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MiniStat label="Build" value="12.4s" />
        <MiniStat label="Bundle" value="84 kb" />
        <MiniStat label="Regions" value="14" />
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#111318] px-4 py-3 text-[13px] text-white">
        <CheckCircle2 size={16} className="shrink-0 text-[#00E5E5]" />
        Build deployed successfully
      </div>
    </motion.div>
  );
}

function MobileUiScreen() {
  const [step, setStep] = useState(-1); // -1 = loading, 0 = navbar, 1 = hero, 2 = cta, 3 = dims (final)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(0), 500),
      setTimeout(() => setStep(1), 1400),
      setTimeout(() => setStep(2), 2300),
      setTimeout(() => setStep(3), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const activeLayer =
    step === 0 ? "Navbar" : step === 1 ? "Hero Section" : step === 2 ? "CTA Button" : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35 }}
      className="space-y-3.5"
    >
      <div className="flex gap-2 overflow-x-auto pb-1">
        {uiLayers.map((layer) => {
          const isActive = layer.name === activeLayer;
          return (
            <span
              key={layer.name}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors duration-300 ${
                isActive
                  ? "bg-[#00E5E5] text-black"
                  : layer.active
                  ? "bg-[#00E5E5]/10 text-[#00E5E5]"
                  : "border border-white/10 text-white/50"
              }`}
            >
              {layer.name}
            </span>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0D0E12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:14px_14px] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
            Canvas Preview
          </span>
          <span className="rounded-full bg-[#00E5E5]/10 px-2 py-0.5 text-[9px] font-medium text-[#00E5E5]">
            {activeLayer ? `${activeLayer} — Building` : step === 3 ? "Hero Section — Selected" : "Idle"}
          </span>
        </div>

        {step === -1 ? (
          <div className="flex h-36 items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
              <Palette size={36} className="text-[#00E5E5]" />
            </motion.div>
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-[#111318] shadow-lg shadow-black/40">
              {/* Navbar — step 0+ */}
              <AnimatePresence>
                {step >= 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="relative flex items-center justify-between border-b border-white/10 px-3 py-2"
                  >
                    {step === 0 && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-1 left-3 rounded-full bg-[#00E5E5] px-1.5 py-0.5 font-mono text-[8px] font-semibold text-black"
                      >
                        Navbar
                      </motion.span>
                    )}
                    <div className="h-2 w-10 rounded-full bg-[#00E5E5]" />
                    <div className="flex gap-1.5">
                      <div className="h-1.5 w-5 rounded-full bg-white/10" />
                      <div className="h-1.5 w-5 rounded-full bg-white/10" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hero content — step 1+ */}
              <div className="relative px-3 py-5 text-center">
                <AnimatePresence>
                  {step >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="relative"
                    >
                      {step === 1 && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#00E5E5] px-1.5 py-0.5 font-mono text-[8px] font-semibold text-black"
                        >
                          Hero Section
                        </motion.span>
                      )}
                      <div className="mx-auto h-2.5 w-32 rounded-full bg-white" />
                      <div className="mx-auto mt-2 h-1.5 w-40 rounded-full bg-white/20" />
                      <div className="mx-auto mt-1 h-1.5 w-28 rounded-full bg-white/20" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA — step 2+ */}
                <AnimatePresence>
                  {step >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative mx-auto mt-3 w-fit"
                    >
                      {step === 2 && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#00E5E5] px-1.5 py-0.5 font-mono text-[8px] font-semibold text-black"
                        >
                          CTA Button
                        </motion.span>
                      )}
                      <div className="h-5 w-20 rounded-md bg-[#00E5E5]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dashed selection overlay — step 3 only */}
                <AnimatePresence>
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      className="pointer-events-none absolute inset-1.5 rounded-md border-2 border-dashed border-[#00E5E5]/50"
                    >
                      {["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"].map((pos) => (
                        <div key={pos} className={`absolute h-1.5 w-1.5 rounded-[2px] bg-[#00E5E5] ${pos}`} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Service card row — step 1+ */}
              <AnimatePresence>
                {step >= 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="grid grid-cols-3 gap-2 px-3 pb-4"
                  >
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="rounded-md border border-white/10 bg-white/[0.03] p-2">
                        <div className="h-4 w-4 rounded bg-[#00E5E5]/20" />
                        <div className="mt-1.5 h-1 w-full rounded-full bg-white/10" />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dimension label — step 3 only */}
            <AnimatePresence>
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-md bg-[#00E5E5] px-2 py-0.5 font-mono text-[9px] font-semibold text-black"
                >
                  1140 × 320 — Hero Section
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2">
        <MiniStat label="Width" value="1140px" />
        <MiniStat label="Radius" value="16px" />
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111318] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full border border-white/10 bg-[#0B0C10]" />
          <div className="h-6 w-6 rounded-full border border-white/10 bg-[#00E5E5]" />
          <div className="h-6 w-6 rounded-full border border-white/10 bg-white" />
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-white/50">
          <CheckCircle2 size={13} className="text-[#00E5E5]" />
          12 synced
        </span>
      </div>
    </motion.div>
  );
}

function MobileSecurityScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35 }}
      className="space-y-3.5"
    >
      <div className="relative flex h-56 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0D0E12]">
        <div className="absolute left-4 top-4 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5E5] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00E5E5]" />
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Live</span>
        </div>

        {/* Activity rings — Network / Data / Access, scaled for mobile */}
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative flex h-36 w-36 items-center justify-center"
        >
          <svg width="144" height="144" viewBox="0 0 224 224" className="-rotate-90">
            {/* Network ring */}
            <circle cx="112" cy="112" r="96" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
            <motion.circle
              cx="112" cy="112" r="96" fill="none" stroke="#00E5E5" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={603}
              initial={{ strokeDashoffset: 603 }}
              animate={{ strokeDashoffset: 603 * (1 - 0.84) }}
              transition={{ duration: 2.2, delay: 0.1, ease: "easeOut" }}
            />
            {/* Data ring */}
            <circle cx="112" cy="112" r="74" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
            <motion.circle
              cx="112" cy="112" r="74" fill="none" stroke="#5dca6b" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={465}
              initial={{ strokeDashoffset: 465 }}
              animate={{ strokeDashoffset: 465 * (1 - 0.89) }}
              transition={{ duration: 1.9, delay: 0.25, ease: "easeOut" }}
            />
            {/* Access ring */}
            <circle cx="112" cy="112" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
            <motion.circle
              cx="112" cy="112" r="52" fill="none" stroke="#f2ef23" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={327}
              initial={{ strokeDashoffset: 327 }}
              animate={{ strokeDashoffset: 327 * (1 - 0.95) }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            />
          </svg>

          <div className="absolute rounded-full bg-[#111318] p-3.5 shadow-[0_0_24px_rgba(0,229,229,0.15)]">
            <Shield size={30} className="text-[#00E5E5]" />
          </div>
        </motion.div>

        {/* Ring legend */}
        <div className="mt-3 flex items-center gap-2 text-[8px]">
          <span className="flex items-center gap-1 text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00E5E5]" /> Network 84%
          </span>
          <span className="flex items-center gap-1 text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5DCAA5]" /> Data 89%
          </span>
          <span className="flex items-center gap-1 text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F2A623]" /> Access 95%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <MiniStat label="Uptime" value="99.9%" />
        <MiniStat label="Threats" value="0" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111318] p-3.5">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
          Scan queue
        </p>
        <div className="space-y-2">
          {securityScanQueue.map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center justify-between text-[10px]"
            >
              <span className="text-white/70">{label}</span>
              <CheckCircle2 size={13} className="text-[#00E5E5]" />
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        animate={{ boxShadow: ["0 0 0px rgba(0,229,229,0)", "0 0 18px rgba(0,229,229,0.15)", "0 0 0px rgba(0,229,229,0)"] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="rounded-2xl border border-[#00E5E5]/20 bg-[#00E5E5]/5 p-4"
      >
        <p className="text-[13px] font-sm text-white/70">Security Score</p>
        <h2 className="mt-1 text-xl font-black text-white">99.9%</h2>
      </motion.div>
    </motion.div>
  );
}