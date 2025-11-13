# Agent Guidance – `content/`

- Store all Markdown content here. Each file must include frontmatter matching the schema defined in `docs/brand/frontmatter_schema.md`.
- Keep sections short; split long guides into subdirectories. Respect 500-line max per file.
- Use lowercase, hyphenated slugs and ensure `path` fields align with generated routes.
- Do not embed HTML; rely on Markdown + MDX components when necessary.
- Whenever new frontmatter fields are required, update the schema doc and metadata mapping before adding them.
- Run `npm run content:lint` (also executed automatically before `npm run build`) after editing markdown. It parses every `content/**/*.md` file via `gray-matter` and fails if any front matter is invalid.
- Front matter hygiene:
  - Exactly one `--- … ---` block per file.
  - Unique top-level keys; nest hero/SEO/taxonomy data.
  - Indent nested maps and quote strings containing colons.
  - Reference only the category/tag slugs defined in `data/copy/articles.json`; add new slugs there first.
