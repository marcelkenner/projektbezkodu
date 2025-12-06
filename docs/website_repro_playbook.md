# ProjektBezKodu Technical Reproduction Playbook

Comprehensive checklist for spinning up a website that mirrors the ProjektBezKodu architecture. Follow each step in order; every command assumes you run `source ~/.nvm/nvm.sh &&` first.

## 1. Goals & Scope

1. Deliver a token-driven design system shared by code and content teams.
2. Serve marketing pages from a Next.js App Router project with reusable UI primitives.
3. Centralise copy and markdown content to allow non-dev edits.
4. Keep files under the 500-line ceiling and enforce SRP-friendly structure.

## 2. Prerequisites

1. Node.js 22 (managed with `nvm`), npm 10+.
2. Git repo initialised with an MIT-friendly licence.
3. Development tooling: VS Code (optional), EditorConfig support, Prettier, ESLint.
4. Local dependencies installed via `npm install`.
5. Codex CLI browser feature flag enabled: create the hidden file `~/.config/codex/config.toml` (note the `.config` parent folder is hidden on Unix systems) with
   ```
   [features]
   web_search_request = true
   ```
   so agents rely on `web_search_request` instead of the deprecated `tools.web_search`.

## 3. Project Bootstrap

1. Create Next.js app (App Router) with TypeScript: `npx create-next-app@latest --typescript`.
2. Remove unused starter files; keep `app/`, `public/`, `next.config.ts`.
3. Install Tailwind CSS v4: `npm install tailwindcss@latest @tailwindcss/postcss@latest`.
4. Add `@import "tailwindcss";` to `app/globals.css`.
5. Install `gray-matter` for markdown parsing.

## 4. Directory Layout

1. Create directories:
   - `brand/` (with subfolders `logo/`, `icons/`, `pwa/`, `tokens/`, `docs/`, `figma-exports/`).
   - `content/` (hierarchy: `artykuly`, `porownania`, `poradniki`, `glossary`, `polityka-prywatnosci`, `regulamin`, `szukaj`, etc.).
   - `data/copy/` for JSON copy sources.
   - `app/lib/` for helpers (`frontmatter.ts`, `content/`, `copy.ts`, `tools.ts`).
   - `app/ui/` for reusable components and `ui.css`.
   - `app/(marketing)/` and `app/(legal)/` segment folders.
2. Ensure every directory contains an `AGENTS.md` if governance requires it.

## 5. Design Tokens

1. Author `brand/tokens/tokens.json` following the colour/typography/spacing/radii/motion schema.
2. Add build script `brand/tokens/scripts/build.mjs` that flattens JSON into CSS and TS exports.
3. Update `package.json` scripts with `"tokens:build": "node brand/tokens/scripts/build.mjs"`.
4. Run `npm run tokens:build` whenever tokens change; commit `tokens.json`, `tokens.css`, `tokens.ts`.
5. Import tokens in `app/globals.css` (`@import "../brand/tokens/tokens.css";`).
6. Keep the spacing scale fluid: tokens `spacing.1` through `spacing.9` must match the mobile-first clamp scale (unit `u = 8px`) so every layout pulls from the shared rhythm.

## 6. Global Styling

1. Download `Inter-LatinExt-roman.woff2` and `SpaceGrotesk-LatinExt-500-700.woff2` (plus JetBrains Mono weights) into `public/fonts/` so all typography is self-hosted.
2. Define `inter`, `spaceGrotesk`, and `jetBrainsMono` via `next/font/local` in `app/ui/fonts.ts`, pointing at those `.woff2` files with `display: "swap"` and weight ranges `400 600` / `500 700`.
3. Reference these variables in `app/layout.tsx`, keep `<html lang="pl">`, and ensure the `<body>` class concatenates all typography variables.
4. Split readability helpers into `app/globals.readability.css` (houses `main[data-readable="true"]`, `.pbk-readable`, nav/button typography, helper text, and metric styles) so `app/globals.css` stays under 400 lines.
5. Wrap any text-heavy block (hero intros, disclaimers, summaries, marketing copy without cards) with `.pbk-readable` or add `data-readable="true"` on `<main>` so paragraphs inherit the 68 ch clamp automatically. When a readable block must stay left-aligned (e.g., listings like `/narzedzia` or `/szablony`), append the modifier `.pbk-readable--start` to drop the auto-centering margin while keeping the 68 ch measure.
6. Article detail pages use `.article-page__layout .prose` and clamp to 85 ch starting at the 64rem breakpoint; mobile stays fluid. Keep long-form guidance inside that class so we don’t have to tweak individual articles later.
7. Define `@theme inline { ... }` section inside `app/globals.css` mapping CSS variables to token values.
8. Add utility classes (`.pbk-container`, `.pbk-stack`, `.section`, `.section__grid`, `.pbk-inline-list`, `.prose`, etc.).
9. Keep each CSS utility descriptive and token-driven; no magic numbers.
10. Rebuild shared hero styles into a dedicated module (`app/(marketing)/homepage/section.css`) and ensure only hero-specific rules remain there.
11. Apply the blog spacing spec: `.prose` should use top-only margins, more space before headings than after, `max-width: 68ch`, and elevated spacing for blockquotes, code, figures, and callouts per the unit scale.

