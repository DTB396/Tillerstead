# CSS/SCSS Architecture & Global Theme System

**Last Updated:** 2026-01-01  
**Status:** ✅ Modernized & Centralized

---

## Overview

Tillerstead's CSS architecture uses a **modular, token-driven design system** organized by cascade priority (ITCSS methodology). All colors, spacing, typography, and themes are now controlled through **one central file**: `_sass/00-settings/theme-globals.scss`.

---

## Quick Start

### Using Global Theme Variables

Instead of hardcoding values, always use variables from `theme-globals.scss`:

```scss
// ✅ CORRECT - Uses global variable
.button {
  background-color: $color-primary;
  padding: $button-padding;
  border-radius: $radius-md;
  transition: all $transition-base;
}

// ❌ WRONG - Hardcoded value
.button {
  background-color: #1a5c3a;  // Don't do this!
  padding: 16px 24px;         // Don't do this!
}
```

### Changing Colors/Spacing Globally

Edit **one file** to update all colors:

```scss
// _sass/00-settings/theme-globals.scss
$color-primary: #1a5c3a;  ← Change here, updates everywhere
```

---

## Directory Structure

```
_sass/
├── 00-settings/              Settings & Design Tokens
│   ├── theme-globals.scss    ⭐ CENTRAL CONTROL (edit here)
│   ├── tokens-modern.scss    Legacy (consolidating)
│   ├── patterns.scss         Pattern definitions
│   └── ...
│
├── 10-base/                  Base Styles (Reset, Typography, Animation)
│   ├── reset.scss            CSS reset & normalization
│   ├── typography.scss       Font sizes, weights, line-heights
│   ├── animations.scss       Transition definitions
│   └── ...
│
├── 20-layout/                Layout & Grid System
│   ├── container.scss        Container classes
│   ├── grid.scss             Grid system
│   ├── mobile.scss           Mobile-first overrides
│   └── ...
│
├── 30-components/            Component Styles
│   ├── buttons.scss          Button variants
│   ├── cards.scss            Card components
│   ├── forms.scss            Form elements
│   ├── hero.scss             Hero sections
│   └── ... (20 component files)
│
├── 40-pages/                 Page-Specific Styles
│   └── portfolio.scss        Portfolio page styles
│
├── 40-utilities/             Utility Classes
│   └── helpers.scss          Utility helpers
│
└── 99-archive/               Old/Unused Styles
    └── ... (archive)
```

---

## Global Theme Variables Reference

### 1. Colors

#### Primary Brand Colors
```scss
$color-primary: #1a5c3a;          // Tillerstead green
$color-primary-light: #2d8b54;    // Hover state
$color-primary-dark: #0f3a23;     // Dark variant

$color-secondary: #c9a961;        // Bronze/gold
$color-secondary-light: #dbb876;  // Hover state
$color-secondary-dark: #a87e38;   // Dark variant
```

#### Alert/Status Colors
```scss
$color-accent: #e74c3c;    // Emphasis/CTA
$color-success: #27ae60;   // Success
$color-warning: #f39c12;   // Warning
$color-error: #c0392b;     // Error
```

#### Neutral/Grayscale (50-900)
```scss
$color-white: #ffffff;
$color-gray-50: #f9fafb;
$color-gray-100: #f3f4f6;
// ... through ...
$color-gray-900: #111827;
$color-black: #000000;
```

**Usage:**
```scss
.button-primary { background: $color-primary; }
.button-secondary { background: $color-secondary; }
.alert-error { color: $color-error; }
```

---

### 2. Semantic Text Colors

Semantic names (what they mean, not their hex value):

```scss
$text-primary: $color-gray-900;       // Main content text
$text-secondary: $color-gray-600;     // Muted/secondary text
$text-tertiary: $color-gray-500;      // Minor/hint text
$text-inverse: $color-white;          // Text on dark backgrounds
$text-link: $color-primary;           // Link text
$text-link-hover: $color-primary-dark;// Link hover
```

**Usage:**
```scss
.card-title { color: $text-primary; font-weight: $font-weight-bold; }
.card-hint { color: $text-tertiary; font-size: $font-size-sm; }
.button { &:hover { color: $text-link-hover; } }
```

---

### 3. Spacing System

8px-based scale (consistent, predictable):

