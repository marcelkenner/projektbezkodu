# Storybook Integration (Optional)

> Current scope does **not** require Storybook. Keep this guide for future expansion.

## Potential Goals (future work)

- Showcase design system components with brand tokens applied.
- Provide accessibility and viewport testing inside Storybook.
- Enable Chromatic/visual regression later.

## Setup Steps

1. Install dependencies (once Node environment ready):
   ```bash
   source ~/.nvm/nvm.sh && npm install --save-dev storybook@8 @storybook/nextjs @storybook/addon-a11y @storybook/addon-viewport
   ```
2. Initialise Storybook:
   ```bash
   npm run storybook:init
   ```
3. Update `.storybook/main.ts`:
   - Add path alias for `@brand/tokens`.
   - Include `brand/tokens/tokens.css` in `preview.css`.
4. Configure `preview.ts`:
   ```ts
   import "../app/globals.css";
   import "../brand/tokens/tokens.css";
   ```
5. Add addons:
   ```ts
   addons: [
     "@storybook/addon-essentials",
     "@storybook/addon-a11y",
     "@storybook/addon-viewport",
   ];
   ```
6. Create `stories/Button.stories.tsx` (primary, secondary, text states) referencing brand tokens.
7. Document workflow in `/docs/brand/components.md` after initial stories exist.

## Commands

- `source ~/.nvm/nvm.sh && npm run storybook` – run Storybook locally.
- `source ~/.nvm/nvm.sh && npm run build-storybook` – static build for deployment.

Update `docs/brand_design_system_plan.md` Section 7.2 if the team decides to adopt Storybook later.
