---
title: Wycena – kalkulator stawek i etapów projektu
slug: wycena-kalkulator
path: /proces/wycena-kalkulator/
type: calculator
tags:
  - evergreen
  - proces
  - wycena
draft: true
date: '2025-11-05'
---

# Wycena – kalkulator stawek i etapów projektu

Dobra wycena to nie „na oko” i porównanie z konkurencją, tylko policzona stawka, która:

- pokrywa **koszty**,
- zapewnia **sensowny zysk**,
- uwzględnia **czas, którego nie fakturujesz** (sprzedaż, administracja, R&D).

Ten tekst pokaże Ci, jak zbudować prosty **arkusz-kalkulator** do wyceny projektów.

Opiera się na podejściu: **zacznij od celu finansowego i realnych godzin pracy, a potem z tego wyprowadź stawkę i wyceny etapów**. :contentReference[oaicite:6]{index=6}

---

## 1. Część 1 – policzenie minimalnej stawki godzinowej

### 1.1. Dane wejściowe (sekcja INPUT)

W arkuszu zrób sekcję „INPUT”, gdzie wpisujesz:

- **Cel dochodu netto rocznie** – ile chcesz zarobić „na rękę”.
- **Koszty roczne**:
  - ZUS / podatki,
  - sprzęt, software, narzędzia (Adobe, Figma, hosting itd.),
  - biuro / coworking,
  - marketing, szkolenia.
- **Liczba tygodni pracy w roku** (np. 44 – reszta to urlop, święta, choroby).
- **Godziny pracy tygodniowo** (np. 30–35, nie 60).
- **Procent czasu, który faktycznie jest fakturowany**:
  - reszta to prospecting, maile, rozwój itd. (często realnie 50–60%).

### 1.2. Obliczenia

Przykładowe pola (przyjmijmy składnię Excela/Sheets):

1. `dochód_brutto_rok = cel_dochodu_netto + koszty_roczne`
2. `liczba_godzin_roboczych = tygodnie_pracy * godziny_tygodniowo`
3. `godziny_fakturowane = liczba_godzin_roboczych * procent_fakturowany`
4. `stawka_min = dochód_brutto_rok / godziny_fakturowane`

Dodaj sobie jeszcze mnożnik na **bufor / zysk** (np. 1,2) i otrzymasz **stawka_docelowa**.

---

## 2. Część 2 – siatka stawek vs seniority / typ pracy

Jeżeli jesteś agencją lub masz różne typy zadań, możesz dodać:

| Typ pracy              | Stawka bazowa (z kalkulatora) | Mnożnik | Stawka końcowa |
| ---------------------- | ----------------------------: | ------: | -------------: |
| Strategia / konsulting |                        200 zł |     1,4 |         280 zł |
| UX / product           |                        200 zł |     1,3 |         260 zł |
| UI / design            |                        200 zł |     1,2 |         240 zł |
| Dev                    |                        200 zł |     1,1 |         220 zł |
| Junior / asysta        |                        200 zł |     0,7 |         140 zł |

To pozwala wyceniać etapy bardziej realistycznie: discovery robi senior, rollout elementów – ktoś tańszy.

---

## 3. Część 3 – kalkulator etapów projektu

Drugi arkusz (lub sekcja) to lista etapów i zadań.

### 3.1. Struktura tabeli

| Etap / zadanie                   | Typ pracy | Osoba / rola | Szac. godziny | Stawka [z tabeli] |    Koszt | Bufor (%) | Koszt z buforem |
| -------------------------------- | --------- | ------------ | ------------- | ----------------- | -------: | --------: | --------------: |
| Warsztat kickoff                 | Strategia | Senior       | 6             | 280 zł            | 1 680 zł |       20% |        2 016 zł |
| Przygotowanie briefu / discovery | Strategia | Mid          | 8             | 260 zł            | 2 080 zł |       15% |        2 392 zł |
| Sitemap + user flow              | UX        | Mid          | 8             | 260 zł            | 2 080 zł |       15% |        2 392 zł |
| Makiety kluczowych widoków       | UX        | Mid          | 20            | 260 zł            | 5 200 zł |       10% |        5 720 zł |
| UI (system + layouty)            | UI        | Mid          | 22            | 240 zł            | 5 280 zł |       10% |        5 808 zł |
| Frontend + CMS                   | Dev       | Mid/Senior   | 40            | 220 zł            | 8 800 zł |       15% |       10 120 zł |
| QA + poprawki                    | Mix       | zespół       | 16            | średnia ~230 zł   | 3 680 zł |       15% |        4 232 zł |

Na koniec sumujesz **koszt z buforem** i decydujesz, czy:

- oferujesz klientowi **fixed price** na całość,
- dzielisz na **etapy rozliczeniowe**,
- albo używasz tego jako **estimate** w rozliczeniu T&M.

---

## 4. Część 4 – warianty ofertowe

Ten sam kalkulator możesz wykorzystać do zbudowania **dwóch–trzech wariantów**:

- **Lite** – mniej zakresu (np. prostszy design, mniej szablonów),
- **Standard** – to, co policzyłeś powyżej,
- **Plus** – dodatkowe rzeczy (np. extra iteracje, więcej layoutów, support po wdrożeniu).

W arkuszu dodaj kolumnę „Wariant”, żeby szybko włączać/wyłączać zadania w danym pakiecie.

---

## 5. Część 5 – kalibracja z rynkiem

Żaden kalkulator nie żyje w próżni.

Po pierwszych 3–5 projektach:

- porównaj **założone godziny** z faktycznie przepracowanymi,
- sprawdź, czy **stawka docelowa** faktycznie pokrywa koszty i cele,
- zweryfikuj, czy Twoje ceny mieszczą się w **realnych widełkach rynkowych** (np. przez porównanie z ogólnymi raportami / doświadczeniem innych).

Jeśli wszystkie projekty „przepalasz czasem” – zwiększ:

- stawkę,
- albo bufor na zadania, przy których najczęściej się przeliczasz.

---

## 6. Jak to wdrożyć u siebie w 1 dzień

1. W godzinę zrób sekcję **INPUT** i policz swoją minimalną stawkę.
2. W 2–3 godziny rozpisz **najczęstszy typ projektu** na zadania i oszacuj godziny.
3. W kolejnej godzinie dodaj bufor + wariant „Lite / Standard / Plus”.
4. Przy następnym zapytaniu nie zaczynasz wyceny od zera – tylko **dopasowujesz** gotowy szablon.

Taki arkusz to najlepszy przyjaciel, kiedy trzeba odpowiedzieć na maile w stylu „a za ile zrobimy taką stronę jak X?” – zamiast strzelać z głowy, masz **twarde liczby**.
