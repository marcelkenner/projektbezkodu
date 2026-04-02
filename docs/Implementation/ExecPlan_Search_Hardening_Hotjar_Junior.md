# Harden Site Search So `hotjar` Finds Published Tool Articles

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be updated as work proceeds.

If `docs/plans.md` exists, this plan must stay consistent with it. This plan was authored after reading `docs/plans.md`, and it repeats the rules that matter here so a junior developer can work from this file alone.


## Purpose / Big Picture


The goal is to fix a real search quality failure and prevent the same class of failure from happening again. Today, searching for `hotjar` on `/szukaj` returns only one comparison article, even though the repository contains published Hotjar pages at `/narzedzia/hotjar/alternatywy/` and `/narzedzia/hotjar/cennik/`. After this work, a visitor who searches for `hotjar` should see those published tool articles, should not see draft-only pages such as `/narzedzia/hotjar/faq/`, and should get results from every content family that the project has explicitly decided is public and searchable.

The important point is that this is not only a ranking problem. The current search index does not even know that a large part of the public content tree exists. That means the first job is to repair search coverage, then improve ranking only after coverage is correct.

This plan is intentionally beginner-friendly. It names the exact files to inspect, explains what each subsystem does in plain language, and includes concrete validation steps so you can tell whether you are done without guessing.


## Progress


- [x] (2026-04-02 20:09 Europe/Warsaw) Read `docs/plans.md`, the existing search follow-up plan at `docs/Implementation/ExecPlan_Search_Improvement_Junior.md`, the current search code in `app/lib/search/`, the route code under `app/(marketing)/(content)/szukaj/`, and the content/routing code that powers tool pages through `ContentLibrary` and `ContentPageCoordinator`.
- [x] (2026-04-02 20:09 Europe/Warsaw) Reproduced the bug in the running application: `http://localhost:3000/szukaj?q=hotjar` returns one result only.
- [x] (2026-04-02 20:09 Europe/Warsaw) Verified repository evidence for the missing pages: `content/narzedzia-no-code/hotjar/alternatywy/index.md` and `content/narzedzia-no-code/hotjar/cennik/index.md` are published (`draft: false`) and their public routes return HTTP 200.
- [x] (2026-04-02 20:09 Europe/Warsaw) Verified that draft Hotjar pages are not valid public targets: `/narzedzia/hotjar/faq` and `/narzedzia/hotjar/recenzja` return HTTP 404.
- [x] (2026-04-02 20:09 Europe/Warsaw) Audited the current search coverage and confirmed the architectural gap: `ContentSearchEngine` indexes 301 published documents from five repository families, while the repository contains 534 published markdown entries outside `_examples`, `do-pobrania`, and `szablony`.
- [x] (2026-04-02 20:09 Europe/Warsaw) Used Serena to inspect symbols and routing structure without guessing from filenames alone.
- [x] (2026-04-02 20:09 Europe/Warsaw) Used Context7 to confirm two current points of guidance:
  1. In Next.js 16 App Router, URL-driven search pages should read Promise-based `searchParams`, and GET search forms can use `next/form` to keep search state in the URL.
  2. Fuse.js supports weighted keys, exact and fuzzy search, and threshold tuning for small to moderately large local datasets, so it is a valid future option if custom ranking remains insufficient after coverage is fixed.
- [x] (2026-04-02 22:18 Europe/Warsaw) Replaced the search source list with a route-backed `PublicContentSearchRepository` that indexes every public markdown-backed content route plus glossary entries, deduplicated by canonical path.
- [x] (2026-04-02 22:18 Europe/Warsaw) Extended the search type model and UI copy to cover `tool` and generic `page` results in addition to the existing article/tutorial/comparison/glossary/resource filters.
- [x] (2026-04-02 22:18 Europe/Warsaw) Added regression coverage in `app/lib/search/ContentSearchEngine.test.ts` and `app/lib/search/PublicContentSearchRepository.test.ts`, including the real `hotjar` case and route-coverage assertions.
- [x] (2026-04-02 22:18 Europe/Warsaw) Updated the editor and implementation docs so they describe the new “all public markdown-backed pages plus glossary” search coverage model.
- [x] (2026-04-02 22:18 Europe/Warsaw) Verified the final state with `source ~/.nvm/nvm.sh && npm test`, `source ~/.nvm/nvm.sh && npm run lint`, `source ~/.nvm/nvm.sh && npm run build`, and production HTML checks for `/szukaj?q=hotjar` and `/szukaj?q=hotjar&typ=tool`.


