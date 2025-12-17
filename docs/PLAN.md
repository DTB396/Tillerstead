# Execution Plan

## Phase 1 — Build & CI safety net
- Clean the repo of accidental build artifacts (e.g., `tmp.css`) and pin any missing dev tools so `npm run dev`/`serve` work without global installs.
- Re-point CI and Pages workflows to the actual default branch and defuse the destructive branch-pruning workflow until safeguards exist.
- Rationale: Ensures developers and automation share the same predictable toolchain and prevents silent CI/Pages gaps or accidental branch loss.
- Risks: Low; branch-workflow edits should be coordinated with repo admins to confirm the intended default branch.

## Phase 2 — Contact form delivery & layout
- Normalize the contact form to a single submission backend, remove conflicting attributes, and fix the duplicate `action` so requests reach the intended endpoint.
- Add scoped layout styles for `.ts-contact__grid`, `.ts-contact__fields`, and `.ts-contact__panel` to achieve the intended two-column layout with accessible stacking on mobile.
- Rationale: Restores lead capture reliability and improves usability of the highest-intent CTA.
- Risks: Medium; switching endpoints may require updating spam protections/notifications with the chosen provider.

## Phase 3 — Content & asset hygiene
- Deduplicate/cleanup `_config.yml` metadata (double `default_og_image`, misencoded reassurance text) to keep SEO and on-page copy clean.
- Replace the hotlinked Unsplash hero fallback with a local, licensed asset to remove third-party latency/licensing risk.
- Rationale: Improves brand polish, social previews, and avoids brittle third-party dependencies.
- Risks: Low; requires selecting or exporting an appropriate local image.

## Phase 4 — SEO automation
- Automate `sitemap.xml` generation in the build step instead of manual maintenance to prevent future crawl gaps.
- Rationale: Reduces human error and keeps search engines aligned with the latest content.
- Risks: Low; ensure automation respects any intentional exclusions before enabling.
