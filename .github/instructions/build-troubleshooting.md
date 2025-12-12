# Build Troubleshooting Guide

## The Homepage Looks Wrong / Changes Not Appearing

### Problem
You've edited files but the homepage still looks the same when you refresh.

### Root Cause
Jekyll is a **static site generator** - it must be rebuilt after changes to:
- HTML files
- Liquid templates (`_includes/`, `_layouts/`)
- SCSS/CSS files (`_sass/`, `assets/css/`)
- Data files (`_data/`)
- Configuration (`_config.yml`)

### Solution

**Always rebuild after making changes:**

```bash
# Full build (CSS + Jekyll)
npm run build

# Or build and serve with live reload
npm run dev
```

### Build Process Explained

1. **CSS Compilation** (`npm run build:css`)
   - Compiles `assets/css/main.scss` → `assets/css/main.css`
   - Processes all `@import` statements from `_sass/`
   - Minifies and optimizes

2. **Jekyll Build** (`bundle exec jekyll build`)
   - Processes all Liquid templates
   - Generates static HTML files in `_site/`
   - Copies assets to `_site/assets/`

3. **Result**: Updated `_site/` directory with your changes

### Common Mistakes

❌ **Don't do this:**
- Edit files and refresh browser immediately
- Assume changes apply automatically
- Only edit `_site/` directly (gets overwritten!)

✅ **Do this instead:**
- Edit source files
- Run `npm run build`
- Check `_site/` for compiled output
- Then refresh browser

### Quick Check

```bash
# Check if CSS is compiled
ls -lh assets/css/main.css

# Check if Jekyll site is built
ls -lh _site/index.html

# Check last build time
stat -c '%y' _site/index.html
```

### Dev Server (Recommended)

For automatic rebuilding during development:

```bash
npm run dev
```

This runs a local server at `http://localhost:4000` with:
- Auto-rebuild on file changes
- Live reload in browser
- Better development experience

### CI/CD Note

The GitHub Actions workflow automatically builds on push to `main`:
1. Runs linters
2. Compiles CSS
3. Builds Jekyll site
4. Deploys to GitHub Pages/Netlify

**Local builds are required for local preview.**

---

## CSS Not Updating

### Symptoms
- Changed SCSS files but styles don't update
- Old styles still appearing

### Fix
```bash
# Force CSS rebuild
npm run build:css

# Then rebuild Jekyll
bundle exec jekyll build

# Or all at once
npm run build
```

### Cache Busting
If browser cache is stuck, hard refresh:
- **Chrome/Edge**: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- **Firefox**: Ctrl+F5
- **Safari**: Cmd+Option+R

---

## Jekyll Template Changes Not Showing

### Check These Files
- `_includes/` - Partial templates
- `_layouts/` - Page layouts
- `_config.yml` - Site configuration

**Important**: Changes to `_config.yml` require stopping and restarting the dev server!

```bash
# Kill existing server
# Ctrl+C

# Restart
npm run dev
```

---

## Logo/Images Not Updating

### For SVG Logos
SVGs are cached aggressively. Solutions:

1. **Hard refresh** (Ctrl+Shift+R)
2. **Clear browser cache**
3. **Add version query string** (temporary):
   ```html
   <img src="/assets/img/logo.svg?v=2">
   ```

### For PNG Conversions
Generate high-quality PNGs from SVGs:

```bash
node scripts/generate-png-logos.js
```

Requires ImageMagick, Inkscape, or librsvg:
```bash
# Install ImageMagick (recommended)
sudo apt-get update && sudo apt-get install -y imagemagick
```

---

## Quick Fixes Checklist

- [ ] Run `npm run build`
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Check `_site/` directory exists and is recent
- [ ] Verify `assets/css/main.css` is compiled
- [ ] Restart dev server if `_config.yml` changed
- [ ] Clear browser cache completely
- [ ] Check browser console for errors (F12)

---

## Still Not Working?

### Nuclear Option
```bash
# Clean everything
rm -rf _site assets/css/main.css

# Fresh rebuild
npm run build

# Restart dev server
npm run dev
```

### Check for Errors
```bash
# Verbose Jekyll build
JEKYLL_TRACE=1 bundle exec jekyll build

# Check for Sass errors
npm run build:css 2>&1 | less
```

### Verify File Paths
```bash
# Check what's actually in _site
ls -lh _site/assets/css/
ls -lh _site/assets/img/logo/

# Check if files were copied
diff assets/css/main.css _site/assets/css/main.css
```
