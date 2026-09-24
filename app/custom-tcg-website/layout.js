import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "Custom TCG Website Development — Built for Card Stores",
  description:
    "Engineering high-performance custom TCG websites. Sub-35ms card filtering, PSA/BGS slab integration, 100% owned customer data, and zero 100-variant limits.",
  alternates: {
    canonical: "/custom-tcg-website",
  },
  openGraph: {
    title: "Custom TCG Website Development — Built for Card Stores | Aeethod",
    description:
      "Engineering high-performance custom TCG websites with sub-35ms card filtering, buylist integration, and zero marketplace commissions.",
    url: "https://www.aeethod.com/custom-tcg-website",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Custom TCG Website Development",
  serviceType: "Trading Card E-Commerce Development",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
  description:
    "Turnkey custom website engineering for trading card retailers. Fast search, condition variant handling, and direct buylist integration.",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "4800",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does a custom TCG website cost to build?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Custom TCG platforms typically range from $4,800 for an optimized custom storefront to $14,000+ for enterprise omnichannel infrastructure with automated buylists and multi-channel synchronization.",
      },
    },
    {
      "@type": "Question",
      name: "How does a custom card shop website handle Pokémon and Magic card variants?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike Shopify which enforces a strict 100-variant cap, our custom architecture indexes condition (NM/LP/MP/HP/DMG), finish (Foil, Non-Foil, Reverse), and grading slabs at the edge, supporting 300+ variants per card on a single canonical page.",
      },
    },
    {
      "@type": "Question",
      name: "How long does custom TCG website development take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Typical development and catalog migration takes between 4 and 6 weeks from initial architecture design to production cutover.",
      },
    },
  ],
};

export default function CustomTcgWebsiteLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
