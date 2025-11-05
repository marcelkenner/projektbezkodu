# Editor Workflow Playbook – ProjektBezKodu

Last updated: 2024-12-09 by Codex. Keep this guide in sync with feature changes (see `docs/website_repro_playbook.md` §11).

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
3. Run `npm run lint` after edits to catch frontmatter syntax issues.

## 3. Articles (`content/artykuly/**`)

- Use `taxonomy.categories` and `taxonomy.tags` slugs from `data/copy/articles.json`.
- To introduce a new category/tag:
  1. Add it to the JSON with `slug`, `label`, optional `description`.
  2. Update `docs/brand/frontmatter_schema.md` and `docs/brand/metadata_mapping.md` if the field meaning changes.
  3. Inform devs so badges map correctly in `ArticleTaxonomyCatalog`.
- Frontmatter `meta.tools` surface as neutral badges; ensure slugs match `data/tools.json`.
- Featured categories drive navigation. Any change to `featuredCategories` in `data/copy/articles.json` updates both the main nav and footer (see `docs/brand/article_taxonomy_navigation.md` for limits and rollout steps). Coordinate with design before reordering.

## 4. Tutorials (`content/poradniki/**`)

- `meta.difficulty` controls the filter badge. Use consistent labels (e.g., `Łatwy`, `Średni`, `Zaawansowany`).
- `meta.tools` feeds the filter dropdown; list the primary tool slugs (e.g., `webflow`, `framer`).
- Filters autogenerate counts. After adding new tutorials, verify `/poradniki` displays the new options.
- If you need new difficulty labels, sync with the content team and update copy examples in `data/copy/tutorials.json`.
- Uzupełniaj `taxonomy.categories` i `taxonomy.tags` – korzystaj z definicji w `data/copy/tutorials.json`; tagi narzędzi mogą reuse slugów z `data/tools.json`.

## 5. Comparisons (`content/porownania/**`)

- Ensure summary text (first paragraph) clearly differentiates the tools; it becomes the listing excerpt.
- Populate `meta.tools` for cross-linking in search results.
- Double-check hero subheading for clarity-it feeds the search keyword list.
- Dodaj `taxonomy.categories` / `taxonomy.tags` zgodnie z `data/copy/comparisons.json`; wykorzystuj te same slug-i narzędzi co w `data/tools.json`.

## 6. Glossary (`content/glossary/**`)

- Each entry needs `title`, `slug`, `path`, `hero.heading`.
- Keep definitions concise; the first paragraph becomes the list description.
- The alphabetical navigation derives from the first letter of `title`. Avoid leading punctuation.
- To verify search: visit `/glossary?q=<term>` and confirm results.

## 7. Search Page Content

- `content/szukaj/index.md` stores metadata and page copy. Update hero text here; avoid editing the React page directly.
- Search results combine markdown summaries. When you add new content types, confirm their frontmatter includes descriptive hero subheadings and `meta` fields for better matching.

## 8. Copy JSON (`data/copy/**`)

- One file per section. Keys should be intention-revealing (`title`, `intro`, `emptyState`, etc.).
- JSON updates require `npm run lint` to ensure TypeScript types still align.
- For dynamic lists (tips, filters), use arrays of objects with explicit keys (e.g., `{ "title": "", "body": "" }`).
- When adjusting copy for filters or search, coordinate with developers to ensure UI components expect the same structure.

## 9. Narzędzie tygodnia (toast)

- Dane narzędzi trzymamy w `data/tools.json`. Uzupełnij pola `description`, `affiliateUrl`, `readMorePath`, `image` dla narzędzi, które chcesz promować.
- Aktualne „narzędzie tygodnia” ustawiamy, zmieniając `slug` w `data/tool-of-week.json`.
- Jeśli potrzebujesz nowej grafiki, dodaj SVG/PNG do `public/images/tools/` (64×64 px) i zaktualizuj ścieżkę w JSON.
- Po zmianach uruchom `npm run lint` i sprawdź, czy toast wyświetla się na stronie (prawy dolny róg, na desktopie).
- Dodaj wzmiankę w kanale contentowym, jeśli planujesz rotację narzędzia – toast jest widoczny na każdej stronie marketingowej.

## 10. Preview & QA Checklist

1. Run `source ~/.nvm/nvm.sh && npm run lint`.
2. Optionally `npm run build` to confirm the search index picks up new entries.
3. Spot-check:
   - `/artykuly` – new badges show correct labels.
   - `/poradniki` – filters include the new tutorial and counts update.
   - `/glossary` – search + anchors work for new terms.
   - `/szukaj` – query returns new content with correct type labels.
4. Capture any QA findings in `docs/operations/audit_checklist.md`.

## 11. Publishing Process

1. Set `draft: false` when ready to publish (content stays hidden while true).
2. Commit Markdown/JSON changes and request review from dev + content lead.
3. Update `docs/next_steps.md` if the work closes an outstanding item or requires follow-up tasks.
4. Notify stakeholders once merged; deployments follow the standard release process documented in `docs/website_repro_playbook.md`.
