import JsonLd from "../components/JsonLd";

export const metadata = {
  title: "Custom TCG Software Engineering — Tailored Retail Systems",
  description:
    "Bespoke software engineering for card shops, distributors, and TCG platforms. Custom inventory pipelines, POS bridges, and high-velocity applications.",
  alternates: {
    canonical: "/custom-tcg-software",
  },
  openGraph: {
    title: "Custom TCG Software Engineering — Tailored Retail Systems | Aeethod",
    description:
      "Bespoke software engineering for enterprise card shops, distributors, and TCG platforms.",
    url: "https://www.aeethod.com/custom-tcg-software",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Custom TCG Software Engineering",
  serviceType: "Custom Software Engineering",
  provider: {
    "@type": "Organization",
    name: "Aeethod",
    url: "https://www.aeethod.com",
  },
  description:
    "Tailored engineering for complex card retail workflows: POS custom connectors, private marketplace applications, and high-throughput inventory pipelines.",
};

export default function CustomTcgSoftwareLayout({ children }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      {children}
    </>
  );
}
