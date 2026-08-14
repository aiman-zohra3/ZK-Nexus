"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Search,
  Lightbulb,
  Palette,
  Code2,
  ShieldCheck,
  Rocket,
  type LucideIcon,
} from "lucide-react";

// ======================================================
// WORKFLOW DATA
// ======================================================

const workflowSteps = [
  {
    id: "01",
    title: "Discovery",
    subtitle: "Understand the business",
    description:
      "We start by understanding your goals, audience, competitors, and technical requirements to create a clear project roadmap.",
    icon: Search,
    deliverables: [
      "Business Goals",
      "Requirements",
      "Competitor Analysis",
      "Project Roadmap",
    ],
  },
  {
    id: "02",
    title: "Strategy",
    subtitle: "Plan the solution",
    description:
      "We define the technology stack, architecture, timeline, and milestones before development begins.",
    icon: Lightbulb,
    deliverables: ["Tech Stack", "Architecture", "Timeline", "Wireframes"],
  },
  {
    id: "03",
    title: "Design",
    subtitle: "Craft the experience",
    description:
      "Beautiful interfaces designed for usability, accessibility, and conversions across every device.",
    icon: Palette,
    deliverables: [
      "UI Design",
      "Design System",
      "Prototype",
      "Responsive Layout",
    ],
  },
  {
    id: "04",
    title: "Development",
    subtitle: "Build the product",
    description:
      "Clean, scalable frontend and backend development with reusable components and modern architecture.",
    icon: Code2,
    deliverables: ["Frontend", "Backend", "API Integration", "Database"],
  },
  {
    id: "05",
    title: "Testing",
    subtitle: "Ensure quality",
    description:
      "Every feature is tested for speed, responsiveness, stability, and security before launch.",
    icon: ShieldCheck,
    deliverables: ["QA Testing", "Security Audit", "Performance", "Bug Fixes"],
  },
  {
    id: "06",
    title: "Launch",
    subtitle: "Deploy & support",
    description:
      "Deployment, monitoring, optimization, and continuous support to keep your product performing.",
    icon: Rocket,
    deliverables: ["Deployment", "Monitoring", "Maintenance", "Updates"],
  },
];

// ======================================================
// ANIMATION VARIANTS (mobile)
// ======================================================

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// ======================================================
// DESKTOP TIMELINE STEP — highlight state driven by scroll
// ======================================================

type WorkflowStep = (typeof workflowSteps)[number];

