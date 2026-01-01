# Script Organization & Governance

**Based on:** `/.ai/SCRIPT_CLASSES.md`  
**Status:** ✅ Implemented  
**Date:** 2026-01-01

---

## Overview

All scripts are organized by **risk classification** and **operational scope**. This ensures proper review, testing, and compliance before deployment.

---

## Script Classification System

### Class A — REGULATED / CLIENT-IMPACTING

**Risk:** High | **Review:** Required | **Testing:** Full

Scripts that affect clients, pricing, compliance, or legal obligations.

**Examples:**
- Estimators
- Intake forms
- Contract generators
- Compliance disclosures
- Pricing logic

**Directory:** `scripts/class-a-regulated/`

**Rules:**
- ✅ Must reference `/.ai/COMPLIANCE.md`
- ✅ Must include disclaimers
- ✅ Must log assumptions
- ✅ Must NEVER auto-execute destructive changes
- ✅ Must be human-reviewed before merge

**Template:**
```javascript
/**
 * CLASS A - REGULATED
 * PURPOSE: [What this does]
 * RISK: Client-facing, pricing-sensitive
 * 
 * COMPLIANCE NOTES:
 * - References: COMPLIANCE.md, DOMAIN.md
 * - Disclaimers: Must include
 * - Assumptions logged: Yes
 * - Destructive: No auto-execute
 * 
 * REVIEW REQUIRED: Yes
 */

// Implementation...
```

---

### Class B — TECHNICAL / OPERATIONAL

**Risk:** Medium | **Review:** Recommended | **Testing:** Automated

Scripts for build automation, CI/CD, linting, and data transforms.

**Examples:**
- Build scripts
- CI pipelines
- Lint rules
- Animation logic
- Data transforms
- Image optimization
- Asset processing

**Directory:** `scripts/class-b-technical/`

**Rules:**
- ✅ Must be deterministic (same input = same output)
- ✅ Must include rollback path
- ✅ Must NOT touch client data
- ✅ Must document side effects
- ✅ Must include error handling

**Template:**
```javascript
/**
 * CLASS B - TECHNICAL
 * PURPOSE: [Build/automation task]
 * RISK: Build failure, asset processing
 * 
 * SIDE EFFECTS:
 * - Modifies: [which files]
 * - Deletes: [what gets deleted]
 * - Creates: [what gets created]
 * 
 * ROLLBACK: [How to revert]
 * ERROR HANDLING: Yes
 * LOGGING: Detailed
 */

// Implementation...
```

---

### Class C — EDUCATIONAL / VISUALIZATION

**Risk:** Low | **Review:** Optional | **Testing:** Manual

Scripts for explainers, interactive demos, visualizations, learning modules.

**Examples:**
- Explainer animations
- Interactive diagrams
- Learning modules
- Content visualizers
- Educational simulations

**Directory:** `scripts/class-c-educational/`

**Rules:**
- ✅ Must avoid guarantees
- ✅ Must include "educational only" language
- ✅ Must NOT simulate inspections or approvals
- ✅ Must NOT replace professional judgment

**Template:**
```javascript
/**
 * CLASS C - EDUCATIONAL
 * PURPOSE: [Explainer/visualization]
 * RISK: Educational content only
 * 
 * DISCLAIMER: This is educational content and does not constitute
 * professional advice, inspection, or approval. Users should consult
 * professionals for actual decisions.
 * 
 * NOT FOR: Professional use, real decisions, inspections, approvals
 */

// Implementation...
```

---

## Utility Scripts

**Directory:** `scripts/utilities/`

Shared helpers, functions, and utilities used across multiple scripts.

**Examples:**
- Color conversion utilities
- File helpers
- Logging utilities
- Validation functions
- API wrappers

**Organization:**
```
utilities/
├── colors.js          Color manipulation
├── files.js           File operations
├── logging.js         Logging utilities
├── validation.js      Validation helpers
└── api.js             API wrappers
```

---

## Script Templates

**Directory:** `scripts/templates/`

Boilerplate templates for creating new scripts of each class.

**Contents:**
```
templates/
├── class-a-template.js      Regulated script template
├── class-b-template.js      Technical script template
├── class-c-template.js      Educational script template
└── TEMPLATE_GUIDE.md        How to use templates
```

---

## Risk Grading System

**Every change must be graded by risk level:**

### R0 — Copy edits, comments
- **Review:** None
- **Testing:** None
- **Approval:** Self

### R1 — Styling, animation, layout
- **Review:** Optional
- **Testing:** Manual
- **Approval:** Self

