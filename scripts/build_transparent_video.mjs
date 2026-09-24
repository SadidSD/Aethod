import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ffmpegPath = path.resolve('node_modules/ffmpeg-static/ffmpeg.exe');
const sourceVideo = path.resolve('../elements/hero animation.mp4');
const tempRawDir = path.resolve('temp_raw_frames');
const tempAlphaDir = path.resolve('temp_alpha_frames');
const outputWebm = path.resolve('public/hero-animation.webm');

function processFrame(data, W, H) {
  const isScreen = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let qLen = 0;

  // 1. Flood fill screens from multiple seeds
  const seeds = [
    // Phone screen seeds
    [150, 250], [200, 250], [150, 400], [180, 400], [200, 400], [150, 600], [200, 600],
    // Tablet screen seeds
    [1200, 300], [1400, 300], [1600, 300],
    [1200, 500], [1400, 500], [1600, 500],
    [1200, 700], [1400, 700], [1600, 700]
  ];

  for (const [sx, sy] of seeds) {
    if (sx < 0 || sx >= W || sy < 0 || sy >= H) continue;
    const sidx = sy * W + sx;
    if (!isScreen[sidx]) {
      const idx = sidx * 3;
      const maxC = Math.max(data[idx], data[idx+1], data[idx+2]);
      if (maxC >= 65) {
        isScreen[sidx] = 1;
        queue[qLen++] = sidx;
      }
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
      if (n !== -1 && !isScreen[n]) {
        const idx = n * 3;
        const maxC = Math.max(data[idx], data[idx+1], data[idx+2]);
        if (maxC >= 65) {
          isScreen[n] = 1;
          queue[qLen++] = n;
        }
      }
    }
  }

  // 2. Locate Aeethod Logo A center dynamically
  let sumX = 0, sumY = 0, count = 0;
  for (let y = 520; y < 750; y++) {
    for (let x = 650; x < 850; x++) {
      const idx = (y * W + x) * 3;
      if (data[idx] < 60 && data[idx+1] < 60 && data[idx+2] < 90) {
        sumX += x; sumY += y; count++;
      }
    }
  }
  const lx = count > 100 ? Math.round(sumX / count) : 756;
  const ly = count > 100 ? Math.round(sumY / count) : 648;

  function insidePlatform(x, y) {
    const dx = x - lx;
    const dy = y - ly;
    const topDiamond = (Math.abs(dx) / 195 + Math.abs(dy + 5) / 115) <= 1.02;
    const bottomPedestal = (Math.abs(dx) / 195 + (dy - 30) / 135) <= 1.02 && dy >= 0 && dy <= 165 && Math.abs(dx) <= 195;
    return topDiamond || bottomPedestal;
  }

  // 3. Mark purple cable pixels for pulse detection
  const isPurpleCable = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if ((b - r >= 15 && r - g >= 8) || (b - g >= 25 && r - g >= 10 && b > 140)) {
        isPurpleCable[y * W + x] = 1;
      }
    }
  }

  // Cable pulse map: dilate purple cable by 9px to catch white pulses traveling along cable
  const isCablePath = new Uint8Array(W * H);
  const D = 9;
  for (let y = D; y < H - D; y += 2) {
    for (let x = D; x < W - D; x += 2) {
      if (isPurpleCable[y * W + x]) {
        for (let dy = -D; dy <= D; dy++) {
          for (let dx = -D; dx <= D; dx++) {
            isCablePath[(y + dy) * W + (x + dx)] = 1;
          }
        }
      }
    }
  }

  // 4. Compute Alpha channel for each pixel
  const rgba = Buffer.alloc(W * H * 4);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const srcIdx = i * 3;
      const dstIdx = i * 4;

      const r = data[srcIdx];
      const g = data[srcIdx+1];
      const b = data[srcIdx+2];

      const minC = Math.min(r, g, b);
      const maxC = Math.max(r, g, b);
      const chroma = maxC - minC;

      let alpha = 255;

      if (isScreen[i]) {
        alpha = 255;
      } else if (insidePlatform(x, y)) {
        if (b - r >= 4 || chroma >= 5 || minC <= 245) {
          alpha = 255;
        } else {
          alpha = 0;
        }
      } else if (isCablePath[i] && (minC >= 220 || chroma > 8)) {
        alpha = 255;
      } else {
        if (minC >= 244 && chroma <= 8 && (b - r) <= 6 && (b - g) <= 6) {
          alpha = 0;
        } else if (minC >= 238 && chroma <= 14 && (b - r) <= 8 && (b - g) <= 8) {
          const t = (minC - 238) / (244 - 238);
          alpha = Math.round(255 * (1 - t));
        } else {
          alpha = 255;
        }
      }

      rgba[dstIdx] = r;
      rgba[dstIdx+1] = g;
      rgba[dstIdx+2] = b;
      rgba[dstIdx+3] = alpha;
    }
  }

  return rgba;
}

async function main() {
  console.log('=== Starting True Transparent Video Generation ===');
  
  if (!fs.existsSync(tempRawDir)) fs.mkdirSync(tempRawDir, { recursive: true });
  if (!fs.existsSync(tempAlphaDir)) fs.mkdirSync(tempAlphaDir, { recursive: true });

  console.log('Step 1: Extracting raw frames from source video...');
  const extractCmd = `"${ffmpegPath}" -y -i "${sourceVideo}" -q:v 2 "${tempRawDir}/frame_%04d.png"`;
  execSync(extractCmd, { stdio: 'inherit' });

  const rawFiles = fs.readdirSync(tempRawDir).filter(f => f.endsWith('.png')).sort();
  console.log(`Extracted ${rawFiles.length} frames.`);

  console.log('Step 2: Processing frames with alpha extraction algorithm...');
  const concurrency = 6;
  let completed = 0;

  for (let i = 0; i < rawFiles.length; i += concurrency) {
    const chunk = rawFiles.slice(i, i + concurrency);
    await Promise.all(chunk.map(async (filename) => {
      const rawPath = path.join(tempRawDir, filename);
      const alphaPath = path.join(tempAlphaDir, filename);

      const { data, info } = await sharp(rawPath).raw().toBuffer({ resolveWithObject: true });
      const rgba = processFrame(data, info.width, info.height);

      await sharp(rgba, {
        raw: {
          width: info.width,
          height: info.height,
          channels: 4
        }
      }).png({ compressionLevel: 4 }).toFile(alphaPath);

      completed++;
      if (completed % 30 === 0 || completed === rawFiles.length) {
        console.log(`Processed ${completed} / ${rawFiles.length} frames (${((completed / rawFiles.length) * 100).toFixed(1)}%)`);
      }
    }));
  }

  console.log('Step 3: Encoding WebM with VP9 alpha channel (yuva420p)...');
  const encodeCmd = `"${ffmpegPath}" -y -framerate 24 -i "${tempAlphaDir}/frame_%04d.png" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 2500k -auto-alt-ref 0 "${outputWebm}"`;
  execSync(encodeCmd, { stdio: 'inherit' });

  console.log('Step 4: Verifying output file...');
  const stats = fs.statSync(outputWebm);
  console.log(`Generated WebM file: ${outputWebm} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  console.log('=== True Transparent Video Generation Complete! ===');
}

main().catch(err => {
  console.error('Fatal error during transparent video generation:', err);
  process.exit(1);
});
