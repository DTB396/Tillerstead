// scripts/fix-undefined-css-vars.js
// Tillerstead: Replace undefined CSS variable usages with defined equivalents

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sassDir = path.resolve(__dirname, '..', '_sass');

// Map of undefined variables → defined variables
const variableMap = {
  '--space-xs': '--ts-spacing-xs',
  '--space-sm': '--ts-spacing-sm',
  '--space-md': '--ts-spacing-md',
  '--space-lg': '--ts-spacing-lg',
  '--space-xl': '--ts-spacing-xl',
  '--space-2xl': '--ts-spacing-2xl',
  '--space-3xl': '--ts-spacing-3xl',
  '--space-2xs': '--ts-spacing-xs',
  '--space-xxs': '--ts-spacing-xs',
  '--surface': '--ts-color-surface',
  '--surface-dim': '--ts-color-surface-muted',
  '--surface-bright': '--ts-color-surface-elevated',
  '--surface-elevated': '--ts-color-surface-elevated',
  '--surface-highlight': '--ts-color-surface-highlight',
  '--border': '--ts-color-border',
  '--border-strong': '--ts-color-border-strong',
  '--divider': '--ts-color-divider',
  '--text-xs': '--font-size-xs',
  '--text-sm': '--font-size-sm',
  '--text-base': '--font-size-base',
  '--text-lg': '--font-size-lg',
  '--text-xl': '--font-size-xl',
  '--text-secondary': '--ts-color-muted',
  '--text-subtle': '--ts-color-text-subtle',
  '--text-primary': '--ts-color-text',
  '--heading': '--ts-color-heading',
  '--accent': '--ts-color-accent',
  '--accent-strong': '--ts-color-accent-strong',
  '--accent-soft': '--ts-color-accent-soft',
  '--primary': '--ts-color-primary',
  '--primary-bg': '--ts-color-primary-bg',
  '--primary-bg-hover': '--ts-color-primary-bg-hover',
  '--primary-dark': '--ts-color-primary-strong',
  '--ease-out': '--tiller-transition-fast',
  '--ease-in-out': '--tiller-transition-med',
  '--shadow-sm': '--ts-shadow-soft',
  '--shadow-md': '--ts-shadow-soft',
  '--shadow-lg': '--ts-shadow-lift',
  '--shadow-header': '--ts-shadow-header',
  '--shadow-glow': '--ts-shadow-glow',
  '--radius-sm': '--ts-radius-sm',
  '--radius-base': '--ts-radius-md',
  '--radius-md': '--ts-radius-md',
  '--radius-lg': '--ts-radius-lg',
  '--radius-xl': '--ts-radius-xl',
  '--radius-pill': '--ts-radius-pill',
  '--bg': '--ts-color-bg',
  '--error': '--ts-color-error',
  '--error-bg': '--ts-color-error-bg',
  '--success': '--ts-color-success',
  '--success-bg': '--ts-color-success-bg',
  '--warning': '--ts-color-warning',
  '--warning-bg': '--ts-color-warning-bg',

  // Social component (local scoped variables need renaming too)
  '--social-pill-size': '--tiller-social-pill-size',
  '--social-gap': '--tiller-social-gap',
  '--social-border': '--tiller-social-border',
  '--social-bg': '--tiller-social-bg',
  '--social-icon-color': '--tiller-social-icon-color',
};

/**
 * Fix undefined variable usages in a file
 */
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changesMade = 0;

    for (const [oldVar, newVar] of Object.entries(variableMap)) {
      // Replace var(--old-var) with var(--new-var)
      const escapedOld = oldVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const varRegex = new RegExp(`var\\(${escapedOld}\\)`, 'g');
      const varFallbackRegex = new RegExp(`var\\(${escapedOld},`, 'g');
      // Also replace direct property assignments: --old-var:
      const defRegex = new RegExp(`^(\\s*)${escapedOld}:`, 'gm');

      if (varRegex.test(content) || varFallbackRegex.test(content) || defRegex.test(content)) {
        content = content.replace(varRegex, `var(${newVar})`);
        content = content.replace(varFallbackRegex, `var(${newVar},`);
        content = content.replace(defRegex, `$1${newVar}:`);
        changesMade++;
      }
    }

    if (changesMade > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ ${path.relative(sassDir, filePath).padEnd(45)} (${changesMade} variables)`);
      return changesMade;
    }

    return 0;
  } catch (err) {
    console.error(`✗ Error fixing ${filePath}:`, err.message);
    return 0;
  }
}

/**
 * Main process
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║  Tillerstead: Fix Undefined CSS Variables         ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  try {
    const scssFiles = await glob('**/*.scss', { cwd: sassDir, absolute: true });

    console.log(`Scanning ${scssFiles.length} SCSS files...\n`);

    let totalChanges = 0;
    let filesModified = 0;

    for (const file of scssFiles) {
      const changes = fixFile(file);
      if (changes > 0) {
        totalChanges += changes;
        filesModified++;
      }
    }

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  Fix Complete                                      ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log(`  Files modified: ${filesModified}/${scssFiles.length}`);
    console.log(`  Variables fixed: ${totalChanges}\n`);
  } catch (err) {
    console.error('✗ Fix failed:', err.message);
    process.exit(1);
  }
}

main();
