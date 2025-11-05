# Article Metadata Mapping

| Frontmatter key     | Template usage                            | Component                      | Notes                                                          |
| ------------------- | ----------------------------------------- | ------------------------------ | -------------------------------------------------------------- |
| `meta.difficulty`   | Tutorial header badge                     | `<Badge variant="neutral">`    | Accept values: `łatwy`, `średni`, `zaawansowany`.              |
| `meta.duration`     | Tutorial meta block (`X h / Y kroków`)    | `pbk-stack` text               | Format as string (np. `"90 min"`).                             |
| `meta.tools`        | List of required tools                    | `pbk-badge` per item           | Map slugs using `data/tools.json` lookup (`app/lib/tools.ts`). |
| `seo.title`         | `<title>` meta + Open Graph title         | `metadata` in `app/layout.tsx` | Fallback to `hero.heading` if missing.                         |
| `seo.description`   | Meta description + Open Graph description | `metadata`                     | Keep ≤155 characters.                                          |
| `hero.heading`      | Page hero title                           | Hero component (`h1`)          | Mirrors copy constants for homepage.                           |
| `hero.subheading`   | Hero supporting copy                      | Paragraph under hero heading   | Should align with voice guidelines.                            |
| `hero.primaryCta`   | CTA button text                           | `<Button variant="primary">`   | Map to label via `getCopy("global").ctas.primary`.             |
| `hero.secondaryCta` | Secondary CTA text                        | `<Button variant="secondary">` | Optional.                                                      |

## Implementation Notes

- Update page templates to read metadata via `generateMetadata` and component props.
- Store tool label dictionary at `data/tools.json` before publishing tutorial pages.
- When new metadata fields are added, extend this table and the frontmatter schema.
