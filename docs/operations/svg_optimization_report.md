# SVG Asset Optimisation – ProjektBezKodu

Status: awaiting final artwork from design. Current SVG files in `brand/logo/` are empty placeholders (0 bytes), so optimisation cannot proceed yet.

## 1. Current Inventory

| File | Size | Notes |
| ---- | ---- | ----- |
| `brand/logo/logo-lockup-horizontal.svg` | 0 bytes | Placeholder – no vector paths. |
| `brand/logo/logo-lockup-stacked.svg` | 0 bytes | Placeholder – no vector paths. |
| `brand/logo/logo-wordmark-white.svg` | 0 bytes | Placeholder – no vector paths. |

## 2. Required Inputs

- Finalised SVG exports (preferably outlined text, no embedded rasters).
- Design tokens for primary/secondary brand colours to ensure consistency.
- list of target background colours to verify contrast when exporting monochrome variants.

## 3. Optimisation Workflow (to run once assets arrive)

1. Place raw SVGs in `brand/logo/source/`.
2. Run `npm run svg:optimize` (requires `svgo` installed locally via `npm install --save-dev svgo`).
3. Verify:
   - No inline styles conflicting with design tokens.
   - ViewBox dimensions respect 1×1 scaling for responsive sizing.
   - Title/desc metadata present for accessibility.
4. Export PNG fallbacks at 2x and 3x density if required.

## 4. Next Steps

- [ ] Receive final logo files from design (ETA to be confirmed).
- [ ] Create `svgo.config.json` tuned to brand needs (remove `removeViewBox` plugin).
- [ ] Update this report after optimisation with before/after file sizes.