## Surprises & Discoveries


- Observation: the current bug is mainly a coverage failure, not a scoring failure.
  Evidence: the live `/szukaj?q=hotjar` page shows `Dla frazy „hotjar” znaleziono 1 wyników` and the only returned page is `/artykuly/analityka/heatmapy-i-nagrania-sesji-hotjar-vs-microsoft-clarity-ktory-wybrac/`.

- Observation: `ContentSearchEngine` still hard-codes only five searchable families.
  Evidence: the constructor in `app/lib/search/ContentSearchEngine.ts` includes `ArticleRepository`, `TutorialRepository`, `ComparisonRepository`, `GlossaryRepository`, and `ResourceRepository`, and nothing related to tool-guide pages or generic `ContentLibrary` routes.

- Observation: the Hotjar pages the user expects are real published pages.
  Evidence: `content/narzedzia-no-code/hotjar/alternatywy/index.md` and `content/narzedzia-no-code/hotjar/cennik/index.md` both have `draft: false`, and `curl` against `/narzedzia/hotjar/alternatywy` and `/narzedzia/hotjar/cennik` returns HTTP 200.

- Observation: not every Hotjar markdown file should appear in public search.
  Evidence: `content/narzedzia-no-code/hotjar/faq/index.md`, `glowny/index.md`, and `recenzja/index.md` are `draft: true`, and the direct routes `/narzedzia/hotjar/faq` and `/narzedzia/hotjar/recenzja` return HTTP 404 in the running app.

- Observation: the search type system itself currently prevents tool pages from being modeled.
  Evidence: `app/lib/search/SearchRequest.ts` allows only `all`, `article`, `tutorial`, `comparison`, `glossary`, and `resource`. `data/copy/search.json` and the `/szukaj` controls mirror the same limited set.

- Observation: the largest content family in the repository is invisible to search.
  Evidence: `content/narzedzia-no-code/` contains 319 markdown index files, including 167 published child pages and 33 published `glowny` pages, but the search engine has no source for this tree.

- Observation: the blind spot is broader than `/narzedzia/**`.
  Evidence: the repository also contains published content roots such as `content/hostinger-link-in-bio/**`, `content/later-link-in-bio/**`, `content/linktree/**`, and `content/instapage/**`, which are powered by generic content routing but are not represented in the current search source list.

- Observation: the current tests mainly verify ranking within the existing index and do not verify index coverage.
  Evidence: `app/lib/search/ContentSearchEngine.test.ts` checks title ranking, diacritics, resources, filtering, and sorting, but has no test that a public tool article or any `ContentLibrary`-driven route is indexed.

- Observation: project documentation currently teaches the incomplete behavior as if it were the intended one.
  Evidence: `docs/content_editor_playbook.md` says search combines only articles, tutorials, comparisons, glossary terms, and resources. That is consistent with the code, but inconsistent with the broader public site content.


## Decision Log


- Decision: treat coverage as the primary defect and ranking as a secondary improvement.
  Rationale: a better scorer cannot return pages that were never indexed. The `hotjar` failure proves the current missing-results bug happens before scoring begins.
  Date/Author: 2026-04-02 / Codex

- Decision: create a new ExecPlan instead of overwriting `docs/Implementation/ExecPlan_Search_Improvement_Junior.md`.
  Rationale: the earlier file records a completed April 2 implementation pass. This follow-up plan documents a new problem, new evidence, and a broader hardening scope.
  Date/Author: 2026-04-02 / Codex

- Decision: do not start by adding Fuse.js.
  Rationale: Context7 confirms Fuse.js is a valid option for local search, but the first failure to solve is incomplete index coverage. Adding a fuzzy library before fixing coverage would increase complexity without solving the root cause.
  Date/Author: 2026-04-02 / Codex

