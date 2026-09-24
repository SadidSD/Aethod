import fs from "fs";
import path from "path";

export default function sitemap() {
  const baseUrl = "https://aeethod.com";
  const now = new Date();

  // Static core routes
  const staticRoutes = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services/commerce`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services/integrations`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services/operations`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services/automation`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/studio`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/works`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/research`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Topical money pages
    { url: `${baseUrl}/tcg-commerce`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/custom-tcg-website`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tcg-ecommerce-platform`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tcg-inventory-system`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tcg-marketplace-integration`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tcg-buylist-system`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tcg-pricing-automation`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tcg-store-automation`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tcg-ai-agents`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/custom-tcg-software`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },

    // Decision & comparison pages
    { url: `${baseUrl}/outgrown-tcgplayer`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/when-to-leave-tcgplayer`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tcgplayer-vs-shopify`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tcg-marketplace-vs-own-website`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  // Dynamic routes loaded from content directory
  const dynamicRoutes = [];

  try {
    const contentDir = path.join(process.cwd(), "content");

    // Works / Case studies
    const worksFile = path.join(contentDir, "works.json");
    if (fs.existsSync(worksFile)) {
      const works = JSON.parse(fs.readFileSync(worksFile, "utf-8"));
      works.forEach((w) => {
        if (w.id) {
          dynamicRoutes.push({
            url: `${baseUrl}/works/${w.id}`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
          });
        }
      });
    }

    // Blog articles
    const blogFile = path.join(contentDir, "blog.json");
    if (fs.existsSync(blogFile)) {
      const blogs = JSON.parse(fs.readFileSync(blogFile, "utf-8"));
      blogs.forEach((b) => {
        if (b.id) {
          dynamicRoutes.push({
            url: `${baseUrl}/blog/${b.id}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      });
    }

    // Research papers
    const researchFile = path.join(contentDir, "research.json");
    if (fs.existsSync(researchFile)) {
      const papers = JSON.parse(fs.readFileSync(researchFile, "utf-8"));
      papers.forEach((p) => {
        if (p.id) {
          dynamicRoutes.push({
            url: `${baseUrl}/research/${p.id}`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
      });
    }
  } catch (err) {
    console.error("Error generating dynamic sitemap:", err);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
