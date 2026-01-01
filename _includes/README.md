# _includes/ Directory Reference

**Organized for clarity.** All 30 active includes organized into 8 logical categories.

---

## 📁 Directory Structure

```
_includes/
├── layout/           (5) Site structure & shell
├── hero/             (3) Page hero sections
├── schema/           (2) Structured data markup
├── features/         (4) Feature-specific components
├── components/       (7) Reusable UI elements
├── content/          (8) Content section renderers
├── utilities/        (1) Helpers & loaders
├── forms/            (2) Form components
└── sections/         (6) Full-page sections
```

---

## 🎨 By Category

### layout/ — Site Shell & Structure (5 files)

**Core HTML structure and layout wrappers.**

| File | Purpose |
|------|---------|
| `head.html` | Meta tags, SEO, fonts, stylesheets |
| `header.html` | Navigation header |
| `footer.html` | Site footer |
| `logo-header.html` | Logo in header variant |
| `logo-sprite-inline.html` | Inline SVG sprite injection |

**Usage:**
```liquid
{% include layout/head.html %}
{% include layout/header.html %}
{% include layout/footer.html %}
```

---

### hero/ — Page Heroes (3 files)

**Full-width hero sections with images, overlays, and text.**

| File | Purpose |
|------|---------|
| `page-hero.html` | Generic page hero |
| `unified-hero.html` | Unified design hero |
| `unified-hero-home.html` | Home page hero variant |

**Usage:**
```liquid
{% include hero/page-hero.html %}
{% include hero/unified-hero-home.html %}
```

---

### schema/ — Structured Data (2 files)

**JSON-LD schema.org markup for SEO.**

| File | Purpose |
|------|---------|
| `schema-faq.html` | FAQ rich results |
| `schema-local-business.html` | LocalBusiness data |

**Usage:**
```liquid
{% include schema/schema-local-business.html %}
{% if page.include_faq_schema %}
  {% include schema/schema-faq.html %}
{% endif %}
```

---

### features/ — Feature Components (4 files)

**Specialized components for specific features.**

| File | Purpose |
|------|---------|
| `faq-section.html` | Reusable FAQ renderer (YAML-driven) |
| `build-phase-cta.html` | Build Phase guide CTA |
| `contact-options.html` | Contact method options |
| `cta-estimate.html` | Estimate request CTA |

**Usage:**
```liquid
{% include features/faq-section.html 
  items=site.data.home-faq 
  title="FAQs"
  schema=true %}
{% include features/build-phase-cta.html %}
```

---

### components/ — Reusable UI Elements (7 files)

**Building blocks for layouts and pages.**

| File | Purpose |
|------|---------|
| `ts-breadcrumbs.html` | Breadcrumb navigation |
| `ts-icon.html` | Icon component |
| `ts-icon-sprite.html` | Icon system |
| `trust-bar.html` | Trust indicators & badges |
| `social-links.html` | Social media links |
| `responsive-image.html` | Lazy-loaded, responsive images |
| `pattern-showcase.html` | Pattern library display |

**Usage:**
```liquid
{% include components/ts-breadcrumbs.html %}
{% include components/responsive-image.html src=image alt="..." %}
{% include components/social-links.html %}
```

---

### content/ — Content Sections (8 files)

**Render dynamic content from YAML data files.**

| File | Purpose |
|------|---------|
| `ts-services.html` | Services grid |
| `ts-service-card.html` | Individual service card |
| `ts-portfolio.html` | Portfolio gallery |
| `portfolio-highlights.html` | Featured projects |
| `ts-process.html` | Process timeline |
| `ts-plans.html` | Pricing plans |
| `reviews-highlights.html` | Customer testimonials |
| `blog-highlights.html` | Recent blog posts |

**Usage:**
```liquid
{% include content/ts-services.html %}
{% include content/reviews-highlights.html limit=3 %}
{% include content/blog-highlights.html %}
```

---

### utilities/ — Helpers & Loaders (1 file)

**Utility includes for scripts, helpers, etc.**

| File | Purpose |
|------|---------|
| `scripts.html` | Script loading & initialization |

**Usage:**
```liquid
{% include utilities/scripts.html %}
```

---

