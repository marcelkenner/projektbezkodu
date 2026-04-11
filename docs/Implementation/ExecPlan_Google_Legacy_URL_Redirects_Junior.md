# Implement Deterministic Legacy Google URL Redirects For Articles


This ExecPlan must be maintained in accordance with `docs/plans.md`. That file says the plan must stay self-contained, novice-guiding, behavior-verifiable, and up to date at every stopping point. This document repeats the repository-specific facts that matter so the reader does not need prior chat context.


## Purpose / Big Picture


Google is trying to crawl URLs such as `https://projektbezkodu.pl/najlepsze-cms-no-code-seo`. Today that URL returns HTTP `404`, even though a real published article exists at the canonical URL `/artykuly/cms-bez-kodu/najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage/`.

The goal of this change is to add a safe redirect layer for legacy article-slug URLs without creating a dangerous catch-all redirect system. After this work:

- a legacy article slug URL that maps to exactly one published article will return HTTP `308` and redirect to the canonical article path,
- sitemap output will continue to advertise only canonical URLs,
- unknown or ambiguous URLs will continue to return `404` instead of guessing,
- and the rules will be documented clearly enough that a junior developer can maintain them.

This plan intentionally does not add blanket redirects for every content type and does not add a global `/<slug>` catch-all for all pages on the site. That would create crawl noise and accidental collisions.


## Progress


- [x] Read `docs/plans.md` and captured the rules that matter for this plan.
- [x] Inspected the current routing and content indexing code in:
  - `app/lib/content/contentLibrary.ts`
  - `app/lib/content/ArticleHubManager.ts`
  - `app/(marketing)/(content)/[...segments]/page.tsx`
  - `app/lib/seo/SitemapGenerator.ts`
  - `app/lib/seo/SitemapContentRouteProvider.ts`
  - `proxy.ts`
- [x] Verified the current live behavior on 2026-04-11:
  - `https://projektbezkodu.pl/najlepsze-cms-no-code-seo` returns `404`
  - `https://projektbezkodu.pl/artykuly/cms-bez-kodu/najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage/` resolves normally
- [x] Verified with Serena that the generic content route only redirects after a known content entry is resolved.
- [x] Verified with Context7 against official Next.js 16 docs:
  - `permanentRedirect()` is valid in App Router page code and returns HTTP `308`
  - `next.config.ts` redirects run before rendering
  - Next.js recommends config redirects or Proxy for very large redirect sets, but a content-derived runtime redirect is still valid when the redirect target depends on repository content
- [x] Implemented a shared article category alias helper in `app/lib/content/articleCategoryAliases.ts`.
- [x] Implemented `app/lib/content/LegacyArticleRedirectManager.ts`.
- [x] Integrated the redirect manager into:
  - `app/(marketing)/(content)/[...segments]/page.tsx`
  - `app/(marketing)/(content)/artykuly/[...segments]/page.tsx`
- [x] Added `app/lib/content/LegacyArticleRedirectManager.test.ts`.
- [x] Updated the relevant docs:
  - `docs/frontmatter_and_routing.md`
  - `docs/content_editor_playbook.md`
  - `README.md`
- [x] Validated locally with unit tests, lint, build, and `curl`.
- [ ] Deploy and verify the production URLs.


## Surprises & Discoveries


- Observation: the article already has a legacy-looking slug field.
  Evidence: `content/artykuly/cms-bez-kodu/index6.md` contains `slug: najlepsze-cms-no-code-seo`, but its canonical `path` is `/artykuly/cms-bez-kodu/najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage/`.

- Observation: the generic content route only redirects when `ContentLibrary` finds a matching route entry first.
  Evidence: `app/(marketing)/(content)/[...segments]/page.tsx` calls `coordinator.build(segments)` and only calls `permanentRedirect(path)` after a `viewModel` exists. If no `viewModel` exists, it falls through to `notFound()` unless `ArticleHubManager.resolveLegacyCategoryPath()` succeeds.

