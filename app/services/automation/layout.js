import JsonLd from "../../components/JsonLd";

export const metadata = {
  title: "TCG Business Automation — Dynamic Repricing & Batch Fulfillment",
  description:
    "Algorithmic market repricing, tournament spike detection, undercut defense, and automated thermal batch fulfillment for high-volume TCG retailers.",
  alternates: {
    canonical: "/services/automation",
  },
  openGraph: {
    title: "TCG Business Automation — Dynamic Repricing & Batch Fulfillment | Aeethod",
    description:
      "Algorithmic market repricing, tournament spike detection, undercut defense, and automated thermal batch fulfillment for high-volume TCG retailers.",
    url: "https://aeethod.com/services/automation",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TCG Business Automation & Dynamic Repricing",
  serviceType: "Algorithmic Card Repricing & Fulfillment Automation",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://aeethod.com",
  },
  description:
    "Automated dynamic repricing rules, tournament spike detection, 1-click batch thermal label generation, and high-speed scanner intake pipelines.",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "3200",
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
      name: "Will the repricer ever accidentally sell our cards below what we paid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Never. Every card in your catalog is locked with a hard profit floor. Even if a competitor creates a fraudulent low-ball listing, the algorithm will never drop below your specified minimum margin.",
      },
    },
    {
      "@type": "Question",
      name: "How does 1-click thermal batch fulfillment work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Instead of generating shipping labels individually across TCGplayer, eBay, and your website, Aeethod pools all pending orders into a unified queue. One click prints all 4x6 labels and packing slips directly to your thermal printer while automatically pushing tracking numbers back to all marketplaces.",
      },
    },
    {
      "@type": "Question",
      name: "Can we exclude vintage or high-value cards from automatic repricing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can easily mark specific cards, graded slabs, or entire sets as 'Manual Price Only' so automated rules will never touch them.",
      },
    },
    {
      "@type": "Question",
      name: "Do we have to pay monthly subscription fees for repricing or shipping?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Third-party tools charge $300 to $800+ every month. Aeethod builds dedicated cloud pipelines running on serverless infrastructure that you own forever with zero recurring software taxes.",
      },
    },
    {
      "@type": "Question",
      name: "Does this integrate with optical card scanners for fast intake?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We integrate high-speed card scanner feeds into our master catalog pipeline, allowing your staff to scan up to 60 singles per minute directly into inventory.",
      },
    },
  ],
};

export default function AutomationLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
