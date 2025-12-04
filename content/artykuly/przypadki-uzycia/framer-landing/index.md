---
title: Landing w Framerze dla kampanii produktowej
slug: framer-landing
path: /artykuly/przypadki-uzycia/framer-landing/
draft: false
template: case-study
date: "2024-04-16"
hero:
  heading: Framer landing – kampania produktowa w tydzień
  subheading: >-
    Dostarczyliśmy landing z animacjami i integracjami analitycznymi, który
    wsparł premierę funkcji AI.
seo:
  title: "Case study: Landing Framer dla kampanii produktowej"
  description: >-
    Jak w 7 dni przygotowaliśmy landing Framer z interaktywnymi animacjami i
    integracjami growth.
meta:
  industry: SaaS AI
  period: Q2 2024
  stack:
    - Framer
    - Vercel Analytics
    - HubSpot
    - Make
  summaryBullets:
    - Interaktywne demo funkcji AI i animacje w Framerze.
    - Integracja formularza z HubSpot i scoringiem leadów.
    - Automatyczne raporty kampanii wysyłane do Slacka.
  metrics:
    - label: Czas produkcji
      value: 7 dni
      description: Od kick-off do publikacji.
    - label: Współczynnik kliknięć CTA
      value: 28%
      description: Dzięki interaktywnej sekcji demo.
    - label: SQL z kampanii
      value: "+96"
      description: W ciągu pierwszych 14 dni.
  lessons:
    - >-
      Microinteraction w Framerze zwiększa zaangażowanie, ale trzeba pamiętać o
      fallbackach.
    - >-
      Przekazanie struktur danych (naming) do analityki od początku oszczędza
      debugowania.
    - >-
      Automatyczne raporty w Slacku pomagają zespołowi growth reagować w czasie
      rzeczywistym.
  primaryCta:
    label: Sprawdź komponenty Framer
    href: /poradniki/framer-landing-2h/
  secondaryCta:
    label: Zobacz wszystkie artykuły
    href: /artykuly/
---

> **Nota redakcyjna:** To archiwalne studium przypadku. ProjektBezKodu udostępnia je jako instrukcję do samodzielnego wdrożenia i nie świadczy usług.

## Cel

Zespół produktowy launchował funkcję AI. Potrzebowali landingu, który zademonstruje kluczowe use case’y i natychmiast zbierze zainteresowanie działów sprzedaży.

## Rozwiązanie

- Landing w Framerze z sekcją hero (wideo loop), blokiem „Jak działa” z animacjami state machine i modułem „Use cases”.
- Formularz demo, który trafia do HubSpot (scoring + automatyczne taski) oraz do Slacka.
- Wideo-poradnik osadzony z Loom – integracja w modalach.
- Automatyzacje Make wysyłają raporty kampanii i przypominają zespołowi o follow-upach.

## Rezultat

- Landing powstał w 7 dni, w tym animacje i testy.
- CTR na CTA demo 28%, 96 SQL dla zespołu sprzedaży w 14 dni.
- Zespół marketingu ma reużywalny szablon – kolejne kampanie budują na tych samych komponentach.

## Proces

1. Warsztat copy + storyboard – zdefiniowaliśmy narrację i kluczowe sekcje.
2. Prototyp w Framerze, iteracje z zespołem produktu.
3. Integracje – HubSpot, Make, Vercel Analytics.
4. QA – testy wydajności, dostępności i fallbacków.

## Lekcje

- Animacje muszą mieć fallback – przygotowaliśmy statyczne obrazki na low-power devices.
- Tagowanie eventów w Framerze to must-have – szybciej diagnozujemy, co działa.
- Warto mieć checklistę dla growth: outputy, doodania do nurtów e-mail, remarketing.

## Co dalej

Przygotowaliśmy backlog testów A/B i integrację z produktowym onboardingiem, aby płynnie przeprowadzić użytkownika do triala.
