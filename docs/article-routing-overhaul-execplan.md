# Purpose / Big Picture


This plan must be maintained in accordance with `docs/plans.md`. The goal is to make `/artykuly` routing unambiguous and understandable: a category URL must always be a hub page, and article pages must always live one level deeper as either `/artykuly/<category>/<article>/` or `/artykuly/<category>/<subcategory>/<article>/`.

After the change, a user who opens `/artykuly/architektura/` will see a category hub with links/cards, not the full article body. The moved article will live at a deeper URL such as `/artykuly/architektura/<article-slug>/`, and the same rule will apply to every published category.

You can observe success by running the local dev server, opening a migrated category URL, and confirming that it renders a hub listing instead of article prose, while the moved article still renders correctly at its new deeper path.


# Progress


- [x] (2026-04-02 12:06Z) Read `docs/plans.md`, `docs/frontmatter_and_routing.md`, and the current `/artykuly` route/content files.
- [x] (2026-04-02 12:06Z) Verified with Serena that the relevant implementation lives in `app/(marketing)/(content)/artykuly/[...segments]/page.tsx`, `app/lib/content/ArticleHubManager.ts`, `app/lib/content/repositories.ts`, `scripts/validate-content.mjs`, and `content/artykuly/**`.
- [x] (2026-04-02 12:06Z) Verified with Context7 that Next.js 16 App Router supports nested paths with a single catch-all route (`[...segments]`) and `generateStaticParams`.
- [x] (2026-04-02 12:06Z) Drafted this ExecPlan.
- [x] (2026-04-02 14:28Z) Refactored `scripts/validate-content.mjs` into an importable validator and added focused Vitest coverage for category roots, subcategory hubs, and canonical path enforcement.
- [x] (2026-04-02 14:28Z) Updated `scripts/fix-artykuly-paths.mjs` to normalize article canonicals into `/artykuly/<category>/...` and added test coverage.
- [x] (2026-04-02 14:28Z) Replaced published category-root leaf articles with true hub `index.md` files in the affected categories and moved the old articles to deeper URLs.
- [x] (2026-04-02 14:28Z) Updated `ArtykulyHubPage` to render visible hub intro copy and subcategory links.
- [x] (2026-04-02 14:28Z) Verified with `source ~/.nvm/nvm.sh && npm run content:lint` and targeted Vitest coverage.


# Surprises & Discoveries


- Observation: `/artykuly/architektura/` currently resolves to an article because `content/artykuly/architektura/index.md` is a published leaf article with `path: /artykuly/architektura` and no `type: hub`.
  Evidence: `content/artykuly/architektura/index.md` plus the fallback logic in `app/(marketing)/(content)/artykuly/[...segments]/page.tsx`.

- Observation: `scripts/validate-content.mjs` does not catch category-root leaf articles today.
  Evidence: its hub check starts only when the derived `/artykuly/...` path has at least 3 segments, so `/artykuly/architektura/` passes; `source ~/.nvm/nvm.sh && npm run content:lint` currently succeeds.

- Observation: subcategory support is only partially wired.
  Evidence: `app/lib/content/ArticleHubManager.ts` builds `subcategories`, but `app/(marketing)/(content)/artykuly/ArtykulyHubPage.tsx` renders only `articles`; `hub.module.css` already contains `.artykuly-hub__subcategories*` styles.

- Observation: hub lookup depends on folder names, not only on canonical frontmatter paths.
  Evidence: `ArticleHubManager.getHubDescriptor()` builds `href` from `segments`, and `ArticleHubManager.getHub()` looks up `content/artykuly/<segment>/index.md`. The folder `content/artykuly/automation/` currently points at `path: /artykuly/automatyzacja/`, so that category will break if we rely on hub routing without normalizing it.

- Observation: no live second-level subcategory hubs exist yet.
  Evidence: `rg -n "^type:\s*hub\s*$" content/artykuly/*/*/index.md` returns no matches.

