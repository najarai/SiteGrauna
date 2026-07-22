import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SITE } from "../data/site";

const SESSION_KEY = "grauna-intro-seen";

type Phase = "load" | "brand" | "exit";

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

  useEffect(() => {
    if (!visible) {
      onComplete();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    let raf = 0;
    let brandTimer = 0;
    const started = performance.now();
    const duration = 1400;

    const finish = () => {
      setPhase("exit");
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - t) ** 3;
      setLoadProgress(eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase("brand");
        brandTimer = window.setTimeout(finish, 1600);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(brandTimer);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [visible, onComplete]);

  if (!visible && phase !== "exit") return null;

  const unveiled = phase !== "load";

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
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden bg-[var(--color-ink)] px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Soft vertical wash — no circular motifs */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--color-terra)_10%,transparent)_42%,transparent_100%)]" />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--color-cream)_22%,transparent)] to-transparent"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: unveiled ? 1 : 0.35, opacity: unveiled ? 0.7 : 0.25 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Editorial corner marks */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l border-t border-[color-mix(in_srgb,var(--color-cream)_28%,transparent)] md:left-10 md:top-10"
            initial={{ opacity: 0, x: -8, y: -8 }}
            animate={{ opacity: unveiled ? 1 : 0.35, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r border-t border-[color-mix(in_srgb,var(--color-cream)_28%,transparent)] md:right-10 md:top-10"
            initial={{ opacity: 0, x: 8, y: -8 }}
            animate={{ opacity: unveiled ? 1 : 0.35, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b border-l border-[color-mix(in_srgb,var(--color-cream)_28%,transparent)] md:bottom-10 md:left-10"
            initial={{ opacity: 0, x: -8, y: 8 }}
            animate={{ opacity: unveiled ? 1 : 0.35, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b border-r border-[color-mix(in_srgb,var(--color-cream)_28%,transparent)] md:bottom-10 md:right-10"
            initial={{ opacity: 0, x: 8, y: 8 }}
            animate={{ opacity: unveiled ? 1 : 0.35, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <div className="relative z-10 flex w-full max-w-lg flex-col items-center">
            {/* Horizontal rules framing the logo */}
            <motion.div
              aria-hidden
              className="mb-8 flex w-full items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <motion.span
                className="h-px flex-1 origin-right bg-[color-mix(in_srgb,var(--color-cream)_30%,transparent)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="text-[0.58rem] tracking-[0.32em] uppercase text-[var(--color-sand)]">
                {SITE.city}
              </span>
              <motion.span
                className="h-px flex-1 origin-left bg-[color-mix(in_srgb,var(--color-cream)_30%,transparent)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>

            <motion.img
              src="/logo.png"
              alt=""
              className="h-24 w-24 object-cover md:h-28 md:w-28"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, scale: unveiled ? 1 : 0.96 }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            />

            {phase === "load" ? (
              <div className="mt-10 w-44">
                <div className="h-px w-full overflow-hidden bg-white/10">
                  <motion.div
                    className="h-full bg-[var(--color-terra)]"
                    style={{ width: `${loadProgress * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 text-center"
              >
                <p className="font-display text-[clamp(2.8rem,8vw,5rem)] leading-[0.92] tracking-[0.04em]">
                  Graúna
                  <span className="mt-1 block italic text-[var(--color-cream-dim)]">Moda</span>
                </p>
                <div className="mx-auto mt-6 flex max-w-[14rem] items-center gap-3">
                  <span className="h-px flex-1 bg-[color-mix(in_srgb,var(--color-terra)_70%,transparent)]" />
                  <p className="text-[0.65rem] tracking-[0.28em] uppercase text-[var(--color-sand)]">
                    {SITE.tagline}
                  </p>
                  <span className="h-px flex-1 bg-[color-mix(in_srgb,var(--color-terra)_70%,transparent)]" />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
