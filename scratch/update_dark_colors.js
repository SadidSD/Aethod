const fs = require('fs');
const path = require('path');

const appDir = path.join('c:', 'Users', 'user', 'Desktop', 'AEETHOD', 'aeethod_frontend', 'app');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

// 1. Process all .module.css files
walkDir(appDir, (filePath) => {
  if (filePath.endsWith('.module.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace #22223a with var(--bg-surface)
    content = content.replace(/#22223a/gi, 'var(--bg-surface)');

    // Replace #2a2a44 with var(--bg-elevated)
    content = content.replace(/#2a2a44/gi, 'var(--bg-elevated)');

    // Replace #1e1e34 with var(--bg-surface) (since it's a dark background card/input)
    content = content.replace(/#1e1e34/gi, 'var(--bg-surface)');

    // For #1a1a2e, safely replace it when it's used for background or fill
    content = content.replace(/background:\s*#1a1a2e/gi, 'background: var(--bg-primary)');
    content = content.replace(/background-color:\s*#1a1a2e/gi, 'background-color: var(--bg-primary)');
    content = content.replace(/fill:\s*#1a1a2e/gi, 'fill: var(--bg-primary)');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated module styles in: ${path.basename(filePath)}`);
    }
  }
});

// 2. Process products page.js gradient stop
const productsJsPath = path.join(appDir, 'products', 'page.js');
if (fs.existsSync(productsJsPath)) {
  let content = fs.readFileSync(productsJsPath, 'utf8');
  let original = content;
  content = content.replace(/stopColor="#1a1a2e"/gi, 'stopColor="#0A0A0F"');
  content = content.replace(/stopColor="#30304a"/gi, 'stopColor="#181822"');
  if (content !== original) {
    fs.writeFileSync(productsJsPath, content, 'utf8');
    console.log('Updated products/page.js gradient stops');
  }
}
