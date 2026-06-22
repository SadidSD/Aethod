const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/user/Desktop/AEETHOD/aeethod_frontend/public/research';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.svg')) {
    const fullPath = path.join(dir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const viewBox = content.match(/viewBox=["']([^"']+)["']/);
    const width = content.match(/width=["']([^"']+)["']/);
    const height = content.match(/height=["']([^"']+)["']/);
    console.log(`File: ${file}`);
    console.log(`  viewBox: ${viewBox ? viewBox[1] : 'none'}`);
    console.log(`  width: ${width ? width[1] : 'none'}, height: ${height ? height[1] : 'none'}`);
    console.log(`  size: ${content.length} bytes`);
  }
});
