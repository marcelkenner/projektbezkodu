# Basic Pages Execution Guide (Step-by-Step)

This checklist walks through turning the current placeholders into production-ready pages with centralized copy management.

## Phase 0 – Preparation

1. Review roadmap documents: `docs/brand/basic_pages_plan.md`, `docs/brand/copy_system_plan.md`.
2. Confirm stakeholders (content lead, designer) are ready to provide copy and taxonomy decisions.
3. Create tickets/tasks per phase in the tracking board.

## Phase 1 – Centralize Copy Structure

1. Create directory `data/copy/` with files:
   - `global.json`, `homepage.json`, `articles.json`, `comparisons.json`, `tutorials.json`, `glossary.json`, `not-found.json`, `privacy.json`, `terms.json`.
2. Move existing strings from `data/copy.json` into `global.json` and `homepage.json`.
3. Implement `app/lib/copy.ts`:
   - Define TypeScript interfaces for each copy file.
   - Export `getCopy(section)` to return typed objects.
   - Add runtime fallback/logging for missing keys.
4. Update components/pages to consume `getCopy`:
   - Homepage hero/sections, nav, CTA buttons.
   - Not-found page.
   - Legal placeholders.
5. Update documentation (`docs/brand/content_voice.md`, README) with editing instructions.
6. Run `npm run lint` and adjust tests as needed.

## Phase 2 – Articles Index (`/artykuly`)

1. Define content taxonomy: categories, tags, metadata; document in `docs/brand/basic_pages_plan.md`.
2. Create markdown structure under `content/artykuly/**` with frontmatter (title, summary, category, slug, og data).
3. Implement data loader (e.g., `app/lib/articles.ts`) reading frontmatter with `readMarkdownFile` helper.
4. Replace placeholder cards with dynamic listing sorted by newest.
5. Add pagination or load-more strategy (document in copy if not immediate).
6. Hook up copy from `data/copy/articles.json` (page title, intro text).
7. Update plan checklist and run lint/tests.
8. Utrzymuj konfigurację nawigacji w `data/copy/articles.json` (`navigation.featuredCategories`, `seeAllHref`) – PrimaryNav/Footer już korzystają z tych danych.

## Phase 3 – Comparisons (`/porownania`)

1. Decide frontmatter schema (fields like `summary`, `bestFor`, `pricing`, `pros`, `cons`).
2. Create markdown entries under `content/porownania/**` using the schema.
3. Build `app/lib/comparisons.ts` to parse entries and expose list helpers.
4. Update page to map over real data, grouping by tool category if needed.
5. Populate copy file `data/copy/comparisons.json` for headings/intro.
6. Plan highlight blocks (e.g., top pick) and mark TODO for future enhancements.

## Phase 4 – Tutorials (`/poradniki`)

1. Define metadata (difficulty, duration, tool slugs). Update frontmatter schema doc.
2. Build markdown under `content/poradniki/**` with structured steps/sections.
3. Write loader `app/lib/tutorials.ts` returning metadata, excerpt, slug.
4. Render listing with difficulty badge (use tokens) and links to slug pages.
5. Dodaj filtry (narzędzie, trudność) oparte na `TutorialDirectory` i parametrach zapytania (`difficulty`,`tool`).
6. Copy integration via `data/copy/tutorials.json`.

## Phase 5 – Glossary (`/glossary`)

1. Ensure glossary entries exist in `content/glossary/**` (term, definition, aliases).
2. Build `app/lib/glossary.ts` to aggregate entries.
3. Render alphabetical list with jump navigation and inline search (`GlossaryDirectory` steruje grupowaniem).
4. Pull heading/intro copy from `data/copy/glossary.json`.

## Phase 6 – Search Page (`/szukaj`)

1. Wybrać rozwiązanie wyszukiwania (finalnie: build-time `ContentSearchEngine` działający offline).
2. Zaimplementować formularz z parametrem `q`, zasilany `data/copy/search.json`.
3. Zindeksować artykuły, tutoriale, porównania i słownik (`ContentSearchEngine.search`) i renderować wyniki wraz z typami.
4. Document setup in `docs/brand/tooling.md` and update copy file `data/copy/search.json` (create if needed).

## Phase 7 – Legal Pages

1. Gather final legal text from counsel.
2. Replace placeholders in `/polityka-prywatnosci` and `/regulamin` with actual content (store as markdown includes if long).
3. Add `lastUpdated` copy to `data/copy/privacy.json`/`terms.json`.
4. Ensure headings match design tokens; add table of contents if pages are lengthy.

## Phase 8 – 404 & Footer Enhancements

1. Update 404 copy via `data/copy/not-found.json`.
2. Add quick links to popular categories/posts once data is available.
3. Ensure footer (if present) also reads from centralized copy.

## Phase 9 – QA & Launch Prep

1. Run lint/tests: `npm run lint`, `npm run tokens:build`.
2. Manually QA each page (desktop/mobile), verifying copy renders correctly.
3. Update `docs/brand_design_system_plan.md` Section 12 checkbox once centralization complete.
4. Regenerate sitemap/robots placeholders if necessary.
5. Move tasks to “Done” in tracking board and prepare launch communication.

Keep this document updated as tasks complete. Cross-link tickets to the relevant checklist items.
