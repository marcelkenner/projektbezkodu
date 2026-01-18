---
title: 'Typografia na webie bez kodu: jak dobrać fonty i skalę'
slug: design-bez-kodu-5
path: /design-bez-kodu-5
template: default
draft: false
date: '2026-01-15'
hero:
  heading: 'Typografia na webie bez kodu: jak dobrać fonty i skalę'
  subheading: Proste reguły doboru krojów, wielkości i interlinii bez grzebania w CSS
seo:
  title: Typografia na webie bez kodu — dobór fontów i skali
  description: >-
    Konkretne zasady typograficzne, które możesz wdrożyć w narzędziach no-code —
    od bazy 16px po prosty system skalowania.
  keywords:
    - typografia web
    - dobór fontów
    - type scale
    - no-code design
meta:
  summaryBullets:
    - 'Werdykt: prosta skala + 1–2 fonty wystarczy w większości stron.'
    - 'Dla kogo: właściciele stron, osoby pracujące w no-code, marketerzy.'
    - 'Start: ustaw bazę 16px, dobierz ratio 1.25–1.33, sprawdź 66ch.'
  primaryCta:
    label: Przewodnik web.dev o typografii
    href: https://web.dev/learn/design/typography
  updatedAt: '2026-01-15'
  hasAffiliateLinks: false
taxonomy:
  categories:
    - Design bez kodu
  tags:
    - typografia
    - no-code
    - web
---

## Co obiecuję i komu to pomaga

Obiecuję prosty, praktyczny przepis na czytelną typografię, którą wdrożysz w edytorze no-code (np. Webflow, Wix, Editors typu) bez konieczności pisania CSS. Przyda się, jeśli projektujesz stronę marketingową, landing page lub blog i chcesz wyglądać profesjonalnie bez zagłębiania się w techniczne detale.

## Szybkie pytania (i natychmiastowe decyzje)

