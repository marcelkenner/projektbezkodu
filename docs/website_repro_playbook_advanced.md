## 20. Newsletter + Listmonk

1. **Railway stack** – Provision Listmonk + PostgreSQL inside a single Railway project. Authenticate via `railway login`, then `railway use` the environment before running migrations (`railway run listmonk -- install --config config.toml`). Confirm the HTTP endpoint and credentials from the Railway dashboard.
2. **Environment variables** – Mirror production settings in `.env.production` (copy to `.env.local` for dev):
   - `LISTMONK_BASE_URL=https://<railway-subdomain>.railway.app`
   - `LISTMONK_API_TOKEN=api_user:token` (the “token” string created under Admin → Users → API access)
   - `LISTMONK_LIST_ID=<numeric ID of the primary public list>`
   - `LISTMONK_LIST_UUID=<UUID of the same list>` (needed for templates and public APIs)
   - Optional: `LISTMONK_TIMEOUT_MS=10000` for slower tunnels.
     Keep the `.env.production` file untracked and share values via the secure onboarding channel.
3. **Listmonk bootstrap** – After linking the repo (`railway link -p <project-id>`), switch between services with `railway service <name>`. Useful commands:
   - Inspect Postgres creds: `railway variables --service Postgres`.
   - Tail Listmonk logs: `railway logs --service listmonk --lines 200`.
   - SSH into Listmonk for config/debug: `railway ssh --service listmonk -- ./listmonk --help`.
   - Update allowed origins: `railway variables --service listmonk --set "LISTMONK_ORIGIN_0=https://example.com" ...`.
   - Install schema (first boot auto-runs `./listmonk --install --yes` as seen in logs).
   - Verify the local HTTP server responds: `railway ssh --service listmonk -- wget -qO- http://127.0.0.1:9000`.
4. **List creation + API token**
   - Use the bootstrap credentials (from `LISTMONK_app__admin_*`) only once to sign in at `https://<public-listmonk-domain>/admin`, then immediately create your real superuser (Admin → Settings → Users). After confirming you can log in with the new account, blank the bootstrap env vars:
     ```
     railway variables --service listmonk \
       --set "LISTMONK_app__admin_username=" \
       --set "LISTMONK_app__admin_password="
     ```
   - Create the primary public list (double opt-in). Example curl for reference:
     ```
     curl -u "$ADMIN_USER:$ADMIN_PASS" \
       -H "Content-Type: application/json" \
       -d '{"name":"ProjektBezKodu Newsletter","type":"public","slug":"projektbezkodu-newsletter","optin":"double","sender_name":"ProjektBezKodu","sender_email":"news@projektbezkodu.pl"}' \
       https://<listmonk-domain>/api/lists
     ```
   - Capture `id` + `uuid` from the response; these feed the Next.js service env vars.
   - Generate a dedicated API user/token (e.g. `projektbezkodu-marcel-api:M9Tx...`) and rotate the frontend env var:
     ```
     railway variables --service projektbezkodu \
       --set "LISTMONK_API_TOKEN=projektbezkodu-marcel-api:M9TxLskzYytmo38kP4f9GOJ3rs64A3LK"
     ```
5. **App service configuration** – Set the env vars on the Next.js service (and redeploy) so the server actions can reach Listmonk:
   ```
   railway variables --service projektbezkodu \
     --set "LISTMONK_BASE_URL=https://<listmonk-domain>" \
     --set "LISTMONK_API_TOKEN=<api_user:token>" \
     --set "LISTMONK_LIST_ID=<numeric ID>" \
     --set "LISTMONK_LIST_UUID=<uuid>" \
     --set "LISTMONK_TIMEOUT_MS=15000"
   ```
   Repeat per project. For previews hosted elsewhere update `LISTMONK_ORIGIN_*` accordingly; if everything lives on Railway just clear the unused slots.
6. **Backend flow** – `app/lib/newsletter/NewsletterManager.ts` orchestrates everything through the `ListmonkClient`. All forms target API route handlers so marketing pages stay static:
   - `POST /api/newsletter/subscribe` subscribes or re-subscribes, stores cookie context, and fires the double opt-in via `POST /api/subscribers/{id}/optin`, then redirects to `/newsletter/potwierdz/`.
   - `POST /api/newsletter/resend` reuses the cookie context, rate-limited by `NEWSLETTER_RESEND_COOKIE`, then redirects back to `/newsletter/potwierdz/`.
   - `POST /api/newsletter/preferences` and `POST /api/newsletter/unsubscribe` require `?subscriber=<uuid>` in the query string; forms inject that UUID as a hidden input before calling the manager, then redirect to their respective pages with status/error params.
