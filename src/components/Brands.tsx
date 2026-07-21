import { motion } from "framer-motion";
import { BRANDS } from "../data/site";

export function Brands() {
  return (
    <section id="marcas" className="relative px-5 py-24 md:px-8 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--color-terra)_12%,transparent),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-[0.7rem] tracking-[0.28em] uppercase text-[var(--color-terra)]">
            Seleção
          </p>
          <h2 className="font-display text-4xl md:text-6xl">
            Marcas <span className="italic text-[var(--color-cream-dim)]">na loja</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-[var(--color-cream-dim)] md:text-base">
            As labels que vestem a Graúna — as mesmas que você encontra nos destaques do Instagram.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
          {BRANDS.map((brand, i) => (
            <motion.article
              key={brand.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="glass flex flex-col items-center gap-4 rounded-2xl px-4 py-8"
            >
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[var(--color-cream-dim)] md:h-28 md:w-28">
                <img
                  src={brand.src}
                  alt={brand.name}
                  className="h-full w-full object-cover"
                  style={"scale" in brand && brand.scale ? { transform: `scale(${brand.scale})` } : undefined}
                />
              </div>
              <h3 className="text-center text-[0.72rem] tracking-[0.16em] uppercase text-[var(--color-cream-dim)]">
                {brand.name}
              </h3>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
