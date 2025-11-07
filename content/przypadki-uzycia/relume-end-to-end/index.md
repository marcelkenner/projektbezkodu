---
title: "Relume end-to-end – biblioteka komponentów dla enterprise"
slug: "relume-end-to-end"
path: "/przypadki-uzycia/relume-end-to-end/"
draft: false
template: "case-study"
date: "2024-10-19"
hero:
  heading: "Enterprise Design System na Relume i Webflow"
  subheading: "Standaryzowaliśmy komponenty dla globalnej marki, skracając czas produkcji landingów o 60%."
seo:
  title: "Case study: Design system na Relume i Webflow"
  description: "Jak w 6 tygodni zbudowaliśmy bibliotekę komponentów w Relume, wdrożyliśmy je w Webflow i opisaliśmy procesy QA."
meta:
  industry: "Enterprise marketing"
  period: "Q4 2024"
  stack:
    - Relume
    - Webflow
    - Storybook
    - Zeroheight
  summaryBullets:
    - "Zdefiniowaliśmy 42 komponenty marketingowe z wariantami dostępności."
    - "Workflow publikacji landingów skrócony o 60%."
    - "Dokumentacja w Zeroheight + Storybook synchronizowana z Relume."
  metrics:
    - label: "Czas przygotowania strony"
      value: "−60%"
      description: "Porównanie przed i po wdrożeniu biblioteki."
    - label: "Spójność komponentów"
      value: "100%"
      description: "Automatyczny linting klas + checklisty QA."
    - label: "Liczba błędów dostępności"
      value: "−85%"
      description: "Dzięki testom Axe i definicji zasad w komponentach."
  lessons:
    - "Relume świetnie sprawdza się jako źródło, ale potrzebuje jasnych konwencji namingowych."
    - "QA musi być częścią procesu – wprowadziliśmy checklistę A11y, SEO i legal."
    - "Storybook + Zeroheight to dobre combo dla onboardingów w korporacji."
  primaryCta:
    label: "Pobierz pakiet ikon PL"
    href: "/zasoby/polskie-ikony-i-znaki/"
  secondaryCta:
    label: "Zobacz wszystkie artykuły"
    href: "/artykuly/"
---

> **Nota redakcyjna:** To archiwalne studium przypadku. ProjektBezKodu udostępnia je jako instrukcję do samodzielnego wdrożenia i nie świadczy usług.

## Wyzwanie

Globalna firma technologiczna miała 12 zespołów marketingowych, każdy tworzył landing w innym stylu. Celem było stworzenie biblioteki komponentów, które każdy region może adaptować bez pomocy devów.

## Rozwiązanie

- Warsztaty z zespołami regionów – zidentyfikowaliśmy powtarzalne sekcje (hero, proof, pricing, CTA).
- Budowa komponentów w Relume (z tokenami spacing, color, typography) i eksport do Webflow.
- Dokumentacja w Zeroheight + Storybook – każdy komponent ma opisy wariantów, stany focus i guidelines contentowe.
- Automatyzacja QA: checklisty w Jira + testy Axe przez Cypress w pipeline.

## Rezultat

- Czas przygotowania nowej strony spadł z 5 do 2 dni.
- Liczba błędów dostępności zmniejszona o 85%.
- Zespół globalny ma pełną kontrolę nad brandem, a regiony – elastyczność modyfikacji treści.

## Proces

1. Inwentaryzacja istniejących landingów – pogrupowanie elementów.
2. Projekt komponentów high-fidelity, implementacja w Relume i Webflow.
3. Dokumentacja w Zeroheight, integracja ze Storybookiem (React wersja komponentów).
4. Szkolenia i wprowadzenie governance (przeglądy co sprint, audyty).

## Lekcje

- Nawet w Enterprise trzeba zadbać o prosty onboarding – przygotowaliśmy wideo i mini kurs.
- Checklisty QA zapisane w Relume/Zeroheight działają jak guard rail – nikt nie publikuje strony bez przejścia procesu.
- Należy od razu planować wersjonowanie – wprowadziliśmy semver komponentów i changelog.

## Co dalej

W pipeline’ie jest automatyczne generowanie landingów ABM z danych CRM. Przygotowaliśmy integrację API i ruleset do testów.