```scss
$spacing-xs: 0.25rem;   // 4px   (half-step)
$spacing-sm: 0.5rem;    // 8px   (base)
$spacing-md: 1rem;      // 16px  (1x)
$spacing-lg: 1.5rem;    // 24px  (1.5x)
$spacing-xl: 2rem;      // 32px  (2x)
$spacing-2xl: 3rem;     // 48px  (3x)
$spacing-3xl: 4rem;     // 64px  (4x)
$spacing-4xl: 6rem;     // 96px  (6x)
```

**Usage:**
```scss
.card {
  padding: $spacing-xl;              // 32px all sides
  margin-bottom: $spacing-lg;        // 24px bottom
}

.button {
  padding: $spacing-md $spacing-lg;  // 16px vertical, 24px horizontal
}

.section {
  padding: $section-padding;  // Pre-calculated: 64px 24px
}
```

---

### 4. Typography System

#### Font Families
```scss
$font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...;
$font-mono: 'SFMono-Regular', Consolas, ...;
$font-serif: Georgia, ...;
```

#### Font Sizes (Modular Scale 1.125)
```scss
$font-size-xs: 0.75rem;    // 12px (small labels)
$font-size-sm: 0.875rem;   // 14px (hints, captions)
$font-size-base: 1rem;     // 16px (body text)
$font-size-lg: 1.125rem;   // 18px
$font-size-xl: 1.25rem;    // 20px
$font-size-2xl: 1.5rem;    // 24px (headings)
$font-size-3xl: 1.875rem;  // 30px
$font-size-4xl: 2.25rem;   // 36px
$font-size-5xl: 2.875rem;  // 46px
$font-size-6xl: 3.5rem;    // 56px (hero text)
```

#### Font Weights
```scss
$font-weight-light: 300;         // Thin text
$font-weight-normal: 400;        // Body text
$font-weight-medium: 500;        // Emphasis
$font-weight-semibold: 600;      // Subheadings
$font-weight-bold: 700;          // Headings
$font-weight-extrabold: 800;     // Hero text
```

#### Line Heights
```scss
$line-height-tight: 1.2;    // Headings
$line-height-snug: 1.4;     // Subheadings
$line-height-normal: 1.6;   // Body text (readability)
$line-height-relaxed: 1.8;  // Comfortable
$line-height-loose: 2;      // Very spacious
```

**Usage:**
```scss
h1 {
  font-size: $font-size-4xl;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
}

.body-text {
  font-size: $font-size-base;
  font-weight: $font-weight-normal;
  line-height: $line-height-normal;  // Optimal readability
}

.hint-text {
  font-size: $font-size-sm;
  color: $text-tertiary;
  font-weight: $font-weight-medium;
}
```

---

### 5. Border Radius (Semantic)

```scss
$radius-none: 0;        // Sharp corners (rare)
$radius-sm: 0.25rem;    // 4px (tight)
$radius-md: 0.5rem;     // 8px (standard, default)
$radius-lg: 1rem;       // 16px (soft)
$radius-xl: 1.5rem;     // 24px (rounded)
$radius-full: 9999px;   // Fully rounded
```

**Usage:**
```scss
.button { border-radius: $radius-md; }
.card { border-radius: $radius-lg; }
.badge { border-radius: $radius-full; }  // Pill shape
```

---

### 6. Shadows (Elevation System)

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), ...;
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), ...;
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), ...;
$shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

**Usage:**
```scss
.card { box-shadow: $shadow-md; }           // Subtle elevation
.modal { box-shadow: $shadow-xl; }          // High elevation
.tooltip { box-shadow: $shadow-sm; }        // Minimal elevation
```

---

### 7. Transitions & Animations

```scss
$transition-fast: 150ms ease-in-out;    // Quick feedback (hovers)
$transition-base: 250ms ease-in-out;    // Standard transitions
$transition-slow: 350ms ease-in-out;    // Gentle transitions

$easing-linear: linear;
$easing-in: cubic-bezier(0.4, 0, 1, 1);
$easing-out: cubic-bezier(0, 0, 0.2, 1);
$easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

**Usage:**
```scss
.button {
  transition: all $transition-base;
  &:hover { background-color: $color-primary-light; }
}

