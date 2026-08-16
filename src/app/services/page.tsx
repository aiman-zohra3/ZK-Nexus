"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Code2, Palette, ShieldCheck, ArrowRight, Quote, Cloud } from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiDocker,
  SiSupabase,
  SiPostgresql,
  SiNodedotjs,
  SiFigma,
  SiOwasp,
} from "react-icons/si";
import { span } from "framer-motion/client";

// ======================================================
// TECHNOLOGY MARQUEE
// Each tech carries its own original brand color, used only on hover.
// Next.js and OWASP ship a pure black mark in simple-icons, which is
// invisible on this black background, so those two use white instead —
// every other color below is the real brand color.
// ======================================================

const technologies = [
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "AWS", icon: Cloud, color: "#FF9900" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  { name: "OWASP", icon: SiOwasp, color: "#FFFFFF" },
];

// ======================================================
// SERVICE DATA
// ======================================================

const websiteDevelopment = {
  number: "01",
  icon: Code2,
  title: "Website Development",
  image: "/webdev.jpg",
  description:
    "We design and develop premium websites and web applications that are fast, scalable, SEO-friendly, and built to help your business grow online.",
  signature: "If it loads slow, it's already lost the visitor.",
  stat: { value: "3.2s", label: "Avg. load time we ship at" },
  benefits: [
    "Lightning Fast Performance",
    "SEO Friendly Architecture",
    "Responsive Design",
    "CMS Integration",
    "Cloud Deployment",
    "Conversion Focused UI",
  ],
  process: [
    { step: "01", title: "Discovery", description: "Understanding your business goals and project requirements." },
    { step: "02", title: "Strategy", description: "Planning the architecture and user experience of your product." },
    { step: "03", title: "Development", description: "Building scalable and modern digital experiences." },
    { step: "04", title: "Launch", description: "Testing, deployment, and post-launch optimisation." },
  ],
  deliverables: ["Custom Website", "CMS Integration", "SEO Optimisation", "Cloud Deployment"],
};

const uiUxDesign = {
  number: "02",
  icon: Palette,
  title: "UI / UX Design",
  image: "/uiux.jpg",
  description:
    "We create modern, intuitive, and conversion-focused user experiences that delight users and elevate your brand.",
  signature: "Good design is the interface people forget they're using.",
  stat: { value: "95%", label: "Usability test satisfaction" },
  benefits: [
    "User Centred Design",
    "Interactive Prototypes",
    "Responsive Interfaces",
    "Design Systems",
    "Developer Handoff",
    "Improved User Experience",
  ],
  process: [
    { step: "01", title: "Research", description: "Understanding your users and business objectives." },
    { step: "02", title: "Wireframing", description: "Planning user flows and digital experiences." },
    { step: "03", title: "Design", description: "Creating premium and high fidelity interfaces." },
    { step: "04", title: "Handoff", description: "Delivering developer-ready design files." },
  ],
  deliverables: ["Figma Files", "Wireframes", "Interactive Prototypes", "Design Systems"],
};

const cyberSecurity = {
  number: "03",
  icon: ShieldCheck,
  title: "Cyber Security",
  image: "/cybersecurity.jpg",
  description:
    "Security is integrated into everything we build. We help businesses identify vulnerabilities and strengthen their digital infrastructure.",
  signature: "Security bolted on later is security that fails first.",
  stat: { value: "0", label: "Critical vulns left unresolved" },
  benefits: [
    "Vulnerability Assessment",
    "Penetration Testing",
    "API Security Testing",
    "Cloud Security",
    "Risk Mitigation",
    "Security Consulting",
  ],
  process: [
    { step: "01", title: "Audit", description: "Identify vulnerabilities and security gaps." },
    { step: "02", title: "Assessment", description: "Perform comprehensive security testing." },
    { step: "03", title: "Secure", description: "Implement security improvements and best practices." },
    { step: "04", title: "Reporting", description: "Deliver detailed reports and recommendations." },
  ],
  deliverables: ["Security Audit", "Pen Testing Report", "OWASP Assessment", "Cloud Review"],
};

const services = [websiteDevelopment, uiUxDesign, cyberSecurity];

// ======================================================
// SHARED CARD SHELL
// ======================================================