- Observation: `ContentLibrary` currently creates aliases from two sources only:
  1. the source-derived path from the markdown file location,
  2. a slug created from the article title.
  Evidence: `app/lib/content/contentLibrary.ts` builds `aliases` from `derivedFromSource` and `titleSlugPath`. It does not add `frontmatter.slug` as an alias.

- Observation: the current article-level category alias support is narrow.
  Evidence: `app/lib/content/ArticleHubManager.ts` contains `resolveLegacyCategoryPath()` and a small `SLUG_ALIASES` map. This currently helps with paths such as `/dostepnosc/<article-slug>`, but it does not solve bare top-level slugs such as `/najlepsze-cms-no-code-seo`.

- Observation: sitemap generation already stays canonical-only.
  Evidence: `app/lib/seo/SitemapContentRouteProvider.ts` emits `route.path` for every content route, and `route.path` is the canonical path stored by `ContentLibrary`.

- Observation: the repository has a human-facing `/410` page, but there is no evidence yet that the app returns a true HTTP `410 Gone` status for arbitrary retired URLs.
  Evidence: `app/(marketing)/410/page.tsx` renders a status page component, but that alone does not prove that the HTTP response code is `410`.

- Observation: article-prefixed requests such as `/artykuly/cms-bez-kodu/<slug>` are handled by a dedicated article route, not by the generic `app/(marketing)/(content)/[...segments]/page.tsx` route.
  Evidence: `app/(marketing)/(content)/artykuly/[...segments]/page.tsx` has its own resolution flow using `ArticleHubManager`, `ContentLibrary`, and `ArticleDetailPage`.


## Decision Log


- Decision: solve this first as a deterministic article redirect feature, not as a broad site-wide slug catch-all.
  Rationale: a broad catch-all would create incorrect redirects when two content types reuse the same slug or when a slug-like path never had a real target.
  Date/Author: 2026-04-11 / Codex

- Decision: keep sitemap behavior canonical-only.
  Rationale: sitemap is the list of official URLs the site wants crawled. It should not advertise legacy aliases.
  Date/Author: 2026-04-11 / Codex

- Decision: use a dedicated runtime redirect manager backed by repository content instead of a large handwritten `next.config.ts` redirect list.
  Rationale: the redirect targets are derived from markdown content, and the site may have hundreds of article slugs. A content-derived manager stays in sync automatically and avoids a large static redirect table that a junior developer would have to maintain manually.
  Date/Author: 2026-04-11 / Codex

- Decision: keep unknown and ambiguous URLs as `404`.
  Rationale: if more than one target is plausible, redirecting is more dangerous than returning not found. A wrong redirect confuses users and search engines.
  Date/Author: 2026-04-11 / Codex

- Decision: do not implement a true `410` registry in this first change.
  Rationale: we do not yet have a vetted list of retired URLs from Search Console or another trusted source. The immediate problem is that old article-slug URLs which do have a real current target should redirect safely. A later follow-up can add an explicit `410` registry for no-target URLs if needed.
  Date/Author: 2026-04-11 / Codex


## Terms And Repository Map


This section defines the few terms used by this plan in plain language.

**Canonical URL**

The one official URL that the site wants users and search engines to treat as the real page address. In this repository, the canonical URL for markdown-backed content usually comes from frontmatter `path`.

Relevant files:

- `content/**` markdown frontmatter
- `app/lib/content/contentLibrary.ts`
- `app/lib/seo/SitemapContentRouteProvider.ts`

**Slug**

A short URL-safe identifier such as `najlepsze-cms-no-code-seo`. In this repository, many markdown files have a frontmatter `slug`, but that slug is not always the same as the last segment of the canonical `path`.

Relevant file:

- `content/artykuly/cms-bez-kodu/index6.md`

**Legacy alias**

An old or alternative URL that should redirect to the canonical URL. In this plan, a legacy alias is only valid when it maps to one exact published article.

Relevant files:

