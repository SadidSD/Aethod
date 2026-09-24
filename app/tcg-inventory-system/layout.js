import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "TCG Inventory Management System — Multi-Channel Card Software",
  description:
    "TCG inventory system for card shops. Real-time multi-channel sync, condition-level SKU normalization, and instant delisting across TCGplayer and eBay.",
  alternates: {
    canonical: "/tcg-inventory-system",
  },
  openGraph: {
    title: "TCG Inventory Management System — Multi-Channel Card Software | Aeethod",
    description:
      "Master inventory architecture for trading card retailers managing 100k+ singles across web, eBay, TCGplayer, and in-store POS.",
    url: "https://www.aeethod.com/tcg-inventory-system",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TCG Inventory Management System",
  serviceType: "Trading Card Inventory Engineering",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
  description:
    "Central source of truth for trading card inventory. Synchronizes singles, sealed product, and condition variants across web, POS, and marketplaces in real time.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does TCG inventory management differ from regular retail inventory?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Regular retail tracks identical items with a single barcode. TCG inventory requires multi-condition tracking (NM/LP/MP/HP/DMG), language, foil finishes, first edition status, and graded slab certification numbers for the exact same underlying card title.",
      },
    },
    {
      "@type": "Question",
      name: "How does the system prevent double-selling on eBay and TCGplayer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The system runs an event-driven webhook pipeline that delists or decrements quantity on all other connected channels in under 2 seconds whenever a sale finalizes.",
      },
    },
  ],
};

export default function TcgInventorySystemLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