function Card({
  className = "",
  children,
  glow = false,
}: {
  className?: string;
  children: React.ReactNode;
  glow?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-white/20 ${
        glow ? "hover:shadow-[0_0_40px_-12px_rgba(0,229,229,0.35)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ======================================================
// SERVICES PAGE
// ======================================================

export default function ServicesPage() {
  const [marqueePaused, setMarqueePaused] = useState(false);

  return (
    <main className="overflow-hidden bg-black text-white">
      {/* ====================================================== */}
      {/* HERO SECTION */}
      {/* ====================================================== */}

      <section className="relative flex items-center justify-center overflow-hidden px-6 py-28 md:py-32">
  <div className="absolute inset-x-0 top-0 h-[300px] sm:h-[450px] bg-[radial-gradient(circle_at_center,_rgba(0,229,229,0.18)_0%,_rgba(0,229,229,0.08)_35%,_transparent_75%)] blur-3xl" />

  <div className="relative mx-auto flex  max-w-7xl flex-col items-center justify-center px-6 text-center">
   <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 sm:px-4"
  >
    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00E5E5] sm:text-xs">
    Services
    </span>
  </motion.div>

    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="mt-6 max-w-4xl font-black uppercase leading-[1.05] text-white sm:mt-8 sm:leading-[0.95]"
    style={{ fontSize: "clamp(2rem, 6vw + 0.5rem, 3.75rem)" }}>
          Digital products
          <br />
          built to <span className="text-[#00E5E5]">perform</span>.
        </h1>
      </motion.div>
    </div>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="mt-8 max-w-2xl text-base md:text-lg leading-7 md:leading-8 text-[#8B93A3] px-2"
    >
      We design premium digital experiences, build scalable web
      applications, and secure everything we create.
    </motion.p>

    <Link
      href="/contact"
      className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#00E5E5] px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-6px_rgba(0,229,229,0.6)]"
    >
      Start Your Project
      <ArrowRight size={16} />
    </Link>
  </div>
</section>

      {/* ====================================================== */}
      {/* TECHNOLOGIES MARQUEE                                    */}
      {/* Default: icons are cyan/70. On hover: track pauses,     */}
      {/* the hovered icon zooms and switches to its true brand   */}
      {/* color (via CSS var + group-hover, so it's pure CSS —    */}
      {/* no per-icon JS state needed). Vertical padding on both  */}
      {/* the clipping wrapper and the track prevents the scaled  */}
      {/* icon from being cut off top/bottom.                     */}
      {/* ====================================================== */}

      <style>{`
        @keyframes zk-marquee {
          from { transform: translateX(0%); }
          to { transform: translateX(-33.3333%); }
        }
      `}</style>
      <section className="border-y border-white/10 py-0 ">
        <div className="overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div
            className="flex w-max items-center gap-8 py-2"
            style={{
              animation: "zk-marquee 26s linear infinite",
              animationPlayState: marqueePaused ? "paused" : "running",
            }}
          >
            {[...technologies, ...technologies, ...technologies].map((tech, index) => {
              const TechIcon = tech.icon;
              return (
                <div key={index} className="flex items-center gap-8">
                  <div
                    className="group/icon flex items-center py-2"
                    style={{ ["--tech-color" as string]: tech.color }}
                    onMouseEnter={() => setMarqueePaused(true)}
                    onMouseLeave={() => setMarqueePaused(false)}
                  >
                    <TechIcon
                      size={28}
                      aria-label={tech.name}
                      className="cursor-default text-gray-500 transition-all duration-300 group-hover/icon:scale-125 group-hover/icon:text-[var(--tech-color)] group-hover/icon:opacity-100"
                    />
                  </div>
                  <span className="text-white/25">•</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SERVICES — BENTO GRID */}
      {/* ====================================================== */}

      {services.map((service, index) => {
        const Icon = service.icon;
        const reversed = index % 2 === 1;
        const sectionId =
          service.number === "01"
            ? "website-development"
            : service.number === "02"
            ? "ui-ux-design"
            : "cyber-security";

        return (
          <section
            key={service.number}
            id={sectionId}
            className="relative border-t border-white/10 py-16 md:pt-24 md:pb-18"
          >
            <div className="mx-auto max-w-7xl px-6">
              {/* Section label */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6 }}
                className="mb-10 flex items-center gap-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00E5E5]/30 bg-[#00E5E5]/5 text-[#728181]">
                  <Icon size={16} />
                </span>
                <p className="font-mono text-xs font-medium tracking-[0.3em] text-[#00E5E5]/80">
                  {service.number} / {service.title}
                </p>
              </motion.div>

              <div
                className={`grid grid-cols-1 gap-5 lg:grid-cols-4 lg:auto-rows-[130px] lg:grid-flow-row-dense ${
                  reversed ? "lg:[direction:rtl]" : ""
                }`}
              >
                <div className={reversed ? "contents [direction:ltr]" : "contents"}>
                  {/* IMAGE — tall feature card with floating glass chip */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                    className="lg:col-span-2 lg:row-span-3"
                  >
                    <Card className="relative h-[320px] lg:h-full" glow>
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md">
                        <span className="text-sm font-semibold text-white">{service.title}</span>
                        <span className="font-mono text-[10px] tracking-[0.25em] text-[#00E5E5]">
                          {service.number}
                        </span>
                      </div>
                    </Card>
                  </motion.div>

                  {/* SUMMARY — paragraph */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.05 }}
                    className="lg:col-span-2 lg:row-span-1"
                  >
                    <Card className="flex h-full flex-col justify-center px-7 py-6">
                      <h2 className="text-[clamp(1.4rem,2.2vw,1.9rem)] font-black leading-tight text-white">
                        {service.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        {service.description}
                      </p>
                    </Card>
                  </motion.div>

                  {/* PULL-QUOTE — signature line */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="lg:col-span-1 lg:row-span-1"
                  >
                    <Card className="flex h-full flex-col justify-between p-6">
                      <Quote size={18} className="text-[#00E5E5]/50" />
                      <p className="mt-3 text-[15px] font-medium leading-snug text-white/85">
                        {service.signature}
                      </p>
                    </Card>
                  </motion.div>

                  {/* STAT */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="lg:col-span-1 lg:row-span-1"
                  >
                    <Card className="flex h-full flex-col justify-center p-6">
                      <span className="text-3xl font-black text-[#00E5E5]">{service.stat.value}</span>
                      <span className="mt-1 text-xs leading-snug text-white/50">{service.stat.label}</span>
                    </Card>
                  </motion.div>

                  {/* BENEFITS — checklist */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="lg:col-span-2 lg:row-span-2"
                  >
                    <Card className="flex h-full flex-col p-6">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                        Key Benefits
                      </h3>
                      <div className="mt-4 grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {service.benefits.map((benefit) => (
                          <div
                            key={benefit}
                            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-[13px] text-white/80"
                          >
                            <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#00E5E5]/15 text-[#00E5E5]">
                              <Check size={11} strokeWidth={3} />
                            </span>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  {/* PROCESS — compact horizontal strip */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="lg:col-span-2 lg:row-span-3"
                  >
                    <Card className="flex flex-col p-6">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                        Process
                      </h3>
                      <div className="mt-4 flex flex-1 flex-col justify-between gap-3">
                        {service.process.map((item) => (
                          <div key={item.step} className="flex items-start gap-3">
                            <span className="mt-0.5 font-mono text-[10px] tracking-[0.2em] text-[#00E5E5]/70">
                              {item.step}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-white">{item.title}</p>
                              <p className="text-xs leading-relaxed text-white/50">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  {/* DELIVERABLES — tag row */}
                 <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.7, delay: 0.1 }}
  className="lg:col-span-2 lg:row-span-1"
>
  <Card className="gap-6 p-4">
  <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
    Deliverables
  </h3>
  <div className="mt-3 grid grid-cols-2 gap-2 md:flex  md:items-center md:gap-8">
    {service.deliverables.map((item) => (
      
      <span
        key={item}
        className="rounded-2xl border text-center border-[#00E5E5]/25 px-2 md:px-2.5 py-1 text-[10px] md:text-[12px] font-medium text-white/80"
      >
        {item}
      </span>
    ))}
  </div>
</Card>
</motion.div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}