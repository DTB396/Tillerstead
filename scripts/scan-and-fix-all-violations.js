// scripts/scan-and-fix-all-violations.js
// Tillerstead: Complete CSS violation scanner and fixer
// Identifies ALL unprefixed custom properties and fixes them

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sassDir = path.resolve(__dirname, '..', '_sass');

/**
 * Comprehensive prefix determination
 */
function getPrefix(propName) {
  const prop = propName.replace(/^--/, '');

  // Already has valid prefix - skip
  if (prop.match(/^(ts-|tiller-|color-|spacing-|font-|z-|breakpoint-)/)) {
    return null;
  }

  // Color patterns (extensive)
  if (prop.match(/^(neon|sunset|hot|lime|electric|cyber|cool|comic|bubble|stone|ink|emerald|shadow|navy|red|green|blue|yellow|orange|pink|gray|grey|teal|violet|indigo|cyan|magenta|amber|rose|surface|bg|background|foreground|border|divider|accent|primary|secondary|error|success|warning|info|dark|light)/)) {
    return 'color-';
  }

  // Social media / icons
  if (prop.match(/^(social|icon|pill|badge|tag|chip)/)) {
    return 'tiller-';
  }

  // Spacing (including space- and size variants)
  if (prop.match(/^(space|size|container|section|card|gutter|grid|spacing|pad|padding|margin|gap|hero|layout|shell|width|height|max|min|inline|block)/)) {
    return 'spacing-';
  }

  // Typography
  if (prop.match(/^(font|heading|line|text|letter|weight|family|serif|sans|mono)/)) {
    return 'font-';
  }

  // Effects and transitions
  if (prop.match(/^(transition|duration|timing|animation|delay|ease|curve|spring)/)) {
    return 'tiller-';
  }

  // Visual effects
  if (prop.match(/(shadow|glow|ring|elevation|focus|outline|blur|opacity|overlay|backdrop|filter|gradient|pattern)/)) {
    return 'tiller-';
  }

  // Borders and shapes
  if (prop.match(/^(radius|rounded|border|outline|stroke)/)) {
    return 'tiller-';
  }

  // Component-specific
  if (prop.match(/^(footer|header|hero|nav|menu|sidebar|modal|dialog|toast|notification|alert|banner|panel|card|button|form|input|dropdown|tooltip|popover|drawer)/)) {
    return 'tiller-';
  }

  // Layout/positioning
  if (prop.match(/^(z|layer|stack|above|below|top|bottom|left|right)/)) {
    return 'z-';
  }

  // Breakpoints
  if (prop.match(/^(breakpoint|bp|screen|viewport|mobile|tablet|desktop)/)) {
    return 'breakpoint-';
  }

  // Default fallback
  return 'tiller-';
}

/**
 * Scan a file and collect all unprefixed property definitions
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const violations = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/^\s*(--[a-z][a-z0-9-]*)\s*:/);

      if (match) {
        const propName = match[1];
        const prefix = getPrefix(propName);

        if (prefix) {
          const newPropName = `--${prefix}${propName.substring(2)}`;
          violations.push({
            line: i + 1,
            old: propName,
            new: newPropName
          });
        }
      }
    }

    return violations;
  } catch (err) {
    console.error(`Error scanning ${filePath}:`, err.message);
    return [];
  }
}

/**
 * Fix all unprefixed properties in a file
 */
function fixFile(filePath, dryRun = false) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const replacements = new Map();

    // Find all definitions
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/^\s*(--[a-z][a-z0-9-]*)\s*:/);

      if (match) {
        const propName = match[1];
        const prefix = getPrefix(propName);

        if (prefix) {
          const newPropName = `--${prefix}${propName.substring(2)}`;
          replacements.set(propName, newPropName);
        }
      }
    }

    if (replacements.size === 0) {
      return 0;
    }

    // Apply replacements
    let updatedContent = content;
    for (const [oldProp, newProp] of replacements.entries()) {
      const escapedOld = oldProp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Replace definitions
      const defRegex = new RegExp(`\\b${escapedOld}:`, 'g');
      // Replace usages
      const varRegex = new RegExp(`var\\(${escapedOld}\\)`, 'g');
      const varFallbackRegex = new RegExp(`var\\(${escapedOld},`, 'g');

      updatedContent = updatedContent.replace(defRegex, `${newProp}:`);
      updatedContent = updatedContent.replace(varRegex, `var(${newProp})`);
      updatedContent = updatedContent.replace(varFallbackRegex, `var(${newProp},`);
    }

    if (!dryRun) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
    }

    return replacements.size;
  } catch (err) {
    console.error(`Error fixing ${filePath}:`, err.message);
    return 0;
  }
}

/**
 * Main process
 */
async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║  Tillerstead: Complete CSS Violation Fix          ║');
  console.log('║  Phase 2 - Nail Down Remaining 818 Violations     ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  try {
    const scssFiles = await glob('**/*.scss', { cwd: sassDir, absolute: true });

    console.log(`Scanning ${scssFiles.length} SCSS files...\n`);

    // Scan phase
    const allViolations = [];
    for (const file of scssFiles) {
      const violations = scanFile(file);
      if (violations.length > 0) {
        allViolations.push({ file, violations });
      }
    }

    console.log(`Found ${allViolations.length} files with violations\n`);

    if (dryRun) {
      // Show detailed report in dry run
      for (const { file, violations } of allViolations) {
        const relativePath = path.relative(sassDir, file);
        console.log(`\n📄 ${relativePath} (${violations.length} violations)`);
        violations.slice(0, 5).forEach(v => {
          console.log(`   Line ${v.line}: ${v.old} → ${v.new}`);
        });
        if (violations.length > 5) {
          console.log(`   ... and ${violations.length - 5} more`);
        }
      }
    } else {
      // Fix phase
      console.log('Applying fixes...\n');
      let totalFixed = 0;
      let filesFixed = 0;

      for (const file of scssFiles) {
        const fixed = fixFile(file, false);
        if (fixed > 0) {
          const relativePath = path.relative(sassDir, file);
          console.log(`✓ ${relativePath.padEnd(50)} (${fixed} properties)`);
          totalFixed += fixed;
          filesFixed++;
        }
      }

      console.log('\n╔════════════════════════════════════════════════════╗');
      console.log('║  Fix Complete                                      ║');
      console.log('╚════════════════════════════════════════════════════╝');
      console.log(`  Files fixed: ${filesFixed}/${scssFiles.length}`);
      console.log(`  Properties fixed: ${totalFixed}\n`);
      console.log('Next: npm run lint:css to verify');
    }
  } catch (err) {
    console.error('✗ Process failed:', err.message);
    process.exit(1);
  }
}

main();