7. **Front-end behaviour** – All newsletter pages now surface aria-live feedback states. The homepage CTA posts directly to `/newsletter/potwierdz/`, so users always land on the confirm screen while the server handles Listmonk side effects. `ResendButton` keeps a 15 s cooldown locally and restores it from the resend cookie when the page reloads.
8. **Testing checklist**
   - `railway connect listmonk` to forward the admin port locally if the CLI-managed URL is firewalled.
   - Run `npm run dev`, submit `/newsletter` and `/newsletter` (homepage module) forms with a test email; confirm the double opt-in email arrives.
   - Append `?subscriber=<uuid>` from a Listmonk export to `/newsletter/preferencje` and `/newsletter/wypisz` to verify the happy path plus error states when the UUID is missing or expired.
   - Monitor Listmonk logs (`railway logs listmonk`) for 4xx/5xx responses whenever you adjust copy or consent requirements.

## 21. App Router Query Handling

1. Next.js 16 (React 19) now delivers both `searchParams` **and** `params` as Promises, even for static routes. Never access `params.slug`/`searchParams.foo` directly—doing so triggers runtime failures that block routes such as `/artykuly`, `/narzedzia`, or `/glossary/[slug]`.
2. Type every page, layout, and metadata export with Promise-based props (e.g., `params?: Promise<{ slug: string }>` and `searchParams?: Promise<Record<string, string | string[] | undefined>>`) and make each consumer `async` so you can unwrap everything up front:
   ```ts
   export default async function Page({ searchParams }: PageProps) {
     const resolvedSearchParams = searchParams ? await searchParams : undefined;
     const parser = new SearchParamParser(resolvedSearchParams);
     // ...
   }
   ```
3. The same rule applies to `generateMetadata`, nested server components, and coordinators—pass them the resolved objects, never the raw promises.
4. Use `SearchParamParser` (or dedicated coordinators) as the single source of truth for extracting `getSingle` / `getAll` values. This keeps newsletter alerts, article filters, and resource listings reusable while satisfying the SRP/OOP constraints from `AGENTS.md`.
5. When introducing a new route, add lint coverage (`npm run lint`) before testing in the browser so Promise misuse is caught in CI instead of the runtime.

## 21. Tool Hub & Lead Magnet Patterns

1. `app/(marketing)/(content)/narzedzia/page.tsx` renders ToolHub cards built entirely from markdown-derived summaries plus `data/catalog/tools.json` metadata. Cards automatically show a badge, a prominent heading/subheading, ArticleSummaryBullets, a pricing/platform meta row, taxonomy chips, and an `ArticleCtaGroup` (primary = internal guide, secondary = `siteHref`). Set `affiliate: true` to append `rel="sponsored"` on the external CTA and reuse the disclosure text from `data/copy/tools.json`.
2. We deliberately removed vendor logos from the hub. Don’t add them back unless design explicitly requests it—keeping the cards text-first maintains parity with the rest of the marketing site and avoids logo upkeep across multiple sizes/formats.
3. Lead magnet detail pages share ArticleSummaryBullets and ArticleCtaGroup. Each entry in `data/copy/lead-magnets.json` must include `summaryBullets` (≥3 meaningful points) and a `cta` object with `primary` / `secondary` links plus optional `helperText`. The primary CTA usually links to `#lead-magnet-form` so the button scrolls to the form column; the secondary CTA can target a related tutorial or resource.
4. `scripts/validate-content.mjs` now warns when article-driven markdown (folders: `artykuly`, `narzedzia`, `porownania`, `poradniki`, `przypadki-uzycia`, `zasoby`, `szablony`) misses `meta.summaryBullets` or `meta.primaryCta`. Use `CONTENT_LINT_STRICT=true npm run content:lint` or pass `--strict` to fail builds on warnings; otherwise they show up in CI logs without blocking.

## 22. Font Variables

