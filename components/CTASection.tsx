"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

/**
 * CTASection
 *
 * Contained, rounded "callout card" layout (icon → headline → subcopy →
 * single pill CTA), rebuilt in the ZK Nexus black / white / #00E5E5 system.
 *
 * NOTE on the logo: this expects your mark at `/public/logo-mark.png`
 * (or swap the <Image> below for an inline SVG of the actual paths if you
 * have the vector version — that'll look sharper at this size and let the
 * cyan wedge glow tie into the background properly).
 */

export default function CTASection() {
  const [hovering, setHovering] = useState(false);

  return (
    <section className="bg-black px-6 py-12 md:py-20 ">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-[#0c0c0c] to-black">
          {/* subtle grid texture, contained within the card's rounded corners */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06] border border-white/40"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* cyan glow seated behind the logo, echoing the wedge in the mark */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[280px] w-[520px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-[0.18] blur-[100px]"
            style={{ background: "#00E5E5" }}
          />

          <motion.div
            className="relative flex flex-col items-center px-8 py-8 md:py-14 text-center sm:px-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* logo mark */}
            <div className="relative text-xs md:text-md font-mono border rounded-full border-white/20 text-[#00e5e5] px-4 py-1 ">
              Let's start today
            </div>

            <h2
              className="mt-6 max-w-3xl font-black text-white leading-relaxed text-2xl md:text-5xl"
              style={{
                
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
              }}
            >
              WANT TO BUILD YOUR NEXT 
              <br className="hidden sm:block" /> PROJECT WITH US?
            </h2>

        

            <Link
  href="/contact"
  className="mt-10 inline-flex rounded-full font-semibold  bg-[#00E5E5] px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm  text-black transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(0,229,229,0.4)]"
>
  START YOUR PROJECT
  <ArrowUpRight
    size={18}
    className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
  />
</Link>

            
          </motion.div>
        </div>
      </div>
    </section>
  );
}