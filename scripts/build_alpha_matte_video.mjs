import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ffmpegPath = path.resolve('node_modules/ffmpeg-static/ffmpeg.exe');
const sourceVideo = path.resolve('../elements/hero animation.mp4');
const tempRawDir = path.resolve('temp_raw_frames');
const tempStackedDir = path.resolve('temp_stacked_frames');
const outputAlphaMp4 = path.resolve('public/hero-animation-alpha.mp4');

function processFrame(data, W, H) {
  // 1. Screens flood fill (Phone screen & Tablet screen)
  const isScreen = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let qLen = 0;

  const seeds = [
    [150, 250], [200, 250], [150, 400], [180, 400], [200, 400], [150, 600], [200, 600],
    [1200, 300], [1400, 300], [1600, 300],
    [1200, 500], [1400, 500], [1600, 500],
    [1200, 700], [1400, 700], [1600, 700]
  ];

  for (const [sx, sy] of seeds) {
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

  // 2. Hub platform
  function insidePlatform(x, y) {
    const dx = x - 756;
    const dy = y - 648;
    const topDiamond = (Math.abs(dx) / 195 + Math.abs(dy + 5) / 115) <= 1.02;
    const bottomPedestal = (Math.abs(dx) / 195 + (dy - 30) / 135) <= 1.02 && dy >= 0 && dy <= 165 && Math.abs(dx) <= 195;
    return topDiamond || bottomPedestal;
  }

  // 3. Compute RGBA buffer
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

      let alpha = 0;

      if (isScreen[i]) {
        alpha = 255;
      } else if (insidePlatform(x, y)) {
        if (b - r >= 4 || chroma >= 5 || minC <= 245) {
          alpha = 255;
        } else {
          alpha = 0;
        }
      } else {
        // Cables & surrounding artwork: tight chroma threshold with anti-aliasing
        if (chroma >= 18 || minC < 232) {
          alpha = 255;
        } else if (chroma >= 10 || minC < 242) {
          const t = Math.max((chroma - 10) / 8, (242 - minC) / 10);
          alpha = Math.round(255 * Math.min(1, Math.max(0, t)));
        } else {
          alpha = 0;
        }
      }

      // Store in RGBA
      rgba[dstIdx] = r;
      rgba[dstIdx+1] = g;
      rgba[dstIdx+2] = b;
      rgba[dstIdx+3] = alpha;
    }
  }

  return rgba;
}

async function main() {
  console.log('=== Starting Clean Universal Alpha Matte Video Generation ===');

  if (!fs.existsSync(tempRawDir)) fs.mkdirSync(tempRawDir, { recursive: true });
  if (!fs.existsSync(tempStackedDir)) fs.mkdirSync(tempStackedDir, { recursive: true });

  console.log('Step 1: Extracting raw frames from source video...');
  const extractCmd = `"${ffmpegPath}" -y -i "${sourceVideo}" -q:v 2 "${tempRawDir}/frame_%04d.png"`;
  execSync(extractCmd, { stdio: 'inherit' });

  const rawFiles = fs.readdirSync(tempRawDir).filter(f => f.endsWith('.png')).sort();
  console.log(`Extracted ${rawFiles.length} frames.`);

  console.log('Step 2: Processing and generating stacked RGB + Alpha frames (1920x2160)...');
  const concurrency = 8;
  let completed = 0;

  for (let i = 0; i < rawFiles.length; i += concurrency) {
    const chunk = rawFiles.slice(i, i + concurrency);
    await Promise.all(chunk.map(async (filename) => {
      const rawPath = path.join(tempRawDir, filename);
      const stackedPath = path.join(tempStackedDir, filename);

      const { data: raw, info } = await sharp(rawPath).raw().toBuffer({ resolveWithObject: true });
      const W = info.width, H = info.height;

      const rgba = processFrame(raw, W, H);

      // Stacked buffer: 1920 x 2160 (RGB)
      // Top half: RGB with background zeroed out (premultiplied against dark fringe)
      // Bottom half: Grayscale alpha
      const stacked = Buffer.alloc(W * (H * 2) * 3);

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const srcIdx = (y * W + x) * 4;
          const r = rgba[srcIdx];
          const g = rgba[srcIdx+1];
          const b = rgba[srcIdx+2];
          const a = rgba[srcIdx+3];

          // Top half: RGB
          const topIdx = (y * W + x) * 3;
          if (a === 0) {
            stacked[topIdx] = 0;
            stacked[topIdx+1] = 0;
            stacked[topIdx+2] = 0;
          } else {
            stacked[topIdx] = r;
            stacked[topIdx+1] = g;
            stacked[topIdx+2] = b;
          }

          // Bottom half: Alpha as grayscale
          const botIdx = ((H + y) * W + x) * 3;
          stacked[botIdx] = a;
          stacked[botIdx+1] = a;
          stacked[botIdx+2] = a;
        }
      }

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

  console.log('Step 3: Encoding H.264 MP4 with faststart...');
  const encodeCmd = `"${ffmpegPath}" -y -framerate 24 -i "${tempStackedDir}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast -movflags +faststart "${outputAlphaMp4}"`;
  execSync(encodeCmd, { stdio: 'inherit' });

  const stats = fs.statSync(outputAlphaMp4);
  console.log(`Generated Alpha Matte MP4: ${outputAlphaMp4} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  console.log('Cleaning up temporary directories...');
  fs.rmSync(tempRawDir, { recursive: true, force: true });
  fs.rmSync(tempStackedDir, { recursive: true, force: true });

  console.log('=== Universal Alpha Matte Video Generation Complete! ===');
}

main().catch(err => {
  console.error('Error generating alpha matte video:', err);
  process.exit(1);
});
