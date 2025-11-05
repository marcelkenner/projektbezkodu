# Copy Management System Plan

Objective: centralize textual content for global pages (homepage, 404, privacy policy, etc.) so non-developers can update key messaging without touching React components.

## 1. Scope Definition

- Pages: homepage hero & key sections, 404 page, privacy policy header/excerpt, newsletter CTA copy, footer text.
- Content types: headings, subheadings, CTA labels, short descriptions. Long-form legal copy stays in markdown.

## 2. Data Structure

- Create `data/copy` directory with JSON/YAML files per page:
  - `data/copy/global.json` (common CTAs, tagline variants).
  - `data/copy/homepage.json` (hero, sections, FAQ prompts).
  - `data/copy/not-found.json` (404 messages).
  - `data/copy/privacy.json` (lead paragraph, update date message).
- Each file exports a typed module via `app/lib/copy.ts` to ensure type safety.

## 3. Implementation Steps

1. **File Setup**
   - Move existing constants from `data/copy.json` into `data/copy/global.json`.
   - Add new files for homepage, not-found, privacy with default strings.
2. **Typed Access Layer**
   - Extend `app/lib` with `copy.ts` providing `getCopy(section)` helper and TypeScript interfaces (e.g., `HomepageCopy`, `NotFoundCopy`).
3. **Component Wiring**
   - Replace direct JSON imports (`import copy from "../../../data/copy.json"`) with helper functions.
   - Update server components (`app/(marketing)/homepage/...`, `app/not-found.tsx`, `app/privacy/page.tsx`) to pull copy from the new source.
4. **Fallback & Validation**
   - Implement runtime checks in `getCopy` to warn if a key is missing; fall back to sensible defaults.
   - Optionally add `zod` schemas for validation.

## 4. Editing Workflow

- Copywriters edit JSON files under `data/copy/`.
- Add documentation in `docs/brand/content_voice.md` explaining the structure and how to propose changes.
- Update `README.md` with short instructions on running `npm run lint` to catch schema mismatches.

## 5. Future Enhancements

- Expose copy in CMS (Strapi/Wagtail) when backend is ready.
- Provide CLI (`npm run copy:check`) to validate JSON structure using `ts-node` + schemas.
- Consider localization by nesting keys per language (`pl`, `en`).

Track progress by adding a new subsection in `docs/brand_design_system_plan.md` under Content & Copy Alignment once implementation begins.
