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
   - `content/` (hierarchy: `artykuly`—including `polityka-prywatnosci` and `regulamin`—plus `porownania`, `poradniki`, `glossary`, `szukaj`, etc.).
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
3. Article listings (homepage, /artykuly, /poradniki, /porownania, /narzedzia, tag/autor/thank-you pages) must render cards via the shared `ArticleCard` + `ArticleGrid` in `app/ui/articles/ArticleCard.tsx`; do not reintroduce per-page card styles.
4. Centralise exports via `app/ui/index.ts`.
5. Ensure each component imports `./ui.css`.
6. Preface complex logic with brief comments only when necessary.
7. Maintain component files <200 lines; split helpers if over.
8. Homepage composition lives in `HeroSection.tsx` and `HomepageSections.tsx` – reuse these instead of duplicating hero/social proof/newsletter logic.

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
   - Authoring feature: callouts are supported via blockquotes starting with `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, or `> [!CAUTION]` (marker removed from output).
7. Handle everything else with the generic pipeline:
   - `ContentRepository` now crawls nested `content/**/index.md`, excluding `_examples` and `glossary`.
   - `ContentLibrary` normalises routes (prefers `frontmatter.path`, falls back to folder structure) and exposes `{ path, segments, document }` tuples.
   - `ContentPageCoordinator` + `ContentPageViewModel` pair injects `MarkdownRenderer` output and SEO metadata for any arbitrary markdown page.
   - Catch-all route `app/(marketing)/(content)/[...segments]/page.tsx` renders those entries with mobile-first typography; existing bespoke routes keep priority automatically.
8. Store all content-specific media under `public/media/`, mirroring the markdown path. Example: `content/narzedzia/webflow/recenzja/index.md` → `public/media/narzedzia/webflow/recenzja/hero.webp`. React-only pages follow the same rule under `public/media/pages/{app subpath}/`. Reference assets as `/media/...` so CDN caching works consistently.
9. Run `npm run content:lint` (automatically executed before `npm run build`) to validate every markdown file with `gray-matter`. Fix YAML errors before committing so the global content crawl never fails.
   - The linter also checks for **derived route path collisions** (two markdown files resolving to the same URL) and fails the build when detected. Make titles/paths unique (or run `npm run format` to regenerate missing paths).
   - `meta.summaryBullets` + `meta.primaryCta` warnings are only evaluated for marketing templates (`article`, `tutorial`, `comparison`, `resource`, `template`). Hub pages and legal templates are excluded.
   - Run `npm run content:hero:check` to verify that **resolved** hero images (hero/meta fallback logic) exist under `public/` and don’t use remote URLs (Next Image will fail without `images.remotePatterns`).
10. Article categories are discovered from `content/artykuly/*/index.md` (directory name = slug, draft allowed); `data/copy/articles.json` only overrides labels/see-all copy and still defines tags for taxonomy chips.
11. `/artykuly` aggregates every markdown entry with `template: "article"` (and `draft: false`) regardless of which folder it lives in. Keep `template` and `path` accurate because the listing page, breadcrumbs, and sitemap depend on them.
12. Article hubs live under `/artykuly/<kategoria>/` and `/artykuly/<kategoria>/<podkategoria>/`: these pages **do not render markdown bodies**. They render:
   - Subcategory links discovered from directory structure.
   - An `ArticleGrid` of published articles whose `path` starts with that prefix.
13. `/kategoria/<slug>/` is a legacy alias that permanently redirects to `/artykuly/<slug>/` (aliases supported, e.g. `/kategoria/cms/` → `/artykuly/cms-bez-kodu/`).
14. `/artykuly/<slug>/` dispatches:
   - Hub listing when `<slug>` matches a hub directory (aliases supported, e.g. `/artykuly/cms/` → `/artykuly/cms-bez-kodu/` canonical).
   - Article detail when `<slug>` matches an article slug.
15. Narzędzia hero images: every markdown with `path` starting `/narzedzia/` may intentionally set `hero.image.src` to `/img/article_image.jpeg` (alt: “Abstrakcyjna wizualizacja danych i dashboardów na tle jeziora`) as a placeholder; the UI treats this value as “broken” and falls back to `/img/tools_hero_image.webp` unless you provide a real image via `meta.heroImageSrc`. `npm run format` now enforces this automatically; you can also run `node scripts/set-narzedzia-hero-image.mjs` manually.
16. Default hero fallbacks: `/artykuly` → `/img/articles_hero_image.webp`, `/poradniki` → `/img/tutorials_hero_image.webp`, `/porownania` → `/img/comparisons_hero_image.webp`, `/szablony` → `/img/templates_hero_image.webp`, `/narzedzia` → `/img/tools_hero_image.webp` (wired via `heroImageResolver.defaultHeroImage`). Use these assets when front matter lacks an explicit hero.
16. Narzędzia hero copy: ensure `hero.heading` and `hero.subheading` are present for all `/narzedzia/` entries. `npm run format` now runs `node scripts/fix-narzedzia-hero-heading.mjs` before Prettier to backfill missing values without touching other fields; use the script directly when needed.
17. Homepage metadata: `app/(marketing)/page.tsx` reads front matter from `content/_examples/homepage.md` (draft). Keep its SEO fields and hero copy current even though the body is not rendered.
18. Consistent hero copy for /artykuly, /poradniki, /porownania, /szablony: `npm run format` also runs `node scripts/fix-section-hero-headings.mjs` to backfill missing `hero.heading` and `hero.subheading` for those sections using title-based defaults.
19. Artykuły routing: you can store multiple markdown pages under `content/artykuly/**` (including multiple `index.md` files at different depths). `npm run format` runs `node scripts/fix-artykuly-paths.mjs` to backfill missing `slug`/`title`, and (only when `path` is missing) derive `/artykuly/.../` URLs using the page title as the final segment. Category index pages at `content/artykuly/<kategoria>/index.md` keep `path: /artykuly/<kategoria>/`.

## 10. Routing & Pages

1. Wrap marketing routes with `app/(marketing)/layout.tsx`, injecting `PrimaryNav` and `Footer`.
2. Main navigation and the search bar read from `homepage.header`—preserve the link order (Articles → Tutorials → Comparisons → Tools → Templates → Contact). Keep reusing CTAs/microcopy from `getCopy("global")` where it fits, and leave any extra links (newsletter, resources, etc.) to the footer or page body.
3. Create listing pages:
   - Articles (`app/(marketing)/(content)/artykuly/page.tsx`) pulling summaries from `ArticleRepository`.
   - Tutorials (`app/(marketing)/(content)/poradniki/page.tsx`) using `TutorialDirectory` filters (tool + difficulty via query params).
   - Glossary (`app/(marketing)/(content)/glossary/page.tsx`) grouped alfabetycznie with anchors generated by `GlossaryDirectory`.
   - Comparisons (`app/(marketing)/(content)/porownania/page.tsx`) and search (`app/(marketing)/(content)/szukaj/page.tsx`) backed by `ContentSearchEngine`.
4. Wire featured article categories into navigation (copy-driven); the footer auto-lists every category found under `content/artykuly` and lays them out in a two-row grid.
5. Render the “tool of the week” as a persistent toast (`ToolOfWeekToast`) sourced from `data/tools.json`, with the active slug defined in `data/tool-of-week.json`.
6. Create dynamic detail routes `[slug]/page.tsx` for each content type with:
	   - `generateStaticParams` returning slugs.
	   - `generateMetadata` reading frontmatter.
	   - Render body with `MarkdownRenderer`.
	   - Tool pages (`app/(marketing)/(content)/narzedzia/[slug]/page.tsx`) are category listings only. They use `content/narzedzia-no-code/{slug}/glowny/index.md` for route existence + metadata, but the UI intentionally renders *only* an `ArticleGrid` of pages under `/narzedzia/{slug}/...` (including `/narzedzia/{slug}/glowny/`). No hero, no share panel, no summary bullets, no CTAs.
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
	   - Treats `content/**/glowny/index.md` as the parent route when deriving paths (so tool landing pages can live in `glowny/` without changing the URL), while also exposing an explicit alias route at `/<parent>/glowny/` for reading the main guide content.
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
	7. Tool content convention: store tool metadata + main guide content at `content/narzedzia-no-code/<tool>/glowny/index.md` and every tool-specific article under `content/narzedzia-no-code/<tool>/**/index.md` (any depth). The `/narzedzia/<tool>/` page renders only the recursive `ArticleGrid`, while the main guide is readable at `/narzedzia/<tool>/glowny/`.

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
5. Railway blocks deploys on vulnerable dependencies; keep `next` and `eslint-config-next` on a patched `16.0.x` release and commit the updated `package-lock.json` after upgrades.

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
2. Article detail (`/artykuly/**` matching an article `path`): show breadcrumbs, meta (reading time, publish, update, author), the affiliate disclosure, sticky TOC, “Next step” CTA block, author card, and related articles.
3. Article hub (`/artykuly/<kategoria>/` + deeper subcategories): render **only** subcategory links + an `ArticleGrid` of published articles under that prefix (no markdown body). `/kategoria/<slug>/` is a legacy redirect to the matching hub.
4. 404 page: `NotFoundPageViewModel` mixes copy from `data/copy/not-found.json` (hero, CTA, search, `shortcuts[]`, `suggestions.*`). The suggestions block automatically pulls the 3 latest articles via `ArticleRepository`, and metadata enforces `robots=noindex` plus the SEO notice from `copy.seo`.
5. Legal pages: pair `app/(legal)/legal.css` with `MarkdownPageLoader`; render `<time>` for the last update, keep the contact block, and preserve the GDPR table plus definitions.

## 18. Utility & Support Pages

1. Resources (`/zasoby`, `/zasoby/[slug]`): rely on `ResourceRepository` + `ResourceDirectory` with format/topic/time filters; detail pages use the `resource-detail` layout with file metadata and a download CTA.
2. Affiliate policy (`/zasady-afiliacji`) and accessibility statement (`/deklaracja-dostepnosci`): content lives in `data/copy/affiliate.json` and `data/copy/accessibility.json`; each page includes its own contact card/form snippet.
3. Offline fallback (`/offline`): client-side `RefreshButton` triggers `window.location.reload`, and the cached-page list pulls from `data/copy/offline.json`.
   - Service worker cache (`public/sw.js`) must avoid caching non-OK responses (prevents “stuck” broken images) and should not cache `/_next/image` variants.
4. HTTP status pages (`/410`, `/451`, `/503`): share the `StatusPage` component with copy in `system-status.json`; remember to keep `retryTime` accurate for 503 responses.
5. Case studies (`/przypadki-uzycia/[slug]`): powered by `CaseStudyRepository` with sections for metrics, stack, and lessons, plus CTAs sourced from `case-studies.json`.

## 19. Contact Page (Mailto)

1. The form has been replaced with a static “contact instructions” block—all inquiries should go straight to `kontakt@projektbezkodu.pl`.
2. The copy lives in `data/copy/contact.json.notice` (body text, button label, email). Make changes in JSON, not in the component.
3. `app/(marketing)/kontakt/page.tsx` renders the `mailto:` button and text block; do not reintroduce a form without stakeholder approval.
4. `/kontakt/dziekujemy` exists only as a legacy fallback (informing users the form was removed); never link to it elsewhere.


## 20. Advanced Playbooks

See `docs/website_repro_playbook_advanced.md` for:
- Newsletter + Listmonk
- Tool hub & lead magnets
- Font variables
- Mobile navigation
- Markdown rendering
- Component performance guard
- Front matter formatting
