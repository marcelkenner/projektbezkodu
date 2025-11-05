# Article Taxonomy Navigation Plan

Last updated: 2024-12-09 by Codex.

## 1. Objectives

1. Expose cornerstone article categories (Strategia, SEO, Wydajność) in global navigation to improve discovery.
2. Mirror the same taxonomy in the footer so category hubs remain reachable from any page.
3. Drive both navigation areas from copy-controlled data (`data/copy/articles.json`) to keep editors in the loop.
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
- Editors maintain this list alongside taxonomy definitions. Any addition must reuse the same slugs as `taxonomy.categories` in article frontmatter.
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

1. Add a dedicated column in `data/copy/footer.json`, e.g.:
   ```json
   {
     "heading": "Kategorie artykułów",
     "links": [
       { "href": "/artykuly/strategia", "label": "Strategia wdrożenia" },
       ...
     ]
   }
   ```
2. Generate the column automatically in `Footer` by merging existing copy columns with featured categories from the same `navigation` block (to avoid double entry).
3. Respect existing grid limits (three content columns + newsletter). If adding a fourth column breaks layout, convert to a two-column grid at narrower breakpoints.

## 5. Implementation Summary (2024-12-09)

- `data/copy/articles.json` now contains the `navigation` block with `menuLabel`, `featuredCategories`, `seeAllHref`, and `footerHeading`.
- `PrimaryNav` renders a `<details>`-based drop-down fed by `articlesNav` from `app/(marketing)/layout.tsx`. On mobile it stacks; on desktop it becomes an anchored panel.
- `Footer` injects a “Kategorie artykułów” column dynamically, keeping inline with navigation data.
- `articleTaxonomyCatalog` resolves labels/descriptions so copy edits and taxonomy stay synced.

## 6. QA Checklist

1. Verify drop-down keyboard behaviour (Tab into summary, Enter/Space to toggle, ESC closes).
2. Confirm links map to `/kategoria/<slug>/` or a valid override.
3. On mobile, ensure the drop-down stacks without clipping.
4. Footer grid remains ≤4 columns and wraps gracefully <48rem.

## 7. Documentation & Maintenance

- Editors adjust featured categories via `data/copy/articles.json` (documented in `docs/content_editor_playbook.md` §9).
- Whenever categories change, confirm corresponding `/kategoria/<slug>/` pages exist.
- Update this doc when altering layout patterns (e.g., mega-menu future upgrades).
