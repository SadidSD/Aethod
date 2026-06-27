const fs = require('fs');
const PNG = require('pngjs').PNG;

const imgPath = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\9cfd3b7f-b8ac-42c4-84b8-d3ecb30a7efc\\media__1782463683837.png';

fs.createReadStream(imgPath)
  .pipe(new PNG())
  .on('parsed', function () {
    let minX = this.width, maxX = 0, minY = this.height, maxY = 0;
    
    // Look in the bottom-right corner for blue-ish circle
    // Standard blue is around R=100-180, G=150-210, B=230-255
    for (let y = Math.floor(this.height * 0.6); y < this.height; y++) {
      for (let x = Math.floor(this.width * 0.6); x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];
        
        // Light blue of the assistant button
        if (r > 100 && r < 185 && g > 150 && g < 220 && b > 220) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    console.log(`Blue Button bounding box:`);
    console.log(`X: ${minX} to ${maxX} (center X: ${(minX + maxX)/2}, width: ${maxX - minX})`);
    console.log(`Y: ${minY} to ${maxY} (center Y: ${(minY + maxY)/2}, height: ${maxY - minY})`);
  })
  .on('error', function (err) {
    console.error('Error:', err);
  });