- `app/lib/content/contentLibrary.ts`
- `app/lib/content/ArticleHubManager.ts`

**Proxy**

In this repository, `proxy.ts` is a request-interception file that sees matching requests before page rendering. Right now it handles host normalization and malformed path recovery. This plan does not use Proxy for the first implementation, but it is named here because Next.js docs mention it as the place for very large redirect sets.

Relevant files:

- `proxy.ts`
- `app/proxy.test.ts`

**404**

HTTP status code meaning “the server does not have a page at this URL.”

**410**

HTTP status code meaning “the page used to exist but is intentionally gone.” This plan mentions `410` only as a future follow-up, not as the first implementation target.


## Current Architecture Summary


The important pieces of the current system are:

1. `app/lib/content/contentLibrary.ts`

   This class reads published markdown documents and builds the route lookup table for the generic content renderer. It stores one canonical route per document and may add aliases. Right now it adds aliases only from the source-derived path and a title-derived slug path.

2. `app/(marketing)/(content)/[...segments]/page.tsx`

   This App Router page handles many markdown-backed routes. It asks `ContentPageCoordinator` for a `viewModel`. If a view model exists and the requested path is not canonical, it redirects to the canonical path. If no view model exists, the request becomes `404` unless `ArticleHubManager` recognizes a special category alias case.

3. `app/lib/content/ArticleHubManager.ts`

   This class knows about article hubs under `/artykuly/<category>/...`. It already contains small category alias support such as `cms -> cms-bez-kodu` and `dostepnosc -> dostepnosc-cyfrowa`.

4. `app/lib/seo/SitemapContentRouteProvider.ts`

   This provider emits canonical content paths into `sitemap.xml`. We want to preserve this behavior.

The consequence is simple: when Google requests a legacy slug URL that is not already one of `ContentLibrary`'s known aliases, the site cannot resolve the entry and returns `404`.


## Target Behavior


After implementation, these behaviors must exist:

1. If a published article has a unique frontmatter slug and the user requests `/<slug>/`, the site returns HTTP `308` and redirects to the canonical article path.

   Example target:

       /najlepsze-cms-no-code-seo/
       -> 308
       -> /artykuly/cms-bez-kodu/najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage/

2. If a published article has a unique category-scoped slug and the user requests `/artykuly/<category>/<slug>/`, the site returns HTTP `308` and redirects to the canonical article path.

3. If a category alias exists, and the request uses the alias form such as `/cms/<slug>/`, the site returns HTTP `308` and redirects to the canonical article path.

4. `sitemap.xml` still lists only the canonical path, never the legacy alias.

5. If a requested legacy slug is unknown or collides with another valid route, the site does not guess. It returns `404`.


## Non-Goals


This plan does not implement these behaviors:

- blanket redirects for every content type,
- a global `/<slug>` redirect rule for tutorials, tools, resources, glossary terms, or templates,
- a manually maintained large redirect list in `next.config.ts`,
- a true `410 Gone` registry for retired URLs with no current target,
- changes to search indexing or sitemap inclusion rules beyond documentation and verification that canonical-only behavior remains intact.


## Plan Of Work


### Milestone 1: Add A Dedicated Legacy Article Redirect Manager


Create a new file:

- `app/lib/content/LegacyArticleRedirectManager.ts`

The job of this class is to answer one question:

> “Given a requested URL path expressed as `segments`, is there exactly one current published article that this old URL should redirect to?”

The manager should use existing repository data instead of scanning the file system itself in ad hoc ways. The recommended inputs are:

- `ArticleRepository` for published article summaries and their `slug` plus canonical `path`
- `ContentLibrary` for canonical route paths so alias collisions can be detected

The manager should expose one public method:

    resolve(segments: string[]): string | null

It should return the canonical article path when the redirect is safe, or `null` when the request should remain `404`.

The manager should build redirects using these rules:

1. Only published article summaries whose canonical path starts with `/artykuly/` are eligible.

