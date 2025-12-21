// scripts/fix-all-property-usages.js
// Tillerstead: Fix ALL var(--prop) usages to match renamed definitions
// This handles the cascade effect of renaming properties

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sassDir = path.resolve(__dirname, '..', '_sass');

// Comprehensive mapping of all renamed properties
const propertyMappings = {
  // Social components
  '--social-pill-size': '--tiller-social-pill-size',
  '--social-gap': '--tiller-social-gap',
  '--social-border': '--tiller-social-border',
  '--social-bg': '--tiller-social-bg',
  '--social-icon-color': '--tiller-social-icon-color',
  '--social-hover-bg': '--tiller-social-hover-bg',
  '--social-hover-border': '--tiller-social-hover-border',
  '--social-hover-color': '--tiller-social-hover-color',
  '--social-facebook': '--tiller-social-facebook',
  '--social-instagram': '--tiller-social-instagram',
  '--social-youtube': '--tiller-social-youtube',
  '--social-yelp': '--tiller-social-yelp',

  // Layout
  '--layout-max': '--spacing-layout-max',

  // Tokens - gradients and patterns
  '--gradient-primary': '--tiller-gradient-primary',
  '--gradient-accent': '--tiller-gradient-accent',
  '--gradient-surface': '--tiller-gradient-surface',
  '--shadow-lift': '--color-shadow-lift',
  '--bg-pattern': '--color-bg-pattern',
  '--bg-pattern-size': '--color-bg-pattern-size',
  '--bg-pattern-opacity': '--color-bg-pattern-opacity',

  // 90s theme colors
  '--neon-teal-50': '--color-neon-teal-50',
  '--neon-teal-100': '--color-neon-teal-100',
  '--neon-teal-400': '--color-neon-teal-400',
  '--neon-teal-500': '--color-neon-teal-500',
  '--neon-teal-600': '--color-neon-teal-600',
  '--neon-teal-700': '--color-neon-teal-700',
  '--sunset-orange-50': '--color-sunset-orange-50',
  '--sunset-orange-100': '--color-sunset-orange-100',
  '--sunset-orange-400': '--color-sunset-orange-400',
  '--sunset-orange-500': '--color-sunset-orange-500',
  '--sunset-orange-600': '--color-sunset-orange-600',
  '--sunset-orange-700': '--color-sunset-orange-700',
  '--hot-pink-50': '--color-hot-pink-50',
  '--hot-pink-100': '--color-hot-pink-100',
  '--hot-pink-400': '--color-hot-pink-400',
  '--hot-pink-500': '--color-hot-pink-500',
  '--hot-pink-600': '--color-hot-pink-600',
  '--hot-pink-700': '--color-hot-pink-700',
  '--lime-green-50': '--color-lime-green-50',
  '--lime-green-100': '--color-lime-green-100',
  '--lime-green-400': '--color-lime-green-400',
  '--lime-green-500': '--color-lime-green-500',
  '--lime-green-600': '--color-lime-green-600',
  '--lime-green-700': '--color-lime-green-700',
  '--electric-purple-50': '--color-electric-purple-50',
  '--electric-purple-100': '--color-electric-purple-100',
  '--electric-purple-400': '--color-electric-purple-400',
  '--electric-purple-500': '--color-electric-purple-500',
  '--electric-purple-600': '--color-electric-purple-600',
  '--electric-purple-700': '--color-electric-purple-700',
  '--cyber-yellow-50': '--color-cyber-yellow-50',
  '--cyber-yellow-100': '--color-cyber-yellow-100',
  '--cyber-yellow-400': '--color-cyber-yellow-400',
  '--cyber-yellow-500': '--color-cyber-yellow-500',
  '--cyber-yellow-600': '--color-cyber-yellow-600',
  '--cyber-yellow-700': '--color-cyber-yellow-700',
  '--cool-gray-50': '--color-cool-gray-50',
  '--cool-gray-100': '--color-cool-gray-100',
  '--cool-gray-200': '--color-cool-gray-200',
  '--cool-gray-300': '--color-cool-gray-300',
  '--cool-gray-400': '--color-cool-gray-400',
  '--cool-gray-500': '--color-cool-gray-500',
  '--cool-gray-600': '--color-cool-gray-600',
  '--cool-gray-700': '--color-cool-gray-700',
  '--cool-gray-800': '--color-cool-gray-800',
  '--cool-gray-900': '--color-cool-gray-900',

  // Comic/cartoon patterns
  '--comic-dot-pattern': '--tiller-comic-dot-pattern',
  '--comic-outline-thick': '--tiller-comic-outline-thick',
  '--comic-outline-medium': '--tiller-comic-outline-medium',
  '--comic-outline-thin': '--tiller-comic-outline-thin',
  '--bubble-bg': '--color-bubble-bg',
  '--bubble-border': '--color-bubble-border',
  '--bubble-shadow': '--color-bubble-shadow',

  // Cartoon theme
  '--cartoon-blue-light': '--tiller-cartoon-blue-light',
  '--cartoon-blue': '--tiller-cartoon-blue',
  '--cartoon-blue-dark': '--tiller-cartoon-blue-dark',
  '--cartoon-blue-deeper': '--tiller-cartoon-blue-deeper',
  '--cartoon-red-light': '--tiller-cartoon-red-light',
  '--cartoon-red': '--tiller-cartoon-red',
  '--cartoon-red-dark': '--tiller-cartoon-red-dark',
  '--cartoon-yellow-light': '--tiller-cartoon-yellow-light',
  '--cartoon-yellow': '--tiller-cartoon-yellow',
  '--cartoon-green-light': '--tiller-cartoon-green-light',
  '--cartoon-green': '--tiller-cartoon-green',
  '--cartoon-green-dark': '--tiller-cartoon-green-dark',
  '--cartoon-orange': '--tiller-cartoon-orange',
  '--cartoon-purple': '--tiller-cartoon-purple',
  '--cartoon-pink': '--tiller-cartoon-pink',
  '--cartoon-outline': '--tiller-cartoon-outline',
  '--cartoon-shadow': '--tiller-cartoon-shadow',

  // Hybrid theme
  '--brand-teal-50': '--tiller-brand-teal-50',
  '--brand-teal-100': '--tiller-brand-teal-100',
  '--brand-teal-400': '--tiller-brand-teal-400',
  '--brand-teal-500': '--tiller-brand-teal-500',
  '--brand-teal-600': '--tiller-brand-teal-600',
  '--brand-teal-700': '--tiller-brand-teal-700',
};

