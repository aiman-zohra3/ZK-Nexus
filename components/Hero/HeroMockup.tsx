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

const browserScale = useTransform(scrollYProgress, [0, 0.9], [1, 0.9]);
const browserOpacity = useTransform(scrollYProgress, [0.85, 0.9], [1, 0]);
const browserY = useTransform(scrollYProgress, [0, 1], [0, -120]);
const mobileOpacity = useTransform(scrollYProgress, [0.15, 0.95], [0, 1]);
const mobileScale = useTransform(scrollYProgress, [0.15, 0.75], [0.8, 1]);
const mobileY = useTransform(scrollYProgress, [0, 0.75], [120, 0]);

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
<div className="relative lg:flex w-full max-w-7xl mx-auto lg:flex-1 lg:items-start lg:justify-center gap-8 overflow-hidden px-6 pt-1 pb-1 md:px-10 sm:px-12 lg:px-16 xl:px-24 lg:pb-0">          {/* LEFT CONTENT */}

<div className="w-full max-w-sm md:max-w-xl lg:max-w-3xl">    <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-0 px-3 lg:px-5 py-1.5"
        >
          
          <span className="font-mono text-[8.5px] md:text-xs tracking-[0.2em] text-[#00E5E5]">
            Delivering Excellence in Software Development
          </span>
        </motion.div>

        <h1 className="text-4xl font-black leading-[0.95] lg:text-7xl whitespace-nowrap md:whitespace-normal">
  <span className="mt-5 md:mt-7 mr-3 inline-block text-white">Build</span>

  <span className="relative inline-flex h-[1.05em] min-w-[140px] sm:min-w-[180px] md:min-w-[220px] lg:min-w-[300px] items-baseline overflow-hidden align-baseline">
    <AnimatePresence mode="wait">
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

          <div className="w-full w-[480px] xl:w-[600px] flex items-end justify-center">
  <Left/>
</div>
        </div>
      </motion.div>
    </section>
  );
}