export const SITE = {
  name: "Graúna Moda",
  tagline: "Moda Feminina",
  city: "Santa Maria | RS",
  address: "Rua Professor Teixeira, 1480 — Centro",
  whatsapp: "555532234742",
  whatsappUrl: "https://wa.me/555532234742",
  instagram: "https://www.instagram.com/graunamoda/",
  instagramHandle: "@graunamoda",
  hoursNote: "Vitrines às terças e sextas",
  serviceNote: "Atendimento exclusivamente por WhatsApp",
} as const;

export const LOOKS = Array.from({ length: 15 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    id: i + 1,
    src: `/looks/look-${n}.jpg`,
    alt: `Look Graúna Moda ${i + 1} — Coleção Primavera Verão`,
  };
});

export const BRANDS = [
  { id: "ambicione", name: "Ambicione", src: "/brands/ambicione.png" },
  { id: "sly-wear", name: "SLY Wear", src: "/brands/sly-wear.png" },
  { id: "flor-de-lis", name: "Flor de Lis", src: "/brands/flor-de-lis.png", scale: 0.88 },
  { id: "triton", name: "Triton", src: "/brands/triton.png" },
  { id: "gatos-atos", name: "Gatos & Atos", src: "/brands/gatos-atos.png" },
  { id: "morena-rosa", name: "Grupo Morena Rosa", src: "/brands/morena-rosa.png" },
  { id: "zinco", name: "Zinco", src: "/brands/zinco.png" },
] as const;
