# Typography Implementation Notes

- **Fonts**: Using Google fonts via `next/font` with `Manrope` (headings), `Inter` (body), `JetBrains Mono` (code). Variables exposed as `--font-heading`, `--font-body`, `--font-mono`.
- **Global styles**: `app/globals.css` maps typography tokens to base elements (`body`, `h1`–`h3`) and provides link/focus styling aligned with the design system.
- **Responsive scale**: Font sizes use `clamp(...)` values defined in `tokens.json`, ensuring fluid behaviour between mobile and desktop.
- **Fallback stack**: Each font definition includes a system UI fallback; `display: "swap"` is set in `app/layout.tsx`.
- **Usage guidelines**:
  - Headings should use semantic elements (`h1`–`h6`). Avoid styling `<strong>` or `<b>` as headings.
  - Use `var(--typography-fontSize-small)` for captions and metadata.
  - Code snippets should leverage the `font-mono` class or CSS utility referencing `--font-mono`.
- **Linting**: TODO – add ESLint custom rule to disallow `<strong>` inside heading tags (tracked in Section 4 of `brand_design_system_plan.md`).
