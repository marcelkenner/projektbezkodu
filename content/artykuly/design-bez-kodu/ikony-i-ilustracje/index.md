---
title: 'Ikony i ilustracje: styl, grubości i spójność w design systemie'
slug: ikony-i-ilustracje
path: /artykuly/design-bez-kodu/ikony-i-ilustracje/
type: guide
tags:
  - evergreen
  - design-system
  - ikony
  - ilustracje
draft: true
date: '2025-11-05'
hero:
  heading: 'Ikony i ilustracje: styl, grubości i spójność w design systemie'
  subheading: Wpis roboczy — uzupełnij krótki opis, żeby nagłówek nie był pusty.
---

# Ikony i ilustracje: styl, grubości i spójność w design systemie

Ikony i ilustracje są jak akcent kolorystyczny w mieszkaniu.  
Jeśli są z różnych bajek – cały interfejs wygląda jak patchwork.

Ten przewodnik ma pomóc Ci opisać w systemie:

- **jak mają wyglądać ikony** (grid, grubość kreski, zaokrąglenia),
- **jakiego stylu ilustracji używasz** (flat, outline, 3D, „ludki”),
- co jest **dozwolone**, a co **zakazane** (np. stockowe grafiki z innej estetyki).

---

## 1. Ikony – parametry, które musisz ustalić

### 1.1. Siatka i rozmiary

W dokumentacji zapisz:

- podstawowy rozmiar ikon: np. **24×24**,
- mniejsze warianty (np. 16×16) i większe (32×32) – jeśli potrzebne,
- czy ikony są rysowane **na pełnym gridzie** (np. 24×24) czy z marginesem (np. 20×20 w środku).

To później pomaga każdemu, kto dorabia nowe ikony – wie, gdzie powinna „dotykać” kreska, a gdzie zostawić margines.

### 1.2. Grubość linii i styl

Zdecyduj:

- czy ikony są **outline** (kreskowe), **filled** (wypełnione), czy **duotone**,
- jaka jest **domyślna grubość linii** (np. 1.5 px),
- jak wygląda **zakończenie** linii (round, square).

Dobrze działa zasada:

- jeden system = **jeden dominujący styl** ikon (np. outline),
- ewentualne fill warianty tylko dla niektórych przypadków (np. „wypełnione” dla aktywnego stanu).

### 1.3. Kąty, zaokrąglenia, proporcje

Warto ustalić:

- czy rogi są **zaokrąglone** (i o ile),
- czy używasz **pełnych kół** czy bardziej spłaszczonych kształtów,
- czy ikony są rysowane z myślą o tym, że będą wyglądać dobrze w **tekstach o różnych rozmiarach** (np. obok 14 px i 18 px).

Możesz dodać proste zasady:

- „wszystkie ikony używają radius 2px”,
- „konstrukcja oparta jest o proste kąty 0°, 45°, 90°”.

---

## 2. Semantyka ikon i użycie w UI

Ikona sama w sobie rzadko jest zrozumiała.  
W systemie warto zapisać:

- które ikony **mogą występować solo** bez labela,
- gdzie **zawsze muszą mieć podpis**.

Przykłady:

- „kosz”, „lupa”, „x”, „hamburger menu” – często rozpoznawalne, ale w wielu kontekstach i tak warto dodać label,
- bardziej abstrakcyjne ikony („workflow”, „automatyzacje”, „integracje”) _zawsze_ z tekstem.

Dobra reguła:

> „Ikony bez labela stosujemy tylko tam, gdzie wzorzec jest absolutnie oczywisty i powtarza się w całym produkcie.”

---

## 3. Ilustracje – konsekwentny styl brandu

### 3.1. Wybór stylu

Zdecyduj, czy Twoje ilustracje są:

- **flat** (płaskie, proste kształty, ograniczona paleta),
- **outline** (rysunkowe, konturowe),
- **3D / pseudo-3D** (gradientowe, z cieniami, bardziej „produktowe”),
- **figurki / characters** czy raczej abstrakcyjne.

I zapisz to. Dodaj kilka przykładów „dobrych” i „złych” ilustracji – nawet w postaci prostego moodboardu.

### 3.2. Paleta kolorów

Ilustracje powinny być zgodne z paletą systemu, ale nie muszą używać **wszystkich** kolorów naraz.  
W praktyce:

- wybierz **2–3 kolory brandowe** plus kilka neutralnych,
- ustal, które kolory są **reserved** dla ilustracji (np. delikatne tła),
- nie używaj w ilustracjach kolorów przeznaczonych na **error/warning** – żeby nie zaburzać semantyki.

---

## 4. Spójność ikon i ilustracji z resztą systemu

Kilka konkretnych zasad, które warto wpisać do dokumentacji:

1. **Ikony** używają tych samych **kolorów semantycznych** co tekst i elementy UI  
   – np. zielony = success, czerwony = error.

2. Ikony w przyciskach i formularzach mają ten sam **rozmiar i margines** (np. 16×16, odstęp od tekstu `space.2`).

3. Ilustracje w hero i sekcjach mają **stałe proporcje** (np. 3:2, 16:9) i max szerokość (np. 480 px).

4. W dark mode:
   - ikony outline automatycznie zmieniają kolor na `color.text.inverse`,
   - ilustracje mają osobne wersje lub są na neutralnym tle, które nie znika na ciemnym tle.

---

## 5. Do’s & Don’ts – przykład sekcji w dokumentacji

**Do:**

- używaj tylko ikon z naszej biblioteki systemowej,
- jeśli brakuje ikony – zgłoś potrzebę i dorób ją we wspólnej siatce,
- trzymaj ilustracje w ustalonym stylu (paleta, grubość linii, brak zdjęć stockowych obok).

**Don’t:**

- nie mieszaj w jednym widoku ikon z różnych zestawów,
- nie używaj zdjęć stockowych z ludźmi w różnych estetykach tylko po to, żeby „coś było”,
- nie stosuj kolorów ostrzegawczych (czerwony, pomarańczowy) w ilustracjach, gdy sekcja nie dotyczy błędów.

---

## 6. Checklist dla ikon i ilustracji w design systemie

1. Czy mamy **zdefiniowany grid, rozmiary i grubość linii** ikon?
2. Czy są opisane zasady, kiedy ikona może być **bez labela**, a kiedy nie?
3. Czy ilustracje mają **spójny styl** (paleta, sposób rysowania, typ postaci/obiektów)?
4. Czy ikony i ilustracje używają tych samych **tokenów kolorystycznych** co reszta systemu?
5. Czy ktoś nowy jest w stanie stwierdzić, czy dana grafika „pasuje” do systemu, patrząc na dokumentację?

Jeśli tak – wizualna warstwa systemu będzie się spinać nawet, gdy nad produktem pracuje kilka niezależnych zespołów.
