---
title: "Typografia PL w design systemie: fonty z ogonkami i ligatury"
slug: "typografia-pl"
path: "/design-system/typografia-pl/"
type: "guide"
tags: ["evergreen", "design-system", "typografia"]
draft: true
date: "2025-11-05"
---

# Typografia PL w design systemie: fonty z ogonkami i ligatury

Jeśli projektujesz po polsku, typografia to nie tylko „ładny font z Google”.  
Chodzi o to, żeby:

- **ą, ę, ł, ś, ż, ź, ć, ń** wyglądały tak samo dopracowanie jak A, E, L,
- tekst dało się czytać godzinami bez zmęczenia,
- system był spójny między webem, mobile i PDF-ami.

Poniżej dostajesz przewodnik, który możesz włożyć prosto do dokumentacji design systemu.

---

## 1. Wymagania dla fontów z polskimi znakami

### 1.1. Zakres znaków: Latin Extended

Minimalne wymaganie techniczne: font musi wspierać **Latin Extended-A**, w praktyce wszystkie polskie znaki:

> ą ć ę ł ń ó ś ż ź + ich wersje wielkie

W dokumentacji systemu warto wprost zapisać:

> „Wszystkie fonty w systemie muszą wspierać pełny zestaw polskich znaków (Latin Extended-A).”

To filtruje przypadkowe „ładne fonty”, które mają tylko podstawowy ASCII.

### 1.2. Jakość diakrytyków (ogonki, kreski, kropki)

Sama obecność ogonków nie wystarczy – muszą być **dobrze narysowane**:

- ogonek w `ą, ę, Ą, Ę` powinien wychodzić z **kształtu litery**, a nie wyglądać jak doczepiony przecinek,
- acute w `ś, ć, ź, ń` ma być dopasowany stylem do reszty (kontrast, grubość, długość),
- kropka nad `ż` nie może być przypadkowo większa/mniejsza niż nad `i`.

Przy wyborze fontu zrób prosty test – w swoim narzędziu do projektowania wrzuć linijkę:

> „Zażółć gęślą jaźń. ĄĘÓŁŚŹĆŃ 1234567890”

Jeśli polskie znaki „odstają” stylem od reszty (inny kąt kreski, inne położenie ogonka, za duża kropka) – lepiej szukać dalej.

---

## 2. Jak wybierać fonty dla polskich interfejsów

### 2.1. Priorytet: czytelność, nie „charakter”

W panelach, formularzach i tabelach ważniejsze od „klimatu” fontu jest to, jak pracuje w **10–14 px / rem** i na gorszych ekranach.  
Dlatego w systemie typografii sensownie jest rozdzielić:

- **Font UI** – sans-serif, neutralny, świetny w małych rozmiarach: nawigacja, formularze, tabelki, komponenty.
- **Font brandowy / display** – może być bardziej charakterystyczny, używany w hero, nagłówkach, kampaniach.

Dzięki temu możesz zmienić „branding” (font display), nie rozwalając całych interfejsów.

### 2.2. Parametry, na które warto patrzeć

Przy wyborze rodziny:

- **wysokość x** – im wyższa, tym lepiej w małych rozmiarach,
- **kontrast** – niskokontrastowe groteski czytają się lepiej na ekranie niż fonty o dużym kontraście szeryfowym,
- **różnicowanie glifów** – `l` (el), `1` (jeden), `I` (I) powinny być wyraźnie inne; podobnie `O` – `0`,
- **waga rodziny** – im więcej wag (300–700) i optycznie dopracowany italic, tym łatwiej zbudujesz przejrzystą hierarchię.

---

## 3. Ustawienia typograficzne w CSS / tokenach

W design systemie nie zapisuj „czystych” wartości tylko w kodzie.  
Przekształć je w **tokeny typograficzne** (nazwy + wartości):

Przykładowa skala:

- `font.size.xs` – 12px (metadane, labelki)
- `font.size.sm` – 14px (tekst w UI)
- `font.size.md` – 16px (body / artykuły)
- `font.size.lg` – 20px (nagłówki mniejsze)
- `font.size.xl` – 24px
- `font.size.2xl` – 32px

Plus:

- `line.height.tight` – 1.2 (nagłówki),
- `line.height.normal` – 1.5 (body),
- `line.height.relaxed` – 1.7 (długie teksty).

I zestawy:

- `font.body` – rodzina, rozmiar, interlinia, weight,
- `font.heading` – to samo dla nagłówków.

---

## 4. Ligatury w interfejsach

