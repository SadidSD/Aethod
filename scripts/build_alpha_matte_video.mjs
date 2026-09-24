import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ffmpegBinary = 'ffmpeg';
const sourceVideo = path.resolve('public/hero-animation.mp4');
const tempRawDir = path.resolve('temp_raw_frames');
const tempStackedDir = path.resolve('temp_stacked_frames');
const outputAlphaMp4 = path.resolve('public/hero-animation-alpha.mp4');

function insidePoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function processFrame(raw, W, H) {
  // 1. Dynamically locate Aeethod logo in the central diamond hub for this frame
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let y = 570; y <= 690; y++) {
    for (let x = 680; x <= 820; x++) {
      const idx = (y * W + x) * 3;
      if (raw[idx] < 40 && raw[idx+1] < 40 && raw[idx+2] < 80) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  // Dynamic diamond hub polygon (protects white top plate and logo)
  const hubPoly = [
    [cx, cy - 88],
    [cx + 180, cy + 22],
    [cx, cy + 130],
    [cx - 180, cy + 22]
  ];

  // 2. Classify candidate background pixels:
  // - Protect hub top plate
  // - Protect purple cables
  // - Protect glowing blue hub base
  // - Treat pure white background & ambient floor shadow outside devices as candidate background
  const isBgCandidate = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;

      if (insidePoly(x, y, hubPoly)) continue;

      const idx = i * 3;
      const r = raw[idx], g = raw[idx+1], b = raw[idx+2];
      const minC = Math.min(r, g, b);
      const chroma = Math.max(r, g, b) - minC;

      // Purple cable: vibrant purple chroma
      if (chroma >= 25 && (b - g) >= 20 && b >= 150) continue;

      // Glowing blue hub base
      if (x >= cx - 200 && x <= cx + 200 && y >= cy && y <= cy + 160 && (b - r) >= 28 && (b - g) >= 28) continue;

      // Pure white background
      if (minC >= 238 && chroma < 18) {
        isBgCandidate[i] = 1;
        continue;
      }

      // Floor shadow below tablet (tilted baseline starts at y=795)
      if (x >= 1000 && x <= 1850 && y > (795 + (x - 1060) * 0.125) && chroma < 22 && minC >= 100) {
        isBgCandidate[i] = 1;
        continue;
      }

      // Floor shadow below phone
      if (x <= 450 && y > 845 && chroma < 22 && minC >= 100) {
        isBgCandidate[i] = 1;
        continue;
      }

      // Floor shadow below hub
      if (x >= cx - 200 && x <= cx + 200 && y > cy + 155 && chroma < 22 && minC >= 100) {
        isBgCandidate[i] = 1;
        continue;
      }
    }
  }

  // 3. BFS flood fill starting from image top, bottom, and enclosed pocket
  const isBg = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let head = 0, tail = 0;

  for (let x = 0; x < W; x++) {
    if (isBgCandidate[x]) { isBg[x] = 1; queue[tail++] = x; }
    const bIdx = (H - 1) * W + x;
    if (isBgCandidate[bIdx] && !isBg[bIdx]) { isBg[bIdx] = 1; queue[tail++] = bIdx; }
  }

  // Seed enclosed pocket between phone and hub
  const pIdx = 600 * W + 480;
  if (isBgCandidate[pIdx] && !isBg[pIdx]) {
    isBg[pIdx] = 1; queue[tail++] = pIdx;
  }

  while (head < tail) {
    const curr = queue[head++];
    const cx_ = curr % W;
    const cy_ = Math.floor(curr / W);

    const neighbors = [
      cx_ > 0 ? curr - 1 : -1,
      cx_ < W - 1 ? curr + 1 : -1,
      cy_ > 0 ? curr - W : -1,
      cy_ < H - 1 ? curr + W : -1
    ];

    for (const n of neighbors) {
      if (n !== -1 && isBgCandidate[n] && !isBg[n]) {
        isBg[n] = 1;
        queue[tail++] = n;
      }
    }
  }

  // 4. Compute alpha matte and build 1920x2160 stacked frame
  // INNER ANTI-ALIASING:
  // - Pixels marked as isBg are strictly 0 alpha (never bleed into white background)
  // - Only interior border pixels receive smooth cubic ease alpha based on foreground neighborhood
  // - Edge colors are de-fringed from the white source background
  const stacked = Buffer.alloc(W * (H * 2) * 3);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      const srcIdx = idx * 3;
      const r = raw[srcIdx], g = raw[srcIdx+1], b = raw[srcIdx+2];

      let aFloat = 0.0;
      if (isBg[idx]) {
        aFloat = 0.0;
      } else {
        // Count background neighbors in 3x3
        let bgCount = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= H) continue;
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            if (nx < 0 || nx >= W) continue;
            if (isBg[ny * W + nx]) bgCount++;
          }
        }

        if (bgCount === 0) {
          aFloat = 1.0;
        } else {
          // Inner anti-aliasing
          const fgFraction = (8 - bgCount) / 8.0;
          aFloat = fgFraction * fgFraction * (3.0 - 2.0 * fgFraction);
        }
      }

      const aByte = Math.round(aFloat * 255);
      const topIdx = idx * 3;
      const botIdx = ((H + y) * W + x) * 3;

      if (aByte === 0) {
        stacked[topIdx] = 0;
        stacked[topIdx+1] = 0;
        stacked[topIdx+2] = 0;
      } else {
        let cleanR = r, cleanG = g, cleanB = b;
        if (aFloat > 0.02 && aFloat < 0.98) {
          cleanR = Math.max(0, Math.min(255, Math.round((r - (1 - aFloat) * 255) / aFloat)));
          cleanG = Math.max(0, Math.min(255, Math.round((g - (1 - aFloat) * 255) / aFloat)));
          cleanB = Math.max(0, Math.min(255, Math.round((b - (1 - aFloat) * 255) / aFloat)));
        }
        stacked[topIdx] = cleanR;
        stacked[topIdx+1] = cleanG;
        stacked[topIdx+2] = cleanB;
      }

      stacked[botIdx] = aByte;
      stacked[botIdx+1] = aByte;
      stacked[botIdx+2] = aByte;
    }
  }

  return stacked;
}

