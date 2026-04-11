# Frontmatter & Routing (Content Pages)

Frontmatter is the YAML block at the top of each `content/**/*.md` file. It drives:

- Canonical URLs and redirects
- Hub vs leaf behavior for `/artykuly/**`
- SEO metadata (title/description/canonical/share image)
- Listings (cards, filters, taxonomy chips)

For the full list of supported keys, see `docs/brand/frontmatter_schema.md`.

## 1) Canonical URLs (`frontmatter.path`)

The **canonical URL** for a markdown page is taken from `frontmatter.path`.

Normalization rules (implemented in `app/lib/frontmatter.ts`):

- If a domain is included (e.g. `https://www.projektbezkodu.pl/...`), it is stripped.
- Multiple slashes collapse (e.g. `//artykuly///ai` → `/artykuly/ai`).
- A leading `/` is enforced.
- A trailing `/` is enforced.
- Any query/hash suffix is preserved (but avoid these in `path` unless you really need them).

If `path` is missing, the content router derives the canonical URL from the file location under `content/` (for example `content/artykuly/sciezki/webflow-30-dni.md` → `/artykuly/sciezki/webflow-30-dni/`).

Special rule for `content/artykuly/**`:

- Published markdown stored under `content/artykuly/<category>/...` must keep its canonical URL under `/artykuly/<category>/...`.
- `scripts/fix-artykuly-paths.mjs` normalizes those paths automatically and prefers the frontmatter `slug` when it has to derive a new article URL.

Additional route-family rules:

- Tutorials in `content/poradniki/**` must publish under `/poradniki/<slug>/`.
- Comparisons in `content/porownania/**` must publish under `/porownania/<slug>/`.
- Resources in `content/zasoby/**` must publish under `/zasoby/<slug>/`.
- Templates in `content/szablony/**` must publish under `/szablony/<slug>/`.
- Lead magnets in `content/do-pobrania/**` must publish under `/do-pobrania/<slug>/`.
- Glossary terms in `content/glossary/**` must publish under `/glossary/<slug>/`.
- Tool guides must publish under `/narzedzia/<tool>/...`, whether the source lives under `content/narzedzia-no-code/<tool>/**` or a top-level tool folder such as `content/instapage/**`.

Implementation note:

- `readMarkdownFile()` still normalizes a local fallback path from the slug for direct consumers.
- `ContentLibrary` ignores that generated fallback unless `frontmatter.path` was explicitly authored, so route canonicals still follow the source tree.

## 2) Routes, Aliases, Redirects (ContentLibrary)

`ContentLibrary` (`app/lib/content/contentLibrary.ts`) builds an index of every markdown page and exposes:

- `path` (canonical URL)
- `segments` (URL segments without leading/trailing slash)
- `document` (frontmatter + markdown body)

Routing behavior:

- **Canonical path selection**
  - Prefer explicit `frontmatter.path`.
  - Otherwise derive `/folder/subfolder/` from the file location under `content/`.
- **Article slug redirects**
  - Published article pages may also register deterministic legacy redirects from `frontmatter.slug`.
  - These redirects are article-only and only exist when one old URL maps to one published article.
  - Supported legacy article forms are `/<slug>/`, `/artykuly/<category>/<slug>/`, and selected top-level category aliases such as `/cms/<slug>/`.
  - If the slug is ambiguous or would collide with a real canonical route, the site keeps returning `404` instead of guessing.
- **Legacy aliases**
  - If the derived path differs from the canonical one, it becomes an alias.
  - A “title-slug” alias may be added by rewriting the last segment to `slugify(frontmatter.title)` (kept for backwards compatibility).
  - Tool pages are special: `/narzedzia/<tool>/...` with `type: tool` do not get title-slug aliases for the last segment.
- **Redirects**
  - App Router pages typically compare the requested path with the canonical `path` and `permanentRedirect()` when they differ.
  - Proxy (`proxy.ts`) recovers malformed merged redirect paths across site pages (for example `/<canonical>/, /<canonical>/`) and issues a clean `308` to the first canonical path before route matching.
  - Proxy also canonicalizes `www`/apex host variants using `Host` / `X-Forwarded-Host` and redirects to `CANONICAL_HOST` (fallback: `NEXT_PUBLIC_SITE_URL`).

Special case: `content/**/glowny/index.md`

