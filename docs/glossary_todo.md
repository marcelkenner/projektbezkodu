# Glossary Modernization Plan

> Status: TODO & owner pending assignment. Keep file under 500 lines (instruction compliance). Update this plan once glossary implementation starts.

1. **Audit current glossary flows**
   - Map markdown sources under `content/glossary/**`.
   - Document how `app/(marketing)/(content)/glossary` pages and `GlossaryRepository` currently build listings + detail views.
   - Note gaps (e.g., missing metadata, draft handling, mobile-first issues).
2. **Define single source of truth**
   - Decide whether glossary content stays in Markdown, JSON, or a hybrid (front matter + structured fields).
   - Establish front matter contract (title, slug, synonyms, CTA hooks, SEO fields).
   - Update spec in `docs/website_repro_playbook.md` once finalized.
3. **Refactor repository layer**
   - Extend or replace `GlossaryRepository` to load entries from the agreed storage format.
   - Ensure it exposes typed ViewModels (e.g., term definition, pronunciation, related terms).
   - Add caching or memoization hooks if needed for sitemap generation.
4. **Coordinator / ViewModel separation**
   - Introduce `GlossaryCoordinator` (navigation + business logic) and `GlossaryTermViewModel` (UI-ready data) per OOP guidelines.
   - Inject dependencies (repository, markdown renderer) to keep components reusable.
5. **Routing + rendering updates**
   - Confirm listing route (`/glossary`) and detail route (`/glossary/[slug]`) cover all scenarios (incl. nested terms or aliases).
   - Add fallback/redirect logic for alternate slugs, handle 404 copies gracefully.
   - Review mobile-first layout, ensure content length per file guidelines.
6. **Search + cross-linking**
   - Hook glossary entries into existing search index and inline tooltip components.
   - Provide helper for other pages to link to glossary definitions without manual anchors.
7. **QA + documentation**
   - Add tests/linters to catch missing required front matter.
   - Update `docs/website_repro_playbook.md` and `docs/content_editor_playbook.md` with the glossary workflow.
   - Confirm sitemap + RSS integrations include glossary entries where appropriate.

> Next check-in: Once the generic Markdown renderer is merged, revisit this plan and convert tasks into tracked issues.
