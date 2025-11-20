# Logo Assets

Optimized SVG logos using design tokens (CSS variables) so palette changes propagate automatically via `tokens.css`.

## Files
- `tillerstead-logo-full.svg` – Full horizontal logo with tagline & license.
- `tillerstead-logo-header.svg` – Compact horizontal for header.
- `tillerstead-logo-mark.svg` – Tile T mark only.
- `tillerstead-logo-stacked.svg` – Stacked arrangement for vertical spaces.
- `tillerstead-favicon.svg` – Favicon base mark.
- `tillerstead-logo-sprite.svg` – Symbol sprite (includes monochrome variants).

## Token Usage
Each logo references:
- `--color-primary` (emerald wordmark)
- `--color-accent` (brass stroke between tiles)
- `--color-dark-primary` (tile fills)

Fallbacks are included so usage outside main CSS still renders.

## Sprite Symbols
| Symbol ID | Description | Variant |
|-----------|-------------|---------|
| `logo-mark` | Tile T mark | Color |
| `logo-mark-mono` | Tile T mark | Monochrome |
| `logo-full` | Horizontal wordmark + tagline | Color |
| `logo-full-mono` | Horizontal wordmark + tagline | Monochrome |
| `logo-stacked` | Stacked mark + tagline | Color |
| `logo-stacked-mono` | Stacked mark + tagline | Monochrome |

## Referencing the Sprite
Use an external reference (cache-friendly):
```html
<svg role="img" aria-label="Tillerstead"><use href="/assets/img/logo/tillerstead-logo-sprite.svg#logo-full" /></svg>
```

Monochrome (inherits current text color):
```html
<svg class="text-primary" role="img" aria-label="Tillerstead"><use href="/assets/img/logo/tillerstead-logo-sprite.svg#logo-full-mono" /></svg>
```

Mark only:
```html
<svg role="img" aria-label="Tillerstead mark" width="40" height="40"><use href="/assets/img/logo/tillerstead-logo-sprite.svg#logo-mark" /></svg>
```

## Inline Embedding (Optional)
To eliminate the external request, include the inline sprite once near the top of `body` (just after opening tag):
```liquid
{% include logo-sprite-inline.html %}
```
Then reference symbols with fragment-only `#id`:
```html
<svg role="img" aria-label="Tillerstead"><use href="#logo-full" /></svg>
```
Avoid embedding both external and inline versions simultaneously; choose one strategy per page to prevent duplicate IDs.

## Accessibility
- Provide `role="img"` + `aria-label` or `<title>` for each usage instance (symbols intentionally have no titles to avoid duplicate announcements).
- Monochrome variants use `currentColor` for both stroke and fill.

## Editing Guidelines
1. Prefer updating token values in `assets/styles/tokens.css`.
2. Keep font stack consistent: system-ui for performance.
3. Maintain minimal style blocks—avoid inline `fill` attributes unless necessary.
4. Run `htmlhint` only for embedded snippets; SVGs are not processed by current lint script.

## Future Enhancements
- Add dark-mode invert variant if needed (could be implemented by parent applying a class that overrides `--color-dark-primary`).
- Provide pinned base64-encoded small mark for critical inline usage (favicon / LCP).