- Decision: introduce an explicit search coverage policy tied to public routes.
  Rationale: the current architecture lets routing and search evolve separately. That is why new public content families can exist for months without becoming searchable.
  Date/Author: 2026-04-02 / Codex

- Decision: only published public pages should be searchable by default.
  Rationale: the live site returns 404 for draft Hotjar child pages, so search should not surface them. Search results must match what a user can actually open.
  Date/Author: 2026-04-02 / Codex

- Decision: the first acceptance query for this work is `hotjar`.
  Rationale: it is a real, currently failing query with clear expected public results and clear non-results.
  Date/Author: 2026-04-02 / Codex


## Outcomes & Retrospective


The hardening work is now implemented and verified.

The search system no longer depends on a hand-maintained list of only five repository families. It now indexes every public markdown-backed content route discovered by `ContentLibrary`, adds glossary entries explicitly, deduplicates by canonical path, and classifies results into the search types exposed by the UI.

The original `hotjar` failure is fixed. The built `/szukaj?q=hotjar` page now includes `/narzedzia/hotjar/cennik/` and `/narzedzia/hotjar/alternatywy/` alongside the Hotjar comparison article, and the filtered `/szukaj?q=hotjar&typ=tool` view narrows the result set to the two published tool pages only. Draft-only routes such as `/narzedzia/hotjar/faq/` and `/narzedzia/hotjar/recenzja/` remain absent.

The main lesson from the implementation is the same as the lesson from the diagnosis: search coverage must follow public route coverage from one explicit source of truth. Once that rule was encoded in code and tests, the missing-results class of bug became much harder to reintroduce.


## Context and Orientation


This repository is a Next.js 16 App Router application rooted in `app/`. The search page is `app/(marketing)/(content)/szukaj/page.tsx`. It reads URL query parameters through `SearchParamParser`, parses them with `parseSearchRequest` from `app/lib/search/SearchRequest.ts`, and asks `ContentSearchEngine` for results.

A “repository” in this codebase is a small class that reads markdown content and returns summaries. The current search engine depends on repositories from `app/lib/content/repositories.ts`.

A “content route” in this codebase is a public page discovered by `ContentLibrary` from markdown files under `content/`. `ContentLibrary` lives in `app/lib/content/contentLibrary.ts`. It converts markdown files into route entries like `/narzedzia/hotjar/cennik/` or `/hostinger-link-in-bio/alternatywy/`.

A “coordinator” in this codebase is a thin class that turns route entries into a view model for rendering. `ContentPageCoordinator` lives in `app/lib/content/contentPageCoordinator.ts`. It uses `ContentLibrary` as its source of truth.

That difference matters. Search currently uses a manual list of repositories, while routing uses `ContentLibrary`. Because those are different truth sources, the site can successfully render pages that search has never been taught to index.

The older search improvement plan at `docs/Implementation/ExecPlan_Search_Improvement_Junior.md` should be treated as historical context, not as the current source of truth for this task. It improved ranking and resources, but it did not solve coverage for tool-guide routes or other `ContentLibrary`-driven families.


## Problem Statement


The easiest way to see the current failure is to run the local dev server and open the search page with the Hotjar query.

From the repository root:

    source ~/.nvm/nvm.sh && npm run dev

Then open:

    http://localhost:3000/szukaj?q=hotjar

Today the page reports one result only. The returned result is the comparison article:

    /artykuly/analityka/heatmapy-i-nagrania-sesji-hotjar-vs-microsoft-clarity-ktory-wybrac/

But the repository contains published Hotjar child articles at:

    content/narzedzia-no-code/hotjar/alternatywy/index.md
    content/narzedzia-no-code/hotjar/cennik/index.md

Their public URLs are:

    /narzedzia/hotjar/alternatywy/
    /narzedzia/hotjar/cennik/

Both return HTTP 200 in the running app. Therefore, from a user point of view, search is incomplete.

This problem is not limited to Hotjar. The current engine indexes 301 published entries from the five families it knows about, while the repository contains 534 published markdown pages outside `_examples`, `do-pobrania`, and `szablony`. Some of those extra pages may be intentionally excluded from search, but the repository does not currently define that policy anywhere. That missing policy is itself part of the bug.


