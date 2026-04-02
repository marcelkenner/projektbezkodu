# Improve Offline Site Search For `/szukaj`

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

If `docs/plans.md` exists, this plan must cite its repository-relative path and remain consistent with it. This plan was authored after reading `docs/plans.md` and must continue to follow its rules.

## Purpose / Big Picture


The goal is to make the website search feel useful instead of merely functional while staying inside the repository's existing build-time, offline search architecture. After this work, a visitor will be able to search from the header, the 404 page, or `/szukaj`, get better-ranked results with clearer snippets, narrow results by content type, and find public resource pages that are currently invisible to search.

The user-visible result should be easy to observe. A visitor who searches for `api` should see glossary matches. A visitor who searches for `meetupy` should see the resource page from `content/zasoby/wydarzenia-meetupy/index.md`. A visitor who searches for `webflow` should be able to filter to one content type and keep that state in the URL. The `/szukaj` page should also emit `robots=noindex,follow` with canonical `/szukaj/`, matching the repository's own search-page design notes.

## Progress


- [x] (2026-04-02 19:25Z) Read `docs/plans.md`, `app/(marketing)/(content)/szukaj/page.tsx`, `app/lib/search/ContentSearchEngine.ts`, `app/lib/url/SearchParamParser.ts`, `app/ui/PrimaryNav.tsx`, `app/(marketing)/not-found.tsx`, `data/copy/search.json`, `docs/content_editor_playbook.md`, `docs/data_copy_reference.md`, `docs/asci-designs/search-results.md`, and the search-related sections of `docs/website_repro_playbook.md` and `docs/website_repro_playbook_advanced.md`.
- [x] (2026-04-02 19:25Z) Used Serena to inspect the current repository structure, content repositories, and search-related symbols instead of guessing from filenames alone.
- [x] (2026-04-02 19:25Z) Used Context7 with official Next.js 16 documentation to confirm the current App Router guidance for Promise-based `searchParams`, URL-driven filtering, `useSearchParams`, and `next/form` GET navigation.
- [x] (2026-04-02 19:21Z) Verified the current automated baseline with `source ~/.nvm/nvm.sh && npm test`; all 32 test files and 80 tests passed before any search work.
- [x] (2026-04-02 19:30Z) Drafted this ExecPlan.
- [x] (2026-04-02 19:38Z) Implemented the typed search request model, scoring helpers, excerpt generation, resource indexing, and dedicated search tests under `app/lib/search/`.
- [x] (2026-04-02 19:39Z) Refactored `/szukaj`, added canonical/noindex metadata, introduced URL-driven type/sort filters, and shared the search form across the header, `/szukaj`, and the 404 page.
- [x] (2026-04-02 19:39Z) Updated `data/copy/search.json`, `docs/data_copy_reference.md`, and `docs/content_editor_playbook.md` to match the new behavior.
- [x] (2026-04-02 19:40Z) Verified the final state with `source ~/.nvm/nvm.sh && npm test`, `source ~/.nvm/nvm.sh && npm run lint`, `source ~/.nvm/nvm.sh && npm run build`, and live `curl` checks against the local production server for `/szukaj?q=api`, `/szukaj?q=meetupy`, `/szukaj?q=webflow&typ=tutorial&sort=newest`, and `/szukaj?q=zzzxxyy`.

## Surprises & Discoveries


- Observation: the current search engine is intentionally small and only indexes four content types.
  Evidence: `app/lib/search/ContentSearchEngine.ts` currently collects summaries only from `ArticleRepository`, `TutorialRepository`, `ComparisonRepository`, and `GlossaryRepository`.

- Observation: the current ranking logic is only substring matching with fixed weights and no dedicated handling for phrase matches, token completeness, excerpts, or freshness.
  Evidence: `ContentSearchEngine.calculateScore()` adds `+6` for title, `+3` for description, `+2` for keywords, and `+1` for path, then sorts by score and title.

- Observation: public resource pages already exist in the repository but are invisible to site search.
  Evidence: `app/lib/content/repositories.ts` exposes `ResourceRepository`, `content/zasoby/**` contains real markdown entries, and `app/(marketing)/(content)/szukaj/page.tsx` does not index them today.

- Observation: the search page implementation does not currently emit the metadata required by the repository's own search-result design note.
  Evidence: `docs/asci-designs/search-results.md` says search results should use `robots=noindex,follow` and canonical `/szukaj/`, while `app/(marketing)/(content)/szukaj/page.tsx` does not export `generateMetadata`.

