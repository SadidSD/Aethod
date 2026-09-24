import fs from "fs";
import { submitToIndexNow } from "../lib/seo/indexnow.js";

async function main() {
  const blogs = JSON.parse(fs.readFileSync("./content/blog.json", "utf-8"));
  const urls = [
    "/blog",
    "/sitemap.xml",
    ...blogs.map(b => `/blog/${b.id}`)
  ];
  console.log(`Submitting ${urls.length} URLs to IndexNow...`);
  const result = await submitToIndexNow(urls);
  console.log("IndexNow result:", result);
}

main();