## 7. UI Component Library

1. Create UI primitives in `app/ui/` (Button, TextField, SelectField, Badge, Alert, Card, Stepper, PricingCard, ComparisonTable, Modal, Toast, PrimaryNav, Footer, FilterBar). All filter/search experiences across listings must wrap their inputs/actions with `FilterBar` so spacing, background, and responsive behavior stay identical on every page.
2. Use the unified `ContentFilterBar` (app/ui/filters/ContentFilterBar.tsx) for section filters (`/artykuly`, `/poradniki`, future `/narzedzia`, `/porownania`) to keep consistent layout and allow per-section variants via the `variant` prop.
3. Centralise exports via `app/ui/index.ts`.
4. Ensure each component imports `./ui.css`.
5. Preface complex logic with brief comments only when necessary.
6. Maintain component files <200 lines; split helpers if over.
7. Homepage composition lives in `HeroSection.tsx` and `HomepageSections.tsx` – reuse these instead of duplicating hero/social proof/newsletter logic.

## 8. Copy System

1. Populate `data/copy/*.json` for `global`, `homepage`, `articles`, `comparisons`, `tutorials`, `glossary`, `not-found`, `privacy`, `terms`, `search`, `footer`.
2. Implement `app/lib/copy.ts` to import JSON and expose `getCopy(section)`.
3. Keep JSON keys descriptive and align with view requirements (e.g., `hero`, `sections`, `emptyState`).
4. Document editing workflow in `docs/brand/content_voice.md`.

## 8.1 Content-only CTA Policy

1. ProjektBezKodu does not offer consulting, workshops, or implementation work—we only ship articles, checklists, templates, and the newsletter.
2. Every CTA must land on content or resources (e.g., `/artykuly/`, `/poradniki/`, `/szablony/`, `/newsletter/`). Phrases like “Book a consultation” or “Schedule a call” are not allowed.
3. When mentioning the contact page, describe it as an editorial feedback channel (“Pitch a topic”, “Submit a correction”), never as a sales form.
4. Case studies and landing pages must end with links to guides or content libraries—audit `data/copy/case-studies.json` and `content/przypadki-uzycia/**` to make sure the wording stays resource-focused.

## 9. Markdown Content Pipeline

1. Adopt frontmatter schema in `docs/brand/frontmatter_schema.md`.
2. Store markdown content under `content/**/index.md` with `draft` and `template` fields.
3. Implement `app/lib/frontmatter.ts` using `gray-matter`.
4. Build `app/lib/content/repositories.ts` with abstract `MarkdownRepository` and concrete repositories for articles, comparisons, tutorials, glossary.
5. Provide `MarkdownPageLoader` helper for singleton pages (privacy, terms).
6. Implement `app/ui/MarkdownRenderer.tsx` with the Unified pipeline (`unified`, `remark-parse`, `remark-gfm`, `unist-util-visit`) and keep it server-only—instantiate it inside server components or view models, and never barrel-export the Markdown UI from `app/ui/index.ts` so those parsing dependencies stay out of client bundles.
7. Handle everything else with the generic pipeline:
   - `ContentRepository` now crawls nested `content/**/index.md`, excluding `_examples` and `glossary`.
   - `ContentLibrary` normalises routes (prefers `frontmatter.path`, falls back to folder structure) and exposes `{ path, segments, document }` tuples.
   - `ContentPageCoordinator` + `ContentPageViewModel` pair injects `MarkdownRenderer` output and SEO metadata for any arbitrary markdown page.
   - Catch-all route `app/(marketing)/(content)/[...segments]/page.tsx` renders those entries with mobile-first typography; existing bespoke routes keep priority automatically.
