// scripts/final-mega-fix.js
// Tillerstead: Ultimate CSS fixer - handles ALL remaining unprefixed properties
// Comprehensive pattern matching and intelligent prefix assignment

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sassDir = path.resolve(__dirname, '..', '_sass');

/**
 * Get prefix for a property based on comprehensive pattern matching
 */
function getPrefix(propName) {
  const prop = propName.replace(/^--/, '');

  // Already has valid prefix
  if (prop.match(/^(ts-|tiller-|color-|spacing-|font-|z-|breakpoint-)/)) {
    return null;
  }

  // Spacing patterns (number-based and named)
  if (prop.match(/^(space-\d+|space-[a-z]+|container|section|card|gutter|grid|pad|padding|margin|gap|flow|stack|cluster|width|height|max|min|size|inline|block)/)) {
    return 'spacing-';
  }

  // Color patterns (comprehensive theme coverage)
  if (prop.match(/^(cartoon|comic|neon|sunset|hot|lime|electric|cyber|cool|brand|warm|navy|stone|ink|emerald|shadow|red|green|blue|yellow|orange|pink|gray|grey|teal|violet|indigo|cyan|magenta|amber|rose|surface|bg|background|foreground|border|divider|accent|primary|secondary|dark|light|dim|bright|muted|subtle|white|black|transparent)/)) {
    return 'color-';
  }

  // Typography
  if (prop.match(/^(font|heading|line|text|letter|weight|family|serif|sans|mono)/)) {
    return 'font-';
  }

  // Animation/timing
  if (prop.match(/^(ease|duration|timing|delay|spring|curve)/)) {
    return 'tiller-';
  }

  // Visual effects
  if (prop.match(/^(radius|rounded|shadow|glow|ring|elevation|focus|outline|blur|opacity|overlay|backdrop|filter|gradient|pattern|bubble|dot|stroke|comic|outline-)/)) {
    return 'tiller-';
  }

  // Transitions
  if (prop.match(/^transition/)) {
    return 'tiller-';
  }

  // Layout/positioning
  if (prop.match(/^(layout|shell|wrapper|z-|layer|stack|above|below)/)) {
    return 'tiller-';
  }

  // Component-specific
  if (prop.match(/^(social|icon|pill|badge|tag|chip|footer|header|hero|nav|menu|sidebar|modal|dialog|toast|notification|alert|banner|panel|button|form|input|dropdown|tooltip|popover|drawer)/)) {
    return 'tiller-';
  }

  // Default
  return 'tiller-';
}

/**
 * Fix a single file
 */
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const replacements = new Map();

    // Find all unprefixed properties (definitions and usages)
    const propPattern = /(--[a-z][a-z0-9-]*)/g;
    const matches = content.matchAll(propPattern);

    for (const match of matches) {
      const propName = match[1];
      const prefix = getPrefix(propName);

      if (prefix) {
        const newPropName = `--${prefix}${propName.substring(2)}`;
        if (!replacements.has(propName)) {
          replacements.set(propName, newPropName);
        }
      }
    }

    if (replacements.size === 0) {
      return 0;
    }

    // Apply all replacements
    for (const [oldProp, newProp] of replacements.entries()) {
      const escapedOld = oldProp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Replace in all contexts
      const defRegex = new RegExp(`\\b${escapedOld}:`, 'g');
      const varRegex = new RegExp(`var\\(${escapedOld}([,\\)])`, 'g');

      content = content.replace(defRegex, `${newProp}:`);
      content = content.replace(varRegex, `var(${newProp}$1`);
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return replacements.size;
    }

    return 0;
  } catch (err) {
    console.error(`Error fixing ${filePath}:`, err.message);
    return 0;
  }
}

/**
 * Main process
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║  Tillerstead: Final Mega Fix                      ║');
  console.log('║  Phase 3 - Push to Zero Violations                ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  try {
    const scssFiles = await glob('**/*.scss', { cwd: sassDir, absolute: true });

    console.log(`Processing ${scssFiles.length} SCSS files...\n`);

    let totalFixed = 0;
    let filesFixed = 0;

    for (const file of scssFiles) {
      const fixed = fixFile(file);
      if (fixed > 0) {
        const relativePath = path.relative(sassDir, file);
        console.log(`✓ ${relativePath.padEnd(50)} (${fixed} properties)`);
        totalFixed += fixed;
        filesFixed++;
      }
    }

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  Mega Fix Complete                                 ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log(`  Files fixed: ${filesFixed}/${scssFiles.length}`);
    console.log(`  Properties fixed: ${totalFixed}\n`);
    console.log('Next: npm run lint:css to verify');
    console.log('      npm run build to test');
  } catch (err) {
    console.error('✗ Mega fix failed:', err.message);
    process.exit(1);
  }
}

main();