2. The manager must parse the article category from the canonical path.

   Example:

       /artykuly/cms-bez-kodu/najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage/

   Category:

       cms-bez-kodu

3. For each eligible article, generate candidate legacy aliases:

   - bare slug:

         /<frontmatter.slug>/

   - category-scoped slug:

         /artykuly/<category>/<frontmatter.slug>/

   - category-alias slug, but only when a category alias is explicitly defined:

         /<category-alias>/<frontmatter.slug>/

4. Never generate a redirect alias that is identical to the canonical path.

5. Never generate a redirect alias that collides with:

   - an existing canonical route from `ContentLibrary`,
   - another generated alias for a different article,
   - or an ambiguous article slug match.

6. If a collision happens, skip that alias. The path must remain unresolved and therefore `404`.

To avoid duplicating category alias rules, extract the existing article category alias record into a shared helper file:

- `app/lib/content/articleCategoryAliases.ts`

This file should export:

- the alias map,
- a helper to resolve alias -> canonical category,
- and, if helpful, the reverse lookup canonical category -> alias list.

Then update:

- `app/lib/content/ArticleHubManager.ts`

so both managers use the same alias configuration.


### Milestone 2: Integrate The Redirect Manager Into The Request Paths That Can See Legacy Article URLs


Update:

- `app/(marketing)/(content)/[...segments]/page.tsx`
- `app/(marketing)/(content)/artykuly/[...segments]/page.tsx`

These are the correct places for the first implementation because:

- it already performs canonical redirects after content resolution,
- it already contains article-specific legacy logic via `ArticleHubManager`,
- and it avoids creating a second redirect stack in `proxy.ts` before we know we need one.
- the dedicated `/artykuly` route is the code path that handles `/artykuly/<category>/...` requests, so it must be updated alongside the generic route.

Required behavior:

1. Instantiate `LegacyArticleRedirectManager` near the existing `ContentLibrary`, `ContentPageCoordinator`, and `ArticleHubManager`.

2. In `generateMetadata()`, when `coordinator.build(segments)` returns nothing, ask the new manager for a canonical redirect target before returning `{}`.

   If the manager resolves a canonical target, return:

       {
         alternates: {
           canonical: resolvedPath,
         },
       }

   This keeps metadata aligned even for legacy requests.

3. In the page component, when `coordinator.build(segments)` returns nothing, resolve the new manager before falling through to `notFound()`.

   Recommended order:

   - `legacyArticleRedirectManager.resolve(segments)`
   - `articleHubManager.resolveLegacyCategoryPath(segments)`
   - `notFound()`

This ordering matters:

- the new manager covers article-slug redirects such as `/najlepsze-cms-no-code-seo/`,
- the existing hub manager still handles hub-only category aliases such as `/cms`.


### Milestone 3: Add Tests That Prove Safe Redirect Behavior


Create a new test file:

- `app/lib/content/LegacyArticleRedirectManager.test.ts`

Required unit tests:

1. A unique bare slug resolves to the canonical article path.

2. A unique `/artykuly/<category>/<slug>/` path resolves to the canonical article path.

3. A unique category-alias path such as `/cms/<slug>/` resolves to the canonical article path.

4. A request for the canonical path does not get reinterpreted as a legacy alias.

5. A bare slug collision returns `null`.

6. A generated alias that would collide with an existing canonical route returns `null`.

Update existing tests where appropriate:

- `app/lib/content/ArticleHubManager.test.ts`

  Keep current category alias behavior covered after moving the alias map to a shared file.

- `app/lib/content/ContentLibraryFrontmatterPath.test.ts`

  Confirm that canonical sitemap behavior is still based on canonical paths, not the new legacy redirect system.

Do not weaken any existing test that proves canonical routing behavior.


### Milestone 4: Document The Rules For Future Editors


Update these files:

- `docs/frontmatter_and_routing.md`
- `docs/content_editor_playbook.md`
- `README.md`

Required documentation points:

1. `frontmatter.path` remains the canonical URL source.

