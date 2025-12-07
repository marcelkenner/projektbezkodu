---
title: Checklist mobilna – wydajność mobile-first
slug: checklist-mobilna
path: /artykuly/seo/wydajnosc/checklist-mobilna/
type: checklist
tags:
  - evergreen
  - wydajnosc
  - mobile
  - core-web-vitals
draft: true
date: '2025-11-05'
hero:
  heading: Checklist mobilna – wydajność mobile-first
  subheading: Wpis roboczy — uzupełnij krótki opis, żeby nagłówek nie był pusty.
---

# Mobile-first wydajność – checklista

Większość ruchu to dziś mobile, a Core Web Vitals są liczone osobno dla urządzeń mobilnych i desktopowych – i to mobilne wyniki zwykle bardziej bolą.:contentReference[oaicite:68]{index=68}

Ta checklista zbiera najważniejsze rzeczy, które warto sprawdzić, jeśli chcesz, żeby strona **naprawdę działała** na telefonie z przeciętnym łączem.

---

## 1. Sieć i „budżet danych”

- [ ] testujesz stronę na **symulowanym wolnym łączu** (np. 3G / słabsze LTE), nie tylko na światłowodzie,:contentReference[oaicite:69]{index=69}
- [ ] wiesz, ile **MB** pobiera pierwsza wizyta na stronie głównej na mobile,
- [ ] masz ustawiony **budżet wagowy** (max kB na JS, CSS, obrazy, fonty),
- [ ] TTFB dla mobilnych użytkowników mieści się w okolicach **≤ 200 ms** (tam, gdzie to realne technicznie).:contentReference[oaicite:70]{index=70}

---

## 2. Obrazy i media na mobile

- [ ] obrazy mają **warianty rozmiarów** dopasowane do małych ekranów (nie serwujesz 2000 px, gdy widać 360 px),:contentReference[oaicite:71]{index=71}
- [ ] wszystkie obrazy **poniżej folda** mają lazy-loading,
- [ ] nie masz wideo w tle uruchamianego automatycznie na mobile,
- [ ] galerie / karuzele nie ładują 20 obrazów, zanim użytkownik przesunie pierwszy ekran.

---

## 3. CSS i layout

- [ ] projekt naprawdę jest **mobile-first**, a nie „desktop + wszystko się zmieści”,
- [ ] layout ma sensowną hierarchię – bez przesadnych efektów, które wymagają wielu zmian layoutu,
- [ ] breakpoints są ustawione tak, żeby uniknąć „dziwnych” szerokości, gdzie komponenty się łamią i wymagają wielu poprawek,
- [ ] elementy mają **stabilne wymiary** – minimalizujesz CLS (wymiary obrazów, przewidywalne wysokie elementy, przemyślane sticky bary).:contentReference[oaicite:72]{index=72}

---

## 4. JavaScript na mobile

- [ ] całkowita ilość JS na pierwsze ładowanie jest **ograniczona** (masz na to budżet),
- [ ] JS jest **podzielony na mniejsze części**, a nie jeden monolit,
- [ ] ciężkie rzeczy (filtry, edytory, kreatory) ładują się dopiero, gdy użytkownik ich dotknie,:contentReference[oaicite:73]{index=73}
- [ ] unikasz długich tasków – dzielisz logikę tak, by nie blokować głównego wątku na dziesiątki ms,
- [ ] eventy „scroll” / „resize” są opakowane w debounce / throttle.

Badania pokazują, że wycinanie zbędnego JS w wersjach mobilnych stron daje ogromne skoki w realnej wydajności – szczególnie na słabszych telefonach.:contentReference[oaicite:74]{index=74}

---

## 5. Fonty na mobile

- [ ] liczba rodzin i wag fontów jest ograniczona (1–2 rodziny, 2–3 wagi),
- [ ] korzystasz z nowoczesnych formatów (np. WOFF2) i subsetów dla potrzebnych zakresów znaków,:contentReference[oaicite:75]{index=75}
- [ ] krytyczne fonty są preloadowane **tylko tam, gdzie faktycznie są potrzebne** w pierwszym ekranie,
- [ ] `font-display` jest ustawione tak, żeby użytkownik możliwie szybko widział tekst (np. `swap` / `optional`).

---

## 6. Interakcje i INP

- [ ] podstawowe interakcje (menu, scroll, klik w CTA) działają płynnie już **w pierwszych sekundach**,:contentReference[oaicite:76]{index=76}
- [ ] nie ma masy eventów nasłuchujących na wszystko naraz (scroll, mousemove, touchmove) bez kontroli,
- [ ] potencjalnie ciężkie interakcje (np. zaawansowane filtry, tłuste tabele) są zoptymalizowane:
  - część logiki na backendzie,
  - część w Web Workerach, gdy to ma sens,:contentReference[oaicite:77]{index=77}
- [ ] wiesz, które widoki i interakcje mają **najgorsze INP** – i to je atakujesz w pierwszej kolejności.

---

## 7. Testowanie na realnych urządzeniach

- [ ] testujesz na **realnym telefonie**, nie tylko w emulatorze,
- [ ] sprawdzasz zachowanie na:
  - starszym / tańszym urządzeniu,
  - słabszym łączu,
- [ ] mierzysz:
  - jak szybko widać sensowny kontent (LCP),
  - czy interfejs reaguje bez „lagów” (INP),
  - czy layout nie „skacze” przy ładowaniu (CLS).:contentReference[oaicite:78]{index=78}

---

Jeśli przejdziesz tę checklistę i na większość punktów odpowiesz „tak”, to:

- wyniki mobilnych Core Web Vitals prawie na pewno pójdą w górę,
- a strona przestanie być „prezentacją w PDF-ie wrzuconą do przeglądarki”, a stanie się czymś, co realnie da się wygodnie używać na telefonie.
