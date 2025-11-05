# Basic Pages & Copy Management Roadmap

## 1. Overview

Goal: finalize base marketing/legal pages (homepage, articles index, comparisons, tutorials, glossary, 404, search, privacy, terms) and centralize their copy so updates happen in one location.

## 2. Page Implementation Checklist

- Homepage _(done)_ – continue adjusting hero/sections via centralized copy.
- Articles index `/artykuly`
  - [x] Define content taxonomy (categories, tags).
  - [x] Replace placeholder links with dynamic routes once markdown exists.
  - [x] Surface featured categories in primary nav/footer per `docs/brand/article_taxonomy_navigation.md`.
- Comparisons `/porownania`
  - [x] Establish comparison data structure (frontmatter fields such as `summary`, `bestFor`).
  - [x] Wire to dynamic listing using `getStaticProps` equivalent (Next App Router fetch).
- Tutorials `/poradniki`
  - [x] Design metadata badges (difficulty, duration) sourced from markdown.
  - [x] Provide listing with filters (tool, skill level).
- Glossary `/glossary`
  - [x] Parse `content/glossary/**` entries; sort alphabetically.
  - [x] Add search/anchor navigation.
- Search `/szukaj`
  - [x] Replace placeholder UI with working search backed przez lokalny indeks treści.
  - [x] Ustalić dostawcę wyszukiwania (wybrano własny indeks build-time) i zintegrować UI.
- 404 `/not-found` _(placeholder implemented)_ – enrich with popular links once article data is live.
- Privacy `/polityka-prywatnosci` & Terms `/regulamin`
  - [x] Replace placeholders with legal copy (external source or markdown include).
  - [ ] Coordinate with legal team.

## 3. Copy Centralization Plan

Use `data/copy/` directory to store structured copy, consumed via typed helpers.

### 3.1 File Layout

```
data/copy/
  global.json        # shared CTAs, tagline snippets
  homepage.json      # hero headings, section descriptions, FAQ prompts
  articles.json      # list headings, intro paragraphs
  comparisons.json
  tutorials.json
  glossary.json
  not-found.json
  search.json
  privacy.json
  terms.json
```

### 3.2 Typed Access Helper

- Implement `app/lib/copy.ts` with TypeScript interfaces per page.
- Provide `getCopy(section: keyof CopyMap)` that returns strongly typed copy.
- Validate structure using `zod` or manual runtime checks during development.

### 3.3 Integrate Pages

- Replace direct imports (e.g., `data/copy.json`) with `getCopy("homepage")` etc.
- Map frontmatter defaults to copy definitions where relevant (e.g., hero headings).
- Introduce fallback logic to avoid runtime crashes if a key is missing.

### 3.4 Editing Workflow & Documentation

- Update `docs/brand/content_voice.md` and README with instructions for editing copy files.
- Add lint/script `npm run copy:check` (future) verifying schema validity.
- Document review process (copywriter edits file -> PR -> review).

## 4. Dependencies & Sequencing

1. Implement copy helper + restructure `data/copy`.
2. Migrate homepage components to the new helper.
3. Expand to new pages (articles/comparisons/etc.).
4. Build dynamic listings (once markdown content exists or headless CMS integrated).
5. Replace legal placeholders with final text.
6. Implement search UI/data once provider chosen.

## 5. Acceptance Criteria

- All basic pages render with centralized copy (no hard-coded strings beyond placeholders).
- Copy updates require editing only `data/copy/*.json` and markdown frontmatter.
- Pages pass linting and align with design tokens.
- Documentation reflects the workflow for future editors.