### 4.1. Jakie ligatury nas interesują

Są dwa główne typy:

1. **Ligatury typograficzne** (`fi`, `fl`, `ff`) – klasyczne, poprawiające wygląd tekstu.
2. **Ligatury programistyczne** (`=>`, `===`, `!=` zamieniane na specjalne „znaki”) – używane raczej w fontach do programowania.

W polskich interfejsach w zwykłym tekście zazwyczaj wystarczą **common ligatures**.

### 4.2. Kiedy ligatury pomóc, a kiedy przeszkadzają

Dobre praktyki:

- dla **body textu i dłuższych artykułów** – można zostawić common ligatures (tekst jest płynniejszy),
- w **interfejsie (UI)** – można je wyłączyć, jeśli powodują „dziwne” zlepianie w małych rozmiarach,
- w **kodzie / snippetach** – zazwyczaj wyłączone, chyba że świadomie stosujesz font z ligaturami programistycznymi.

W CSS:

````css
body {
  font-variant-ligatures: common-ligatures;
}

.code, pre, code {
  font-variant-ligatures: none;
}
W dokumentacji systemu zapisz jasno, jaka jest domyślna polityka ligatur w UI.

5. Typografia PL w komponentach
5.1. Tytuły, śródtytuły, meta
Dobrze działa prosty schemat:

Heading 1 – 28–32 px, bold, line-height: 1.2,

Heading 2 – 22–24 px,

Heading 3 – 18–20 px,

Body – 14–16 px, regular,

Caption / meta – 12–13 px, regular lub medium.

Do tego:

max-width dla długich tekstów: 60–70 znaków na linię,

większe interlinie (1.6–1.7) przy artykułach.

5.2. Uppercase i tracking
Nagłówki pisane WIELKIMI LITERAMI w polskim są trudniejsze w czytaniu niż w angielskim (więcej ogonków, mniej „rytmicznego” kształtu słów).

Jeśli już używasz uppercase:

ogranicz go do krótkich labeli (NOWOŚĆ, BETA),

dodaj tracking (letter-spacing) +0.05–0.08em,

nie stosuj uppercase w dłuższych CTA („POBIERZ BEZPŁATNY EBOOK”) – szybko męczy oko.

6. Checklist do wyboru fontu dla PL design systemu
Czy font ma pełny zestaw polskich znaków i nie wygląda to jak doklejone ogonki?

Czy w małych rozmiarach (10–14 px) litery są czytelne na gorszym ekranie?

Czy mamy osobne style dla UI i nagłówków / brandu?

Czy zdefiniowaliśmy skalę typografii (tokeny) – zamiast „gołych” px/rem?

Czy wiemy, jakie ligatury włączamy / wyłączamy i gdzie?

Czy mamy maksymalną szerokość kolumny i interlinię dla długich tekstów?

Jeżeli na te pytania możesz odpowiedzieć „tak, jest to opisane w naszym design systemie” – typografia PL jest w dobrym miejscu.

yaml
Copy code

---

