import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "TCG Pricing Automation — Algorithmic Card Repricing Engine",
  description:
    "Protect margins and capture tournament demand with algorithmic TCG repricing. Automated spike detection, undercut defense, and hard minimum profit floors.",
  alternates: {
    canonical: "/tcg-pricing-automation",
  },
  openGraph: {
    title: "TCG Pricing Automation — Algorithmic Card Repricing Engine | Aeethod",
    description:
      "Automated card repricing: tournament spike capture, undercut defense, and hard profit floors across TCGplayer, eBay, and web.",
    url: "https://aeethod.com/tcg-pricing-automation",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TCG Pricing Automation Engine",
  serviceType: "Algorithmic Pricing Software Engineering",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://aeethod.com",
  },
  description:
    "Automated dynamic repricing engine for card retailers. Adjusts prices in response to tournament meta shifts, market index trends, and competitor listing actions.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Will the repricer ever sell cards below cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Never. Every card or set is assigned a strict profit floor rule. The algorithm will never undercut competitors below your minimum target margin.",
      },
    },
    {
      "@type": "Question",
      name: "How fast does the algorithm respond to tournament spikes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our engine detects sudden market liquidity drains and sales spikes within minutes, automatically updating your listings before competitors or buy-out bots can sweep your stock at stale low prices.",
      },
    },
  ],
};

export default function TcgPricingAutomationLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
