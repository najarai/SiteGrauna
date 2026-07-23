import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { SITE } from "../data/site";

const SESSION_KEY = "grauna-intro-seen";

/** Soft organic ease — slower settle, less mechanical */
const easeOrganic: [number, number, number, number] = [0.16, 1, 0.3, 1];
const easeDrift: [number, number, number, number] = [0.33, 0.0, 0.2, 1];

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
  const [showBrand, setShowBrand] = useState(false);
  const [exiting, setExiting] = useState(false);
  const loadProgress = useMotionValue(0);
  const loadWidth = useTransform(loadProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    if (!visible) {
      onComplete();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const controls = animate(loadProgress, 1, {
      duration: 1.55,
      ease: easeDrift,
      onComplete: () => {
        setShowBrand(true);
      },
    });

    return () => {
      controls.stop();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [visible, onComplete, loadProgress]);

  useEffect(() => {
    if (!showBrand || exiting) return;

    const exitTimer = window.setTimeout(() => {
      setExiting(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 1750);

    return () => window.clearTimeout(exitTimer);
  }, [showBrand, exiting]);

  if (!visible && !exiting) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        setVisible(false);
        onComplete();
      }}
    >
      {!exiting ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden bg-[var(--color-ink)] px-6 will-change-transform"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -28, scale: 1.02 }}
          transition={{ duration: 1.05, ease: easeOrganic }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--color-terra)_10%,transparent)_42%,transparent_100%)]" />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 origin-center bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--color-cream)_22%,transparent)] to-transparent will-change-transform"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: showBrand ? 1 : 0.4, opacity: showBrand ? 0.65 : 0.2 }}
            transition={{ duration: 1.35, ease: easeOrganic }}
          />

          {(
            [
              "left-6 top-6 border-l border-t md:left-10 md:top-10",
              "right-6 top-6 border-r border-t md:right-10 md:top-10",
              "bottom-6 left-6 border-b border-l md:bottom-10 md:left-10",
              "bottom-6 right-6 border-b border-r md:bottom-10 md:right-10",
            ] as const
          ).map((cls, i) => (
            <motion.span
              key={cls}
              aria-hidden
              className={`pointer-events-none absolute h-10 w-10 border-[color-mix(in_srgb,var(--color-cream)_28%,transparent)] ${cls}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: showBrand ? 0.9 : 0.28 }}
              transition={{ duration: 1.1, delay: 0.12 + i * 0.06, ease: easeOrganic }}
            />
          ))}

          <div className="relative z-10 flex w-full max-w-lg flex-col items-center">
            <motion.div
              aria-hidden
              className="mb-8 flex w-full items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: easeOrganic }}
            >
              <motion.span
                className="h-px flex-1 origin-right bg-[color-mix(in_srgb,var(--color-cream)_30%,transparent)] will-change-transform"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.25, ease: easeOrganic }}
              />
              <span className="text-[0.58rem] tracking-[0.32em] uppercase text-[var(--color-sand)]">
                {SITE.city}
              </span>
              <motion.span
                className="h-px flex-1 origin-left bg-[color-mix(in_srgb,var(--color-cream)_30%,transparent)] will-change-transform"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.25, ease: easeOrganic }}
              />
            </motion.div>

            <motion.img
              src="/logo.png"
              alt=""
              className="h-24 w-24 object-cover will-change-transform md:h-28 md:w-28"
              initial={{ opacity: 0, y: 22 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: showBrand ? 1 : 0.97,
              }}
              transition={{ duration: 1.2, ease: easeOrganic }}
            />

            <div className="relative mt-10 flex min-h-[7.5rem] w-full flex-col items-center justify-start">
              <motion.div
                className="absolute top-0 w-44"
                initial={{ opacity: 1 }}
                animate={{ opacity: showBrand ? 0 : 1, y: showBrand ? -6 : 0 }}
                transition={{ duration: 0.55, ease: easeDrift }}
              >
                <div className="h-px w-full overflow-hidden bg-white/10">
                  <motion.div className="h-full origin-left bg-[var(--color-terra)]" style={{ width: loadWidth }} />
                </div>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 28 }}
                animate={
                  showBrand
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 28 }
                }
                transition={{ duration: 1.15, ease: easeOrganic, delay: showBrand ? 0.08 : 0 }}
              >
                <p className="font-display text-[clamp(2.8rem,8vw,5rem)] leading-[0.92] tracking-[0.04em]">
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0, y: 18 }}
                    animate={showBrand ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                    transition={{ duration: 1.05, ease: easeOrganic, delay: showBrand ? 0.1 : 0 }}
                  >
                    Graúna
                  </motion.span>
                  <motion.span
                    className="mt-1 block italic text-[var(--color-cream-dim)]"
                    initial={{ opacity: 0, y: 18 }}
                    animate={showBrand ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                    transition={{ duration: 1.1, ease: easeOrganic, delay: showBrand ? 0.22 : 0 }}
                  >
                    Moda
                  </motion.span>
                </p>
                <motion.div
                  className="mx-auto mt-6 flex max-w-[14rem] items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={showBrand ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.9, ease: easeOrganic, delay: showBrand ? 0.38 : 0 }}
                >
                  <span className="h-px flex-1 bg-[color-mix(in_srgb,var(--color-terra)_70%,transparent)]" />
                  <p className="text-[0.65rem] tracking-[0.28em] uppercase text-[var(--color-sand)]">
                    {SITE.tagline}
                  </p>
                  <span className="h-px flex-1 bg-[color-mix(in_srgb,var(--color-terra)_70%,transparent)]" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
