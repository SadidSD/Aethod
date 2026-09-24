import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "TCG Commerce Services — Custom Storefronts, Integrations & Automation",
  description:
    "Specialized digital systems for TCG stores outgrowing their marketplaces. Custom e-commerce platforms, real-time inventory synchronization, buylists, and repricing.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "TCG Commerce Services — Custom Storefronts, Integrations & Automation",
    description:
      "Specialized digital systems for TCG stores outgrowing their marketplaces. Custom e-commerce platforms, real-time inventory synchronization, buylists, and repricing.",
    url: "https://aeethod.com/services",
  },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Aeethod TCG Commerce Services",
  description:
    "End-to-end commerce infrastructure modules for high-volume trading card game retailers.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Custom Commerce Platforms",
      url: "https://aeethod.com/services/commerce",
      description:
        "High-velocity storefronts engineered for TCG singles, sealed product, condition variants, and sub-second facet filtering.",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Marketplace & Concurrency Integration",
      url: "https://aeethod.com/services/integrations",
      description:
        "Real-time bidirectional inventory synchronization between custom storefronts, TCGplayer, eBay, Cardmarket, and POS systems.",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "TCG Operations & Buylist Systems",
      url: "https://aeethod.com/services/operations",
      description:
        "Automated card intake terminals, condition grading matrices, and customer-facing buylist portals.",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Business Automation & Dynamic Repricing",
      url: "https://aeethod.com/services/automation",
      description:
        "Tournament spike repricers, undercut defense algorithms, and automated thermal batch shipping systems.",
    },
  ],
};

export default function ServicesLayout({ children }) {
  return (
    <>
      <JsonLd data={servicesJsonLd} />
      {children}
    </>
  );
}
