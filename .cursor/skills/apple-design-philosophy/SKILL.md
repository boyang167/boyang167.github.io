---
name: apple-design-philosophy
description: Apply Apple's human interface design philosophy to product design, UI implementation, and design reviews. Use when creating, redesigning, or polishing web applications, dashboards, SaaS products, mobile interfaces, component systems, or design prototypes. Focus on clarity, deference, consistency, visual hierarchy, intuitive interaction, accessibility, and high-quality details.
---

# Apple Design Philosophy

## Mission

Design interfaces that feel clear, calm, intuitive, coherent, and meticulously crafted.

Apply Apple's design principles as a source of design reasoning, not as a mandate to copy Apple's exact screens, branding, icons, or proprietary visual details.

The goal is to make products easier to understand and use, while preserving the product's own identity and functional requirements.

## Core Principles

### 1. Clarity

Every screen should communicate its purpose immediately.

- Establish an obvious information hierarchy.
- Use concise, human-readable labels.
- Make primary actions easy to identify.
- Prefer meaningful typography over excessive decoration.
- Ensure icons are recognizable and provide labels when ambiguity exists.
- Avoid unnecessary jargon, redundant content, and competing visual elements.

Ask:
- Can users understand this screen within a few seconds?
- Is the primary action obvious?
- Is the difference between headings, supporting text, and metadata clear?

### 2. Deference to Content

The interface should support content rather than compete with it.

- Give important content sufficient space.
- Use backgrounds, borders, and separators only when they improve comprehension.
- Keep persistent navigation and controls visually quiet.
- Avoid decorative gradients, oversized illustrations, and excessive cards without a functional reason.
- For data-heavy applications, prioritize the information users need to make decisions.

Ask:
- Is the interface drawing more attention than the content?
- Can any visual element be removed without reducing usability?

### 3. Consistency

Create a coherent system instead of designing every screen independently.

- Reuse established components and design tokens.
- Keep spacing, typography, colors, radii, and icon styles consistent.
- Use the same interaction pattern for the same kind of task.
- Follow platform conventions unless there is a clear product-specific reason not to.
- Keep navigation, form behavior, loading states, and error handling predictable.

Ask:
- Would users need to relearn the same interaction on another page?
- Can this interface reuse an existing component?

### 4. Restraint

Every visual and interaction decision must have a purpose.

- Prefer fewer, stronger visual signals.
- Limit accent colors to meaningful emphasis.
- Avoid unnecessary borders, shadows, badges, animations, and modal dialogs.
- Do not turn every section into a card.
- Avoid adding controls that users rarely need.
- Preserve complexity when the task genuinely requires it; simplify presentation rather than hiding essential functionality.

Ask:
- Does this element improve comprehension, navigation, feedback, or task completion?
- Is there a simpler solution that achieves the same result?

### 5. Intuitive Interaction

Users should understand what they can do and what happens next.

- Make interactive elements visually distinguishable.
- Provide immediate feedback after user actions.
- Preserve context during navigation and editing.
- Use sensible defaults and minimize unnecessary decisions.
- Support undo, cancellation, recovery, and confirmation when appropriate.
- Prevent destructive actions from occurring accidentally.
- Make disabled, loading, success, and error states explicit.

Ask:
- Can users predict the result of an action?
- Do they know whether the action succeeded?
- Can they recover from a mistake?

### 6. Depth and Motion

Use visual depth and motion to communicate relationships and state changes.

- Use layering only when it helps establish hierarchy or context.
- Make transitions explain where content came from or where it went.
- Keep animations short, purposeful, and unobtrusive.
- Avoid motion that delays essential tasks.
- Respect reduced-motion preferences.
- Never use animation as a substitute for clear state feedback.

### 7. Craft and Detail

Quality is the sum of many small decisions.

- Align elements precisely.
- Maintain consistent spacing and typography.
- Design empty, loading, error, success, and overflow states.
- Handle long text, narrow viewports, and missing data gracefully.
- Use restrained, coherent iconography.
- Avoid placeholder copy, broken layouts, inconsistent component behavior, and arbitrary CSS overrides.
- Ensure keyboard navigation, readable contrast, and accessible labels.

### 8. Accessibility and Inclusion

A beautiful interface must remain usable by different people and input methods.

- Do not communicate status through color alone.
- Provide visible keyboard focus.
- Use semantic HTML and accessible form labels.
- Maintain sufficient text and control contrast.
- Respect reduced motion and user preferences.
- Ensure controls are usable with touch, mouse, and keyboard where applicable.
- Avoid relying solely on hover to expose important functionality.

## Design Decision Rules

When making design decisions, use this priority order:

1. User task completion.
2. Information clarity and hierarchy.
3. Predictable interaction.
4. Accessibility and responsiveness.
5. Consistency with the design system.
6. Visual refinement and aesthetic polish.

Never sacrifice task completion or accessibility merely to achieve a minimalist appearance.

Minimalism means removing unnecessary complexity, not removing necessary functionality.

## Workflow

### Phase 1: Understand

Before changing the UI, identify:

- Target users and their primary tasks.
- Application type and platform.
- Core information and primary actions.
- Existing design system and technical constraints.
- Relevant loading, empty, error, and success states.

If essential information is missing, ask a concise clarifying question. Otherwise, proceed with reasonable assumptions and state them.

### Phase 2: Establish Hierarchy

For each screen, define:

- Primary purpose.
- Primary action.
- Secondary actions.
- Main content.
- Supporting information.
- Navigation and contextual controls.

Make the visual hierarchy reflect the actual importance of these elements.

### Phase 3: Define the Visual System

Reuse the project's existing design system when available.

If no design system exists, establish tokens for:

- Typography scale and font weights.
- Spacing scale.
- Color palette and semantic colors.
- Border radii and separators.
- Shadows and elevation.
- Interactive states.
- Responsive breakpoints.

Use restrained defaults. Avoid arbitrary values scattered throughout the codebase.

### Phase 4: Implement

- Build reusable components.
- Prefer semantic, accessible markup.
- Keep visual styles separate from business logic where practical.
- Reuse existing libraries and conventions.
- Implement all relevant interaction states.
- Preserve existing functionality unless explicitly asked to change it.

For web applications, prefer a clean, content-first layout with clear typography, deliberate whitespace, and subtle separation between regions.

Do not automatically use translucent glass, rounded cards, gradients, or oversized whitespace. Select these treatments only when they serve the product.

### Phase 5: Review

Evaluate the implementation against:

- Clarity.
- Content priority.
- Consistency.
- Restraint.
- Interaction feedback.
- Accessibility.
- Responsive behavior.
- Edge cases.
- Visual polish.

Fix functional and hierarchy problems before decorative details.

### Phase 6: Report

Summarize:

- What changed.
- Which design principles guided the changes.
- Any accessibility or responsive improvements.
- Remaining issues or assumptions.
- How the implementation was verified.

Never claim to have visually inspected or tested a screen unless the corresponding inspection or test was actually performed.

## Web and Enterprise Application Guidance

Apply Apple's principles without ignoring the needs of the product.

### SaaS and Admin Dashboards

- Prioritize scanning speed and information density.
- Use typography and spacing to group related information.
- Reserve accent colors for primary actions and meaningful states.
- Use tables when users need comparison, sorting, filtering, or bulk operations.
- Keep filters, toolbars, and advanced controls organized.
- Use progressive disclosure for infrequent or advanced options.
- Make empty, loading, permission-denied, and error states useful.

### Forms and Workflows

- Group fields by purpose.
- Use clear labels and explain constraints before submission.
- Minimize unnecessary input and repeated confirmation.
- Preserve user input when validation fails.
- Show progress for multi-step workflows.
- Confirm high-impact or irreversible operations.

### Data Visualization

- Emphasize the decision-relevant signal.
- Use consistent units, legends, and scales.
- Avoid decorative chart effects.
- Make missing data and uncertainty explicit.
- Provide accessible alternatives when color is used to encode information.

### Responsive Interfaces

- Preserve content hierarchy across viewport sizes.
- Adapt navigation and layout to available space.
- Avoid horizontal overflow and clipped controls.
- Keep important actions accessible on touch devices.
- Test long labels, large text, and dense data.

## Anti-Patterns

Reject these patterns unless a specific user need justifies them:

- Decoration without a clear purpose.
- Too many competing accent colors.
- Excessive nested cards and borders.
- Inconsistent spacing and typography.
- Icon-only controls with unclear meaning.
- Hidden actions that depend exclusively on hover.
- Animations that delay or distract from tasks.
- Minimalism that removes useful labels or navigation.
- Beautiful mockups with nonfunctional controls.
- Copying Apple's interface without considering the product's own users and workflow.

## Definition of Done

A design is ready when:

- The screen's purpose is immediately understandable.
- The primary task and action are easy to identify.
- Visual elements have clear functional or informational value.
- Repeated patterns are consistent.
- Interactive states provide appropriate feedback.
- Keyboard use and accessible semantics are supported.
- Responsive layouts and important edge cases are addressed.
- Existing product requirements remain satisfied.
- The result has been verified to the extent possible in the available environment.

## Final Principle

Make the interface feel simple because the design work has resolved complexity, not because important complexity has been ignored.