### forms/ — Form Components (2 files)

**Form elements and contact forms.**

| File | Purpose |
|------|---------|
| `contact.html` | Contact form |
| `contact-long.html` | Extended contact form |

**Usage:**
```liquid
{% include forms/contact.html %}
```

---

### sections/ — Full-Page Sections (6 files)

**Complete page sections (may include multiple includes).**

| File | Purpose |
|------|---------|
| `hero.html` | Hero section |
| `services.html` | Services section |
| `process.html` | Process section |
| `portfolio.html` | Portfolio section |
| `testimonials.html` | Testimonials section |
| `cta.html` | Call-to-action section |

**Usage:**
```liquid
{% include sections/hero.html %}
{% include sections/services.html %}
```

---

## 🔍 Quick Reference by Use Case

### "I need to..."

**Add a CTA button**
→ `features/cta-estimate.html` or `features/build-phase-cta.html`

**Display customer reviews**
→ `content/reviews-highlights.html`

**Show services**
→ `content/ts-services.html`

**Add a hero image**
→ `hero/page-hero.html`

**Include structured data**
→ `schema/schema-faq.html` or `schema/schema-local-business.html`

**Render responsive images**
→ `components/responsive-image.html`

**Add breadcrumbs**
→ `components/ts-breadcrumbs.html`

**Show portfolio**
→ `content/ts-portfolio.html` or `content/portfolio-highlights.html`

**Add FAQ section**
→ `features/faq-section.html`

---

## 📝 Include Syntax

### Basic Include
```liquid
{% include layout/header.html %}
```

### With Parameters
```liquid
{% include components/responsive-image.html 
  src="/assets/img/image.jpg" 
  alt="Description"
  class="hero-image" %}
```

### Conditional
```liquid
{% if page.show_hero %}
  {% include hero/page-hero.html %}
{% endif %}
```

### From Data
```liquid
{% include content/ts-services.html services=site.data.services %}
```

---

## 🎯 Include Loading Order (In _layouts/default.html)

```html
<head>
  {% include layout/head.html %}
</head>
<body>
  {% include layout/logo-sprite-inline.html %}
  {% include layout/header.html %}
  
  <main>
    <!-- Page content here -->
  </main>
  
  {% include layout/footer.html %}
  
  {% include utilities/scripts.html %}
  {% include schema/schema-local-business.html %}
</body>
```

---

## 📊 Statistics

| Category | Files | Purpose |
|----------|-------|---------|
| layout | 5 | Page structure |
| hero | 3 | Hero sections |
| schema | 2 | SEO markup |
| features | 4 | Feature components |
| components | 7 | UI elements |
| content | 8 | Content rendering |
| utilities | 1 | Helpers |
| forms | 2 | Forms |
| sections | 6 | Full sections |
| **TOTAL** | **38** | **All production includes** |

---

## ✨ Best Practices

### When to Create a New Include

✅ **DO create an include when:**
- The component is reused 2+ times
- The component is self-contained
- The component has clear purpose
- The component can be parameterized

❌ **DON'T create an include when:**
- It's only used once
- It's a tiny wrapper
- It's tightly coupled to one page
- It duplicates another include

### Naming Convention

- **Layout:** `layout/`
- **Hero:** `hero/`
- **Schema:** `schema/`
- **Features:** `features/`
- **Components:** `components/ts-*` or `components/*`
- **Content:** `content/ts-*`
- **Utilities:** `utilities/`
- **Forms:** `forms/`
- **Sections:** `sections/`

### File Organization

```
Include name → Folder → Logical category
responsive-image.html → components/ → Reusable UI
ts-services.html → content/ → Content rendering
schema-faq.html → schema/ → Structured data
```

---

## 🔄 Migration from Flat Structure

**Before:** `{% include faq-section.html %}`  
**After:** `{% include features/faq-section.html %}`

All references have been automatically updated throughout the codebase.

---

## 📚 Related Documentation

- **INDEX.md** — Complete repository navigation
- **DESIGN_SYSTEM.md** — Design tokens & patterns
- **README.md** — Quick start guide

---

**Last Updated:** 2026-01-01  
**Status:** Fully organized & documented  
**Verification:** All 30 references updated
