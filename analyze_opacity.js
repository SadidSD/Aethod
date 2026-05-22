const fs = require('fs');
const path = require('path');

const publicDir = 'c:/Users/user/Desktop/aeethod_frontend/public';

function decodeSvg(filename, outputPngName) {
  const filePath = path.join(publicDir, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const imgHrefMatch = content.match(/xlink:href="data:image\/png;base64,([^"]+)"/);
  if (!imgHrefMatch) {
    console.error(`Base64 image not found in ${filename}`);
    return;
  }
  const base64Data = imgHrefMatch[1];
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(path.join(publicDir, outputPngName), buffer);
  console.log(`Saved decoded PNG to ${outputPngName}`);
}

decodeSvg('curve icon1.svg', 'temp_icon1.png');
decodeSvg('curve icon2.svg', 'temp_icon2.png');
decodeSvg('curve icon3.svg', 'temp_icon3.png');
