---
title: "Dashboards starter – układ panelu do sensownej analityki"
slug: "dashboards-starter"
path: "/analityka/dashboards-starter/"
type: "template"
tags: ["evergreen", "analityka", "dashboard"]
draft: true
date: "2025-11-05"
---

# Dashboards starter – układ panelu do sensownej analityki

Większość dashboardów wygląda jak choinka: 25 wykresów, zero decyzji.  
Ten szablon ma pomóc Ci zbudować **jeden panel startowy**, który:

- mieści się „na jednym ekranie”,
- odpowiada na kilka konkretnych pytań,
- działa dla usług, SaaS i kursów (z drobnymi różnicami).

---

## 1. Zasady dobrego dashboardu

1. **Pytania → potem wykresy**  
   Każda sekcja odpowiada na pytanie typu „Czy rośniemy?”, „Skąd przychodzą użytkownicy?”.

2. **1 dashboard = 1 odbiorca / kontekst**  
   Inny panel dla Foundera, inny dla performance marketera.

3. **Mniej, ale częściej używany**  
   Lepiej 8 dobrze opisanych kafelków niż 30 kolorowych wykresów.

4. **Opisane definicje**  
   Pod kluczowymi metrykami umieść mini opis: „Aktywacja = …”.

5. **Log zmian**  
   Gdzieś na dole – co zmieniło się w ostatnich 30 dniach (kampanie, testy).

---

## 2. Trzy warstwy dashboardu

Rekomendowany layout (od góry):

1. **Warstwa 1 – Zdrowie biznesu (4–6 metryk)**  
   – „Czy idziemy w dobrą stronę?”

2. **Warstwa 2 – Lejek (3–4 etapy)**  
   – „Gdzie uciekają ludzie?”

3. **Warstwa 3 – Kanały i segmenty**  
   – „Skąd przychodzą najlepsi użytkownicy / klienci?”

---

## 3. Warstwa 1: Zdrowie biznesu

Dopasuj metryki do modelu biznesowego.

### Usługi

- kwalifikowane leady (30 dni, vs poprzedni okres),
- liczba nowych projektów / podpisanych umów,
- pipeline (wartość szans sprzedażowych),
- średnia wartość projektu.

### SaaS

- MRR (aktualne + trend),
- nowy MRR vs churn MRR,
- triale / rejestracje (30 dni),
- aktywacja (np. % nowych, którzy osiągnęli `activation_event` w 7 dni).

### Kursy

- przychód z kursów (30 dni / kwartał),
- liczba sprzedanych produktów (wg typu),
- konwersja z listy na zakup (dla ostatniej kampanii),
- średnia wartość koszyka.

Każdą metrykę opisz krótkim tooltipem / notką:  
„Aktywacja = użytkownik utworzył min. 1 projekt i zaprosił 1 osobę”.

---

## 4. Warstwa 2: Lejek

Tu pokazujesz **jak użytkownik przechodzi przez najważniejszy proces**.

### Przykład – usługi

Etapy:

1. Sesje na stronach ofertowych,
2. Kliknięcia w CTA „Umów konsultację”,
3. Wysłane formularze,
4. Kwalifikowane leady,
5. Wygrane projekty.

Wykres: prosty lejek + trend konwersji między etapami.

### Przykład – SaaS

1. Wejścia na stronę pricing / signup,
2. Klik w „Zacznij darmowy okres”,
3. Ukończone rejestracje,
4. Użytkownicy aktywowani,
5. Płatne subskrypcje.

### Przykład – kursy

1. Wejścia na stronę sprzedażową,
2. Kliknięcia w „Kup teraz”,
3. Rozpoczęte check-outy,
4. Ukończone płatności.

Cel: w kilka sekund widzisz, w którym **kroku lejka** warto szukać problemów i planować eksperymenty.

---

## 5. Warstwa 3: Kanały i segmenty

Tu odpowiadasz na pytanie:

> „Skąd przychodzą ludzie, którzy faktycznie wykonują nasz cel?”

Minimum:

- tabela „Kanały”:

| Kanał        | Sesje | Konwersje (cel) | Konwersja % | Przychód / wartość | CAC / koszt (jeśli dotyczy) |
|--------------|-------|-----------------|-------------|--------------------|-----------------------------|
| organic      | …     | …               | …           | …                  | …                           |
| paid_search  | …     | …               | …           | …                  | …                           |
| paid_social  | …     | …               | …           | …                  | …                           |
| email        | …     | …               | …           | …                  | …                           |

- segmenty:
  - nowe vs powracające,
  - urządzenie (desktop vs mobile),
  - plan / produkt.

Dobrze działa prosty wybór filtra ↑ (np. „pokaż tylko SaaS PRO”, „pokaż tylko kampanię kursu X”).

---

## 6. Starter layout – do PDF / Notion

Możesz z tego zrobić szkic pod PDF / Notion / figmę:

**Rząd 1 – 4 kafelki KPI:**

- KPI1 (np. MRR / kwalifikowane leady / przychód z kursów),
- KPI2 (np. triale / leady / sprzedaże),
- KPI3 (np. aktywacja / konwersja na zakup),
- KPI4 (np. churn / zwroty).

**Rząd 2 – Lejek (1 szeroki moduł)**

- wykres słupkowy z etapami,
- pod spodem mini tabela z konwersją między etapami.

**Rząd 3 – Kanały (1 szeroka tabela)**

- jak w tabeli powyżej.

**Rząd 4 – Segmenty i notatki (2 kolumny)**

- lewa: wykres / tabela segmentów (np. nowe vs powracające),
- prawa: „Notatki z tego miesiąca” – miejsce na 3–5 bulletów.

---

## 7. Checklista „czy dashboard ma sens”

Przed wdrożeniem panelu zadaj sobie kilka pytań:

1. Czy **każdy element** dashboardu odpowiada na **konkretne pytanie**?
2. Czy wiesz, **jaką decyzję** możesz podjąć na podstawie danej sekcji?
3. Czy możesz wytłumaczyć każdą metrykę osobie spoza analityki w 2 zdaniach?
4. Czy liczba kafelków / wykresów jest na tyle mała, że ogarniesz je wzrokiem w 30 sekund?

Jeśli tak – masz dashboard, z którego da się korzystać, a nie tylko na niego patrzeć.
