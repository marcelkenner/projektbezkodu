# Next Steps Tracker

Central log of outstanding tasks after reproducing the ProjektBezKodu setup.

## Outstanding

1. Coordinate with legal counsel to validate the published privacy policy and terms before launch (handoff pack: `docs/operations/legal_review_checklist.md`).
2. Run accessibility, keyboard navigation, responsive (360/768/1024/1440), and performance (Lighthouse) audits noted in the brand plan (progress tracked in `docs/operations/audit_checklist.md`).
3. Optimise SVG logo assets under `brand/logo/` as part of the asset delivery checklist (await design delivery, see `docs/operations/svg_optimization_report.md`).
4. Add automated regression checks for the new search/taxonomy flows (end-to-end smoke via Playwright or similar) and document outcomes.
5. Uzupełnić checklistę QA dla nowych case studies i zasobów (dane źródłowe, grafiki hero, pliki do pobrania) — status raportuj w `docs/operations/audit_checklist.md`.
6. Zaplanować monitoring service workera (offline fallback) – dopisać procedurę w `docs/operations/audit_checklist.md` oraz ustalić właściciela alertów.

## Completed

- Finalised content taxonomy (categories, tags) for `content/artykuly`, with labels managed in `data/copy/articles.json` and badges rendered via `ArticleTaxonomyCatalog`.
- Delivered tool and difficulty filters for `/poradniki`, including `TutorialDirectory` helper class and copy-driven options.
- Added glossary search and alphabetical anchors on `/glossary`, powered by `GlossaryDirectory`.
- Replaced the `/szukaj` placeholder with a local `ContentSearchEngine` that indexes articles, tutorials, comparisons, and glossary entries.
- Shipped featured category navigation: PrimaryNav drop-down + footer column now read from `data/copy/articles.json`.
- Wdrożono hub zasobów, strony szczegółowe i rozbudowane case studies wraz z aktualizacją frontmatter schema.
