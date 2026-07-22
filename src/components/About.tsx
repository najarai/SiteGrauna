import { motion } from "framer-motion";
import { SITE } from "../data/site";

export function About() {
  return (
    <section id="sobre" className="relative px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-3 text-[0.7rem] tracking-[0.28em] uppercase text-[var(--color-terra)]">
            A loja
          </p>
          <h2 className="font-display text-4xl leading-tight md:text-6xl">
            Uma vitrine viva
            <span className="block italic text-[var(--color-cream-dim)]">em Santa Maria</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-cream-dim)]">
            A Graúna Moda é moda feminina com curadoria cuidadosa: peças que chegam às
            vitrines às terças e sextas, e um atendimento próximo, feito exclusivamente
            pelo WhatsApp.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-[var(--color-cream)]">
            <li className="flex gap-3">
              <span className="text-[var(--color-terra)]">✦</span>
              {SITE.hoursNote}
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-terra)]">✦</span>
              {SITE.serviceNote}
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-terra)]">✦</span>
              {SITE.address}
            </li>
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative overflow-hidden rounded-[2px]"
        >
          <img
            src="/looks/look-06.jpg"
            alt="Blusa azul Graúna Moda"
            className="aspect-[4/5] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="font-display text-3xl italic">Presença & elegância</p>
            <p className="mt-1 text-[0.7rem] tracking-[0.2em] uppercase text-[var(--color-cream-dim)]">
              Novidades da vitrine
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
