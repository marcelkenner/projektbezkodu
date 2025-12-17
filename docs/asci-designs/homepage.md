┌────────────────────────────────────────────────────────────────────────────┐
│ [SKIP LINK] <a href="#content">Pomiń do treści</a> │
│ │
│ ┌ HEADER (role="banner", py:s5, bg:#fff, border-bottom:1px #E5E7EB) ────┐ │
│ │ container (1200px, px: 24/32/40) │ │
│ │ ├─ LOGO: <img src="/img/logo.svg" alt="ProjektBezKodu – logo" │ │
│ │ │ width="144" height="32" decoding="async"> │ │
│ │ ├─ NAV <nav aria-label="Główna"> gap:s5 │ │
│ │ │ • O nas • Artykuły • Narzędzia • Szablony • Kontakt │ │
│ │ └─ SEARCH <form role="search" action="/szukaj/"> │ │
│ │ <label for="q">Szukaj w serwisie</label> │ │
│ │ [input#q placeholder="Czego dziś szukasz?" (min 44px wysokość)] │ │
│ │ [button (44x44) aria-label="Szukaj"] [Ik.: magnifying-glass] │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ HERO (id="hero", py:s8, bg: --surface) ────────────────────────────────┐ │
│ │ container │ │
│ │ H1 (mt:0, mb:s6, 32–48px/1.15): │ │
│ │ "Zbuduj stronę no-code i zacznij zbierać leady w tym tygodniu." │ │
│ │ P (mt:s3): │ │
│ │ "Oferta widoczna, leady w skrzynce i pełna kontrola treści - │ │
│ │ bez czekania na developera." │ │
│ │ CTA (gap:s3): │ │
│ │ • [PRIMARY] href="/narzedzia/webflow/" │ │
│ │ text:"Zacznij w Webflow" (min 44px; bg:--brand-600; txt:#fff) │ │
│ │ aria-label="Przejdź do narzędzia Webflow" │ │
│ │ • [SECONDARY] href="/sciezki/webflow-7-dni/" │ │
│ │ text:"Plan na 7 dni" (border:1px --brand-700; txt:--brand-700) │ │
│ │ Microcopy small (14px, --muted, mt:s2): │ │
│ │ "Link do Webflow może być afiliacyjny." │ │
│ │ HERO IMG (LCP, right/under on mobile): │ │
│ │ <img src="/img/hero-3x2.webp" width="1120" height="747" │ │
│ │ alt="Zrzut układu 5 sekcji w Webflow: nagłówek, podtytuł, CTA" │ │
│ │ fetchpriority="high" decoding="async" │ │
│ │ sizes="(max-width:640px) 92vw, (max-width:1200px) 80vw, 1120px" │ │
│ │ srcset="/img/hero-3x2-560.webp 560w, /img/hero-3x2-840.webp 840w, │ │
│ │ /img/hero-3x2.webp 1120w"> │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ SOCIAL PROOF (py:s6) ──────────────────────────────────────────────────┐ │
│ │ container; text:"Buduj z:" │ │
│ │ LOGO LIST (gap:s5; wrap): │ │
│ │ • <img alt="Logo [Nazwa 1]" width="120" height="48" loading="lazy"> │ │
│ │ • <img alt="Logo [Nazwa 2]" …> … 5–6 logotypów │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ PILLARS GRID (py:s7) ──────────────────────────────────────────────────┐ │
│ │ container; grid: desktop 3×2 / tablet 2×? / mobile 1×N; gap:s6/s5/s4 │ │
│ │ CARD (klik cały obszar; padding:s4; radius:12; shadow subtle) │ │
│ │ • [Ik.: bolt aria-hidden="true"] H3 "Webflow" (mt:s5 mb:s2) │ │
│ │ • P "Publikujesz w dni" (mt:s3) │ │
│ │ • Link text:"Sprawdź" href="/narzedzia/webflow/" → [arrow-right] │ │
│ │ … (Framer / Automatyzacje / SEO / Szablony / Wydajność) │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ HOW IT WORKS (py:s7) ──────────────────────────────────────────────────┐ │
│ │ container; H2 (mt:s7 mb:s3): "Jak działam (no-code)" │ │
│ │ <ol start=1> gap:s4 │ │
│ │ 1) Ustalasz cel → 2) Składasz 5 sekcji → 3) Publikujesz → │ │
│ │ 4) Zbierasz leady → 5) Mierzysz i poprawiasz │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ LATEST ARTICLES (py:s7) ───────────────────────────────────────────────┐ │
│ │ container; grid 3 kol (min 320px), gap:s6; │ │
│ │ CARD: │ │
│ │ • IMG 3:2 <img alt="Miniatura artykułu: [skrócony tytuł]" │ │
│ │ width="768" height="512" loading="lazy" decoding="async" │ │
│ │ sizes="(max-width:640px) 92vw, (max-width:1200px) 33vw, 384px"│ │
│ │ srcset="…"> │ │
│ │ • H3 (mt:s5 mb:s2) • Excerpt (2 linie) │ │
│ │ • Meta: [Ik. clock] "7 min" • <time datetime="2025-10-02">02.10.2025</│ │
│ │ • Link "Czytaj →" │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ NEWSLETTER (py:s6, bg:--surface, radius:12) ───────────────────────────┐ │
│ │ container; H3 "Chcę checklistę i gotowe sekcje" │ │
│ │ FORM (grid gap:s3) │ │
│ │ • <label for="email">E‑mail</label> │ │
│ │ • [input#email placeholder="mój@adres.pl" (min 44px)] │ │
│ │ • [checkbox required id="consent"] label:"Wyrażam zgodę na kontakt" │ │
│ │ • [PRIMARY "Wyślij"] │ │
│ │ • small (--muted): "Polityka prywatności → /polityka-prywatnosci/" │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌ FOOTER (py:s6, bg:#0B1220, color:#fff) ────────────────────────────────┐ │
│ │ container; 4 kolumny: Nawigacja • Kategorie • Zasoby • Social │ │
│ │ LOGO alt="ProjektBezKodu – logo (jasne)" │ │
│ │ Microcopy small: "Linki do narzędzi mogą być afiliacyjne." │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘

SEO:

<title>Strony no-code, które sprzedają - ProjektBezKodu</title>
<meta name="description" content="Zbuduj stronę w dni: Webflow, Framer, SEO i automatyzacje. Leady, porządek w CMS i szybkość - bez czekania na developera.">
<link rel="canonical" href="https://projektbezkodu.pl/">
JSON‑LD: WebSite + Organization (z SearchAction).
A11y: skip link, role="search", pełne <label>, ikony dekoracyjne aria-hidden, kolory AA.
