---
title: Design tokens starter – tabela tokenów typografii, kolorów i spacingu
slug: tokens-starter
path: /artykuly/design-bez-kodu/tokens-starter/
type: template
tags:
  - evergreen
  - design-system
  - tokens
  - template
draft: true
date: "2025-11-05"
hero:
  heading: Design tokens starter – tabela tokenów typografii, kolorów i spacingu
  subheading: Wpis roboczy — uzupełnij krótki opis, żeby nagłówek nie był pusty.
---

# Design tokens starter – tabela tokenów typografii, kolorów i spacingu

Design tokens to **słownik wartości wizualnych** Twojego systemu: kolorów, typografii, spacingu itd.  
Zamiast rozsianych po projekcie hexów i px, masz jedną, spójną tabelę nazw i wartości, z której korzystają projektanci i programiści.:contentReference[oaicite:3]{index=3}

Ten template to punkt startowy – możesz go wkleić do Notion, Excela albo narzędzia do design systemów i dopasować do swojej marki.

---

## 1. Zasady nazywania tokenów

Kilka prostych reguł:

1. **Małe litery, kropki jako separator** – `color.text.primary`, `space.4`.
2. **Co, nie jak** – `color.bg.surface`, nie `color.white` (bo kolor powierzchni może się zmieniać).
3. **Poziomy abstrakcji**:
   - poziom „surowy”: np. `color.blue.500` = #2563EB,
   - poziom „semantyczny”: `color.button.primary.bg` = `color.blue.500`.

Dzięki temu możesz zmieniać brand, nie dotykając komponentów.

---

## 2. Tokeny kolorów (color tokens)

### 2.1. Surowa paleta

| Token               | Wartość | Opis                    |
| ------------------- | ------- | ----------------------- |
| `color.blue.50`     | #EFF6FF | najjaśniejszy niebieski |
| `color.blue.500`    | #2563EB | podstawowy brand        |
| `color.blue.700`    | #1D4ED8 | hover / pressed         |
| `color.neutral.0`   | #FFFFFF | biały                   |
| `color.neutral.900` | #0F172A | prawie czarny           |
| `color.red.500`     | #EF4444 | error                   |
| `color.green.500`   | #22C55E | success                 |

### 2.2. Tokeny semantyczne

| Token                           | Wartość / referencja | Użycie               |
| ------------------------------- | -------------------- | -------------------- |
| `color.bg.app`                  | `color.neutral.50`   | tło aplikacji        |
| `color.bg.surface`              | `color.neutral.0`    | karty, sekcje        |
| `color.text.primary`            | `color.neutral.900`  | główny tekst         |
| `color.text.muted`              | `color.neutral.600`  | pomocniczy tekst     |
| `color.text.inverse`            | `color.neutral.0`    | tekst na ciemnym tle |
| `color.button.primary.bg`       | `color.blue.500`     | tło primary          |
| `color.button.primary.bg.hover` | `color.blue.700`     | hover                |
| `color.button.primary.text`     | `color.neutral.0`    | tekst w primary      |
| `color.border.subtle`           | `color.neutral.200`  | delikatne linie      |
| `color.border.strong`           | `color.neutral.400`  | mocniejsze linie     |
| `color.feedback.error`          | `color.red.500`      | ikony i tekst błędu  |
| `color.feedback.success`        | `color.green.500`    | sukces               |

---

## 3. Tokeny typografii (typography tokens)

### 3.1. Podstawowe

| Token                 | Wartość            | Opis               |
| --------------------- | ------------------ | ------------------ |
| `font.family.base`    | "Inter", system-ui | font dla UI        |
| `font.family.heading` | "Inter", system-ui | font dla nagłówków |
| `font.size.xs`        | 12px               | caption / meta     |
| `font.size.sm`        | 14px               | tekst w UI         |
| `font.size.md`        | 16px               | body / artykuły    |
| `font.size.lg`        | 20px               | mniejsze nagłówki  |
| `font.size.xl`        | 24px               | H2                 |
| `font.size.2xl`       | 32px               | H1                 |
| `font.weight.regular` | 400                | podstawowy         |
| `font.weight.medium`  | 500                | labelki, CTA       |
| `font.weight.bold`    | 700                | nagłówki           |
| `line.height.tight`   | 1.2                | nagłówki           |
| `line.height.normal`  | 1.5                | body               |
| `line.height.relaxed` | 1.7                | długie teksty      |

