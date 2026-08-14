"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import { useRef } from "react";
import CTASection from "@/components/CTASection";

const values = [
  {
    title: "Security First",
    description: "Built secure from day one.",
    image: "/security.jfif",
  },
  {
    title: "Quality Driven",
    description: "Scalable experiences that last.",
    image: "/quality.jfif",
  },
  {
    title: "Transparency",
    description: "Clear timelines, full visibility.",
    image: "/transparency.jfif",
  },
  {
    title: "Long-Term Partnerships",
    description: "Growing with our clients.",
    image: "/partenership.jfif",
  },
];

const principles = [
  {
    number: "01",
    title: "Security First",
    description: "Secure architecture, built in from the start.",
  },
  {
    number: "02",
    title: "Transparency",
    description: "Honest timelines, full visibility.",
    highlighted: true,
  },
  {
    number: "03",
    title: "Quality",
    description: "Scalable systems, built to perform.",
  },
  {
    number: "04",
    title: "Partnership",
    description: "An extension of your team.",
  },
  {
    number: "05",
    title: "Continuous Innovation",
    description: "Always learning, always improving.",
  },
];

// ================= TEAM =================

const team = [
  {
    name: "Eesha Baig",
    role: "Founder & Full Stack Engineer",
    image: "/woman1.jfif",
    bio: "Leads product strategy, full stack development, and ensures every solution balances innovation, scalability, and security.",
  },
  {
    name: "Hassan Malik",
    role: "Cybersecurity Engineer",
    image: "/man1.jfif",
    bio: "Protects applications through penetration testing, secure architecture, vulnerability assessments, and cloud security.",
  },
  {
    name: "Ahmed Khan",
    role: "UI/UX Designer",
    image: "/man2.jfif",
    bio: "Designs intuitive user experiences and modern interfaces that help businesses stand out and convert visitors into customers.",
  },
  {
    name: "Aiman Zohra",
    role: "Project Manager",
    image: "/woman2.jfif",
    bio: "Coordinates teams, streamlines workflows, and ensures every project is delivered on time with complete transparency.",
  },
  {
    name: "Usman Tariq",
    role: "Backend & Cloud Engineer",
    image: "/man3.jfif",
    bio: "Builds scalable APIs, cloud infrastructure, and automation systems that power secure enterprise-grade applications.",
  },
];

const stats = [
  { value: 20, suffix: "+", title: "Projects Delivered" },
  { value: 10, suffix: "+", title: "Technologies Mastered" },
  { value: 100, suffix: "%", title: "Security Focused" },
  { value: 24, suffix: "/7", title: "Commitment To Quality" },
];

