---
title: "Above-the-fold – co ładować krytycznie, a co opóźnić"
slug: "above-the-fold"
path: "/wydajnosc/above-the-fold/"
type: "checklist"
tags: ["evergreen", "wydajnosc", "core-web-vitals"]
draft: true
date: "2025-11-05"
---

# Above-the-fold: checklist dla pierwszego ekranu

„Above-the-fold” = **pierwszy ekran**, który użytkownik widzi bez scrollowania. To właśnie w tym obszarze rozgrywa się walka o:

- LCP – największy element widoczny na starcie,:contentReference[oaicite:34]{index=34}  
- wrażenie „strona jest albo szybka, albo zamulona”.

Ta checklista zakłada, że chcesz:

- **zmaksymalizować szansę na LCP ≤ 2,5 s** na mobile,
- nie robić przy tym dziwnych hacków, które psują resztę UX.

## 1. HTML i serwer

- [ ] Strona serwowana przez HTTPS, bez zbędnych przekierowań łańcuchowych  
- [ ] TTFB celowany w ≤ 200 ms na typowych użytkowników (po optymalizacji backendu / cache).:contentReference[oaicite:35]{index=35}  
- [ ] HTML nie jest „śmietnikiem” – sensowny rozmiar (np. do ~30–40 kB na landing), bez masy nieużywanych fragmentów.

## 2. CSS krytyczny

- [ ] CSS potrzebny do wyrenderowania pierwszego ekranu:
  - jest możliwie krótki (wydzielony „critical CSS”),
  - ładuje się jak najwcześniej (np. w `<head>`),
- [ ] reszta CSS ładowana **asynchronicznie** (np. osobne pliki dla późniejszych sekcji),
- [ ] brak blokującego CSS, który dotyczy tylko elementów **poniżej** pierwszego ekranu.:contentReference[oaicite:36]{index=36}  

Prosta zasada: pierwsze wrażenie powinno być zrobione **jednym małym pakietem CSS**, a nie kompletnym frameworkiem na całą aplikację.

## 3. Obrazy i media

- [ ] Najważniejszy obraz (kandydat na LCP) ma:
  - dopasowany rozmiar (bez 4K, jeśli widać 1100 px),
  - sensowną kompresję,
  - ustawione wymiary / proporcje (width/height).:contentReference[oaicite:37]{index=37}  
- [ ] Wszystkie obrazy **poniżej** pierwszego ekranu mają lazy-loading.
- [ ] Brak tła wideo, które ładuje się przed statyczną wersją hero.
- [ ] Brak karuzeli ze zbyt wieloma obrazami już na starcie (lepiej 1–2 slajdy niż 6+).

## 4. Fonty

- [ ] W pierwszym ekranie używasz maksymalnie 1–2 rodzin fontów i 1–2 wag.
- [ ] Krytyczne fonty są:
  - w nowoczesnym formacie (np. WOFF2),
  - ewentualnie preloadowane,
  - z `font-display: swap` lub `optional`, żeby tekst pojawił się szybko.:contentReference[oaicite:38]{index=38}  

## 5. JavaScript

- [ ] W pierwszym ekranie JS robi tylko absolutne minimum:
  - prosty UI, który musi zadziałać natychmiast (np. menu, proste formularze),
  - brak ciężkich animacji na starcie.
- [ ] Skrypty, które nie są krytyczne dla pierwszego ekranu, mają `async` / `defer`.
- [ ] Nadmiarowy JS (np. dla sekcji daleko poniżej folda) ładuje się:
  - po `load`,
  - albo dopiero po konkretnej interakcji.:contentReference[oaicite:39]{index=39}  

Im mniej JS w krytycznej ścieżce, tym lepsze INP i mniejsze ryzyko „zawieszenia” interfejsu w pierwszych sekundach.

## 6. Skrypty zewnętrzne

- [ ] Żaden skrypt zewnętrzny, który nie jest absolutnie konieczny, **nie blokuje** ładowania HTML/CSS potrzebnego do widocznego hero.:contentReference[oaicite:40]{index=40}  
- [ ] Widgety typu chat, rekomendacje, „social proof” itd. nie ładują się w całości na starcie, tylko:
  - lazy po scrollu,
  - lub dopiero po kliknięciu ikony.
- [ ] Jeśli musisz mieć skrypty zewnętrzne, każdy z nich ma **właściciela** po stronie biznesu i business case, dlaczego jest w pierwszym ekranie.

## 7. Layout i CLS

- [ ] Każdy element above-the-fold ma:
  - zarezerwowaną przestrzeń,
  - przewidywalną wysokość,
- [ ] bannery / paski zgód na cookies / pop-upy:
  - nie „wpychają się” dynamicznie na górę bez zaplanowanego miejsca,
  - nie zasłaniają nagłówka w sposób, który pcha cały layout w dół,
- [ ] brak „lazy wstrzykiwanych” elementów bez zachowania miejsca (np. dynamiczne rekomendacje między paragrafami).:contentReference[oaicite:41]{index=41}  

---

Jeśli większość pól w tej checkliście masz na zielono, to:

- pierwsze wrażenie będzie szybkie,
- LCP ma realne szanse mieścić się w zielonej strefie,
- a kolejne optymalizacje będą już pracą „na marginesie”, a nie ratowaniem strony w panice.