/**
 * Automatically generate mappings for numbered variants
 */
function generateNumberedMappings() {
  const patterns = [
    { base: '--brand-gold', prefix: 'tiller' },
    { base: '--warm-gray', prefix: 'color' },
    { base: '--navy', prefix: 'color' },
  ];

  const numbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  for (const { base, prefix } of patterns) {
    for (const num of numbers) {
      propertyMappings[`${base}-${num}`] = `--${prefix}-${base.substring(2)}-${num}`;
    }
  }
}

generateNumberedMappings();

/**
 * Fix property usages in a file
 */
function fixFileUsages(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changesMade = 0;

    for (const [oldProp, newProp] of Object.entries(propertyMappings)) {
      const escapedOld = oldProp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Fix var(--old) references
      const varRegex = new RegExp(`var\\(${escapedOld}([,\\)])`, 'g');

      if (varRegex.test(content)) {
        content = content.replace(varRegex, `var(${newProp}$1`);
        changesMade++;
      }
    }

    if (changesMade > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      return changesMade;
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
  console.log('║  Tillerstead: Fix Property Usages                 ║');
  console.log('║  Update var(--old) → var(--new)                   ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  try {
    const scssFiles = await glob('**/*.scss', { cwd: sassDir, absolute: true });

    console.log(`Processing ${scssFiles.length} SCSS files...\n`);
    console.log(`Mapping ${Object.keys(propertyMappings).length} property references...\n`);

    let totalFixed = 0;
    let filesFixed = 0;

    for (const file of scssFiles) {
      const fixed = fixFileUsages(file);
      if (fixed > 0) {
        const relativePath = path.relative(sassDir, file);
        console.log(`✓ ${relativePath.padEnd(50)} (${fixed} usages)`);
        totalFixed += fixed;
        filesFixed++;
      }
    }

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  Usage Fix Complete                                ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log(`  Files updated: ${filesFixed}/${scssFiles.length}`);
    console.log(`  Usages fixed: ${totalFixed}\n`);
    console.log('Next: npm run lint:css to verify');
  } catch (err) {
    console.error('✗ Process failed:', err.message);
    process.exit(1);
  }
}

main();
