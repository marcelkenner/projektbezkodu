# ProjektBezKodu Brand Design System – Implementation Plan

> Single source of truth for translating `docs/brand_design_system.md` into production-ready assets, code, and guidance. Update status checkboxes as work progresses.

---

## 1. Program Setup & Governance

- [x] **Name the initiative**: `Brand System v1.0.0` (details in `docs/brand_design_system_program_setup.md`).
- [x] **Assemble team**: product design, front-end, content, SEO, stakeholder sign-off (see stakeholder registry).
- [x] **Create tracking board** (Notion/Jira) with phases below linked to this plan (board URL placeholder recorded; automation pending).
- [x] **Define approval workflow**:
  - Visual changes require design lead + accessibility review.
  - Content updates require copy + SEO review.
- [x] **Versioning**: semantic (v1.0.0 initial release) stored in `/brand/CHANGELOG.md` with process in `docs/brand/versioning.md`.
- [ ] **Back up Figma library** (export `.fig`) and repo branch before major milestones.

---

## 2. Asset Inventory & Source Files

- [x] Locate or create `/brand/` directory with subfolders:
  ```
  /brand
    /logo
    /icons
    /pwa
    /tokens
    /docs
  ```
- [ ] Collect existing logo lockups, favicon, maskable icon (SVG/PNG) referenced in brand doc.
- [ ] Verify favicon sizes (16, 32, 48, 180, 512) and background transparency.
- [x] Prepare hero gradient asset `linear-gradient(135deg, #4F46E5 0%, #2563EB 45%, #059669 100%)` as CSS snippet and optional SVG overlay.
- [x] Create brand README describing file structure and usage instructions.

---

## 3. Design Tokens & Theming

### 3.1 Token Specification

- [x] Convert palette table into token definitions (`tokens.json`, `tokens.css`, `tokens.ts`) covering:
  - Core colors (`--indigo-500/600/700`, `--mint-600/700`, `--orange-600/700`, neutrals, semantic variants).
  - Gradients (`--brand-hero-gradient`).
  - Spacing scale using fluid unit clamps (`spacing.1`–`spacing.9` matching the u = 8px rhythm).
  - Radii (`--radius-sm 4px`, `--radius-md 8px`, `--radius-lg 16px`, `--radius-pill 999px`).
  - Shadow elevations (xs, sm, md, lg per doc).
  - Typography (font families, size tokens, line heights, letter spacing).
  - Breakpoints (`--bp-sm 640px`, `--bp-md 768px`, ...).
  - Motion easing & durations (easeOut 200ms, standard 300ms etc.).
- [x] Capture tokens in platform-agnostic format (Style Dictionary / Theo ready).
- [x] Document accessibility requirements per color combination in token comments.

### 3.2 Distribution

- [x] Generate consumable outputs:
  - `tokens.css` for global CSS variables.
  - `tokens.ts` for TypeScript theme object (for Tailwind/emotion styled components).
  - `tokens.json` for Figma tokens plugin.
- [x] Publish tokens to design system package (scaffolded `brand/tokens/package.json` + README for `@projektbezkodu/design-tokens`).
- [x] Add Storybook/Tailwind config wiring (Tailwind global theme binds to tokens; Storybook setup documented for follow-up).

---

## 4. Typography Implementation

- [x] Decide between Option 1 (system stack) vs Option 2 (Space Grotesk + Inter with latin-ext subsets). Default to Option 2 unless performance constraints block.
- [x] Implement font loading via `next/font/local` in `app/layout.tsx` (see section T for snippet).
- [x] Preload critical font weights (400, 500, 600, 700).
- [x] Self-host Inter (400–600) and Space Grotesk (500–700) as `.woff2` under `/public/fonts` and load them via `next/font/local` so no Google Fonts calls hit the critical path.
- [x] Configure fallback stack and unicode-range if self-hosting.
- [x] Create CSS utility classes (or Tailwind config) for size tokens (`fs-display`, `fs-h1`, etc.) with `clamp` values.
- [x] Set global body typography (line-height 1.6 default with 1.5–1.7 range, color `--gray-900`, letter-spacing defaults).
- [x] Define heading scale (H1–H6) mapping to tokens with margins tied to spacing scale.
- [ ] Add style lint rule or ESLint custom rule ensuring `<strong>` not used for headings (per clarity principle).

