---
title: "Plan pomiaru (measurement plan)"
slug: "plan-pomiaru"
path: "/analityka/plan-pomiaru/"
type: "template"
tags: ["evergreen", "analityka"]
draft: true
date: "2025-11-05"
---

# Plan pomiaru (measurement plan)

Plan pomiaru to brakujące ogniwo między:

- „chcemy poprawić sprzedaż / retencję / leady”  
  a
- „dodajmy 15 eventów do GA4 i zobaczymy co wyjdzie”.

Ten template możesz potraktować jako **gotowy szkielet dokumentu w Notion / GDoc / Excelu**, który spina biznes, produkt, marketing i devów.

---

## Jak używać tego szablonu

1. Skopiuj układ sekcji poniżej do ulubionego narzędzia.
2. Wypełnij **po kolei**, nie przeskakując od razu do eventów.
3. Dopiero na końcu wylistuj implementację (narzędzia, eventy, UTMy).

---

## 1. Kontekst i cele biznesowe

**Pytanie: co chcemy zmienić w biznesie w najbliższych 3–12 miesiącach?**

Przykładowa tabela:

| Cel biznesowy                     | Opis / komentarz                  | Priorytet (H/M/L) | Horyzont czasowy |
| --------------------------------- | --------------------------------- | ----------------- | ---------------- |
| Zwiększyć liczbę projektów / msc  | usługi B2B, min. 20k zł projekt   | H                 | 6 mies.          |
| Podnieść MRR o 30%                | SaaS, nowe płatne konta + upselle | H                 | 12 mies.         |
| Zwiększyć przychód z kursów o 50% | mix launchy + evergreen           | M                 | 12 mies.         |

Nie ruszaj dalej, dopóki nie masz **2–4 konkretnych celów**.

---

## 2. Pytania biznesowe, na które ma odpowiadać analityka

Zamiast „chcemy mieć dane”, wpisz konkretne pytania typu:

- „Które kanały pozyskują leady, które faktycznie domykamy?”
- „Co odróżnia użytkowników, którzy aktywują się w 7 dni od tych, którzy nie wracają?”
- „Które kampanie kursu mają najwyższą konwersję z listy na zakup?”

Tabela:

| Pytanie biznesowe                                                | Cel biznesowy, którego dotyczy | Priorytet |
| ---------------------------------------------------------------- | ------------------------------ | --------- |
| Które źródła dają leady z najwyższą wartością dealu?             | projekty / MRR                 | H         |
| Po ilu dniach nowi użytkownicy SaaS zwykle „odklejają się”?      | MRR / churn                    | H         |
| Które maile w sekwencji sprzedażowej kursu faktycznie sprzedają? | przychód z kursów              | M         |

---

## 3. KPI i metryki

Teraz dopiero spinasz cele i pytania z KPI.  
Warto od razu wskazać **właściciela** i częstotliwość raportowania.

| KPI / metryka                    | Typ (KPI / pomocnicza) | Związany cel | Właściciel | Częstotliwość | Źródło danych            |
| -------------------------------- | ---------------------- | ------------ | ---------- | ------------- | ------------------------ |
| kwalifikowane leady / miesiąc    | KPI                    | projekty     | Growth     | tyg./mies.    | CRM + eventy `lead_*`    |
| trial → płatny (konwersja)       | KPI                    | MRR          | Product    | tyg.          | produkt, billing         |
| czas do aktywacji (mediana, dni) | pomocnicza             | MRR          | Product    | mies.         | eventy `activation_*`    |
| konwersja listy na zakup kursu   | KPI                    | kursy        | Marketing  | kampania      | system płatności + email |

---

## 4. Zdarzenia, parametry i taksonomia

Tu podłączasz **słownik eventów** (z osobnej strony) do konkretnych pytań i KPI.

