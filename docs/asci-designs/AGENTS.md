🔑 LEGENDA + TOKENY (Źródło prawdy)

Siatka & kontenery

container: max‑width 1200px, padding‑x: 24px (≤640px), 32px (641–1024px), 40px (≥1025px)

Kolumny: 12 (desktop ≥1025px), 6 (tablet 641–1024px), 1 (mobile ≤640px)

prose (treść artykułów): max‑width 72ch

Skala odstępów (sN) - oś 8‑pt z pół‑krokami
s0=0, s1=4, s2=8, s3=12, s4=16, s5=24, s6=32, s7=48, s8=64, s9=96 (px)

Typografia

Body: 16–18px (fluid), line‑height 1.6

H1: 32–48px, H2: 24–36px, H3: 20–28px, Small: 14px

Zasady odstępów (nagłówki/treść)

Więcej PRZED nagłówkiem niż PO.
H1: mt:0 mb:s6 • H2: mt:s7 mb:s3 • H3: mt:s5 mb:s2 • Redukcja: h1 + h2 => mt:s4

Treść w przepływie (p, ul, ol, pre, blockquote, figure, .callout): tylko margin-top = s3 (wyjątki: ciężkie bloki mt:s4), p + p => mt:s2

li + li => mt:s1

Sekcje (section) domyślnie py:s7

Kolory (kontrast AA na białym)

Tekst: --ink #0F172A, --muted #475569, tło --bg #FFFFFF

Brand: --brand-600 #0284C7 (tło przycisku), --brand-700 #0369A1 (tekst/linki/obrys), --brand-800 #075985 (hover/focus)

Powierzchnia: --surface #F8FAFC

Przyciski (min. target 44×44)

Primary: min‑height 44px, padding 12×16px, radius 8px, tekst ≥16px, tło --brand-600, tekst #fff

Secondary: border 1px --brand-700, tekst --brand-700, tło transparent

Focus: outline 2px --brand-700, offset 2px

Ikony (24px, liniowe): check-circle, play, bolt, sparkles, link, clock, document-text, arrow-right, home, magnifying-glass, exclamation-triangle, information-circle

A11y (stałe)

<a class="skip" href="#content">Pomiń do treści</a> jako pierwszy element w DOM

role="search" dla wyszukiwania; pełne <label>

Breadcrumbs: nav[aria-label="Okruszki"], ostatni element aria-current="page"

TOC: nav[aria-label="Spis treści"]

Daty: <time datetime="YYYY-MM-DD">

Ikony dekoracyjne: aria-hidden="true"

Linki partnerskie: dopisek w treści + rel="sponsored"

Obrazy (CWV)

LCP (hero): bez loading="lazy", z fetchpriority="high", stałe width/height, prawidłowe sizes/srcset

Pozostałe: loading="lazy", decoding="async", stałe wymiary lub aspect-ratio

Paginacja SEO: na listingu od strony 2+: noindex,follow + rel="next/prev"

Canonical: 1:1 na wszystkich stronach

Język strony: <html lang="pl">

📦 DODATKI, KTÓRE „USZCZELNIAJĄ” MAKiety

1. Tytuły i meta (konkretne przykłady)

Home

<title>Strony bez kodu, które sprzedają - ProjektBezKodu</title>
<meta name="description" content="Zbuduj stronę w dni: Webflow, Framer, SEO i automatyzacje. Leady, porządek w CMS i szybkość - bez czekania na developera.">

Blog listing

<title>Blog - poradniki no‑code, SEO i automatyzacje | PBK</title>
<link rel="canonical" href="https://projektbezkodu.pl/blog/">

Artykuł

<title>Szybki landing w Webflow w 60 minut - poradnik | PBK</title>
<meta name="description" content="Krok po kroku: landing w Webflow w godzinę. Sekcje, CMS, publikacja i checklista 80/20.">
<link rel="canonical" href="https://projektbezkodu.pl/artykuly/webflow-landing-60-min/">

2. JSON‑LD (skrót - gdzie i co)

Home: WebSite (z SearchAction) + Organization

Blog/Pillar: CollectionPage + ItemList (pozycje kart)

Artykuł: BlogPosting + BreadcrumbList (dates, author, image, wordCount)

3. Interakcje i stany (jednoznacznie)

Hover linków: podkreślenie + kolor → --brand-700

Hover primary: tło --brand-800

Focus wszystkie elementy interaktywne: outline 2px --brand-700, offset 2px

Chipy filtrów: checkbox ukryty, etykieta 44×44, aria-pressed dla button‑chips lub <input type="checkbox"> dla semantyki

4. Core Web Vitals

LCP = obraz hero (atrybuty w makiecie)

CLS = stałe width/height obrazów i aspect-ratio:3/2 dla miniaturek

Lazy‑load wszystkie obrazy poza LCP (loading="lazy" decoding="async")
