# Agent Guidance – `data/`

- Store structured JSON/YAML used for configuration or copy. Keep files human-readable and documented in `docs/brand/*`.
- When adding copy files, mirror the structure defined in `docs/brand/copy_system_plan.md`.
- Ensure TypeScript helpers (e.g., `app/lib/tools.ts`, `app/lib/copy.ts`) cover new files and provide typing.
- Run `npm run lint` after changes to catch schema/type issues.
- Never store secrets or credentials here.
