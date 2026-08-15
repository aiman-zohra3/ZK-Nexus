"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { HeartPulse, Users, ShieldCheck, Building2, Check, ArrowRight, Zap } from "lucide-react";
import Browser1 from "./Browser1";
import Left from "./Left1";

import Link from "next/link";

/* ─────────────────────────────────────────────
   ZK PROOF NODE GRAPH
───────────────────────────────────────────── */

const NODE_DATA = [
  {
    label: "Cyber Security",
    Icon: ShieldCheck,
    x: 300,
    y: 60,
    color: "#00E5E5",
    stat: "0 Threats",
    statLabel: "Detected",
    description: "Continuous monitoring and ZK-proof access control.",
  },
  {
    label: "Healthcare Systems",
    Icon: HeartPulse,
    x: 310,
    y: 290,
    color: "#635BFF",
    stat: "HIPAA",
    statLabel: "Compliant",
    description: "Patient data platforms with end-to-end encryption.",
  },
  {
    label: "SaaS Platforms",
    Icon: Building2,
    x: 72,
    y: 290,
    color: "#00E5E5",
    stat: "99.9%",
    statLabel: "Uptime SLA",
    description: "Cloud-native builds engineered for scale.",
  },
  {
    label: "CRM Systems",
    Icon: Users,
    x: 62,
    y: 60,
    color: "#635BFF",
    stat: "2× faster",
    statLabel: "Sales Cycle",
    description: "Custom CRM tools that close deals faster.",
  },
];

const HUB = { x: 186, y: 176 };

