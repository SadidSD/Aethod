import fs from "fs";
import path from "path";
import JsonLd from "../../components/JsonLd";

function getBlogPost(id) {
  try {
    const filePath = path.join(process.cwd(), "content", "blog.json");
    if (!fs.existsSync(filePath)) return null;
    const posts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return posts.find((p) => p.id === id) || null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), "content", "blog.json");
    if (!fs.existsSync(filePath)) return [];
    const posts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return posts.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = getBlogPost(id);

  if (!post) {
    return {
      title: "Insights Article | Aeethod",
      description: "Systems architecture and TCG commerce research by Aeethod.",
    };
  }

  const metaDescription =
    post.description && post.description.length > 158
      ? post.description.slice(0, 155).trim() + "..."
      : post.description || "Systems architecture and TCG commerce research by Aeethod.";

  return {
    title: `${post.title} | Aeethod Insights`,
    description: metaDescription,
    alternates: {
      canonical: `/blog/${id}`,
    },
    openGraph: {
      title: `${post.title} | Aeethod Insights`,
      description: metaDescription,
      url: `https://www.aeethod.com/blog/${id}`,
      type: "article",
      images: post.illustration ? [{ url: post.illustration }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: metaDescription,
    },
  };
}

export default async function BlogPostLayout({ children, params }) {
  const { id } = await params;
  const post = getBlogPost(id);

  const blogPostJsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        articleSection: post.topic,
        keywords: Array.isArray(post.tags) ? post.tags.join(", ") : undefined,
        author: {
          "@type": "Person",
          name: post.author || "Sadid Bin Hasan",
          jobTitle: post.authorRole || "Founder & Principal Systems Architect",
          url: "https://www.aeethod.com/studio",
          sameAs: [
            "https://github.com/SadidSD",
            "https://www.linkedin.com/in/sadidbinhasan",
          ],
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
          "@id": `https://www.aeethod.com/blog/${id}`,
        },
      }
    : null;

  return (
    <>
      {blogPostJsonLd && <JsonLd data={blogPostJsonLd} />}
      {children}
    </>
  );
}
