import { motion } from "framer-motion";
import { SITE } from "../data/site";

export function Hero({ ready = true }: { ready?: boolean }) {
  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24"
    >
      <div className="hero-veil" aria-hidden />

      <div className="relative mx-auto w-full max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ delay: 0.08, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 text-[0.72rem] tracking-[0.28em] uppercase text-[var(--color-terra)]"
        >
          {SITE.city}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
          transition={{ delay: 0.16, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display max-w-4xl text-[clamp(3.2rem,9vw,7.2rem)] leading-[0.92] tracking-tight"
        >
          Graúna
          <span className="block italic text-[var(--color-cream-dim)]">Moda</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.28, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-cream-dim)] md:text-lg"
        >
          Vitrine editorial de moda feminina. Lookbook, marcas selecionadas e atendimento
          exclusivo pelo WhatsApp e/ou loja.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: 0.4, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
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
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="mt-16 flex items-center gap-3 text-[0.68rem] tracking-[0.22em] uppercase text-[var(--color-sand)]"
        >
          <span className="h-px w-10 bg-[var(--color-sand)]" />
          Role para explorar
        </motion.div>
      </div>
    </section>
  );
}