## Why The Bug Happens


There are four root causes.

First, the search source list is hard-coded in `app/lib/search/ContentSearchEngine.ts`. If a new public content family is added elsewhere in the repository, search does not pick it up automatically.

Second, the search request and UI types do not have any representation for tool-guide content. `SearchRequest.ts`, `data/copy/search.json`, and `app/(marketing)/(content)/szukaj/SearchControls.tsx` all assume the same limited set of types, so the omission is baked into the form, the parser, the engine, and the copy.

Third, the current tests validate ranking rules but not search coverage. This is why the earlier implementation could look “done” while still missing a large content branch.

Fourth, editor-facing documentation repeats the incomplete model. That makes the gap harder to notice because contributors are told the current limited index is the intended behavior.


## Recommended Implementation Strategy


The recommended implementation has two phases.

Phase 1 fixes correctness. It introduces an explicit search coverage policy, adds the missing public tool child pages to the index, updates the search types and docs, and adds regression tests that prove `hotjar` returns the published tool pages.

Phase 2 improves relevance only if needed. After coverage is correct, review real queries again. If exact and token-based ranking is still not good enough, prototype a weighted fuzzy-search layer. Context7 confirms Fuse.js is appropriate for small to moderately large local datasets and supports weighted keys and threshold tuning, but it should be a follow-up choice, not the first fix.

The simplest correct implementation path is not to replace the entire search system. It is to add one explicit source for public tool child articles first, then decide whether broader generic content roots should also become searchable in the same change or in a clearly scheduled follow-up.


## Scope For This Change


The minimum scope that must be completed in this hardening pass is:

1. Searching for `hotjar` returns the two published Hotjar child pages.
2. Draft Hotjar pages do not appear.
3. The search UI can represent the new content type cleanly.
4. Tests fail before the change and pass after it.
5. Documentation explains the new searchable content family.

The recommended expanded scope for the same pass is:

1. Add a reusable search coverage helper that can support more `ContentLibrary`-driven route families later.
2. Record an explicit allow-list for additional generic roots that should be searchable, or explicitly defer them in the `Decision Log`.

Do not silently index every markdown file in the repository. Some public pages, such as downloads or other special-purpose landing pages, may not belong in search. The policy must be explicit.


## Milestone 1: Add An Explicit Search Coverage Policy


Create a small module under `app/lib/search/` that becomes the single source of truth for search coverage. Name it something clear, for example:

    app/lib/search/SearchContentSourceRegistry.ts

This module should answer two plain questions:

1. Which content families are searchable?
2. Which repository or collector provides summaries for each family?

Move the current hard-coded list out of `ContentSearchEngine` and into this registry. `ContentSearchEngine` should consume the registry instead of owning search coverage rules itself.

This is important because it separates “how to score results” from “what documents are allowed to be searched.”


## Milestone 2: Index Public Tool Child Articles


Add a dedicated search source for tool child articles. Do not hide this logic inside the page component. Put it in a small repository-like module, for example:

    app/lib/search/ToolGuideSearchRepository.ts

This collector should use `ContentLibrary` from `app/lib/content/contentLibrary.ts`, because `ContentLibrary` is already the system that knows which markdown files map to public routes.

The collector should include only entries that satisfy all of these rules:

1. The path starts with `/narzedzia/`.
2. The route has more than two segments, which means it is a child article such as `/narzedzia/hotjar/cennik/`, not the tool hub path.
3. The underlying frontmatter is not `draft: true`.
4. The route is a real public page that the running app can resolve.

The collector should convert those route entries into `ContentSummary`-like search documents using:

1. `frontmatter.title` for the result title.
2. `hero.subheading`, then `seo.description`, then document excerpt as the description fallback chain.
3. `frontmatter.date` as `publishedAt`.
4. `meta.duration` if present.
5. taxonomy tags, categories, and useful `meta` fields as search keywords.

This module should be small and testable on its own.


## Milestone 3: Extend Search Types, UI Copy, And Rendering


Add a new search type for tool articles. Use the simplest internal value that stays readable in URLs and code. The recommended value is:

    tool

