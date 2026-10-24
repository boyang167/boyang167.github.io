---
name: frontend-component-engineering
description: Implement polished, reusable, accessible frontend components while preserving the existing stack, design system, and business behavior. Use when coding or refactoring UI components and page interactions.
---

# Frontend Component Engineering

## Inspect before coding

1. Identify framework, version, package manager, styling method, routing, and component library.
2. Locate existing tokens and shared components.
3. Follow local naming, file, and state-management conventions.
4. Check scripts before running commands.
5. Avoid introducing dependencies unless existing tools cannot reasonably meet the requirement.

## Component design

- Give components one clear responsibility.
- Prefer composition over giant components with many unrelated branches.
- Extract shared components when repeated behavior or design justifies it.
- Keep state close to where it is used unless shared behavior requires lifting it.
- Keep business logic separate from presentation where practical.
- Use explicit props and types when the stack supports them.
- Avoid premature abstraction and over-configurable components.

## Semantic and accessible implementation

- Prefer semantic HTML elements.
- Use buttons for actions and links for navigation.
- Associate form labels with controls.
- Support keyboard activation and visible focus.
- Use ARIA only when native semantics are insufficient.
- Ensure status messages can be perceived by assistive technology.
- Do not make essential actions available only on hover.
- Respect reduced-motion preferences.

## Styling

- Reuse design tokens and existing primitives.
- Use a consistent spacing and typography scale.
- Use semantic color tokens for success, warning, error, and information.
- Keep focus, hover, active, disabled, selected, and loading states coherent.
- Avoid arbitrary magic numbers, conflicting CSS overrides, and duplicated styles.
- Avoid decorative gradients, glass effects, shadows, or rounded cards unless they serve the product.
- Ensure layout works with long content, zoom, and responsive widths.

## Interaction correctness

- Every visible control must have a real, understandable action.
- Prevent duplicate submissions where relevant.
- Preserve form values after recoverable validation errors.
- Show progress for slow operations.
- Provide success and error feedback.
- Confirm irreversible actions when appropriate.
- Handle empty data, API failure, permission failure, and stale data when relevant.
- Do not fake backend success or fabricate data.

## Safe change strategy

- Make the smallest coherent change that solves the task.
- Preserve existing routes, API contracts, permissions, analytics, and business rules.
- Do not rewrite unrelated modules.
- Add or update tests for important behavior where practical.
- Avoid silently changing public component APIs.

## Verification

Run relevant checks available in the repository:
- Lint
- Type check
- Unit or component tests
- Production build

If browser tooling is available, inspect the rendered page at a wide and narrow viewport and exercise the primary workflow. If not, clearly state that visual verification remains unperformed.

## Completion report

State files or areas changed, notable implementation decisions, commands actually run, their outcomes, and remaining limitations.
