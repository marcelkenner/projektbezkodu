# Article Experience Task Log

> Objective: implement the frontmatter-driven article experience described in the latest ASCII designs across every template (articles, comparisons, tutorials, tool guides, fallback content pages). The checklist below is intentionally granular so no prerequisite is skipped.

## A. Baseline Audit (must be completed before writing code)

1. **Inventory templates**
   - List every route file rendering long-form content:  
     `app/(marketing)/(content)/artykuly/[slug]/page.tsx`,  
     `app/(marketing)/(content)/narzedzia/[slug]/page.tsx`,  
     `app/(marketing)/(content)/narzedzia/[slug]/[...segments]/page.tsx`,  
     `app/(marketing)/(content)/porownania/[slug]/page.tsx`,  
     `app/(marketing)/(content)/poradniki/[slug]/page.tsx`,  
     `app/(marketing)/(content)/[...segments]/page.tsx`,  
     `app/(marketing)/(content)/do-pobrania/[slug]/page.tsx`,  
     `app/(marketing)/(content)/przypadki-uzycia/[slug]/page.tsx`, etc.
   - Confirm each template’s current props (frontmatter usage) and note missing pieces versus the ASCII spec.

### A1. Template Inventory (completed 2025-11-17)

| Route / URL pattern                                                      | File                                                                | Source of truth                                     | Current implementation snapshot                                                                                                                                                                                                                     | Gaps vs ASCII plan                                                                                                                                                                                           |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/artykuly/[slug]`                                                       | `app/(marketing)/(content)/artykuly/[slug]/page.tsx`                | `ArticleRepository` (markdown frontmatter)          | Breadcrumb nav, hero title + optional subheading, meta line (reading time, dates, author), affiliate disclosure, share panel, TOC, CTA block (primary/secondary), author box, related articles, prev/next nav, ArticleStructuredData + Review data. | Missing meta badges (difficulty/duration/categories), summary bullets, taxonomy chips, hero badge row, share metadata not reused for chips.                                                                  |
| `/narzedzia/[slug]`                                                      | `app/(marketing)/(content)/narzedzia/[slug]/page.tsx`               | `ContentLibrary` (generic Markdown) + `ToolCatalog` | Breadcrumbs, hero heading/subheading, published date, share panel, TOC, prose body, structured data for SoftwareApplication.                                                                                                                        | No meta badges (categories/difficulty/duration), no summary bullets, no CTA block (uses view model but not frontmatter CTAs), no taxonomy chips, no pricing/metrics cards yet.                               |
| `/narzedzia/[slug]/[...]`                                                | `app/(marketing)/(content)/narzedzia/[slug]/[...segments]/page.tsx` | `ContentLibrary`                                    | Shares article layout (breadcrumbs, share panel, TOC).                                                                                                                                                                                              | Same missing elements as tool hub: no badges, no summary bullets, no CTA group, no taxonomy chips.                                                                                                           |
| `/porownania/[slug]`                                                     | `app/(marketing)/(content)/porownania/[slug]/page.tsx`              | `ComparisonRepository` (markdown)                   | H1 + optional hero subheading, category/tag badges, prose body, structured data (Article + optional Review).                                                                                                                                        | Lacks share panel, TL;DR callout from summary bullets, meta badges (difficulty/duration), CTA block, TOC, taxonomy chips beyond initial badges, FAQ/related sections.                                        |
| `/poradniki/[slug]` (pillar tutorials)                                   | `app/(marketing)/(content)/poradniki/[slug]/page.tsx`               | `TutorialRepository` + Pillar configs               | Custom pillar layout with TOC sidebar, featured/journey sections, download card, badges for categories/difficulty/duration, HowTo + FAQ schema.                                                                                                     | No share panel, no summary bullet callout, CTA buttons limited to download section (not frontmatter-driven), missing taxonomy chips near hero, no consistent CTA group at article bottom.                    |
| Generic fallback `/[...segments]`                                        | `app/(marketing)/(content)/[...segments]/page.tsx`                  | `ContentLibrary`                                    | Determines article layout via `shouldUseArticleLayout`; renders breadcrumbs (now), hero title/subheading, optional date, TOC + body.                                                                                                                | No share panel, no meta badges, no CTA group, no taxonomy chips, no summary bullets, metadata line still plain text.                                                                                         |
| Resource detail `/zasoby/[slug]`                                         | `app/(marketing)/(content)/zasoby/[slug]/page.tsx`                  | `ResourceRepository` + `ResourceDirectory`          | Hero title/subheading, hero image, topics list, badge row, download CTA + file metadata, TOC + aside info, structured data.                                                                                                                         | Lacks share panel, taxonomy chips linking to `/tag`, no summary bullets, no standard CTA group beyond download, no badges for difficulty/duration even when present.                                         |
| Case study `/przypadki-uzycia/[slug]`                                    | `app/(marketing)/(content)/przypadki-uzycia/[slug]/page.tsx`        | `CaseStudyRepository`                               | Breadcrumbs, hero with meta stats, summary + metrics cards, prose body, stack tags, lessons list, CTA footer.                                                                                                                                       | No share panel, no taxonomy chips linking back to categories/tags, no TOC for long content, CTA hardcoded from copy (not frontmatter), no summary bullet component near top (current summary list is lower). |
| Lead magnet `/do-pobrania/[slug]`                                        | `app/(marketing)/(content)/do-pobrania/[slug]/page.tsx`             | `LeadMagnetCatalog` (JSON)                          | Hero with bullets + image, form card with inputs.                                                                                                                                                                                                   | No share panel, no breadcrumbs, no badges/metadata, no summary bullets, no frontmatter (JSON) mapping to new components.                                                                                     |
| Resource hub fallback `/narzedzia/[slug]/[...segments]` (already listed) | –                                                                   | –                                                   | –                                                                                                                                                                                                                                                   | –                                                                                                                                                                                                            |

Notes:

- Verified each file manually (see snippets in shell history).
- Tool + fallback routes now share breadcrumbs and share panels, but other templates lag behind the ASCII spec.
- No template besides `/artykuly/[slug]` currently renders taxonomy chips, summary bullets, or unified CTA components.

### A2. Frontmatter Contract Verification (completed 2025-11-17)

Commands used (run from project root, prefixed with `source ~/.nvm/nvm.sh &&`):

- `rg -l "summaryBullets" content` → only 12 files (case studies + `narzedzia/webflow/**`) currently define summary bullets.
- `rg -l "primaryCta" content` / `rg -l "secondaryCta" content` → CTAs appear almost exclusively in case studies and two tool guides; generic articles, comparisons, tutorials lack them.
- `rg -l "difficulty" content` + `rg -l "duration" content` → mostly tutorials (`content/poradniki/**`), three comparisons, and a handful of resource pages supply these fields.
- `rg -l "metrics:" content` → only case studies use `meta.metrics` today.
- `rg -l "review:" content` → just `content/porownania/framer-vs-wordpress/index.md` defines a review block.
- `rg -l "subheading:" content` (basic check) confirmed that hero subheadings exist on tutorials, comparisons, resource hubs, but not necessarily on every article (needs editorial follow-up).

Findings:

1. **Summary bullets scarce** – absent from regular articles and tutorials, so we must either add editor guidance or implement graceful fallbacks (hide the block when field missing).
2. **CTA fields limited** – nearly all articles/comparisons currently lack `meta.primaryCta` / `secondaryCta`. Implementation must treat CTAs as optional and log missing data so editors can backfill.
3. **Difficulty/duration inconsistent** – tutorials and a couple of comparisons/resource pages include the fields, but the majority of articles/tools do not. Badge components must be optional and editor docs should instruct teams to supply these values going forward.
4. **Metrics/review data specialized** – only case studies deliver `meta.metrics`; only one comparison exposes `meta.review`. Schema builders must short-circuit when data is absent.
5. **Taxonomy presence** – most markdown files already define `taxonomy.categories` / `taxonomy.tags` (verified manually via sampling), but we still need fallbacks (e.g., skip chip rendering if arrays missing).

Action: treat every enhancement as opt-in until content is updated. Update the editor playbook after implementation to encourage filling the missing frontmatter keys. 2. **Frontmatter contract verification**

- Review `content/**/*.md` samples to confirm the presence (or absence) of: `hero.subheading`, `meta.difficulty`, `meta.duration`, `meta.summaryBullets`, `meta.primaryCta`, `meta.secondaryCta`, `meta.metrics`, `meta.review`, `taxonomy.categories`, `taxonomy.tags`.
- Document any content gaps so editors can backfill later (separate ticket).

3. **Design reference alignment**
   - Re-read `docs/asci-designs/single-article.md`, `comparison-page.md`, `tool-guide.md`.
   - Extract explicit UI requirements (badges, share panel placement, CTA ordering, non-sticky TOC) into a short specification to reference while coding.

## B. Shared Components

4. **Meta badge component**
   - Create a reusable `ArticleMetaBadges` component under `app/ui/` that accepts categories, difficulty, duration, and renders pill-style badges with accessible labels.
   - Ensure support for optional values (only render what exists) and dark/light themes.

5. **Summary bullets block**
   - Implement `ArticleSummaryBullets` that receives `meta.summaryBullets` (string array).
   - Render as an unordered list near the top of the article body with the correct typography.
   - Add defensive checks so empty arrays don’t produce extra spacing.

6. **CTA block**
   - Build `ArticleCtaGroup` that consumes `meta.primaryCta` / `meta.secondaryCta` (frontmatter action links).
   - Apply button variants (primary/secondary), respect `rel` attributes (force `rel="sponsored noopener"` when affiliate flag is true).
   - Include an optional helper text slot for template-specific notes (e.g., downloads).

7. **Taxonomy chips**
   - Add a chip list component for categories and tags linking to `/artykuly/[slug]/` and `/tag/[slug]/`.
   - Use `TextNormalizer.slugify` to derive slugs when they are missing from taxonomy entries.

### B Progress (2025-11-17)

- **B4 Meta badge component** – Implemented `app/ui/articles/ArticleMetaBadges.tsx` with optional category/difficulty/duration badges and link support.
- **B5 Summary bullets block** – Added `ArticleSummaryBullets` to render optional key takeaways.
- **B6 CTA block** – Created `ArticleCtaGroup` with safe rel handling for affiliate links.
- **B7 Taxonomy chips** – Delivered `TaxonomyChips` component for linking categories/tags.  
  All components exported via `app/ui/index.ts` and styled in `app/ui/ui.css`.

## C. Template Implementation

## C. Template Implementation

8. **Articles (`/artykuly/[slug]`)**
   - Inject new components: breadcrumbs (already done), meta badges, summary bullets, CTA block, taxonomy chips.
   - Confirm share panel renders immediately below the header.
   - Ensure author resolution uses frontmatter meta + copy fallback.
   - Add `meta.updatedAt` display using `<time>`.  
     ✅ Updated 2025-11-17 (`app/(marketing)/(content)/artykuly/[slug]/page.tsx`).

9. **Generic markdown route (`/(content)/[...segments]`)**
   - Mirror the article layout for `viewModel.shouldUseArticleLayout()`.
   - Pull categories/tags/difficulty/duration from the view model and render badges + summary bullets when available.
   - Make CTA block optional (only when frontmatter provides CTAs).  
     ✅ Completed 2025-11-17: share panel, meta badges, summary bullets, CTA, taxonomy chips added for both article and non-article layouts via `ContentPageViewModel` helpers.

10. **Comparisons (`/porownania/[slug]`)**
    - Apply hero subheading, meta badges, TL;DR callout (summary bullets), share panel, CTA group.
    - After the comparison table, add taxonomy chips + related comparisons (based on taxonomy).
    - Add FAQ block if markdown contains an FAQ section; wire to FAQ schema.

11. **Tutorials (`/poradniki/[slug]`)**
    - Same hero + badge treatment.
    - Highlight `meta.tools` (if defined) as a pill list.
    - Display `meta.summaryBullets` as “Co zrobisz w tym poradniku?” near the top.
    - CTA group: primary should point to the actionable step (frontmatter) and secondary to downloads/resources.  
      ✅ Updated 2025-11-17: hero uses ArticleMetaBadges, share panel + summary bullets added, CTA group + taxonomy chips render under the article. Still need to surface `meta.tools` and integrate pricing/lead magnet specific badges later.

12. **Tool guides (`/narzedzia/[slug]` and nested segments)**
    - Already share the article layout, but add:
      - Pricing snapshot card (from `meta.metrics`).
      - “Kiedy wybrać / kiedy nie” lists derived from markdown headings or future frontmatter fields.
      - Tool logo strip using `toolCatalog` data if available.
    - Ensure nested articles reuse share panel, meta badges, summary bullets, taxonomy chips.  
      ✅ Hub + detail polished 2025-11-17: logo strip fed by `ToolCatalog.logo`, hub cards now show strengths as ArticleSummaryBullets, CTA group (guide + zewnętrzny link) with taxonomy chips + pricing/meta row, and detail pages gained ArticleMetaBadges + CTA group + taxonomy chips. 🔄 Still pending: dedicated pricing snapshot + automated scenario extraction.

13. **Downloads / Templates (`/do-pobrania`, `/szablony`)**
    - Display file metadata (`meta.fileSize`, `meta.license`, `meta.checksum`) near the hero.
    - CTA block: primary = download link (`meta.downloadHref`), secondary optional.
    - Include share panel for visibility even on gated assets.  
      ✅ Lead magnet pages (2025-11-17) now reuse ArticleSummaryBullets + ArticleCtaGroup (scrolled to the form anchor) alongside the share panel; templates already met the requirements. 🔄 File metadata UI still depends on content fields being populated.

14. **Case studies / resources (`/przypadki-uzycia`, `/zasoby`)**
    - Add meta badges for industry/period/stack when present.
    - Render `meta.metrics` as KPI cards near the top.
    - Keep share panel consistent.
      ✅ Resource detail upgraded 2025-11-17 with share panel, summary bullets, standardized CTA group, taxonomy chips, and ArticleMetaBadges.  
      ✅ Case studies updated 2025-11-17 with share panel, hero meta badges, summary bullets, CTA group reuse, and taxonomy chips (existing summary/metrics/stack sections retained).

## D. Metadata & SEO

15. **`ContentPageViewModel` enhancements**
    - Already emits OG/Twitter with images; extend to include `seo.keywords`, `seo.noindex`, `seo.nofollow`.
    - When `meta.review` exists, inject Review schema automatically.
    - Provide helper methods for CTA data, summary bullets, taxonomy so templates don’t re-parse frontmatter.

16. **Breadcrumb schema**
    - Ensure every page includes `BreadcrumbList` JSON-LD (ArticlePage already does; extend fallback templates).

## E. Content & QA

17. **Content validation script**
    - Update `scripts/validate-content.mjs` so it warns when a template-specific frontmatter key is missing (e.g., comparison without `summaryBullets`).
    - Provide actionable error messages for editors.
      ✅ Updated 2025-11-17 – script now surfaces warnings for missing `meta.summaryBullets` / `meta.primaryCta` in article-driven sections and supports `--strict` / `CONTENT_LINT_STRICT=true` to fail on warnings.

18. **Manual QA**
    - For each template, open representative URLs (e.g., `/artykuly/alternatywy`, `/porownania/webflow-vs-framer`, `/poradniki/webflow-blog-krok-po-kroku`, `/narzedzia/webflow`, `/narzedzia/webflow/recenzja`).
    - Verify: badges render, share panel visible, TOC static, CTA buttons exist, taxonomy chips link correctly, OG tags show hero image via social debuggers.

19. **Docs & handoff**
    - Update `docs/website_repro_playbook.md` and `docs/content_editor_playbook.md` to explain which frontmatter fields power badges, summaries, CTAs, and when they are required.
    - Share the task progress in this file and mark completed items with dates to keep stakeholders informed.

## F. Tracking & Updates

20. **Progress updates**
    - After finishing each numbered item, edit this file to note the completion date, branch/PR, and any follow-up work.
    - Keep entries concise but explicit so another developer can pick up midstream without rereading code.

**Reminder:** treat every assumption as suspect—verify field availability in both code and content before implementing UI changes. If data is missing, either introduce sensible fallbacks or create a separate content ticket; do not silently omit required UI. 10. **Comparisons (`/porownania/[slug]`)**

- Apply hero subheading, meta badges, TL;DR callout (summary bullets), share panel, CTA group.
- After the comparison table, add taxonomy chips + related comparisons (based on taxonomy).
- Add FAQ block if markdown contains an FAQ section; wire to FAQ schema.  
  ✅ Initial pass 2025-11-17: meta badges, share panel, summary bullets, CTA group, taxonomy chips + related links landed. FAQ extractor now renders an in-body block styled via `.comparison-faq`. 🔄 Future idea: richer comparison table callouts.