- When deriving paths, `glowny/index.md` is treated as the parent route (so `.../glowny/index.md` derives to `.../`).
- An explicit alias route at `.../glowny/` is also registered.
- SEO policy: `/narzedzia/<tool>/glowny/` is intentionally indexable and emits explicit `robots: index,follow` metadata.

## 3) `template` vs `type` (what they mean here)

`template`:

- Used for content “kind” decisions (hero image fallbacks, filtering, and some content-lint rules).
- Example: `template: legal` pages are excluded from the `/artykuly` article repository.

`type`:

- Used for routing/UI decisions across multiple flows.
- Example: `type: hub` is routing-critical for `/artykuly` hub pages.
- Example: certain `type` values render with the full “article layout” in the generic renderer (`article`, `guide`, `playbook`, `review`).

## 4) `/artykuly/**`: hubs + leaf pages

This site supports:

- `/artykuly/<category>/` (category hub)
- `/artykuly/<category>/<subcategory>/` (subcategory hub)
- `/artykuly/<category>/<article>/` (category → article)
- `/artykuly/<category>/<subcategory>/<article>/` (subcategory → article)

Rules:

- **Category roots are always hubs:** `content/artykuly/<category>/index.md` is reserved for the category hub and must use `type: hub`.
- **Subcategory roots are hubs only when they group deeper articles:** `content/artykuly/<category>/<subcategory>/index.md` must use `type: hub` if published article pages live below that folder.
- **Hubs are explicit:** a directory under `content/artykuly/**` is a hub only if it has `index.md` with `type: hub` and `draft: false`.
- **Hub wins over leaf:** if a path can be interpreted as both, hub is rendered.
- **Depth limit:** `/artykuly` rejects paths deeper than 3 segments after `/artykuly/`.
- **Hub body rendering:** hub `index.md` body is ignored; hub pages show the hub intro, subcategory links when present, and the article-card listing.
- **Leaf pages:** under `/artykuly/`, anything that is not a hub (`type !== hub`) and not a draft is treated as an “article-style” leaf.

Authoring patterns:

- Direct article under a category: `content/artykuly/<category>/<descriptive-file>.md` or `content/artykuly/<category>/<article-folder>/index.md` → `/artykuly/<category>/<article>/`.
- Article inside a subcategory hub: `content/artykuly/<category>/<subcategory>/<descriptive-file>.md` → `/artykuly/<category>/<subcategory>/<article>/`.
- Do not keep a published article at `content/artykuly/<category>/index.md`; that URL belongs to the hub.

## 5) Drafts

- `draft: true` generally hides pages from listings.
- Use `draft: true` for unpublished content. `status: draft` is not part of the supported schema and should not be used.
- Some repositories return drafts only if **everything** in that section is draft (so staging previews still show content).

## 6) Validation (run before build)

- `npm run content:lint` parses and validates frontmatter across `content/**`.
- It also enforces route-family canonicals for tutorials, comparisons, resources, templates, glossary terms, lead magnets, and tool guides.
- It enforces `/artykuly` hub hierarchy: category roots must be hubs, subcategory roots with published descendants must be hubs, published article content under `content/artykuly/**` must keep canonical URLs under the matching `/artykuly/<category>/...` prefix, and article slugs cannot use placeholder values like `index2`.
- `_examples` fixtures are excluded from these production-path checks.

Fixer note:

- `npm run content:public:paths` runs `scripts/fix-public-content-paths.mjs` and corrects explicit canonical paths for the route families above without touching `_examples`.

## 7) Authoring checklist

- Always set `path` to the URL you want users (and Google) to index.
- Avoid changing `path` after publishing (treat it as an ID, not a label).
- Keep `slug` descriptive. Do not use placeholder values such as `index`, `index2`, or `index17`.
- For published articles, treat `slug` as a legacy redirect key. Changing it can break old Google-discovered URLs that currently redirect to the canonical `path`.
- Keep `hero.heading` and `seo.description` meaningful — they feed listing cards and metadata.
- Before publishing new `/artykuly/...` pages, ensure category `index.md` files are hubs and any subcategory folder with deeper published articles also has a hub `index.md`.
- Prefer descriptive filenames such as `architektura-no-code-stabilnosc.md` over numbered names such as `index6.md` when adding new article leaves.
- Run `source ~/.nvm/nvm.sh && npm run content:lint` before opening a PR.
