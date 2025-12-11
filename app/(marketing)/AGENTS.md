# Agent Guidance – `app/(marketing)`

- Marketing pages must pull copy from central sources (`data/copy/*` via helper) and/or markdown frontmatter; do not hardcode strings inside components.
- Leverage `app/(marketing)/layout.tsx` for navigation; avoid duplicating nav logic in child pages.
- Prefer section components (`HeroSection`, `HomepageSections`) and shared utilities (`pbk-container`, `pbk-stack`). Keep new sections under 150 lines and split when needed.
- Any new listing page should read markdown via helpers in `app/lib/` and respect the file-length constraints.
- Always ensure CTA links exist or point to `/wkrótce` until real routes ship.
- Use the shared `ArticleCard` + `ArticleGrid` for all marketing listings; avoid bespoke card CSS in route folders.
