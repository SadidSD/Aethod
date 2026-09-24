import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { processFrame } from '../scratch/test_perfect_alpha.js';

const ffmpegPath = path.resolve('node_modules/ffmpeg-static/ffmpeg.exe');
const sourceVideo = path.resolve('../elements/hero animation.mp4');
const tempRawDir = path.resolve('temp_raw_frames');
const tempStackedDir = path.resolve('temp_stacked_frames');
const outputAlphaMp4 = path.resolve('public/hero-animation-alpha.mp4');

async function main() {
  console.log('=== Starting Universal Alpha Matte Video Generation ===');

  if (!fs.existsSync(tempRawDir)) fs.mkdirSync(tempRawDir, { recursive: true });
  if (!fs.existsSync(tempStackedDir)) fs.mkdirSync(tempStackedDir, { recursive: true });

  console.log('Step 1: Extracting raw frames from source video...');
  const extractCmd = `"${ffmpegPath}" -y -i "${sourceVideo}" -q:v 2 "${tempRawDir}/frame_%04d.png"`;
  execSync(extractCmd, { stdio: 'inherit' });

  const rawFiles = fs.readdirSync(tempRawDir).filter(f => f.endsWith('.png')).sort();
  console.log(`Extracted ${rawFiles.length} frames.`);

  console.log('Step 2: Processing and generating stacked RGB + Alpha frames (1920x2160)...');
  const concurrency = 6;
  let completed = 0;

  for (let i = 0; i < rawFiles.length; i += concurrency) {
    const chunk = rawFiles.slice(i, i + concurrency);
    await Promise.all(chunk.map(async (filename) => {
      const rawPath = path.join(tempRawDir, filename);
      const stackedPath = path.join(tempStackedDir, filename);

      const { data: raw, info } = await sharp(rawPath).raw().toBuffer({ resolveWithObject: true });
      const W = info.width, H = info.height;

      // Extract accurate RGBA
      const rgba = processFrame(raw, W, H);

      // Stacked buffer: 1920 x 2160 (RGB)
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
          stacked[topIdx] = r;
          stacked[topIdx+1] = g;
          stacked[topIdx+2] = b;

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
      }).png({ compressionLevel: 4 }).toFile(stackedPath);

      completed++;
      if (completed % 30 === 0 || completed === rawFiles.length) {
        console.log(`Processed ${completed} / ${rawFiles.length} frames (${((completed / rawFiles.length) * 100).toFixed(1)}%)`);
      }
    }));
  }

  console.log('Step 3: Encoding H.264 MP4 with faststart...');
  // High quality H.264 encoding with yuv420p for 100% universal hardware playback
  const encodeCmd = `"${ffmpegPath}" -y -framerate 24 -i "${tempStackedDir}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 19 -preset fast -movflags +faststart "${outputAlphaMp4}"`;
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
