# ProjektBezKodu Technical Reproduction Playbook

Comprehensive checklist for spinning up a website that mirrors the ProjektBezKodu architecture. Follow each step in order; every command assumes you run `source ~/.nvm/nvm.sh &&` first.

## 1. Goals & Scope

1. Deliver a token-driven design system shared by code and content teams.
2. Serve marketing pages from a Next.js App Router project with reusable UI primitives.
3. Centralise copy and markdown content to allow non-dev edits.
4. Keep files under the 500-line ceiling and enforce SRP-friendly structure.

## 2. Prerequisites

1. Node.js 22 (managed with `nvm`), npm 10+.
2. Git repo initialised with an MIT-friendly licence.
3. Development tooling: VS Code (optional), EditorConfig support, Prettier, ESLint.
4. Local dependencies installed via `npm install`.

## 3. Project Bootstrap

1. Create Next.js app (App Router) with TypeScript: `npx create-next-app@latest --typescript`.
2. Remove unused starter files; keep `app/`, `public/`, `next.config.ts`.
3. Install Tailwind CSS v4: `npm install tailwindcss@latest @tailwindcss/postcss@latest`.
4. Add `@import "tailwindcss";` to `app/globals.css`.
5. Install `gray-matter` for markdown parsing.

## 4. Directory Layout

1. Create directories:
   - `brand/` (with subfolders `logo/`, `icons/`, `pwa/`, `tokens/`, `docs/`, `figma-exports/`).
   - `content/` (hierarchy: `artykuly`, `porownania`, `poradniki`, `glossary`, `polityka-prywatnosci`, `regulamin`, `szukaj`, etc.).
   - `data/copy/` for JSON copy sources.
   - `app/lib/` for helpers (`frontmatter.ts`, `content/`, `copy.ts`, `tools.ts`).
   - `app/ui/` for reusable components and `ui.css`.
   - `app/(marketing)/` and `app/(legal)/` segment folders.
2. Ensure every directory contains an `AGENTS.md` if governance requires it.

## 5. Design Tokens

1. Author `brand/tokens/tokens.json` following the colour/typography/spacing/radii/motion schema.
2. Add build script `brand/tokens/scripts/build.mjs` that flattens JSON into CSS and TS exports.
3. Update `package.json` scripts with `"tokens:build": "node brand/tokens/scripts/build.mjs"`.
4. Run `npm run tokens:build` whenever tokens change; commit `tokens.json`, `tokens.css`, `tokens.ts`.
5. Import tokens in `app/globals.css` (`@import "../brand/tokens/tokens.css";`).
6. Keep the spacing scale fluid: tokens `spacing.1` through `spacing.20` must match the mobile-first clamp scale (unit `u = 8px`) so every layout pulls from the shared rhythm.

## 6. Global Styling

1. Download required `.woff2` font weights (Manrope, Inter, JetBrains Mono) via `@fontsource` or other licensing-compliant source and place them under `public/fonts/`.
2. Define local fonts with `next/font/local` in `app/ui/fonts.ts`, exporting body, heading, and mono variants aligned to token families.
3. Reference these variables in `app/layout.tsx` to self-host fonts for offline-friendly builds.
4. Define `@theme inline { ... }` section inside `app/globals.css` mapping CSS variables to token values.
5. Add utility classes (`.pbk-container`, `.pbk-stack`, `.section`, `.section__grid`, `.pbk-inline-list`, `.prose`, etc.).
6. Keep each CSS utility descriptive and token-driven; no magic numbers.
7. Rebuild shared hero styles into a dedicated module (`app/(marketing)/homepage/section.css`) and ensure only hero-specific rules remain there.
8. Apply the blog spacing spec: `.prose` should use top-only margins, more space before headings than after, `max-width: 72ch`, and elevated spacing for blockquotes, code, figures, and callouts per the unit scale.

## 7. UI Component Library

1. Create UI primitives in `app/ui/` (Button, TextField, SelectField, Badge, Alert, Card, Stepper, PricingCard, ComparisonTable, Modal, Toast, PrimaryNav, Footer).
2. Centralise exports via `app/ui/index.ts`.
3. Ensure each component imports `./ui.css`.
4. Preface complex logic with brief comments only when necessary.
5. Maintain component files <200 lines; split helpers if over.

## 8. Copy System

