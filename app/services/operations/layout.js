import JsonLd from "../../components/JsonLd";

export const metadata = {
  title: "TCG Operations Systems — Automated Buylist & Grading",
  description:
    "Automate card intake, trade-ins, condition verification (NM/LP/MP/HP/DMG), and thermal barcode batching. Built for card shops processing thousands of singles daily.",
  alternates: {
    canonical: "/services/operations",
  },
  openGraph: {
    title: "TCG Operations Systems — Automated Buylist & Grading | Aeethod",
    description:
      "Automate card intake, trade-ins, condition verification (NM/LP/MP/HP/DMG), and thermal barcode batching for high-volume card shops.",
    url: "https://aeethod.com/services/operations",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TCG Operations Systems & Buylist Portals",
  serviceType: "Trading Card Buylist & Operations Engineering",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://aeethod.com",
  },
  description:
    "Behind-the-counter operational infrastructure for card shops: automated buylists, 5-tier condition grading matrices, and thermal receipt intake terminals.",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "3400",
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
      name: "Can we set different cash/credit buy rates for Pokémon, Magic, and One Piece?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The valuation matrix allows you to set custom rules per game, set, rarity, or card price tier (e.g., 65% cash for Pokémon meta staples, 50% for bulk foils, 80% store credit on vintage).",
      },
    },
    {
      "@type": "Question",
      name: "How does the buylist handle cards that don't match the customer's claimed condition?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Staff can click to adjust condition during intake (e.g., NM down to MP). The system automatically re-calculates the payout and prints a revised counter slip or emails an approval request to the customer.",
      },
    },
    {
      "@type": "Question",
      name: "Does this connect to our existing thermal receipt printers and barcode scanners?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We configure standard ESC/POS thermal receipt printers (Epson, Star Micronics) and 2D barcode scanners so intake tickets and inventory labels print with one click.",
      },
    },
    {
      "@type": "Question",
      name: "Can we restrict which employees are authorized to pay out cash trades over $200?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The system includes role-based permissions, requiring a manager PIN or override for trade-ins exceeding your specified cash threshold.",
      },
    },
    {
      "@type": "Question",
      name: "How is Aeethod different from SaaS tools like BinderPOS or CardCastle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Those platforms charge $300 to $1,000+ every month and lock your data inside their walled garden. Aeethod builds a dedicated operational engine that you own 100% with zero recurring software taxes.",
      },
    },
  ],
};

export default function OperationsLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
