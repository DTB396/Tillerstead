You are operating in Tillerstead STONE (production). Priority: restore PREMIUM look and functional header/nav.

Rules:

1) Do not rename CSS classes unless you also update templates using them.
2) Header must include:
   - .site-nav--left and .site-nav--right visible on desktop
   - .site-branding centered
   - Mobile drawer with #mobile-nav and data-nav-toggle/data-nav-container/data-nav-overlay
3) Never regress desktop nav visibility.
4) Any missing assets referenced in src/href/url() must be added OR reference removed.
5) After any change: run build (npm + jekyll) and fix any failures.

Tasks:

- If header differs from SANDBOX, copy SANDBOX header and adjust minimally.
- Ensure _sass/30-components/_header-premium.scss is included by _sass/main.scss.
- Ensure JS hooks match HTML (nav.js selectors and IDs must exist).
- Produce a report of missing assets and restore them from git history or SANDBOX.
