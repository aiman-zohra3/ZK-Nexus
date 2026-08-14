"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useState, useRef } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How long does a typical website project take?",
    answer:
      "Most website projects are completed within 2–6 weeks depending on the scope, integrations, and custom requirements.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
      color: "#FFFFFF",
  },
  {
    question: "Do you only work with Pakistani clients?",
    answer:
      "No. We work remotely with startups and businesses worldwide and are equipped to collaborate across different time zones.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
      color: "#FFFFFF",
  },
  {
    question: "What kind of security audits do you offer?",
    answer:
      "We offer web application security assessments, vulnerability testing, secure code reviews, and basic infrastructure audits.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
      color: "#FFFFFF",
  },
  {
    question: "Do you provide ongoing maintenance?",
    answer:
      "Yes. We offer maintenance plans that include updates, monitoring, performance optimization, and technical support.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
      color: "#FFFFFF",
  },
  {
    question: "What's your pricing model?",
    answer:
      "Our pricing is flexible and can be project-based or retainer-based depending on the engagement and deliverables.",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop",
      color: "#FFFFFF",
  },
  {
    question: "Can you work with our existing codebase?",
    answer:
      "Yes. We regularly join projects mid-flight — we'll audit what's there first, then integrate cleanly instead of rewriting from scratch.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
      color: "#FFFFFF",
  },
  {
    question: "Do you sign NDAs and contracts?",
    answer:
      "Always. Every engagement starts with a signed NDA and a scoped contract before any code or credentials change hands.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
      color: "#FFFFFF",
  },
  {
    question: "What happens after the site goes live?",
    answer:
      "You get a handover walkthrough, documentation, and a support window to catch anything before we move to a maintenance plan.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      color: "#FFFFFF",
  },
  {
    question: "Can you help with just design, not development?",
    answer:
      "Yes. Design and development are offered separately or together — whichever your team actually needs.",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1200&auto=format&fit=crop",
      color: "#FFFFFF",
  },
];

export default function Faqs() {
  const sectionRef = useRef<HTMLElement>(null);

  // raw cursor position (0 -> starts center, updates on move)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // heavy spring = slow, trailing "snail" follow (~1s settle)
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20, mass: 1.2 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20, mass: 1.2 });

  const maskImage = useMotionTemplate`radial-gradient(circle 350px at ${smoothX}px ${smoothY}px, black 0%, black 30%, transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const activeFaq = faqs[activeIndex];

  const faqTextStyles =
    "absolute text-5xl md:text-[10rem] font-sans font-black uppercase leading-none tracking-tight";

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-[#0B0C10] px-6 py-14 md:py-32 text-[#E2E8F0]"
    >


      {/* Dark overlay so text stays readable over the image */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[#0B0C10]/80" />

      <div className="relative z-10 mx-auto lg:px-10 max-w-7xl">
        {/* Badge — shown here on mobile only, since the desktop badge lives above the image stack */}
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5"
        >
          
          <span className="font-mono text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#00E5E5]">
            Frequently Asked Questions
          </span>
        </motion.div>

        <div className="mt-10 md:mt-20 grid gap-1 lg:gap-20 lg:grid-cols-[0.9fr_1.1fr]">
        {/* LEFT SIDE — hidden below lg, image stack only makes sense with room to breathe */}
        <div className="hidden flex-col items-end lg:items-center lg:flex">
          

          <div className="relative flex h-[420px] w-full max-w-[460px] items-center justify-center">
            {/* White FAQ text */}
            <motion.h2
  animate={{
    color: activeFaq?.color ?? "#FFFFFF",
  }}
  transition={{ duration: 0.35 }}
  className={`${faqTextStyles} -bottom-28 right-44 z-10`}
>
  FAQ.
</motion.h2>

            {/* Image */}
            <motion.div
              key={activeFaq.image}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute top-5 left-10 z-20 overflow-hidden rounded-2xl shadow-2xl"
            >
              <div className="relative h-[360px] w-[360px]">
                <Image
                  src={activeFaq.image}
                  alt={activeFaq.question}
                  fill
                  className="object-cover"
                  unoptimized
                />

                <div className="absolute inset-0 bg-black/10" />

                
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT SIDE — scrollable list */}
        <div
          className="
            faq-scroll relative max-h-[640px] overflow-y-auto pr-2 
            [mask-image:linear-gradient(to_bottom,transparent,black_4%,black_92%,transparent)]
          "
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                onMouseEnter={() => setActiveIndex(index)}
                className="relative border-b border-white/10 pl-6"
              >
                {/* moving indicator — only one line exists; layoutId animates it sliding to whichever row is open */}
                {isOpen && (
                  <motion.div
                    layoutId="faq-active-line"
                    className="absolute left-0 top-0 h-full w-[2px] bg-[#00E5E5]"
                    style={{ boxShadow: "0 0 12px rgba(0,229,229,0.6)" }}
                    transition={{ type: "spring", stiffness: 350, damping: 32 }}
                  />
                )}

                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors"
                >
                  <span className="text-sm md:text-md font-medium">{faq.question}</span>

                  {isOpen ? <Minus size={22} /> : <Plus size={22} />}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="max-w-xl pb-8">
                        <p className="leading-relaxed text-[#8B93A3]">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      </div>

      <style>{`
        .faq-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .faq-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .faq-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 229, 229, 0.35);
          border-radius: 999px;
        }
        .faq-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 229, 229, 0.6);
        }
        .faq-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 229, 229, 0.35) transparent;
        }
      `}</style>
    </section>
  );
}