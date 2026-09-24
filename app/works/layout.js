import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "Our Work — TCG Platform Case Studies & Results",
  description:
    "Explore real-world commerce infrastructure, custom TCG platforms, and operational systems engineered by Aeethod for clients like RNG Gamez and Murakkaz.",
  alternates: {
    canonical: "/works",
  },
  openGraph: {
    title: "Our Work — TCG Platform Case Studies & Results | Aeethod",
    description:
      "Explore real-world commerce infrastructure, custom TCG platforms, and operational systems engineered by Aeethod.",
    url: "https://aeethod.com/works",
  },
};

const worksJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Aeethod Case Studies & Engineered Systems",
  url: "https://aeethod.com/works",
  description:
    "Selected implementations of custom commerce platforms, buylist systems, and automation infrastructure.",
};

export default function WorksLayout({ children }) {
  return (
    <>
      <JsonLd data={worksJsonLd} />
      {children}
    </>
  );
}