async function main() {
  console.log('=== Starting High-Precision Anti-Aliased Alpha Video Generation ===');

  if (!fs.existsSync(sourceVideo)) {
    throw new Error(`Source video not found: ${sourceVideo}`);
  }

  if (!fs.existsSync(tempRawDir)) fs.mkdirSync(tempRawDir, { recursive: true });
  if (!fs.existsSync(tempStackedDir)) fs.mkdirSync(tempStackedDir, { recursive: true });

  console.log('Step 1: Extracting raw frames for the first 7 seconds from source video...');
  const extractCmd = `"${ffmpegBinary}" -y -t 7 -i "${sourceVideo}" -q:v 2 "${tempRawDir}/frame_%04d.png"`;
  execSync(extractCmd, { stdio: 'inherit' });

  const rawFiles = fs.readdirSync(tempRawDir).filter(f => f.endsWith('.png')).sort();
  console.log(`Extracted ${rawFiles.length} frames.`);

  console.log('Step 2: Processing frames with dynamic hub tracking and subpixel alpha matte (1920x2160)...');
  const concurrency = 8;
  let completed = 0;

  for (let i = 0; i < rawFiles.length; i += concurrency) {
    const chunk = rawFiles.slice(i, i + concurrency);
    await Promise.all(chunk.map(async (filename) => {
      const rawPath = path.join(tempRawDir, filename);
      const stackedPath = path.join(tempStackedDir, filename);

      const { data: raw, info } = await sharp(rawPath).raw().toBuffer({ resolveWithObject: true });
      const W = info.width, H = info.height;

      const stacked = processFrame(raw, W, H);

      await sharp(stacked, {
        raw: {
          width: W,
          height: H * 2,
          channels: 3
        }
      }).png({ compressionLevel: 1 }).toFile(stackedPath);

      completed++;
      if (completed % 40 === 0 || completed === rawFiles.length) {
        console.log(`Processed ${completed} / ${rawFiles.length} frames (${((completed / rawFiles.length) * 100).toFixed(1)}%)`);
      }
    }));
  }

  console.log('Step 3: Encoding H.264 MP4 with high-fidelity CRF 15 & slow preset...');
  const encodeCmd = `"${ffmpegBinary}" -y -framerate 24 -i "${tempStackedDir}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 15 -preset slow -movflags +faststart "${outputAlphaMp4}"`;
  execSync(encodeCmd, { stdio: 'inherit' });

  const stats = fs.statSync(outputAlphaMp4);
  console.log(`Generated Mathematical Alpha Video: ${outputAlphaMp4} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  console.log('Cleaning up temporary frame directories...');
  fs.rmSync(tempRawDir, { recursive: true, force: true });
  fs.rmSync(tempStackedDir, { recursive: true, force: true });

  console.log('=== Alpha Video Generation Complete! ===');
}

main().catch(err => {
  console.error('Error generating alpha matte video:', err);
  process.exit(1);
});
