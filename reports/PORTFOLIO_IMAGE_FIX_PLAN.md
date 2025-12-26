# Portfolio Image Mapping & Fix Plan

## Current Inventory (7 images available)

### Bathrooms Directory
1. **after-entry-shot.jpg** (1.4 MB)
   - Shows: Complete bathroom tile installation from entry
   - Best use: Finished work showcase, portfolio hero
   
2. **after-lft-vanity-wall.jpg** (1.6 MB)
   - Shows: Large format tile on vanity wall, finished
   - Best use: Detail shot, bathroom remodels
   
3. **bathroom-wall-tile-detail-pre-grout.jpg + .webp** (5.6 MB each)
   - Shows: Wall tile laid, before grouting, detail view
   - Best use: Process/progress shots, trade notes
   
4. **large-format-tile-installation.jpg + .webp** (2.9 MB each)
   - Shows: LFT installation in progress
   - Best use: Process showcase, technical expertise
   
5. **lft-decoupling-membrane-sealed.jpeg** (3.4 MB)
   - Shows: Waterproof membrane installation, substrate prep
   - Best use: Process/prep, TCNA compliance showcase

### Floors Directory  
6. **hardwood-room.jpg** (224 KB)
   - Shows: Hardwood flooring (not tile)
   - Best use: Related services, scope diversity

---

## Recommended Actions

### Phase 1: Optimize & Rename (SEO + Clarity)
```
lft-decoupling-membrane-sealed.jpeg  → waterproof-membrane-installation.jpg
after-entry-shot.jpg                  → bathroom-tile-installation-complete.jpg  
after-lft-vanity-wall.jpg            → large-format-bathroom-tile-finished.jpg
bathroom-wall-tile-detail-pre-grout  → (keep, descriptive)
large-format-tile-installation       → (keep, already optimal)
hardwood-room.jpg                     → (keep, already clear)
```

### Phase 2: Update Portfolio Data (_data/portfolio.yml)
Replace broken entries with available images:

**High Priority Replacements:**
- `bathroom-marble-shower-niche.jpg` → use `bathroom-tile-installation-complete.jpg`
- `bathroom-marble-floor-finish.jpg` → use `large-format-bathroom-tile-finished.jpg`
- `bathroom-floor-install-progress.jpg` → use `large-format-tile-installation.jpg`
- `bathroom-accent-wall-and-shower.jpg` → use `bathroom-wall-tile-detail-pre-grout.jpg`

### Phase 3: Fix References in Includes
- **index.html** hero_project_image
- **portfolio.html** fallback_src
- **_includes/pattern-showcase.html** (4 broken refs)
- **_includes/ts-services.html** (5 broken refs)

### Phase 4: Create WebP versions
Convert JPEGs to WebP for performance:
- bathroom-tile-installation-complete.webp
- large-format-bathroom-tile-finished.webp
- waterproof-membrane-installation.webp

---

## Messaging Strategy (NJ Tile Jobs)

### Key Selling Points for Images
1. **TCNA Compliance** - Show substrate prep, membrane, proper methods
2. **Attention to Detail** - Grout lines, cuts, transitions
3. **Large Format Expertise** - LFT requires precision (differentiate from competitors)
4. **Process Transparency** - Before/during/after builds trust
5. **NJ HIC Licensed** - Professional, legal, insured

### Image Captions (Conversion-Focused)
- "Large-format tile installed per TCNA F125 standards—substrate prepped, membrane sealed, L/360 deflection verified"
- "Waterproof bathroom installation, NJ HIC #13VH10808800 compliant"
- "Precision cuts, lippage control, and expansion joints—no shortcuts"
- "From membrane to grout, every step documented and code-compliant"

---

## Implementation Priority

1. ✅ **Immediate** - Fix broken homepage hero image (index.html)
2. ✅ **High** - Update portfolio.html fallback
3. ✅ **High** - Fix pattern-showcase.html (homepage visibility)
4. ✅ **Medium** - Update ts-services.html  
5. ✅ **Medium** - Update portfolio.yml with available images
6. 🔄 **Future** - Acquire more project photos (showers, backsplashes, completed work)

---

**Goal:** Showcase Tillerstead's TCNA-compliant work to convert NJ homeowners looking for quality tile contractors ASAP.
