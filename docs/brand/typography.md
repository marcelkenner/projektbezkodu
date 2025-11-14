# Typography Implementation Notes

- **Fonts**: Using self-hosted `.woff2` assets via `next/font/local`: `Space Grotesk` (headings 500/700 from `/public/fonts/SpaceGrotesk-LatinExt-500-700.woff2`), `Inter` (body/UI 400/500/600 from `/public/fonts/Inter-LatinExt-roman.woff2`), and `JetBrains Mono` (code). Variables exposed as `--font-heading`, `--font-body`, `--font-mono`.
- **Global styles**: `app/globals.css` maps typography tokens to base elements (`body`, `h1`–`h3`) and provides link/focus styling aligned with the design system.
- **Responsive scale**: Font sizes use `clamp(...)` values defined in `tokens.json`, ensuring fluid behaviour between mobile and desktop.
- **Fallback stack**: Each font definition includes a system UI fallback; `display: "swap"` is set in `app/layout.tsx`.
- **Readability helpers**: `app/globals.readability.css` centralises the `main[data-readable="true"]` clamp (68 ch), `.pbk-readable`, nav/link/button typography helpers, and metric text styles so Polish copy stays legible on long-form pages without shrinking full-width hero layouts.
- **Application pattern**: Any narrative-first block (hero intros, FAQ summaries, legal copy, marketing disclosures) must live inside `.pbk-readable` or a container that sets `data-readable="true"`; component grids/cards can remain full width.
- **Usage guidelines**:
  - Headings should use semantic elements (`h1`–`h6`). Avoid styling `<strong>` or `<b>` as headings.
  - Use `var(--typography-fontSize-small)` for captions and metadata.
  - Code snippets should leverage the `font-mono` class or CSS utility referencing `--font-mono`.
- **Linting**: TODO – add ESLint custom rule to disallow `<strong>` inside heading tags (tracked in Section 4 of `brand_design_system_plan.md`).
