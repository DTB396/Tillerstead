#!/usr/bin/env node
/* eslint-env node */
/**
 * slugify.js
 *
 * Usage examples:
 *   node scripts/slugify.js "My Title Here"   -> my-title-here
 *   echo "Hello World" | node scripts/slugify.js
 */

function readInput () {
  const args = process.argv.slice(2);
  if (args.length > 0) return args.join(' ');

  if (!process.stdin.isTTY) {
    return new Promise(resolve => {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', chunk => { data += chunk; });
      process.stdin.on('end', () => resolve(data.trim()));
    });
  }

  return '';
}

function slugify (value) {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');
  return normalized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

(async () => {
  const input = await readInput();
  if (!input) {
    console.error('Usage: node scripts/slugify.js "Your Title"');
    process.exit(1);
  }

  const result = slugify(input);
  if (!result) {
    console.error('Unable to generate slug from input.');
    process.exit(1);
  }

  console.log(result);
})();
