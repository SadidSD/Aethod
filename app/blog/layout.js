import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "TCG Commerce Insights & Systems Architecture Blog",
  description:
    "In-depth analysis on TCG market structure, multi-agent retail architectures, inventory complexity, and modern commerce infrastructure.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "TCG Commerce Insights & Systems Architecture Blog | Aeethod",
    description:
      "In-depth analysis on TCG market structure, multi-agent retail architectures, inventory complexity, and modern commerce infrastructure.",
    url: "https://www.aeethod.com/blog",
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Aeethod Insights Blog",
  url: "https://www.aeethod.com/blog",
  description:
    "Engineering insights, complexity analysis, and systems architecture for trading card commerce.",
  publisher: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
};

export default function BlogLayout({ children }) {
  return (
    <>
      <JsonLd data={blogJsonLd} />
      {children}
    </>
  );
}
