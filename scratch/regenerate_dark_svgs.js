const fs = require('fs');
const path = require('path');

const publicDir = path.join('c:', 'Users', 'user', 'Desktop', 'AEETHOD', 'aeethod_frontend', 'public');

// --- 1. Process down_area.svg -> down_area_dark.svg ---
const downAreaPath = path.join(publicDir, 'down_area.svg');
let downArea = fs.readFileSync(downAreaPath, 'utf8');

// Replace background fills
downArea = downArea.replace(/fill="#ECECEC"/g, 'fill="#0A0A0F"'); // Matching page background
downArea = downArea.replace(/fill="#B2CEFE"/g, 'fill="#101826"'); // Sunk dark blue path

// Replace track outer shadows (filter0)
downArea = downArea.replace(/values="0 0 0 0 0\.611765 0 0 0 0 0\.611765 0 0 0 0 0\.611765 0 0 0 0\.5 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"'); // Drop shadow dark
downArea = downArea.replace(/values="0 0 0 0 0\.611765 0 0 0 0 0\.611765 0 0 0 0 0\.611765 0 0 0 0\.9 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0"'); // Inner shadow dark
downArea = downArea.replace(/values="0 0 0 0 0\.611765 0 0 0 0 0\.611765 0 0 0 0 0\.611765 0 0 0 0\.2 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"'); // Other inner dark
downArea = downArea.replace(/values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0\.9 0"/g, 'values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.04 0"'); // Inner shadow light (subtle)
downArea = downArea.replace(/values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0\.3 0"/g, 'values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.02 0"'); // Drop shadow light (subtle)

// Replace track inner blue path shadows (filter1)
// First, adjust the offset and blurs from 3px to 1px/1.5px to align depth
downArea = downArea.replace(/dx="-3" dy="-3" stdDeviation="3"/g, 'dx="-1" dy="-1" stdDeviation="1"');
downArea = downArea.replace(/dx="3" dy="3" stdDeviation="4"/g, 'dx="1" dy="1" stdDeviation="1.5"');
downArea = downArea.replace(/dx="3" dy="-3" stdDeviation="3"/g, 'dx="1" dy="-1" stdDeviation="1"');
downArea = downArea.replace(/dx="-3" dy="3" stdDeviation="3"/g, 'dx="-1" dy="1" stdDeviation="1"');

// Adjust the color matrices
downArea = downArea.replace(/values="0 0 0 0 0\.537255 0 0 0 0 0\.623529 0 0 0 0 0\.768627 0 0 0 0\.5 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"');
downArea = downArea.replace(/values="0 0 0 0 0\.537255 0 0 0 0 0\.623529 0 0 0 0 0\.768627 0 0 0 0\.9 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0"');
downArea = downArea.replace(/values="0 0 0 0 0\.537255 0 0 0 0 0\.623529 0 0 0 0 0\.768627 0 0 0 0\.2 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"');
downArea = downArea.replace(/values="0 0 0 0 0\.858824 0 0 0 0 0\.992157 0 0 0 0 1 0 0 0 0\.3 0"/g, 'values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.02 0"');
downArea = downArea.replace(/values="0 0 0 0 0\.858824 0 0 0 0 0\.992157 0 0 0 0 1 0 0 0 0\.9 0"/g, 'values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.04 0"');

fs.writeFileSync(path.join(publicDir, 'down_area_dark.svg'), downArea, 'utf8');
console.log('Created down_area_dark.svg successfully!');


// --- 2. Process button_up.svg -> button_up_dark.svg ---
const buttonUpPath = path.join(publicDir, 'button_up.svg');
let buttonUp = fs.readFileSync(buttonUpPath, 'utf8');

// Replace background fills
buttonUp = buttonUp.replace(/<rect x="3" y="3" width="30" height="30" rx="15" fill="#ECECEC"\/>/, '<rect x="3" y="3" width="30" height="30" rx="15" fill="#181822"/>'); // Elevated knob body
buttonUp = buttonUp.replace(/<rect x="6\.75" y="6\.75" width="22\.5" height="22\.5" rx="11\.25" fill="#ECECEC"\/>/, '<rect x="6.75" y="6.75" width="22.5" height="22.5" rx="11.25" fill="#0A0A0F"/>'); // Recessed circle matching body background

// Replace knob outer shadows (filter0)
buttonUp = buttonUp.replace(/values="0 0 0 0 0\.556863 0 0 0 0 0\.556863 0 0 0 0 0\.556863 0 0 0 0\.9 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0"');
buttonUp = buttonUp.replace(/values="0 0 0 0 0\.556863 0 0 0 0 0\.556863 0 0 0 0 0\.556863 0 0 0 0\.2 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"');
buttonUp = buttonUp.replace(/values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0\.9 0"/g, 'values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0"');
buttonUp = buttonUp.replace(/values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0\.3 0"/g, 'values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.02 0"');

// Replace knob inner shadows (filter1)
buttonUp = buttonUp.replace(/values="0 0 0 0 0\.654902 0 0 0 0 0\.654902 0 0 0 0 0\.654902 0 0 0 0\.9 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0"');
buttonUp = buttonUp.replace(/values="0 0 0 0 0\.654902 0 0 0 0 0\.654902 0 0 0 0 0\.654902 0 0 0 0\.5 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"');
buttonUp = buttonUp.replace(/values="0 0 0 0 0\.654902 0 0 0 0 0\.654902 0 0 0 0 0\.654902 0 0 0 0\.2 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"');
// Wait, the inner light highlights are already handled by general white matrix replacement above, let's make sure they are written
// Since values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0" and "0.3" were replaced, they are already handled!

fs.writeFileSync(path.join(publicDir, 'button_up_dark.svg'), buttonUp, 'utf8');
console.log('Created button_up_dark.svg successfully!');
