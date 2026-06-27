const fs = require('fs');
const PNG = require('pngjs').PNG;

const imgPath = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\9cfd3b7f-b8ac-42c4-84b8-d3ecb30a7efc\\media__1782463683837.png';

fs.createReadStream(imgPath)
  .pipe(new PNG())
  .on('parsed', function () {
    let minX = this.width, maxX = 0, minY = this.height, maxY = 0;
    
    // Let's find any pixels with purple border color
    // #8B5CF6 is R=139, G=92, B=246. Let's allow some tolerance.
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];
        
        // Match purple border
        if (Math.abs(r - 139) < 20 && Math.abs(g - 92) < 20 && Math.abs(b - 246) < 20) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    console.log(`Chatbox bounding box:`);
    console.log(`X: ${minX} to ${maxX} (width: ${maxX - minX})`);
    console.log(`Y: ${minY} to ${maxY} (height: ${maxY - minY})`);
  })
  .on('error', function (err) {
    console.error('Error:', err);
  });