.fade-in { animation: fadeIn $transition-slow $easing-out; }
```

---

### 8. Breakpoints (Mobile-First)

```scss
$breakpoint-sm: 640px;    // Small phones (landscape)
$breakpoint-md: 768px;    // Tablets
$breakpoint-lg: 1024px;   // Small desktops
$breakpoint-xl: 1280px;   // Desktops
$breakpoint-2xl: 1536px;  // Large desktops
```

**Usage:**
```scss
.element {
  // Mobile first (default)
  display: block;
  width: 100%;

  // Tablet and up
  @media (min-width: $breakpoint-md) {
    width: 50%;
    display: flex;
  }

  // Desktop and up
  @media (min-width: $breakpoint-lg) {
    width: 33%;
  }
}
```

---

### 9. Z-Index Scale

```scss
$z-hide: -1;              // Hidden elements
$z-base: 0;               // Normal flow
$z-dropdown: 100;         // Dropdowns
$z-sticky: 200;           // Sticky headers
$z-fixed: 300;            // Fixed positioning
$z-modal-backdrop: 400;   // Modal background
$z-modal: 500;            // Modal content
$z-popover: 600;          // Popovers
$z-tooltip: 700;          // Tooltips
```

**Usage:**
```scss
.modal-backdrop { z-index: $z-modal-backdrop; }
.modal { z-index: $z-modal; }
.sticky-header { z-index: $z-sticky; }
```

---

## Editing & Building

### Build CSS

```bash
npm run build:css
```

This compiles `_sass/` → `assets/css/main.css`

### Watch for Changes

```bash
npm run watch:css
```

Automatically rebuilds CSS when SCSS files change.

### Add New Component

1. Create `_sass/30-components/_yourcomponent.scss`
2. Add import to `assets/css/main.scss`:
   ```scss
   @import "30-components/yourcomponent";
   ```
3. Use global variables (don't hardcode values):
   ```scss
   .your-component {
     color: $text-primary;
     background: $bg-soft;
     padding: $spacing-lg;
     border-radius: $radius-md;
     box-shadow: $shadow-md;
   }
   ```

---

## Best Practices

### ✅ DO

- Use variables from `theme-globals.scss` for all values
- Use semantic variable names (`$text-primary` not `$gray-900`)
- Group related styles logically
- Use mobile-first responsive design
- Comment complex calculations
- Test readability (line-height, contrast)

### ❌ DON'T

- Hardcode colors: `#1a5c3a` ← BAD
- Hardcode spacing: `24px` ← BAD
- Hardcode sizes: `16px` ← BAD
- Mix ITCSS layers
- Create duplicate variables
- Use `!important` unless absolutely necessary

---

## Testing Your Styles

### Contrast Check

Verify colors meet WCAG AA standards (4.5:1 for normal text):

```bash
npm run test:contrast
```

### CSS Audit

Find unused styles:

```bash
npm run audit:css
```

### Build & Test

```bash
npm run build:css && npm run test
```

---

## Migration Guide (Old → New)

If you have hardcoded values to update:

| Old | New |
|-----|-----|
| `color: #1a5c3a;` | `color: $color-primary;` |
| `padding: 24px;` | `padding: $spacing-lg;` |
| `font-size: 16px;` | `font-size: $font-size-base;` |
| `border-radius: 8px;` | `border-radius: $radius-md;` |
| `box-shadow: 0 4px 6px ...;` | `box-shadow: $shadow-md;` |

---

## Quick Reference

### Colors
```scss
$color-primary, $color-secondary, $color-accent, $color-success, $color-warning, $color-error
$color-white, $color-gray-{50..900}, $color-black
$text-primary, $text-secondary, $text-tertiary, $text-inverse, $text-link
```

### Spacing
```scss
$spacing-{xs, sm, md, lg, xl, 2xl, 3xl, 4xl}
```

### Typography
```scss
$font-size-{xs..6xl}
$font-weight-{light, normal, medium, semibold, bold, extrabold}
$line-height-{tight, snug, normal, relaxed, loose}
```

### Layout
```scss
$radius-{none, sm, md, lg, xl, full}
$shadow-{sm, md, lg, xl, 2xl}
$transition-{fast, base, slow}
$breakpoint-{sm, md, lg, xl, 2xl}
```

---

## Support & Questions

- **CSS Architecture:** See `_sass/README.md`
- **Theme Variables:** See `_sass/00-settings/theme-globals.scss`
- **Component Examples:** Check `_sass/30-components/`
- **Build System:** See `package.json` scripts

---

**Maintained by:** Development Team  
**Last Updated:** 2026-01-01  
**Status:** Production Ready
