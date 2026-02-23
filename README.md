# ProjektBezKodu

Next.js App Router workspace for projektbezkodu.pl. The stack pairs Tailwind v4 design tokens with a markdown-first content pipeline so non-devs can ship pages without touching React.

## Quick Start

1. `source ~/.nvm/nvm.sh && npm install`
2. `source ~/.nvm/nvm.sh && npm run dev` – starts the site on `http://localhost:3000`
3. `source ~/.nvm/nvm.sh && npm run content:lint` – validates every `content/**/*.md` front matter. This now runs automatically before `npm run build`.
4. `source ~/.nvm/nvm.sh && npm run build && npm run start` – production preview

> **Note:** run all shell commands with `source ~/.nvm/nvm.sh && …` per repository policy.
> **Node.js:** Next.js 16 requires Node.js `>= 20.9.0`. Use `source ~/.nvm/nvm.sh && nvm install --lts && nvm use --lts` if `node` or `npm` is missing.

## Scripts

| Command                | Description                                                                      |
| ---------------------- | -------------------------------------------------------------------------------- |
| `npm run dev`          | Next.js dev server with mobile-first layout defaults                             |
| `npm run build`        | Production build (runs `content:lint` first)                                     |
| `npm run start`        | Serve the production build                                                       |
| `npm run lint`         | ESLint                                                                           |
| `npm run test`         | Runs unit tests (Vitest)                                                         |
| `npm run content:lint` | Scans every markdown file via `gray-matter` to catch invalid YAML before runtime |
| `npm run content:fix:marketing-meta` | Fills missing `meta.summaryBullets` + `meta.primaryCta` for marketing templates |
| `npm run tokens:build` | Rebuilds design tokens (`brand/tokens/*`)                                        |
| `npm run svg:optimize` | Optimises brand SVGs via SVGO                                                    |

TypeScript builds intentionally exclude `vitest.config.ts` and `**/*.test.ts` so `npm run build` can run in environments that omit dev dependencies.

If a build fails with TypeScript errors referencing `.next/dev/types/*`, delete `.next/` and rerun the build (those files can be left over from `next dev`).

## UI building blocks

- Article and resource listings must use the shared `ArticleCard` + `ArticleGrid` from `app/ui/articles/ArticleCard.tsx`; do not recreate per-page card variants.
- Image fallbacks are handled in the card; pass only clean hero URLs or let the resolver provide defaults.

## Content Workflow

All markdown lives under `content/**`. Each file **must**:

1. Start with a single front-matter block wrapped by `---` and `---`.
2. Use unique top-level keys; nest alternatives under `hero.*`, `seo.*`, `taxonomy.*`, etc.
3. Indent nested maps (YAML is whitespace-sensitive).
4. Quote strings that contain `: ` (colon + space), e.g. `title: "FAQ: Depositphotos"`.
5. Reference taxonomy slugs that exist in `data/copy/articles.json`.
6. Store hero/inline images under `public/media/{same path as markdown}/`. Example: `content/narzedzia/webflow/recenzja/index.md` ↔ `public/media/narzedzia/webflow/recenzja/hero.webp`. Reference assets as `/media/narzedzia/webflow/recenzja/hero.webp`.
7. React-managed pages (homepage, o-nas, kontakt, etc.) follow the same mirroring pattern: `app/(marketing)/o-nas/page.tsx` uses assets in `public/media/pages/(marketing)/o-nas/`.

The `/artykuly` listing aggregates markdown pages whose canonical `path` lives under `/artykuly/`, excluding hubs (`type: hub`) and drafts (`draft: true`). Keep `path` accurate whenever you expect a piece to appear in that listing.

`/artykuly` routing is content-driven:

- **Hub pages** (`/artykuly/<category>/` and `/artykuly/<category>/<subcategory>/`) require an `index.md` under `content/artykuly/<...>/` with `type: hub` and `draft: false`. Hub pages only render the article-card listing (markdown body is ignored).
- **Leaf pages** under `/artykuly/*` are anything that is not a hub (i.e. `type !== hub`) and not a draft; they appear in `/artykuly` listings and inside hub listings.
- The footer “Kategorie” column lists every `content/artykuly/<folder>/index.md` as `/artykuly/<folder>/` (folder-name URLs may redirect to a different canonical `path` when front matter overrides it).

Content routing: canonical URLs are taken from frontmatter `path` (normalized to a trailing-slash form). Legacy/title-slug paths remain supported and redirect to the canonical URL.
Site pages additionally recover malformed merged redirect targets (for example `/<canonical>/, /<canonical>/`) to avoid 404s when crawlers encounter broken `Location` values.
Proxy also canonicalizes `www`/apex host variants via `Host` / `X-Forwarded-Host` and returns a `308` to the configured canonical host.
`/narzedzia/<tool>/glowny/` is intentionally indexable (explicit `index,follow` policy) because it is treated as the main long-form guide URL for each tool.

