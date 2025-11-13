---
title: "Karty i listy – szablon dla treści, produktów i widoków listowych"
slug: "karty-i-listy"
path: "/design-system/karty-i-listy/"
type: "template"
tags: ["evergreen", "design-system", "cards", "lists", "template"]
draft: true
date: "2025-11-05"
---

# Karty i listy – szablon dla treści, produktów i widoków listowych

Karty i listy to podstawowe „klocki” dla bloga, sklepu, aplikacji SaaS czy panelu admina.  
Jeśli je dobrze opiszesz, zyskujesz:

- spójne widoki katalogów, bloga, dashboardów,
- łatwe skalowanie projektu na różne layouty,
- mniej „kreatywnej dowolności” przy każdym nowym module.

---

## 1. Karta – ogólny wzór

Typowa karta składa się z:

1. **Thumbnail / obrazek / ikona** (opcjonalnie),
2. **Tytuł**,
3. **Metadane** (kategoria, data, autor, tag, cena),
4. **Opis / lead** (krótki),
5. **Call to action** (przycisk lub link).

Przykładowy układ pionowy (karta blogowa):

```text
[  Thumbnail / obrazek  ]
Kategoria / Tag
Tytuł artykułu
Krótki opis / lead
Meta: data, autor
[ Czytaj dalej → ]
W dokumentacji zdefiniuj:

minimalną i maksymalną szerokość karty,

marginesy wewnętrzne (padding – tokeny spacingu),

odstępy między elementami (np. space.2 między meta a tytułem, space.3 między tytułem a opisem).

2. Karty bloga / treści
Dla bloga, case studies, artykułów:

obrazek: stała proporcja (np. 16:9), ucinany w ten sam sposób,

tytuł: max 2–3 linie, reszta ucinana z …,

lead: 2–3 linie; powyżej tego „czytaj więcej” i tak ma zadziałać.

Możesz zdefiniować dwa warianty kart:

Karta mała – na listy, sidebar:

bez opisu, tylko tytuł + meta,

Karta duża – w głównym gridzie:

tytuł + lead + meta + obrazek.

3. Karty produktów / ofert
Dla produktów, planów, ofert:

thumbnail może być zdjęciem, ikoną lub skrótem (np. plan „PRO”),

na karcie powinny się znaleźć:

nazwa produktu / planu,

cena albo „od …”,

3–5 bulletów z kluczowymi korzyściami,

CTA („Kup”, „Zobacz szczegóły”).

Ustal:

czy CTA jest przyciskiem, czy cała karta jest klikalna,

jakie są stany hover karty (zmiana tła, cienia, granicy),

jak karta zachowuje się na mobile (stackowanie elementów).

4. Listy z thumbnailami
Listy z miniaturkami to często używany układ w panelach i aplikacjach:

text
Copy code
[Thumb]  Tytuł elementu                      Meta / tagi
         Opis / dodatkowe informacje        Akcja (np. przycisk)
Dobrze działa:

stała wysokość miniatury (np. 40×40 lub 48×48),

stały odstęp między thumb a tekstem (space.3),

wyraźne wyrównanie: tytuły zaczynają się zawsze w tej samej kolumnie.

Możesz zdefiniować dwa tryby listy:

gęsty – mniejsze odstępy, dla paneli administracyjnych,

komfortowy – większe odstępy, dla końcowego użytkownika.

5. Stany kart i wierszy listy
Tak jak przy przyciskach, warto zdefiniować min. te stany:

default – normalny wygląd,

hover – tło lekko podbite, cień, zmiana obramowania,

selected – jeśli listek/karta może być zaznaczony,

focus-visible – wyraźny obrys dla klawiatury.

Przykład (karta):

Stan	Tło	Obramowanie	Cień
default	color.card.bg	color.card.border	shadow.card.default
hover	color.card.bg.hover	jak wyżej	shadow.card.hover
selected	color.card.bg.selected	color.card.border.selected	może być mocniejszy
focus-visible	jak selected lub default	color.focus.ring	jak wyżej

6. Paginy, infinite scroll, load more
Listy często są podzielone na strony lub ładowane lazy.

W design systemie opisz:

jaki komponent paginacji stosujesz (numery stron, „Previous/Next”, „Załaduj więcej”),

jak zachowuje się lista przy infinite scrollu (czy pokazujesz skeleton loader, spinner),

jakie są pusty stan (empty state) listy (ikona, tekst, CTA).

7. Checklist – karty i listy
Czy karty mają zdefiniowane stałe proporcje obrazków i odstępy wewnętrzne?

Czy warianty kart (mała/duża, produktowa/blogowa) są osobno opisane?

Czy listy z thumbnailami mają spójny layout (wysokość, odstępy, stany)?

Czy zdefiniowano stany hover, selected i focus dla kart/wierszy?

Czy istnieją komponenty empty state i loading dla list?

Dzięki temu widoki list i kart przestają być „ręczną rzeźbą”, a stają się powtarzalnym, łatwym do rozwijania wzorcem.
```
