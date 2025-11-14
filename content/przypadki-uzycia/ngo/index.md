---
title: Fundacja EduOtwarte – portal wolontariatu w 4 tygodnie
slug: ngo
path: /przypadki-uzycia/ngo/
draft: false
template: case-study
date: '2024-07-02'
hero:
  heading: Fundacja EduOtwarte – portal wolontariatu w 4 tygodnie
  subheading: >-
    Zaprojektowaliśmy portal z ofertami wolontariatu z CMS-em Webflow i
    automatyzacjami Airtable + Make.
seo:
  title: 'Case study NGO: EduOtwarte – portal wolontariuszy no-code'
  description: >-
    Budowa portalu wolontariatu w Webflow, automatyzacja zgłoszeń i raportów w
    Airtable. 3× więcej wolontariuszy w 2 miesiące.
meta:
  industry: NGO & edukacja
  period: Q2 2024
  stack:
    - Webflow
    - Airtable
    - Make
    - MailerLite
  summaryBullets:
    - >-
      Zastąpiliśmy arkusze Excel portalem z filtrowaniem ofert i profilami
      wolontariuszy.
    - Automatyzacje wysyłają podsumowania do koordynatorów i kandydatów.
    - Fundacja otrzymała dashboard KPI bez konieczności zatrudniania analityka.
  metrics:
    - label: Nowi wolontariusze
      value: +212%
      description: Porównanie rekrutacji w ciągu 60 dni przed/po uruchomieniu.
    - label: Czas obsługi zgłoszenia
      value: −65%
      description: Dzięki workflow Airtable + Make.
    - label: Obciążenie koordynatorów
      value: −12h/tydz.
      description: Automatyczne raporty i przypomnienia redukują manualną pracę.
  lessons:
    - >-
      Najważniejsze informacje dla kandydatów muszą być w pierwszym ekranie
      karty oferty.
    - >-
      Rozdzielenie bazy wolontariuszy od bazy ofert upraszcza RODO (osobne
      dostępny i role).
    - >-
      Dwustronna komunikacja SMS/e-mail zwiększa frekwencję na wydarzeniach o 18
      p.p.
  primaryCta:
    label: Zobacz automatyzacje Make
    href: /poradniki/automatyzacja-leadow-make/
  secondaryCta:
    label: Zobacz wszystkie artykuły
    href: /artykuly/
---

> **Nota redakcyjna:** To archiwalne studium przypadku. ProjektBezKodu udostępnia je jako instrukcję do samodzielnego wdrożenia i nie świadczy usług.

## Problem

Fundacja prowadziła rekrutacje wolontariuszy przez formularze Google. Dane lądowały w arkuszach, a koordynatorzy manualnie wysyłali wiadomości i dopisywali komentarze. Przy 30+ ofertach miesięcznie zespół tracił większość czasu na administrację zamiast pracy z beneficjentami.

## Rozwiązanie

- Opracowaliśmy portal w Webflow z filtrowaniem po lokalizacji, temacie i czasie zaangażowania.
- Formularze trafiają do Airtable, gdzie scenariusze Make tworzą rekord, przypisują koordynatora i wysyłają automatyczne potwierdzenie.
- Koordynatorzy otrzymują cykliczne raporty z pipeline’em oraz listą wolontariuszy wymagających kontaktu.
- Integracje z MailerLite wysyłają onboarding, dzięki czemu wolontariusze wiedzą, jakie dokumenty przynieść na pierwsze spotkanie.

## Rezultat

- 212% więcej zgłoszeń wolontariuszy przy identycznym budżecie promocyjnym.
- Czas obsługi jednego zgłoszenia spadł z 25 do 9 minut.
- Koordynatorzy korzystają z dashboardu KPI – widzą rozpływ wolontariuszy na etapy, frekwencję i satysfakcję.

## Proces wdrożenia

1. **Mapowanie procesu** – od pozyskania ofert do podpisania porozumienia wolontariackiego.
2. **Design system** – komponenty Webflow zgodne z WCAG 2.2 AA (większe kontrasty, focus outline).
3. **Automatyzacje** – budowa scenariuszy Make + webhooks z Webflow.
4. **Testy** – dzień testów z realnymi wolontariuszami, poprawki UX.

## Lekcje

- Warto od razu przygotować checklisty dla koordynatorów w Airtable – dzięki temu szybciej adaptują się do nowego narzędzia.
- Zaplanowaliśmy fallback offline: jeśli Make nie odpowie, koordynator dostaje powiadomienie SMS i przechodzi na manualny tryb.
- Zebrane dane pozwoliły fundacji zdobyć dodatkowe finansowanie – raporty generują się automatycznie.

## Co dalej

Fundacja rozwija moduł społecznościowy (wydarzenia i komentarze) na tej samej bazie. Przygotowaliśmy backlog rozszerzeń oraz szkoleniowy playbook dla nowych koordynatorów.
