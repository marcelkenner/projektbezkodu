---
title: "Przyciski i stany – szablon do design systemu"
slug: "przyciski-i-stany"
path: "/design-system/przyciski-i-stany/"
type: "template"
tags: ["evergreen", "design-system", "buttons", "template"]
draft: true
date: "2025-11-05"
---

# Przyciski i stany – szablon do design systemu

Przyciski są jak kręgosłup interfejsu.  
Jeśli każdy projektant rysuje je trochę inaczej, produkt zaczyna się rozsypywać.

Ten szablon pomoże Ci zdefiniować w dokumentacji:

- typy przycisków (primary/secondary/ghost/destructive),
- stany (default, hover, focus, pressed, disabled, loading),
- tokeny kolorów, spacingu i typografii powiązane z przyciskami.

---

## 1. Typy przycisków

### 1.1. Minimalny zestaw

Dla większości produktów wystarczy:

- **Primary** – główna akcja na ekranie,
- **Secondary** – akcje drugiego rzędu,
- **Tertiary / Ghost** – akcje mniej ważne, np. linki tekstowe,
- **Destructive** – akcje groźne (usuń, anuluj, reset).

Przykład definicji w dokumentacji:

- **Primary** – jeden na widoku (np. „Zapisz”, „Kup teraz”),
- **Secondary** – maks. 2–3 na widoku,
- **Destructive** – zawsze czerwony, zawsze z jasnym labelkiem.

---

## 2. Stany przycisków

Dla każdego typu przycisku opisujesz te same stany:

1. `default` – jak wygląda na co dzień,
2. `hover` – po najechaniu (desktop),
3. `active / pressed` – w momencie kliknięcia,
4. `focus-visible` – gdy przycisk ma fokus z klawiatury,
5. `disabled` – gdy akcja jest niedostępna,
6. `loading` – gdy akcja jest w trakcie.

Do dokumentacji warto dodać mini-tabelę.

### 2.1. Przykład: Button Primary

| Stan          | Tło                                | Obramowanie                    | Tekst                       | Inne                             |
| ------------- | ---------------------------------- | ------------------------------ | --------------------------- | -------------------------------- |
| default       | `color.button.primary.bg`          | `none` lub `color.transparent` | `color.button.primary.text` | cień lekki opcjonalnie           |
| hover         | `color.button.primary.bg.hover`    | jak wyżej                      | jak wyżej                   | ciemniejszy odcień tła           |
| pressed       | `color.button.primary.bg.pressed`  | jak wyżej                      | jak wyżej                   | mniejszy cień/brak               |
| focus-visible | `color.button.primary.bg`          | `color.focus.ring`             | jak wyżej                   | outline 2px, radius = btn        |
| disabled      | `color.button.primary.bg.disabled` | none                           | `color.text.disabled`       | kursor default                   |
| loading       | jak `default`                      | jak wyżej                      | tekst 0% opacity, spinner   | blokada wielokrotnego kliknięcia |

---

## 3. Typografia i spacing w przyciskach

### 3.1. Tekst

Wybierz jeden styl typograficzny dla wszystkich przycisków, np.:

- `font.button`:
  - rozmiar: 14–16 px,
  - `line-height`: 1.2–1.4,
  - weight: 500–600,
  - uppercase **tylko, jeśli** zachowasz odpowiedni tracking i krótkie labelki.

Dobrze działa zasada:

> „Label przycisku = 1–3 słowa, czasownik w trybie rozkazującym („Wyślij”, „Dodaj do koszyka”)”.

### 3.2. Padding i wysokość

Zdefiniuj:

- minimalną **wysokość przycisku** – np. 40 px na desktop, 44–48 px na mobile,
- **padding poziomy** – np. `space.3` (12px) po obu stronach tekstu,
- **odstęp między ikoną a tekstem** – np. `space.2` (8px).

W dokumentacji możesz zapisać:

> „Wszystkie przyciski mają wysokość wielokrotności 8 px, odstępy wewnętrzne pobieramy wyłącznie z tokenów spacingu.”

---

## 4. Ikony w przyciskach

Jeśli dopuszczasz ikony:

- zdefiniuj ich rozmiar (np. 16×16),
- ustal, że ikona zawsze siedzi:
  - z lewej (np. „Dodaj”),
  - albo z prawej (np. „Dalej” z ikoną strzałki),
- ustal spójny odstęp między ikoną a tekstem (`space.2` albo `space.3`).

Warto też opisać:

- kiedy używać przycisków **tylko z ikoną** (np. w pasku narzędzi),
- jakie **labelki aria** nadajemy takim przyciskom dla dostępności.

---

## 5. Stany błędów i potwierdzeń

Choć sam przycisk często nie zmienia koloru na błąd/sukces, możesz zdefiniować:

- wariant **destructive** (czerwony background, wyraźny tekst),
- krótkie **feedbacki obok przycisku** (np. „Zapisano”, „Coś poszło nie tak”).

W systemie warto opisać:

- jak długo znika komunikat sukcesu,
- jak stylizowane są komunikaty błędów (kolor, ikona, miejsce).

---

## 6. Checklist – przyciski w Twoim design systemie

1. Czy typy przycisków (primary/secondary/ghost/destructive) są dobrze opisane i używane spójnie?
2. Czy każdy przycisk ma opisane **stany**: default, hover, active, focus, disabled, loading?
3. Czy istnieją **tokeny** na kolory, typografię i spacing przycisków, zamiast nagich hexów i px?
4. Czy przyciski z ikonami mają jasno zdefiniowane zasady układu?
5. Czy przyciski są **wystarczająco duże** do tapnięcia na mobile (min. ~44×44 px) i mają wyraźny focus dla klawiatury?

Jeśli tak – możesz spokojnie budować nowe ekrany, nie bojąc się, że ktoś „stylowo” wymyśli sobie piąty typ przycisku.