- Observation: search form behavior is split across multiple components and can drift.
  Evidence: `app/ui/PrimaryNav.tsx` contains one `SearchForm` implementation for desktop and mobile navigation, while `app/(marketing)/not-found.tsx` contains a separate search form implementation.

- Observation: one editor-facing document describes a copy source that does not exist in the working tree.
  Evidence: `docs/content_editor_playbook.md` says search page copy lives in `content/szukaj/index.md`, but there is no `content/szukaj` directory and the actual page reads `data/copy/search.json`.

- Observation: `npm run build` is not a read-only verification step in this repository.
  Evidence: `package.json` defines `prebuild` as `npm run content:format && npm run content:lint`, so a build can rewrite markdown frontmatter before Next.js compiles the app.

- Observation: the improved search now works with production HTML responses, not only unit tests.
  Evidence: local `curl` checks against `npm start` confirmed glossary results for `q=api`, the `/zasoby/wydarzenia-meetupy/` resource result for `q=meetupy`, the persisted `typ=tutorial&sort=newest` filter state for `q=webflow`, and the empty-state copy for `q=zzzxxyy`.

## Decision Log


- Decision: keep the search feature build-time and repository-local instead of adding an external search service.
  Rationale: `docs/brand/basic_pages_execution_steps.md` already records the intended direction as an offline `ContentSearchEngine`, and the user asked for an improvement plan rather than a platform migration.
  Date/Author: 2026-04-02 / Codex

- Decision: first expand search coverage to the existing markdown-backed `ResourceRepository`, but not to `do-pobrania` lead magnets in the first pass.
  Rationale: resources are already modeled with the same repository pattern as other searchable content, while lead magnets are driven by separate data and would enlarge scope without first fixing the more obvious gap.
  Date/Author: 2026-04-02 / Codex

- Decision: treat URL search parameters as the single source of truth for search state.
  Rationale: this matches the current App Router page pattern, keeps search states bookmarkable, and is explicitly supported by current Next.js guidance confirmed through Context7.
  Date/Author: 2026-04-02 / Codex

- Decision: use strong TypeScript domain types for request state instead of passing raw strings through the page.
  Rationale: the repository instructions explicitly prefer compile-time guarantees, discriminated unions, and narrow interfaces over stringly typed business logic.
  Date/Author: 2026-04-02 / Codex

- Decision: fix the search-page documentation drift as part of the feature work.
  Rationale: a junior developer should not have to discover mid-task that one document points to a nonexistent file while the code reads another source.
  Date/Author: 2026-04-02 / Codex

- Decision: prefer improving the current scoring and presentation logic before considering fuzzy-search dependencies.
  Rationale: the current implementation gap is not lack of a third-party package; it is lack of coverage, metadata, structured request parsing, predictable ranking, and better result presentation.
  Date/Author: 2026-04-02 / Codex

## Outcomes & Retrospective


The search improvement is now implemented. The repository no longer relies on one small substring scorer wired directly into the page. Instead, search behavior is modeled in dedicated files under `app/lib/search/`, with typed request parsing, explicit sort/type handling, resource coverage, better ranking, and excerpt generation.

The `/szukaj` route now exposes canonical/noindex metadata, URL-driven filters, and clearer result cards with type badges plus available date/reading-time metadata. The header and 404 page now reuse the same search-form implementation, which reduces drift. The editor docs now point to the correct copy source, and search copy documents the new filters and `resource` type label.

The main lesson from the implementation is that the existing architecture was good enough once the missing pieces were added. Search quality improved without introducing a third-party search service or a new npm dependency, which kept the diff relatively small and the validation path straightforward.

## Context and Orientation


This repository is a Next.js 16 App Router site rooted in `app/`. The current search results page lives at `app/(marketing)/(content)/szukaj/page.tsx`. It is a server component that awaits Promise-based `searchParams`, reads `q` through `SearchParamParser`, calls `new ContentSearchEngine().search(query)`, and renders a list of cards.

A "repository" in this codebase is a class that reads markdown content and exposes small summaries for the UI. The current search engine uses four of them: `ArticleRepository`, `TutorialRepository`, `ComparisonRepository`, and `GlossaryRepository`. A fifth public repository already exists, `ResourceRepository`, but search ignores it. These repository classes live in `app/lib/content/repositories.ts`.

