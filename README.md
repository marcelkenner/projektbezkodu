# ProjektBezKodu

Next.js App Router workspace for projektbezkodu.pl. The stack pairs Tailwind v4 design tokens with a markdown-first content pipeline so non-devs can ship pages without touching React.

## Quick Start

1. `source ~/.nvm/nvm.sh && npm install`
2. `npm run dev` – starts the site on `http://localhost:3000`
3. `npm run content:lint` – validates every `content/**/*.md` front matter. This now runs automatically before `npm run build`.
4. `npm run build && npm run start` – production preview

> **Note:** run all shell commands with `source ~/.nvm/nvm.sh && …` per repository policy.

## Scripts

| Command                | Description                                                                      |
| ---------------------- | -------------------------------------------------------------------------------- |
| `npm run dev`          | Next.js dev server with mobile-first layout defaults                             |
| `npm run build`        | Production build (runs `content:lint` first)                                     |
| `npm run start`        | Serve the production build                                                       |
| `npm run lint`         | ESLint                                                                           |
| `npm run content:lint` | Scans every markdown file via `gray-matter` to catch invalid YAML before runtime |
| `npm run tokens:build` | Rebuilds design tokens (`brand/tokens/*`)                                        |
| `npm run svg:optimize` | Optimises brand SVGs via SVGO                                                    |

## UI building blocks

- Article and resource listings must use the shared `ArticleCard` + `ArticleGrid` from `app/ui/articles/ArticleCard.tsx`; do not recreate per-page card variants.
- Image fallbacks are handled in the card; pass only clean hero URLs or let the resolver provide defaults.

## Content Workflow

All markdown lives under `content/**`. Each file **must**:

1. Start with a single front-matter block wrapped by `---` and `---`.
2. Use unique top-level keys; nest alternatives under `hero.*`, `seo.*`, `taxonomy.*`, etc.
3. Indent nested maps (YAML is whitespace-sensitive).
4. Quote strings that contain `:` or special characters.
5. Reference taxonomy slugs that exist in `data/copy/articles.json`.
6. Store hero/inline images under `public/media/{same path as markdown}/`. Example: `content/narzedzia/webflow/recenzja/index.md` ↔ `public/media/narzedzia/webflow/recenzja/hero.webp`. Reference assets as `/media/narzedzia/webflow/recenzja/hero.webp`.
7. React-managed pages (homepage, o-nas, kontakt, etc.) follow the same mirroring pattern: `app/(marketing)/o-nas/page.tsx` uses assets in `public/media/pages/(marketing)/o-nas/`.

The `/artykuly` listing now aggregates every markdown file with `template: "article"` (and `draft: false`) no matter where it lives under `content/**`. Keep `template` + `path` accurate whenever you expect a piece to appear in that listing.

Because the generic renderer preloads every markdown file, a single malformed front matter block can break the site. Run `npm run content:lint` locally (it executes automatically on `npm run build`) to catch errors early. The script lists each offending file plus the YAML parser message so you know what to fix.

## Asset routing hardening

Chunk load failures caused by malformed `/_next//_next/...` URLs are auto-normalised by middleware and `next.config` rewrites. Keep any future rewrites consistent with this rule and avoid adding double slashes to asset paths.

## Articles Copy & Taxonomy (`data/copy/articles.json`)

This JSON file drives:

- Articles listing copy (hero text, filters, empty states, pagination).
- Allowed taxonomy categories/tags (and labels/descriptions) resolved by `ArticleTaxonomyCatalog`.
- Ancillary UIs such as article cards in `app/(marketing)/(content)/artykuly` and author/tag routes.

You can expand the file with new UI copy or taxonomy terms as needed:

- Slugs must stay unique and become the authoritative values for markdown `taxonomy.categories` and `taxonomy.tags`.
- Keep the structure documented in `docs/brand/frontmatter_schema.md`; add new keys only when components/readers consume them.
- If the file approaches ~400 lines, split large sections (e.g., taxonomy, authors) into dedicated JSON files and update `getCopy` accordingly.

## Documentation

- `docs/website_repro_playbook.md` – canonical process manual (update whenever workflows change).
- `docs/glossary_todo.md` – open plan for the glossary refactor.
- `content/AGENTS.md`, `data/AGENTS.md`, etc. – directory-level guardrails.

All documentation must stay under 500 lines per repo policy and follow the mobile-first mindset outlined in `AGENTS.md`.
