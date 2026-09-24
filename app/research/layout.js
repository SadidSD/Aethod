import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "Applied Systems Research & Whitepapers | Aeethod",
  description:
    "Technical whitepapers on TCG pricing fragmentation, multi-agent retail architectures, inventory complexity, and modern commerce infrastructure.",
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    title: "Applied Systems Research & Whitepapers | Aeethod",
    description:
      "Technical whitepapers and system blueprints on TCG pricing fragmentation, multi-agent retail ecosystems, and predictive latency.",
    url: "https://www.aeethod.com/research",
  },
};

const researchJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Aeethod Systems Research & Blueprints",
  url: "https://www.aeethod.com/research",
  description:
    "Applied systems research on complexity, market fragmentation, and enterprise commerce architectures.",
};

export default function ResearchLayout({ children }) {
  return (
    <>
      <JsonLd data={researchJsonLd} />
      {children}
    </>
  );
}
