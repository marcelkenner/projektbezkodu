---
title: Oferta i umowa – kosztorys, zakres, SLA (szablon PL)
slug: oferta-i-umowa
path: /proces/oferta-i-umowa/
type: template
tags:
  - evergreen
  - proces
  - oferta
  - umowa
draft: true
date: '2025-11-05'
---

# Oferta i umowa – kosztorys, zakres, SLA (szablon PL)

> Uwaga: to **nie jest porada prawna**.  
> Traktuj ten materiał jako szkielet do pracy z prawnikiem, a nie gotową umowę „ctrl+c / ctrl+v”.

Celem tego template’u jest uporządkowanie:

- **oferty / kosztorysu** (co robisz, za ile, w jakich etapach),
- **umowy / SOW** (jak to jest sformalizowane: prawa, obowiązki, odpowiedzialność),
- **SLA i supportu** (co się dzieje po wdrożeniu).

---

## 1. Struktura oferty (kosztorysu)

Oferta powinna być na tyle konkretna, by:

- klient wiedział, za co płaci,
- Ty nie musiał\_ ciągle „dopowiadać” zakresu.

### 1.1. Sekcje oferty

1. **Kontekst i cele**
   - 3–5 zdań: co chcesz zrealizować.
2. **Zakres prac (high-level)**
   - lista faz: discovery, UX, UI, development, QA, launch.
3. **Zakres prac (szczegółowo)**
   - co konkretnie dostarczasz w ramach każdej fazy.
4. **Założenia i ograniczenia**
   - co **musi być spełnione** po stronie klienta (treści, dostępy itd.).
5. **Harmonogram**
   - etapy + orientacyjne daty / liczba tygodni.
6. **Model rozliczeń**
   - fixed price / T&M / retainer; kamienie milowe płatności.
7. **Zakres poza ofertą**
   - lista rzeczy, które **nie są** w cenie (ważne!).
8. **Warianty**
   - np. pakiet podstawowy / rozszerzony.

### 1.2. Przykładowa tabela etapów i kosztów

| Etap               | Zakres skrócony                         | Szac. czas | Koszt netto |
| ------------------ | --------------------------------------- | ---------- | ----------: |
| Discovery & UX     | warsztat, sitemap, user flow, makiety   | 2 tyg.     |    8 000 zł |
| UI & design system | layouty, komponenty, design system      | 2 tyg.     |    9 000 zł |
| Development        | wdrożenie, integracje                   | 3 tyg.     |   14 000 zł |
| QA & launch        | testy, poprawki, wdrożenie na produkcję | 1–2 tyg.   |    6 000 zł |
| Razem              |                                         |            |   37 000 zł |

---

## 2. Szkielet umowy / SOW (po polsku)

Z prawnikiem możesz przejść przez poniższy szkielet i uzupełnić go pod swoją działalność.

### 2.1. Strony umowy

- dane Twojej firmy (NIP, REGON, KRS / CEIDG),
- dane klienta,
- osoby uprawnione do reprezentacji.

### 2.2. Przedmiot umowy

Krótki opis: co jest przedmiotem – np.:

> „Wykonawca zobowiązuje się do zaprojektowania i wdrożenia serwisu internetowego wraz z integracjami wskazanymi w załączniku nr 1…”

I odesłanie do:

- **Załącznik 1 – Zakres prac** (opis etapów + deliverables),
- **Załącznik 2 – Harmonogram i kamienie milowe**,
- **Załącznik 3 – Cennik i warunki płatności**.

### 2.3. Zakres i zmiany zakresu

- jak definiujecie **zakres** (np. przez załączniki),
- jak wyglądają **zmiany zakresu** (change requests):
  - kto je zgłasza,
  - jak wyceniacie,
  - jak wpływają na harmonogram.

Prosta reguła:

> „Zmiana zakresu wymaga pisemnej / mailowej akceptacji obu stron i może skutkować zmianą terminu oraz wynagrodzenia.”

---

### 2.4. Prawa autorskie i licencje

Tu koniecznie z prawnikiem, ale generalnie:

- co dokładnie przenosisz (layout, kod, komponenty, treści?),
- kiedy następuje przeniesienie (np. po zapłacie całości wynagrodzenia),
- na jakie pola eksploatacji (Internet, materiały drukowane itd.),
- co z osobnymi licencjami:
  - fonty,
  - zdjęcia stockowe,
  - pluginy, biblioteki.

Dobrze jest jasno napisać, że klient otrzymuje:

- pełne prawa do **unikalnych elementów** (layout, custom code),
- licencję na **komponenty third-party** w ramach warunków ich licencji.

---

### 2.5. Odpowiedzialność, gwarancja, reklamacje

- co obejmuje Twoja odpowiedzialność (np. poprawne działanie wg specyfikacji),
- przez jaki czas udzielasz **gwarancji** (np. 30 / 60 dni od odbioru),
- jak zgłasza się błędy,
- co jest błędem, a co zmianą zakresu.

Przykładowe rozróżnienie:

- **błąd** – coś działa inaczej niż w zaakceptowanych makietach / specyfikacji,
- **zmiana** – nowe zachowanie, którego wcześniej nie było w scope.

---

### 2.6. Płatności i opóźnienia

- terminy płatności (np. 7/14 dni),
- powiązanie z kamieniami milowymi (np. 30% zaliczki, 40% po UX/UI, 30% po wdrożeniu),
- co się dzieje przy opóźnieniach płatności (odsetki, wstrzymanie prac).

---

### 2.7. SLA i support (wysoki poziom)

Jeśli planujesz retainer / support po wdrożeniu, możesz go opisać w osobnym załączniku:

- zakres:
  - aktualizacje systemu / wtyczek,
  - drobne zmiany treści, bugfixy,
  - monitoring, backupy,
- SLA:
  - czas reakcji na zgłoszenia,
  - czas rozwiązania dla różnych typów błędów,
- limit godzin / zakresu w miesiącu,
- stawki za prace dodatkowe.

---

### 2.8. Poufność, dane osobowe, RODO

- klauzula poufności (co jest informacją poufną, jak długo obowiązuje),
- przetwarzanie danych osobowych (np. jeśli masz dostęp do danych użytkowników klienta),
- wzmianka o osobnej umowie powierzenia, jeśli jest potrzebna.

---

## 3. Jak użyć tego w praktyce

1. Stwórz **jedną ofertę-matkę** w Notion / GDoc, z powyższą strukturą.
2. Do każdego projektu robisz kopię i uzupełniasz:
   - kontekst,
   - zakres, harmonogram, ceny.
3. Z prawnikiem przygotowujesz **szablon umowy**, który:
   - ma załączniki spięte z ofertą,
   - ma miejsca na dopisanie specyficznych rzeczy dla danego klienta.
4. Każdą kolejną umowę wystawiasz dużo szybciej, bo 80% treści jest stałe.

Dzięki temu rozmowa z klientem nie jest już „pustym” negocjowaniem ceny, tylko przejściem po konkretnym **zakresie, odpowiedzialnościach i zasadach współpracy**.
