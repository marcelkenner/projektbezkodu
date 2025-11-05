# Page Template Specifications

## Homepage

- Hero section with gradient background, primary/secondary CTA, trust bar (`app/(marketing)/homepage/Hero.tsx`).
- Sections: content categories (cards), stepper, comparison table, newsletter CTA, FAQ (`app/(marketing)/homepage/ContentSections.tsx`).
- Reads hero/meta data from markdown via `app/(marketing)/page.tsx` using `readMarkdownFile` helper.

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
