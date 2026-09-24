import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "TCG Marketplace Integration — TCGplayer, eBay & Shopify Sync",
  description:
    "Real-time bidirectional inventory synchronization for TCG sellers. Connect your website, TCGplayer Pro, eBay, Cardmarket, and POS with sub-2s auto-delisting.",
  alternates: {
    canonical: "/tcg-marketplace-integration",
  },
  openGraph: {
    title: "TCG Marketplace Integration — TCGplayer, eBay & Shopify Sync | Aeethod",
    description:
      "Real-time bidirectional inventory synchronization across TCGplayer, eBay, Shopify, and in-store POS.",
    url: "https://www.aeethod.com/tcg-marketplace-integration",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TCG Marketplace Integration Services",
  serviceType: "E-Commerce Integration Engineering",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
  description:
    "Real-time event pipeline synchronizing trading card inventory across TCGplayer, eBay, Cardmarket, and custom storefronts.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Aeethod integrate with TCGplayer Pro and eBay APIs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We build direct authorized API integrations using official seller APIs. When a sale occurs on your website, our system sends instantaneous inventory decrement and delist requests to TCGplayer and eBay.",
      },
    },
    {
      "@type": "Question",
      name: "Can we set different prices on eBay vs. our own website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our pricing engine lets you mark up eBay and TCGplayer prices (e.g., +13%) to offset their commission fees while offering the lowest competitive prices directly on your own website.",
      },
    },
  ],
};

export default function TcgMarketplaceIntegrationLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
