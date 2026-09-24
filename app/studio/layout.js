import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "About Aeethod — Vertical TCG Technology Studio",
  description:
    "Aeethod is not a generic agency or off-the-shelf SaaS. We are a vertical technology studio engineering custom commerce platforms, inventory synchronization, and automation for growing card retailers.",
  alternates: {
    canonical: "/studio",
  },
  openGraph: {
    title: "About Aeethod — Vertical TCG Technology Studio",
    description:
      "Platforms help you start. Custom infrastructure lets you scale. When your TCG business outgrows its tools, we build what comes next.",
    url: "https://aeethod.com/studio",
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Aeethod",
  url: "https://aeethod.com/studio",
  description:
    "Aeethod is a vertical technology studio that architects custom digital infrastructure for high-scale TCG businesses.",
  mainEntity: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://aeethod.com",
    knowsAbout: [
      "TCG Commerce Architecture",
      "Trading Card Game Systems",
      "Inventory Concurrency Engineering",
      "Retail Automation",
    ],
  },
};

export default function StudioLayout({ children }) {
  return (
    <>
      <JsonLd data={aboutJsonLd} />
      {children}
    </>
  );
}