Update these files together so the system stays consistent:

    app/lib/search/SearchRequest.ts
    app/(marketing)/(content)/szukaj/SearchControls.tsx
    app/(marketing)/(content)/szukaj/SearchResultsList.tsx
    data/copy/search.json
    docs/data_copy_reference.md
    docs/content_editor_playbook.md

The UI label should be understandable to a normal reader. The recommended label is:

    Narzędzia

If the result cards need a more specific badge label, use something like:

    Przewodnik narzędzia

Keep the internal type short, but keep the visible text friendly.


## Milestone 4: Add Coverage Regression Tests


Add tests for the specific bug and for the structural rule behind it.

First, extend `app/lib/search/ContentSearchEngine.test.ts` with a real regression case:

    searching for "hotjar" returns the published Hotjar child pages

This test should assert that the result paths include:

    /narzedzia/hotjar/alternatywy/
    /narzedzia/hotjar/cennik/

And do not include:

    /narzedzia/hotjar/faq/
    /narzedzia/hotjar/recenzja/

Second, add a focused repository test for the new collector, for example:

    app/lib/search/ToolGuideSearchRepository.test.ts

That test should verify that:

1. published tool child pages are collected,
2. draft tool child pages are skipped,
3. title and description fields are populated from the expected fallback chain.

If you decide to generalize beyond tools in this pass, add a third test for the search coverage registry so future contributors cannot add a new searchable family in one file and forget to register it in another.


## Milestone 5: Decide What To Do With Other Public `ContentLibrary` Roots


This milestone is partly implementation and partly policy.

