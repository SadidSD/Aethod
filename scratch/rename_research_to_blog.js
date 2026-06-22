const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '../app');

function renameInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Replace regular nav link
  const normalNavLink = /<a\s+href="\/research"\s+className=\{styles\.navLink\}>\s*Research\s*<\/a>/g;
  if (normalNavLink.test(content)) {
    content = content.replace(normalNavLink, `<a href="/blog" className={styles.navLink}>
                Blog
              </a>`);
    changed = true;
  }

  // 2. Replace active nav link
  const activeNavLink = /<a\s+href="\/research"\s+className=\{\`\$\{styles\.navLink\}\s+\$\{styles\.activeNavLink\}\`\}>\s*Research\s*<\/a>/g;
  const activeNavLinkAlt = /<a\s+href="\/research"\s+className=\{"\$\{styles\.navLink\}\s+\$\{styles\.activeNavLink\}"\}>\s*Research\s*<\/a>/g;
  const activeNavLinkString = /<a\s+href="\/research"\s+className="\$\{styles\.navLink\}\s+\$\{styles\.activeNavLink\}">\s*Research\s*<\/a>/g;
  const activeNavLinkSimple = /<a\s+href="\/research"\s+className=\`\$\{styles\.navLink\}\s+\$\{styles\.activeNavLink\}\`>\s*Research\s*<\/a>/g;
  const activeNavLinkCurly = /<a\s+href="\/research"\s+className=\{\`\$\{styles\.navLink\}\s+\$\{styles\.activeNavLink\}\`\}>\s*Research\s*<\/a>/g;
  const activeNavLinkStandard = /<a\s+href="\/research"\s+className=\{"\$\{styles\.navLink\}\s+\$\{styles\.activeNavLink\}"\}>\s*Research\s*<\/a>/g;

  // Let's use a very broad regex for the active nav link to capture any variation of styles.activeNavLink
  const broadActiveNavLink = /<a\s+href="\/research"\s+className=\{\s*`\s*\$\{styles\.navLink\}\s+\$\{styles\.activeNavLink\}\s*`\s*\}?>\s*Research\s*<\/a>/g;
  const broadActiveNavLink2 = /<a\s+href="\/research"\s+className=\{\s*"\s*\$\{styles\.navLink\}\s+\$\{styles\.activeNavLink\}\s*"\s*\}?>\s*Research\s*<\/a>/g;
  const broadActiveNavLink3 = /<a\s+href="\/research"\s+className=\`\s*\$\{styles\.navLink\}\s+\$\{styles\.activeNavLink\}\s*\`?>\s*Research\s*<\/a>/g;
  const broadActiveNavLink4 = /<a\s+href="\/research"\s+className=\{\s*styles\.navLink\s*\+\s*'\s*'\s*\+\s*styles\.activeNavLink\s*\}>\s*Research\s*<\/a>/g;

  if (content.includes('href="/research"') && content.includes('activeNavLink')) {
    // Replace active nav link in blog/page.js
    content = content.replace(/<a\s+href="\/research"\s+className=\{\s*`\$\{styles\.navLink\}\s+\$\{styles\.activeNavLink\}`\s*\}?>\s*Research\s*<\/a>/gi, `<a href="/blog" className={\`\$\{styles.navLink\} \$\{styles.activeNavLink\}\`}>\n                Blog\n              </a>`);
    content = content.replace(/<a\s+href="\/research"\s+className=\{\s*"\$\{styles\.navLink\}\s+\$\{styles\.activeNavLink\}"\s*\}?>\s*Research\s*<\/a>/gi, `<a href="/blog" className={\`\$\{styles.navLink\} \$\{styles.activeNavLink\}\`}>\n                Blog\n              </a>`);
    content = content.replace(/<a\s+href="\/research"\s+className=\`\$\{styles\.navLink\}\s+\$\{styles\.activeNavLink\}\`?>\s*Research\s*<\/a>/gi, `<a href="/blog" className={\`\$\{styles.navLink\} \$\{styles.activeNavLink\}\`}>\n                Blog\n              </a>`);
    changed = true;
  }

  // 3. Replace footer link
  const footerNavLink = /<a\s+href="\/research"\s+className=\{styles\.footerNavLink\}>Research<\/a>/g;
  if (footerNavLink.test(content)) {
    content = content.replace(footerNavLink, `<a href="/blog" className={styles.footerNavLink}>Blog</a>`);
    changed = true;
  }

  // 4. Specifically for app/blog/page.js, rename component and export
  if (filePath.endsWith('blog' + path.sep + 'page.js') || filePath.endsWith('blog/page.js')) {
    content = content.replace(/export default function ResearchPage\(\)/g, 'export default function BlogPage()');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Renamed in: ${filePath}`);
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
      renameInFile(fullPath);
    }
  }
}

processDirectory(APP_DIR);
console.log('Renaming process complete!');
