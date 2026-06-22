const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/user/Desktop/AEETHOD/aeethod_frontend/public/research';

function analyze(file) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  console.log(`=== File: ${file} ===`);
  console.log(`  Starts with: ${content.substring(0, 150)}...`);
  
  // Count elements
  const paths = (content.match(/<path/g) || []).length;
  const circles = (content.match(/<circle/g) || []).length;
  const texts = (content.match(/<text/g) || []).length;
  const rects = (content.match(/<rect/g) || []).length;
  const lines = (content.match(/<line/g) || []).length;
  
  console.log(`  Paths: ${paths}, Circles: ${circles}, Texts: ${texts}, Rects: ${rects}, Lines: ${lines}`);
  
  // Print some texts if any
  const textMatches = content.match(/<text[^>]*>([\s\S]*?)<\/text>/gi);
  if (textMatches) {
    console.log(`  Found texts: ${textMatches.map(t => t.replace(/<[^>]*>/g, '').trim()).slice(0, 10).join(', ')}`);
  }
}

['Line 4.svg', 'Group 39.svg', 'Circle.svg', 'Vector 32.svg'].forEach(analyze);
