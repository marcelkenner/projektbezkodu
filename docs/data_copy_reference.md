# `data/copy` Reference

Single source of truth for what lives inside each JSON file under `data/copy/`, why it exists, and which runtime surfaces rely on it. Update this document whenever you add, rename, or deprecate a copy file so designers and developers can locate their inputs quickly.

Each entry lists:
- **Purpose** – the page/feature the copy powers.
- **Key Fields** – notable top-level keys editors should keep stable.
- **Primary Consumers** – components or helpers that call `getCopy("<section>")` (or the catalog that wraps it) today.
- **Notes** – quirks, fallbacks, or pending work.

### `about.json`
- **Purpose**: Drives the `/o-nas` (“About”) marketing page.
- **Key Fields**: `seo`, `hero`, `purpose`, `team`, `principles`, `services`, `cta`, `organization`.
- **Primary Consumers**: `app/(marketing)/o-nas/page.tsx`.
- **Notes**: Keep CTA labels aligned with `global.ctas` when possible, because both surface in hero/nav contexts.

### `accessibility.json`
- **Purpose**: Legal accessibility statement (`/deklaracja-dostepnosci`).
- **Key Fields**: `seo`, `hero`, `sections`.
- **Primary Consumers**: `app/(marketing)/deklaracja-dostepnosci/page.tsx`.
- **Notes**: Sections appear in order; add anchors in copy if you need deep-linking.

### `affiliate.json`
- **Purpose**: Affiliate policy / disclosure page (`/zasady-afiliacji`).
- **Key Fields**: `seo`, `hero`, `sections`, `contact`.
- **Primary Consumers**: `app/(marketing)/zasady-afiliacji/page.tsx`.
- **Notes**: `contact` renders the closing card; keep it in sync with `contact.notice`.

### `articles.json`
- **Purpose**: Article listing, detail helpers, taxonomy, and author metadata.
- **Key Fields**: `title`, `intro`, `listing`, `emptyState`, `taxonomy`, `authors`, `navigation`.
- **Primary Consumers**: `app/(marketing)/(content)/artykuly/page.tsx`, `app/(marketing)/(content)/artykuly/[slug]/page.tsx`, `app/(marketing)/(content)/tag/[slug]/page.tsx`, `app/(marketing)/autor/[slug]/page.tsx`, `app/ui/Footer.tsx`, `app/lib/content/articleTaxonomy.ts`, `app/lib/content/authorDirectory.ts`.
- **Notes**: `taxonomy.categories/tags` feed multiple catalogs; add new slugs here *before* referencing them in markdown frontmatter.

### `case-studies.json`
- **Purpose**: Case study hero copy, section headings, and fallback CTAs.
- **Key Fields**: `seo`, `hero`, `sections`, `cta`.
- **Primary Consumers**: `app/(marketing)/(content)/przypadki-uzycia/[slug]/page.tsx`.
- **Notes**: CTA labels should steer readers back to pillar guides per FTC guidance.

### `category-hubs.json`
- **Purpose**: Configures `/kategoria/[slug]` hub pages (hero, quick links, featured cards, downloads).
- **Key Fields**: `default` plus one entry per category slug (e.g., `strategia`), each matching `CategoryHubConfig`.
- **Primary Consumers**: `app/(marketing)/(content)/kategoria/[slug]/page.tsx`.
- **Notes**: `default` provides fallbacks; only override the fields that differ per category.

### `comparisons.json`
- **Purpose**: Comparison listing filters and taxonomy.
- **Key Fields**: `title`, `intro`, `emptyState`, `taxonomy`.
- **Primary Consumers**: `app/(marketing)/(content)/porownania/page.tsx`, `app/lib/content/comparisonTaxonomy.ts`.
- **Notes**: Populate `taxonomy` so comparison cards can auto-group by tool or use case.

### `contact.json`
- **Purpose**: Contact instructions replacing the legacy form.
- **Key Fields**: `seo`, `hero`, `notice`.
- **Primary Consumers**: `app/(marketing)/kontakt/page.tsx`, `app/(marketing)/kontakt/dziekujemy/page.tsx`.
- **Notes**: `notice` controls the mailto CTA text and disclosure.

