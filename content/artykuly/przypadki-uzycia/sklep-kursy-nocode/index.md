---
title: Sklep z kursami no-code – marketplace w 8 tygodni
slug: sklep-kursy-nocode
path: /artykuly/przypadki-uzycia/sklep-kursy-nocode/
draft: false
template: case-study
date: '2024-11-04'
hero:
  heading: Marketplace kursów no-code na Webflow + Lemon Squeezy
  subheading: >-
    Stworzyliśmy sklep wieloautorski z płatnościami w PLN i automatyzacją
    rozliczeń.
seo:
  title: 'Case study: marketplace kursów no-code'
  description: >-
    Jak uruchomiliśmy marketplace kursów no-code na Webflow, integrując
    płatności i rozliczenia z twórcami.
meta:
  industry: E-learning marketplace
  period: Q4 2024
  stack:
    - Webflow
    - Lemon Squeezy
    - Airtable
    - Make
    - Slack
  summaryBullets:
    - CMS Webflow obsługuje katalog kursów, autorów i recenzje.
    - Płatności Lemon Squeezy w PLN + automatyczne rozliczenia prowizji.
    - Panel autorów w Airtable – monitorowanie sprzedaży i wypłat.
  metrics:
    - label: Czas wdrożenia
      value: 8 tyg.
      description: Od discovery do pierwszych sprzedaży.
    - label: Wartość koszyka
      value: +28%
      description: Dzięki bundle i cross-sellom.
    - label: Czas rozliczenia autorów
      value: −90%
      description: Automatyczne raporty i przelewy.
  lessons:
    - >-
      W marketplace’ach kluczowy jest workflow on-boardingu autorów – checklisty
      i automatyzacje robią różnicę.
    - >-
      Cross-sell w koszyku (bundle) musi mieć jasne reguły – inaczej rośnie
      support.
    - >-
      Raporty sprzedażowe najlepiej wysyłać tygodniowo – autorzy wiedzą, co
      promować.
  primaryCta:
    label: Zobacz katalog zasobów
    href: /zasoby/
  secondaryCta:
    label: Zobacz wszystkie artykuły
    href: /artykuly/
---

> **Nota redakcyjna:** To archiwalne studium przypadku. ProjektBezKodu udostępnia je jako instrukcję do samodzielnego wdrożenia i nie świadczy usług.

## Wyzwanie

Klient – kolektyw twórców no-code – chciał uruchomić marketplace kursów i materiałów pomocniczych. Wymagania: płatności w PLN, automatyczne rozliczenia prowizji, panel dla autorów bez budowy customowego zaplecza.

## Rozwiązanie

- Webflow jako warstwa prezentacyjna (kategorie, kursy, autorzy, recenzje).
- Lemon Squeezy obsługuje koszyk, płatności i podatki (OSS), a Make przenosi dane sprzedaży do Airtable.
- Airtable + Interface Designer to panel autorów – widzą sprzedaż, prowizję, status wypłat.
- Slack powiadamia zespół wsparcia o chargebackach i pytaniach kursantów.

## Rezultat

- Marketplace wystartował w 8 tygodni, a w pierwszym miesiącu obsłużył 320 transakcji.
- Średnia wartość koszyka wzrosła o 28% dzięki bundle CX (kurs + checklisty).
- Rozliczenia z autorami zajmują kilka minut – raport generuje Make, a Lemon Squeezy wykonuje przelew.

## Proces

1. Discovery – zmapowanie modeli prowizyjnych i roli adminów.
2. Design system – komponenty Webflow dla kart kursów, autorów, opinii.
3. Integracje – webhook Lemon Squeezy → Make → Airtable → Slack.
4. QA + launch – testy płatności, wersja staging, sesje AMA dla autorów.

## Lekcje

- Pamiętaj o wersjach walutowych – budujemy fallback na EUR/GBP i jasną komunikację w koszyku.
- Autorzy potrzebują prostych instrukcji: nagrywanie wideo, miniatury, copy – przygotowaliśmy template.
- Warto mieć w zanadrzu modul „Bestseller tygodnia” – dynamicznie promuje kursy na stronie głównej.

## Co dalej

Zespół planuje wdrożenie programu partnerskiego (affiliate). Przygotowaliśmy backlog i architekturę trackingową pod rozszerzenie.