- Observation: several published top-level categories still use `index.md` as the article itself.
  Evidence: current migration candidates are `ai`, `animacje`, `architektura`, `automation`, `badania`, `cms-bez-kodu`, `creative-tools`, `design-bez-kodu`, `dostepnosc-cyfrowa`, `ecommerce-bez-kodu`, and `przypadki-uzycia`.

- Observation: the larger breakage was not only category-root pages. A large portion of `content/artykuly/**` still published outside `/artykuly/...`, which would have left hub pages nearly empty even after converting root indexes to hubs.
  Evidence: before normalization, many leaf files under categories such as `architektura`, `animacje`, and `analityka` used canonicals like `/architektura/...` or `/plan-pomiarowy-no-code/` instead of `/artykuly/<category>/...`.


# Decision Log


- Decision: Reserve `index.md` exclusively for hub pages inside `content/artykuly/<category>/` and `content/artykuly/<category>/<subcategory>/`.
  Rationale: this is the simplest rule a junior developer can remember, and it removes the current ambiguity that sends category URLs to article pages.
  Date/Author: 2026-04-02 / Codex

- Decision: Keep the single catch-all route `app/(marketing)/(content)/artykuly/[...segments]/page.tsx` instead of splitting the route tree.
  Rationale: Context7 confirms this is a supported Next.js 16 pattern, and the repository already uses it successfully for mixed-depth paths.
  Date/Author: 2026-04-02 / Codex

- Decision: Fix the content model first, then tighten validation so the invalid shape cannot return.
  Rationale: the current bug is caused by content shape colliding with the routing contract; special-case route code would only hide the content problem.
  Date/Author: 2026-04-02 / Codex

- Decision: Keep top-level category folder names as the canonical `/artykuly/<category>/` URL segments and normalize article paths to those folder names.
  Rationale: this keeps the mental model simple for junior contributors and avoids adding a second source of truth on top of the filesystem-based hub lookup.
  Date/Author: 2026-04-02 / Codex

- Decision: Treat the old category-root article URLs as intentionally replaced by hub pages.
  Rationale: `/artykuly/<category>/` cannot be both the hub and the article. If preserving the exact old article URL is a hard business requirement, stop implementation and redesign the URL scheme before coding.
  Date/Author: 2026-04-02 / Codex


# Outcomes & Retrospective


The overhaul is implemented. Category roots now act as hubs, published article canonicals under `content/artykuly/**` stay under the matching `/artykuly/<category>/...` prefix, and the repository has automated checks that reject the old ambiguous shapes.

The main unavoidable tradeoff remains in place: category-root article URLs were repurposed as hub URLs, so those old URLs no longer represent article detail pages.


# Context and Orientation


In this repository, a “hub” means a listing page for a topic, and a “leaf” means a single article page. Hubs should exist at `/artykuly/<category>/` and optionally at `/artykuly/<category>/<subcategory>/`. Leaves should exist one level deeper at `/artykuly/<category>/<article>/` or `/artykuly/<category>/<subcategory>/<article>/`.

The current route entrypoint is `app/(marketing)/(content)/artykuly/[...segments]/page.tsx`. It first asks `ArticleHubManager` whether the requested segments identify a hub. If not, it falls back to article lookup through `ArticleHubManager.findArticleByPath()` and then `ContentLibrary`.

`ArticleHubManager` in `app/lib/content/ArticleHubManager.ts` finds hubs by looking for `index.md` files under `content/artykuly/**` and requiring `type: hub`. `ArticleRepository` in `app/lib/content/repositories.ts` lists article summaries and already excludes hubs. `ContentLibrary` in `app/lib/content/contentLibrary.ts` is the canonical content index and respects `frontmatter.path`.

The content problem was concentrated in `content/artykuly/**`. Top-level category `index.md` files were being used as articles, and many article canonicals did not stay under `/artykuly/<category>/...`. Both issues are now enforced by lint and normalized by the formatting script.

The previous UI gap in `app/(marketing)/(content)/artykuly/ArtykulyHubPage.tsx` has also been closed: hub pages now render the intro copy and subcategory links when available.


# Plan of Work


