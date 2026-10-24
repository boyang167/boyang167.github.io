---
name: web-ui-design
description: Design web application pages and flows with strong information hierarchy, responsive layout, clear interactions, and restrained visual systems. Use when planning or redesigning pages, dashboards, forms, settings, onboarding, or workflows.
---

# Web UI Design

## Objective

Turn product requirements into a clear page structure and interaction model before implementation. Use `apple-design-philosophy` as the design decision framework.

## Step 1: Define the job

Identify:
- Target user and task
- Most important information
- Primary action and likely next action
- Secondary and destructive actions
- Constraints such as permissions, data volume, latency, and device size

When requirements are incomplete but not blocking, state assumptions and continue.

## Step 2: Create hierarchy

Organize each page into:
1. Context: page title, location, and relevant status
2. Primary task: the main action or key information
3. Main content: the working area
4. Supporting content: filters, metadata, help, or history
5. Secondary actions: less frequent operations

Avoid making every section equally prominent.

## Step 3: Choose the right pattern

- Use tables for comparison, scanning, sorting, filtering, and bulk operations.
- Use forms for structured input and validation.
- Use progressive disclosure for advanced or infrequent settings.
- Use dialogs only for focused decisions that need interruption.
- Use inline feedback for local success or validation when possible.
- Use a stepper for genuinely multi-stage tasks, not for a simple form.
- Use charts only when a visual encoding reveals a pattern better than a table or metric.
- Use cards when they represent meaningful independent units, not as a default wrapper for every section.

## Step 4: Establish visual rules

If the project has a design system, follow it. Otherwise define a small token set:
- Type scale and weights
- Spacing scale
- Neutral and semantic colors
- Border and separator rules
- Radius and elevation
- Focus, hover, active, disabled, and selected states
- Responsive breakpoints

Use consistent tokens rather than one-off styling. Prefer readable line lengths and deliberate whitespace. Do not default to glassmorphism, gradients, heavy shadows, or large rounded surfaces.

## Step 5: Design states

For each important component, consider:
- Default
- Hover and focus
- Active and selected
- Disabled
- Loading
- Empty
- Error
- Success
- Permission denied
- Overflow or long content

Not every component needs every state; include those relevant to its behavior.

## Step 6: Responsive behavior

Design around content constraints, not device names alone.
- Prevent horizontal overflow.
- Preserve the primary action at narrow widths.
- Reflow multi-column layouts when content becomes cramped.
- Keep tables usable through appropriate column prioritization, horizontal scrolling, or alternate compact patterns.
- Ensure touch controls have practical target sizes.
- Check large text and long translated labels.

## Deliverable before coding

For nontrivial redesigns, briefly state:
- Page hierarchy
- Key components and why they fit
- Interaction states
- Responsive strategy
- Design assumptions

Then implement if implementation is requested.

## Data-heavy enterprise UI

Optimize for accurate scanning and efficient work:
- Align numeric columns and use consistent units.
- Separate primary values from metadata.
- Make filters and sort state visible.
- Avoid decorative charts and redundant summary cards.
- Use semantic status labels, not color alone.
- Keep advanced options available without overwhelming the default view.
