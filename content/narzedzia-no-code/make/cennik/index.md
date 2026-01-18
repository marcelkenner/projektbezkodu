---
title: Make – cennik i limity policzone na scenariusze
slug: cennik
path: /narzedzia/make/cennik/
draft: false
template: article
type: review
date: '2026-01-14'
hero:
  heading: Make – cennik i limity policzone na scenariusze
  subheading: >-
    Przeliczam kredyty i operacje na konkretnych przepływach, żebyś wiedział,
    czy plan wystarczy do końca miesiąca.
seo:
  title: Make – cennik i koszty utrzymania automatyzacji
  description: >-
    Ile kosztuje Make przy różnych wolumenach zadań i integracjach. Konkretne
    przykłady i szybkie decyzje.
  keywords:
    - Make
    - Make cennik
    - make pricing
    - automatyzacja
    - operacje
    - kredyty
  canonical: https://www.make.com/en/pricing
meta:
  summaryBullets:
    - 'Werdykt: przy małych wolumenach opłaca się zacząć na Free/Core'
    - 'Dla kogo: freelancerzy vs zespoły — jasne kryteria wyboru'
    - 'Start: szybkie policzenie miesięcznych operacji (wzór i przykład)'
  primaryCta:
    label: Strona cennika Make
    href: https://www.make.com/en/pricing
  updatedAt: '2026-01-14'
  author: Redakcja
taxonomy:
  categories:
    - narzedzia
    - automatyzacja
  tags:
    - make
    - cennik
    - integracje
---

## Obietnica: decyzja budżetowa w 5 minut

