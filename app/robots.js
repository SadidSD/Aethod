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
    ],
    sitemap: "https://aeethod.com/sitemap.xml",
  };
}
