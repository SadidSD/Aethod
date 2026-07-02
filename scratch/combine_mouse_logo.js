const fs = require('fs');
const path = require('path');

const mouseLogoPath = "c:\\Users\\user\\Desktop\\AEETHOD\\aeethod_frontend\\public\\mouse_logo.svg";
const navbarLogoPath = "c:\\Users\\user\\Desktop\\AEETHOD\\aeethod_frontend\\public\\navbar logo.svg";
const logoPath = "c:\\Users\\user\\Desktop\\AEETHOD\\aeethod_frontend\\public\\logo.svg";

// 1. Read the mouse_logo.svg content and extract pattern & image base64
const mouseContent = fs.readFileSync(mouseLogoPath, 'utf8');

const imageMatch = mouseContent.match(/<image[^>]+id="image0_1273_347"[^>]+xlink:href="([^"]+)"/);
if (!imageMatch) {
  console.error("Could not find the base64 image in mouse_logo.svg!");
  process.exit(1);
}
const base64Href = imageMatch[1];

// 2. Generate the new SVG template
const newSvg = `<svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- Circle Filter -->
    <filter id="filter0_ddddii_1219_345" x="0" y="0" width="88" height="88" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-1" dy="-1"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1219_345"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_1219_345" result="effect2_dropShadow_1219_345"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_1219_345" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="2" dy="2"/>
      <feGaussianBlur stdDeviation="2.5"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.9 0"/>
      <feBlend mode="normal" in2="shape" result="effect3_innerShadow_1219_345"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-2" dy="-2"/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"/>
      <feBlend mode="normal" in2="effect3_innerShadow_1219_345" result="effect4_innerShadow_1219_345"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="2" dy="-2"/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.2 0"/>
      <feBlend mode="normal" in2="effect4_innerShadow_1219_345" result="effect5_innerShadow_1219_345"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-2" dy="2"/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.2 0"/>
      <feBlend mode="normal" in2="effect5_innerShadow_1219_345" result="effect6_innerShadow_1219_345"/>
    </filter>

    <!-- Mouse Logo Pattern -->
    <pattern id="pattern0_1273_347" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlink:href="#image0_1273_347" transform="matrix(0.00133511 0 0 0.0014556 -0.506008 -0.232897)"/>
    </pattern>
    <image id="image0_1273_347" width="1536" height="1024" preserveAspectRatio="none" xlink:href="${base64Href}" />
  </defs>

  <!-- Neumorphic Circle Background -->
  <g filter="url(#filter0_ddddii_1219_345)">
    <circle cx="42.5" cy="42.5" r="27.5" fill="#ECECEC"/>
  </g>

  <!-- Centered & Scaled Mouse Logo (A logo rotated by -30 deg) -->
  <g transform="translate(42.5, 42.5) scale(0.72) translate(-31.8, -31.6)">
    <g transform="translate(5, 7) rotate(-30, 26.8, 24.6)">
      <rect width="53.6727" height="49.2299" fill="url(#pattern0_1273_347)"/>
    </g>
  </g>
</svg>
`;

// 3. Write to files
fs.writeFileSync(navbarLogoPath, newSvg.trim());
fs.writeFileSync(logoPath, newSvg.trim());
console.log("Successfully updated navbar logo.svg and logo.svg with the flat black mouse logo inside the neumorphic circle!");
