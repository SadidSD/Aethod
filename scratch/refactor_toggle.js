const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '../app');

function getRelativeImports(nestingLevel) {
  let relativePath = '';
  if (nestingLevel === 0) {
    relativePath = './';
  } else if (nestingLevel === 1) {
    relativePath = '../';
  } else {
    relativePath = '../../';
  }
  return `
import { useTheme } from "${relativePath}context/ThemeContext";
import ThemeToggle from "${relativePath}components/ThemeToggle";
`;
}

function refactorFile(filePath) {
  console.log(`Refactoring file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');

  // Determine nesting level relative to 'app' directory
  const relativeFromApp = path.relative(APP_DIR, filePath);
  const parts = relativeFromApp.split(path.sep);
  const nestingLevel = parts.length - 1;

  // 1. Add imports after styles import
  const stylesImportRegex = /import styles from "\.\/page\.module\.css";/;
  if (stylesImportRegex.test(content) && !content.includes('ThemeToggle')) {
    content = content.replace(stylesImportRegex, (match) => {
      return match + getRelativeImports(nestingLevel);
    });
  }

  // 2. Replace the isDark definition line
  content = content.replace(/const\s*\[isDark,\s*setIsDark\]\s*=\s*useState\(false\);?/, 'const { isDark } = useTheme();');

  // 3. Remove other slider state variables line-by-line (very safe)
  content = content.replace(/const\s*\[isDragging,\s*setIsDragging\]\s*=\s*useState\(false\);?\r?\n/g, '');
  content = content.replace(/const\s*\[dragX,\s*setDragX\]\s*=\s*useState\(0\);?\r?\n/g, '');
  content = content.replace(/const\s*trackRef\s*=\s*useRef\(null\);?\r?\n/g, '');
  content = content.replace(/const\s*knobRef\s*=\s*useRef\(null\);?\r?\n/g, '');
  content = content.replace(/const\s*startXRef\s*=\s*useRef\(0\);?\r?\n/g, '');
  content = content.replace(/const\s*startDragXRef\s*=\s*useRef\(0\);?\r?\n/g, '');
  content = content.replace(/const\s*hasDraggedRef\s*=\s*useRef\(false\);?\r?\n/g, '');
  content = content.replace(/const\s*clickBufferRef\s*=\s*useRef\(null\);?\r?\n/g, '');
  content = content.replace(/const\s*slideClickBufferRef\s*=\s*useRef\(null\);?\r?\n/g, '');
  content = content.replace(/const\s*slideFoleyBufferRef\s*=\s*useRef\(null\);?\r?\n/g, '');
  content = content.replace(/const\s*audioContextRef\s*=\s*useRef\(null\);?\r?\n/g, '');

  // 4. Remove Audio Preloading useEffect
  // Match the block starting with a comment about pre-loading/decoding audio files
  content = content.replace(/\/\/\s*(?:Pre-load and decode audio|Preload sound)[\s\S]*?useEffect\(\(\) => \{\s*const\s*AudioContext\s*=[\s\S]*?\}\s*,\s*\[\]\);\r?\n/gi, '');

  // 5. Remove playSlideSound function
  content = content.replace(/\/\/\s*Slide sound[\s\S]*?const\s*playSlideSound\s*=\s*useCallback\(\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi, '');
  content = content.replace(/const\s*playSlideSound\s*=\s*useCallback\(\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi, '');

  // 6. Replace playClickSound with simplified single Audio instantiation
  const clickSoundRegex = /\/\/\s*(?:Button click sound|Touchpad click sound)[\s\S]*?const\s*playClickSound\s*=\s*useCallback\(\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi;
  const clickSoundSimple = `  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);\r\n`;

  if (clickSoundRegex.test(content)) {
    content = content.replace(clickSoundRegex, clickSoundSimple);
  } else {
    // If there is no comment, match function definition directly
    content = content.replace(/const\s*playClickSound\s*=\s*useCallback\(\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi, clickSoundSimple);
  }

  // 7. Remove data-theme setting useEffect
  content = content.replace(/\/\/\s*Apply theme to <html>\r?\n\s*useEffect\(\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[isDark\]\);\r?\n/gi, '');
  content = content.replace(/useEffect\(\(\)\s*=>\s*\{\s*document\.documentElement\.setAttribute\(['"]data-theme['"][\s\S]*?\}\s*,\s*\[isDark\]\);\r?\n/gi, '');

  // 8. Remove getMaxTravel
  content = content.replace(/\/\/\s*Calculate knob travel distance[\s\S]*?const\s*getMaxTravel\s*=[\s\S]*?\}\s*,\s*\[\]\);\r?\n/gi, '');
  content = content.replace(/const\s*getMaxTravel\s*=\s*useCallback\(\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[\]\);\r?\n/gi, '');

  // 9. Remove pointer drag callbacks
  content = content.replace(/\/\/\s*Pointer down[\s\S]*?const\s*handlePointerDown\s*=\s*useCallback\([\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi, '');
  content = content.replace(/const\s*handlePointerDown\s*=\s*useCallback\([\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi, '');

  content = content.replace(/\/\/\s*Pointer move[\s\S]*?const\s*handlePointerMove\s*=\s*useCallback\([\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi, '');
  content = content.replace(/const\s*handlePointerMove\s*=\s*useCallback\([\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi, '');

  content = content.replace(/\/\/\s*Pointer up[\s\S]*?const\s*handlePointerUp\s*=\s*useCallback\([\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi, '');
  content = content.replace(/const\s*handlePointerUp\s*=\s*useCallback\([\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi, '');

  // 10. Remove dragX sync and resize useEffects
  content = content.replace(/\/\/\s*Keep dragX in sync[\s\S]*?useEffect\(\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi, '');
  content = content.replace(/useEffect\(\(\)\s*=>\s*\{\s*if\s*\(!isDragging\)[\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi, '');

  content = content.replace(/\/\/\s*Recalculate on resize[\s\S]*?useEffect\(\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi, '');
  content = content.replace(/useEffect\(\(\)\s*=>\s*\{\s*const\s*handleResize[\s\S]*?\}\s*,\s*\[[\s\S]*?\]\);\r?\n/gi, '');

  // 11. Remove knobStyle
  content = content.replace(/const\s*knobStyle\s*=[\s\S]*?cubic-bezier\([\s\S]*?;\r?\n/gi, '');
  content = content.replace(/const\s*knobStyle\s*=[\s\S]*?transition:\s*['"]none['"]\s*\}\s*:\s*\{[\s\S]*?\};\r?\n/gi, '');

  // 12. Replace theme toggle JSX block
  const jsxRegex = /<div\s+className=\{styles\.slideButton\}\s+id="theme-toggle">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  if (jsxRegex.test(content)) {
    content = content.replace(jsxRegex, () => {
      return `<ThemeToggle className={styles.slideButton} />`;
    });
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully refactored: ${filePath}`);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file === 'page.js') {
      refactorFile(fullPath);
    }
  }
}

processDirectory(APP_DIR);
console.log('Done!');