1. Populate `data/copy/*.json` for `global`, `homepage`, `articles`, `comparisons`, `tutorials`, `glossary`, `not-found`, `privacy`, `terms`, `search`, `footer`.
2. Implement `app/lib/copy.ts` to import JSON and expose `getCopy(section)`.
3. Keep JSON keys descriptive and align with view requirements (e.g., `hero`, `sections`, `emptyState`).
4. Document editing workflow in `docs/brand/content_voice.md`.

## 9. Markdown Content Pipeline

1. Adopt frontmatter schema in `docs/brand/frontmatter_schema.md`.
2. Store markdown content under `content/**/index.md` with `draft` and `template` fields.
3. Implement `app/lib/frontmatter.ts` using `gray-matter`.
4. Build `app/lib/content/repositories.ts` with abstract `MarkdownRepository` and concrete repositories for articles, comparisons, tutorials, glossary.
5. Provide `MarkdownPageLoader` helper for singleton pages (privacy, terms).
6. Implement `app/ui/MarkdownRenderer.tsx` to render headings, lists, blockquotes, inline emphasis without external libraries.
7. Define article taxonomy (categories, tags) in `data/copy/articles.json` and reference those slugs from markdown `taxonomy` blocks; resolve labels via `ArticleTaxonomyCatalog`.

## 10. Routing & Pages

1. Wrap marketing routes with `app/(marketing)/layout.tsx`, injecting `PrimaryNav` and `Footer`.
2. Configure navigation CTA copy via `getCopy("global")`.
3. Create listing pages:
   - Articles (`app/(marketing)/(content)/artykuly/page.tsx`) pulling summaries from `ArticleRepository`.
   - Tutorials (`app/(marketing)/(content)/poradniki/page.tsx`) using `TutorialDirectory` filters (tool + difficulty via query params).
   - Glossary (`app/(marketing)/(content)/glossary/page.tsx`) grouped alfabetycznie with anchors generated by `GlossaryDirectory`.
   - Comparisons (`app/(marketing)/(content)/porownania/page.tsx`) and search (`app/(marketing)/(content)/szukaj/page.tsx`) backed by `ContentSearchEngine`.
4. Wire featured article categories into navigation/footer following `docs/brand/article_taxonomy_navigation.md`.
5. Render „narzędzie tygodnia” jako stały toast (`ToolOfWeekToast`) – dane z `data/tools.json`, aktywny slug w `data/tool-of-week.json`.
6. Create dynamic detail routes `[slug]/page.tsx` for each content type with:
   - `generateStaticParams` returning slugs.
   - `generateMetadata` reading frontmatter.
   - Render body with `MarkdownRenderer`.
7. Point legal pages to markdown via `MarkdownPageLoader`.
8. Keep `not-found.tsx` using copy helper.

## 11. Content Management Workflow

1. Treat markdown and copy JSON as the source of truth; no hard-coded strings.
2. Mark `draft: false` when ready for production; repository filters automatically hide drafts.
3. Encourage content editors to work through PRs touching only `content/` and `data/copy/`.
4. Share the editor playbook (`docs/content_editor_playbook.md`) with the content team; keep it updated alongside this document.
5. Utrzymuj dane narzędzia tygodnia (`data/tools.json`, `data/tool-of-week.json`, grafiki w `public/images/tools/`).
6. Track operational follow-ups (legal, audits, assets) under `docs/operations/`.

## 12. QA & Tooling

1. Lint: `npm run lint`.
2. Build: `npm run build`; fix type errors promptly.
3. Tokens: `npm run tokens:build` to sync CSS/TS artefacts.
4. Manual checks:
   - Responsive layout at 360/768/1024/1440.
   - Accessibility contrast (AXE/Stark).
   - Keyboard navigation path.
5. Plan for automated visual regression in future (Chromatic/Playwright).

## 13. Deployment Checklist

1. Ensure `.env.local` derived from production settings (copy `.env.production`).
2. Verify design tokens committed.
3. Update `brand/CHANGELOG.md` with notable changes.
4. Regenerate sitemap/robots if new routes added (future automation).

## 14. Adaptation Guidelines

1. For each new brand, fork tokens (`brand/tokens/`), copy JSON, and update copy values.
2. Replicate markdown structure with new content; run through repositories to confirm slug/path.
3. Update navigation/footer copy to reflect brand sections.
4. Document brand-specific nuances in `docs/brand/<brand>-notes.md`.

## 15. Go-Live Signoff

1. Confirm open tasks in `docs/brand/basic_pages_plan.md` and `docs/brand_design_system_plan.md` are addressed or ticketed.
2. Record remaining action items in `docs/next_steps.md`.
3. Seek sign-off from design, content, and stakeholder leads before deployment.
