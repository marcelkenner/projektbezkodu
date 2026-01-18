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

If `path` is missing, the parser defaults to `/${slug}/` where `slug` is derived from the filename (or folder name for `index.md`).

## 2) Routes, Aliases, Redirects (ContentLibrary)

`ContentLibrary` (`app/lib/content/contentLibrary.ts`) builds an index of every markdown page and exposes:

- `path` (canonical URL)
- `segments` (URL segments without leading/trailing slash)
- `document` (frontmatter + markdown body)

Routing behavior:

- **Canonical path selection**
  - Prefer explicit `frontmatter.path`.
  - Otherwise derive `/folder/subfolder/` from the file location under `content/`.
- **Legacy aliases**
  - If the derived path differs from the canonical one, it becomes an alias.
  - A “title-slug” alias may be added by rewriting the last segment to `slugify(frontmatter.title)` (kept for backwards compatibility).
  - Tool pages are special: `/narzedzia/<tool>/...` with `type: tool` do not get title-slug aliases for the last segment.
- **Redirects**
  - App Router pages typically compare the requested path with the canonical `path` and `permanentRedirect()` when they differ.

Special case: `content/**/glowny/index.md`

- When deriving paths, `glowny/index.md` is treated as the parent route (so `.../glowny/index.md` derives to `.../`).
- An explicit alias route at `.../glowny/` is also registered.

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

- **Hubs are explicit:** a directory under `content/artykuly/**` is a hub only if it has `index.md` with `type: hub` and `draft: false`.
- **Hub wins over leaf:** if a path can be interpreted as both, hub is rendered.
- **Depth limit:** `/artykuly` rejects paths deeper than 3 segments after `/artykuly/`.
- **Hub body rendering:** hub `index.md` body is rendered above subcategory + article cards.
- **Leaf pages:** under `/artykuly/`, anything that is not a hub (`type !== hub`) and not a draft is treated as an “article-style” leaf.

## 5) Drafts

- `draft: true` generally hides pages from listings.
- Some repositories return drafts only if **everything** in that section is draft (so staging previews still show content).

## 6) Validation (run before build)

- `npm run content:lint` parses and validates frontmatter across `content/**`.
- It also enforces `/artykuly` hub hierarchy: if published leaf pages exist under a hub path, the corresponding hub `index.md` must exist, must not be draft, and must declare `type: hub`.

## 7) Authoring checklist

- Always set `path` to the URL you want users (and Google) to index.
- Avoid changing `path` after publishing (treat it as an ID, not a label).
- Keep `hero.heading` and `seo.description` meaningful — they feed listing cards and metadata.
- Before publishing new `/artykuly/...` pages, ensure required hub `index.md` pages exist and are `type: hub`.
- Run `source ~/.nvm/nvm.sh && npm run content:lint` before opening a PR.

