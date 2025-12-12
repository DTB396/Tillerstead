#!/bin/bash
# Complete git workflow for modern theme refactor

set -e

echo "🚀 Modern Theme Refactor - Git Commit Script"
echo "============================================="
echo ""

# Stage new theme files
echo "📦 Staging new theme files..."
git add _sass/base/_reset.scss
git add _sass/base/_typography.scss
git add _sass/layout/_container.scss
git add _sass/components/_buttons.scss
git add _sass/components/_cards.scss
git add _sass/components/_forms.scss
git add _sass/components/_header.scss
git add _sass/components/_footer.scss
git add _sass/components/_hero.scss
git add assets/css/main.scss

# Stage updated files
echo "📝 Staging updated files..."
git add _sass/layout/_grid.scss
git add _sass/utilities/_helpers.scss
git add package.json
git add THEME_QUICKSTART.md
git add THEME_VISUAL_GUIDE.md

# Stage documentation
echo "📚 Staging documentation..."
git add MODERN_THEME_DOCS.md
git add CLEANUP_REPORT.md
git add CLEANUP_COMPLETE.md
git add scripts/cleanup-old-theme.sh
git add git-commit-guide.sh

# Remove old files
echo "🗑️  Removing old duplicate files..."
git rm assets/css/main-build.scss 2>/dev/null || echo "  (main-build.scss already removed)"
git rm -r src/scss/ 2>/dev/null || echo "  (src/scss/ already removed)"
git rm -r src/assets/ 2>/dev/null || echo "  (src/assets/ already removed)"

echo ""
echo "✅ All files staged!"
echo ""

# Show status
echo "📊 Current git status:"
git status --short

echo ""
echo "💾 Committing changes..."
git commit -m "Refactor: Modern HTML5/CSS3 theme with modular architecture

- Created new modular SCSS structure in _sass/
  - base/ layer: reset, typography, tokens
  - layout/ layer: container, grid system
  - components/ layer: buttons, cards, forms, header, footer, hero
  - utilities/ layer: helper classes
  
- Renamed main-build.scss to main.scss (Jekyll convention)
- Updated npm build scripts in package.json
- Removed old duplicate code (main-build.scss, src/scss/, src/assets/)
- Added comprehensive documentation
  - MODERN_THEME_DOCS.md (architecture guide)
  - THEME_QUICK_REFERENCE.md (code patterns)
  - THEME_VISUAL_GUIDE.md (visual structure)
  - CLEANUP_REPORT.md (cleanup analysis)
  
Features:
- Mobile-first responsive design
- CSS Grid & Flexbox layouts
- Design token system with CSS custom properties
- WCAG 2.1 AA accessibility compliance
- Modern CSS reset & typography
- Utility-first approach
- Backwards compatible via components/theme.scss

Browser support: Chrome 49+, Firefox 31+, Safari 9.1+"

echo ""
echo "🎉 Commit complete!"
echo ""
echo "Next steps:"
echo "  git push origin main"