2. For article content, `frontmatter.slug` may now be used as a legacy redirect key, so editors should not change a published article slug casually.

3. Sitemap remains canonical-only.

4. Legacy article slug redirects are deterministic and only work when the mapping is unique.

5. Unknown and ambiguous legacy URLs intentionally remain `404`.

The documentation should explain this in simple language. A junior content editor should understand:

- “path is the official URL”
- “slug may help old Google-discovered URLs redirect”
- “changing a published slug can affect old redirect behavior”


### Milestone 5: Validate End To End


Run all commands from:

    /home/marcel/src/projektbezkodu

All Node commands in this repository must be prefixed with:

    source ~/.nvm/nvm.sh &&

Validation commands:

    source ~/.nvm/nvm.sh && npm test -- app/lib/content/LegacyArticleRedirectManager.test.ts app/lib/content/ArticleHubManager.test.ts app/lib/content/ContentLibraryFrontmatterPath.test.ts

Expected result:

- all named test files pass,
- no assertion shows that ambiguous aliases redirect.

Then run:

    source ~/.nvm/nvm.sh && npm run lint
    source ~/.nvm/nvm.sh && npm run build

Expected result:

- lint passes,
- build passes,
- `content:lint` still passes,
- no new route-family warnings appear.

Then run the local app:

    source ~/.nvm/nvm.sh && npm run dev

Use `curl` in a second terminal:

    curl -I http://127.0.0.1:3000/najlepsze-cms-no-code-seo
    curl -I http://127.0.0.1:3000/artykuly/cms-bez-kodu/najlepsze-cms-no-code-seo
    curl -I http://127.0.0.1:3000/cms/najlepsze-cms-no-code-seo
    curl -I http://127.0.0.1:3000/this-legacy-slug-does-not-exist

Expected behavior:

- the first three requests return HTTP `308` and point at:

      /artykuly/cms-bez-kodu/najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage/

- the last request returns `404`

Then confirm sitemap remains canonical-only:

    curl -s http://127.0.0.1:3000/sitemap.xml | rg 'najlepsze-cms-no-code-seo'
    curl -s http://127.0.0.1:3000/sitemap.xml | rg 'najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage'

Expected result:

- the first command prints nothing,
- the second command prints the canonical article URL.


## Concrete Implementation Notes


### Suggested File Changes


Create:

- `app/lib/content/articleCategoryAliases.ts`
- `app/lib/content/LegacyArticleRedirectManager.ts`
- `app/lib/content/LegacyArticleRedirectManager.test.ts`

Modify:

- `app/lib/content/ArticleHubManager.ts`
- `app/lib/content/ArticleHubManager.test.ts`
- `app/(marketing)/(content)/[...segments]/page.tsx`
- `docs/frontmatter_and_routing.md`
- `docs/content_editor_playbook.md`
- `README.md`


### Recommended Algorithm For `LegacyArticleRedirectManager`


The implementation should be explicit and easy to read, not clever.

Recommended internal steps:

1. Read published article summaries from `ArticleRepository`.

2. Read canonical content routes from `ContentLibrary`.

3. Build a `Set<string>` of canonical paths to protect against redirecting onto an already-real route.

4. For each article summary:

   - skip it if `summary.path` does not start with `/artykuly/`
   - parse the category from the canonical path
   - read the article slug from `summary.slug`
   - if the slug is blank, skip the entry

5. Build a candidate alias list for that article.

6. Insert each candidate into a `Map<string, string>` only when it is safe:

   - the alias is not identical to the canonical path,
   - the alias is not a canonical route,
   - and the alias has not already been claimed by another article.

7. When a conflict occurs, remove or skip that alias so the outcome is deterministic.

8. `resolve(segments)` should:

   - normalize to wrapped slashes,
   - look up the alias in the map,
   - and return the canonical path or `null`.

If helpful, the manager may also expose a small internal diagnostics method used only by tests. Do not expose a large operator API unless it materially improves clarity.