- Czy potrzebujesz skomplikowanej palety fontów? **Nie** — w większości projektów użyj maksymalnie 2 fontów: nagłówki + tekst.  
- Czy musisz ustawiać wszystko w px? **Nie** — bazuj na 16px i relatywnych jednostkach w narzędziach, które to umożliwiają. ([[web.dev](https://web.dev/learn](https://web.dev/learn/design/typography?utm_source=openai)/design/typography?utm_source=openai))  
- Czy istnieje "idealny" ratio dla skali? **Wybierz 1.25–1.33** jako bezpieczne startowe ustawienie. ([[pacgie.com](https://www.pacgie.com](https://www.pacgie.com/guides/what-is-type-scale?utm_source=openai)/guides/what-is-type-scale?utm_source=openai))

## Czym jest typograficzny system na stronie (krótko)

To uporządkowany zestaw ustawień: baza (body), skala (ratio), wielkości nagłówków i wartości interlinii (line-height). Dzięki temu wszystkie teksty zachowują spójność wizualną i łatwiej je modyfikować w edytorze no-code.

## Jak zacząć bez kodu

1. Ustaw bazę tekstu na 16px (często dostępne jako "base font size" w edytorze). _Co to znaczy w praktyce:_ większość użytkowników czyta wygodnie przy tej wielkości; narzędzia no-code respektują tę wartość. ([[web.dev](https://web.dev/learn](https://web.dev/learn/design/typography?utm_source=openai)/design/typography?utm_source=openai))  
2. Wybierz ratio 1.25–1.33 i wygeneruj kroki (h1, h2, h3, body, caption). 6–9 stopni wystarczy. ([[pacgie.com](https://www.pacgie.com](https://www.pacgie.com/guides/what-is-type-scale?utm_source=openai)/guides/what-is-type-scale?utm_source=openai))  
3. Ustaw line-height: body 1.5–1.6, nagłówki 1.2–1.3. ([[pacgie.com](https://www.pacgie.com](https://www.pacgie.com/guides/what-is-type-scale?utm_source=openai)/guides/what-is-type-scale?utm_source=openai))

### Szybki 5-minutowy test (bez kodu)

- W edytorze ustaw base 16px.  
- Ustaw h1 = base × (ratio³), h2 = base × (ratio²), h3 = base × ratio (jeśli edytor pozwala na mnożenie/usuwanie — jeśli nie, wpisz wartości w px/liczbach).  
- Sprawdź czy tekst akapitowy przy maksymalnej szerokości kolumny ma około 50–75 znaków; docelowo ~66 znaków. Jeśli nie, zmniejsz szerokość bloku tekstu. ([[web.dev](https://web.dev/learn](https://web.dev/learn/design/typography?utm_source=openai)/design/typography?utm_source=openai))

## Praktyczne reguły: Fakt → Skutek → Werdykt

Fakt: 16px to standardowa baza dla body; używanie relatywnych jednostek (rem) pomaga skalować stronę. ([[web.dev](https://web.dev/learn](https://web.dev/learn/design/typography?utm_source=openai)/design/typography?utm_source=openai))  
Skutek: w narzędziach no-code, które pozwalają ustawić root/base size, zmiana jednego pola skaluje wszystkie elementy powiązane z tą wartością.  
Werdykt: **ustaw 16px jako punkt wyjścia**, a dalsze rozmiary licz w oparciu o wybrane ratio.

Fakt: typowe ratio dla harmonii to 1.125–1.618; dla UI najbezpieczniejsze są 1.25–1.333. ([[pacgie.com](https://www.pacgie.com](https://www.pacgie.com/guides/what-is-type-scale?utm_source=openai)/guides/what-is-type-scale?utm_source=openai))  
Skutek: większe ratio daje silniejszą hierarchię (większe nagłówki), ale może zniszczyć spójność przy mniejszych ekranach.  
Werdykt: **1.25–1.33** jako kompromis między czytelnością a kontrastem; jeśli zależy Ci na mocnym efekcie brandowym, rozważ 1.5+ z warunkiem testów.

Fakt: optymalna długość linii to około 45–75 znaków, idealnie ~66; używaj jednostki ch lub limituj szerokość kontenera. ([[web.dev](https://web.dev/learn](https://web.dev/learn/design/typography?utm_source=openai)/design/typography?utm_source=openai))  
Skutek: długie linie utrudniają śledzenie tekstu; zbyt krótkie rozbijają rytm czytania.  
Werdykt: **ogranicz szerokość tekstu do ~66ch** w narzędziu no-code (często opcja szerokości kontenera).

Fakt: istnieją proste narzędzia online do podglądu par fontów (np. Pair & Compare) oraz listy gotowych kombinacji Google Fonts. ([[pairandcompare.net](https://www.pairandcompare.net](https://www.pairandcompare.net/?utm_source=openai)/?utm_source=openai))  
Skutek: możesz bez instalowania fontów przetestować zestawy i dopasować do marki.  
Werdykt: jeśli nie jesteś typografem, **wybierz jedną parę z Google Fonts** i sprawdź ją w podglądzie strony.

## Porównanie podejść

| Podejście | Kiedy stosować | Mini-werdykt |
| --- | --- | --- |
| 1 font (mono) | Proste landing page, szybkie MVP | **Szybkie i bezproblemowe** |
| 2 fonty (nagłówek + body) | Standard dla większości stron | **Najlepszy kompromis** |
| System skali + tokeny | Duże serwisy, multi-page, brand | **Warto dla skalowalności**, ale większy próg wejścia |

## Plusy i typowe skargi (z doświadczeń)

Plusy:
- Spójność wizualna i szybsze decyzje projektowe.  
- Łatwiejsze testy A/B (zmiana ratio vs zmiana fontu).  

Typowe skargi:
- "Nagłówki wyglądają za duże na mobile" — przyczyną zbyt dużego ratio lub braku ograniczeń responsywnych.  
- "Kroje wyglądają inaczej w różnych przeglądarkach" — sprawdź warianty wag oraz fallback fonts w ustawieniach narzędzia.

## Jak zweryfikować, jeśli nie masz pewności

Jeśli nie wiesz, czy dana kombinacja będzie czytelna:
- Otwórz stronę testową i policz znaki w wierszu (narzędzia deweloperskie lub prosty edytor).  
- Sprawdź line-height przy różnych szerokościach ekranu.  
- Porównaj parę fontów w narzędziu takim jak [Pair & Compare](https://www.pairandcompare.net) lub użyj gotowych list par w artykułach o Google Fonts. ([[pairandcompare.net](https://www.pairandcompare.net](https://www.pairandcompare.net/?utm_source=openai)/?utm_source=openai))

## Puenta

Dla większości stron no-code **ustaw bazę 16px, wybierz ratio 1.25–1.33, użyj 1–2 krojów** i ogranicz szerokość tekstu do ~66ch — to prosty zestaw reguł, który daje czytelną, estetyczną typografię bez konieczności pisania CSS. _Jeśli zależy Ci na mocnym brandingu, przygotuj się na testy i większą liczbę iteracji._

Źródła: [Przewodnik web.dev o typografii](https://web.dev/learn/design/typography). ([[web.dev](https://web.dev/learn](https://web.dev/learn/design/typography?utm_source=openai)/design/typography?utm_source=openai))
