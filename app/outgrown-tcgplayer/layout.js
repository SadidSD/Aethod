import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "Has Your TCG Store Outgrown TCGplayer? — The Decision Framework",
  description:
    "Evaluate if your card store has outgrown TCGplayer. Analyze marketplace fee erosion, customer lock-out, and the ROI of launching an owned platform.",
  alternates: {
    canonical: "/outgrown-tcgplayer",
  },
  openGraph: {
    title: "Has Your TCG Store Outgrown TCGplayer? | Aeethod",
    description:
      "A strategic operational breakdown for high-volume card retailers: commission costs, customer retention, and when to launch your own infrastructure.",
    url: "https://www.aeethod.com/outgrown-tcgplayer",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Has Your TCG Store Outgrown TCGplayer? An Operational Breakdown",
  description:
    "Detailed guide on when high-volume card shops should transition from marketplace dependence to owned commerce infrastructure.",
  author: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "At what monthly revenue does TCGplayer become too expensive?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When a store exceeds $25,000 to $30,000 in monthly GMV on TCGplayer, they are paying between $3,200 and $4,500 every single month in marketplace fees ($38,000+ annually). At this volume, a custom owned platform pays for itself within 2 to 4 months.",
      },
    },
    {
      "@type": "Question",
      name: "Should a card store stop selling on TCGplayer completely?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The optimal strategy is a hybrid model: maintain synchronized listings on TCGplayer to capture broad buyer traffic, while incentivizing repeat local and collector purchases through your owned, lower-fee direct website.",
      },
    },
  ],
};

export default function OutgrownTcgplayerLayout({ children }) {
  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