Milestone 1 is to lock the routing invariant in code and docs before migrating content. Update `scripts/validate-content.mjs` so it rejects category-root and subcategory-root leaf articles, requires any hub under `content/artykuly/**` to have a canonical `/artykuly/.../` path, and catches folder/path mismatches that would break `ArticleHubManager`. Add tests for these rules using the same temp-project style already used in `app/lib/content/FixMarketingMetaScript.test.ts`.

Milestone 2 is to complete the hub rendering path. Update `app/(marketing)/(content)/artykuly/ArtykulyHubPage.tsx` so category hubs render both subcategory links and the article grid, matching `docs/website_repro_playbook.md`. Keep `app/(marketing)/(content)/artykuly/[...segments]/page.tsx` as the single route entrypoint; only adjust it if a validation or canonicalization bug appears during migration.

Milestone 3 is the content migration. For every published top-level category that currently uses `index.md` as a leaf, move that article out of `index.md` into a deeper article path and replace the category `index.md` with a true hub file (`type: hub`, `draft: false`, canonical category path, short hero/SEO copy). Rename hub directories whose folder name does not match the public category slug before turning them into hubs. The minimum known rename is `content/artykuly/automation/` to `content/artykuly/automatyzacja/`. `content/artykuly/ai/index.md` must also be corrected because it is marked as a hub but points outside `/artykuly/`.

Milestone 4 is verification and documentation. Update `docs/frontmatter_and_routing.md`, `docs/content_editor_playbook.md`, and `docs/website_repro_playbook.md` so a junior editor can follow the new rule without reading code. Then run content lint, targeted tests, and manual browser checks for at least one migrated category and one subcategory fixture/test case.


# Concrete Steps


Work from `/home/marcel/src/projektbezkodu`.

1. Inventory the categories that still violate the hub rule.

    `cd /home/marcel/src/projektbezkodu`

    `rg -n "path:\\s*/artykuly/[^/]+/?$" content/artykuly/*/index.md`

    `rg -n "^type:\\s*hub\\s*$" content/artykuly/*/*/index.md`

2. Add validation coverage for the invalid shapes that currently pass.

    Update `scripts/validate-content.mjs`.

    Add a new Vitest file such as `app/lib/content/ValidateContentScript.test.ts` that creates temp `content/artykuly/**` trees and proves:
    - category `index.md` with leaf frontmatter is rejected,
    - subcategory `index.md` with child articles but no `type: hub` is rejected,
    - a `type: hub` file under `content/artykuly/**` must have a canonical `/artykuly/.../` path,
    - folder/path mismatch for a hub is rejected or at least reported clearly.

3. Extend existing article-routing tests.

    Update `app/lib/content/ArticleHubManager.test.ts` with a case that proves child hubs are discoverable.

    Update `app/lib/content/ArticleRepository.test.ts` with a case that proves `/artykuly/<category>/` is no longer treated as an article after migration, while `/artykuly/<category>/<article>/` still is.

4. Finish hub-page rendering.

    Update `app/(marketing)/(content)/artykuly/ArtykulyHubPage.tsx` to render `payload.subcategories` using the existing CSS hooks in `app/(marketing)/(content)/artykuly/hub.module.css`.

5. Migrate content category by category.

    For each affected category:
    - move the current article content out of `content/artykuly/<category>/index.md`,
    - give the article a deeper canonical path under that category,
    - replace `index.md` with hub frontmatter,
    - update any internal links or references that still point to the old root article URL.

    Use descriptive filenames for moved articles so a junior developer can identify them later. Do not keep adding anonymous `index6.md`-style names for migrated root articles.

6. Update docs.

    Edit `docs/frontmatter_and_routing.md`, `docs/content_editor_playbook.md`, and `docs/website_repro_playbook.md` to state plainly:
    - `index.md` under article categories is reserved for hubs,
    - top-level category URLs are always hubs,
    - subcategory URLs are hubs only when they group deeper articles,
    - article pages must live one segment deeper than the hub they belong to.


# Validation and Acceptance


Run these commands from `/home/marcel/src/projektbezkodu`:

`source ~/.nvm/nvm.sh && npm run content:lint`

