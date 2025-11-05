# @projektbezkodu/design-tokens

Design tokens for the ProjektBezKodu brand system. Tokens are maintained in `tokens.json` and compiled to CSS and TypeScript outputs.

## Usage

```bash
source ~/.nvm/nvm.sh && npm run tokens:build
```

The build command regenerates:

- `tokens.css` – CSS variables (`:root`) for global theming.
- `tokens.ts` – TypeScript constant for consumption inside the Next.js app.

Publishable artefacts (JSON, CSS, TS) are listed in `package.json#files`. Update the changelog in `/brand/CHANGELOG.md` when tokens change.

## Workflow

1. Edit `tokens.json` (keep descriptions up to date).
2. Run the build script to regenerate derived files.
3. Import `tokens.css` via global styles or Tailwind, and `tokens.ts` where typed access is needed.
4. Sync `tokens.json` with the Figma Tokens plugin for design parity.
