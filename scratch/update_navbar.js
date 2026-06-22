const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '../app');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace Vlog link with Research link (standard inactive style)
  const vlogRegex = /<a\s+href="#"\s+className=\{styles\.navLink\}\s+onClick=\{\(\)\s*=>\s*alert\(['"]Vlog coming soon['"]\)\}>\s*Vlog\s*<\/a>/g;
  if (vlogRegex.test(content)) {
    content = content.replace(vlogRegex, `<a href="/research" className={styles.navLink}>
                Research
              </a>`);
    changed = true;
  }

  // Handle case where style brackets or spacing is slightly different
  const vlogRegexAlt = /<a\s+href="#"\s+className=\{styles\.navLink\}\s+onClick=\{\(\)\s*=>\s*alert\(['"]Vlog coming soon['"]\)\}>\s*Vlog\s*<\/a>/gi;

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated navbar in: ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file === 'page.js') {
      updateFile(fullPath);
    }
  }
}

processDirectory(APP_DIR);
console.log('Navbar update complete!');
