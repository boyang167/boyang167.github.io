---
name: apple-design-philosophy
description: Apply Apple-inspired human interface principles to product design and UI reviews. Use for clarity, content priority, consistency, restraint, intuitive interaction, accessibility, and craft.
---

# Apple Design Philosophy

## Mission

Make interfaces clear, calm, intuitive, coherent, and carefully crafted. Use Apple's design philosophy as a source of reasoning, not as a mandate to copy its branding, screens, icons, or proprietary details.

## Principles

### Clarity
- Make the purpose of each screen obvious.
- Establish clear hierarchy through typography, spacing, grouping, and concise labels.
- Make the primary action easy to identify.
- Avoid jargon and competing focal points.

### Deference to content
- Let content and user tasks lead the experience.
- Use borders, surfaces, and navigation chrome only when they clarify structure.
- In data-heavy products, prioritize decision-relevant information.

### Consistency
- Reuse components, tokens, and interaction patterns.
- Keep spacing, type, color, and state behavior coherent.
- Follow established platform conventions unless there is a strong product reason not to.

### Restraint
- Give every visual element a job.
- Limit accent colors and decorative effects.
- Avoid excessive cards, shadows, borders, badges, gradients, and animations.
- Simplify presentation without hiding necessary functionality.

### Intuitive interaction
- Make affordances and outcomes understandable.
- Give timely feedback.
- Preserve context and user input.
- Support cancellation, recovery, and undo when appropriate.
- Protect destructive actions from accidental activation.

### Depth and motion
- Use layering to explain hierarchy or context.
- Animate meaningful state changes, not decoration.
- Keep transitions responsive and respect reduced-motion preferences.

### Craft
- Attend to alignment, rhythm, typography, icon consistency, overflow, and edge cases.
- Design empty, loading, error, success, disabled, and permission-denied states.
- Do not ship placeholder text or inert controls.

### Accessibility
- Use semantic markup and accessible labels.
- Support keyboard navigation and visible focus.
- Ensure adequate contrast.
- Do not use color as the only status signal.
- Respect user motion preferences and text scaling.

## Decision priority

1. Task completion
2. Comprehension and information hierarchy
3. Predictable interaction
4. Accessibility and responsive behavior
5. System consistency
6. Aesthetic polish

Never sacrifice usability for minimalism. Minimalism means resolving complexity, not deleting useful functionality.

## Review questions

- Can users understand the page purpose in a few seconds?
- Is the primary action clear?
- Is content more prominent than decoration?
- Does every element contribute to comprehension or task completion?
- Are patterns consistent across pages?
- Are state changes visible and recoverable?
- Does the interface remain usable with keyboard, touch, zoom, and narrow screens?

## Anti-patterns

Reject by default:
- Decoration without purpose
- Too many accent colors
- Excessive nested cards
- Arbitrary spacing and typography
- Ambiguous icon-only controls
- Hover-only access to essential actions
- Motion that delays work
- Minimalism that removes labels or key navigation
- Beautiful but nonfunctional mockups

## Final principle

Make the interface feel simple because the design work has resolved complexity, not because important complexity has been ignored.