### R2 — Logic, calculations, data flows
- **Review:** Recommended
- **Testing:** Automated
- **Approval:** Peer review

### R3 — Legal, pricing, compliance, contracts
- **Review:** Required
- **Testing:** Full + legal
- **Approval:** Owner + legal

---

## Decision Log

**File:** `/.ai/DECISION_LOG.md`

All non-obvious decisions must be logged, especially:

- Pricing logic changes
- Compliance interpretations
- Cost vs. durability tradeoffs
- Design decisions affecting scope

**Format:**
```markdown
## Decision: [Title]

**Date:** 2026-01-01  
**Context:** [Why this came up]  
**Options Considered:** [What were the alternatives]  
**Decision:** [What we chose]  
**Standards Referenced:** [TCNA, ANSI, NJ law, etc.]  
**Risks Acknowledged:** [What could go wrong]  
**Author:** [Who made this decision]  
```

---

## Current Script Audit

**Status:** Inventory in progress

### Build & CI Scripts (Class B)
- `ts-00-bootstrap.ps1` → `class-b-technical/`
- `ts-10-audit.ps1` → `class-b-technical/`
- `ts-20-fix-jekyll-config.ps1` → `class-b-technical/`
- `build-site.ps1` → `class-b-technical/`
- `build-css.js` → `class-b-technical/`

### Image & Asset Processing (Class B)
- `optimize-images.js` → `class-b-technical/`
- `convert-images-to-webp.js` → `class-b-technical/`
- `analyze-css-structure.js` → `class-b-technical/`

### Utilities (Utility Class)
- `slugify.js` → `utilities/`
- `consolidate-colors.js` → `utilities/`
- `check-contrast.js` → `utilities/`

### Educational/Visualization (Class C)
- `design-icon-placement.mjs` → `class-c-educational/`
- `render-guide-pdf.mjs` → `class-c-educational/`

### To Review/Classify
- `compliance-audit.js` → Class B (audit) or Class A (compliance)?
- `find-unused-css.js` → Class B (analysis)
- `verify-deployment.js` → Class B (verification)

---

## Creating a New Script

### 1. Determine Class

Ask these questions:

- **Does it affect clients?** → Class A
- **Does it do build/automation?** → Class B
- **Does it explain/educate?** → Class C
- **Is it a shared helper?** → Utilities

### 2. Create from Template

```bash
# Copy appropriate template
cp scripts/templates/class-b-template.js scripts/class-b-technical/my-new-script.js

# Edit the template with your code
nano scripts/class-b-technical/my-new-script.js
```

### 3. Complete Header

```javascript
/**
 * CLASS B - TECHNICAL
 * PURPOSE: [What this does]
 * RISK: [Risk assessment]
 * 
 * SIDE EFFECTS:
 * - Modifies: [files]
 * - Creates: [files]
 * - Deletes: [files]
 * 
 * ROLLBACK: [How to revert]
 * ERROR HANDLING: Yes
 */
```

### 4. Implement with Best Practices

- Use utilities from `scripts/utilities/`
- Include comprehensive logging
- Handle errors gracefully
- Document assumptions
- Test thoroughly

### 5. Test

```bash
# Run the script
node scripts/class-b-technical/my-new-script.js

# Verify output
# Check rollback path works
# Test error conditions
```

### 6. Add to Package.json

```json
{
  "scripts": {
    "my-script": "node scripts/class-b-technical/my-new-script.js"
  }
}
```

### 7. Submit for Review

- Class A: Requires owner approval
- Class B: Peer review recommended
- Class C: Optional review
- Utilities: Self-review okay

---

## Running Scripts

### By Class

```bash
# Build/technical scripts
npm run build
npm run build:css
npm run audit

# Educational scripts
npm run visualize
npm run demo

# Utilities
node scripts/utilities/slugify.js "My Title"
```

### Manual Execution

```bash
# Class B technical script
node scripts/class-b-technical/build-site.js

# With logging
node scripts/class-b-technical/build-site.js --verbose

# Dry run (if supported)
node scripts/class-b-technical/build-site.js --dry-run
```

---

## Documentation Requirements

### Class A Scripts
- [ ] Purpose statement
- [ ] Compliance references
- [ ] Assumptions logged
- [ ] Disclaimers included
- [ ] Review checklist
- [ ] Owner approval needed

### Class B Scripts
- [ ] Purpose statement
- [ ] Side effects documented
- [ ] Rollback procedure
- [ ] Error handling
- [ ] Logging output
- [ ] Test cases

