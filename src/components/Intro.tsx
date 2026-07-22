import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SITE } from "../data/site";

const SESSION_KEY = "grauna-intro-seen";
const HOLD_MS = 900;

type Phase = "load" | "brand" | "ready" | "exit";

function shouldSkipIntro() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function Intro({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(() => !shouldSkipIntro());
  const [phase, setPhase] = useState<Phase>("load");
  const [loadProgress, setLoadProgress] = useState(0);
  const holding = useRef(false);
  const holdProgress = useMotionValue(0);
  const holdPct = useTransform(holdProgress, [0, 1], ["0%", "100%"]);
  const ringCircumference = 2 * Math.PI * 64;
  const ringOffset = useTransform(holdProgress, [0, 1], [ringCircumference, 0]);
  const holdAnim = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    if (!visible) {
      onComplete();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    let raf = 0;
    const started = performance.now();
    const duration = 1600;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - t) ** 3;
      setLoadProgress(eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase("brand");
        window.setTimeout(() => setPhase("ready"), 1100);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [visible, onComplete]);

  const finish = () => {
    if (phase === "exit") return;
    setPhase("exit");
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const startHold = () => {
    if (phase !== "ready" || holding.current) return;
    holding.current = true;
    holdAnim.current?.stop();
    holdAnim.current = animate(holdProgress, 1, {
      duration: HOLD_MS / 1000,
      ease: "easeInOut",
      onComplete: () => {
        if (holding.current) finish();
      },
    });
  };

  const endHold = () => {
    if (!holding.current) return;
    holding.current = false;
    holdAnim.current?.stop();
    holdAnim.current = animate(holdProgress, 0, {
      duration: 0.35,
      ease: "easeOut",
    });
  };

  if (!visible && phase !== "exit") return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        setVisible(false);
        onComplete();
      }}
    >
      {phase !== "exit" ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[var(--color-ink)] px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-8%", filter: "blur(8px)" }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          onPointerCancel={endHold}
          onContextMenu={(e) => e.preventDefault()}
          style={{ touchAction: "none", userSelect: "none" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-terra)_14%,transparent),transparent_58%)]" />

          {/* Soft editorial rings — Resn-like motion, Graúna palette */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={
              phase === "load"
                ? { opacity: 0.15, scale: 0.85 }
                : { opacity: 0.45, scale: 1, rotate: 360 }
            }
            transition={
              phase === "load"
                ? { duration: 0.8 }
                : { rotate: { duration: 28, ease: "linear", repeat: Infinity }, opacity: { duration: 1 }, scale: { duration: 1.1 } }
            }
          >
            <svg width="280" height="280" viewBox="0 0 280 280" className="text-[var(--color-cream-dim)]">
              <circle cx="140" cy="140" r="108" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
              <circle cx="140" cy="140" r="78" fill="none" stroke="var(--color-terra)" strokeWidth="0.7" opacity="0.55" strokeDasharray="4 10" />
              <path
                d="M140 28 L148 52 L140 46 L132 52 Z M252 140 L228 148 L234 140 L228 132 Z M140 252 L132 228 L140 234 L148 228 Z M28 140 L52 132 L46 140 L52 148 Z"
                fill="currentColor"
                opacity="0.55"
              />
            </svg>
          </motion.div>

          <motion.div
            aria-hidden
            className="pointer-events-none absolute"
            initial={{ opacity: 0 }}
            animate={phase === "load" ? { opacity: 0 } : { opacity: 0.3, rotate: -360 }}
            transition={{ rotate: { duration: 40, ease: "linear", repeat: Infinity }, opacity: { duration: 1.2, delay: 0.2 } }}
          >
            <svg width="360" height="360" viewBox="0 0 360 360">
              <circle
                cx="180"
                cy="180"
                r="150"
                fill="none"
                stroke="color-mix(in srgb, var(--color-cream) 28%, transparent)"
                strokeWidth="0.5"
                strokeDasharray="1 14"
              />
            </svg>
          </motion.div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-8 flex h-28 w-28 items-center justify-center md:h-32 md:w-32">
              {phase !== "load" && (
                <svg className="pointer-events-none absolute inset-[-10px]" viewBox="0 0 140 140" aria-hidden>
                  <circle
                    cx="70"
                    cy="70"
                    r="64"
                    fill="none"
                    stroke="color-mix(in srgb, var(--color-cream) 18%, transparent)"
                    strokeWidth="1"
                  />
                  <motion.circle
                    cx="70"
                    cy="70"
                    r="64"
                    fill="none"
                    stroke="var(--color-terra)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    style={{ strokeDashoffset: ringOffset, rotate: -90, transformOrigin: "70px 70px" }}
                  />
                </svg>
              )}

              <motion.img
                src="/logo.png"
                alt=""
                className="h-20 w-20 rounded-full object-cover ring-1 ring-white/20 md:h-24 md:w-24"
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: phase === "load" ? 0.92 : 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {phase === "load" ? (
              <div className="w-40">
                <div className="h-px w-full overflow-hidden bg-white/10">
                  <motion.div
                    className="h-full bg-[var(--color-terra)]"
                    style={{ width: `${loadProgress * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <p className="font-display text-[clamp(2.6rem,8vw,4.8rem)] leading-[0.92] tracking-[0.04em]">
                  Graúna
                  <span className="mt-1 block italic text-[var(--color-cream-dim)]">Moda</span>
                </p>
                <p className="mt-5 text-[0.68rem] tracking-[0.28em] uppercase text-[var(--color-sand)]">
                  {SITE.tagline} · {SITE.city}
                </p>
              </motion.div>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-4 px-6 md:bottom-14">
            {phase === "ready" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="flex w-full max-w-xs flex-col items-center gap-3"
              >
                <p className="text-[0.68rem] tracking-[0.26em] uppercase text-[var(--color-cream-dim)]">
                  Segure para entrar
                </p>
                <div className="h-px w-full overflow-hidden bg-white/10">
                  <motion.div className="h-full bg-[var(--color-cream)]" style={{ width: holdPct }} />
                </div>
              </motion.div>
            )}

            {(phase === "brand" || phase === "ready") && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  finish();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="text-[0.62rem] tracking-[0.2em] uppercase text-[var(--color-sand)] transition hover:text-[var(--color-cream-dim)]"
              >
                Pular intro
              </button>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
