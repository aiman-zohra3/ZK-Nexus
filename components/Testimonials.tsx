"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Working with ZK Nexus has been one of the best technology decisions we've made.  They took the time to understand our business before writing a line of code, and it showed in every sprint. We now treat them as an extension of our own engineering team.",
    name: "Sarah Mitchell",
    role: "Founder, Elevate Labs",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    quote:
      "I was skeptical about switching agencies mid-project, but ZK Nexus made the transition painless. They inherited a messy codebase, cleaned it up within two weeks, and shipped three major features ahead of schedule. ",
    name: "James Brown",
    role: "Head of Marketing, Nimbus",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    quote:
      "Fantastic service and top-notch results from the very first call. Our previous vendor left us with a fragile system that broke constantly, and ZK Nexus rebuilt it from the ground up in under two months. ",
    name: "Emily White",
    role: "Product Lead, Vantage",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    quote:
      "They feel like strategic partners, not a vendor we hired off a marketplace.  That collaborative attitude is what kept us coming back for every new project.",
    name: "Omar Raza",
    role: "Founder, Ledgerly",
    avatar: "https://i.pravatar.cc/150?img=51",
  },
  {
    quote:
      "The security review alone justified the entire engagement.  Beyond the fix, they trained our developers on secure coding patterns so the same mistakes wouldn't resurface in future releases. Genuinely thorough work.",
    name: "Priya Nair",
    role: "CTO, Finqo",
    avatar: "https://i.pravatar.cc/150?img=44",
  },
  {
    quote:
      "Would hire again in a heartbeat, and honestly, we already have three more projects lined up with them.   Execution speed combined with real understanding is a hard combination to find.",
    name: "Kamran Rehman",
    role: "Founder, Alto",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
];

const N = testimonials.length;
const CHAR_DELAY = 20;
const HOLD_AFTER = 3200;
const SLIDE_DURATION = 1.0;

const extended = [testimonials[N - 1], ...testimonials, testimonials[0]];
const TOTAL = extended.length;
const SLOT = 100 / TOTAL;

export default function SocialProof() {
  const sectionRef = useRef(null);
  const [trackIndex, setTrackIndex] = useState(1);
  const [jumping, setJumping] = useState(false);

  // How many cards are visible at once: 3 at >=1000px, only the active
  // card below that. This is the only value that changes for the
  // responsive behavior — everything else (typing, auto-advance,
  // infinite loop, dot nav) is untouched.
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 999px)");
    const update = () => setVisible(mql.matches ? 1 : 3);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], [-800, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  const realIndex = (trackIndex - 1 + N) % N;

  // auto-advance based on typing time of the active quote
  useEffect(() => {
    const current = testimonials[realIndex];
    const typeTime = current.quote.length * CHAR_DELAY;
    const timer = setTimeout(() => {
      setTrackIndex((prev) => prev + 1);
    }, typeTime + HOLD_AFTER);
    return () => clearTimeout(timer);
  }, [realIndex]);

  // seamless loop: after sliding past the last clone, snap back invisibly
  useEffect(() => {
    if (trackIndex === TOTAL - 1) {
      const t = setTimeout(() => {
        setJumping(true);
        setTrackIndex(1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setJumping(false));
        });
      }, SLIDE_DURATION * 1000);
      return () => clearTimeout(t);
    }
    if (trackIndex === 0) {
      const t = setTimeout(() => {
        setJumping(true);
        setTrackIndex(N);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setJumping(false));
        });
      }, SLIDE_DURATION * 1000);
      return () => clearTimeout(t);
    }
  }, [trackIndex]);

  const goTo = (i: number) => setTrackIndex(i + 1);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0B0C10] pt-1 pb-12 md:py-32"
    >
      {/* ================= CYAN GLOW ================= */}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100vh] overflow-visible">
        <div className="sticky top-0 h-[100vh]">
          <motion.div
            style={{ y: glowY, scale: glowScale, opacity: glowOpacity }}
            className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-[#00E5E5]/15 blur-[260px]"
            aria-hidden="true"
          >
            <div className="h-[1000px] w-[1000px]" />
          </motion.div>

          <motion.div
            style={{ y: glowY, scale: glowScale, opacity: glowOpacity }}
            className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-[#00E5E5]/20 blur-[160px]"
            aria-hidden="true"
          >
            <div className="h-[500px] w-[500px]" />
          </motion.div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* ================= BADGE ================= */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end lg:gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5"
            >
              <span className="font-mono text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#00E5E5]">
                Testimonials
              </span>
            </motion.div>

            <h2 className="mt-8 text-2xl font-black leading-[1.02] text-white md:text-5xl">
              OUR CLIENT REVIEWS
            </h2>
          </div>

          <p className="block text-xs md:text-sm leading-relaxed text-gray-400 lg:max-w-xl lg:justify-self-end lg:text-right">
            Real feedback from teams who trusted us to build, secure, and scale their products.
                        Reviews from teams who trusted us to build, secure, and scale their products.

          </p>
        </div>

        {/* ================= CENTERED INFINITE TRACK ================= */}

        <div className="mt-10 md:mt-20 w-full overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: `-${(trackIndex - Math.floor((visible - 1) / 2)) * SLOT}%` }}
            transition={{
              duration: jumping ? 0 : SLIDE_DURATION,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ width: `${(TOTAL / visible) * 100}%` }}
          >
            {extended.map((t, i) => {
              const active = i === trackIndex;
              return (
                <div
                  key={i}
                  style={{ width: `${100 / TOTAL}%` }}
                  className="box-border px-3"
                >
                  <div
                    className={`flex h-full flex-col justify-between rounded-2xl border p-8 transition-all duration-500 ${
                      active
                        ? "scale-100 border-[#00e5e5] bg-white/[0.05] opacity-100"
                        : "scale-90 border-white/5 bg-white/[0.02] opacity-40"
                    }`}
                  >
                    <p className="min-h-[190px] text-lg leading-relaxed">
                      <span className="inline mr-2 text-xl md:text-3xl font-black leading-none text-[#00E5E5]/30">
                        "
                      </span>
                      {active
                        ? t.quote.split("").map((char, ci) => (
                            <motion.span
                              key={`${trackIndex}-${ci}`}
                              initial={{ color: "#7D8491" }}
                              animate={{ color: "#F2F3F6" }}
                              transition={{
                                duration: 0.22,
                                delay: ci * (CHAR_DELAY / 500),
                              }}
                            >
                              {char}
                            </motion.span>
                          ))
                        : <span className="text-[#7D8491]">{t.quote}</span>}
                      <span className="text-xl md:text-3xl font-black leading-none text-[#00E5E5]/30">
                        "
                      </span>
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="h-14 w-14 shrink-0 rounded-full border-2 border-[#0B0C10] object-cover"
                      />
                      <div>
                        <p className="text-base font-bold text-white">
                          {t.name}
                        </p>
                        <p className="mt-0.5 text-sm text-[#00E5E5]">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === realIndex ? "w-6 bg-[#00E5E5]" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}