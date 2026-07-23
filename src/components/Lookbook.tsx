import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LOOKS } from "../data/site";

function LookCard({
  look,
  index,
}: {
  look: (typeof LOOKS)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Subtle translate only — no scale (keeps photo sharpness).
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? 16 : -12, index % 2 === 0 ? -16 : 12],
  );

  return (
    <motion.figure
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.06 }}
      className="group relative mx-auto w-full max-w-[528px]"
    >
      <img
        src={look.src}
        alt={look.alt}
        loading={index < 4 ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={index < 2 ? "high" : "auto"}
        className="h-auto w-full"
      />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 opacity-0 transition duration-500 group-hover:opacity-100">
        <span className="font-display text-2xl italic">{look.label}</span>
        <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-cream-dim)]">
          Novidades
        </span>
      </figcaption>
    </motion.figure>
  );
}

export function Lookbook() {
  return (
    <section id="colecao" className="relative px-5 py-28 md:px-10 md:py-36">
      <div className="section-wash section-wash--ink" aria-hidden />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-16 flex flex-col gap-5 md:mb-24 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-xl">
            <p className="mb-3 text-[0.7rem] tracking-[0.28em] uppercase text-[var(--color-terra)]">
              Lookbook
            </p>
            <h2 className="font-display text-4xl md:text-6xl">
              Novidades <span className="italic text-[var(--color-cream-dim)]">da vitrine</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--color-cream-dim)] md:text-base">
            Looks recentes do catálogo — Morena Rosa, Maria Valentina e mais. Só mostruário:
            escolha o que ama e fale conosco no WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-16 md:gap-x-14 md:gap-y-20">
          {LOOKS.map((look, index) => (
            <div
              key={look.id}
              className={index % 2 === 1 ? "sm:mt-14 md:mt-20" : undefined}
            >
              <LookCard look={look} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
