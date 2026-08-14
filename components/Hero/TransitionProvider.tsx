"use client";

// components/transitions/TransitionProvider.jsx
//
// Wrap your root layout with this once:
//
//   <TransitionProvider>{children}</TransitionProvider>
//
// Then anywhere (like ProjectCard) call:
//
//   const { navigate } = useTransitionRouter();
//   navigate("/projects/pizzano");
//
// It plays a short "decrypting" scan animation, then pushes the route.

import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type TransitionContextValue = {
  navigate: (href: string) => void;
  active: boolean;
};

type TransitionProviderProps = {
  children: ReactNode;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransitionRouter() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("useTransitionRouter must be used inside <TransitionProvider>");
  }
  return ctx;
}

const EASE = [0.76, 0, 0.24, 1] as const;

export default function TransitionProvider({ children }: TransitionProviderProps) {
  const [active, setActive] = useState(false);
  const router = useRouter();

  const navigate = useCallback(
    (href: string) => {
      if (active) return;
      setActive(true);
      // let the cover panel finish sliding up before swapping the route
      window.setTimeout(() => {
        router.push(href);
        window.setTimeout(() => setActive(false), 450);
      }, 500);
    },
    [active, router]
  );

  return (
    <TransitionContext.Provider value={{ navigate, active }}>
      {children}

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-999 bg-brand-ink"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            exit={{
              clipPath: "inset(0 0 100% 0)",
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* faint grid, sells the "system" feel */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(brand-mist 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />

            {/* sweeping scanline */}
            <motion.div
              className="absolute left-0 right-0 h-px bg-brand-cyan shadow-[0_0_24px_3px_rgba(0,229,229,0.65)]"
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
            />

            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase text-brand-mist/60"
            >
              decrypting_project…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}