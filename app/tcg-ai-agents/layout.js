import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "TCG AI Agents & Autonomous Retail Intelligence",
  description:
    "Deploy specialized AI agents for card retail: 24/7 card condition answering, automated buylist drafting, inventory replenishment, and customer support.",
  alternates: {
    canonical: "/tcg-ai-agents",
  },
  openGraph: {
    title: "TCG AI Agents & Autonomous Retail Intelligence | Aeethod",
    description:
      "Specialized AI agents for trading card retail: condition verification, automated buylist drafting, and 24/7 collector support.",
    url: "https://www.aeethod.com/tcg-ai-agents",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TCG AI Agents & Autonomous Intelligence",
  serviceType: "Artificial Intelligence Software Engineering",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
  description:
    "Domain-specific AI agents engineered for trading card game commerce, automating inventory monitoring, customer inquiries, and trade valuations.",
};

export default function TcgAiAgentsLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      {children}
    </>
  );
}
