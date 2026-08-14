"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Palette, Code2, Database, Cloud, ShieldCheck } from "lucide-react";

// ======================================================
// TYPES
// ======================================================

interface Piece {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;

  floatX: number;
  floatY: number;

  finalX: number;
  finalY: number;
}

type Phase = "float" | "assemble" | "merge" | "logo";

// ======================================================
// TIMING
// ======================================================

const FLOAT_HOLD = 2.2;
const ASSEMBLE_DURATION = 1.4; // pieces travel to their pentagon corner
const TYPE_START_DELAY = 0.3; // pause after landing before typing begins
const CHAR_DELAY = 0.055; // delay between each typed character
const PIECE_STAGGER = 0.2; // delay before each piece's label starts typing
const HOLD_AFTER_TYPING = 1.2; // brief pause once all labels finish, before merge
const MERGE_DURATION = 1.1;
const SHOCKWAVE_DURATION = 0.9;
const LOGO_DURATION = 3.0;

// ======================================================
// DATA — 5 pieces at equally spaced pentagon corners
// ======================================================

const pieces: Piece[] = [
  { id: "security", label: "Security", icon: ShieldCheck, color: "#00e6e6", floatX: 0, floatY: -185, finalX: 0, finalY: -190 },
  { id: "ui", label: "UI", icon: Palette, color: "#00e6e6", floatX: -170, floatY: -120, finalX: -140, finalY: -58 },
  { id: "api", label: "API", icon: Code2, color: "#00e6e6", floatX: 165, floatY: -100, finalX: 140, finalY: -58 },
  { id: "db", label: "Database", icon: Database, color: "#00e6e6", floatX: -190, floatY: 80, finalX: -92, finalY: 107 },
  { id: "cloud", label: "Cloud", icon: Cloud, color: "#00e6e6", floatX: 180, floatY: 105, finalX: 92, finalY: 107 },
];

// Longest label finishes typing at: (pieces.length - 1) * PIECE_STAGGER + longestLabel.length * CHAR_DELAY
const longestLabelLength = Math.max(...pieces.map((p) => p.label.length));
const TYPING_TOTAL =
  TYPE_START_DELAY + (pieces.length - 1) * PIECE_STAGGER + longestLabelLength * CHAR_DELAY;