SEO helpers: XML sitemap lives at `/sitemap.xml` (`app/sitemap.ts`) and aggregates static App Router pages, markdown-driven content routes, and dynamic directories (glossary, tags, authors, lead magnets, templates). `/mapa-strony/` permanently redirects to the XML feed, and `robots.txt` is generated at `/robots.txt` (`app/robots.ts`).

Tool hubs: `/narzedzia/<tool>/` is a grid listing, while the tool’s main guide is readable at `/narzedzia/<tool>/glowny/` and sourced from `content/narzedzia-no-code/<tool>/glowny/index.md`.

Because the generic renderer preloads every markdown file, a single malformed front matter block can break the site. Run `npm run content:lint` locally (it executes automatically on `npm run build`) to catch errors early. The script lists each offending file plus the YAML parser message so you know what to fix.

Newsletter forms (`/api/newsletter/*`) redirect using `Forwarded` / `X-Forwarded-*` headers when present; ensure your reverse proxy forwards them so redirects keep the public origin.

Listmonk calls are executed with `cache: "no-store"`, timeouts, and small retries for transient failures (configurable via `LISTMONK_RETRY_ATTEMPTS`, `LISTMONK_RETRY_MIN_DELAY_MS`, `LISTMONK_RETRY_MAX_DELAY_MS`). Subscribe may redirect with `?warning=optin-delayed` when the signup succeeded but the opt-in email dispatch needs a retry.

## Build stability (Railway)

Railway Metal builders can spawn a high worker count during `next build` (for example “Generating static pages using 31 workers”). If a deploy fails with `failed to solve: Canceled: context canceled`, it is often the builder process getting killed (OOM) or the build context being canceled mid-build. Static generation parallelism is capped in `next.config.ts` via `experimental.staticGenerationMaxConcurrency` and `experimental.staticGenerationMinPagesPerWorker`; tune only after verifying memory headroom.
Set `CANONICAL_HOST` on the Next.js Railway service (for example `projektbezkodu.pl` to keep apex canonical, or `www.projektbezkodu.pl` to keep `www` canonical). If it is unset, proxy falls back to `NEXT_PUBLIC_SITE_URL`, then `https://projektbezkodu.pl`. Use a public host/origin value (no internal app ports like `:8080`); proxy now strips non-local ports from canonical redirects as a safety net.

### Newsletter (Railway + Listmonk)

Configure **the Next.js service** (this repo) with:

- `LISTMONK_BASE_URL` (example: `https://listmonk-production-f778.up.railway.app`)
- `LISTMONK_API_TOKEN` (Listmonk API user + token in the format `api_user:token`; sent as `Authorization: token api_user:token`)
- `LISTMONK_LIST_ID` (numeric list ID)
- `LISTMONK_LIST_UUID` (list UUID string)
- `LISTMONK_TIMEOUT_MS` (optional, default `10000`)
- `LISTMONK_RETRY_ATTEMPTS`, `LISTMONK_RETRY_MIN_DELAY_MS`, `LISTMONK_RETRY_MAX_DELAY_MS` (optional)

Configure **the Listmonk service** to listen on a public interface (for example `[app].address = "0.0.0.0:9000"`; via env this is `LISTMONK_app__address`). When deployed behind Railway, ensure the service actually binds to the port Railway routes to.

If you land on `/newsletter?error=listmonk-error` in production, check your Railway logs for `Newsletter subscribe failed` (status codes like 401/403 usually mean token/permissions; 4xx can mean wrong base URL or list ID; 5xx typically means Listmonk is down/unreachable).

## Asset routing hardening

Chunk load failures caused by malformed `/_next//_next/...` URLs are auto-normalised by proxy and `next.config` rewrites. Proxy also recovers malformed merged page URLs (for example `/<canonical>/, /<canonical>/`) and issues a clean 308 redirect before route matching.

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
- `docs/frontmatter_and_routing.md` – how frontmatter drives URLs, hubs, and redirects.
- `docs/newsletter_listmonk_railway.md` – environment + deployment notes for newsletter/Listmonk on Railway.
- `docs/glossary_todo.md` – open plan for the glossary refactor.
- `content/AGENTS.md`, `data/AGENTS.md`, etc. – directory-level guardrails.

All documentation must stay under 500 lines per repo policy and follow the mobile-first mindset outlined in `AGENTS.md`.
