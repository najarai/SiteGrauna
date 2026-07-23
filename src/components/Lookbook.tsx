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
  // Translate only — CSS scale softens photos when the browser resamples them.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? 28 : -20, index % 2 === 0 ? -28 : 20],
  );

  return (
    <motion.figure
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.05 }}
      className="group relative overflow-hidden rounded-[2px]"
    >
      <img
        src={look.src}
        alt={look.alt}
        loading={index < 6 ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={index < 4 ? "high" : "auto"}
        className="w-full h-auto"
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
    <section id="colecao" className="relative px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[0.7rem] tracking-[0.28em] uppercase text-[var(--color-terra)]">
              Lookbook
            </p>
            <h2 className="font-display text-4xl md:text-6xl">
              Novidades <span className="italic text-[var(--color-cream-dim)]">da vitrine</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[var(--color-cream-dim)] md:text-base">
            Looks recentes do catálogo — Morena Rosa, Maria Valentina e mais. Só mostruário:
            escolha o que ama e fale conosco no WhatsApp.
          </p>
        </div>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {LOOKS.map((look, index) => (
            <div key={look.id} className="mb-5 break-inside-avoid">
              <LookCard look={look} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
