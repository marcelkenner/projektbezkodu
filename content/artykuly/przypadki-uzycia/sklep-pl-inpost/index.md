---
title: InPost – sklep D2C uruchomiony w 6 tygodni
slug: sklep-pl-inpost
path: /artykuly/przypadki-uzycia/sklep-pl-inpost/
draft: false
template: case-study
date: '2024-09-18'
hero:
  heading: InPost – sklep D2C uruchomiony w 6 tygodni
  subheading: >-
    Zbudowaliśmy landing, katalog produktów i proces fulfillmentu na stacku
    Webflow + Shopify + Make.
seo:
  title: 'Case study: Sklep D2C dla InPost – wdrożenie w 6 tygodni'
  description: >-
    Migracja do Webflow, integracja z Shopify i automatyzacja fulfillmentu w
    Make. Zwiększona konwersja +37% i krótszy czas obsługi.
meta:
  industry: Logistyka & e-commerce
  period: Q3 2024
  stack:
    - Webflow
    - Shopify
    - Make
    - Airtable
  summaryBullets:
    - >-
      Migracja ze starego silnika SaaS do zestawu Webflow + Shopify bez
      przestojów.
    - Integracja statusów dostaw i zwrotów w jednym panelu klienta.
    - >-
      Automatyzacja fulfillmentu skróciła czas obsługi zamówień o 18 godzin
      tygodniowo.
  metrics:
    - label: Wzrost konwersji checkout
      value: +37%
      description: Porównanie okresów 30 dni przed i po wdrożeniu.
    - label: Skrócenie time-to-market
      value: −6 tyg.
      description: W stosunku do planu replatformingu na tradycyjnym CMS.
    - label: Czas obsługi zamówień
      value: −45%
      description: Automatyzacja powiadomień i dokumentów w Make.
  lessons:
    - >-
      Rozdzielenie warstw contentu i katalogu produktowego pozwala skalować
      kampanie niezależnie od ecommerce.
    - >-
      Automatyzacje Make najlepiej dokumentować od razu – wprowadziliśmy
      konwencję namingową i diagramy.
    - >-
      Segmentowanie leadów według typu przesyłki ujawniło nowe insighty do
      kampanii remarketingowych.
  primaryCta:
    label: Zobacz poradnik Webflow
    href: /poradniki/webflow-blog-krok-po-kroku/
  secondaryCta:
    label: Zobacz wszystkie artykuły
    href: /artykuly/
---

> **Nota redakcyjna:** To archiwalne studium przypadku. ProjektBezKodu udostępnia je jako instrukcję do samodzielnego wdrożenia i nie świadczy usług.

## Problem

Zespół marketingu InPost miał prowadzić kampanię D2C z akcesoriami do paczkomatów. Dotychczasowy CMS nie dawał możliwości szybkich testów landingów ani integracji z fulfillmentem. Każda zmiana layoutu wymagała pracy developmentu i odsuwała launch o kolejne sprinty.

## Rozwiązanie

Stworzyliśmy dwuwarstwową architekturę:

- Webflow odpowiada za landing, katalog i storytelling – z możliwością klonowania sekcji pod kampanie.
- Shopify przejęło checkout i stock, a Make synchronizuje zamówienia oraz statusy przesyłek z hurtownią.
- Airtable pełni rolę „command centra” – marketing widzi w nim KPI, a obsługa klienta ma checklisty.

Do tego doszły komponenty w Webflow (sekcja FAQ, karta produktu, CTA) z możliwością wielokrotnego użycia i wariantami językowymi.

## Rezultat

- Kampania wystartowała sześć tygodni wcześniej niż planowano.
- Konwersja checkout wzrosła o 37% dzięki testom A/B USP i lepszemu onboardingowi w koszyku.
- Automatyzacje w Make wysyłają dokumenty przewozowe i spiny do magazynu – skracając obsługę zamówienia z 12 do 6 minut.

## Proces

1. **Discovery (1 tydzień)** – warsztaty z marketingiem, obsługą klienta i fulfillmentem, mapowanie journey klienta.
2. **Prototypowanie (2 tygodnie)** – budowa komponentów w Webflow, integracja FMEA w Shopify, konfiguracja Tag Managera.
3. **Automatyzacja (2 tygodnie)** – scenariusze Make dla zamówień, zwrotów i powiadomień e-mail/SMS.
4. **Stabilizacja (1 tydzień)** – testy obciążeniowe i plan przekazania operacji wewnętrznemu zespołowi.

## Lekcje i rekomendacje

- Warto od początku planować atrybucję – parametry kampanii zapisujemy w Airtable i przekazujemy Shopify przez hidden fields.
- Ujednolicenie statusów przesyłek (nazwy, kolory) zmniejsza liczbę ticketów w obsłudze klienta.
- Segment VIP (zamówienia > 300 PLN) przenieśliśmy do automatycznego nurtu posprzedażowego – to zwiększyło powracalność o 12 p.p.

## Co dalej

W kolejnym kwartale zespół marketingu wdraża kolekcję sezonową samodzielnie, korzystając z bibliotek komponentów i checklist operacyjnych, które przygotowaliśmy.
