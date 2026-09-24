import sharp from "sharp";
import fs from "fs";
import path from "path";

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#181826" />
      <stop offset="60%" stop-color="#0a0a0f" />
      <stop offset="100%" stop-color="#050508" />
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />
  <circle cx="600" cy="220" r="420" fill="url(#glow)" />

  <!-- Subtle grid lines -->
  <g stroke="rgba(255,255,255,0.04)" stroke-width="1">
    <line x1="0" y1="105" x2="1200" y2="105" />
    <line x1="0" y1="210" x2="1200" y2="210" />
    <line x1="0" y1="315" x2="1200" y2="315" />
    <line x1="0" y1="420" x2="1200" y2="420" />
    <line x1="0" y1="525" x2="1200" y2="525" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
  </g>

  <!-- Top Badge -->
  <rect x="445" y="105" width="310" height="36" rx="18" fill="rgba(99, 102, 241, 0.12)" stroke="rgba(99, 102, 241, 0.4)" stroke-width="1" />
  <text x="600" y="128" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#a5b4fc" text-anchor="middle" letter-spacing="2">TCG COMMERCE TECHNOLOGY STUDIO</text>

  <!-- Brand Title -->
  <text x="600" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="68" font-weight="800" fill="url(#titleGrad)" text-anchor="middle" letter-spacing="-1.5">Aeethod</text>

  <!-- Tagline -->
  <text x="600" y="305" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="500" fill="#e2e8f0" text-anchor="middle">Infrastructure Beyond The Platform</text>

  <!-- Description paragraph -->
  <text x="600" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="400" fill="#94a3b8" text-anchor="middle">Custom Card Shop Storefronts · Real-Time Marketplace Sync · Automated Buylists · Algorithmic Repricing</text>

  <!-- Feature pills -->
  <g transform="translate(180, 425)">
    <rect x="0" y="0" width="195" height="46" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
    <text x="97" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#cbd5e1" text-anchor="middle">Custom Storefronts</text>

    <rect x="215" y="0" width="195" height="46" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
    <text x="312" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#cbd5e1" text-anchor="middle">TCGplayer &amp; eBay Sync</text>

    <rect x="430" y="0" width="195" height="46" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
    <text x="527" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#cbd5e1" text-anchor="middle">Buylist Automation</text>

    <rect x="645" y="0" width="195" height="46" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
    <text x="742" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#cbd5e1" text-anchor="middle">Market Repricing</text>
  </g>

  <!-- Footer URL -->
  <text x="600" y="565" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600" fill="#64748b" text-anchor="middle" letter-spacing="1.5">aeethod.com</text>
</svg>
`;

async function main() {
  const publicDir = path.resolve("public");
  const appDir = path.resolve("app");
  
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  
  fs.writeFileSync(path.join(publicDir, "og-image.png"), buffer);
  fs.writeFileSync(path.join(appDir, "opengraph-image.png"), buffer);
  fs.writeFileSync(path.join(appDir, "opengraph-image.alt.txt"), "Aeethod — TCG Commerce Technology Studio");
  
  console.log("Successfully generated og-image.png and opengraph-image.png");
}

main().catch(console.error);
