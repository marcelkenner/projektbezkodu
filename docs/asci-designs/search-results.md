┌────────────────────────────────────────────────────────────────────────────┐
│ container (px:24/32/40) │
│ H1 (mt:0 mb:s6): Wyniki wyszukiwania dla „{q}” │
│ FORM (role="search", sticky top header+s3, py:s3, border #E5E7EB) │
│ <label for="q">Szukaj w serwisie</label> [input#q value="{q}" (44px)] │
│ [button aria-label="Szukaj" (44x44)] [Ik.: magnifying-glass] │
│ Small (--muted): {liczba} wyników • sort: [najnowsze ▼] │
│ │
│ GRID (gap:s6; desktop 2, tablet 2, mobile 1) │
│ CARD wynik: │
│ • Tytuł (H3 link) │
│ • Excerpt z podświetleniem „{q}” │
│ • Meta: [Ik. clock] „7 min” • <time datetime="YYYY-MM-DD">Data</time> │
│ │
│ EMPTY STATE (gdy brak): │
│ H2 "Brak wyników dla „{q}”" │
│ Lista podpowiedzi: skróć frazę, użyj kategorii, sprawdź pisownię │
│ Linki pomocnicze: Najpopularniejsze tematy (chips 44×44) │
└────────────────────────────────────────────────────────────────────────────┘
SEO: <meta name="robots" content="noindex,follow">, canonical na /szukaj/.
A11y: role="search", pełne <label>, aria-live="polite" przy liczbie wyników.
