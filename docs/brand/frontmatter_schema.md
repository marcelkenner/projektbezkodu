# Frontmatter Schema

```yaml
---
title: ""
slug: ""
path: "/"
draft: false
template: "homepage" # homepage | template | tutorial | comparison | article | resource | case-study
type: "" # optional legacy/aux classification
date: "" # YYYY-MM-DD (optional)
hero:
  heading: ""
  subheading: ""
  image:
    src: ""
    alt: ""
    width: 0
    height: 0
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
  author: ""
  updatedAt: "" # YYYY-MM-DD (optional)
  hasAffiliateLinks: false
  primaryCta:
    label: ""
    href: ""
    rel: ""
  secondaryCta:
    label: ""
    href: ""
    rel: ""
  format: ""
  topics: []
  license: ""
  downloadHref: ""
  detailsHref: ""
  checksum: ""
  fileSize: ""
  time: ""
  stack: []
  metrics:
    - label: ""
      value: ""
      description: ""
  summaryBullets: []
  period: ""
  industry: ""
  heroImageAlt: ""
  heroImageSrc: ""
  heroImageWidth: 0
  heroImageHeight: 0
  lessons: []
taxonomy:
  categories: []
  tags: []
---
```

Store schema as reference for markdown generation scripts (`scripts/scaffold.ps1`).

- Routing: canonical URL paths always end with the slugified `title` (the last segment is derived from `title`, not from folder/file names). When `path` is set explicitly, it is treated as a prefix and still gets its last segment replaced by the title slug.
- Artykuły korzystają z definicji w `data/copy/articles.json`.
- Tutoriale – `data/copy/tutorials.json` (`categories`/`tags`) + etykiety narzędzi z `data/tools.json`. Jeżeli materiał pełni rolę „pillar page”, pamiętaj o konfiguracji w `data/copy/pillar.json`.
- Porównania – `data/copy/comparisons.json` +, w razie potrzeby, `data/tools.json` dla tagów narzędzi.
- Zasoby (`template: resource`) – korzystają z pól `meta.format`, `meta.topics`, `meta.license`, `meta.downloadHref`, `meta.fileSize`, `meta.checksum`. Uzupełnij opis sekcji w treści (co zawiera, dla kogo, jak używać, licencja, wersje).
- Case studies (`template: case-study`) – wymagają `meta.industry`, `meta.period`, `meta.stack`, `meta.summaryBullets`, `meta.metrics`, `meta.lessons`, oraz CTA (`meta.primaryCta`, `meta.secondaryCta`). Dołącz dane marketingowe (hero image) jeśli dostępne.
- Utrzymuj spójne slug-i między markdown, copy JSON i modułami katalogów (`article|tutorial|comparisonTaxonomyCatalog`).
