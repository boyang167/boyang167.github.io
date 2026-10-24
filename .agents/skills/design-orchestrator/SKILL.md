---
name: design-orchestrator
description: Coordinate UI design and frontend polish tasks by routing work through design principles, page design, component implementation, and design review. Use when creating, redesigning, auditing, or polishing a product interface end-to-end.
---

# Design Orchestrator

## Goal

Deliver usable, coherent, accessible, polished product interfaces through a repeatable workflow. Treat Apple's design philosophy as a source of principles, not a requirement to copy Apple's exact visual style.

## First inspect

Before editing:
1. Identify the framework, package manager, entry points, routes, component library, styling approach, and test/build commands.
2. Inspect the target page and nearby components.
3. Find existing design tokens, typography, icons, and interaction patterns.
4. Understand the user task and preserve current business behavior.
5. Identify whether the request is for exploration, implementation, or review.

Do not replace the stack or add dependencies without a clear reason.

## Routing rules

- For design direction, hierarchy, restraint, and platform principles: apply `apple-design-philosophy`.
- For page composition, responsive layouts, forms, dashboards, and interaction flows: apply `web-ui-design`.
- For React/Vue/etc. components, state, semantics, and styling implementation: apply `frontend-component-engineering`.
- For audits, acceptance criteria, accessibility, visual QA, and regression checks: apply `design-review`.

Read the relevant skill files when available. If the environment does not expose them as tools, use their rules as the workflow contract.

## Standard workflow

### 1. Frame
Write down:
- User and primary task
- Main content and primary action
- Constraints and existing conventions
- Definition of done

If one essential requirement blocks meaningful progress, ask one concise question. Otherwise proceed with clearly stated assumptions.

### 2. Diagnose
Inspect the existing UI. Prioritize findings:
- P0: broken or blocked task, data loss, severe accessibility issue
- P1: unclear hierarchy, broken responsive layout, misleading feedback
- P2: inconsistent patterns, excessive visual noise, avoidable friction
- P3: cosmetic refinement

### 3. Design
Establish the hierarchy before styling:
- Page purpose
- Primary action
- Main content
- Supporting information
- Secondary actions
- Navigation and status

Prefer the smallest change that meaningfully improves usability.

### 4. Implement
- Reuse existing tokens and components.
- Keep business logic intact.
- Make interactive controls functional.
- Include loading, empty, error, success, disabled, and destructive states where relevant.
- Use semantic markup and keyboard-accessible controls.
- Avoid unrelated refactors.

### 5. Verify
Run available tests, lint, type checks, and build where reasonable. Inspect the rendered UI using available browser or screenshot tools if available. Check representative viewport sizes and important interactions.

Never state that a visual inspection, browser test, or command succeeded unless it actually did.

### 6. Report
Summarize:
- Main issues found
- Changes made
- Principles applied
- Checks actually run and their outcomes
- Remaining risks or unverified behavior

## Definition of done

The primary task is clear; the main action is discoverable; repeated components behave consistently; content remains readable; important states are handled; keyboard and responsive use are considered; and verification claims match the evidence.
