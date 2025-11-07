# Article Metadata Mapping

| Frontmatter key                    | Template usage                            | Component                      | Notes                                                                  |
| ---------------------------------- | ----------------------------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| `meta.difficulty`                  | Tutorial header badge                     | `<Badge variant="neutral">`    | Accept values: `łatwy`, `średni`, `zaawansowany`.                      |
| `meta.duration`                    | Tutorial meta block (`X h / Y kroków`)    | `pbk-stack` text               | Format as string (np. `"90 min"`).                                     |
| `meta.tools`                       | List of required tools                    | `pbk-badge` per item           | Map slugs using `data/tools.json` lookup (`app/lib/tools.ts`).         |
| `taxonomy.categories` (article)    | Article list filters + detail badges      | `<Badge variant="accent">`     | Labels resolved via `ArticleTaxonomyCatalog`.                          |
| `taxonomy.tags` (article)          | Detail page tag badges                    | `<Badge variant="neutral">`    | Labels z `data/copy/articles.json`.                                    |
| `taxonomy.categories` (tutorial)   | Tutorial cards + detail nagłówek          | `<Badge variant="accent">`     | `tutorialTaxonomyCatalog` + `data/copy/tutorials.json`.                |
| `taxonomy.tags` (tutorial)         | Tutorial meta badges (np. narzędzie)      | `<Badge variant="neutral">`    | Wykorzystuje `tutorialTaxonomyCatalog`, fallback do `data/tools.json`. |
| `taxonomy.categories` (comparison) | Porównania – listing i szczegóły          | `<Badge variant="accent">`     | `comparisonTaxonomyCatalog` + `data/copy/comparisons.json`.            |
| `taxonomy.tags` (comparison)       | Lista narzędzi w porównaniu               | `<Badge variant="neutral">`    | Fallback do `data/tools.json` dla slugów narzędzi.                     |
| `seo.title`                        | `<title>` meta + Open Graph title         | `metadata` in `app/layout.tsx` | Fallback to `hero.heading` if missing.                                 |
| `seo.description`                  | Meta description + Open Graph description | `metadata`                     | Keep ≤155 characters.                                                  |
| `hero.heading`                     | Page hero title                           | Hero component (`h1`)          | Mirrors copy constants for homepage.                                   |
| `hero.subheading`                  | Hero supporting copy                      | Paragraph under hero heading   | Should align with voice guidelines.                                    |
| `hero.primaryCta`                  | CTA button text                           | `<Button variant="primary">`   | Map to label via `getCopy("global").ctas.primary`.                     |
| `hero.secondaryCta`                | Secondary CTA text                        | `<Button variant="secondary">` | Optional.                                                              |

## Implementation Notes

- Update page templates to read metadata via `generateMetadata` and component props.
- Store tool label dictionary w `data/tools.json` – wykorzystywane przez tutoriale i porównania.
- Nowe kategorie/tagi dopisuj w odpowiednim copy pliku: artykuły (`data/copy/articles.json`), tutoriale (`data/copy/tutorials.json`), porównania (`data/copy/comparisons.json`).
- Rozszerz tę tabelę i schemat frontmattera, gdy pojawią się nowe pola.
- Zachowuj spójne slug-i między markdown, copy JSON i modułami katalogów, by badge’y renderowały się poprawnie.
