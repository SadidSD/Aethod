import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "TCG Marketplace vs. Own Website — The Complete Strategic Comparison",
  description:
    "Should your card shop rely on TCGplayer & eBay or build an owned store? Compare marketplace take rates, customer retention, and brand equity.",
  alternates: {
    canonical: "/tcg-marketplace-vs-own-website",
  },
  openGraph: {
    title: "TCG Marketplace vs. Own Website | Aeethod",
    description:
      "A strategic comparison of margins, customer lifetime value, and operational control between marketplace dependency and owned commerce.",
    url: "https://www.aeethod.com/tcg-marketplace-vs-own-website",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "TCG Marketplace vs. Own Website: The Operational Comparison",
  description:
    "Detailed guide on the trade-offs between third-party trading card marketplaces and owned e-commerce infrastructure.",
  author: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
};

export default function TcgMarketplaceVsOwnWebsiteLayout({ children }) {
  return (
    <>
      <JsonLd data={articleJsonLd} />
      {children}
    </>
  );
}