```markdown
<!-- /design-system/siatka-i-spacing/index.md -->
---
title: "Siatka i spacing: 8-pt grid i skala odstępów w design systemie"
slug: "siatka-i-spacing"
path: "/design-system/siatka-i-spacing/"
type: "guide"
tags: ["evergreen", "design-system", "spacing"]
draft: true
date: "2025-11-05"
---

# Siatka i spacing: 8-pt grid i skala odstępów w design systemie

Największy upgrade wizualny, jaki możesz zrobić w produkcie, to nie „nowy gradient”, tylko **porządek w odstępach**.
8-pt grid i spójna skala spacingu sprawiają, że:

- interfejs „się trzyma” – nieważne, kto robi ekran,
- programiści nie pytają ciągle „tu 13 czy 14 px?”,
- łatwiej skalować UI między web, mobile i desktop.

---

## 1. O co chodzi w 8-pt gridzie

8-pt grid to zasada, że **większość odległości i rozmiarów** w UI to wielokrotności 8 (czasem 4).:contentReference[oaicite:0]{index=0}

Czyli:

- wysokości i szerokości elementów,
- marginesy i paddingi,
- odstępy między komponentami.

Dlaczego 8?

- dobrze skaluje się w górę i w dół (8, 16, 24, 32, 40, 48, 56, 64…),
- jest naturalnym kompromisem między „zbyt gęsto” (4) a „za grubo” (10),
- da się go wykorzystać na web, Androidzie (dp) i iOS bez kombinowania.

---

## 2. Skala spacingu jako tokeny

Zamiast wpisywać odległości “na oko” w px/rem, definiujesz **skalę spacingu**:

Przykład:

- `space.0` – 0
- `space.1` – 4px
- `space.2` – 8px
- `space.3` – 12px
- `space.4` – 16px
- `space.5` – 24px
- `space.6` – 32px
- `space.7` – 40px
- `space.8` – 48px
- `space.9` – 64px

Dwa triki:

1. **W środku skali** możesz mieć kroki co 4 px (4, 8, 12, 16, 20, 24…),
   ale wszystko i tak „wpina się” w 8-pt grid.

2. Dla **wewnętrznego paddingu** używaj mniejszych kroków (4, 8, 12, 16),
   dla **odstępów między sekcjami** – większych (24, 32, 40, 48).

W dokumentacji wypisz:

- tabelę wartości,
- przykłady użycia (`space.2` = odstęp między label a polem formularza itd.).

---

## 3. Jak używać siatki w praktyce

### 3.1. Inside → out

Najprostsza zasada:

1. Najpierw ustaw **padding wewnątrz komponentów** jako wielokrotność skali.
2. Potem układaj komponenty na layoutcie, trzymając między nimi tę samą skalę.

Przykład – przycisk:

- wysokość: 40px (`space.5` ~ 24px + tekst),
- padding poziomy: `space.3` (12px),
- odstęp między przyciskami: `space.3` lub `space.4`.

Przykład – karta:

- padding wewnętrzny: `space.4` (16px),
- odstęp między kartami w gridzie: `space.5` (24px).

### 3.2. Stałe wartości dla typów elementów

W design systemie możesz zapisać:

- „**Minimalny odstęp pionowy** między sekcjami na stronie: `space.6` (32px)”
- „Standardowy **padding kontenera**: `space.5` (24px) na mobile, `space.6` (32px) na desktop”
- „**Kolumny** w layoucie mają gutter `space.5` (24px)”

Dzięki temu ktoś nowy w projekcie nie wymyśla od zera – ma konkretne „szyny”, po których ma się poruszać.

---

## 4. Siatka na poziomie layoutu

### 4.1. Kolumny

Typowe układy:

- 12 kolumn na desktopie,
- 6–8 na tablet,
- 4 na mobile (często ukryte w narzędziu, ale trzymasz logikę).

Kolumny pomagają „dokować” większe elementy: karty, sekcje, obrazy.
8-pt grid rozwiązuje **szczegóły** – marginesy, paddingi, wysokości komponentów.

### 4.2. Baseline grid (tekst)

Dla produktów z dużą ilością tekstu (blog, dokumentacja) możesz dodatkowo:

- ustawić baseline grid (np. co 4 px),
- dopasować line-height tak, żeby linie tekstu „siadały” na baseline.

To wyższa szkoła jazdy, ale mocno zwiększa wrażenie „porządku” w długich tekstach.

---

## 5. Przykładowe reguły do dokumentacji

Możesz dosłownie wkleić coś takiego do wiki design systemu:

1. **Podstawowa jednostka spacingu**: 8 px (z pół-krokami 4 px).
2. **Wszystkie marginesy i paddingi** zaokrąglamy do najbliższej wartości skali (`space.1`–`space.9`).
3. **Wysokości komponentów** (przyciski, pola, inputy) są wielokrotnością 8 px.
4. **Odstępy między sekcjami** na stronie:
   - minimalnie `space.6` (32px),
   - na landing page’ach częściej `space.7` (40px) lub `space.8` (48px).
5. **Wejście nowego komponentu** do systemu zawsze wymaga wskazania:
   - jakich tokenów spacingu używa wewnątrz,
   - jakiego odstępu wymaga od innych komponentów.

---

## 6. Checklist „czy spacing jest ogarnięty”

1. Czy możesz jednym zdaniem powiedzieć, jaka jest **podstawowa jednostka** spacingu w produkcie?
2. Czy istnieje **tabela tokenów** spacingu i czy faktycznie jest używana?
3. Czy przyciski, pola i karty mają **powtarzalne** wysokości i paddingi?
4. Czy ktoś nowy w projekcie jest w stanie zaprojektować nowy ekran i **trafić w rytm** bez mierzenia każdego odstępu?
5. Czy devowie znają ten system i nie proszą o „pixel perfect” specy do każdego ekranu?

Jeśli większość odpowiedzi to „tak” – 8-pt grid żyje, a nie jest tylko hasłem w prezentacji.
````
