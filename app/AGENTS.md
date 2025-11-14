# Agent Guidance – `app/`

- This directory hosts the Next.js App Router code. Keep server components declarative and push logic into reusable managers/hooks under `app/lib/`.
- Import design tokens via `brand/tokens/tokens.css`; never hardcode colors or spacing. Use the utilities defined in `app/ui/ui.css`.
- Consume shared UI primitives from `app/ui/`. New components must stay under 200 lines and expose clear props.
- All pages must be mobile-first and accessible. Test layouts at 360px and 768px before desktop.
- When you need copy, use the centralized helpers (`app/lib/copy.ts` once implemented) instead of embedding strings.
- Keep route groups organised (`(marketing)`, `(legal)`, etc.) and add sub-AGENTS files for specialised rules.
- Store page-specific media under `public/media/pages/{route path}/`. Example: `app/(marketing)/o-nas/page.tsx` references `/media/pages/(marketing)/o-nas/hero.webp`. Never keep page art inside `app/`.
- Icons: prefer `@phosphor-icons/react/dist/ssr` imports (Phosphor icon set) to keep visual language consistent. Do not inline random SVGs unless absolutely necessary.