### 3.2. Style złożone (text styles)

Możesz też zdefiniować złożone tokeny:

| Token             | Składniki                                                                       | Użycie          |
| ----------------- | ------------------------------------------------------------------------------- | --------------- |
| `text.body`       | `font.family.base`, `font.size.md`, `line.height.normal`                        | treść           |
| `text.caption`    | `font.family.base`, `font.size.xs`, `line.height.normal`                        | meta, labelki   |
| `text.button`     | `font.family.base`, `font.size.sm`, `font.weight.medium`                        | przyciski       |
| `text.heading.h1` | `font.family.heading`, `font.size.2xl`, `line.height.tight`, `font.weight.bold` | główny nagłówek |

---

## 4. Tokeny spacingu (spacing tokens)

Bazujemy na 8-pt gridzie, z pół-krokami 4 px.

| Token     | Wartość | Użycie                                             |
| --------- | ------- | -------------------------------------------------- |
| `space.0` | 0       | brak odstępu                                       |
| `space.1` | 4px     | najdrobniejsze odstępy, np. między ikoną a tekstem |
| `space.2` | 8px     | odstęp między label a inputem                      |
| `space.3` | 12px    | odstęp poziomy w przyciskach                       |
| `space.4` | 16px    | padding kart, mniejsze odstępy pionowe             |
| `space.5` | 24px    | odstępy między blokami na mobile                   |
| `space.6` | 32px    | odstępy między sekcjami na desktop                 |
| `space.7` | 40px    | większe sekcje, hero                               |
| `space.8` | 48px    | większe marginesy, podział layoutu                 |
| `space.9` | 64px    | duże odstępy, np. między głównymi sekcjami         |

---

## 5. Tokeny promienia, cieni i czasu (radius, shadow, motion)

### 5.1. Promienie

| Token         | Wartość | Użycie                    |
| ------------- | ------- | ------------------------- |
| `radius.none` | 0       | np. tabele                |
| `radius.sm`   | 4px     | inputy, mniejsze elementy |
| `radius.md`   | 8px     | karty, modale             |
| `radius.full` | 9999px  | awatary, pill buttony     |

### 5.2. Cienie

| Token         | Wartość (opisowo)                 | Użycie           |
| ------------- | --------------------------------- | ---------------- |
| `shadow.none` | brak                              | elementy płaskie |
| `shadow.sm`   | delikatny cień blisko elementu    | przyciski, karty |
| `shadow.lg`   | mocniejszy cień dla podniesionych | modale, popovery |

### 5.3. Motion / animacje

| Token                    | Wartość                      | Użycie                    |
| ------------------------ | ---------------------------- | ------------------------- |
| `motion.duration.fast`   | 150ms                        | hover, focus              |
| `motion.duration.normal` | 250ms                        | otwieranie menu, dropdown |
| `motion.duration.slow`   | 400ms                        | większe przejścia, modale |
| `motion.easing.standard` | cubic-bezier(0.4, 0, 0.2, 1) | standardowy easing        |

---

## 6. Jak wprowadzić tokens do zespołu

Kilka praktycznych zasad:

1. **Zakaz nowych hexów i px-ów w komponentach** – wszystko musi przechodzić przez tokeny.
2. Jeśli potrzebujesz nowej wartości (np. `space.2_5`) – najpierw decyzja o **dodaniu nowego tokena** do tabeli, dopiero potem użycie.
3. W dokumentacji komponentów zamiast:

   > margin-bottom: 16px

   pisz:

   > margin-bottom: `space.4`.

4. Raz na jakiś czas (np. raz na kwartał) przejrzyj, czy tokeny nie zaczynają się **rozmnażać bez kontroli**.

---

## 7. Checklist – czy Twój system tokenów jest gotowy

1. Czy kolory, typografia, spacing, radius i cienie są opisane jako **tokeny**, a nie rozproszone wartości?
2. Czy nazewnictwo jest **spójne** (kropki, przedrostki, brak polskich znaków w tokenach)?
3. Czy komponenty w dokumentacji odwołują się do **tokenów, a nie bezpośrednio do wartości**?
4. Czy zespół dev i design rozumie, jak i po co korzystać z tokenów?
5. Czy masz plan na **dark mode / inne brandy** oparty na tych samych tokenach semantycznych?

Jeżeli tak – masz solidny fundament, na którym możesz spokojnie budować resztę design systemu.