A "search index" in this repository is not an external server. It is simply the in-memory list of `SearchDocument` objects built by `ContentSearchEngine` from repository summaries during request handling. Today each document includes only `id`, `title`, `description`, `path`, `type`, and `keywords`.

Normalization is already handled centrally by `app/lib/text/TextNormalizer.ts`. It lowercases text and strips diacritics, which means `narzedzia` can match `narzędzia`. Query-string parsing is handled centrally by `app/lib/url/SearchParamParser.ts`. That parser already knows how to read a single value or repeated values from App Router `searchParams`.

The current search page copy comes from `data/copy/search.json`. The header search configuration comes from `data/copy/homepage.json`. The 404 search configuration comes from `data/copy/not-found.json`. That matters because any change to labels, type names, filters, or empty-state help must be reflected in both the copy data and the editor-facing docs.

The repository also contains search guidance outside the code. `docs/asci-designs/search-results.md` describes the intended search-results behavior, including `robots=noindex,follow`, canonical `/szukaj/`, result count text, and highlighted excerpts. `docs/website_repro_playbook.md` says the search page should be backed by `ContentSearchEngine`. `docs/website_repro_playbook_advanced.md` says desktop and mobile search behavior must stay in sync in `PrimaryNav`.

The current tests run under Vitest. The config is in `vitest.config.ts`, and test files use the `app/**/*.test.ts` pattern. This means search logic should be placed in testable modules under `app/` rather than hidden inside a huge page component.

## Plan of Work


Milestone 1 is to make the search domain explicit and testable. Add a small search request model under `app/lib/search/` so the rest of the feature stops passing raw query strings around. The request model should define the allowed content types and sort order. It should parse the raw `q`, `typ`, and `sort` URL parameters into a trusted object with narrow TypeScript types. At the same time, expand the indexed content to include `ResourceRepository` and split the current `ContentSearchEngine` into smaller helpers if the file would otherwise violate repository size limits.

Milestone 2 is to improve ranking and result presentation without adding a new dependency. Keep `TextNormalizer` as the normalization primitive, but update scoring so exact title phrase matches outrank description-only matches, full-token matches outrank partial matches, and newer content wins ties when both results are equally relevant. Extend the search result shape so the UI can render a short excerpt, optional published date, optional reading time, and a stable content-type label. The excerpt should be built from existing summary text first; do not add full-text indexing in this pass.

Milestone 3 is to improve the `/szukaj` page itself. Add `generateMetadata` to emit canonical `/szukaj/` and `robots=noindex,follow`. Add search controls that keep state in the URL: the existing `q` parameter, a new `typ` parameter for content type, and a new `sort` parameter with at least `relevance` and `newest`. Keep the page split into small modules if it grows, for example a controls component and a results-list component inside `app/(marketing)/(content)/szukaj/`.

Milestone 4 is to make every search entry point behave consistently. Extract a shared search form component, likely under `app/ui/search/SiteSearchForm.tsx`, and use it from `app/ui/PrimaryNav.tsx`, the `/szukaj` page, and `app/(marketing)/not-found.tsx`. Based on the official Next.js 16 guidance confirmed through Context7, using `next/form` with a string `action` is the preferred progressive-enhancement path for GET search forms because it keeps URL-driven navigation while avoiding a full page reload.

Milestone 5 is documentation and verification. Update `data/copy/search.json` for any new labels or empty-state copy. Update `docs/data_copy_reference.md` to document the new copy keys and the expanded searchable types. Update `docs/content_editor_playbook.md` so it points to the real copy source and explains that search now covers resources as well as the older content types. Finish by running targeted tests, full tests, lint, and a manual browser check using stable queries from the repository.

## Concrete Steps


All commands below run from:

    /home/marcel/src/projektbezkodu

All Node and npm commands in this repository should be prefixed with:

    source ~/.nvm/nvm.sh &&

1. Capture the baseline before changing behavior.

    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && git status --short

   Expected baseline today:

    Test Files  32 passed (32)
    Tests  80 passed (80)

2. Add the search domain types and request parsing under `app/lib/search/`.

   Create small files rather than growing one god-module. The minimum set should be:

    app/lib/search/SearchRequest.ts
    app/lib/search/ContentSearchEngine.ts
    app/lib/search/ContentSearchEngine.test.ts

   If `ContentSearchEngine.ts` would exceed repository size guidance, split additional helpers such as:

    app/lib/search/SearchScoreCalculator.ts
    app/lib/search/SearchExcerptBuilder.ts

   The request model should accept:

    q=<search query>
    typ=all|article|tutorial|comparison|glossary|resource
    sort=relevance|newest

