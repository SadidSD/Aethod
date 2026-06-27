const fs = require('fs');
const PNG = require('pngjs').PNG;

const imgPath = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\9cfd3b7f-b8ac-42c4-84b8-d3ecb30a7efc\\media__1782463683837.png';

fs.createReadStream(imgPath)
  .pipe(new PNG())
  .on('parsed', function () {
    console.log(`Image size: ${this.width}x${this.height}`);
    const redRows = {};
    for (let y = 0; y < this.height; y++) {
      let redCount = 0;
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];
        // Red color: high R, low G, low B
        if (r > 200 && g < 50 && b < 50) {
          redCount++;
        }
      }
      if (redCount > 10) {
        redRows[y] = redCount;
      }
    }
    console.log("Rows with red pixels:");
    const sortedRows = Object.keys(redRows).map(Number).sort((a, b) => a - b);
    for (const y of sortedRows) {
      console.log(`Row ${y}: ${redRows[y]} red pixels`);
    }
  })
  .on('error', function (err) {
    console.error('Error:', err);
  });
