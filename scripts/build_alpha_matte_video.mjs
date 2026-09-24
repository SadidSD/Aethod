import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ffmpegBinary = 'ffmpeg';
const sourceVideo = path.resolve('public/hero-animation.mp4');
const tempRawDir = path.resolve('temp_raw_frames');
const tempStackedDir = path.resolve('temp_stacked_frames');
const outputAlphaMp4 = path.resolve('public/hero-animation-alpha.mp4');

function processFrame(data, W, H) {
  // 1. Flood fill pure white background from outer canvas edges
  const isBg = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let qLen = 0;

  // Add outer border near-white pixels
  for (let x = 0; x < W; x++) {
    const topIdx = x * 3;
    const botIdx = ((H - 1) * W + x) * 3;
    if (data[topIdx] >= 248 && data[topIdx+1] >= 248 && data[topIdx+2] >= 248) {
      isBg[x] = 1; queue[qLen++] = x;
    }
    if (data[botIdx] >= 248 && data[botIdx+1] >= 248 && data[botIdx+2] >= 248) {
      isBg[(H - 1) * W + x] = 1; queue[qLen++] = (H - 1) * W + x;
    }
  }
  for (let y = 0; y < H; y++) {
    const leftIdx = (y * W) * 3;
    const rightIdx = (y * W + (W - 1)) * 3;
    if (data[leftIdx] >= 248 && data[leftIdx+1] >= 248 && data[leftIdx+2] >= 248) {
      if (!isBg[y * W]) { isBg[y * W] = 1; queue[qLen++] = y * W; }
    }
    if (data[rightIdx] >= 248 && data[rightIdx+1] >= 248 && data[rightIdx+2] >= 248) {
      if (!isBg[y * W + W - 1]) { isBg[y * W + W - 1] = 1; queue[qLen++] = y * W + W - 1; }
    }
  }

  let head = 0;
  while (head < qLen) {
    const curr = queue[head++];
    const cx = curr % W;
    const cy = (curr / W) | 0;

    const neighbors = [
      cy > 0 ? curr - W : -1,
      cy < H - 1 ? curr + W : -1,
      cx > 0 ? curr - 1 : -1,
      cx < W - 1 ? curr + 1 : -1
    ];

    for (const n of neighbors) {
      if (n !== -1 && !isBg[n]) {
        const idx = n * 3;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        const minC = Math.min(r, g, b);
        const maxC = Math.max(r, g, b);
        const chroma = maxC - minC;

        // Background is pure white (min >= 251 and chroma <= 3)
        if (minC >= 251 && chroma <= 3) {
          isBg[n] = 1;
          queue[qLen++] = n;
        }
      }
    }
  }

  // 2. Base alpha: all unreached pixels (inside devices, cables, hub) are 100% foreground (1.0)
  const alpha = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    if (!isBg[i]) alpha[i] = 1.0;
  }

  // 3. Find transition border pixels (foreground touching background)
  const isBorder = new Uint8Array(W * H);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      if (!isBg[i]) {
        if (isBg[i - 1] || isBg[i + 1] || isBg[i - W] || isBg[i + W] ||
            isBg[i - W - 1] || isBg[i - W + 1] || isBg[i + W - 1] || isBg[i + W + 1]) {
          isBorder[i] = 1;
        }
      }
    }
  }

  // Apply smooth anti-aliased feathering on the 1-2px border based on original subpixel luminance
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      if (isBorder[i]) {
        const idx = i * 3;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        const minC = Math.min(r, g, b);
        const maxC = Math.max(r, g, b);
        const chroma = maxC - minC;

        if (minC >= 225 && chroma <= 18) {
          const t = (255 - minC) / 30.0;
          alpha[i] = Math.min(1.0, Math.max(0.08, t * t * (3.0 - 2.0 * t)));
        } else {
          alpha[i] = 1.0;
        }
      }
    }
  }

  // 4. Build Stacked Buffer (1920 x 2160 x 3)
  // Top half: De-fringed RGB (white edge bleed removed so dark mode has zero halo)
  // Bottom half: Grayscale Alpha
  const stacked = Buffer.alloc(W * (H * 2) * 3);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const srcIdx = i * 3;
      const aFloat = alpha[i];
      const aByte = Math.round(aFloat * 255);

      const topIdx = i * 3;
      const botIdx = ((H + y) * W + x) * 3;

      if (aByte === 0) {
        // Transparent background in top half
        stacked[topIdx] = 0;
        stacked[topIdx+1] = 0;
        stacked[topIdx+2] = 0;
      } else {
        const r = data[srcIdx], g = data[srcIdx+1], b = data[srcIdx+2];
        let cleanR = r, cleanG = g, cleanB = b;

        // De-fringe edge pixels against white background
        if (aFloat > 0.05 && aFloat < 0.98) {
          cleanR = Math.max(0, Math.min(255, Math.round((r - (1 - aFloat) * 255) / aFloat)));
          cleanG = Math.max(0, Math.min(255, Math.round((g - (1 - aFloat) * 255) / aFloat)));
          cleanB = Math.max(0, Math.min(255, Math.round((b - (1 - aFloat) * 255) / aFloat)));
        }

        stacked[topIdx] = cleanR;
        stacked[topIdx+1] = cleanG;
        stacked[topIdx+2] = cleanB;
      }

      // Bottom half: Grayscale Alpha
      stacked[botIdx] = aByte;
      stacked[botIdx+1] = aByte;
      stacked[botIdx+2] = aByte;
    }
  }

  return stacked;
}

async function main() {
  console.log('=== Starting Ultra-Smooth Anti-Aliased Alpha Video Generation ===');

  if (!fs.existsSync(sourceVideo)) {
    throw new Error(`Source video not found: ${sourceVideo}`);
  }

  if (!fs.existsSync(tempRawDir)) fs.mkdirSync(tempRawDir, { recursive: true });
  if (!fs.existsSync(tempStackedDir)) fs.mkdirSync(tempStackedDir, { recursive: true });

  console.log('Step 1: Extracting raw frames from source video...');
  const extractCmd = `"${ffmpegBinary}" -y -i "${sourceVideo}" -q:v 2 "${tempRawDir}/frame_%04d.png"`;
  execSync(extractCmd, { stdio: 'inherit' });

  const rawFiles = fs.readdirSync(tempRawDir).filter(f => f.endsWith('.png')).sort();
  console.log(`Extracted ${rawFiles.length} frames.`);

  console.log('Step 2: Processing frames with edge anti-aliasing & white de-fringing (1920x2160)...');
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
  console.log(`Generated Smooth Alpha Video: ${outputAlphaMp4} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  console.log('Cleaning up temporary frame directories...');
  fs.rmSync(tempRawDir, { recursive: true, force: true });
  fs.rmSync(tempStackedDir, { recursive: true, force: true });

  console.log('=== Ultra-Smooth Alpha Video Generation Complete! ===');
}

main().catch(err => {
  console.error('Error generating alpha matte video:', err);
  process.exit(1);
});
