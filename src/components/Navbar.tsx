import { motion } from "framer-motion";
import { SITE } from "../data/site";

const links = [
  { href: "#colecao", label: "Coleção" },
  { href: "#marcas", label: "Marcas" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-30"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <a href="#topo" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt={SITE.name}
            className="h-11 w-11 rounded-full object-cover ring-1 ring-white/20"
          />
          <div className="leading-tight">
            <div className="font-display text-xl tracking-[0.08em] uppercase">{SITE.name}</div>
            <div className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-cream-dim)]">
              {SITE.tagline}
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.72rem] tracking-[0.18em] uppercase text-[var(--color-cream-dim)] transition-colors hover:text-[var(--color-cream)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary !py-2.5 !px-4 text-[0.68rem]">
          WhatsApp
        </a>
      </div>
    </motion.header>
  );
}
