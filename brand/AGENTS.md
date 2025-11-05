# Agent Guidance – `brand/`

- This directory contains design assets and tokens. Do not edit exported assets directly; update source files in Figma and re-export.
- Update `brand/CHANGELOG.md` whenever tokens, logos, or icons change.
- Keep token definitions in sync across JSON/CSS/TS by running `npm run tokens:build` after edits.
- Place new documentation under `brand/docs/` and register it in `docs/brand/index.md`.
- Ensure all assets remain under 500 lines and optimized (SVGO for SVGs, compressed PNGs).
