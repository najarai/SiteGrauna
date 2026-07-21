import { motion } from "framer-motion";
import { SITE } from "../data/site";

export function Hero() {
  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0908_72%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[var(--color-ink)] to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="mb-5 text-[0.72rem] tracking-[0.28em] uppercase text-[var(--color-terra)]"
        >
          {SITE.city}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display max-w-4xl text-[clamp(3.2rem,9vw,7.2rem)] leading-[0.92] tracking-tight"
        >
          Graúna
          <span className="block italic text-[var(--color-cream-dim)]">Moda</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.85 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-cream-dim)] md:text-lg"
        >
          Vitrine editorial de moda feminina. Lookbook, marcas selecionadas e atendimento
          exclusivo pelo WhatsApp.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.8 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <a href="#colecao" className="btn-primary">
            Ver coleção
          </a>
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="btn-ghost">
            Instagram
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="mt-16 flex items-center gap-3 text-[0.68rem] tracking-[0.22em] uppercase text-[var(--color-sand)]"
        >
          <span className="h-px w-10 bg-[var(--color-sand)]" />
          Role para explorar
        </motion.div>
      </div>
    </section>
  );
}