3. Expand the indexed repositories and result model.

   Update `app/lib/search/ContentSearchEngine.ts` to include `ResourceRepository` from `app/lib/content/repositories.ts`. Keep drafts excluded by continuing to rely on repository summaries rather than reading raw files directly.

   The search result returned by the engine should carry enough data for the page to render without extra lookup work:

    id
    title
    path
    type
    description
    excerpt
    score
    publishedAt
    readingTime

   Add tests first or immediately alongside the implementation. Useful test names include:

    ranks exact title phrase above description-only matches
    matches queries without Polish diacritics
    returns resource results when resources are indexed
    filters results by requested type
    sorts equal-score results by newest date when sort=newest

4. Improve the `/szukaj` route.

   Update `app/(marketing)/(content)/szukaj/page.tsx` so it:

    awaits Promise-based `searchParams`
    converts them into the trusted search request object
    calls the engine with query, type, and sort
    exports `generateMetadata`

   If the page starts getting large, split presentation into small local components such as:

    app/(marketing)/(content)/szukaj/SearchControls.tsx
    app/(marketing)/(content)/szukaj/SearchResultsList.tsx

   Keep those components presentational only. Ranking and parsing logic must stay in `app/lib/search/`.

5. Unify search forms.

   Introduce a shared component, for example:

    app/ui/search/SiteSearchForm.tsx

   Update these files to consume it:

    app/ui/PrimaryNav.tsx
    app/(marketing)/(content)/szukaj/page.tsx
    app/(marketing)/not-found.tsx

   Prefer `next/form` with a string `action="/szukaj/"` so submissions stay URL-based and benefit from client-side navigation as documented in official Next.js 16 docs.

6. Update copy and documentation.

   Adjust:

    data/copy/search.json
    docs/data_copy_reference.md
    docs/content_editor_playbook.md

   At minimum, add or document:

    typeLabels.resource
    labels for the type filter
    labels for the sort control
    any new empty-state helper text

   Correct the incorrect `content/szukaj/index.md` reference in `docs/content_editor_playbook.md`.

7. Run the full verification pass.

    source ~/.nvm/nvm.sh && npm test -- app/lib/search/ContentSearchEngine.test.ts
    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run lint
    source ~/.nvm/nvm.sh && npm run build

   Then start the app locally:

    source ~/.nvm/nvm.sh && npm run dev

   Manual pages to open:

    http://localhost:3000/szukaj?q=api
    http://localhost:3000/szukaj?q=meetupy
    http://localhost:3000/szukaj?q=webflow&typ=tutorial&sort=newest
    http://localhost:3000/szukaj?q=zzzxxyy

## Validation and Acceptance


Acceptance is based on visible behavior, not only on compilation.

1. Targeted search tests pass.

    source ~/.nvm/nvm.sh && npm test -- app/lib/search/ContentSearchEngine.test.ts

   Success means the new search-engine test file passes and proves the ranking and filtering rules described in this plan.

2. Full repository checks pass.

    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run lint
    source ~/.nvm/nvm.sh && npm run build

   Failure signals include any Vitest failure, ESLint failure, TypeScript error surfaced by Next.js, or unexpected file changes caused by `content:format` that were not reviewed.

3. `/szukaj?q=api` shows a glossary result.

   Observable success:

    the page renders at least one result card
    at least one card has the `Słownik` badge
    the query field still contains `api`

4. `/szukaj?q=meetupy` shows the resource page from `content/zasoby/wydarzenia-meetupy/index.md`.

   Observable success:

    at least one card has the `Zasób` badge
    that card links to `/zasoby/wydarzenia-meetupy/`

5. `/szukaj?q=webflow&typ=tutorial&sort=newest` keeps all state in the URL and filters the result list.

   Observable success:

    the query field shows `webflow`
    the selected content type stays on the tutorial option
    only tutorial badges are visible in the result list
    the URL still contains `q`, `typ`, and `sort`

6. `/szukaj?q=zzzxxyy` renders a helpful empty state instead of a blank page.

   Observable success:

    the page shows the dedicated empty-state message from `data/copy/search.json`
    the search form remains usable without navigating away