`source ~/.nvm/nvm.sh && npm test -- app/lib/content/ArticleHubManager.test.ts app/lib/content/ArticleRepository.test.ts app/lib/content/ValidateContentScript.test.ts`

`source ~/.nvm/nvm.sh && npm run dev`

Acceptance is behavioral:

- `http://localhost:3000/artykuly/architektura/` renders a hub page, not the full article body.
- The moved architecture article renders at its new deeper URL and still has article metadata, TOC, related articles, and breadcrumbs.
- A category hub with child hubs shows subcategory links on screen, not only in data.
- `npm run content:lint` fails if someone reintroduces a published leaf article as `content/artykuly/<category>/index.md`.
- `npm run content:lint` fails if someone creates a `type: hub` page under `content/artykuly/**` whose canonical path does not live under `/artykuly/.../`.
- The targeted Vitest command passes.

Useful success signals:

    [content:lint] Validated <N> markdown file(s) – no front matter issues found.

    Test Files  3 passed
    Tests       <N> passed

Useful failure signals:

- `/artykuly/<category>/` still shows article prose.
- The moved article 404s or redirects back to the hub.
- A category with known folder/path mismatch, such as `automation`, does not resolve at its public slug.
- Subcategory links do not render even when `ArticleHubManager` reports them.


# Idempotence and Recovery


This migration should be executed category by category. After each category, run `npm run content:lint` and the targeted test command before moving on. That makes the work safe to pause and resume.

If one category migration goes wrong, restore only the affected category directory and the touched docs/tests from git, then rerun the same validation commands. Do not merge a partial migration where some categories use hub roots and others still use root articles without the stricter lint rules in place, because that would leave the repository in an ambiguous state again.

Folder renames must be done before or together with the hub activation for that category. If a hub folder rename lands without the corresponding content/path updates, route generation and hub lookup may disagree.


# Artifacts and Notes


Files that are expected to change:

- `app/(marketing)/(content)/artykuly/ArtykulyHubPage.tsx`
- `app/lib/content/ArticleHubManager.test.ts`
- `app/lib/content/ArticleRepository.test.ts`
- `scripts/validate-content.mjs`
- `app/lib/content/ValidateContentScript.test.ts` (new)
- `docs/frontmatter_and_routing.md`
- `docs/content_editor_playbook.md`
- `docs/website_repro_playbook.md`
- multiple files under `content/artykuly/**`

Known published categories that need migration work first:

- `ai`
- `animacje`
- `architektura`
- `automation` / future `automatyzacja`
- `badania`
- `cms-bez-kodu`
- `creative-tools`
- `design-bez-kodu`
- `dostepnosc-cyfrowa`
- `ecommerce-bez-kodu`
- `przypadki-uzycia`

When implementation starts, record the old root article URL and the new deeper article URL for each migrated category inside this plan’s `Decision Log` or `Artifacts and Notes`. That mapping is operationally important because the old article URL is being repurposed as the hub.

Plan change note: updated on 2026-04-02 after implementation. The content model now enforces category hubs at `index.md`, deeper leaf URLs, and `/artykuly/<category>/...` canonical prefixes for published article content.


# Interfaces and Dependencies


Next.js dependency: the site uses Next.js `16.0.10`. Context7 confirms that App Router catch-all segments (`[...segments]`) and `generateStaticParams` support nested arrays of path segments under one route, so the existing route file can support both category and subcategory hierarchies without a route split.

Repository dependencies:
- `app/(marketing)/(content)/artykuly/[...segments]/page.tsx` is the route entrypoint.
- `app/lib/content/ArticleHubManager.ts` decides whether a path is a hub and discovers child hubs.
- `app/lib/content/repositories.ts` decides which markdown entries are treated as articles.
- `app/lib/content/contentLibrary.ts` is the canonical route index for markdown files.
- `scripts/validate-content.mjs` is the enforcement point that must stop invalid content shapes before build time.

Content-authoring dependency: after this migration, editors must understand one simple rule. Inside `content/artykuly/**`, `index.md` names a hub, not a leaf article. If they need a single article under a category, that article must live deeper than the category hub.
