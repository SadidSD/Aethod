export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/yamal19",
          "/yamal19/",
          "/admin",
          "/admin/",
          "/api/",
        ],
      },
      {
        userAgent: ["GPTBot", "PerplexityBot", "ClaudeBot", "Google-Extended"],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/yamal19/", "/api/"],
      },
    ],
    sitemap: "https://www.aeethod.com/sitemap.xml",
  };
}
