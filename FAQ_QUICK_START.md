# Quick Reference: Build Phase & FAQ System

## What's New

### Three Reusable Includes
```liquid
{% include features/faq-section.html items=site.data.build-faq title="Title" schema=true %}
{% include features/build-phase-cta.html %}
```

### Two Data Files
- `site.data.build-faq` → 10 Q&A pairs (Build Phase overview)
- `site.data.home-faq` → 6 Q&A pairs (Home page CTAs)

---

## Quick Integration (Copy & Paste)

### Home Page (`index.html`)
Replace the old static FAQ section with:
```liquid
{% include features/faq-section.html 
  title="Built to TCNA Standards, Licensed in NJ" 
  eyebrow="Standards & Compliance"
  description="We follow the Tile Council of North America (TCNA) Handbook and applicable ANSI standards (A108, A118) on every project—not because homeowners ask for it, but because it's the right way to build bathrooms that last. We document it so you have proof the work meets code and performs as intended."
  schema=true
  items=site.data.home-faq
  id="home-faq"
%}
```

### Services Page (`pages/services.html`)
Add at the end (before closing tag):
```liquid
{% include features/build-phase-cta.html %}
```

### Portfolio Page (`pages/portfolio.html`)
Add at the end (before closing tag):
```liquid
{% include features/build-phase-cta.html %}
```

### Build Phase Hub (`pages/build/index.md`)
Add before the final quote:
```liquid
{% include features/faq-section.html 
  title="Build Phase FAQs" 
  eyebrow="Common Questions"
  description="Answers to the questions we hear most often about the construction process."
  schema=true
  items=site.data.build-faq
%}
```

### All 8 Build Phase Chapters (`pages/build/*.md`)
Add at the very end:
```liquid
```

---

## Key Features

✅ **FAQ Component**
- Renders from YAML data
- Auto-generates schema.org markup
- Mobile responsive
- Accessible HTML5

✅ **Build Phase Navigation**
- Auto-detects current chapter
- Prev/next links
- Back to hub button
- Disabled at start/end

✅ **Build Phase CTA**
- Two-column layout
- Chapter preview
- Mobile responsive
- Easy to drop in anywhere

---

## Customization

### Edit FAQ Content
Edit the YAML files:
- `_data/build-faq.yml` - Build Phase questions
- `_data/home-faq.yml` - Home page questions

```yaml
- question: "Your question?"
  answer: "Your answer."
```

### Style Changes
All colors and spacing use CSS variables. Update in:
- `_sass/base/_tokens.scss`

No hardcoded colors—pure variable design.

---

## SEO Bonus

Both FAQ components auto-generate `FAQPage` schema:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
```

This enables **FAQ rich results** in Google search.

---

## Files
- `_includes/faq-section.html` (1.9 KB)
- `_includes/build-phase-cta.html` (3.5 KB)
- `_data/build-faq.yml` (3.1 KB)
- `_data/home-faq.yml` (1.3 KB)
- `BUILD_PHASE_REFACTORING.md` (full guide)

---

**Status:** Ready to deploy. See `BUILD_PHASE_REFACTORING.md` for full documentation.


