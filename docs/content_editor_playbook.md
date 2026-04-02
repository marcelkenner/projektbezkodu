# Editor Workflow Playbook – ProjektBezKodu

Last updated: 2026-04-02 by Codex. Keep this guide in sync with feature changes (see `docs/website_repro_playbook.md` §11).

## 1. Before You Start

- Install project dependencies: `npm install`.
- Whenever you run dev/build commands in this repo, prefix with `source ~/.nvm/nvm.sh &&`.
- Editors work primarily in `content/` (Markdown) and `data/copy/` (JSON). Do not edit React components directly.
- Keep files <500 lines. Split long content into logical subdirectories.

## 2. Markdown Content Standards

1. Copy the frontmatter schema from `docs/brand/frontmatter_schema.md`.
2. Required keys per template:
   - `title`, `slug`, `path`, `draft`, `template`.
   - `hero.heading` + optional `hero.subheading`.
   - `seo` block for title/description.
   - `meta` for tutorials/comparisons (difficulty, duration, tools).
   - `taxonomy` for articles (categories + tags defined in copy JSON).
3. Validate syntax with `npm run content:lint` (this runs automatically before `npm run build`). It parses every markdown file, warns when `meta.summaryBullets` / `meta.primaryCta` are missing in article-driven folders, and points to the exact line when YAML is invalid. Set `CONTENT_LINT_STRICT=true` or append `--strict` if you want the warnings to fail CI.
4. Callouts: to render a highlighted tip/warning box, start a blockquote with `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, or `> [!CAUTION]` (the marker is removed from output).
5. Do not wrap article content in ` ```markdown ` fences. If you need a code block, use plain triple backticks or a real language such as ` ```ts ` or ` ```bash `.

## 3. Media Assets

- Store every hero/inline graphic in `public/media/`, mirroring the markdown file path. Example: `content/narzedzia/webflow/recenzja/index.md` ↔ `public/media/narzedzia/webflow/recenzja/hero.webp`.
- Reference assets via absolute URLs (`/media/...`). Do not import images inside markdown or React files.
- React-only pages follow the same structure under `public/media/pages/{app subpath}/` (e.g., `/media/pages/(marketing)/o-nas/team.webp`).
- Provide descriptive alt text inside frontmatter (`hero.image.alt`) or JSON copy so UI components remain accessible.

## 4. Articles (`content/artykuly/**`)

- Category hub pages **must** live under `content/artykuly/<kategoria>/index.md` with `type: hub` and `draft: false` (e.g. `content/artykuly/analityka/index.md` → `/artykuly/analityka/`).
- Published article pages stored under `content/artykuly/<kategoria>/...` must keep their canonical `path` under `/artykuly/<kategoria>/...`.
- If you need a direct article inside a category, create a descriptive file such as `content/artykuly/architektura/architektura-no-code-stabilnosc.md` with a path like `/artykuly/architektura/architektura-no-code-stabilnosc/`.
- If you need a subcategory, create a folder such as `content/artykuly/seo/audyty/`, put the subcategory hub in `index.md` with `type: hub`, and place article leaves below it (for example `content/artykuly/seo/audyty/checklista-audytu.md` → `/artykuly/seo/audyty/checklista-audytu/`).
- Do not publish a leaf article at `content/artykuly/<kategoria>/index.md`; that file is reserved for the hub.
- Avoid numbered filenames like `index6.md` for new article leaves. Use the article slug or another descriptive filename.
- Use descriptive `slug` values as well. `slug: index2` and similar placeholders are invalid.
- `npm run content:lint` now enforces the category hub contract, the `/artykuly/<kategoria>/...` canonical path prefix, and descriptive article slugs.
- Routing details (canonical URLs, aliases/redirects, hub vs leaf) live in `docs/frontmatter_and_routing.md`.
- Use `taxonomy.categories` and `taxonomy.tags` slugs from `data/copy/articles.json`.
- To introduce a new category/tag:
  1. Add it to the JSON with `slug`, `label`, optional `description`.
  2. Update `docs/brand/frontmatter_schema.md` and `docs/brand/metadata_mapping.md` if the field meaning changes.
  3. Inform devs so badges map correctly in `ArticleTaxonomyCatalog`.
- Frontmatter `meta.tools` surface as neutral badges; ensure slugs match `data/tools.json`.
- Featured categories drive navigation. Any change to `featuredCategories` in `data/copy/articles.json` updates both the main nav and footer (see `docs/brand/article_taxonomy_navigation.md` for limits and rollout steps). Coordinate with design before reordering.

## 5. Tutorials (`content/poradniki/**`)

- `meta.difficulty` controls the filter badge. Use consistent labels (e.g., `Łatwy`, `Średni`, `Zaawansowany`).
- `meta.tools` feeds the filter dropdown; list the primary tool slugs (e.g., `webflow`, `framer`).
- Filters autogenerate counts. After adding new tutorials, verify `/poradniki` displays the new options.
- If you need new difficulty labels, sync with the content team and update copy examples in `data/copy/tutorials.json`.
- Uzupełniaj `taxonomy.categories` i `taxonomy.tags` – korzystaj z definicji w `data/copy/tutorials.json`; tagi narzędzi mogą reuse slugów z `data/tools.json`.

## 6. Resources (`content/zasoby/**`)