**Krótkie podsumowanie:** jeśli masz do ~10–40k kredytów miesięcznie i proste scenariusze — zacznij od Free/Core/Pro; jeśli intensywnie używasz AI albo przetwarzasz duże pliki, policz to osobno i spodziewaj się wyższych kosztów. Oficjalne zasady i progi znajdziesz na stronie [cennika Make](https://www.make.com/en/pricing).

## Kluczowe pytania (i szybkie odpowiedzi)

- Ile będę płacić przy moich scenariuszach?  
  **Werdykt:** policz miesięczne uruchomienia × średnia liczba modułów na uruchomienie; przykład poniżej.

- Czy kredyty różnią się dla modułów AI i zwykłych modułów?  
  **Werdykt:** tak — Make przeszedł na system kredytów, gdzie większość standardowych modułów kosztuje 1 kredyt, ale zaawansowane moduły (zwłaszcza AI lub dłuższe przetwarzanie) mogą kosztować więcej. Zmiana została ogłoszona i opisana jako przejście z "operations" na "credits" (więcej szczegółów w analizie [4Spot Consulting](https://4spotconsulting.com/make-com-changing-pricing-structure-what-you-need-to-know/) oraz w sekcji informacyjnej [Make](https://www.make.com/en/pricing)).  

- Jak uniknąć niespodzianek kosztowych?  
  **Werdykt:** przetestuj rzeczywiste scenariusze, monitoruj użycie i ustaw limity alertów; rozważ kierowanie dużych wywołań LLM bezpośrednio do dostawcy, jeśli to tańsze (pamiętaj: wywołanie HTTP też kosztuje kredyt).

## Czym jest model cenowy Make

Make rozlicza użycie w jednostce zwanej **kredyt**. W uproszczeniu: większość modułów = 1 kredyt za wykonanie, ale nie zawsze — zaawansowane funkcje, jak przetwarzanie plików czy natywne moduły AI, mogą mieć inną wagę. To nie subskrypcja „na task”, tylko miesięczny limit kredytów (niewykorzystane kredyty zwykle wygasają, sprawdź zasady na stronie). Szczegóły planów i progi znajdziesz bezpośrednio na stronie [Make – Pricing](https://www.make.com/en/pricing).

### Co to znaczy w praktyce

- Moduł = pojedyncza akcja w scenariuszu (np. dodanie wiersza do Google Sheets).  
- Praktyczny efekt: scenariusz z 8 modułami uruchamiany 1 000 razy = ~8 000 kredytów.  
- Jak sprawdzić: użyj panelu Make, tam logi wykonania pokazują liczbę użytych modułów/akcji.

## Jak policzyć swoje potrzeby — wzór i przykład

Wzór:
Miesięczne kredyty = liczba scenariuszy × (uruchomień na dzień × 30) × średnia liczba modułów na uruchomienie

Przykład:
Masz 5 scenariuszy, każdy uruchamia się średnio 24 razy dziennie (co godzinę), średnio 8 modułów:
5 × (24 × 30) × 8 = 28 800 kredytów/miesiąc → tu przyda się plan z min. 30–40k kredytów.

W praktyce dolicz:
- testy/development: +10–20% zapasu,  
- kampanie/sezonowość: osobne śledzenie,  
- dodatkowe koszty AI: jeśli używasz natywnych modułów Make AI, sprawdź ich cenę oddzielnie.

## Fakt → Skutek → Werdykt (konkretne sytuacje)

Fakt: Make zamienił jednostkę rozliczeniową z "operations" na "credits" i wprowadził zróżnicowane koszty dla niektórych działań (głównie AI).  
Skutek: możesz płacić znacznie więcej przy dużej liczbie wywołań AI, nawet przy umiarkowanej liczbie scenariuszy.  
Werdykt: **jeśli robisz dużo zapytań do LLM lub przetwarzasz duże pliki, licz budżet osobno na AI**; rozważ wysyłanie zapytań bezpośrednio do dostawcy AI (HTTP/API) i porównaj koszty.

Fakt: plany różnią się nie tylko limitem kredytów, ale też interwałem minimalnym, dostępem do funkcji zespołowych i wsparciem.  
Skutek: krótszy minimalny interwał i priorytet wykonania zwiększają praktyczne zużycie/ofertę.  
Werdykt: **freelancer → Core/Pro; agencja/firmowy automation → Teams/Enterprise**.

## Tabela porównawcza (mini-werdykt)

| Plan | Typowy miesięczny próg | Mini-werdykt |
| --- | ---: | --- |
| Free | 1 000 kredytów | **Dobry start** — testy i proof-of-concept |
| Core / Pro (entry) | 10k–40k | **Najlepszy stosunek ceny do funkcji** dla freelancerów |
| Teams | 100k+ | **Dla zespołów** — zarządzanie i uprawnienia |
| Enterprise | niestandardowe | **Dla krytycznych procesów** — SLA i wsparcie |

Źródła: oficjalna strona [Make – Pricing](https://www.make.com/en/pricing) i analiza zmiany modelu w 2025 roku (m.in. [4Spot Consulting](https://4spotconsulting.com/make-com-changing-pricing-structure-what-you-need-to-know/)).

## Plusy i typowe skargi — synteza

Plusy:
- prosty model kredytowy — łatwo policzyć podstawowe użycie,  
- elastyczność planów od Free do Enterprise,  
- bogate integracje i narzędzia automatyzacji.

Typowe skargi:
- niespodziewane koszty przy użyciu natywnych modułów AI,  
- przenoszenie skomplikowanych scenariuszy na inną platformę jest czasochłonne,  
- brakuje automatycznych predefiniowanych alertów dla niektórych typów overage (trzeba skonfigurować ręcznie).

_Syntetycznie:_ małe wdrożenia rzadko przepłacą, jeśli zrobią proste przeliczenie; duże projekty muszą przeprowadzić testy kosztowe.

## Co sprawdzić przed wyborem (krok po kroku)

1. Uruchom scenariusze testowo przez 48–72 godziny i zlicz rzeczywiste kredyty. (Logi w panelu Make pokazują zużycie.)  
2. Policz miesięczne zapotrzebowanie wzorem i dodaj 20% zapasu.  
3. Sprawdź w [cenniku Make](https://www.make.com/en/pricing), które moduły mają podwyższony koszt (AI, przetwarzanie plików). Jeśli informacja nie jest jasna, zweryfikuj FAQ lub zapytaj support.  
4. Zdecyduj: oszczędność → Core/Pro; governance i pewność działania → Teams/Enterprise.

Jeśli nie możesz znaleźć konkretnego kosztu dla modułu w dokumentacji — poproś support o wyjaśnienie i przykład rozliczenia dla twojego scenariusza (to najpewniejsza metoda weryfikacji).

## Podsumowanie — kto co wybiera

**Idealne dla freelancera/solopreneur:** Core/Pro, jeśli masz do ~40k kredytów/miesiąc.  
**Idealne dla małego zespołu:** Teams — zarządzanie, role i większe limity.  
**Będzie frustrować:** masowe wywołania AI z dużymi plikami — w takim wypadku rozważ hybrydę: LLM rozliczany u dostawcy + Make jako orkiestrator.

**Końcowy werdykt:** **Make to sensowny wybór dla większości automatyzacji**, ale przy intensywnym użyciu AI lub plików konieczna jest osobna kalkulacja kosztów przed wyborem planu. Zawsze potwierdź aktualne limity i ceny na stronie [cennika Make](https://www.make.com/en/pricing).