function TimelineStep({
  step,
  index,
  total,
  isLeft,
  scrollYProgress,
  nodeRef,
}: {
  step: WorkflowStep;
  index: number;
  total: number;
  isLeft: boolean;
  scrollYProgress: MotionValue<number>;
  nodeRef?: React.Ref<HTMLDivElement>;
}) {
  const Icon: LucideIcon = step.icon;

  // Line reaches this node's vertical position at roughly index/total.
  const threshold = index / total;
  const rangeStart = Math.max(threshold - 0.02, 0);

  const cardOpacity = useTransform(
    scrollYProgress,
    [rangeStart, threshold],
    [0.35, 1]
  );
  const cardBorder = useTransform(
    scrollYProgress,
    [rangeStart, threshold],
    ["rgba(255,255,255,0.08)", "rgba(0,229,229,0.4)"]
  );
  const nodeBorder = useTransform(
    scrollYProgress,
    [rangeStart, threshold],
    ["rgba(255,255,255,0.12)", "#00E5E5"]
  );
  const nodeIconColor = useTransform(
    scrollYProgress,
    [rangeStart, threshold],
    ["#6B7280", "#00E5E5"]
  );
  const nodeGlow = useTransform(
    scrollYProgress,
    [rangeStart, threshold],
    ["0 0 0px rgba(0,229,229,0)", "0 0 28px rgba(0,229,229,0.35)"]
  );
  const idColor = useTransform(
    scrollYProgress,
    [rangeStart, threshold],
    ["#6B7280", "#00E5E5"]
  );

  const card = (
    <motion.div
      style={{ opacity: cardOpacity, borderColor: cardBorder }}
      whileHover={{ y: -4 }}
      className={`w-full max-w-[380px] rounded-2xl border bg-white/[0.03] p-4 backdrop-blur-xl transition-colors duration-300 ${
        isLeft ? "text-right" : ""
      }`}
    >
      <motion.span
        style={{ color: idColor }}
        className="text-[10px] font-bold tracking-[0.3em]"
      >
        {step.id}
      </motion.span>

      <h3 className="mt-1.5 text-lg font-bold text-white">{step.title}</h3>

      <p className="mt-0.5 text-xs font-medium text-[#00E5E5]">
        {step.subtitle}
      </p>

      <p className="mt-2.5 text-xs leading-5 text-gray-400">
        {step.description}
      </p>

      <div className="mt-3.5 grid grid-cols-2 gap-1.5">
        {step.deliverables.map((item) => (
          <span
            key={item}
            className="truncate rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-center text-[10px] font-medium text-gray-300"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="relative grid grid-cols-2 items-center gap-x-10 py-2">
      {/* Center Node */}
      <motion.div
        ref={nodeRef}
        style={{
          borderColor: nodeBorder,
          boxShadow: nodeGlow,
        }}
        className="absolute left-1/2 top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-[#111318]"
      >
        <motion.div style={{ color: nodeIconColor }}>
          <Icon className="h-5 w-5" />
        </motion.div>
      </motion.div>

      {/* Left slot */}
      <div className={isLeft ? "flex justify-end pr-10 " : ""}>
        {isLeft && card}
      </div>

      {/* Right slot */}
      <div className={!isLeft ? "flex justify-start pl-10 " : ""}>
        {!isLeft && card}
      </div>
    </div>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const firstNodeRef = useRef<HTMLDivElement>(null);
  const lastNodeRef = useRef<HTMLDivElement>(null);

  // Line should start at the first icon's center and end at the last
  // icon's center — measure those positions instead of spanning 0–100%.
  const [lineInset, setLineInset] = useState({ top: 1, bottom: 0 });

  useLayoutEffect(() => {
    function updateInset() {
      if (!timelineRef.current || !firstNodeRef.current || !lastNodeRef.current)
        return;

      const containerRect = timelineRef.current.getBoundingClientRect();
      const firstRect = firstNodeRef.current.getBoundingClientRect();
      const lastRect = lastNodeRef.current.getBoundingClientRect();

      const top = firstRect.top + firstRect.height / 2 - containerRect.top;
      const bottom =
        containerRect.bottom - (lastRect.top + lastRect.height / 2);

      setLineInset({ top, bottom });
    }

    updateInset();
    window.addEventListener("resize", updateInset);
    return () => window.removeEventListener("resize", updateInset);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 20%", "end 70%"],
  });

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      id="workflow"
      className="relative overflow-hidden bg-[#0B0C10] px-6 py-12 md:py-16"
    >
      {/* Background Glow */}
      <div className="hidden md:blockabsolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#00E5E5]/10 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-[#635BFF]/10 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5"
        >
          
          <span className="font-mono text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#00E5E5]">
           Workflow
          </span>
        </motion.div>

          <h2 className="mt-5 text-3xl font-black text-white md:text-5xl">
            FROM IDEA TO LAUNCH
          </h2>

          <p className="mt-6 text-xs md:text-sm leading-6 md:leading-8 text-gray-400">
            Every project follows a structured process designed to deliver
            beautiful, scalable, and secure digital products.
          </p>
        </motion.div>

        {/* Desktop Timeline — centered line, alternating, scroll-highlighted */}
        <div ref={timelineRef} className="relative mt-16 hidden lg:block">
          {/* Base Line — inset to run icon-center to icon-center */}
          <div
            style={{ top: lineInset.top, bottom: lineInset.bottom }}
            className="absolute left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-white/10"
          />

          {/* Animated Line — same inset, fills 0–100% within that range */}
          <div
            style={{ top: lineInset.top, bottom: lineInset.bottom }}
            className="absolute left-1/2 w-[2px] -translate-x-1/2 overflow-hidden rounded-full"
          >
            <motion.div
              style={{ height: progressHeight }}
              className="w-full bg-[#00E5E5] shadow-[0_0_12px_rgba(0,229,229,0.6)]"
            />
          </div>

          <div>
            {workflowSteps.map((step, index) => (
              <TimelineStep
                key={step.id}
                step={step}
                index={index}
                total={workflowSteps.length}
                isLeft={index % 2 === 0}
                scrollYProgress={scrollYProgress}
                nodeRef={
                  index === 0
                    ? firstNodeRef
                    : index === workflowSteps.length - 1
                    ? lastNodeRef
                    : undefined
                }
              />
            ))}
          </div>
        </div>

        {/* Mobile Timeline — unchanged, left-aligned */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative mt-10 md:mt-20 space-y-8 lg:hidden"
        >
          {/* Vertical Line */}
          <div className="absolute left-5 top-10 h-full w-[2px] rounded-full bg-white/10" />

          <motion.div
            style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
            className="absolute left-5 top-0 h-full w-[2px] rounded-full bg-[#00E5E5]"
          />

          {workflowSteps.map((step) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="relative flex gap-6"
              >
                {/* Node */}
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#00E5E5]/40 bg-[#111318] shadow-[0_0_25px_rgba(0,229,229,0.25)]">
                  <Icon className="h-5 w-5 text-[#00E5E5]" />
                </div>

                {/* Card */}
                <div className="flex-1  rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#00E5E5]/40 hover:bg-white/[0.05] hover:-translate-y-1">
                  <span className="text-xs font-bold tracking-[0.35em] text-[#00E5E5]">
                    {step.id}
                  </span>

                  <h3 className="mt-1 md:mt-3 text-xl md:text-5xl font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-1 md:mt-4 text-xs md:text-md font-medium text-[#00E5E5]">
                    {step.subtitle}. 
                  </p>

                  <p className="hidden md:block mt-4 text-md leading-7 text-gray-400">
                    {step.description}
                  </p>

                  <div className="mt-3 md:mt-6 grid grid-cols-2 gap-3">
                    {step.deliverables.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-full border border-white/10 px-2 md:px-3 py-1 md:py-2"
                      >
                        <div className="h-1 md:h-2 w-1 md:w-2 rounded-full bg-[#00E5E5]" />
                        <span className="text-[11px] md:text-sm text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}