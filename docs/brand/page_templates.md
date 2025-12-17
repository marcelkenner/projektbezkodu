# Page Template Specifications

## Homepage

- Hero section with primary/secondary CTA, microcopy disclosure, and responsive hero media (`app/(marketing)/homepage/HeroSection.tsx`).
- Sections: social proof logos, pillars grid, workflow steps, latest articles, newsletter CTA (`app/(marketing)/homepage/HomepageSections.tsx`).
- Reads SEO data from markdown via `app/(marketing)/page.tsx`, with copy sourced from `data/copy/homepage.json`.

## Template Detail Page

- Hero block: template name, thumbnail, dual CTA (download / open in tool).
- Sections: "Co w środku", wymagania techniczne, checklisty performance/SEO, zastosowania, FAQ.
- Recommended components: `Card`, `Badge`, `Alert`, `ComparisonTable`, `Button`.

## Tutorial Page

- Includes breadcrumb + progress Stepper.
- Body structured with sticky Table of Contents, callouts (Alert) and code snippets (use `font-mono`).
- Metadata: czas realizacji, poziom trudności, wymagane narzędzia.

## Comparison Page

- Headline describing audience, summary CTA.
- Core: `ComparisonTable` with zebra striping, pros/cons cards, pricing callout.
- Include affiliate disclosures via `Alert` and ensure links use `rel="sponsored"`.

## Shared Patterns

- Layout: `.pbk-container` + `.pbk-grid` / `.pbk-stack` utilities.
- CTA banner pattern: `Alert` with `Button`.
- FAQ pattern: collapsible or static blocks using `pbk-stack` spacing.

Document template-specific content in the `content/` directory using frontmatter that maps to these sections.

## Blog Listing

- Hero copy + sticky filter bar (`ArticlesFilterBar.tsx`) obejmujące wyszukiwarkę, kategorię, czas czytania i chipy tagów.
- Lista kart artykułów (`ArticleCard.tsx`) z miniaturą 3:2, metadanymi, kategorią i CTA "Czytaj →".
- Paginacja z rel="prev/next" i noindex od strony 2 (`ArticlesPagination.tsx`).
- JSON-LD: CollectionPage + ItemList generowane w `app/(marketing)/(content)/artykuly/page.tsx`.

## Artykuł (detail)

- Breadcrumbs + meta (czas czytania, publikacja, aktualizacja, autor).
- Ostrzeżenie o afiliacji (jeśli `meta.hasAffiliateLinks=true`).
- Layout z kolumną artykułu i sticky TOC (`TableOfContents`).
- Sekcja "Następny krok" z podwójnym CTA (primary + secondary).
- Box autora z awatarem, bio i gridem powiązanych artykułów.
- Nawigacja poprzedni/następny artykuł z rel="prev/next".

## Hub artykułów (kategoria / podkategoria)

- Huby są wykrywane z katalogów `content/artykuly/**` (wymagany `index.md`, `template` ≠ `article|legal`).
- UI renderuje **tylko** listy: linki do podkategorii + `ArticleGrid` artykułów pod danym prefiksem (bez renderowania markdown body).
- Ścieżki: `/artykuly/<kategoria>/` i `/artykuly/<kategoria>/<podkategoria>/` (oraz głębiej, jeśli foldery istnieją).
- `/kategoria/<slug>/` to legacy redirect do odpowiadającego huba.

## Legal pages

- Wspólny layout (`app/(legal)/legal.css`) z nagłówkiem, małą datą `<time>` i blokiem kontaktowym.
- Treść ładowana z Markdowna przez `MarkdownPageLoader` + `MarkdownRenderer`.
- Polityka prywatności: sekcja tabelaryczna celów/podstaw prawnych, kontakt RODO.
- Regulamin: definicje jako `<dl>`, sekcje newsletter, afiliacja, prawa autorskie, kontakt.
