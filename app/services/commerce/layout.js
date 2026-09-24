import JsonLd from "../../components/JsonLd";

export const metadata = {
  title: "Custom TCG Commerce Platforms — High-Volume Storefronts",
  description:
    "High-velocity custom storefronts built specifically for trading card games. Sub-35ms facet filtering, 100k+ singles SKU capacity, zero 100-variant limit, and direct buylist integration.",
  alternates: {
    canonical: "/services/commerce",
  },
  openGraph: {
    title: "Custom TCG Commerce Platforms — High-Volume Storefronts | Aeethod",
    description:
      "High-velocity custom storefronts engineered for TCG singles, sealed product, condition variants, and sub-35ms facet filtering.",
    url: "https://aeethod.com/services/commerce",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Custom TCG Commerce Platforms",
  serviceType: "Trading Card Game E-Commerce Platform Engineering",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://aeethod.com",
  },
  description:
    "Turnkey custom e-commerce infrastructure built specifically for high-volume trading card stores, eliminating Shopify's 100-variant limit and marketplace commissions.",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "4800",
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
      name: "Can you migrate our existing Shopify or BinderPOS inventory without losing card stock?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We perform automated schema migrations for your singles, sealed inventory, product variants, and customer accounts. We run side-by-side reconciliation tests before flipping the switch so not a single card is double-sold or lost during the transition.",
      },
    },
    {
      "@type": "Question",
      name: "How does your system solve Shopify's 100-variant limit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard Shopify treats each variation as a separate variant in a rigid database row capped at 100. Our custom architecture indexes condition, finish, language, and slab certification in a high-speed matrix at the edge. A single card page can represent 300+ variations with instant price and stock switching.",
      },
    },
    {
      "@type": "Question",
      name: "Do we pay Aeethod any monthly percentage of our card sales?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Unlike third-party SaaS platforms or marketplaces that demand 12% to 15% revenue cuts, Aeethod charges zero recurring sales percentage. You pay standard payment gateway fees, and the platform is your owned business asset.",
      },
    },
    {
      "@type": "Question",
      name: "Can customers use store credit earned from in-store buylist trade-ins online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Store credit balances can be unified so a customer trading in a binder at your counter can immediately use that balance online or vice versa.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a custom commerce platform deployment take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A turnkey Custom Commerce Platform typically launches within 4 to 6 weeks from initial architecture mapping to final launch, including catalog migration, payment gateway setup, and staff onboarding.",
      },
    },
  ],
};

export default function CommerceLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
