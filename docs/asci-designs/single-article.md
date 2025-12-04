┌────────────────────────────────────────────────────────────────────────────┐
│ container │
│ ┌ BREADCRUMBS <nav aria-label="Okruszki"> ───────────────────────────────┐ │
│ │ Home › Artykuły › [Kategoria] › [Tytuł] (ostatni aria-current="page") │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ H1 (mt:s0 mb:s4): title (frontmatter.title) │
│ Subheading (optional) → hero.subheading │
│ │
│ META BAR (mt:s3, wrap on mobile): │
│ [badge] taxonomy.categories[0] │
│ [badge] meta.difficulty │ [badge] meta.duration │
│ [Ik. clock] "<time datetime="2025-09-18">18.09.2025</time>" │
│ [Ik. user] Autor → meta.author (link to /autor/[slug]) │
│ [Ik. pen] Zaktualizowano: meta.updatedAt │
│ │
│ ┌ DISCLOSURE (jeśli afiliacja) (callout, border-left 4px brand, px:s3) ──┐ │
│ │ [Ik. information-circle aria-hidden] │ │
│ │ "W tekście są linki partnerskie. Nic nie dopłacasz, a wspierasz poradniki."││
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ SHARE PANEL (ArticleSharePanel) ─ buttons LinkedIn / Facebook / X / Reddit / WhatsApp │
│ (input: title, canonical URL from frontmatter.path) │
│ │
│ SUMMARY BULLETS (optional meta.summaryBullets) – short ul to preview najważniejsze punkty │
│ │
│ ┌ LAYOUT: 2 kolumny desktop (TOC sticky) / 1 kol. mobile ────────────────┐ │
│ │ LEFT: ARTICLE BODY (prose, max 68ch) │ │
│ │ H2 (mt:s7 mb:s3): "Po co mi to" │ │
│ │ P (mt:s3): "Robię X, aby dostać Y. Bez Z. Oto najkrótsza droga." │ │
│ │ H2 "Kroki" │ │
│ │ 1)… 2)… 3)… 4)… 5)… (lista numerowana, li+li mt:s1) │ │
│ │ CALL OUT (success): [Ik. check-circle] "Jeśli nie mam danych, zaczynam…"│ │
│ │ H2 "Definicja ‘gotowe’" ✓ checklista (5 pozycji) │ │
│ │ H2 "Najczęstsze błędy" ✗ lista (3–5) │ │
│ │ CTA BLOCK (z frontmatter.meta.primaryCta / secondaryCta) │ │
│ │ [PRIMARY rel="sponsored" jeśli afiliacja] [SECONDARY optional] │ │
│ │ RIGHT: TOC <nav aria-label="Spis treści" class="toc"> (nie sticky) │ │
│ │ • Po co mi to • Kroki • Definicja „gotowe” • Najczęstsze błędy • Krok │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ AUTHOR BOX (py:s4, border-top:1px #E5E7EB, mt:s6) ─────────────────────┐ │
│ │ <img src="/img/authors/autor.webp" alt="Zdjęcie autora: Imię Nazwisko" │ │
│ │ width="72" height="72" loading="lazy" decoding="async"> │ │
│ │ Bio (2 zdania). │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ TAXONOMY / TAGS (chips linkujące do /kategoria/ i /tag/) ──────────────┐ │
│ │ #Ops #Webflow … │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ RELATED (grid 3, gap:s6, py:s6) ───────────────────────────────────────┐ │
│ │ • Artykuł A • Artykuł B • Artykuł C │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ PREV / NEXT <nav aria-label="Nawigacja między artykułami"> ────────────┐ │
│ │ [« Poprzedni rel="prev"] [Następny » rel="next"] │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘

SEO: BlogPosting + BreadcrumbList (JSON‑LD), canonical = frontmatter.path, og:image z hero/meta.
A11y: aria-label dla TOC, <time>, disclosure jako <aside role="note">, share links target blank rel="noopener".
Obrazy w treści: alt w kontekście („Wykres: wzrost ruchu o 37% po wdrożeniu X”).
