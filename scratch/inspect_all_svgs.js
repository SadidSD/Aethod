const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/user/Desktop/AEETHOD/aeethod_frontend/public/research';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.svg')) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const ids = [];
    const idRegex = /id=["']([^"']+)["']/g;
    let match;
    while ((match = idRegex.exec(content)) !== null) {
      ids.push(match[1]);
    }
    const hasText = content.includes('<text');
    console.log(`File: ${file} (IDs: ${ids.slice(0, 5).join(', ')})${hasText ? ' [HAS TEXT]' : ''}`);
  }
});