const storyTexts = [
  "Technology moves fast. Businesses need more than beautiful websites. They need secure and scalable solutions.",
  "Most agencies focus only on design or development. Very few build security into the process from day one.",
  "That's why ZK Nexus exists—to bridge the gap between innovation, performance, and cybersecurity.",
  "We build for what's next, not just what's now.",
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const SectionTag = (title: string) => (
    <div className="mb-6 sm:mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">
      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#00E5E5]">
        {title}
      </span>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-[#0B0C10] text-[#E2E8F0]">
  {/* Radial Cyan Glow */}
  <div className="absolute inset-x-0 top-0 h-[300px] sm:h-[450px] bg-[radial-gradient(circle_at_center,_rgba(0,229,229,0.18)_0%,_rgba(0,229,229,0.08)_35%,_transparent_75%)] blur-3xl" />

  <section className="relative mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 pt-32 pb-16 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5"
    >
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#00E5E5]">
        About ZK Nexus
      </span>
    </motion.div>

    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-[clamp(2.75rem,6vw,4.75rem)] font-black leading-[1.05] text-white">
          Building Secure
          <br /> Digital Experiences <br />
          That <span className="text-[#00E5E5]">Scale</span>.
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
      We design, develop, and secure modern digital products that
      empower businesses to innovate confidently and grow faster.
    </motion.p>
  </section>

      {/* ================= STORY ================= */}

      <section className="mx-auto max-w-7xl px-6 pt-1 pb-12">
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-2">
          <div className="lg:sticky lg:top-32 lg:h-fit">
            {SectionTag("Our Story")}
            <h2 className="text-3xl sm:text-4xl font-black leading-none md:text-6xl">
              Built For The <span className="text-[#00E5E5]">Future.</span>
            </h2>
          </div>

          <div className="relative h-[320px] sm:h-[400px] lg:h-[420px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            <motion.div
              animate={{ y: ["0%", "-50%"] }}
              transition={{ duration: 16, ease: "linear", repeat: Infinity }}
              className="flex flex-col gap-8 sm:gap-10"
            >
              {[...storyTexts, ...storyTexts].map((text, index) => (
                <p key={index} className="text-base sm:text-lg leading-7 text-[#bfc4cd]">
                  {text}
                </p>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= MISSION & VALUES ================= */}

      {/* ================= MISSION & VALUES ================= */}

<section className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:py-32">
  <div className="grid gap-12 lg:gap-20 lg:grid-cols-[3fr_4fr]">
    {/* LEFT SIDE */}
    <div className="flex flex-col max-w-3xl">
      <div className="max-w-xl">{SectionTag("Mission and Values")}</div>
      <h2 className="text-3xl sm:text-4xl font-black leading-none md:text-5xl">
        Secure.
        <br />
        Scalable.
        <br />
        <span className="text-[#00E5E5]">Transparent.</span>
      </h2>

      {/* Mission Card */}
      <motion.div
        whileHover={{ y: -8 }}
        className="relative mt-8 sm:mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
      >
        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00E5E5]/20 blur-[100px]" />
        {SectionTag("Our Mission")}
        <p className="text-sm sm:text-base leading-7 text-[#8B93A3]">
          Empowering businesses through secure and scalable technology
          solutions that drive measurable growth and long-term success.
        </p>
      </motion.div>
    </div>

    {/* RIGHT SIDE — static values grid */}
    <div className="grid grid-cols-2 gap-5 sm:gap-6 max-w-4xl">
      {values.map((value, index) => (
        <motion.div
          key={value.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group relative hidden md:block h-[220px] overflow-hidden rounded-3xl border border-white/10"
        >
          <Image
            src={value.image}
            alt={value.title}
            fill
            className="object-cover grayscale opacity-60 transition duration-500 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
            <h3 className="mb-1.5 text-lg sm:text-xl font-bold text-[#00E5E5]">
              {value.title}
            </h3>
            <p className="text-sm leading-6 text-[#c7cdd6]">
              {value.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* ================= ACHIEVEMENTS ================= */}

      <section ref={ref} className="w-full border-y border-white/10 bg-[#1a2930] py-4 md:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-4 gap-7 md:gap-12 px-6 lg:grid-cols-4">
          {stats.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h2 className="text-2xl font-black text-[#00E5E5] md:text-6xl">
                {isInView && <CountUp start={0} end={item.value} duration={2} />}
                {item.suffix}
              </h2>
              <p className="mt-3 text-[10px] sm:text-sm text-gray-300 md:text-base">
                {item.title}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= TEAM ================= */}

      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
        <div className="absolute left-1/2 top-0 h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] -translate-x-1/2 rounded-full bg-[#00E5E5]/10 blur-[180px]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center">
            {SectionTag("Our Team")}
            <h2 className="mt-6 text-4xl sm:text-5xl font-black md:text-7xl">
              Meet The
              <span className="text-[#00E5E5]"> Team</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-8 text-[#8B93A3] px-2">
              Designers, developers and security specialists working together to
              build fast, scalable and secure digital products for modern
              businesses.
            </p>
          </div>

          <div className="relative mt-16 sm:mt-24 lg:mt-28">
            <div className="grid gap-10 sm:gap-14 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.15 }}
                  whileHover={{ y: -12 }}
                  className="group relative text-center"
                >
                  <div className="relative mx-auto h-28 w-28 sm:h-40 sm:w-40 lg:h-48 lg:w-48">
                    <div className="absolute left-1/2 top-1/2 h-24 w-24 sm:h-36 sm:w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00E5E5]/20 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />
                    <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#00E5E5]/40 transition duration-500 group-hover:border-[#00E5E5]" />
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  </div>

                  <h3 className="mt-5 sm:mt-8 text-base sm:text-2xl font-bold transition duration-300 text-[#00E5E5]">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] italic">
                    {member.role}
                  </p>
                  <p className="mt-3 sm:mt-5 hidden sm:block text-sm leading-7 text-[#8B93A3]">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====WHAT WE STAND FOR======= */}

      <section className="px-6 pb-20 sm:pb-28 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-8 sm:mb-10 max-w-3xl text-3xl sm:text-5xl font-black leading-none md:text-5xl"
          >
            What We <span className="text-[#00E5E5]">Stand</span> For
          </motion.h2>

          <div className="overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {principles.map((item) => (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="min-h-[190px] sm:min-h-[220px] border border-white/10 bg-[#0B0C10] p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,229,0.15)] hover:bg-[#12484c]"
                >
                  <p className="mb-6 sm:mb-8 text-xs sm:text-sm tracking-[0.25em] text-[#8B93A3]">
                    {item.number}
                  </p>
                  <h3 className="mb-3 sm:mb-5 text-xl sm:text-3xl font-bold leading-tight">
                    {item.title}
                  </h3>
                  <p className="max-w-sm text-sm sm:text-base leading-6 sm:leading-7 text-white/80">
                    {item.description}
                  </p>
                </motion.div>
              ))}

              {/* Last Card */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative flex min-h-[190px] sm:min-h-[220px] items-center justify-center overflow-hidden border border-white/10 bg-[#0B0C10] p-6 sm:p-8"
              >
                <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00E5E5]/25 blur-[100px]" />
                <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#00E5E5]/15 blur-[80px]" />
                <h3 className="relative z-10 text-xl sm:text-2xl font-black leading-tight md:text-3xl">
                  Five principles.
                  <span className="text-[#00E5E5]"> One promise:</span>
                  <br />
                  Your digital success.
                </h3>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto">
        <CTASection />
      </section>
    </section>
  );
}