### `cookies.json`
- **Purpose**: Cookie policy page copy.
- **Key Fields**: `seo`, `hero`, `categories`, `actions`, `privacyLink`.
- **Primary Consumers**: `app/(marketing)/(content)/cookies/page.tsx`.
- **Notes**: `categories` render accordions; keep them short for readability.

### `faq.json`
- **Purpose**: FAQ entries and supporting hero text.
- **Key Fields**: `seo`, `hero`, `entries`, `footer`.
- **Primary Consumers**: `app/(marketing)/faq/page.tsx`.
- **Notes**: Entries appear in the specified order; duplicate questions are filtered client-side.

### `footer.json`
- **Purpose**: Footer columns, microcopy, and copyright.
- **Key Fields**: `columns`, `microcopy`, `copyright`.
- **Primary Consumers**: `app/ui/Footer.tsx`.
- **Notes**: Leaving the “Kategorie” column empty triggers automatic population from `articles.navigation.featuredCategories`.

### `global.json`
- **Purpose**: Shared CTA labels and newsletter strings for navigation, metadata, and marketing blocks.
- **Key Fields**: `ctas`, `newsletter`.
- **Primary Consumers**: Documented in `docs/website_repro_playbook.md` and `docs/brand/metadata_mapping.md`; future nav/header refactors will consume it directly.
- **Notes**: Keep CTA semantics stable so multiple components can read from the same keys when we wire this helper up.

### `glossary.json`
- **Purpose**: Glossary landing page copy and UI hints.
- **Key Fields**: `title`, `intro`, `emptyState`, `search`, `navigation`, `readMoreLabel`.
- **Primary Consumers**: `app/(marketing)/(content)/glossary/page.tsx`.
- **Notes**: `navigation` seeds the A–Z jump menu.

### `homepage.json`
- **Purpose**: Everything on the homepage: nav copy, hero, social proof, sections, latest articles teaser, newsletter CTA.
- **Key Fields**: `header`, `hero`, `socialProof`, `pillars`, `workflow`, `articles`, `newsletter`.
- **Primary Consumers**: `app/(marketing)/layout.tsx`, `app/(legal)/layout.tsx`, `app/(marketing)/homepage/HeroSection.tsx`, `app/(marketing)/homepage/HomepageSections.tsx`.
- **Notes**: `header.search` also powers skip links and search placeholders globally.

### `lead-magnets.json`
- **Purpose**: Structured content for lead magnet landing and thank-you pages.
- **Key Fields**: `items` (per slug hero/form/thank-you), `fallback`.
- **Primary Consumers**: `app/lib/content/leadMagnetCatalog.ts`, which is used by `app/(marketing)/(content)/do-pobrania/[slug]/page.tsx`, its thank-you variant, and `app/lib/navigation/SitemapComposer.ts`.
- **Notes**: Forms enforce GET/POST via `form.method`; invalid values fall back to GET.

### `newsletter.json`
- **Purpose**: Copy for every Listmonk-facing page (landing, confirm, thanks, preferences, unsubscribe, etc.).
- **Key Fields**: `base`, `confirm`, `thanks`, `preferences`, `unsubscribe`.
- **Primary Consumers**: `app/(marketing)/newsletter/page.tsx`, `/newsletter/potwierdz`, `/newsletter/dziekujemy`, `/newsletter/wypisz`, `/newsletter/preferencje`, plus related AGENTS guidance.
- **Notes**: Shared `base.hero` text keeps the form consistent; update here first before tweaking any component.

### `not-found.json`
- **Purpose**: 404 experience copy (hero, CTA, search help, shortcut links, and suggestion settings).
- **Key Fields**: `seo`, `title`, `body`, `primaryCta`, `secondaryCta`, `search`, `shortcuts`, `suggestions`.
- **Primary Consumers**: `app/(marketing)/not-found.tsx`.
- **Notes**: `suggestions` controls both the heading and empty-state fallback now that the view model loads the three newest articles.

### `offline.json`
- **Purpose**: Offline fallback page shown by the service worker.
- **Key Fields**: `seo`, `hero`, `actions`, `cachedLinks`.
- **Primary Consumers**: `app/(marketing)/offline/page.tsx`.
- **Notes**: Keep the cached links list short; the template renders every entry.