8. Store all content-specific media under `public/media/`, mirroring the markdown path. Example: `content/narzedzia/webflow/recenzja/index.md` → `public/media/narzedzia/webflow/recenzja/hero.webp`. React-only pages follow the same rule under `public/media/pages/{app subpath}/`. Reference assets as `/media/...` so CDN caching works consistently.
9. Run `npm run content:lint` (automatically executed before `npm run build`) to validate every markdown file with `gray-matter`. Fix YAML errors before committing so the global content crawl never fails.
10. Define article taxonomy (categories, tags) in `data/copy/articles.json` and reference those slugs from markdown `taxonomy` blocks; resolve labels via `ArticleTaxonomyCatalog`.
11. `/artykuly` aggregates every markdown entry with `template: "article"` (and `draft: false`) regardless of which folder it lives in. Keep `template` and `path` accurate because the listing page, breadcrumbs, and sitemap depend on them.
12. Narzędzia hero images: every markdown with `path` starting `/narzedzia/` must set `hero.image.src` to `/img/article_image.jpeg` (alt: “Abstrakcyjna wizualizacja danych i dashboardów na tle jeziora`). `npm run format`now enforces this automatically; you can also run`node scripts/set-narzedzia-hero-image.mjs` manually.
13. Default hero fallbacks: `/artykuly` → `/img/articles_hero_image.webp`, `/poradniki` → `/img/tutorials_hero_image.webp.webp`, `/porownania` → `/img/comparisons_hero_image.webp.jpeg`, `/szablony` → `/img/templates_hero_image.webp.webp` (wired via `heroImageResolver.defaultHeroImage`). Use these assets when front matter lacks an explicit hero.
14. Narzędzia hero copy: ensure `hero.heading` and `hero.subheading` are present for all `/narzedzia/` entries. `npm run format` now runs `node scripts/fix-narzedzia-hero-heading.mjs` before Prettier to backfill missing values without touching other fields; use the script directly when needed.
15. Homepage metadata: `app/(marketing)/page.tsx` reads front matter from `content/_examples/homepage.md` (draft). Keep its SEO fields and hero copy current even though the body is not rendered.
16. Consistent hero copy for /artykuly, /poradniki, /porownania, /szablony: `npm run format` also runs `node scripts/fix-section-hero-headings.mjs` to backfill missing `hero.heading` and `hero.subheading` for those sections using title-based defaults.
17. Artykuły folder routing: articles now live under `content/artykuly/<kategoria>/<subkategoria>/index.md`. `npm run format` runs `node scripts/fix-artykuly-paths.mjs` to align `path` and `slug` with that folder structure (ensures `/artykuly/.../`) while preserving other front matter.

## 10. Routing & Pages

1. Wrap marketing routes with `app/(marketing)/layout.tsx`, injecting `PrimaryNav` and `Footer`.
2. Main navigation and the search bar read from `homepage.header`—preserve the link order (Articles → Tutorials → Comparisons → Tools → Templates → Contact). Keep reusing CTAs/microcopy from `getCopy("global")` where it fits, and leave any extra links (newsletter, resources, etc.) to the footer or page body.
3. Create listing pages:
   - Articles (`app/(marketing)/(content)/artykuly/page.tsx`) pulling summaries from `ArticleRepository`.
   - Tutorials (`app/(marketing)/(content)/poradniki/page.tsx`) using `TutorialDirectory` filters (tool + difficulty via query params).
   - Glossary (`app/(marketing)/(content)/glossary/page.tsx`) grouped alfabetycznie with anchors generated by `GlossaryDirectory`.
   - Comparisons (`app/(marketing)/(content)/porownania/page.tsx`) and search (`app/(marketing)/(content)/szukaj/page.tsx`) backed by `ContentSearchEngine`.
4. Wire featured article categories into navigation/footer following `docs/brand/article_taxonomy_navigation.md`.
5. Render the “tool of the week” as a persistent toast (`ToolOfWeekToast`) sourced from `data/tools.json`, with the active slug defined in `data/tool-of-week.json`.
6. Create dynamic detail routes `[slug]/page.tsx` for each content type with:
   - `generateStaticParams` returning slugs.
   - `generateMetadata` reading frontmatter.
   - Render body with `MarkdownRenderer`.
   - Tool detail pages (`app/(marketing)/(content)/narzedzia/[slug]/page.tsx`) pull absolutely everything (copy, badges, CTAs, share data, schema) from the markdown entry under `content/narzedzia/{slug}/index.md`. Do not inject supplemental copy from `data/catalog/tools.json` or any other source—if a scenario or pricing section is needed, keep it in markdown/front matter.
   - Tutorial detail pages (`/poradniki/[slug]`) must reuse the shared article layout (`article-page__layout` + `ArticleSharePanel`) used on `/narzedzia` so spacing, TOC placement, and CTAs stay consistent; keep any download/TOC blocks inside that sidebar column.
   - Templates (`/szablony/[slug]`) and comparisons (`/porownania/[slug]`) also inherit this article layout; place summary bullets + CTA group above the body, and render body content inside `article-page__layout` so all detail pages feel identical.
   - Every content detail page ends with the shared `AuthorCard` for Marcel Kenner (Business/System Analyst, 5+ years experience). Use avatar `/img/authors/marcel_kenner_image.webp` and link to `https://www.linkedin.com/in/marcel-kenner/`.
   - Article detail pages must render the share module (`ArticleSharePanel.tsx`) directly under the header. The component lives at `app/ui/articles/ArticleSharePanel.tsx`, ships with its own `ArticleSharePanel.module.css`, and is exported via `@/app/ui` so every route uses the same implementation with consistent mobile-first styling. The panel uses Phosphor icons and lists LinkedIn, Facebook, X (Twitter), Reddit, and WhatsApp in a single mobile-first row. Always derive URLs from `defaultSiteUrlFactory` instead of hard-coding domains.
   - `generateMetadata` on content routes must output full Open Graph/Twitter data (title, description, `publishedTime`, `modifiedTime`, share image). When `seo.image` is missing, fall back to `meta.heroImage*` or the hero asset, then build an absolute URL via `SiteUrlFactory`.
   - Inject JSON-LD exclusively through `StructuredDataScript` and the builders under `app/lib/seo/**`. Articles and comparisons use `ArticleStructuredDataBuilder`; templates (`/szablony/[slug]`) combine the Product/FAQ/HowTo builders; resources (`/zasoby/[slug]`) lean on `ResourceStructuredDataBuilder`; tool guides (`/narzedzia/[slug]`) publish `SoftwareApplication` schema via `SoftwareApplicationStructuredDataBuilder`; tutorial detail pages (`/poradniki/[slug]`) emit a HowTo plus optional FAQ payload discovered in markdown; listing pages (articles, tools, resources) expose `ItemList` collections; and any front matter `meta.review` gets wired into `ReviewStructuredDataBuilder`. Never hand-write JSON-LD inside components.
7. Point legal pages to markdown via `MarkdownPageLoader`.
8. Keep `not-found.tsx` using copy helper.
9. Generic fallback route: `/app/(marketing)/(content)/[...segments]/page.tsx`:
   - Uses `ContentPageCoordinator` to locate any markdown path under `content/**`.
   - Uses `frontmatter.path` when provided; otherwise derives `/folder/subfolder/` from directory structure, then rewrites the last segment to a slugified `frontmatter.title` so every content URL ends with the page title.
   - Applies `ContentPageViewModel` metadata so SEO + OG tags inherit from frontmatter.
   - Excludes `_examples` and `glossary` (handled elsewhere) to avoid duplicate flows.
10. Every markdown-driven route renders clickable breadcrumbs via `BreadcrumbComposer` + `Breadcrumbs`; never surface raw `viewModel.getPath()` strings because editors rely on those links to jump between listing pages and detail screens.

## 11. Content Management Workflow

1. Treat markdown and copy JSON as the source of truth; no hard-coded strings.
2. Mark `draft: false` when ready for production; repository filters automatically hide drafts.
3. Encourage content editors to work through PRs touching only `content/` and `data/copy/`.
4. Share the editor playbook (`docs/content_editor_playbook.md`) with the content team; keep it updated alongside this document.
5. Keep the tool-of-the-week assets current (`data/tools.json`, `data/tool-of-week.json`, and supporting imagery under `public/images/tools/`).
6. Track operational follow-ups (legal, audits, assets) under `docs/operations/`.

## 12. QA & Tooling

1. Lint: `npm run lint`.
2. Build: `npm run build`; fix type errors promptly.
3. Tokens: `npm run tokens:build` to sync CSS/TS artefacts.
4. Manual checks:
   - Responsive layout at 360/768/1024/1440.
   - Accessibility contrast (AXE/Stark).
   - Keyboard navigation path.
5. Plan for automated visual regression in future (Chromatic/Playwright).

## 13. Deployment Checklist

1. Ensure `.env.local` derived from production settings (copy `.env.production`).
2. Verify design tokens committed.
3. Update `brand/CHANGELOG.md` with notable changes.
4. XML sitemap (`app/sitemap.ts`) and HTML map (`/mapa-strony/`) read from `SitemapComposer`; extend this builder when introducing new sections so feeds stay accurate.

## 14. Cookie Consent Workflow

1. `app/layout.tsx` must always render `<KlaroConsentManager />` together with a `<div id="klaro">` mount node so Klaro’s UI can attach even on statically cached routes such as `/cookies`.
2. `app/ui/KlaroConsentManager.tsx` exposes a global `window.__klaroReady` promise and fires a `klaro:ready` event once `window.klaro.getManager()` is available; any UI that needs to read or mutate consent (e.g., `CookiePreferencesForm`) must wait for that signal before enabling controls.
3. Cookie preference forms keep toggles/buttons disabled until the Klaro manager resolves and surface the fallback status copy when `window.__klaroReady` rejects, ensuring the page never looks interactive while the CMP is still loading (or blocked by the browser).

## 14. Adaptation Guidelines

1. For each new brand, fork tokens (`brand/tokens/`), copy JSON, and update copy values.
2. Replicate markdown structure with new content; run through repositories to confirm slug/path.
3. Update navigation/footer copy to reflect brand sections.
4. Document brand-specific nuances in `docs/brand/<brand>-notes.md`.

## 15. Go-Live Signoff

1. Confirm open tasks in `docs/brand/basic_pages_plan.md` and `docs/brand_design_system_plan.md` are addressed or ticketed.
2. Record remaining action items in `docs/next_steps.md`.
3. Seek sign-off from design, content, and stakeholder leads before deployment.

## 16. Homepage Blueprint

1. Implement skip link + header search via `app/(marketing)/layout.tsx` and `PrimaryNav` (search action `/szukaj/`, 44px controls).
2. Hero (`HeroSection.tsx`): headline, supporting copy, dual CTA (Webflow + plan) with microcopy disclosure, responsive hero image (`/img/hero-3x2*.webp`).
3. Social proof (`HomepageSections`): `data/copy/homepage.json.socialProof` drives logo strip; assets in `public/images/logos/`.
4. Pillars, workflow, latest articles, newsletter all render through `HomepageSections` using repository data + copy JSON; keep responsibilities isolated per component.
5. The footer (`Footer.tsx`) sticks with the dark theme and four columns: (a) “Navigation” linking to Articles/Tutorials/Comparisons/Tools/Templates/Resources, (b) “Categories” auto-filled from `articles.navigation.featuredCategories`, (c) “Conversions & Support” with the newsletter, downloadable resources, FAQ, Contact, Sitemap, and every legal link, and (d) Social media. Do not add a fifth column—CTAs belong in the page content.

## 17. Blog & Content Pages

1. Blog listing (`/artykuly`): reuse `ArticlesFilterBar.tsx`, `ArticleCard.tsx`, and `ArticlesPagination.tsx`, and embed the CollectionPage/ItemList JSON-LD.
2. Article (`/artykuly/[slug]`): show breadcrumbs, meta (reading time, publish, update, author), the affiliate disclosure, sticky TOC, “Next step” CTA block, author card, and related articles.
3. Category hub (`/kategoria/[slug]`): drive content from `data/copy/category-hubs.json`, include quick links, featured cards, optional download CTA, and the icon-enhanced article list.
4. 404 page: `NotFoundPageViewModel` mixes copy from `data/copy/not-found.json` (hero, CTA, search, `shortcuts[]`, `suggestions.*`). The suggestions block automatically pulls the 3 latest articles via `ArticleRepository`, and metadata enforces `robots=noindex` plus the SEO notice from `copy.seo`.
5. Legal pages: pair `app/(legal)/legal.css` with `MarkdownPageLoader`; render `<time>` for the last update, keep the contact block, and preserve the GDPR table plus definitions.

## 18. Utility & Support Pages

1. Resources (`/zasoby`, `/zasoby/[slug]`): rely on `ResourceRepository` + `ResourceDirectory` with format/topic/time filters; detail pages use the `resource-detail` layout with file metadata and a download CTA.
2. Affiliate policy (`/zasady-afiliacji`) and accessibility statement (`/deklaracja-dostepnosci`): content lives in `data/copy/affiliate.json` and `data/copy/accessibility.json`; each page includes its own contact card/form snippet.
3. Offline fallback (`/offline`): client-side `RefreshButton` triggers `window.location.reload`, and the cached-page list pulls from `data/copy/offline.json`.
4. HTTP status pages (`/410`, `/451`, `/503`): share the `StatusPage` component with copy in `system-status.json`; remember to keep `retryTime` accurate for 503 responses.
5. Case studies (`/przypadki-uzycia/[slug]`): powered by `CaseStudyRepository` with sections for metrics, stack, and lessons, plus CTAs sourced from `case-studies.json`.

## 19. Contact Page (Mailto)

1. The form has been replaced with a static “contact instructions” block—all inquiries should go straight to `kontakt@projektbezkodu.pl`.
2. The copy lives in `data/copy/contact.json.notice` (body text, button label, email). Make changes in JSON, not in the component.
3. `app/(marketing)/kontakt/page.tsx` renders the `mailto:` button and text block; do not reintroduce a form without stakeholder approval.
4. `/kontakt/dziekujemy` exists only as a legacy fallback (informing users the form was removed); never link to it elsewhere.

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
4. Footnotes include a ↩ back-link, and inline links default to the sanitized Next.js/anchor variants unless you supply your own `Link` component in the options. Wrap markdown content via the exported `Markdown` component to memoize parsing per source string.

## 25. Component Performance Guard

1. Next.js 16 + React 19 occasionally crash dev navigations with `Failed to execute 'measure' on 'Performance': '<Component>' cannot have a negative time stamp.` (seen on `/narzedzia/webflow`). The issue comes from upstream component-performance instrumentation rather than our page code.
2. The fix lives in `app/ui/performance/PerformanceMeasureGuard.tsx`. It instantiates a `PerformanceMeasureSanitizer` class that overrides `performance.measure`, clamps invalid `{ start, end }` pairs, and quietly swallows the DOMException whenever the upstream profiler still passes inconsistent data.
3. `app/layout.tsx` must render `<PerformanceMeasureGuard />` before other UI so every client component benefits from the override. The guard no-ops in production builds to keep real metrics untouched; remove the component (and update this section) once the upstream bug is resolved in a future Next.js release.

## 26. Front Matter Formatting

1. Run `npm run content:format` whenever you edit markdown. The script (`scripts/format-frontmatter.mjs`) walks every file under `content/`, parses the YAML front matter via `gray-matter`, and rewrites it with consistent indentation, canonical URLs, and a single trailing newline. Arrays such as `topics`, `summaryBullets`, `tags`, etc. are automatically nested under the correct parent (`meta`, `taxonomy`, ...).
2. `content:format` executes automatically as the first step of `npm run build` (via `prebuild`). If the formatter can’t parse a file (e.g., missing indentation or duplicated keys), it prints the offending path and exits with a non-zero status so the failure happens before Next.js starts building.
3. Follow up formatting with `npm run content:lint` to ensure our schema constraints still pass. Both commands are idempotent—rerunning them on a clean tree makes zero changes—so you can wire them into pre-commit hooks without side effects.