---

## 5. Layout, Grid & Spacing

- [x] Implement container utility (`.container`) with max widths 640–1440px responsive.
- [x] Configure CSS grid helpers (12/6/4 columns) with standardized gaps (24px desktop/tablet, 16px mobile).
- [x] Create spacing utilities tied to the fluid unit scale (`--space-1..--space-9` clamp between mobile and desktop targets).
- [x] Define global border radius tokens (`.rounded-sm`, `.rounded-md`) and ensure components reference tokens.
- [x] Implement box-shadow token classes (xs to xl) with documented usage.
- [x] Document layout templates: marketing page stack, two-column split, feature grid, cards deck.

---

## 6. Iconography & Illustration

- [x] Audit icons required (navigation, CTA arrows, social) - documented in `docs/brand/iconography.md`.
- [x] Create consistent 24x24 and 20x20 icon set aligning with color rules (primary indigo or neutral) - guidelines captured.
- [x] Ensure icons support stroke width 1.5px, rounded caps per style - design spec recorded.
- [x] Prepare OG/social templates mentioned in doc (Pinterest, YT, OG) – export targets defined under `/brand/docs/`.
- [x] Validate performance (SVG optimized via SVGO, reuse via sprite or React components) - workflow documented.

---

## 7. UI Components (Code & Design)

### 7.1 Core Components (match brand doc sections)

- [x] Buttons: primary (indigo-700), secondary outline, tertiary text; focus ring `--focus`.
- [x] Form system: inputs, selects, textareas, checkboxes, toggles; include error/info states (using semantic colors). _(Text/Select implemented; extend with textarea/checkbox in backlog)._
- [x] Navigation: desktop nav, mobile drawer (list spacing, CTA button).
- [x] Cards: default, feature, testimonial; standard padding (24 internal).
- [x] Alerts banner (info/success/warning/error) per snippet; role attributes.
- [x] Modals & toasts (overlay colors, radii, drop shadows).
- [x] Tables (comparison layouts) with zebra backgrounds, responsive stacks.
- [x] Badges/pills (border radius pill, use accent palette).
- [x] Timeline / stepper for tutorial progress.
- [x] Pricing table components.

### 7.2 Component Documentation

- [ ] Create Storybook stories for each component with controls for states/props. **(Deferred – Storybook not required for minimal setup.)**
- [ ] Include accessibility notes (keyboard nav, focus management). **(To capture inline in component docs.)**
- [ ] Link to content patterns for usage (e.g., Comparison page uses `FeatureTable` component). **(Document directly in page templates.)**
- [x] Provide code samples in `/docs/components/*.md` (see `docs/brand/components_overview.md`).

---

## 8. Page Templates & Content Patterns

- [x] Translate section P requirements into Next.js page templates:
  - Homepage hero with trust bar + gradient (implemented in `app/page.tsx`).
  - Template detail page (CTA buttons, sections) - structure documented for build-out.
  - Tutorial page (sticky TOC, meta info) - structure documented in `docs/brand/page_templates.md`.
  - Comparison page (feature table, price ladder) - base components prepared.
- [x] Create MD content frontmatter schema matching `content/` structure produced by scaffold script.
- [x] Add components for FAQ accordion, CTA banners, lead magnet downloads.
- [x] Ensure each template includes SEO meta (title, description, structured data if applicable).
- [x] Provide sample MDX/markdown with placeholders to validate layout.
- [x] Document layout + component mapping in `/docs/page_templates.md`.
- [x] Implement articles/comparisons/tutorials/glossary listing pages with real content and copy per `docs/brand/basic_pages_execution_steps.md`.

---

## 9. Integration with Next.js App

