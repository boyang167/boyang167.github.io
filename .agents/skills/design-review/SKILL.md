---
name: design-review
description: Audit an existing interface for usability, visual hierarchy, consistency, accessibility, responsive behavior, interaction feedback, and polish. Use before release or after a UI implementation.
---

# Design Review

## Review objective

Find issues that materially affect task completion, comprehension, accessibility, reliability, or visual coherence. Review against `apple-design-philosophy`; do not confuse personal taste with a usability defect.

## Evidence first

Inspect the source and, when tools are available, the rendered interface. Do not claim to have seen a screenshot or tested a workflow unless you actually did. Separate:
- Observed issue
- Likely risk or hypothesis
- Recommendation
- Verification status

## Severity

- **P0 — Blocker:** core task impossible, data loss, severe security or accessibility failure.
- **P1 — High:** major confusion, broken responsive behavior, misleading state, or important action hard to find.
- **P2 — Medium:** inconsistency, avoidable friction, missing useful state, or significant visual noise.
- **P3 — Low:** minor alignment, polish, or noncritical refinement.

## Audit dimensions

### Task and hierarchy
- Is the purpose clear?
- Is the primary action easy to find?
- Is content ordered by user importance?
- Are labels and terminology understandable?

### Visual coherence
- Are type, spacing, color, radii, and icons consistent?
- Are borders, cards, badges, and shadows overused?
- Is whitespace helping grouping?
- Is decoration competing with the content?

### Interaction
- Do controls behave as their appearance implies?
- Are hover, focus, selected, disabled, loading, success, and error states handled where relevant?
- Is feedback timely and specific?
- Can users recover from errors?

### Accessibility
- Can the primary workflow be completed by keyboard?
- Is focus visible?
- Are labels and semantic roles correct?
- Is contrast adequate?
- Is status communicated beyond color alone?
- Is reduced motion respected?

### Responsive and edge cases
- Does the layout reflow at narrow widths?
- Is there overflow or clipping?
- Do long labels and large text break the layout?
- Are empty, failed, and permission-denied states useful?

### Data and enterprise workflows
- Are units, labels, sorting, filtering, and status definitions clear?
- Are critical values visually distinguishable without misleading emphasis?
- Are destructive and bulk actions appropriately protected?
- Are permissions and disabled states understandable?

## Output format

Produce a concise report:

1. **Overall assessment** — one short paragraph.
2. **Prioritized findings** — severity, location, evidence, user impact, recommendation.
3. **Quick wins** — changes with high impact and low effort.
4. **Regression risks** — behavior that must be preserved.
5. **Verification plan** — exact tests or viewport checks to perform.

If asked to fix issues, implement the highest-value fixes after the audit, then report which findings were resolved and which remain. Do not claim full accessibility compliance based only on a visual review.
