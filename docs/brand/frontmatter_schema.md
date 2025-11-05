# Frontmatter Schema

```yaml
---
title: ""
slug: ""
path: "/"
draft: false
template: "homepage" # homepage | template | tutorial | comparison | article
hero:
  heading: ""
  subheading: ""
  primaryCta: "copy.cta_primary"
  secondaryCta: "copy.cta_secondary"
  trustLogos:
    - "Webflow"
seo:
  title: ""
  description: ""
  keywords: []
  canonical: "https://projektbezkodu.pl/..."
meta:
  difficulty: ""
  duration: ""
  tools: []
taxonomy:
  categories: []
  tags: []
---
```

Store schema as reference for markdown generation scripts (`scripts/scaffold.ps1`).

- Artykuły korzystają z definicji w `data/copy/articles.json`.
- Tutoriale – `data/copy/tutorials.json` (`categories`/`tags`) + etykiety narzędzi z `data/tools.json`.
- Porównania – `data/copy/comparisons.json` +, w razie potrzeby, `data/tools.json` dla tagów narzędzi.
- Utrzymuj spójne slug-i między markdown, copy JSON i modułami katalogów (`article|tutorial|comparisonTaxonomyCatalog`).
