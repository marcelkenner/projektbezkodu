---
title: "Kontrast i kolory w praktyce WCAG"
slug: "kontrast-kolory"
path: "/zgodnosc/kontrast-kolory/"
type: "guide"
tags: ["evergreen", "zgodnosc", "wcag", "ui"]
draft: true
date: "2025-11-05"
---

# Kontrast & kolory: jak projektować, żeby nie walczyć z audytami

Kontrast to jedna z najczęstszych przyczyn „oblania” audytu dostępności. Dobra wiadomość: da się go ogarnąć na etapie designu, zamiast „ratować” front w panice na końcu.

## 1. O jakie liczby chodzi w WCAG?

WCAG 2.1/2.2 podaje trzy kluczowe progi:​:contentReference[oaicite:32]{index=32}

- **tekst (AA)**
  - zwykły tekst: **min. 4.5:1**
  - duży tekst: **min. 3:1**
- **tekst (AAA – ambitny poziom)**
  - zwykły tekst: **7:1**
  - duży tekst: **4.5:1**
- **elementy interfejsu i grafika informacyjna (AA)**
  - obramowania przycisków, ikony, wykresy: **min. 3:1** (1.4.11 Non-text Contrast).:contentReference[oaicite:33]{index=33}

„Duży tekst” to w uproszczeniu ok. 18pt (24px) lub 14pt (19px) pogrubiony.:contentReference[oaicite:34]{index=34}

## 2. Co dokładnie musi mieć kontrast?

Krótko:

- **tekst vs tło** – wszystko, co da się przeczytać;
- **UI** – obramowania / wypełnienia przycisków, stany aktywne, focus, zaznaczenie w formularzach;
- **grafika, która niesie informację** – np. linie na wykresie, słupki, kawałki wykresu kołowego, ikonki z komunikatem.:contentReference[oaicite:35]{index=35}

Nie musi mieć kontrastu:

- czysto dekoracyjne tła i obrazki,
- elementy nieaktywne (disabled),
- elementy niewidoczne dla nikogo (np. ikona w SVG, której nie ma w DOM).:contentReference[oaicite:36]{index=36}

## 3. Typowe błędy i jak ich nie robić

### Błąd 1: jasnoszare teksty na białym tle

UI-owo wygląda to „modnie”, ale:

- `#a0a0a0` na `#ffffff` zwykle nie osiąga 4.5:1 dla małego tekstu,
- nagłówki H1/H2 jeszcze przejdą jako „duże”, ale body text już nie.:contentReference[oaicite:37]{index=37}

**Jak to ogarnąć:**

- użyj ciemniejszego szarego (np. zbliż się do `#555555`),
- lub zwiększ rozmiar i/lub pogrub tekst, żeby wpaść w próg „large text”.

### Błąd 2: granice pól formularzy prawie niewidoczne

Cienka, jasna ramka na białym tle nie spełni 3:1, więc użytkownik z gorszym wzrokiem po prostu nie widzi, gdzie kliknąć.:contentReference[oaicite:38]{index=38}

**Jak poprawić:**

- użyj ciemniejszego obrysu (`#666` zamiast `#ddd`),
- albo w stanie focus dodaj wyraźny outline / tło.

### Błąd 3: focus „bez kontrastu”

Częsty pattern: focus jest np. jasnym niebieskim cieniem na białym tle – wizualnie ledwo zauważalny. A WCAG 2.2 (2.4.11, 2.4.13) podkręca wymagania wobec focusu.:contentReference[oaicite:39]{index=39}

**Jak poprawić:**

- focus outline w kolorze z kontrastem min. 3:1 względem tła i elementu,
- lub zmiana tła + obramowania jednocześnie.

---

## 4. Prosta strategia kolorów dla projektu

### Krok 1: Zdefiniuj „szkielet” palety

Na starcie ustal:

- **kolor bazowy tekstu** – np. bardzo ciemny granat zamiast czarnego (`#0b1220`),
- **kolor bazowy tła** – zwykle bliski bieli (`#ffffff` / `#f9fafb`),
- **kolor akcentu** – np. `#2563eb` (niebieski),
- **kolory „stanu”** – success, warning, danger.

Każdy z nich od razu sprawdź w kontrast checkerze w typowych kombinacjach: tekst na tle, przycisk na tle, focus na tle itd.:contentReference[oaicite:40]{index=40}

### Krok 2: Zbuduj mini tablice

Nie musisz mieć wielkich „design tokens”, ale warto mieć choć mini tablicę:

| Zastosowanie           | Foreground | Background | Cel                                               |
| ---------------------- | ---------: | ---------: | ------------------------------------------------- |
| Tekst główny           |  `#0b1220` |  `#ffffff` | Body text, opisy                                  |
| Nagłówek na jasnym tle |  `#020617` |  `#f9fafb` | H1–H3                                             |
| Link / CTA             |  `#1d4ed8` |  `#ffffff` | Linki inline, małe przyciski                      |
| Przyciski primary      |  `#ffffff` |  `#1d4ed8` | Button text, minimum 4.5:1 względem tła przycisku |
| Focus outline          |  `#1d4ed8` |  `#e5e7eb` | Obrys wokół elementu na jasnym tle                |
| Ramki pól formularzy   |  `#4b5563` |  `#ffffff` | Border inputów                                    |

_Przy rzeczywistej pracy warto przetestować dokładne wartości w kontrast checkerze – powyższe to schemat, nie gotowy standard._

### Krok 3: Stany i hover

Pamiętaj, że **stan hover/focus/pressed** też musi mieć kontrast:

- tekst przycisku musi spełniać 4.5:1 względem aktualnego tła,
- obramowanie lub wypełnienie przycisku / inputu w stanie focus powinno mieć 3:1 względem otoczenia.:contentReference[oaicite:41]{index=41}

---

## 5. Jak testować w praktyce

1. **Automaty** – axe, Lighthouse, WAVE, wtyczki do Figma / przeglądarki.
2. **Manualne sprawdzenie edge-case’ów**:
   - małe szare napisy – disclaimery, meta, placeholdery,
   - inputy i ich stany (default, hover, focus, error),
   - wykresy, ikony statusów, tagi.:contentReference[oaicite:42]{index=42}
3. **Tryb high-contrast / dark mode** – jeśli wspierasz, upewnij się, że tam też trzymasz progi.

---

## 6. Minimalny „kontrakt” z grafikiem / UI designerem

Jeśli pracujesz z osobą od designu, możesz wręcz dopisać do briefu:

- paleta przygotowana **z myślą o 4.5:1 / 3:1** – nie „naprawiamy” tego na froncie,
- konkretne tokeny: `text-primary`, `surface`, `border`, `focus`, `accent`,
- pokazane stany UI (default, hover, focus, disabled, error) z kontrastem.

Dzięki temu check „kontrastowy” staje się krótkim sanity checkiem, a nie polowaniem na błędy w gotowej produkcji.
