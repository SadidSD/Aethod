import JsonLd from "../../components/JsonLd";

export const metadata = {
  title: "TCG Marketplace Integration — Real-Time Multi-Channel Sync",
  description:
    "Eliminate double-selling across TCGplayer, eBay, Shopify, Cardmarket, and ManaPool with sub-2-second auto-delisting webhooks and master SKU canonicalization.",
  alternates: {
    canonical: "/services/integrations",
  },
  openGraph: {
    title: "TCG Marketplace Integration — Real-Time Multi-Channel Sync | Aeethod",
    description:
      "Eliminate double-selling across TCGplayer, eBay, Shopify, Cardmarket, and ManaPool with sub-2-second auto-delisting webhooks and master SKU canonicalization.",
    url: "https://www.aeethod.com/services/integrations",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TCG Marketplace & Inventory Concurrency Integration",
  serviceType: "Multi-Channel TCG Inventory Synchronization",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
  description:
    "Real-time bidirectional inventory synchronization between custom storefronts, TCGplayer Pro, eBay, Cardmarket, and in-store POS systems.",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "3800",
    availability: "https://schema.org/InStock",
  },
  areaServed: "Worldwide",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What happens if a customer buys a card in my physical store while someone is checking out on eBay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our concurrency race arbiter immediately processes whichever transaction finalizes first and sends an instant zero-stock webhook to the other platform in under 2 seconds, locking out duplicate transactions.",
      },
    },
    {
      "@type": "Question",
      name: "Can we keep our existing physical POS register like Square or Shopify POS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We build custom API connectors for major POS systems, or bridge them with lightweight counter barcode scanners to register sales in real time.",
      },
    },
    {
      "@type": "Question",
      name: "Do we need to delete and re-list all our existing active cards on eBay or TCGplayer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Our Master SKU Canonicalization engine reads your existing active listings across platforms and matches them to your master inventory without needing to delete and recreate listings.",
      },
    },
    {
      "@type": "Question",
      name: "How is Aeethod different from third-party sync SaaS tools like BinderPOS or ChannelEngine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Third-party SaaS tools charge $300 to $1,200/month plus transaction percentages, yet frequently lag by 15 to 45 minutes, causing double-sales during high-demand releases. Aeethod builds a dedicated real-time event pipeline that you own permanently with zero monthly SaaS taxes.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a full multi-channel integration deployment take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A turnkey Omnichannel Tri-Sync integration typically deploys within 4 to 5 weeks from initial API credentials audit to live shadow testing and staff hand-off.",
      },
    },
  ],
};

export default function IntegrationsLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
