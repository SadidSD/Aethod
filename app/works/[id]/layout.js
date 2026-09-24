import fs from "fs";
import path from "path";
import JsonLd from "../../components/JsonLd";

function getWorkItem(id) {
  try {
    const filePath = path.join(process.cwd(), "content", "works.json");
    if (!fs.existsSync(filePath)) return null;
    const works = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return works.find((w) => w.id === id) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const work = getWorkItem(id);

  if (!work) {
    return {
      title: "Case Study | Aeethod",
      description: "TCG platform engineering and case study by Aeethod.",
    };
  }

  const title = `${work.name} — ${work.subtitle || "TCG Platform Case Study"}`;
  const description =
    Array.isArray(work.overview) && work.overview.length
      ? work.overview[0]
      : `${work.name} custom commerce platform engineered by Aeethod.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/works/${id}`,
    },
    openGraph: {
      title: `${title} | Aeethod`,
      description,
      url: `https://aeethod.com/works/${id}`,
      images: work.heroImage ? [{ url: work.heroImage }] : undefined,
    },
  };
}

export default async function WorkDetailLayout({ children, params }) {
  const { id } = await params;
  const work = getWorkItem(id);

  const caseStudyJsonLd = work
    ? {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        headline: `${work.name} Case Study`,
        name: work.name,
        description: Array.isArray(work.overview) ? work.overview.join(" ") : work.title,
        author: {
          "@type": "Organization",
          name: "Aeethod",
          url: "https://aeethod.com",
        },
        provider: {
          "@type": "Organization",
          name: "Aeethod",
        },
        url: `https://aeethod.com/works/${id}`,
      }
    : null;

  return (
    <>
      {caseStudyJsonLd && <JsonLd data={caseStudyJsonLd} />}
      {children}
    </>
  );
}
