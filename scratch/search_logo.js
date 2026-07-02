const fs = require('fs');
const path = require('path');

function searchFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        searchFiles(filePath, fileList);
      }
    } else {
      if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('logo.svg') || content.includes('navbar logo.svg')) {
          fileList.push(filePath);
        }
      }
    }
  }
  return fileList;
}

const dirToSearch = "c:\\Users\\user\\Desktop\\AEETHOD\\aeethod_frontend";
const results = searchFiles(dirToSearch);
console.log("Files containing logo.svg or navbar logo.svg:");
console.log(results);
