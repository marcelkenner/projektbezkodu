# Tooling & Automation Roadmap

- **Design tokens**: `npm run tokens:build` regenerates CSS/TS from JSON (see `brand/tokens/scripts/build.mjs`).
- **Lint rules**: pending addition of custom ESLint rule to block disallowed hex colours + enforce heading usage.
- **Tests**: create unit tests for component behaviours (timeline, pricing) using Vitest or Jest (TBD).
- **Visual regression**: plan to integrate Storybook + Chromatic after stories exist.
- **Git hooks**: add Husky/pre-commit to run `npm run lint` and `npm run tokens:build -- --check` once Node tooling available.
- **Docs updates**: extend this file as tooling lands; note versions and commands.