export default function Left1() {
  const [phase, setPhase] = useState<Phase>("float");
  const [showShockwave, setShowShockwave] = useState(false);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const clearAll = () => {
      timeouts.forEach(clearTimeout);
      timeouts = [];
    };

    const cycle = () => {
      if (cancelled) return;
      setPhase("float");
      setShowShockwave(false);

      timeouts.push(
        setTimeout(() => {
          if (cancelled) return;
          setPhase("assemble");

          // Merge fires once every label has finished typing out
          timeouts.push(
            setTimeout(() => {
              if (cancelled) return;
              setShowShockwave(true);
              setPhase("merge");

              timeouts.push(
                setTimeout(() => {
                  if (!cancelled) setShowShockwave(false);
                }, SHOCKWAVE_DURATION * 1000)
              );

              timeouts.push(
                setTimeout(() => {
                  if (cancelled) return;
                  setPhase("logo");

                  timeouts.push(
                    setTimeout(() => {
                      if (!cancelled) cycle();
                    }, LOGO_DURATION * 1000)
                  );
                }, MERGE_DURATION * 1000)
              );
            }, (ASSEMBLE_DURATION + TYPING_TOTAL + HOLD_AFTER_TYPING) * 1000)
          );
        }, FLOAT_HOLD * 1000)
      );
    };

    // Backgrounded tabs get their setTimeout delays throttled by the
    // browser. Without this, a chain this long (~10s per cycle) can
    // queue up several delayed callbacks that all fire at once when
    // the tab regains focus — several phases flashing through in one
    // frame, which is the "hallucinating" glitch. So: on hide, drop
    // whatever's pending; on show, restart clean from "float" instead
    // of trying to resume a stale timeline.
    const handleVisibilityChange = () => {
      clearAll();
      if (!document.hidden) {
        cycle();
      }
    };

    cycle();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      clearAll();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <section className="hidden lg:block relative flex h-[620px] w-full items-center justify-center overflow-hidden">
      {/* Cyan Glow */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.18, 0.3, 0.18] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full bg-[#0B0C10] blur-[120px]"
      />

      <div className="relative h-[500px] w-[500px]">
        {/* ===================================== */}
        {/* Shockwave — pulses out right as merge begins */}
        {/* ===================================== */}
        <AnimatePresence>
          {showShockwave && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0.6 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: SHOCKWAVE_DURATION, ease: "easeOut" }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00E5E5]"
            />
          )}
        </AnimatePresence>

        {/* ===================================== */}
        {/* Assembly Pieces */}
        {/* ===================================== */}
        {pieces.map((piece, index) => {
          const Icon = piece.icon;

          const animate =
            phase === "assemble"
              ? { x: piece.finalX, y: piece.finalY, rotate: 0, scale: 1.3, opacity: 1 }
              : phase === "merge" || phase === "logo"
              ? { x: 0, y: 0, rotate: 90, scale: 0, opacity: 0 }
              : {
                  x: [piece.floatX, piece.floatX + 12, piece.floatX - 8, piece.floatX],
                  y: [piece.floatY, piece.floatY - 14, piece.floatY + 10, piece.floatY],
                  rotate: [0, 4, -3, 0],
                  scale: 1,
                  opacity: 1,
                };

          const transition =
  phase === "assemble"
    ? {
        type: "spring" as const,
        stiffness: 90,
        damping: 12,
        delay: index * 0.05,
      }
    : phase === "merge" || phase === "logo"
    ? { duration: MERGE_DURATION, ease: [0.4, 0, 1, 1] as const }
    : { duration: 6 + index * 0.4, repeat: Infinity, ease: "easeInOut" as const };

          // Each character's own start time within this piece's label
          const pieceTypeStart = TYPE_START_DELAY + index * PIECE_STAGGER;

          return (
            <motion.div
              key={piece.id}
              initial={{ x: piece.floatX, y: piece.floatY, opacity: 0 }}
              animate={animate}
              transition={transition}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
            >
              <motion.div
                animate={
                  phase === "assemble"
                    ? { boxShadow: "0 10px 40px rgba(0,230,230,0.35)" }
                    : { boxShadow: "0 10px 30px rgba(0,230,230,.18)" }
                }
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl"
              >
                <Icon size={28} strokeWidth={2} style={{ color: piece.color }} />
              </motion.div>

              {/* Typing label — characters reveal one by one once assembled */}
              <span className="flex text-[10px] font-mono font-semibold tracking-tight text-white/70">
                {phase === "assemble" || phase === "merge" || phase === "logo"
                  ? piece.label.split("").map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase === "assemble" ? 1 : 0 }}
                        transition={{
                          duration: 0.05,
                          delay: pieceTypeStart + charIndex * CHAR_DELAY,
                        }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))
                  : null}
              </span>
            </motion.div>
          );
        })}

        {/* ===================================== */}
        {/* Center Logo Reveal */}
        {/* ===================================== */}
        <AnimatePresence>
          {phase === "logo" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 blur-[70px]"
              />

              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.6, opacity: 0.5 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 1.25, ease: "easeOut" }}
                  className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00E5E5]/40"
                />
              ))}

              {[0, 1].map((i) => (
                <motion.div
                  key={`orbit-${i}`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8 + i * 4, repeat: Infinity, ease: "linear" }}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1"
                  style={{ transformOrigin: `0 ${70 + i * 20}px` }}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00E5E5] shadow-[0_0_8px_2px_rgba(0,229,229,0.6)]" />
                </motion.div>
              ))}

              <img src="/logo.png" alt="ZK Nexus" className="relative h-24 w-auto" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}