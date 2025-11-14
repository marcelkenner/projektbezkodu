---
title: 'Kolory i kontrast: palety, tryb ciemny i dostępność'
slug: kolory-i-kontrast
path: /design-system/kolory-i-kontrast/
type: guide
tags:
  - evergreen
  - design-system
  - kolory
  - accessibility
draft: true
date: '2025-11-05'
---

# Kolory i kontrast: palety, tryb ciemny i dostępność

Dobry system kolorów to nie „ładny gradient primary”.  
To zestaw decyzji, dzięki którym:

- wiesz, **jakich kolorów używać, a jakich nie**,
- przyciski i teksty są czytelne dla większości użytkowników,
- tryb ciemny nie jest dziwną, szarą wersją jasnej palety.

---

## 1. Paleta bazowa: od brandu do semantyki

### 1.1. Trzy warstwy kolorów

W praktycznym design systemie sensownie jest myśleć o trzech warstwach:

1. **Kolory brandowe** – 1–2 „główne” (primary) + ewentualnie accent.
2. **Neutralne tło i tekst** – odcienie szarości, na których da się czytać.
3. **Kolory semantyczne** – success, warning, error, info.

Przykład struktury:

- `color.brand.primary.500`
- `color.neutral.0` (biały), `color.neutral.900` (prawie czarny)
- `color.success.500`, `color.error.500`, `color.warning.500`

Zamiast używać surowych hexów w komponentach, używaj **tokenów semantycznych**:

- `color.text.primary`
- `color.bg.surface`
- `color.border.subtle`
- `color.button.primary.bg.default`

To ułatwia później rebranding, tryb ciemny i poprawki dostępności.

---

## 2. Kontrast według WCAG – co naprawdę musisz wiedzieć

Standard WCAG 2.1 określa minimalne kontrasty między tekstem a tłem, żeby osoby ze słabszym wzrokiem były w stanie tekst odczytać.:contentReference[oaicite:1]{index=1}

W praktyce dla produktów webowych i mobilnych:

- **Poziom AA (tekst):**
  - min. **4.5:1** dla zwykłego tekstu,
  - min. **3:1** dla tekstu dużego (≥18pt albo ≥14pt pogrubione).

- **Poziom AA (elementy UI / ikony):**
  - min. **3:1** dla ikon, obramowań, stanów komponentów.

- **Poziom AAA (bardziej wymagający):**
  - **7:1** dla zwykłego tekstu,
  - **4.5:1** dla dużego tekstu.

To są liczby, które warto dosłownie wkleić do dokumentacji systemu – razem z linkiem do prostego kontrast checkera.

---

## 3. Jak zbudować paletę z myślą o kontraście

### 3.1. Wyznacz „bezpieczne pary” kolorów

Zamiast za każdym razem „liczyć kontrast” na losowych połączeniach, zrób listę **sprawdzonych kombinacji**:

- `color.text.primary` na `color.bg.surface`
- `color.text.inverse` na `color.bg.inverse`
- `color.button.primary.text` na `color.button.primary.bg.default`
- `color.text.error` na `color.bg.surface`

Każdą z tych par raz sprawdzasz (narzędziem do kontrastu), zapisujesz wynik i traktujesz jako **approved**.

W dokumentacji możesz dodać tabelkę:

| Token tekstu                | Token tła                 | Kontrast | Poziom |
| --------------------------- | ------------------------- | -------: | ------ |
| `color.text.primary`        | `color.bg.surface`        |    7.2:1 | AAA    |
| `color.text.muted`          | `color.bg.surface`        |    4.6:1 | AA     |
| `color.button.primary.text` | `color.button.primary.bg` |    4.8:1 | AA     |
| `color.text.inverse`        | `color.bg.inverse`        |    5.1:1 | AA     |

### 3.2. Kolory „tylko dekoracyjne”

Z góry nazwij kolory, które **nie mogą** być używane do tekstu:

- pastelowe tła (`color.bg.accent.soft`),
- bardzo jasne odcienie brandu.

Możesz oznaczyć je jako:

- `color.decorative.*` albo
- dodać flagę w dokumentacji „not for text”.

---

## 4. Tryb ciemny: nie inwersja, tylko osobna paleta

Największy błąd przy dark mode to „odwracamy kolory w devtoolsach i gotowe”.

Lepiej myśleć tak:

1. Definiujesz **osobne tokeny** dla tła i tekstu w dark mode:
   - `color.bg.surface.dark`
   - `color.bg.elevated.dark`
   - `color.text.primary.dark`
   - `color.text.inverse.dark`

2. Brandowe kolory często muszą być **rozjaśnione** w trybie ciemnym, żeby zachować kontrast.

3. W dark mode kluczowe jest:
   - tło rzadko jest idealnie czarne (#000) – lepiej ciemnoszary,
   - powierzchnie „kart” są trochę jaśniejsze od głównego tła,
   - odcienie neutralne zmieniają się bardziej niż brand (zachowujesz charakter marki, ale dopasowujesz wartości).

Dobra praktyka: zrób te same „pary” tekst–tło jak w jasnym trybie i przetestuj kontrast **osobno**.

---

## 5. Stany, kolory i dostępność

### 5.1. Hover, focus, active, disabled

Dla przycisków i linków zdefiniuj:

- **hover** – zwykle lekko ciemniejszy lub jaśniejszy od defaultu,
- **active / pressed** – jeszcze mocniejsze przyciemnienie / zmiana cienia,
- **focus** – wyraźna ramka (outline) o dobrym kontraście,
- **disabled** – osłabiony kontrast, ale nadal czytelny.

Pamiętaj, że **focus** nie może być tylko kolorem tła – potrzebuje wyraźnego obrysu, który widać na każdym tle.

### 5.2. Kolor to nie jedyny nośnik informacji

WCAG wymaga, żeby **nie polegać wyłącznie na kolorze** przy przekazywaniu informacji.:contentReference[oaicite:2]{index=2}

Praktycznie:

- błędy w formularzu: czerwony kolor + ikona + komunikat tekstowy,
- linki: kolor + **podkreślenie**, zwłaszcza w body tekstu,
- wykresy: kolor + różne wzory linii / znaczniki.

---

## 6. Checklist dla systemu kolorów

1. Czy mamy rozdzielone **kolory brandowe, neutralne i semantyczne**?
2. Czy istnieje lista **zatwierdzonych par kolorów tekst–tło** z wynikami kontrastu?
3. Czy stany przycisków (hover, focus, disabled) zachowują wymogi kontrastu?
4. Czy dark mode ma własną, przemyślaną paletę, a nie jest tylko inwersją?
5. Czy w dokumentacji zapisaliśmy, że **kolor nie może być jedynym nośnikiem informacji**?

Jeśli tak – kolor w Twoim design systemie nie będzie tylko „ładny”, ale też użyteczny i dostępny.
