# Layout & Spacing Guidelines

## Containers

- Use `.pbk-container` (or `container` utility) to constrain width to 72rem with responsive padding.
- Mobile-first: full width, padding 1.5rem; scales automatically at larger breakpoints.

## Grid System

- `.pbk-grid` establishes a 4-column mobile grid, expanding to 6 columns at ≥768 px and 12 columns at ≥1280 px.
- Adjust gap tokens (`var(--space-6)`, `var(--space-8)`) depending on density requirements.
- For asymmetric layouts, apply `grid-column: span X` in components; reference tokens for spacing.

## Vertical Rhythm

- `.pbk-stack`, `.pbk-stack--tight`, `.pbk-stack--loose` manage columnar spacing using the fluid unit scale (`--space-1..--space-9`).
- Flowing content uses margin-top only: headings get more space before than after, `p + p` drops to `--space-2`.
- Heavy blocks (blockquote, pre, figure, callout) sit on `--space-4` top margins with `--space-3` inner padding to keep pages airy on all breakpoints.

## Surface Treatments

- Rounded corners: `.pbk-radius-sm`, `.pbk-radius-md`, `.pbk-radius-lg`.
- Shadows: `.pbk-shadow-md`, `.pbk-shadow-lg` map to elevation tokens; reserve `lg` for modals/overlays.

## Responsive Breakpoints

- Small: 640 px (tailwind `sm`)
- Medium: 768 px
- Large: 1024 px
- Extra large: 1280 px
- 2× large: 1440 px

Document deviations from these standards in this file and update `brand_design_system_plan.md` Section 5 as new patterns emerge.
