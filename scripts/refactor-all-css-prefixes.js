// scripts/refactor-all-css-prefixes.js
// Tillerstead: Complete CSS custom property refactoring
// Intelligently adds prefixes based on property semantics

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sassDir = path.resolve(__dirname, '..', '_sass');

/**
 * Determine the appropriate prefix for a CSS custom property
 */
function getPrefixForProperty(propName) {
  const prop = propName.replace(/^--/, '');

  // Already prefixed
  if (prop.match(/^(ts|tiller|color|spacing|font|z|breakpoint)-/)) {
    return null;
  }

  // Color-related
  if (prop.match(/^(stone|ink|emerald|neon|sunset|hot|lime|purple|shadow|navy|red|green|blue|yellow|orange|pink|gray|grey|teal|violet|indigo|cyan|magenta|amber|rose|surface|bg|background|foreground|border|divider)/)) {
    return 'color-';
  }

  // Spacing/layout (including space- variants)
  if (prop.match(/^(space|container|section|card|gutter|grid|spacing|pad|padding|margin|gap|hero|layout|shell|width|height|max|min|size)/)) {
    return 'spacing-';
  }

  // Typography (including text- variants)
  if (prop.match(/^(font|heading|line|text|letter|weight|family)/)) {
    return 'font-';
  }

  // Borders/radius
  if (prop.match(/^(radius|rounded|border-radius)/)) {
    return 'tiller-';
  }

  // Transitions/animations
  if (prop.match(/^(transition|duration|timing|animation|delay|ease)/)) {
    return 'tiller-';
  }

  // Shadows/effects
  if (prop.match(/(shadow|glow|ring|elevation|focus|outline)/)) {
    return 'tiller-';
  }

  // Theme-specific (footer, header, hero, etc.)
  if (prop.match(/^(footer|header|hero|nav|menu|sidebar|modal|dialog|toast|notification|overlay|backdrop)/)) {
    return 'tiller-';
  }

  // Z-index
  if (prop.match(/^z-/)) {
    return 'z-';
  }

  // Breakpoints
  if (prop.match(/^(breakpoint|bp|screen)/)) {
    return 'breakpoint-';
  }

  // Default to tiller-
  return 'tiller-';
}

/**
 * Check if a property already has a valid prefix
 */
function hasValidPrefix(propName) {
  return propName.match(/^--(ts|tiller|color|spacing|font|z|breakpoint)-/);
}

/**
 * Refactor file content - add prefixes to unprefixed properties
 */
function refactorFileContent(content, _filePath) {
  const lines = content.split('\n');
  const updates = new Map();

  // First pass: Find all custom property definitions
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^\s*(--[a-z][a-z0-9-]*)\s*:/);

    if (match) {
      const propName = match[1];
      if (!hasValidPrefix(propName)) {
        const prefix = getPrefixForProperty(propName);
        if (prefix) {
          const newPropName = `--${prefix}${propName.substring(2)}`;
          updates.set(propName, newPropName);
        }
      }
    }
  }

  if (updates.size === 0) {
    return { content, changesMade: 0 };
  }

  // Second pass: Replace all occurrences (definitions and usages)
  let updatedContent = content;
  let changesMade = 0;

  for (const [oldProp, newProp] of updates.entries()) {
    // Escape special regex characters
    const escapedOld = oldProp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Replace definitions: --prop:
    const defRegex = new RegExp(`\\b${escapedOld}:`, 'g');
    // Replace usages: var(--prop)
    const varRegex = new RegExp(`var\\(${escapedOld}\\)`, 'g');
    // Replace usages with fallback: var(--prop,
    const varFallbackRegex = new RegExp(`var\\(${escapedOld},`, 'g');

    if (defRegex.test(updatedContent) || varRegex.test(updatedContent) || varFallbackRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(defRegex, `${newProp}:`);
      updatedContent = updatedContent.replace(varRegex, `var(${newProp})`);
      updatedContent = updatedContent.replace(varFallbackRegex, `var(${newProp},`);
      changesMade++;
    }
  }

  return { content: updatedContent, changesMade };
}

/**
 * Refactor a single SCSS file
 */
function refactorFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: updatedContent, changesMade } = refactorFileContent(content, filePath);

    if (changesMade > 0) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✓ ${path.relative(sassDir, filePath).padEnd(45)} (${changesMade} properties)`);
      return changesMade;
    }

    return 0;
  } catch (err) {
    console.error(`✗ Error refactoring ${filePath}:`, err.message);
    return 0;
  }
}

/**
 * Main refactoring process
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║  Tillerstead CSS Custom Property Refactor         ║');
  console.log('║  System-Wide Prefix Addition                       ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  try {
    const scssFiles = await glob('**/*.scss', { cwd: sassDir, absolute: true });

    console.log(`Found ${scssFiles.length} SCSS files\n`);
    console.log('Refactoring...\n');

    let totalChanges = 0;
    let filesModified = 0;

    for (const file of scssFiles) {
      const changes = refactorFile(file);
      if (changes > 0) {
        totalChanges += changes;
        filesModified++;
      }
    }

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  Refactor Complete                                 ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log(`  Files modified: ${filesModified}/${scssFiles.length}`);
    console.log(`  Total property updates: ${totalChanges}\n`);

    console.log('Next step: npm run lint:css to verify');
  } catch (err) {
    console.error('✗ Refactor failed:', err.message);
    process.exit(1);
  }
}

main();
