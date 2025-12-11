# Article Taxonomy Navigation Plan

Last updated: 2024-12-09 by Codex.

## 1. Objectives

1. Expose cornerstone article categories (Strategia, SEO, Wydajność) in global navigation to improve discovery.
2. Mirror the same taxonomy in the footer so category hubs remain reachable from any page.
3. Keep navigation copy-driven while the actual taxonomy is derived from `content/artykuly/*/index.md`.
4. Ensure changes preserve the mobile-first layout and remain under the 500-line file constraint.

## 2. Data Source & Governance

- Extend `data/copy/articles.json` with a `navigation` block:
  ```json
  "navigation": {
    "featuredCategories": [
      { "slug": "strategia", "label": "Strategia wdrożenia" },
      { "slug": "seo", "label": "SEO i widoczność" },
      { "slug": "wydajnosc", "label": "Wydajność i Core Web Vitals" }
    ],
    "seeAllLabel": "Wszystkie artykuły",
    "seeAllHref": "/artykuly"
  }
  ```
- Categories are discovered from `content/artykuly/*/index.md` (folder name = slug, draft allowed; exclude `template: legal`/`article`). Labels default to the folder name (title-cased) to stay short; editors only curate `navigation.featuredCategories`, `footerHeading`, and see-all labels in copy—slugs must match folder names to avoid 404s.
- Keep a maximum of five featured categories to avoid crowding the navigation.

## 3. Primary Navigation Pattern

1. Replace the static `/artykuly` link with a “mega link” drop-down (desktop) or expandable section (mobile).
2. Implementation outline:
   - Introduce a `NavMenu` component that accepts a label and an array of category links.
   - Populate categories from `articlesCopy.navigation.featuredCategories`.
   - Fallback to simple `/artykuly` link if no categories are defined.
3. Accessibility:
   - Use `<button>` with `aria-expanded` to toggle the menu.
   - Provide keyboard focus management (arrow keys within the menu, ESC to close).
4. Mobile:
   - Collapse into a stacked list (categories shown as indented links under “Artykuły”).
5. CTA:
   - Append a footer link inside the menu pointing to `seeAllHref`.

## 4. Footer Pattern

1. Footer builds the category column automatically from every `content/artykuly/*/index.md` entry (folder slug = `/kategoria/<slug>/`), laid out in a two-row grid on desktop. No manual link maintenance in `footer.json`.
2. Keep featured categories in navigation copy; footer always shows the full list.
3. Respect existing grid limits (three content columns + newsletter). The two-row category grid should prevent excessive vertical scroll.

## 5. Implementation Summary (2024-12-09)

- `data/copy/articles.json` now contains the `navigation` block with `menuLabel`, `featuredCategories`, `seeAllHref`, and `footerHeading`.
- `PrimaryNav` renders a `<details>`-based drop-down fed by `articlesNav` from `app/(marketing)/layout.tsx`. On mobile it stacks; on desktop it becomes an anchored panel.
- `Footer` injects a “Kategorie artykułów” column dynamically from the `content/artykuly` directory while still respecting navigation copy for headings/see-all links.
- `articleTaxonomyCatalog` now hydrates categories from markdown directories and applies copy overrides for labels/descriptions.

## 6. QA Checklist

1. Verify drop-down keyboard behaviour (Tab into summary, Enter/Space to toggle, ESC closes).
2. Confirm links map to `/kategoria/<slug>/` or a valid override.
3. On mobile, ensure the drop-down stacks without clipping.
4. Footer grid remains ≤4 columns and wraps gracefully <48rem.

## 7. Documentation & Maintenance

- Editors adjust featured categories via `data/copy/articles.json` (documented in `docs/content_editor_playbook.md` §9).
- Whenever categories change, confirm corresponding `/kategoria/<slug>/` pages exist.
- Update this doc when altering layout patterns (e.g., mega-menu future upgrades).