### `pillar.json`
- **Purpose**: Per-slug overrides for pillar/tutorial detail pages (CTA labels, download blocks, featured content).
- **Key Fields**: `fallback`, `entries`.
- **Primary Consumers**: `app/(marketing)/(content)/poradniki/[slug]/page.tsx` via `PillarPageCoordinator`.
- **Notes**: Missing slugs fall back to `fallback`; add new pillar entries before publishing new markdown guides.

### `privacy.json`
- **Purpose**: Header copy for the privacy policy; complements markdown content.
- **Key Fields**: `title`, `lead`, `lastUpdated`, `contact`.
- **Primary Consumers**: `app/(legal)/polityka-prywatnosci/page.tsx`.
- **Notes**: `lastUpdated.datetime` overrides the markdown date when provided.

### `resources.json`
- **Purpose**: Resource library listing/detail (filters, cards, disclosures).
- **Key Fields**: `seo`, `hero`, `filters`, `cards`, `emptyState`, `detail`, `disclosure`.
- **Primary Consumers**: `app/(marketing)/(content)/zasoby/page.tsx`, `app/(marketing)/(content)/zasoby/[slug]/page.tsx`.
- **Notes**: `detail.download` drives the CTA in the slug page; make sure file labels match the actual asset.

### `search.json`
- **Purpose**: Search page hero, placeholder, labels, and result-state messaging.
- **Key Fields**: `title`, `intro`, `placeholder`, `form`, `results`, `typeLabels`, `tips`.
- **Primary Consumers**: `app/(marketing)/(content)/szukaj/page.tsx`.
- **Notes**: `typeLabels` must include every content type emitted by `ContentSearchEngine`.

### `sitemap.json`
- **Purpose**: Static sections of the sitemap plus metadata.
- **Key Fields**: `seo`, `hero`, `sections`.
- **Primary Consumers**: `app/lib/navigation/SitemapComposer.ts`, `app/(marketing)/(content)/mapa-strony/page.tsx`.
- **Notes**: Dynamic sections (articles, tags, etc.) are injected at runtime; keep `sections.*.links` for evergreen pages only.

### `system-status.json`
- **Purpose**: Copy for `/410`, `/451`, and `/503` status pages.
- **Key Fields**: `pages` keyed by HTTP status (each with `hero`, `actions`, `seo`, optional `meta`).
- **Primary Consumers**: `app/(marketing)/status/StatusPage.tsx`.
- **Notes**: `{time}` tokens in 503 hero/body copy are replaced with the retry timestamp when provided.

### `tags.json`
- **Purpose**: Tag index hero plus optional per-tag descriptions.
- **Key Fields**: `seo`, `hero`, `descriptions`.
- **Primary Consumers**: `app/(marketing)/(content)/tag/page.tsx`, `app/lib/content/tagDirectory.ts`.
- **Notes**: `descriptions` supplements taxonomy data—use it for plain-language summaries.

### `templates.json`
- **Purpose**: Template library listing/detail views.
- **Key Fields**: `seo`, `hero`, `filters`, `cards`, `detail`.
- **Primary Consumers**: `app/(marketing)/(content)/szablony/page.tsx`, `app/(marketing)/(content)/szablony/[slug]/page.tsx`.
- **Notes**: Cards fall back to markdown metadata if a slug is missing; keep labels synchronized.

### `terms.json`
- **Purpose**: Terms of service header elements.
- **Key Fields**: `title`, `lead`, `lastUpdated`, `contact`.
- **Primary Consumers**: `app/(legal)/regulamin/page.tsx`.
- **Notes**: Works the same way as `privacy.json`; update both when legal text changes.

### `tools.json`
- **Purpose**: Tool catalog listing/detail pages.
- **Key Fields**: `seo`, `hero`, `filters`, `cards`, `detail`.
- **Primary Consumers**: `app/(marketing)/(content)/narzedzia/page.tsx`.
- **Notes**: When adding new tool guides, update `cards` here so the listing has the right headlines and badges.

### `tutorials.json`
- **Purpose**: Tutorial listing filters and taxonomy.
- **Key Fields**: `title`, `intro`, `emptyState`, `filters`, `taxonomy`.
- **Primary Consumers**: `app/(marketing)/(content)/poradniki/page.tsx`, `app/lib/content/tutorialTaxonomy.ts`.
- **Notes**: `taxonomy.tags` can fall back to tool labels (via `getToolLabel`) if a slug is missing; keep it complete to avoid surprises.
