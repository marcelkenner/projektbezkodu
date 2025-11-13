# Agent Guidance – `data/`

- Store structured JSON/YAML used for configuration or copy. Keep files human-readable and documented in `docs/brand/*`.
- When adding copy files, mirror the structure defined in `docs/brand/copy_system_plan.md`.
- Ensure TypeScript helpers (e.g., `app/lib/tools.ts`, `app/lib/copy.ts`) cover new files and provide typing.
- Run `npm run lint` after changes to catch schema/type issues.
- Never store secrets or credentials here.
- `data/copy/articles.json` is the source of truth for the articles listing copy and taxonomy catalog. Expand it freely, but:
  - Keep slugs unique; markdown files may only use slugs declared here.
  - Document any new keys/sections in `docs/brand/frontmatter_schema.md` or the related plan.
  - If the file approaches 400+ lines, split large sections (e.g., taxonomy, authors) into dedicated JSON files and update `getCopy("articles")` to stitch them back together.
