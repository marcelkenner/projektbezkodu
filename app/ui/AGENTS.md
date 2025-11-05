# Agent Guidance – `app/ui`

- Components here are shared primitives; keep them stateless, token-driven, and under 150 lines.
- Use CSS variables from `brand/tokens/tokens.css` only. Never introduce raw hex values or spacing constants.
- Provide accessibility by default (roles, aria attributes, keyboard support). Expose variants via props when necessary.
- Export components through `app/ui/index.ts` so other modules import from a single entry point.
- Add concise Storybook or doc references in `docs/brand/components_overview.md` when introducing new components.
