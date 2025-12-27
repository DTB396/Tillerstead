# Tillerstead Logo System - Implementation Guide

## Overview

The Tillerstead logo system uses **SVG sprites** for optimal performance, caching, and consistent rendering across all site contexts. All logo variants are defined once in a sprite file and referenced via `<use>` elements.

---

## Architecture

### File Structure

```
assets/img/logo/
├── tillerstead-logo-sprite.svg      # Master sprite (all variants)
├── tillerstead-logo-header.svg      # Standalone header logo
├── tillerstead-logo-header-dark.svg # Header for dark backgrounds
├── tillerstead-logo-full.svg        # Full logo with tagline + HIC
├── tillerstead-logo-stacked.svg     # Vertical/stacked version
├── tillerstead-logo-mark.svg        # Tile "T" mark only
├── tillerstead-logo-mark-with-word.svg # Compact lockup
├── tillerstead-inverse.svg          # Light-on-dark inverse
└── tillerstead-favicon.svg          # Favicon base mark
```

### Component System

```
_includes/
├── logo-sprite-inline.html  # Inline sprite definition (loaded once)
├── logo-header.html         # Sprite-based logo component
└── logo-main.html           # Legacy <img> component (deprecated)
```

### Styles

```
_sass/30-components/_logo.scss  # Logo sizing, responsive behavior
```

---

## Available Logo Symbols

The sprite (`tillerstead-logo-sprite.svg`) provides **6 symbols**:

| Symbol ID | Description | Use Case |
|-----------|-------------|----------|
| `logo-mark` | Colored tile "T" mark | Header, footer, favicon contexts |
| `logo-mark-mono` | Monochrome mark (currentColor) | Buttons, inline text, dark backgrounds |
| `logo-full` | Full horizontal logo with tagline + HIC | Hero sections, full-width headers |
| `logo-full-mono` | Monochrome full logo | Dark themes, print, high-contrast |
| `logo-stacked` | Vertical stacked logo | Sidebar, mobile, narrow spaces |
| `logo-stacked-mono` | Monochrome stacked | Dark stacked contexts |

---

## Usage

### 1. Include the Sprite (Once Per Page)

The sprite is automatically loaded in `_layouts/default.html`:

```liquid
{% include logo-sprite-inline.html %}
```

This embeds the SVG sprite **once** at the top of the `<body>`. All logo instances reference it.

### 2. Use the Logo Component

Use `logo-header.html` for sprite-based logos:

```liquid
{% include logo-header.html 
   symbol="logo-mark" 
   variant="mono" 
   link_class="ts-logo-link" 
   svg_class="ts-logo" %}
```

#### Parameters

- **`symbol`** (required): `logo-mark`, `logo-full`, or `logo-stacked`
- **`variant`**: `default` (colored) or `mono` (currentColor, inherits text color)
- **`link_class`**: CSS class for the `<a>` wrapper (default: `ts-logo-link`)
- **`svg_class`**: CSS class for the `<svg>` element (default: `ts-logo`)

#### Examples

**Header (Mark Only, Monochrome):**

```liquid
{% include logo-header.html symbol="logo-mark" variant="mono" %}
```

**Hero (Full Logo, Colored):**

```liquid
{% include logo-header.html 
   symbol="logo-full" 
   variant="default" 
   svg_class="ts-logo ts-logo--hero" %}
```

**Footer (Mark, Monochrome):**

```liquid
{% include logo-header.html 
   symbol="logo-mark" 
   variant="mono" 
   svg_class="ts-logo ts-logo--footer" %}
```

**Stacked Logo (Sidebar):**

```liquid
{% include logo-header.html symbol="logo-stacked" variant="mono" %}
```

### 3. Direct SVG Usage (Advanced)

For custom inline usage:

```html
<svg class="ts-logo" role="img" aria-label="Tillerstead">
  <use href="#logo-mark-mono"></use>
</svg>
```

---

## Styling

Logo sizing is controlled by `_sass/30-components/_logo.scss`:

### Base Sizing

```scss
.ts-logo {
  max-width: clamp(140px, 20vw, 200px);
  color: currentColor; // Inherits for mono variants
}
```

### Context Modifiers

| Class | Max Width | Use Case |
|-------|-----------|----------|
| `.ts-logo` | 140–200px | Header, default |
| `.ts-logo--hero` | 280–480px | Homepage hero |
| `.ts-logo--footer` | 120–180px | Footer branding |

### Responsive Behavior

- **Desktop**: Full size
- **Tablet** (<768px): 80% size
- **Mobile** (<480px): 60% size
- **Scrolled Header**: Shrinks to 70% via `.site-header.is-scrolled .ts-logo`

### Hover/Focus States

```scss
.ts-logo-link:hover .ts-logo {
  transform: scale(1.02);
  opacity: 0.9;
}

.ts-logo-link:focus-visible {
  outline: 2px solid var(--ts-color-primary);
  outline-offset: 4px;
}
```

---

## Performance Optimizations

### 1. Preload the Sprite

In `_includes/head.html`:

```html
<link rel="preload" 
      as="image" 
      href="/assets/img/logo/tillerstead-logo-sprite.svg" 
      type="image/svg+xml" 
      fetchpriority="high">
```

### 2. Single HTTP Request

The sprite loads **once** and is cached. All logo instances reference the same file via `<use href="#...">`, eliminating redundant requests.

### 3. CSS Variables for Theming

The sprite uses CSS custom properties for dynamic theming:

```css
.logo-tile {
  fill: var(--logo-fill, #078930);      /* Tile fill - Kelly green */
  stroke: var(--logo-stroke, #FCDD09);  /* Tile stroke - Golden yellow */
}
```

Override in custom contexts:

```css
.dark-theme .ts-logo {
  --logo-fill: #ffffff;
  --logo-stroke: #ffd700;
}
```

---

## Migration from Legacy System

### Before (Deprecated)

```liquid
{% include logo-main.html 
   class="ts-logo-link" 
   img_class="ts-logo" 
   variant="inverse" %}
```

### After (Current)

```liquid
{% include logo-header.html 
   symbol="logo-mark" 
   variant="mono" 
   link_class="ts-logo-link" 
   svg_class="ts-logo" %}
```

**Key Changes:**

1. `logo-main.html` → `logo-header.html`
2. `img_class` → `svg_class`
3. `variant="inverse"` → `variant="mono"`
4. Add `symbol` parameter

---

## Accessibility

### ARIA Labels

All logo links include descriptive ARIA labels:

```html
<a href="/" class="ts-logo-link" aria-label="Tillerstead LLC - Home">
  <svg class="ts-logo" role="img" aria-label="Tillerstead">
    <use href="#logo-mark"></use>
  </svg>
</a>
```

### High Contrast Mode

Monochrome variants (`*-mono`) automatically adapt to system high-contrast themes via `currentColor`.

### Screen Readers

- SVG has `role="img"` for semantic clarity
- `aria-label` provides context
- Sprite container is `aria-hidden="true"` to avoid duplicate announcements

---

## Brand Compliance

### Official Logo Variants

| Context | Symbol | Variant | HIC License Display |
|---------|--------|---------|---------------------|
| Site Header | `logo-mark` | `mono` | No (badge shown separately) |
| Homepage Hero | `logo-full` | `default` or `mono` | Yes (in logo text) |
| Footer | `logo-mark` | `mono` | Yes (separate text) |
| Print/Export | `logo-full` | `default` | Yes |

### Minimum Sizes

- **Mark Only**: 48px width
- **Full Logo**: 180px width
- **Stacked Logo**: 120px width

Enforced via `clamp()` in `_logo.scss`.

### Color Specifications

- **Kelly Green**: `#078930` (tiles fill)
- **Golden Yellow**: `#FCDD09` (tiles stroke)
- **Tillerstead Red**: `#DA121A` (wordmark "TILLERSTEAD")
- **Kelly Green**: `#078930` (subtext/tagline)
- **Monochrome**: `currentColor` (inherits from parent)

---

## Build Integration

### Jekyll Build

The sprite is inline-embedded during Jekyll build:

1. `_layouts/default.html` includes `logo-sprite-inline.html`
2. Sprite SVG is inlined into every page
3. All `<use>` references resolve client-side

### CSS Compilation

Logo styles are compiled from SCSS:

```scss
// In assets/css/main.scss
@import "30-components/logo";
```

---

## Testing Checklist

- [ ] Logo renders in header (desktop)
- [ ] Logo renders in header (mobile)
- [ ] Logo shrinks on scroll
- [ ] Hero logo displays full variant
- [ ] Footer logo is monochrome
- [ ] Hover states work
- [ ] Focus outlines visible
- [ ] High contrast mode compatible
- [ ] Screen reader announces correctly
- [ ] Sprite preloads (Network tab)
- [ ] Only 1 sprite HTTP request
- [ ] Logo scales responsively

---

## Troubleshooting

### Logo Not Appearing

1. Verify sprite is loaded:
   ```bash
   grep -n "logo-sprite-inline" _site/index.html
   ```

2. Check for `<use>` references:
   ```bash
   grep -n 'use href="#logo' _site/index.html
   ```

3. Ensure `_logo.scss` is imported in `main.scss`

### Sizing Issues

Check computed styles for `.ts-logo` in DevTools. Verify:

- `max-width` is set
- `clamp()` values are reasonable
- No conflicting `width: 100%` rules

### Color Not Applying

Monochrome variants use `currentColor`. Set `color` on parent:

```css
.dark-background {
  color: #ffffff;
}
```

---

## References

- **Sprite Source**: `assets/img/logo/tillerstead-logo-sprite.svg`
- **Component**: `_includes/logo-header.html`
- **Styles**: `_sass/30-components/_logo.scss`
- **TCNA Compliance**: `/.ai/DOMAIN.md`
- **Brand Standards**: `/.ai/STYLE.md`

---

**Last Updated**: 2025-12-26  
**Maintained by**: Tillerstead LLC  
**New Jersey HIC**: #13VH10808800