### Class C Scripts
- [ ] Purpose statement
- [ ] Educational disclaimers
- [ ] What it does/doesn't do
- [ ] Limitations noted
- [ ] User education section

### Utilities
- [ ] Function signature
- [ ] Parameters documented
- [ ] Return value documented
- [ ] Error cases handled
- [ ] Usage examples

---

## Compliance Checklist

Before committing any script:

### Class A (Required)
- [ ] References COMPLIANCE.md
- [ ] Includes legal disclaimer
- [ ] Assumptions documented
- [ ] No auto-destructive changes
- [ ] Owner reviewed
- [ ] Legal implications considered

### Class B (Recommended)
- [ ] Deterministic (same input = same output)
- [ ] Rollback path tested
- [ ] No client data modified
- [ ] Side effects documented
- [ ] Error handling complete
- [ ] Logging adequate

### Class C (Suggested)
- [ ] No guarantee language
- [ ] Educational disclaimer present
- [ ] Doesn't simulate approvals
- [ ] Professional judgment encouraged
- [ ] Limitations clear

---

## Repository Structure

```
scripts/
├── class-a-regulated/
│   ├── estimator.js
│   ├── compliance-checker.js
│   └── README.md
│
├── class-b-technical/
│   ├── build-site.js
│   ├── optimize-images.js
│   ├── audit-css.js
│   └── README.md
│
├── class-c-educational/
│   ├── explainer-animation.js
│   ├── visualization-demo.js
│   └── README.md
│
├── utilities/
│   ├── colors.js
│   ├── files.js
│   ├── logging.js
│   └── validation.js
│
├── templates/
│   ├── class-a-template.js
│   ├── class-b-template.js
│   ├── class-c-template.js
│   └── TEMPLATE_GUIDE.md
│
└── README.md (this file)
```

---

## Best Practices

### ✅ DO

- Classify scripts by risk
- Document side effects
- Include error handling
- Log assumptions
- Test thoroughly
- Use utilities for common tasks
- Include disclaimers (especially Class A)
- Document rollback paths

### ❌ DON'T

- Ignore compliance
- Auto-execute destructive changes
- Hide assumptions
- Mix classes in one file
- Modify client data in Class B
- Simulate professional judgment (Class C)
- Hardcode values (use config files)
- Skip error handling

---

## Examples

### Class A Example
```javascript
/**
 * CLASS A - REGULATED
 * PURPOSE: Generate pricing estimates for homeowners
 * RISK: Client-facing, financial, compliance-sensitive
 */

const fs = require('fs');
const { logDecision } = require('../utilities/logging');

// Log decision context
logDecision({
  date: new Date().toISOString(),
  decision: 'Use TCNA material standards for estimates',
  standards: ['TCNA 2024', 'ANSI A108', 'ANSI A118'],
  risks: 'Overestimation leads to bad projects'
});

// Include disclaimer
const DISCLAIMER = `
⚠️  DISCLAIMER: This estimate is educational only.
Professional pricing requires site assessment, 
local permits, and material verification.
`;

console.log(DISCLAIMER);

// Implementation with full error handling...
```

### Class B Example
```javascript
/**
 * CLASS B - TECHNICAL
 * PURPOSE: Build CSS from SCSS
 * RISK: Build failure, styling issues
 */

const sassBuilder = require('node-sass');
const fs = require('fs');

console.log('Building CSS...');

try {
  const result = sassBuilder.renderSync({
    file: './assets/css/main.scss'
  });
  
  fs.writeFileSync('./assets/css/main.css', result.css);
  console.log('✅ CSS built successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Rollback: git checkout assets/css/main.css
```

### Class C Example
```javascript
/**
 * CLASS C - EDUCATIONAL
 * PURPOSE: Show how waterproofing systems work
 * RISK: Educational content only
 */

const DISCLAIMER = `
📚 EDUCATIONAL CONTENT ONLY

This visualization shows waterproofing concepts.
It does NOT constitute professional advice,
inspection approval, or installation guidance.

For actual projects, hire licensed professionals.
`;

console.log(DISCLAIMER);

// Educational visualization code...
```

---

## Support

- **Questions about classification?** Check SCRIPT_CLASSES.md
- **Need a template?** See `scripts/templates/`
- **Need a utility?** Check `scripts/utilities/`
- **Compliance questions?** See `/.ai/COMPLIANCE.md`

---

**Maintained by:** Development Team  
**Last Updated:** 2026-01-01  
**Status:** ✅ Active & Enforced
