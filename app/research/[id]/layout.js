import fs from "fs";
import path from "path";
import JsonLd from "../../components/JsonLd";

function getResearchPaper(id) {
  try {
    const filePath = path.join(process.cwd(), "content", "research.json");
    if (!fs.existsSync(filePath)) return null;
    const papers = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return papers.find((p) => p.id === id) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const paper = getResearchPaper(id);

  if (!paper) {
    return {
      title: "Research Paper | Aeethod",
      description: "Applied systems research and technical whitepapers by Aeethod.",
    };
  }

  const fullTitle = `${paper.title} ${paper.subtitle || ""}`.trim();

  return {
    title: `${fullTitle} | Aeethod Systems Research`,
    description: paper.description,
    alternates: {
      canonical: `/research/${id}`,
    },
    openGraph: {
      title: `${fullTitle} | Aeethod Systems Research`,
      description: paper.description,
      url: `https://www.aeethod.com/research/${id}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: paper.description,
    },
  };
}

export default async function ResearchPaperLayout({ children, params }) {
  const { id } = await params;
  const paper = getResearchPaper(id);

  const fullTitle = paper ? `${paper.title} ${paper.subtitle || ""}`.trim() : null;

  const articleJsonLd = paper
    ? {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: fullTitle,
        description: paper.description,
        proficiencyLevel: "Expert",
        author: {
          "@type": "Organization",
          name: "Aeethod",
          url: "https://www.aeethod.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Aeethod",
          logo: {
            "@type": "ImageObject",
            url: "https://www.aeethod.com/android-chrome-512x512.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://www.aeethod.com/research/${id}`,
        },
      }
    : null;

  return (
    <>
      {articleJsonLd && <JsonLd data={articleJsonLd} />}
      {children}
    </>
  );
}
