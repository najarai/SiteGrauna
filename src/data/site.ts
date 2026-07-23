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
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Rua+Professor+Teixeira,+1480,+Centro,+Santa+Maria,+RS",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Rua%20Professor%20Teixeira%2C%201480%2C%20Centro%2C%20Santa%20Maria%2C%20RS&z=16&output=embed",
} as const;

/** Extração fiel dos PDFs (streams nativos ~528×750 / capas ~634×900). */
export const LOOKS = [
  { id: 1, src: "/looks/capa-morena-rosa-nativo.jpg", alt: "Campanha Morena Rosa — Graúna Moda", label: "Campanha" },
  { id: 2, src: "/looks/capa-maria-valentina-nativo.jpg", alt: "Campanha Maria Valentina — Graúna Moda", label: "Campanha" },
  { id: 3, src: "/looks/vestido-21417-off-white-nativo.jpg", alt: "Vestido Off White — Graúna Moda", label: "Vestido" },
  { id: 4, src: "/looks/vestido-21354-marrom-nativo.jpg", alt: "Vestido Marrom — Graúna Moda", label: "Vestido" },
  { id: 5, src: "/looks/vestido-21321-bege-bordo-nativo.jpg", alt: "Vestido Bege/bordô — Graúna Moda", label: "Vestido" },
  { id: 6, src: "/looks/vestido-21383-zebra-nativo.jpg", alt: "Vestido Estampa Zebra — Graúna Moda", label: "Vestido" },
  { id: 7, src: "/looks/vestido-10281-tuflower-nativo.jpg", alt: "Vestido Est. Tuflower — Graúna Moda", label: "Vestido" },
  { id: 8, src: "/looks/macacao-21353-bege-nativo.jpg", alt: "Macacão Bege — Graúna Moda", label: "Macacão" },
  { id: 9, src: "/looks/blusa-21378-azul-nativo.jpg", alt: "Conjunto Azul — Graúna Moda", label: "Conjunto" },
  { id: 10, src: "/looks/blusa-10261-off-white-nativo.jpg", alt: "Blusa Off White — Graúna Moda", label: "Blusa" },
  { id: 11, src: "/looks/blusa-10279-tuflower-nativo.jpg", alt: "Blusa Est. Tuflower — Graúna Moda", label: "Blusa" },
  { id: 12, src: "/looks/blusa-10306-marrom-nativo.jpg", alt: "Macacão Verde — Graúna Moda", label: "Macacão" },
  { id: 13, src: "/looks/blusa-10307-marrom-nativo.jpg", alt: "Conjunto Verde — Graúna Moda", label: "Conjunto" },
  { id: 14, src: "/looks/camisa-21401-arado-nativo.jpg", alt: "Camisa Estampa Arado — Graúna Moda", label: "Camisa" },
  { id: 15, src: "/looks/calca-21242-arado-nativo.jpg", alt: "Calça Estampa Arado — Graúna Moda", label: "Calça" },
] as const;

export const BRANDS = [
  { id: "ambicione", name: "Ambicione", src: "/brands/ambicione.png" },
  { id: "sly-wear", name: "SLY Wear", src: "/brands/sly-wear.png" },
  { id: "flor-de-lis", name: "Flor de Lis", src: "/brands/flor-de-lis.png", scale: 0.88 },
  { id: "triton", name: "Triton", src: "/brands/triton.png" },
  { id: "gatos-atos", name: "Gatos & Atos", src: "/brands/gatos-atos.png" },
  { id: "morena-rosa", name: "Grupo Morena Rosa", src: "/brands/morena-rosa.png" },
  { id: "zinco", name: "Zinco", src: "/brands/zinco.png" },
] as const;
