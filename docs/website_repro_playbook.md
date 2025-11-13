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

1. Download required `.woff2` font weights (Manrope, Inter, JetBrains Mono) via `@fontsource` or other licensing-compliant source and place them under `public/fonts/`.
2. Define local fonts with `next/font/local` in `app/ui/fonts.ts`, exporting body, heading, and mono variants aligned to token families.
3. Reference these variables in `app/layout.tsx` to self-host fonts for offline-friendly builds.
4. Define `@theme inline { ... }` section inside `app/globals.css` mapping CSS variables to token values.
5. Add utility classes (`.pbk-container`, `.pbk-stack`, `.section`, `.section__grid`, `.pbk-inline-list`, `.prose`, etc.).
6. Keep each CSS utility descriptive and token-driven; no magic numbers.
7. Rebuild shared hero styles into a dedicated module (`app/(marketing)/homepage/section.css`) and ensure only hero-specific rules remain there.
8. Apply the blog spacing spec: `.prose` should use top-only margins, more space before headings than after, `max-width: 72ch`, and elevated spacing for blockquotes, code, figures, and callouts per the unit scale.

## 7. UI Component Library

1. Create UI primitives in `app/ui/` (Button, TextField, SelectField, Badge, Alert, Card, Stepper, PricingCard, ComparisonTable, Modal, Toast, PrimaryNav, Footer).
2. Centralise exports via `app/ui/index.ts`.
3. Ensure each component imports `./ui.css`.
4. Preface complex logic with brief comments only when necessary.
5. Maintain component files <200 lines; split helpers if over.
6. Homepage composition lives in `HeroSection.tsx` and `HomepageSections.tsx` – reuse these instead of duplicating hero/social proof/newsletter logic.

## 8. Copy System

1. Populate `data/copy/*.json` for `global`, `homepage`, `articles`, `comparisons`, `tutorials`, `glossary`, `not-found`, `privacy`, `terms`, `search`, `footer`.
2. Implement `app/lib/copy.ts` to import JSON and expose `getCopy(section)`.
3. Keep JSON keys descriptive and align with view requirements (e.g., `hero`, `sections`, `emptyState`).
4. Document editing workflow in `docs/brand/content_voice.md`.

## 8.1 Content-only CTA Policy

1. ProjektBezKodu nie oferuje konsultacji, warsztatów ani prac wdrożeniowych – publikujemy wyłącznie artykuły, checklisty, szablony i newsletter.
2. Wszystkie CTA muszą kierować do treści lub zasobów (np. `/artykuly/`, `/poradniki/`, `/szablony/`, `/newsletter/`). Niedozwolone są wezwania typu „Umów konsultację”.
3. Jeśli cytujesz stronę kontaktową, opisuj ją jako kanał pytań redakcyjnych („Zaproponuj temat”, „Wyślij poprawkę”), nigdy jako formularz sprzedażowy.
4. Case studies i landing pages muszą kończyć się odnośnikami do przewodników lub bibliotek treści – sprawdzaj `data/copy/case-studies.json` i `content/przypadki-uzycia/**` pod kątem języka usług.

## 9. Markdown Content Pipeline

1. Adopt frontmatter schema in `docs/brand/frontmatter_schema.md`.
2. Store markdown content under `content/**/index.md` with `draft` and `template` fields.
3. Implement `app/lib/frontmatter.ts` using `gray-matter`.
4. Build `app/lib/content/repositories.ts` with abstract `MarkdownRepository` and concrete repositories for articles, comparisons, tutorials, glossary.
5. Provide `MarkdownPageLoader` helper for singleton pages (privacy, terms).
6. Implement `app/ui/MarkdownRenderer.tsx` to render headings, lists, blockquotes, inline emphasis without external libraries.
7. Handle everything else with the generic pipeline:
   - `ContentRepository` now crawls nested `content/**/index.md`, excluding `_examples` and `glossary`.
   - `ContentLibrary` normalises routes (prefers `frontmatter.path`, falls back to folder structure) and exposes `{ path, segments, document }` tuples.
   - `ContentPageCoordinator` + `ContentPageViewModel` pair injects `MarkdownRenderer` output and SEO metadata for any arbitrary markdown page.
   - Catch-all route `app/(marketing)/(content)/[...segments]/page.tsx` renders those entries with mobile-first typography; existing bespoke routes keep priority automatically.
8. Run `npm run content:lint` (automatically executed before `npm run build`) to validate every markdown file with `gray-matter`. Fix YAML errors before committing so the global content crawl never fails.
9. Define article taxonomy (categories, tags) in `data/copy/articles.json` and reference those slugs from markdown `taxonomy` blocks; resolve labels via `ArticleTaxonomyCatalog`.

## 10. Routing & Pages

