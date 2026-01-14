---
title: Framer – landing w 2 godziny
slug: framer-landing-2h
path: /poradniki/framer-landing-2h/
draft: false
template: tutorial
hero:
  heading: Framer – landing w 2 godziny
  subheading: Szybka strona docelowa z animacjami, formularzem i metrykami.
seo:
  title: Framer – landing w 2 godziny
  description: >-
    Przewodnik jak przygotować landing page we Framerze wraz z animacjami i
    integracjami.
  keywords:
    - framer
    - landing page
    - tutorial
meta:
  difficulty: Łatwy
  duration: 2 godziny
  tools:
    - framer
taxonomy:
  categories:
    - site-builder
  tags:
    - framer
    - landing-page
---

## Co zbudujemy w 2 godziny

- Stronę docelową w Framerze z sekcją hero, proof i CTA.
- Animowany moduł funkcji z interaktywnymi state’ami.
- Formularz Typeform/HubSpot z pełnym śledzeniem konwersji.

## 1. Przygotowanie projektu

- Importuj brand tokens (kolory, typografia). Jeżeli masz design system w Figma, użyj eksportu z Relume.
- Zaplanuj sekcje: hero, problem → solution, funkcje, dowody społeczne, FAQ, CTA.
- Ustal docelowe KPIs (kliknięcia CTA, zapisy na demo, czas na stronie).

## 2. Komponenty Framer

- Użyj wariantów Frame + Stack – łatwiej kontrolować responsywność.
- Dodaj animacje entrance dla sekcji hero i modułu funkcji (Smart Animate).
- Przygotuj komponent CTA z wariantami (primary, secondary) – zmiana statusu `isLoading`, `isSuccess`.

## 3. Integracje

- Formularz: Typeform/Framer Form → HubSpot/Make. Dodaj hidden fields `utm_*`.
- Analityka: Vercel Analytics + Matomo/GA4. Wydziel zdarzenia `cta_primary_click`, `faq_expand`.
- Slack/Email: Make wysyła notyfikacje o nowych leadach do zespołu sprzedaży.

## 4. QA i performance

- Test responsywności (320, 768, 1024, 1440 px).
- Ogranicz liczbę animacji – fallback `prefers-reduced-motion`.
- Skorzystaj z `Image` componentu z optymalizacją – WebP i prawidłowe `alt`.

## 5. Publikacja

- Włącz automatyczne deploye (Framer → Vercel) lub publikację na domenę.
- Dodaj `og:image` z paczki `/zasoby/banery-og/`.
- Po launchu ustaw A/B testy (np. nagłówek, social proof) – Framer ma wbudowane narzędzia.

## Dalsze kroki

- Przygotuj kolejne sekcje (pricing, integracje) jako reużywalne komponenty.
- Zbuduj wersję kampanii w języku angielskim – Framer obsługuje wielojęzyczność.
- Zautomatyzuj raporty – Make + Looker Studio dla zespołu growth.
