async function verifyPage(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
    const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
    const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

    console.log(`\n=== VERIFYING: ${url} ===`);
    console.log("Status:", res.status);
    console.log("Title:", titleMatch ? titleMatch[1] : "NONE");
    console.log("Description:", descMatch ? descMatch[1] : "NONE");
    console.log("Canonical:", canonicalMatch ? canonicalMatch[1] : "NONE");
    console.log("JSON-LD Schemas found:", jsonLdMatches.length);
    jsonLdMatches.forEach((m, idx) => {
      try {
        const parsed = JSON.parse(m[1]);
        console.log(`  Schema ${idx + 1}: @type=${parsed["@type"]} | ${parsed.name || parsed.headline || ""}`);
      } catch (err) {
        console.log(`  Schema ${idx + 1}: Error parsing JSON: ${err.message}`);
      }
    });
  } catch (err) {
    console.error(`Failed to verify ${url}:`, err.message);
  }
}

async function run() {
  await verifyPage("http://localhost:3000/");
  await verifyPage("http://localhost:3000/services/commerce");
  await verifyPage("http://localhost:3000/tcg-commerce");
  await verifyPage("http://localhost:3000/custom-tcg-website");
  await verifyPage("http://localhost:3000/outgrown-tcgplayer");
  await verifyPage("http://localhost:3000/works/rng-gamez");
}

run();