1. Wrap marketing routes with `app/(marketing)/layout.tsx`, injecting `PrimaryNav` and `Footer`.
2. Configure navigation CTA copy via `getCopy("global")`.
3. Create listing pages:
   - Articles (`app/(marketing)/(content)/artykuly/page.tsx`) pulling summaries from `ArticleRepository`.
   - Tutorials (`app/(marketing)/(content)/poradniki/page.tsx`) using `TutorialDirectory` filters (tool + difficulty via query params).
   - Glossary (`app/(marketing)/(content)/glossary/page.tsx`) grouped alfabetycznie with anchors generated by `GlossaryDirectory`.
   - Comparisons (`app/(marketing)/(content)/porownania/page.tsx`) and search (`app/(marketing)/(content)/szukaj/page.tsx`) backed by `ContentSearchEngine`.
4. Wire featured article categories into navigation/footer following `docs/brand/article_taxonomy_navigation.md`.
5. Render „narzędzie tygodnia” jako stały toast (`ToolOfWeekToast`) – dane z `data/tools.json`, aktywny slug w `data/tool-of-week.json`.
6. Create dynamic detail routes `[slug]/page.tsx` for each content type with:
   - `generateStaticParams` returning slugs.
   - `generateMetadata` reading frontmatter.
   - Render body with `MarkdownRenderer`.
7. Point legal pages to markdown via `MarkdownPageLoader`.
8. Keep `not-found.tsx` using copy helper.
9. Generic fallback route: `/app/(marketing)/(content)/[...segments]/page.tsx`:
   - Uses `ContentPageCoordinator` to locate any markdown path under `content/**`.
   - Uses `frontmatter.path` when provided; otherwise derives `/folder/subfolder/` from directory structure.
   - Applies `ContentPageViewModel` metadata so SEO + OG tags inherit from frontmatter.
   - Excludes `_examples` and `glossary` (handled elsewhere) to avoid duplicate flows.

## 11. Content Management Workflow

1. Treat markdown and copy JSON as the source of truth; no hard-coded strings.
2. Mark `draft: false` when ready for production; repository filters automatically hide drafts.
3. Encourage content editors to work through PRs touching only `content/` and `data/copy/`.
4. Share the editor playbook (`docs/content_editor_playbook.md`) with the content team; keep it updated alongside this document.
5. Utrzymuj dane narzędzia tygodnia (`data/tools.json`, `data/tool-of-week.json`, grafiki w `public/images/tools/`).
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
5. Footer uses dark theme (`Footer.tsx`), four columns + microcopy, mirroring the ASCII brief in `docs/asci-designs/homepage.md`.

## 17. Blog & Content Pages

1. Blog listing (`/artykuly`): użyj `ArticlesFilterBar.tsx`, `ArticleCard.tsx`, `ArticlesPagination.tsx` oraz JSON-LD CollectionPage/ItemList.
2. Artykuł (`/artykuly/[slug]`): breadcrumbs, meta (czas, publikacja, aktualizacja, autor), disclosure afiliacyjny, sticky TOC, sekcja „Następny krok”, box autora i powiązane artykuły.
3. Kategoria (`/kategoria/[slug]`): konfiguracja w `data/copy/category-hubs.json`, skróty, featured cards, sekcja download i lista artykułów z ikoną.
4. Strona 404: ikona ostrzegawcza, CTA primary/secondary, formularz wyszukiwania i skróty kontekstowe (`not-found.tsx`).
5. Legal: `app/(legal)/legal.css` + `MarkdownPageLoader` – pokaż `<time>` z aktualizacją, blok kontaktowy, zachowaj tabelę RODO i definicje.

## 18. Utility & Support Pages

1. Zasoby (`/zasoby`, `/zasoby/[slug]`): `ResourceRepository` + `ResourceDirectory` z filtrami format/temat/czas; szczegóły renderowane przez `resource-detail` z kartą pliku i CTA download.
2. Zasady afiliacji (`/zasady-afiliacji`) i Deklaracja dostępności (`/deklaracja-dostepnosci`): copy w `data/copy/affiliate.json` i `data/copy/accessibility.json`; każde ma dedykowaną kartę kontaktową/formularz.
3. Offline fallback (`/offline`): klientowy `RefreshButton` wywołujący `window.location.reload`, lista cache’owanych stron z `data/copy/offline.json`.
4. Statusy HTTP (`/410`, `/451`, `/503`): współdzielony `StatusPage` z copy w `system-status.json`; pamiętaj o aktualizacji `retryTime` dla 503.
5. Case study (`/przypadki-uzycia/[slug]`): `CaseStudyRepository` plus layout z sekcjami metryk, stacku i lekcji; CTA domknięte copy `case-studies.json`.

## 19. Contact Page (Mailto)

1. Formularz został zastąpiony statyczną sekcją z instrukcją kontaktu – wszystkie zapytania trafiają bezpośrednio na `kontakt@projektbezkodu.pl`.
2. Copy znajduje się w `data/copy/contact.json.notice` (tekst, etykieta przycisku, adres e-mail). Zmiany robić w JSON, nie w komponencie.
3. `app/(marketing)/kontakt/page.tsx` renderuje przycisk `mailto:` i blok tekstu – nie dodawaj ponownie formularza bez uzgodnienia.
4. `/kontakt/dziekujemy` istnieje tylko jako legacy fallback (informacja o wyłączeniu formularza); nie linkuj do niego nigdzie indziej.

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
