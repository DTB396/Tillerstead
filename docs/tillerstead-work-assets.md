# Tillerstead Work Asset Audit

This note gathers the contents of `assets/img/tillerstead-work`, records where each
asset is already consumed, and documents the naming, priority, and filters we just
apply so the folder can be serviced consistently.

## General observations

- The `bathrooms` subfolder contains ten base projects with both JPEG and WebP variants
  (accent walls, floors, thresholds, and showers). Those files already power the portfolio
  slider (`_data/portfolio.yml`), highlight cards (`_data/portfolio_highlights.yml`), hero
  preload defaults, and additional marketing sections such as `ts-services` and
  `pattern-showcase`.
- Three WebP-only files that started as `bathroom-remodel-progress-shot-1|2` and
  `bathroom-remodel-final` were sitting unused within the same folder. They now have
  clearer filenames and metadata so they expose a whole “Remodels” category in the slider.
- The secondary `repairs` subfolder has the single `ceiling-repair.webp` file already in
  use through the “repairs” filter.

## Asset inventory & usage

| Base name | JPEG | WebP | Used today | Notes / priority |
|-----------|------|------|------------|-----------------|
| bathroom-accent-wall-progress | Yes | Yes | Portfolio slider (`tags: showers`), services cards | Keep as a high-visibility shot. |
| bathroom-accent-wall-detail | Yes | Yes | Slider, services cards | Keep. |
| bathroom-accent-wall-and-shower | Yes | Yes | Slider, hero defaults, services | Keep. |
| bathroom-floor-ditra-progress | Yes | Yes | Slider, highlights | Keep. |
| bathroom-floor-install-progress | Yes | Yes | Slider, highlights | Keep. |
| bathroom-marble-floor-finish | Yes | Yes | Slider, hero image, highlight | Keep; still a reliable hero fallback. |
| bathroom-marble-shower-niche | Yes | Yes | Slider, highlight, pattern showcase | Keep; used by several preload hooks. |
| bathroom-shower-valve-wall-progress | Yes | Yes | Slider | Keep. |
| bathroom-shower-wall-progress | Yes | Yes | Slider | Keep. |
| bathroom-threshold-leveling-progress | Yes | Yes | Slider | Keep. |
| ceiling-repair | No | Yes | Slider (`tags: repairs`) | Keep for the “Repairs” filter. |
| bathroom-remodel-progress-1 | No | Yes | Slider (`tags: remodels, showers`) | Added, documents early demo + plumbing prep. |
| bathroom-remodel-progress-2 | No | Yes | Slider (`tags: remodels, floors`) | Added, captures subfloor/membrane work. |
| bathroom-remodel-finished | No | Yes | Slider + highlights (`tags: remodels, showers, floors`), hero defaults | Added, highlights finished remodel and is now the default hero image. |

## Recommendations (now implemented)

1. **Rename the WebP-only remodel files** so they follow the rest of the gallery: `bathroom-remodel-progress-1.webp`, `bathroom-remodel-progress-2.webp`, and `bathroom-remodel-finished.webp`.
2. **Register them with `_data/portfolio.yml`** so they appear in the slider with descriptive alt text, captions, and a new `remodels` tag.
3. **Add a “Remodels” filter chip** to `pages/portfolio.html` and provide a label for it in `TAG_LABELS`.
4. **Update `_data/portfolio_highlights.yml` and `_config.yml`** so the finished remodel image is highlighted and used wherever `hero_default_image` applies.
5. **Track the catalog** via this document for future reference and make sure new uploads follow the same naming/metadata pattern.

## Implementation status

- Renamed the three remodel WebP files and pointed the dataset at the new paths so they are now part of the portfolio slider.
- Added the “Remodels” filter, an associated tag label, and captions that describe each phase of the remodel scope to guide visitors through prep, execution, and the finished shot.
- Promoted `bathroom-remodel-finished.webp` into `_data/portfolio_highlights.yml` and `_config.yml`, giving the brand-new remodel photo visibility on hero preloads and highlight cards.
- This note now captures the full catalog with usage, priorities, and the workflow expectations for future uploads.
