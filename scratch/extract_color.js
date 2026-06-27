const fs = require('fs');
const PNG = require('pngjs').PNG;

const filePath = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\dd83e02a-9b7f-4c6b-8c77-9d48d3ba0d57\\media__1782490116501.png';

fs.createReadStream(filePath)
  .pipe(new PNG())
  .on('parsed', function () {
    console.log(`Image size: ${this.width}x${this.height}`);
    
    // Let's sample pixels along the vertical center line
    const centerX = Math.floor(this.width / 2);
    
    // We want to find a purple pixel. Let's scan a horizontal row in the middle of the image.
    const centerY = Math.floor(this.height / 2);
    
    console.log("Colors across the middle row:");
    for (let x = 0; x < this.width; x++) {
      const idx = (this.width * centerY + x) << 2;
      const r = this.data[idx];
      const g = this.data[idx + 1];
      const b = this.data[idx + 2];
      const a = this.data[idx + 3];
      
      // Let's print colors that are clearly not white/grey (where R != G or R != B)
      if (Math.abs(r - g) > 20 || Math.abs(r - b) > 20) {
        const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        console.log(`x=${x}, y=${centerY}: RGB(${r},${g},${b}) -> ${hex}`);
      }
    }
  });