The repository contains additional published roots outside the five current search families and outside `/narzedzia/**`, including:

    /hostinger-link-in-bio/**
    /later-link-in-bio/**
    /linktree/**
    /instapage/**

Before implementation ends, record one of these two choices in the `Decision Log` and in code comments where appropriate:

Choice A: include these roots in the same hardening pass.

Choice B: explicitly defer them, with a follow-up ticket or plan reference.

Do not leave this ambiguous. If you defer them, say clearly that the current hardening pass fixes the known `hotjar` class of failure for `/narzedzia/**` first and that the remaining roots are a separate coverage expansion.


## Milestone 6: Re-evaluate Ranking Only After Coverage Is Fixed


After the new coverage tests pass, manually re-run real queries.

Start with:

    hotjar
    webflow
    session replay
    alternatywy hotjar

If the returned results are present but poorly ordered, improve ranking in the existing custom scorer first. Good low-risk improvements include:

1. searching `seo.title` and `seo.description` when available,
2. giving exact title matches more weight than keyword-only matches,
3. preferring shorter path distance when scores tie,
4. using a richer excerpt source than description alone.

Only if those improvements still leave clearly bad behavior should you prototype Fuse.js. If you reach that point, keep the prototype behind a small adapter and document the chosen weights and threshold. Context7 confirms Fuse.js supports weighted keys, exact and fuzzy operators, and threshold tuning, so it is technically suitable here, but it is not required to fix the current bug.


## Concrete File Plan


The most likely touched files are:

    app/lib/search/ContentSearchEngine.ts
    app/lib/search/SearchRequest.ts
    app/lib/search/ContentSearchEngine.test.ts
    app/lib/search/SearchContentSourceRegistry.ts
    app/lib/search/ToolGuideSearchRepository.ts
    app/lib/search/ToolGuideSearchRepository.test.ts
    app/(marketing)/(content)/szukaj/SearchControls.tsx
    app/(marketing)/(content)/szukaj/SearchResultsList.tsx
    data/copy/search.json
    docs/data_copy_reference.md
    docs/content_editor_playbook.md

If broader generic content roots are included in this pass, add one more collector instead of bloating the tool collector. For example:

    app/lib/search/GenericContentSearchRepository.ts

Keep files small. Do not let `ContentSearchEngine.ts` become a god-module again.


## Concrete Implementation Steps


All commands below run from:

    /home/marcel/src/projektbezkodu

All Node and npm commands must be prefixed with:

    source ~/.nvm/nvm.sh &&

1. Capture the current failing behavior.

    source ~/.nvm/nvm.sh && npm run dev
    curl -s 'http://localhost:3000/szukaj?q=hotjar'

   Confirm the page reports one result only.

2. Create the search coverage registry under `app/lib/search/`.

   Keep the module simple. It should export the list of search sources and any shared type aliases needed by the engine.

3. Create `ToolGuideSearchRepository`.

   Use `ContentLibrary.listRoutes()` as the discovery source.

4. Add the new `tool` search type.

   Update parser, UI options, result badges, and copy together so no layer is out of sync.

5. Plug the new collector into the registry and then into `ContentSearchEngine`.

6. Add the regression tests and run them before changing more code.

    source ~/.nvm/nvm.sh && npm test -- app/lib/search/ContentSearchEngine.test.ts

7. Add or update docs.

   Explain that search now includes tool child articles. If additional public roots are deferred, document that decision explicitly so editors do not assume every public markdown page is searchable.

8. Run the full verification pass.

    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run lint

   Run `npm run build` only after you are ready for content-format side effects, because this repository’s build runs formatting and content linting first.

    source ~/.nvm/nvm.sh && npm run build


## Validation and Acceptance


Acceptance is based on observed behavior, not on code review alone.

1. The Hotjar regression is fixed.

    http://localhost:3000/szukaj?q=hotjar

   Success means the rendered page includes at least these result URLs:

    /narzedzia/hotjar/alternatywy/
    /narzedzia/hotjar/cennik/

   And still includes the comparison article if it remains relevant.

2. Draft-only Hotjar pages are not shown.

   Success means the result list does not include:

    /narzedzia/hotjar/faq/
    /narzedzia/hotjar/recenzja/

3. The type filter exposes the new type and keeps state in the URL.

   Open:

    http://localhost:3000/szukaj?q=hotjar&typ=tool

   Success means only tool-guide results appear and the filter remains selected after refresh.

4. Search tests pass.

    source ~/.nvm/nvm.sh && npm test -- app/lib/search/ContentSearchEngine.test.ts

   Success means the new Hotjar regression test passes.

5. Full repository checks pass.

    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run lint

6. Build still succeeds.

    source ~/.nvm/nvm.sh && npm run build

7. Documentation matches behavior.

   Success means `docs/content_editor_playbook.md` and `docs/data_copy_reference.md` both describe the same searchable types that the live UI exposes.


## Failure Signals


The implementation is incomplete or wrong if any of these happen:

1. `hotjar` still returns only the comparison article.
2. Draft-only pages such as `/narzedzia/hotjar/faq/` appear in results.
3. The `/szukaj` filter UI shows a `tool` option, but the query parser rejects `typ=tool`.
4. The search engine can return tool results, but `data/copy/search.json` does not include a matching label.
5. A new collector duplicates existing results because the same path is indexed by more than one source.


## Risks and Safe Rollback


The main risk is duplicate or misclassified results when multiple collectors overlap. Avoid this by deduplicating by canonical path inside the engine or registry and by writing tests that assert path uniqueness.

The second risk is accidental over-indexing of page families that are public but not intended for site search. Avoid this by keeping the coverage policy explicit instead of using “all markdown under `content/`” as the default rule.

If the new tool collector causes unexpected behavior, the safe rollback is to remove it from the registry and re-run the search tests. No database, migration, or irreversible content operation is involved.


## Notes For A Junior Developer


If you feel lost, focus on the flow of data:

1. The search page reads the URL.
2. `SearchRequest.ts` converts raw URL text into a trusted search request.
3. `ContentSearchEngine` asks its sources for searchable documents.
4. Each source provides summaries.
5. The engine scores those summaries and returns results.
6. The `/szukaj` page renders them.

The current bug happens between steps 3 and 4. The missing Hotjar pages never become searchable documents at all. That is why the first fix is to add the right source, not to tune the score numbers.


## Plan Update Note


Plan created on 2026-04-02 by Codex after reproducing the `hotjar` search failure, auditing the current search coverage, and verifying the relevant public Hotjar routes in the running app. Updated later the same day after implementation to record the completed work, final verification evidence, and the new route-backed search coverage model. This plan remains separate from `docs/Implementation/ExecPlan_Search_Improvement_Junior.md`.
