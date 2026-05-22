const fs = require('fs');
const PNG = require('pngjs').PNG;

const svg = fs.readFileSync('./public/ai icon 2.svg', 'utf8');
const match = svg.match(/xlink:href="data:image\/png;base64,([^"]+)"/);
if (match) {
  const base64Data = match[1];
  const buffer = Buffer.from(base64Data, 'base64');
  const png = PNG.sync.read(buffer);
  
  // Scale down to 40x40 to print as ASCII map
  const scale = png.width / 40;
  let output = '';
  for (let y = 0; y < 40; y++) {
    for (let x = 0; x < 40; x++) {
      const px = Math.floor(x * scale);
      const py = Math.floor(y * scale);
      const idx = (png.width * py + px) * 4;
      const alpha = png.data[idx + 3];
      if (alpha > 200) {
        output += '█';
      } else if (alpha > 50) {
        output += '░';
      } else {
        output += ' ';
      }
    }
    output += '\n';
  }
  console.log(output);
} else {
  console.log('No base64 match found');
}