function ServiceNodeGraph({ active }: { active: number }) {
  const activeNode = NODE_DATA[active];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Graph canvas */}
      <div className="relative" style={{ width: 380, height: 370 }}>

        {/* SVG layer: lines + data packets */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={420}
          height={400}
          viewBox="0 0 380 370"
        >
          <defs>
            {NODE_DATA.map((n, i) => (
              <linearGradient
                key={i}
                id={`line-grad-${i}`}
                x1={n.x}
                y1={n.y}
                x2={HUB.x}
                y2={HUB.y}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={n.color} stopOpacity="0.15" />
                <stop offset="50%" stopColor={n.color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0.15" />
              </linearGradient>
            ))}
            {NODE_DATA.map((n, i) => (
              <path
                key={i}
                id={`pkt-path-${i}`}
                d={`M ${n.x} ${n.y} L ${HUB.x} ${HUB.y}`}
                fill="none"
              />
            ))}
          </defs>

          {/* Connection lines */}
          {NODE_DATA.map((n, i) => (
            <line
              key={i}
              x1={n.x}
              y1={n.y}
              x2={HUB.x}
              y2={HUB.y}
              stroke={`url(#line-grad-${i})`}
              strokeWidth={i === active ? 1.5 : 1}
              strokeDasharray={i === active ? "none" : "4 6"}
              opacity={i === active ? 1 : 0.4}
            />
          ))}

          {/* Animated data packets — dots flowing from each node to hub */}
          {NODE_DATA.map((n, i) => (
            <circle
              key={i}
              r={i === active ? 4 : 2.5}
              fill={n.color}
              opacity={i === active ? 1 : 0.5}
              style={{ filter: `drop-shadow(0 0 ${i === active ? 6 : 3}px ${n.color})` }}
            >
              <animateMotion
                dur={i === active ? "1.4s" : "2.8s"}
                repeatCount="indefinite"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              >
                <mpath href={`#pkt-path-${i}`} />
              </animateMotion>
            </circle>
          ))}

          {/* Second offset packet on active line for density */}
          <circle
            r={2}
            fill={activeNode.color}
            opacity={0.6}
            style={{ filter: `drop-shadow(0 0 4px ${activeNode.color})` }}
          >
            <animateMotion
              dur="1.4s"
              repeatCount="indefinite"
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
              begin="0.7s"
            >
              <mpath href={`#pkt-path-${active}`} />
            </animateMotion>
          </circle>
        </svg>

        {/* Service nodes */}
        {NODE_DATA.map((n, i) => {
          const Icon = n.Icon;
          const isActive = i === active;
          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{
                left: n.x,
                top: n.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Outer pulse ring on active */}
              {isActive && (
                <motion.div
                  className="absolute rounded-full border"
                  style={{ borderColor: n.color, width: 72, height: 72 }}
                  animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              {/* Node circle */}
              <motion.div
                animate={{
                  boxShadow: isActive
                    ? [`0 0 0px ${n.color}00`, `0 0 22px ${n.color}99`, `0 0 0px ${n.color}00`]
                    : `0 0 8px ${n.color}33`,
                }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex items-center justify-center rounded-full border"
                style={{
                  width: 48,
                  height: 48,
                  background: isActive ? `${n.color}18` : "rgba(17,19,24,0.9)",
                  borderColor: isActive ? n.color : `${n.color}44`,
                }}
              >
                <Icon
                  size={20}
                  style={{ color: isActive ? n.color : `${n.color}99` }}
                />
              </motion.div>

              {/* Label */}
              <span
                className="mt-1.5 font-mono text-[10px] tracking-wider text-center leading-tight max-w-[80px]"
                style={{ color: isActive ? n.color : "rgba(255,255,255,0.35)" }}
              >
                {n.label.toUpperCase()}
              </span>
            </div>
          );
        })}

        {/* Central hub */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            left: HUB.x,
            top: HUB.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute rounded-full"
            style={{ width: 96, height: 96, background: "radial-gradient(circle, rgba(0,229,229,0.3) 0%, transparent 70%)" }}
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full border border-[#00E5E5]/20"
            style={{ width: 80, height: 80 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Hub body */}
          <div
            className="relative z-10 flex flex-col items-center justify-center rounded-full border border-[#00E5E5]/50"
            style={{
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, rgba(0,229,229,0.12) 0%, rgba(99,91,255,0.12) 100%)",
              boxShadow: "0 0 30px rgba(0,229,229,0.2), inset 0 0 20px rgba(0,229,229,0.05)",
            }}
          >
            <Zap size={22} className="text-[#00E5E5]" />
          </div>

          <span className="mt-1.5 font-mono text-[10px] tracking-[0.15em] text-[#00E5E5]/70">
            ZK NEXUS
          </span>
        </div>
      </div>

      {/* Active service info card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-[340px] rounded-2xl border px-6 py-4"
          style={{
            background: `linear-gradient(135deg, ${activeNode.color}0a 0%, rgba(17,19,24,0.9) 60%)`,
            borderColor: `${activeNode.color}30`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: `${activeNode.color}18` }}
              >
                <activeNode.Icon size={14} style={{ color: activeNode.color }} />
              </span>
              <span className="font-semibold text-white text-sm">{activeNode.label}</span>
            </div>
            <div className="text-right">
              <p className="font-black text-white text-lg leading-none">{activeNode.stat}</p>
              <p className="font-mono text-[10px] tracking-wider mt-0.5" style={{ color: activeNode.color }}>
                {activeNode.statLabel.toUpperCase()}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-white/50">{activeNode.description}</p>

          {/* Mini live indicator */}
          <div className="mt-3 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ background: activeNode.color }}
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ background: activeNode.color }}
              />
            </span>
            <span className="font-mono text-[10px] tracking-widest text-white/30">LIVE · ACTIVE</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


export default function HeroMockup() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const words = ["Faster", "Smarter", "Modern"];

  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end end"],
  });

  const browserScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.9]);
  const browserOpacity = useTransform(scrollYProgress, [0.65, 0.7], [1, 0]);
  const browserY = useTransform(scrollYProgress, [0, 0.7], [0, -120]);
  const mobileOpacity = useTransform(scrollYProgress, [0.15, 0.75], [0, 1]);
  const mobileScale = useTransform(scrollYProgress, [0.15, 0.75], [0.8, 1]);
  const mobileY = useTransform(scrollYProgress, [0.45, 0.75], [120, 0]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((prev) => (prev + 1) % NODE_DATA.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-full overflow-hidden bg-[#0B0C10]">
      {/* Browser Window */}

      <motion.div style={{ scale: browserScale, opacity: browserOpacity, y: browserY }} className="relative z-10">
        <Browser1 />
      </motion.div>

      {/* Final Hero Section */}

      <motion.div style={{ opacity: mobileOpacity, scale: mobileScale, y: mobileY }} className="relative z-1 mt-0">
<div className="relative lg:flex w-full lg:flex-1 lg:items-start lg:justify-center gap-8 overflow-hidden px-6 pt-1 pb-1 md:px-10 sm:px-12 lg:px-16 xl:px-24 lg:pb-0">
          {/* LEFT CONTENT */}

<div className="w-full max-w-sm md:max-w-xl lg:max-w-3xl">s    <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-0 px-3 lg:px-5 py-1.5"
        >
          
          <span className="font-mono text-[8px] md:text-xs tracking-[0.2em] text-[#00E5E5]">
            Delivering Excellence in Software Development
          </span>
        </motion.div>

<h1 className="text-4xl font-black leading-[0.95] lg:text-7xl">
                <span className="mt-10 mr-3 inline-block text-white">Build</span>

<span className="relative inline-flex h-[1.05em] min-w-[160px] sm:min-w-[220px] md:min-w-[320px] lg:min-w-[420px] items-baseline overflow-hidden align-baseline">                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWord}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -60, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="inline-block"
                    style={{ WebkitTextStroke: "1.5px #00E5E5", color: "transparent" }}
                  >
                    {words[currentWord]}.
                  </motion.span>
                </AnimatePresence>
              </span>

              <br />

              <span className="mt-2 block text-white">Stay Secure.</span>
            </h1>

            <p className="mt-4 md:mt-8 text-sm md:text-lg leading-6 md:leading-8 text-gray-400">
              We craft intelligent, scalable and secure digital products tailored for
              startups, <br/>enterprises and modern businesses.
            </p>

            {/* Two-column checklist instead of five stacked rows */}
            <div className="mt-4 md:mt-8 grid grid-cols-2 gap-x-6 gap-y-2 md:gap-y-4 text-gray-300">
              {NODE_DATA.map((node, i) => (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00E5E5]/15 text-[#00E5E5]">
                    <Check className="h-4 w-4 text-[#00E5E5]" strokeWidth={3} />
                  </span>
                  <p className="text-xs md:text-sm">{node.label}</p>
                </motion.div>
              ))}
            </div>

            <Link
  href="/contact"
  className="
    group mt-6 md:mt-10 -ml-0 inline-flex items-center gap-2
    rounded-full  border border-[#00E5E5] bg-[#00E5E5]/10 hover:bg-[#00E5E5]/80 hover:text-black
    px-4 md:px-5 py-2 font-semibold text-white
    shadow-lg shadow-cyan-400/20
    transition-all duration-300 text-sm md:text-md
    hover:-translate-y-1 hover:shadow-cyan-400/40
  "
>
  Let's Build Together
  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
</Link>
          </div>

          {/* RIGHT SIDE — ZK Proof Node Graph */}

          <div className=" w-[600px] flex items-center justify-center ">
            <Left/>
          </div>
        </div>
      </motion.div>
    </section>
  );
}