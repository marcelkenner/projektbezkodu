┌────────────────────────────────────────────────────────────────────────────┐
│ container │
│ ┌ BREADCRUMBS <nav aria-label="Okruszki"> ───────────────────────────────┐ │
│ │ Home › Artykuły › [Kategoria] › [Tytuł] (ostatni aria-current="page") │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ H1 (mt:s0 mb:s6): "Szybki landing w Webflow w 60 minut - bez wtyczek" │
│ │
│ META (mt:s3): │
│ [Ik. clock aria-hidden] "<time datetime="2025-09-18">7 min • 18.09.2025" │
│ • Autor: <a href="/o-nas/">Imię Nazwisko</a> │
│ • Zaktualizowano: <time datetime="2025-10-02">02.10.2025</time> │
│ │
│ ┌ DISCLOSURE (jeśli afiliacja) (callout, border-left 4px brand, px:s3) ──┐ │
│ │ [Ik. information-circle aria-hidden] │ │
│ │ "W tekście są linki partnerskie. Nic nie dopłacasz, a wspierasz poradniki."││
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ LAYOUT: 2 kolumny desktop (TOC sticky) / 1 kol. mobile ────────────────┐ │
│ │ LEFT: ARTICLE BODY (prose, max 72ch) │ │
│ │ H2 (mt:s7 mb:s3): "Po co mi to" │ │
│ │ P (mt:s3): "Robię X, aby dostać Y. Bez Z. Oto najkrótsza droga." │ │
│ │ H2 "Kroki" │ │
│ │ 1)… 2)… 3)… 4)… 5)… (lista numerowana, li+li mt:s1) │ │
│ │ CALL OUT (success): [Ik. check-circle] "Jeśli nie mam danych, zaczynam…"│ │
│ │ H2 "Definicja ‘gotowe’" ✓ checklista (5 pozycji) │ │
│ │ H2 "Najczęstsze błędy" ✗ lista (3–5) │ │
│ │ H2 "Następny krok" │ │
│ │ [PRIMARY "Zrób X teraz" rel="sponsored" jeśli afiliacja] │ │
│ │ [SECONDARY "Zapisz PDF"] │ │
│ │ RIGHT: TOC <nav aria-label="Spis treści" class="toc" sticky> │ │
│ │ • Po co mi to • Kroki • Definicja „gotowe” • Najczęstsze błędy • Krok │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ AUTHOR BOX (py:s4, border-top:1px #E5E7EB, mt:s6) ─────────────────────┐ │
│ │ <img src="/img/authors/autor.webp" alt="Zdjęcie autora: Imię Nazwisko" │ │
│ │ width="72" height="72" loading="lazy" decoding="async"> │ │
│ │ Bio (2 zdania). │ │
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

SEO: BlogPosting + BreadcrumbList (JSON‑LD), canonical na wersję kanoniczną.
A11y: aria-label dla TOC, <time>, disclosure jako <aside role="note">, link partnerski rel="sponsored".
Obrazy w treści: alt w kontekście („Wykres: wzrost ruchu o 37% po wdrożeniu X”).
