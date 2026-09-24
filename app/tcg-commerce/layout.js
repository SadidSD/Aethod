import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "TCG Commerce Systems — Custom Platforms, Inventory & Automation",
  description:
    "Aeethod architects dedicated TCG commerce platforms for high-volume card retailers. Sub-35ms catalog search, 100k+ singles variant support, and real-time marketplace synchronization.",
  alternates: {
    canonical: "/tcg-commerce",
  },
  openGraph: {
    title: "TCG Commerce Systems — Custom Platforms, Inventory & Automation | Aeethod",
    description:
      "Enterprise commerce infrastructure engineered specifically for trading card retail.",
    url: "https://www.aeethod.com/tcg-commerce",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TCG Commerce Systems Architecture",
  serviceType: "Trading Card Game Digital Infrastructure",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
  description:
    "Dedicated digital infrastructure for high-scale TCG stores: custom storefronts, multi-channel marketplace synchronization, and buylist automation.",
  areaServed: "Worldwide",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why do standard e-commerce platforms fail for TCG stores?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard platforms like Shopify limit products to 100 variants and slow down when catalogs exceed 10,000 singles. TCG singles require multi-dimensional variant tracking (condition, finish, language, edition) and sub-second filtering by set and collector number.",
      },
    },
    {
      "@type": "Question",
      name: "How does Aeethod handle inventory synchronization across multiple marketplaces?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We deploy sub-2-second event webhooks that automatically delist cards on TCGplayer, eBay, Cardmarket, and ManaPool when an item is purchased in-store or online.",
      },
    },
    {
      "@type": "Question",
      name: "Does Aeethod charge a percentage of sales like TCGplayer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Aeethod builds owned infrastructure. You pay standard payment processing fees (Stripe/Shopify Payments), keeping 100% of your retail margins.",
      },
    },
  ],
};

export default function TcgCommerceLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