- Używaj `template: "resource"`. Wymagane pola w `meta`: `format`, `duration` lub `time`, `topics`, `license`, `downloadHref`, `fileSize`, `checksum`. Bez nich listing nie pokaże kompletu metadanych.
- Treść sekcji trzymaj zgodnie z ASCII: „Co zawiera”, „Dla kogo”, „Jak korzystać”, „Licencja”, „Wersje”.
- Jeśli zasób posiada grafikę hero, uzupełnij `hero.image` lub meta (`heroImageSrc`, `heroImageAlt`).
- Po dodaniu nowego zasobu sprawdź `/zasoby` (filtry) oraz `/zasoby/<slug>` (CTA i sekcje).

## 7. Case studies (`content/przypadki-uzycia/**`)

- `template: "case-study"` + `meta` z polami: `industry`, `period`, `stack`, `summaryBullets`, `metrics` (min. jedna para `label/value`), `lessons`.
- Dodaj CTA (`meta.primaryCta`, `meta.secondaryCta`) i upewnij się, że wskazują na istniejące strony.
- Każdy case powinien zawierać sekcje: Problem, Rozwiązanie, Rezultat, Proces, Lekcje, Co dalej.
- Hero image: preferuj `hero.image` (z alt), fallback `meta.heroImageSrc`.
- Po publikacji zweryfikuj `/przypadki-uzycia` oraz sitemapę (kompozytor dodaje link automatycznie).

## 8. Comparisons (`content/porownania/**`)

- Ensure summary text (first paragraph) clearly differentiates the tools; it becomes the listing excerpt.
- Populate `meta.tools` for cross-linking in search results.
- Double-check hero subheading for clarity – trafia do keyword listy wyszukiwarki.
- Dodaj `taxonomy.categories` / `taxonomy.tags` zgodnie z `data/copy/comparisons.json`; wykorzystuj te same slug-i narzędzi co w `data/tools.json`.

## 9. Glossary (`content/glossary/**`)

- Each entry needs `title`, `slug`, `path`, `hero.heading`.
- Keep definitions concise; the first paragraph becomes the list description.
- The alphabetical navigation derives from the first letter of `title`. Avoid leading punctuation.
- To verify search: visit `/glossary?q=<term>` and confirm results.

## 10. Search Page Content

- `content/szukaj/index.md` stores metadata and page copy. Update hero text here; avoid editing the React page directly.
- Search results combine markdown summaries. When you add new content types, confirm their frontmatter includes descriptive hero subheadings and `meta` fields for better matching.

## 11. Copy JSON (`data/copy/**`)

- One file per section. Keys should be intention-revealing (`title`, `intro`, `emptyState`, etc.).
- JSON updates require `npm run lint` to ensure TypeScript types still align.
- For dynamic lists (tips, filters), use arrays of objects with explicit keys (e.g., `{ "title": "", "body": "" }`).
- When adjusting copy for filters or search, coordinate with developers to ensure UI components expect the same structure.

## 12. Narzędzie tygodnia (toast)

- Dane narzędzi trzymamy w `data/tools.json`. Uzupełnij pola `description`, `affiliateUrl`, `readMorePath`, `image` dla narzędzi, które chcesz promować.
- Aktualne „narzędzie tygodnia” ustawiamy, zmieniając `slug` w `data/tool-of-week.json`.
- Jeśli potrzebujesz nowej grafiki, dodaj SVG/PNG do `public/images/tools/` (64×64 px) i zaktualizuj ścieżkę w JSON.
- Po zmianach uruchom `npm run lint` i sprawdź, czy toast wyświetla się na stronie (prawy dolny róg, na desktopie).
- Dodaj wzmiankę w kanale contentowym, jeśli planujesz rotację narzędzia – toast jest widoczny na każdej stronie marketingowej.

## 13. Preview & QA Checklist

1. Run `source ~/.nvm/nvm.sh && npm run lint && npm run content:lint`.
2. Optionally `npm run build` to confirm the search index picks up new entries.
3. Spot-check:
   - `/artykuly` – new badges show correct labels.
   - `/poradniki` – filters include the new tutorial and counts update.
   - `/glossary` – search + anchors work for new terms.
   - `/szukaj` – query returns new content with correct type labels.
4. Capture any QA findings in `docs/operations/audit_checklist.md`.

## 14. Publishing Process

1. Set `draft: false` when ready to publish (content stays hidden while true).
2. Commit Markdown/JSON changes and request review from dev + content lead.
3. Update `docs/next_steps.md` if the work closes an outstanding item or requires follow-up tasks.
4. Notify stakeholders once merged; deployments follow the standard release process documented in `docs/website_repro_playbook.md`.

## 15. Lead Magnets (`data/copy/lead-magnets.json` / `/do-pobrania`)

- Każdy wpis wymaga pól `summaryBullets` (minimum trzy konkretne obietnice) oraz `cta`.
- `cta.primary` zwykle wskazuje `#lead-magnet-form`, dzięki czemu przyciski przewijają do formularza; `cta.secondary` może linkować do poradnika lub pokrewnego zasobu. Dodaj `helperText`, aby wytłumaczyć jak działa wysyłka (np. “Link wysyłamy też na e-mail”).
- Hero `bullets` nadal możesz wypełniać dla edytorów, ale UI korzysta z `summaryBullets` / `cta`. Nie kopiuj tam marketingowego lorem – ma to być zwięzły opis wartości.
- Po zmianach odpal `npm run content:lint` – ostrzeżenia o brakujących `summaryBullets`/CTA pojawią się natychmiast, zanim jeszcze zaczniesz budować stronę.
