import JsonLd from "../../components/JsonLd";

export const metadata = {
  title: "Custom TCG Commerce Platforms & Transparent Pricing ($3,500 – $18,500) | Aeethod",
  description:
    "Transparent TCG website pricing: Shopify Kickstart ($3,500), Custom Platform ($7,800), and Omnichannel ($14,500). 100% code ownership with 0% sales cut.",
  keywords: [
    "Aeethod pricing",
    "custom TCG website cost",
    "TCG website pricing",
    "TCG ecommerce packages",
    "custom card shop website price",
    "Shopify TCG kickstart cost",
    "omnichannel TCG system cost"
  ],
  alternates: {
    canonical: "/services/commerce",
  },
  openGraph: {
    title: "Custom TCG Commerce Platforms & Transparent Pricing ($3,500 – $18,500) | Aeethod",
    description:
      "Transparent TCG website pricing: Shopify Kickstart ($3,500), Custom Platform ($7,800), and Omnichannel ($14,500). 100% code ownership with 0% sales cut.",
    url: "https://www.aeethod.com/services/commerce",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Custom TCG Commerce Platforms & Development Packages",
  serviceType: "Trading Card Game E-Commerce Platform Engineering",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
  description:
    "Turnkey custom e-commerce infrastructure built specifically for high-volume trading card stores, eliminating Shopify's 100-variant limit and marketplace commissions.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "TCG Commerce Platform Engineering Packages",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Shopify TCG Kickstart",
        description: "A professionally configured Shopify storefront tailored for card shops entering online sales without custom engineering overhead.",
        priceCurrency: "USD",
        price: "3500",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "3500",
          maxPrice: "4800",
          priceCurrency: "USD",
        },
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Custom TCG Commerce Platform (Flagship)",
        description: "The dedicated high-performance storefront engineered from scratch. Solves the 100-variant limit, provides sub-second search across 100k+ singles, and captures 100% of direct sales margins.",
        priceCurrency: "USD",
        price: "7800",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "7800",
          maxPrice: "9800",
          priceCurrency: "USD",
        },
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Advanced Omnichannel TCG System",
        description: "The complete card retail operating system. Unifies your custom storefront with an automated customer buylist, live multi-channel inventory sync, and market price absorption.",
        priceCurrency: "USD",
        price: "14500",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "14500",
          maxPrice: "18500",
          priceCurrency: "USD",
        },
        availability: "https://schema.org/InStock",
      },
    ],
  },
  areaServed: "Worldwide",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Aeethod's pricing for custom TCG websites and systems?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aeethod offers three transparent turnkey deployment packages: 1) Shopify TCG Kickstart: $3,500 – $4,800 (2–3 weeks turnaround); 2) Custom TCG Commerce Platform (Flagship Standard): $7,800 – $9,800 (4–6 weeks turnkey delivery with 100% code ownership, deep variant matrix, and sub-35ms card search); 3) Advanced Omnichannel TCG System: $14,500 – $18,500 (6–8 weeks turnaround, includes customer buylist trade-in engine and real-time TCGplayer/eBay/POS sync). Aeethod charges 0% ongoing sales commissions.",
      },
    },
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
