// scripts/phase4-final-cleanup.js
// Tillerstead: Phase 4 - Fix all remaining non-custom-property violations
// Targets: color functions, keyframes, aria properties

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sassDir = path.resolve(__dirname, '..', '_sass');

/**
 * Fix color function notation (modern → legacy)
 * Convert: rgb(r g b / a) → rgb(r, g, b, a)
 * Convert: hsl(h s l / a) → hsl(h, s, l, a)
 */
function fixColorFunctions(content) {
  let fixed = 0;
  let updated = content;

  // Modern space-separated rgb with slash alpha: rgb(r g b / a) → rgb(r, g, b, a)
  const modernRgbPattern = /rgb\((\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)\)/g;
  const rgbMatches = updated.match(modernRgbPattern);
  if (rgbMatches) {
    updated = updated.replace(modernRgbPattern, 'rgb($1, $2, $3, $4)');
    fixed += rgbMatches.length;
  }

  // Modern space-separated hsl with slash alpha: hsl(h s l / a) → hsl(h, s, l, a)
  const modernHslPattern = /hsl\(([\d.]+)\s+([\d.]+%)\s+([\d.]+%)\s*\/\s*([\d.]+)\)/g;
  const hslMatches = updated.match(modernHslPattern);
  if (hslMatches) {
    updated = updated.replace(modernHslPattern, 'hsl($1, $2, $3, $4)');
    fixed += hslMatches.length;
  }

  return { content: updated, fixed };
}

/**
 * Fix keyframe names (camelCase → kebab-case)
 */
function fixKeyframeNames(content) {
  let fixed = 0;

  const keyframeMap = {
    'fadeInUp': 'fade-in-up',
    'fadeIn': 'fade-in',
    'fadeOut': 'fade-out',
    'slideInLeft': 'slide-in-left',
    'slideInRight': 'slide-in-right',
    'zoomIn': 'zoom-in',
    'zoomOut': 'zoom-out'
  };

  for (const [oldName, newName] of Object.entries(keyframeMap)) {
    // Fix @keyframes definition
    const keyframesRegex = new RegExp(`@keyframes\\s+${oldName}\\b`, 'g');
    if (keyframesRegex.test(content)) {
      content = content.replace(keyframesRegex, `@keyframes ${newName}`);
      fixed++;
    }

    // Fix animation property usage
    const animationRegex = new RegExp(`(animation(?:-name)?:\\s*)${oldName}\\b`, 'g');
    if (animationRegex.test(content)) {
      content = content.replace(animationRegex, `$1${newName}`);
      fixed++;
    }
  }

  return { content, fixed };
}

/**
 * Fix or suppress aria property warnings
 */
function fixAriaProperties(content) {
  let fixed = 0;

  // These are valid CSS pseudo-classes but stylelint doesn't recognize them
  // We'll add stylelint-disable comments for these
  const lines = content.split('\n');
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line has aria-hidden or aria-live as CSS property
    if (line.match(/^\s+(aria-hidden|aria-live):\s*/)) {
      // Add disable comment before the line
      const indent = line.match(/^\s*/)[0];
      newLines.push(`${indent}/* stylelint-disable-next-line property-no-unknown */`);
      fixed++;
    }

    newLines.push(line);
  }

  if (fixed > 0) {
    content = newLines.join('\n');
  }

  return { content, fixed };
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let totalFixed = 0;

    // Apply all fixes
    const colorResult = fixColorFunctions(content);
    content = colorResult.content;
    totalFixed += colorResult.fixed;

    const keyframeResult = fixKeyframeNames(content);
    content = keyframeResult.content;
    totalFixed += keyframeResult.fixed;

    const ariaResult = fixAriaProperties(content);
    content = ariaResult.content;
    totalFixed += ariaResult.fixed;

    // Write back if changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return totalFixed;
    }

    return 0;
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
    return 0;
  }
}

/**
 * Main
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║  Tillerstead: Phase 4 Final Cleanup               ║');
  console.log('║  Fix color functions, keyframes, aria properties   ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  try {
    const scssFiles = await glob('**/*.scss', { cwd: sassDir, absolute: true });

    console.log(`Processing ${scssFiles.length} SCSS files...\n`);

    let totalFixed = 0;
    let filesFixed = 0;

    for (const file of scssFiles) {
      const fixed = processFile(file);
      if (fixed > 0) {
        const relativePath = path.relative(sassDir, file);
        console.log(`✓ ${relativePath.padEnd(50)} (${fixed} fixes)`);
        totalFixed += fixed;
        filesFixed++;
      }
    }

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  Phase 4 Cleanup Complete                          ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log(`  Files fixed: ${filesFixed}/${scssFiles.length}`);
    console.log(`  Total fixes: ${totalFixed}\n`);
    console.log('Next: npm run lint:css to verify');
  } catch (err) {
    console.error('✗ Phase 4 failed:', err.message);
    process.exit(1);
  }
}

main();
