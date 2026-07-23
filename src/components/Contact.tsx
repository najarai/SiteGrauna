import { motion } from "framer-motion";
import { SITE } from "../data/site";

export function Contact() {
  return (
    <section id="contato" className="relative px-5 py-24 md:px-8 md:py-32">
      <div className="section-wash section-wash--ink" aria-hidden />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="glass relative overflow-hidden rounded-[28px] px-6 py-14 md:px-14 md:py-20"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--color-terra)_25%,transparent)] blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <p className="mb-3 text-[0.7rem] tracking-[0.28em] uppercase text-[var(--color-terra)]">
                Contato
              </p>
              <h2 className="font-display text-4xl md:text-6xl">
                Vamos conversar
                <span className="block italic text-[var(--color-cream-dim)]">pelo WhatsApp</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-[var(--color-cream-dim)] md:text-base">
                Este site é uma vitrine. Para disponibilidade, medidas e novidades das
                vitrines, fale direto com a loja.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  Abrir WhatsApp
                </a>
                <a href={SITE.instagram} target="_blank" rel="noreferrer" className="btn-ghost">
                  {SITE.instagramHandle}
                </a>
              </div>
            </div>

            <div className="space-y-5 text-sm text-[var(--color-cream-dim)]">
              <div>
                <p className="mb-2 text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-sand)]">
                  Localização
                </p>
                <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                  <iframe
                    title="Mapa — Graúna Moda"
                    src={SITE.mapsEmbedUrl}
                    className="aspect-[4/3] h-auto w-full border-0 grayscale-[25%] contrast-[1.05]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-[0.68rem] tracking-[0.16em] uppercase text-[var(--color-terra)] transition hover:text-[var(--color-cream)]"
                >
                  Abrir no Google Maps
                  <span aria-hidden>↗</span>
                </a>
              </div>
              <div>
                <p className="mb-1 text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-sand)]">
                  Endereço
                </p>
                <p className="text-[var(--color-cream)]">{SITE.address}</p>
                <p>{SITE.city}</p>
              </div>
              <div>
                <p className="mb-1 text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-sand)]">
                  Vitrines
                </p>
                <p className="text-[var(--color-cream)]">{SITE.hoursNote}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <footer className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[color-mix(in_srgb,var(--color-cream)_10%,transparent)] pt-8 text-[0.7rem] tracking-[0.14em] uppercase text-[var(--color-sand)] md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-8 w-8 rounded-full object-cover" />
            <span>{SITE.name}</span>
          </div>
          <p>Vitrine digital · sem pedidos online</p>
        </footer>
      </div>
    </section>
  );
}
