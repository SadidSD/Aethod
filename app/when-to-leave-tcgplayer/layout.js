import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "When Should a TCG Store Build Its Own Website? — Strategic Guide",
  description:
    "The operational milestones and financial tipping points for when a card shop should transition from marketplace seller to independent direct commerce brand.",
  alternates: {
    canonical: "/when-to-leave-tcgplayer",
  },
  openGraph: {
    title: "When Should a TCG Store Build Its Own Website? | Aeethod",
    description:
      "Strategic guide outlining revenue triggers, SKU counts, and operational milestones for launching an owned TCG website.",
    url: "https://www.aeethod.com/when-to-leave-tcgplayer",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "When Should a TCG Store Build Its Own Website?",
  description:
    "A comprehensive milestone guide for trading card store owners evaluating the right time to launch an independent e-commerce storefront.",
  author: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
};

export default function WhenToLeaveTcgplayerLayout({ children }) {
  return (
    <>
      <JsonLd data={articleJsonLd} />
      {children}
    </>
  );
}