| Event / dane            | Po co to mierzymy (pytanie / KPI)                  | Parametry kluczowe                      | Dodatkowe segmenty              |
| ----------------------- | -------------------------------------------------- | --------------------------------------- | ------------------------------- |
| `form_submit` (kontakt) | Skąd przychodzą leady?                             | `form_id`, `source`, `medium`           | `campaign`, `landing_page`      |
| `lead_created`          | Jaką wartość reprezentują leady z różnych kanałów? | `deal_value`, `lead_type`               | `industry`, `company_size`      |
| `signup_complete`       | Które kanały dają najwięcej rejestracji?           | `plan`, `source`                        | `utm_campaign`, `device`        |
| `activation_event`      | Ile osób się aktywuje i jak szybko?                | `activation_type`, `time_to_activation` | `plan`, `cohort_signup_month`   |
| `checkout_complete`     | Jaka jest konwersja na zakup kursu wg kampanii?    | `order_value`, `product_type`           | `utm_campaign`, `discount_used` |

To jest miejsce, gdzie decydujesz o **parametrach obowiązkowych vs. „nice to have”**.  
Jeśli każdy event ma 15 parametrów, nikt nie będzie ich poprawnie wdrażał.

---

## 5. Segmenty i wymiary

Bez segmentów będziesz widzieć średnie, które nic nie mówią.

Przykładowa lista segmentów, które warto mieć:

- **Kanał / medium** – organic, paid, email, direct, affiliate,
- **Nowy vs powracający użytkownik / klient**,
- **Plan / produkt** – plan Free / Pro / Enterprise, kurs A / B / bundle,
- **Urządzenie** – desktop / mobile,
- **Kraj / język** – jeśli działasz na kilku rynkach.

Tabela:

| Segment / wymiar | Definicja praktyczna                      | Wpływa na jakie KPI    |
| ---------------- | ----------------------------------------- | ---------------------- |
| channel_group    | grupowanie źródeł (paid, organic, email…) | wszystkie pozyskaniowe |
| user_type        | new / returning (def. 30 dni)             | aktywacja, retencja    |
| plan_type        | free / trial / paid (Pro/Business/…)      | MRR, aktywacja, churn  |

---

## 6. Raporty i dashboardy

Tutaj deklarujesz, **jakie widoki danych** mają powstać i do kogo trafią.

| Raport / dashboard                | Poziom (operacyjny / strategiczny) | Odbiorcy               | Częstotliwość | Najważniejsze pytania                    |
| --------------------------------- | ---------------------------------- | ---------------------- | ------------- | ---------------------------------------- |
| Tygodniowy performance marketingu | operacyjny                         | Growth, Founder        | tyg.          | co działa, co wyłączyć / doinwestować    |
| Miesięczny raport produktu        | operacyjny / strategiczny          | Product, Tech, Founder | mies.         | aktywacja, retencja, kierunki rozwoju    |
| Kwartalne KPI biznesu             | strategiczny                       | Zarząd, właściciele    | kw.           | czy dowozimy cele MRR / projekty / kursy |

---

## 7. Implementacja techniczna (narzędzia, odpowiedzialność)

Na końcu – **dopiero tutaj** – zapisujesz:

- jakie narzędzia biorą udział (GA4, produktowe eventy, CRM, data warehouse),
- kto odpowiada za które fragmenty (dev, analityk, marketer),
- jak wygląda proces wdrażania i testowania eventów.

Tabela:

| Obszar         | Narzędzie / stack       | Właściciel     | Notatki                           |
| -------------- | ----------------------- | -------------- | --------------------------------- |
| WWW            | GA4 + eventy przez GTM  | Analityk + Dev | implementacja wg słownika zdarzeń |
| Produkt (SaaS) | Eventy aplikacyjne → DB | Tech Lead      | eksport do BI raz dziennie        |
| Marketing      | UTM + CRM / MA          | Marketing Ops  | obowiązkowy template UTM          |

Ten dokument powinien być na tyle prosty, żeby właściciel biznesu przeczytał go w 15 minut,  
i na tyle konkretny, żeby dev na jego podstawie od razu wiedział, jakie eventy ma wdrożyć.
