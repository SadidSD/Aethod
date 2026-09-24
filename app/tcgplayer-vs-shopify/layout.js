import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "TCGplayer vs. Shopify vs. Custom TCG Platform — Comparison Matrix",
  description:
    "An objective, feature-by-feature architectural comparison of TCGplayer, generic Shopify themes, and Aeethod's custom TCG platform.",
  alternates: {
    canonical: "/tcgplayer-vs-shopify",
  },
  openGraph: {
    title: "TCGplayer vs. Shopify vs. Custom TCG Platform | Aeethod",
    description:
      "A complete technical and financial breakdown across commissions, variant limits, search latency, and inventory control.",
    url: "https://www.aeethod.com/tcgplayer-vs-shopify",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "TCGplayer vs. Shopify vs. Custom TCG Platform: The Definitive Comparison",
  description:
    "Architectural and financial comparison between third-party marketplaces, standard e-commerce SaaS, and custom-built card retail systems.",
  author: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
};

export default function TcgplayerVsShopifyLayout({ children }) {
  return (
    <>
      <JsonLd data={articleJsonLd} />
      {children}
    </>
  );
}
