import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "TCG E-Commerce Platform Architecture & Software",
  description:
    "An enterprise-grade TCG e-commerce platform built for high-volume card retail. Edge-cached search, unified buylist, and real-time marketplace inventory synchronization.",
  alternates: {
    canonical: "/tcg-ecommerce-platform",
  },
  openGraph: {
    title: "TCG E-Commerce Platform Architecture & Software | Aeethod",
    description:
      "Enterprise e-commerce platform engineering designed specifically for trading card games.",
    url: "https://aeethod.com/tcg-ecommerce-platform",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TCG E-Commerce Platform Architecture",
  serviceType: "E-Commerce Software Engineering",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://aeethod.com",
  },
  description:
    "Full-stack digital infrastructure for card retailers combining custom storefronts, real-time sync, and counter intake.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What makes an e-commerce platform specifically suited for TCG retail?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A TCG-specific e-commerce platform accommodates deep single-card catalogs (50k+ SKUs), condition grading matrices, sub-second facet filtering, and automated buylist trade-in valuations.",
      },
    },
    {
      "@type": "Question",
      name: "Can the platform scale during massive new set releases?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our platforms utilize edge caching and serverless execution designed to withstand traffic spikes of 10,000+ concurrent collectors during midnight pre-orders and booster box drops.",
      },
    },
  ],
};

export default function TcgEcommercePlatformLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
