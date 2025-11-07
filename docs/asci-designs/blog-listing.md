┌────────────────────────────────────────────────────────────────────────────┐
│ container (px:24/32/40) │
│ H1 (mt:0 mb:s6): "Artykuły, które prowadzą do działania." │
│ P (mt:s3): "Wybierz temat i zrób kolejny krok w 15 minut." │
│ │
│ ┌ FILTER BAR (py:s4, sticky, top: header+ s3, bg:#fff, border:1px #E5E7EB)┐│
│ │ <form aria-label="Filtry artykułów"> gap:s3 ││
│ │ • [input#search name="q" placeholder="Szukaj po temacie"] (44px) ││
│ │ <label for="search">Wyszukaj artykuły</label> ││
│ │ • [select#cat name="kategoria"] <label>Kategoria</label> ││
│ │ • [select#read name="czas"] <label>Czas czytania</label> ││
│ │ opcje: 5/10/15+ min ││
│ │ • TAG CHIPS (checkboxy, min 44x44): SEO / Webflow / Framer / Automatyz.││
│ │ • [button type="submit" PRIMARY] "Filtruj" ││
│ └──────────────────────────────────────────────────────────────────────────┘│
│ │
│ ┌ POST GRID (grid: desktop 3, tablet 2, mobile 1; gap:s6) ───────────────┐ │
│ │ CARD (klik całość; padding:s4; radius:12; shadow subtle) │ │
│ │ • IMG 3:2 alt="Miniatura artykułu: [tytuł]" width=768 height=512 │ │
│ │ loading="lazy" decoding="async" sizes & srcset jak na Home │ │
│ │ • H3 (mt:s5 mb:s2) • Excerpt (2 linie) │ │
│ │ • Meta: [Ik. clock] "<time> 7 min" • <time datetime="YYYY-MM-DD">Data │ │
│ │ • Kategoria (link) │ │
│ │ • [Link "Czytaj →"] │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ PAGINATION (py:s5) ────────────────────────────────────────────────────┐ │
│ │ <nav aria-label="Paginacja"> │ │
│ │ [« Poprzednia rel="prev"] 1 2 3 4 [Następna » rel="next"] │ │
│ │ Meta robots (od strony 2+): noindex,follow │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘

SEO: CollectionPage + ItemList, canonical na /blog/, rel next/prev na podstronach.
A11y: etykiety pól, checkboxy, aria-current na aktywnej stronie, focus outline.
