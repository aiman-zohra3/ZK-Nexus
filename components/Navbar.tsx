"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";

// ======================================================
// NAV DATA
// Same routes as the footer's Explore / Services / Company
// columns, flattened into one bar. "Our Work" scrolls to
// the #work section on the homepage since it has no
// dedicated listing page yet.
// ======================================================

const navItems = [
  { name: "HOME", href: "/" },
  { name: "SERVICES", href: "/services" },
  { name: "OUR WORK", href: "/#work" },
  { name: "CAREERS", href: "/careers" },
  { name: "ABOUT", href: "/about-us" },
  { name: "CONTACT", href: "/contact" },
];

// ======================================================
// WHATSAPP LINK
// Real number + pre-filled message so visitors don't land
// on a blank chat. Chat-only — no voice/video business
// account set up yet, so we set that expectation in the UI
// rather than promising something WhatsApp itself controls.
// ======================================================

const WHATSAPP_NUMBER = "923180540934";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi, I'd like to talk about a project!"
);
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on outside click / tap (belt-and-suspenders alongside the
  // overlay below — also catches clicks on things like the logo).
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    setIsOpen(false); // always close on any nav click, hash or not

    if (!href.includes("#")) return; // normal route, let Link handle it

    const [path, hash] = href.split("#");
    const targetPath = path || "/";

    if (pathname === targetPath) {
      // Already on the right page — scroll manually since Next.js
      // won't trigger a native anchor jump on a same-route Link click.
      e.preventDefault();
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigating from a different page — let Next.js route there,
      // then scroll once the new page has mounted.
      e.preventDefault();
      router.push(href);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  }

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="relative overflow-hidden border-b border-white/10 bg-[#0B0C10]/90 backdrop-blur-xl">
        {/* Decorative Glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-32
            w-96
            -translate-x-1/2
            rounded-full
            bg-[radial-gradient(circle_at_center,_rgba(0,229,229,0.15)_0%,_transparent_75%)]
            blur-3xl
          "
        />

        <div className="relative mx-auto flex h-12 max-w-[1400px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-4">
           <Image
                       src="/logo.png"
                       alt="ZK Nexus logo"
                       width={84}
                       height={84}
                       className="h-14 w-14 object-contain md:h-[84px] md:w-[84px]"
                     />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="group relative font-black text-[14px] font-medium tracking-tight text-white/80 transition-colors duration-200 hover:text-[#00E5E5]"
              >
                <span>{item.name}</span>
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[#639a9a] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA — desktop */}
          <div className="group/cta relative hidden lg:flex lg:flex-col lg:items-center">
            <Link
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              title="Opens a WhatsApp chat — voice/video calls aren't available on this number yet"
              className="group flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-bold tracking-wide transition-all duration-300 
               bg-[#00E5E5] text-black xl:px-6 xl:py-3 xl:text-sm"
            >
              <MessageCircle
                size={15}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              TALK TO AN EXPERT
            </Link>

          </div>

          {/* Mobile Toggle */}
          <button
            ref={toggleRef}
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-white lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={26} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={26} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu — floating card + backdrop, sits outside the
          header's overflow-hidden wrapper so it can cast a shadow
          and doesn't force the header itself to grow. */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — click anywhere on it to close */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-12 z-40 bg-black/60 backdrop-blur-sm lg:hidden sm:top-20"
            />

            {/* Panel */}
            {/* Panel */}
<motion.div
  key="panel"
  ref={menuRef}
  initial={{ opacity: 0, x: 24, scale: 0.98 }}
  animate={{ opacity: 1, x: 0, scale: 1 }}
  exit={{ opacity: 0, x: 24, scale: 0.98 }}
  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
  className="
    fixed right-3 top-[3.75rem] z-50
    w-2/3 max-w-sm
    overflow-hidden rounded-2xl border border-white/10
    bg-[#0B0C10]/95 shadow-2xl shadow-black/50 backdrop-blur-xl
    sm:right-4 sm:top-[5.5rem]
    lg:hidden
  "
>
              <div className="flex max-h-[75vh] flex-col gap-1 overflow-y-auto px-4 py-5 sm:px-5">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="block rounded-lg px-3 py-2.5 font-mono text-base tracking-wide text-white/80 transition-colors duration-200 hover:bg-white/[0.04] hover:text-[#00E5E5] active:bg-white/[0.06] sm:text-lg"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: navItems.length * 0.04 }}
                  className="mt-3 border-t border-white/10 pt-4"
                >
                  <Link
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex text-[13px] items-center justify-center gap-2 rounded-xl bg-[#00E5E5] px-6 py-3.5 font-semibold text-black transition-transform duration-200 active:scale-[0.98]"
                  >
                    <MessageCircle size={18} />
                    TALK TO AN EXPERT
                  </Link>
                  <p className="mt-2 text-center text-xs text-white/40">
                    Chat only — calls not available yet
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}