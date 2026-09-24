import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "Custom TCG Buylist & Trade-In Software — Turnkey Portals",
  description:
    "Automate card intake and trade-ins with custom TCG buylist software. Real-time market valuation, cash vs. store credit bonuses, and counter receipt printing.",
  alternates: {
    canonical: "/tcg-buylist-system",
  },
  openGraph: {
    title: "Custom TCG Buylist & Trade-In Software | Aeethod",
    description:
      "Automate card intake and trade-ins with custom TCG buylist software. Cash vs. store credit bonuses and thermal receipt printing.",
    url: "https://www.aeethod.com/tcg-buylist-system",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Custom TCG Buylist & Trade-In Software",
  serviceType: "Trading Card Buylist Software Engineering",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
  description:
    "Turnkey buylist and trade-in software for card shops. Dynamic valuation formulas, condition grading reconciliation, and thermal barcode intake.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does a custom buylist system make card shops more profitable?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Acquiring cards via customer trade-ins yields 45% to 65% profit margins compared to buying sealed distributor cases at 15% margins. A 24/7 online buylist brings high-margin inventory directly to your counter.",
      },
    },
    {
      "@type": "Question",
      name: "How does the buylist handle condition disputes with customers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The software embeds high-resolution condition standards (NM/LP/MP/HP/DMG). When staff adjust condition at intake, the customer receives an automated notification with adjusted payout approval.",
      },
    },
  ],
};

export default function TcgBuylistSystemLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
