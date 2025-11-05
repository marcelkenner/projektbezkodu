# Iconography & Illustration Guidelines

## Required Icon Set

| Area       | Icon                                     | Size  | Notes                            |
| ---------- | ---------------------------------------- | ----- | -------------------------------- |
| Navigation | menu, close, arrow-right, chevron-down   | 24×24 | Stroke width 1.5px, rounded caps |
| CTAs       | arrow-up-right, download, play           | 24×24 | Solid fills in indigo or neutral |
| Social     | youtube, pinterest, linkedin, newsletter | 20×20 | Use primary or neutral palette   |
| Status     | info, success, warning, error            | 20×20 | Match semantic token colours     |
| Misc       | search, filter, external-link            | 24×24 | Shared with comparison tables    |

## Design Principles

- Stroke width `1.5px`, rounded joins/caps.
- Corner radius 2px for internal corners to align with 8px card radius.
- Use solid fills only for accent icons (e.g., success) with white glyphs.
- Export as optimized SVG (SVGO with `--multipass`).
- Provide monochrome variant where relevant (neutral ink).

## Asset Pipeline

1. Design in Figma → page “Components Web / Icons”.
2. Export via Figma batch export → `/brand/icons/*.svg`.
3. Run optimisation: `svgo brand/icons/*.svg`.
4. Update `docs/brand/asset_inventory.md` status to “Ready”.

## Illustrations & Templates

- Social templates (OG, Pinterest, YouTube) managed in `/brand/docs/`.
- Each template should use hero gradient background or photography with 60/30/10 colour split.
- Maintain editable Figma source and export flattened PNG.

## Performance Checklist

- Inline critical icons as SVG components in React to avoid network requests.
- Limit custom filters/gradients to hero visuals; icons remain flat for clarity.
- Document file sizes in `docs/brand/asset_inventory.md`.