7. Search metadata is correct.

   With the local dev server running:

    curl -s 'http://localhost:3000/szukaj?q=api' | rg 'noindex,follow|/szukaj/'

   Success means the returned HTML contains the `robots` directive and canonical search route. This should match the design note in `docs/asci-designs/search-results.md`.

8. Header and 404 search still work after the shared-form refactor.

   Observable success:

    submitting search from the main header opens `/szukaj?q=<term>`
    submitting search from the 404 page opens `/szukaj?q=<term>`
    desktop and mobile header variants still submit the same parameter name `q`

## Idempotence and Recovery


Most steps in this plan are safe to repeat. Re-running the Vitest commands, lint, and the dev server is idempotent. Re-running the manual browser checks is also safe.

The only step that may dirty the working tree unexpectedly is:

    source ~/.nvm/nvm.sh && npm run build

That command triggers `prebuild`, which runs `content:format` before the Next.js build. If `git status --short` shows markdown-only formatting changes after a build, inspect them before continuing. Do not discard unrelated user changes.

If the search-engine refactor becomes confusing mid-way, recover by keeping `app/(marketing)/(content)/szukaj/page.tsx` thin and moving logic back into small files under `app/lib/search/`. The page should never become the place where ranking rules or raw query parsing live.

If resource indexing introduces unexpected behavior, the safe rollback is to remove `ResourceRepository` from the engine and re-run the targeted search tests. No migration, external service, or irreversible data change is involved in this plan.

If live content changes while this work is in progress, update the concrete example queries in this ExecPlan so the validation section remains true. This document must stay aligned with reality.

## Artifacts and Notes


Current baseline test proof:

    Test Files  32 passed (32)
    Tests  80 passed (80)

Current scoring proof from `app/lib/search/ContentSearchEngine.ts`:

    if (TextNormalizer.includes(document.title, normalizedQuery)) {
      score += 6;
    }
    if (TextNormalizer.includes(document.description, normalizedQuery)) {
      score += 3;
    }
    if (document.keywords.some(...)) {
      score += 2;
    }

Current documentation drift proof:

    docs/content_editor_playbook.md -> "content/szukaj/index.md stores metadata and page copy"
    actual route implementation -> reads data from `data/copy/search.json`

Relevant repository evidence for the intended metadata:

    docs/asci-designs/search-results.md
    SEO: <meta name="robots" content="noindex,follow">, canonical na /szukaj/.

## Interfaces and Dependencies


- `app/lib/search/SearchRequest.ts`
  This module should define the trusted search-request domain. A concrete target is:
  `SearchContentType = "all" | "article" | "tutorial" | "comparison" | "glossary" | "resource"` and `SearchSort = "relevance" | "newest"`.

- `app/lib/search/ContentSearchEngine.ts`
  The final public API should accept the typed request rather than only a raw string. A concrete target is `search(request: SearchRequest): SearchResult[]`.

- `app/lib/content/repositories.ts`
  The search engine should continue to depend on repository summaries from `ArticleRepository`, `TutorialRepository`, `ComparisonRepository`, `GlossaryRepository`, and `ResourceRepository`.

- `app/lib/text/TextNormalizer.ts`
  Keep this as the normalization primitive so diacritic-insensitive matching stays consistent across the codebase.

- `app/lib/url/SearchParamParser.ts`
  Reuse this existing parser at the App Router boundary rather than re-implementing raw query-string handling inside the page.

- `app/(marketing)/(content)/szukaj/page.tsx`
  This route must remain the canonical search page and must export metadata for canonical `/szukaj/` and `robots=noindex,follow`.

- `app/ui/search/SiteSearchForm.tsx`
  This shared component should become the single form implementation used by the header, `/szukaj`, and 404 page.

- `data/copy/search.json`
  This file remains the search-page copy source of truth. It must document every new label or message added by the improved search experience.

- `docs/data_copy_reference.md` and `docs/content_editor_playbook.md`
  These documents must be updated together with the feature so editor instructions match actual behavior.

- `next/form`
  Based on official Next.js 16 guidance confirmed via Context7, this is the preferred dependency for GET-style search forms that should keep URL parameters and use client-side navigation.

- No new npm search dependency should be added in this plan.
  The intended implementation is based on existing repository utilities and Next.js primitives.

Plan update note (2026-04-02 / Codex): Updated after implementation to mark completed work, record the live verification evidence, and keep the ExecPlan aligned with the finished search feature instead of the original draft state.