## Why This Plan Does Not Use `next.config.ts` Redirects First


This is an intentional design choice, not an omission.

Context7 confirms that `next.config.ts` redirects run before rendering, and that is useful for simple static redirect tables. However, in this repository the redirect targets depend on markdown content. A large handwritten redirect list would be harder for a junior developer to maintain than a content-derived manager that calculates redirects automatically from current content.

This plan therefore chooses the smallest correct implementation:

- use runtime content knowledge for article aliases,
- keep the logic explicit and testable in TypeScript,
- and avoid a manually curated redirect table.

If the redirect set later grows beyond what is comfortable to resolve in page code, a follow-up plan can move the same exact alias map logic into `proxy.ts`. That would be a second optimization step, not the first correctness step.


## Failure Signals


The implementation is incomplete or wrong if any of these happen:

- `https://projektbezkodu.pl/najlepsze-cms-no-code-seo` still returns `404`
- `sitemap.xml` starts listing legacy slug aliases
- a test proves two different articles compete for the same alias and the code still redirects anyway
- `curl -I` against an unknown slug returns `308` instead of `404`
- category alias behavior such as `/dostepnosc/<slug>` or `/cms` stops working
- build output starts failing because the new redirect code depends on browser-only APIs or request-only state


## Rollback / Safe Recovery


If the feature causes incorrect redirects:

1. Revert the new manager integration in:

   - `app/(marketing)/(content)/[...segments]/page.tsx`

2. Re-run:

       source ~/.nvm/nvm.sh && npm test
       source ~/.nvm/nvm.sh && npm run build

3. Redeploy the previous known-good commit.

This rollback is safe because the change is read-only routing logic. It does not touch persistent data, databases, or user-generated files.


## Outcomes / Retrospective


This section must be updated during implementation.

Local implementation is complete and verified.

Implemented files:

- `app/lib/content/articleCategoryAliases.ts`
- `app/lib/content/LegacyArticleRedirectManager.ts`
- `app/(marketing)/(content)/[...segments]/page.tsx`
- `app/(marketing)/(content)/artykuly/[...segments]/page.tsx`
- `app/lib/content/ArticleHubManager.ts`
- `app/lib/content/LegacyArticleRedirectManager.test.ts`
- `docs/frontmatter_and_routing.md`
- `docs/content_editor_playbook.md`
- `README.md`

Observed local behavior after implementation:

- `curl -I http://127.0.0.1:3000/najlepsze-cms-no-code-seo` returns `308` to `/artykuly/cms-bez-kodu/najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage/`
- `curl -I http://127.0.0.1:3000/artykuly/cms-bez-kodu/najlepsze-cms-no-code-seo` returns `308` to the same canonical article path
- `curl -I http://127.0.0.1:3000/cms/najlepsze-cms-no-code-seo` returns `308` to the same canonical article path
- `curl -I http://127.0.0.1:3000/this-legacy-slug-does-not-exist` returns `404`
- `curl http://127.0.0.1:3000/sitemap.xml` contains the canonical article URL and does not contain the legacy slug URL

Observed local validation:

- `source ~/.nvm/nvm.sh && npm run lint` passed
- `source ~/.nvm/nvm.sh && npm test` passed with 41 test files and 108 tests
- `source ~/.nvm/nvm.sh && npm run build` passed

Remaining work at the time of this update:

- deploy the change and verify the production URLs


## Change Note


2026-04-11: Created this ExecPlan after reading `docs/plans.md`, inspecting the routing and sitemap code with Serena, and verifying current Next.js redirect behavior with Context7. The plan chooses a deterministic article-only redirect manager because it is the smallest correct fix for the current Google 404 problem and is understandable for a junior developer.

2026-04-11: Updated the plan after implementation. The final implementation also touched `app/(marketing)/(content)/artykuly/[...segments]/page.tsx` because article-prefixed requests bypass the generic content route. Local validation steps and observed outputs were added so a future contributor can resume from the latest state without re-discovering them.