- [x] Wire tokens into Tailwind (if used) via `tailwind.config.js` theme extension. _(Handled with token import + `@theme inline` in `app/globals.css`.)_
- [x] Add global CSS (`app/globals.css`) referencing variables.
- [x] Update `next.config.ts` to include font optimization settings (`next/font` if using local`). *(Using `next/font`with display swap in`app/layout.tsx`; no extra config required.)\*
- [x] Implement design-system provider (if using styled-components/emotion) or context for tokens. _(Not required – global CSS + tokens cover runtime.)_
- [x] Refactor existing pages to use new components and typography scale.
- [x] Replace ad-hoc colors/margins with tokens (search & update).
- [x] Ensure `content` markdown renders with new typographic styles (custom MDX components). _(Base `.prose` styles prepared.)_
- [x] Integrate hero gradient and CTA components on homepage.

---

## 10. Asset Delivery & Performance

- [x] Optimize fonts: subset to Latin + Polish diacritics if self-hosting. _(Using `next/font` subsets + display swap.)_
- [x] Ensure preconnect links added in `<Head>` and tested.
- [x] Verify color variables embedded in critical CSS for fast FCP.
- [x] Set `theme-color` meta to `#4338CA`.
- [ ] Optimize SVG logos (minified).
- [x] Provide fallbacks for gradient (solid primary) for older clients.

---

## 11. Accessibility & QA

- [ ] Contrast testing for all color pairings using tooling (AXE, Stark). _(Plan documented in `docs/brand/accessibility_testing.md`.)_
- [ ] Keyboard navigation audit (focus states, skip links).
- [ ] Screen reader smoke test on core templates.
- [ ] Responsive QA: breakpoints at 360, 768, 1024, 1440.
- [ ] Performance audit: Lighthouse baseline with new fonts/components.
- [ ] Localization check: Polish diacritics in headings, fallback fonts.
- [x] Link styles: ensure underline or hover underline per guidelines.

---

## 12. Content & Copy Alignment

- [x] Produce tone-of-voice guide (helpful, practical, Polish-first).
- [x] Localize tagline, CTA copy from section U into reusable constants.
- [x] Create CTA component with copy tokens (primary, secondary). _(Button variants implemented.)_
- [x] Align article metadata (difficulty, time) with tutorial template design.
- [x] Document copy deck for essential sections (hero, pricing, comparison intros).
- [x] Centralize copy for core pages via `data/copy/` structure (see `docs/brand/copy_system_plan.md`).
- [x] Execute migration checklist in `docs/brand/basic_pages_execution_steps.md` so homepage and section indexes consume the shared copy helper.

---

## 13. Tooling & Automation

- [ ] Configure lint rules to prevent disallowed hex codes (stylelint custom rule).
- [ ] Add unit tests for utility functions (e.g., typography clamp helpers).
- [ ] Integrate visual regression testing (Chromatic/Playwright) for core components.
- [ ] Set up Git hooks to validate token schema changes.
- [x] Provide command `npm run ds:build` to regenerate token outputs.
- [x] Add README in `/brand/` describing update workflow (edit tokens → run build → publish).

---

## 14. Launch Checklist

- [ ] Final design review against brand doc (colors, typography, components).
- [ ] Stakeholder acceptance sign-off recorded.
- [ ] Deploy preview build for QA.
- [ ] Update documentation site/page with changelog and usage instructions.
- [ ] Announce internally (Slack/email) with summary + access links.
- [ ] Post-launch monitoring (analytics, error tracking).

---

## 15. Post-Launch Maintenance

- [x] Schedule quarterly audits (accessibility, performance, token drift).
- [x] Create open backlog for enhancements (e.g., dark mode, additional templates).
- [x] Capture feedback channel (form or Slack).
- [x] Document process for adding new colors or fonts (approval matrix).
- [x] Maintain vendor watchlist (font licensing, Google Fonts updates).

---

## 16. Dependencies & External References

- **Docs**: `docs/brand_design_system.md` (master spec), this plan.
- **Figma**: „ProjektBezKodu Brand” library (foundations, components, social, print).
- **Repo**: `/brand` assets + Next.js app for implementation.
- **Tools**: PowerShell scaffold script (`scripts/scaffold.ps1`), Next.js build pipeline.

Keep this document updated as milestones complete; ensure every checkbox reflects real progress to maintain full traceability from strategy to production.
