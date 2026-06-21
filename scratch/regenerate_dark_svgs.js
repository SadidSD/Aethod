const fs = require('fs');
const path = require('path');

const publicDir = path.join('c:', 'Users', 'user', 'Desktop', 'AEETHOD', 'aeethod_frontend', 'public');

// --- 1. Process down_area.svg -> down_area_dark.svg ---
const downAreaPath = path.join(publicDir, 'down_area.svg');
let downArea = fs.readFileSync(downAreaPath, 'utf8');

// Replace background fills (to match the dark purple theme)
downArea = downArea.replace(/fill="#ECECEC"/g, 'fill="#1a1a2e"'); // Primary background
downArea = downArea.replace(/fill="#B2CEFE"/g, 'fill="#223355"'); // Recessed blue/purple track

// Replace track outer shadows (filter0) with purple-tinted dark shadows
downArea = downArea.replace(/values="0 0 0 0 0\.611765 0 0 0 0 0\.611765 0 0 0 0 0\.611765 0 0 0 0\.5 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0"'); // Drop shadow dark
downArea = downArea.replace(/values="0 0 0 0 0\.611765 0 0 0 0 0\.611765 0 0 0 0 0\.611765 0 0 0 0\.9 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0"'); // Inner shadow dark
downArea = downArea.replace(/values="0 0 0 0 0\.611765 0 0 0 0 0\.611765 0 0 0 0 0\.611765 0 0 0 0\.2 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"'); // Other inner dark

// Light highlights tinted with purple/blue (RGB: 60, 60, 90)
downArea = downArea.replace(/values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0\.9 0"/g, 'values="0 0 0 0 0.235 0 0 0 0 0.235 0 0 0 0 0.353 0 0 0 0.25 0"'); // Inner shadow light (subtle)
downArea = downArea.replace(/values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0\.3 0"/g, 'values="0 0 0 0 0.235 0 0 0 0 0.235 0 0 0 0 0.353 0 0 0 0.12 0"'); // Drop shadow light (subtle)

// Replace track inner blue path shadows (filter1)
// First, adjust the offset and blurs from 3px to 1px/1.5px to align depth
downArea = downArea.replace(/dx="-3" dy="-3" stdDeviation="3"/g, 'dx="-1" dy="-1" stdDeviation="1"');
downArea = downArea.replace(/dx="3" dy="3" stdDeviation="4"/g, 'dx="1" dy="1" stdDeviation="1.5"');
downArea = downArea.replace(/dx="3" dy="-3" stdDeviation="3"/g, 'dx="1" dy="-1" stdDeviation="1"');
downArea = downArea.replace(/dx="-3" dy="3" stdDeviation="3"/g, 'dx="-1" dy="1" stdDeviation="1"');

// Adjust the color matrices for the track inner path
downArea = downArea.replace(/values="0 0 0 0 0\.537255 0 0 0 0 0\.623529 0 0 0 0 0\.768627 0 0 0 0\.5 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0"');
downArea = downArea.replace(/values="0 0 0 0 0\.537255 0 0 0 0 0\.623529 0 0 0 0 0\.768627 0 0 0 0\.9 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0"');
downArea = downArea.replace(/values="0 0 0 0 0\.537255 0 0 0 0 0\.623529 0 0 0 0 0\.768627 0 0 0 0\.2 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"');
downArea = downArea.replace(/values="0 0 0 0 0\.858824 0 0 0 0 0\.992157 0 0 0 0 1 0 0 0 0\.3 0"/g, 'values="0 0 0 0 0.235 0 0 0 0 0.235 0 0 0 0 0.353 0 0 0 0.12 0"');
downArea = downArea.replace(/values="0 0 0 0 0\.858824 0 0 0 0 0\.992157 0 0 0 0 1 0 0 0 0\.9 0"/g, 'values="0 0 0 0 0.235 0 0 0 0 0.235 0 0 0 0 0.353 0 0 0 0.25 0"');

fs.writeFileSync(path.join(publicDir, 'down_area_dark.svg'), downArea, 'utf8');
console.log('Created down_area_dark.svg successfully!');


// --- 2. Process button_up.svg -> button_up_dark.svg ---
const buttonUpPath = path.join(publicDir, 'button_up.svg');
let buttonUp = fs.readFileSync(buttonUpPath, 'utf8');

// Replace background fills (to match the dark purple theme)
buttonUp = buttonUp.replace(/<rect x="3" y="3" width="30" height="30" rx="15" fill="#ECECEC"\/>/, '<rect x="3" y="3" width="30" height="30" rx="15" fill="#2a2a44"/>'); // Elevated knob body
buttonUp = buttonUp.replace(/<rect x="6\.75" y="6\.75" width="22\.5" height="22\.5" rx="11\.25" fill="#ECECEC"\/>/, '<rect x="6.75" y="6.75" width="22.5" height="22.5" rx="11.25" fill="#1a1a2e"/>'); // Recessed circle matching body background

// Replace knob outer shadows (filter0)
buttonUp = buttonUp.replace(/values="0 0 0 0 0\.556863 0 0 0 0 0\.556863 0 0 0 0 0\.556863 0 0 0 0\.9 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.65 0"');
buttonUp = buttonUp.replace(/values="0 0 0 0 0\.556863 0 0 0 0 0\.556863 0 0 0 0 0\.556863 0 0 0 0\.2 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"');
buttonUp = buttonUp.replace(/values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0\.9 0"/g, 'values="0 0 0 0 0.235 0 0 0 0 0.235 0 0 0 0 0.353 0 0 0 0.25 0"');
buttonUp = buttonUp.replace(/values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0\.3 0"/g, 'values="0 0 0 0 0.235 0 0 0 0 0.235 0 0 0 0 0.353 0 0 0 0.12 0"');

// Replace knob inner shadows (filter1)
buttonUp = buttonUp.replace(/values="0 0 0 0 0\.654902 0 0 0 0 0\.654902 0 0 0 0 0\.654902 0 0 0 0\.9 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.65 0"');
buttonUp = buttonUp.replace(/values="0 0 0 0 0\.654902 0 0 0 0 0\.654902 0 0 0 0 0\.654902 0 0 0 0\.5 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"');
buttonUp = buttonUp.replace(/values="0 0 0 0 0\.654902 0 0 0 0 0\.654902 0 0 0 0 0\.654902 0 0 0 0\.2 0"/g, 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"');

fs.writeFileSync(path.join(publicDir, 'button_up_dark.svg'), buttonUp, 'utf8');
console.log('Created button_up_dark.svg successfully!');