1. Treat `next/font` as the single source of truth for typography. The root layout must apply every font’s `.variable` class to `<body>`, which hydrates `--font-heading`, `--font-body`, and `--font-mono` with the actual font stacks (including latin-ext subsets).
2. Mirror those values into the shared tokens by assigning `--typography-fontFamily-heading`, `--typography-fontFamily-body`, and `--typography-fontFamily-mono` directly from the `--font-*` variables in `app/globals.css`. Always provide the original design-token string as the fallback inside `var()` so emails/docs rendered without `next/font` still have a sane stack.
3. Components must reference the typography variables, not the raw `--font-*` names. Example: `.pbk-button { font-family: var(--typography-fontFamily-heading); line-height: 1.1; }` ensures headings, CTAs, and Polish diacritics all draw Space Grotesk instead of falling back to OS defaults.

## 23. Mobile Navigation

1. The primary navigation (`app/ui/PrimaryNav.tsx`) is a client component that drives one source of truth for links + search. On mobile it collapses into a burger button that opens a drawer; desktop keeps the inline nav and search form visible.
2. When adding links or search behavior, keep both desktop and drawer variants in sync—`SearchForm` now accepts `className`/`inputId` so the same component can render in each context without duplicated markup.
3. Any new header styles belong alongside the existing `.site-header__*` rules (mobile button, drawer, overlay). Drawer interactions must trap scroll (`body { overflow: hidden; }`) and close via Esc, overlay tap, or link selection so Lighthouse mobile checks stay green.

## 24. Markdown Rendering

1. `MarkdownRenderer` validates every link/image URL, blocking `javascript:` (or invalid schemes) and marking external URLs with `target="_blank"` + `rel="noopener noreferrer"`. Images default to `loading="lazy"`/`decoding="async"`.
2. Consumers can extend behavior through `MarkdownRendererOptions` (`components.CodeBlock`, `components.Image`, `components.Link`, and `headingLevelsForToc`). Use these overrides instead of forking the renderer when you need syntax highlighting or custom image/link wrappers.
3. The renderer now exposes `renderToc()` plus class names (`pbk-heading-*`, `pbk-paragraph`, `pbk-code-block`, `pbk-list-*`, etc.) so you can build consistent TOCs and theme markdown without touching the parser.
4. Callouts: write a blockquote starting with `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, or `> [!CAUTION]` to render a styled callout block (the marker is removed from output).
5. Footnotes include a ↩ back-link, and inline links default to the sanitized Next.js/anchor variants unless you supply your own `Link` component in the options.

## 25. Component Performance Guard

1. Next.js 16 + React 19 occasionally crash dev navigations with `Failed to execute 'measure' on 'Performance': '<Component>' cannot have a negative time stamp.` (seen on `/narzedzia/webflow`) and, under Turbopack, can throw `ReferenceError: Link is not defined` on server-rendered pages such as `/poradniki` or `/glossary`. Both stem from upstream instrumentation rather than our page code.
2. The fix lives in `app/ui/performance/PerformanceMeasureGuard.tsx`. It instantiates a `PerformanceMeasureSanitizer` class that overrides `performance.measure`, clamps invalid `{ start, end }` pairs, and quietly swallows the DOMException whenever the upstream profiler still passes inconsistent data.
3. `app/layout.tsx` must render `<PerformanceMeasureGuard />` before other UI so every client component benefits from the override. The guard no-ops in production builds to keep real metrics untouched; remove the component (and update this section) once the upstream bug is resolved in a future Next.js release.
4. Run dev with webpack instead of Turbopack (`npm run dev` passes `--webpack`) until the Link crash is fixed upstream; if you switch back to Turbopack, delete `.next/dev` to clear stale bundles first.

## 26. Front Matter Formatting

1. Run `npm run content:format` whenever you edit markdown. The script (`scripts/format-frontmatter.mjs`) walks every file under `content/`, parses the YAML front matter via `gray-matter`, and rewrites it with consistent indentation, canonical URLs, and a single trailing newline. Arrays such as `topics`, `summaryBullets`, `tags`, etc. are automatically nested under the correct parent (`meta`, `taxonomy`, ...).
2. `content:format` executes automatically as the first step of `npm run build` (via `prebuild`). If the formatter can’t parse a file (e.g., missing indentation or duplicated keys), it prints the offending path and exits with a non-zero status so the failure happens before Next.js starts building.
3. Follow up formatting with `npm run content:lint` to ensure our schema constraints still pass. Both commands are idempotent—rerunning them on a clean tree makes zero changes—so you can wire them into pre-commit hooks without side effects.
