---
title: >-
  Logowanie i monitoring: jak projektować system, który mówi Ci, że coś nie
  działa
slug: architektura-14
path: /architektura-14
template: default
draft: false
date: '2026-01-14'
hero:
  heading: >-
    Logowanie i monitoring: jak projektować system, który mówi Ci, że coś nie
    działa
  subheading: >-
    Praktyczny przewodnik — co mierzyć, jak alarmować, jak unikać fałszywych
    sygnałów
meta:
  summaryBullets:
    - 'Werdykt: prosty monitoring + sensowne logi to minimalne wymaganie.'
    - 'Dla kogo: zespoły, które chcą szybciej wykrywać i naprawiać awarie.'
    - 'Start: trzy szybkie kroki, które wdroisz w 1 dzień.'
  primaryCta:
    label: OpenTelemetry — specyfikacja logów
    href: https://opentelemetry.io/docs/specs/otel/logs/
  duration: 5 min
  updatedAt: '2026-01-14'
  author: Redakcja
  hasAffiliateLinks: false
  format: recenzja
taxonomy:
  categories:
    - Architektura
    - Observability
  tags:
    - monitoring
    - logi
    - SRE
    - OpenTelemetry
seo:
  title: Logowanie i monitoring — praktyczny przewodnik
  description: >-
    Jak zaprojektować system obserwowalności, który naprawdę wykrywa problemy —
    metryki, alerty, logi, korelacja sygnałów.
  keywords:
    - monitoring
    - logi
    - alerting
    - OpenTelemetry
    - SRE
---

## Obietnica i werdykt
Obietnica: dostaniesz prosty plan, żeby przestać dostawać powiadomienia „działa na moim Make” i zacząć realnie wykrywać problemy.  
**Werdykt: zacznij od trzech rzeczy — metryki zdrowia, sensowne alerty i strukturalne logi — zanim zbudujesz skomplikowany stack.**

## 3 pytania, które rozstrzygają decyzję
Czy dostanę informację szybciej niż użytkownik zgłosi problem? — **Tak** jeśli masz SLO/SLA + alerty na błędy krytyczne.  
Czy informacja pozwala naprawić przyczynę, a nie tylko symptom? — **Tak** jeśli logi są strukturalne i mają identyfikatory korelacji.  
Czy alerty nie spamują zespół? — **Tak** jeśli stosujesz progową weryfikację, opóźnienia „for” i eskalację według ważności.

## Czym jest dobry system logowania i monitoringu
Dobry system łączy trzy sygnały: metryki (liczby), logi (kontekst) i trasy/śledzenia (korelacja). Metryki mówią „co się zmieniło”, logi wyjaśniają „dlaczego”, a trace pokazuje „gdzie w przepływie”. W praktyce: metryka wysokiego p99 opóźnień uruchamia alert, logi z żądania wskazują usługę i błąd, a trace pozwala śledzić request przez mikroserwisy.

### Krótka definicja: metryka vs log
Metryka — liczba (np. 200 requestów/s); używasz ich do progów i trendów.  
Log — tekstowo-strukturalny zapis zdarzenia; używasz go do debugowania.  
W praktyce: jeśli dashboard pokazuje spike błędów, otwierasz logi powiązane z tym oknem czasowym.

## Jak zacząć (ścieżka w 60–120 minut)
1. Wybierz jedną metrykę zdrowia per krytyczną ścieżkę (latency p95, error rate).  
2. Dodaj alert: threshold + `for` (np. error_rate > 1% for 5m).  
3. Włącz strukturalne logi z traceId/SpanId.  
Jeśli chcesz konkretny format i wskazówki, zerknij na dokumentację [OpenTelemetry docs](https://opentelemetry.io/docs/specs/otel/logs/).

## Fakt → Skutek → Werdykt (przykłady)
Fakt: Alerty bez kontekstu wysyłają powiadomienia w godzinach pracy i w nocy.  
Skutek: Zespoły ignorują alerty (alert fatigue).  
Werdykt: **Alerty muszą zawierać kontekst i priorytet; nie wysyłaj każdego błędu.**

Fakt: Logi tekstowe mieszane z osobnymi formatami utrudniają parsowanie.  
Skutek: Analiza i korelacja trwają dłużej, troubleshooting się wydłuża.  
Werdykt: **Stosuj strukturalne logi (JSON/klucz-wartość) i politykę redakcji danych wrażliwych.**

## Tabela: metryki vs logi — kiedy co użyć
| Cel | Co mierzy | Mini-werdykt |
| --- | --- | --- |
| Wykrywanie awarii | Metryki (error rate, latency) | **Monitoruj** metrykami |
| Diagnostyka | Logi strukturalne + traceId | **Debuguj** logami |
| Root cause | Traces / korelacja | **Śledź** za pomocą traceId |

## Plusy i typowe skargi
Plusy: szybkie wykrywanie z metrykami, precyzyjna diagnostyka z logów, możliwość automatycznej eskalacji.  
Typowe skargi: za dużo alertów, koszty przechowywania logów, brak korelacji między logami a trace'ami.

## Plusy/minusy po wdrożeniu
Plusy:
- Skrócenie MTTR przy dobrze dobranych alertach.
- Lepsze zrozumienie zachowania systemu dzięki korelacji sygnałów.
Minusy:
- Koszty (przechowywanie, retention) jeśli zbierasz wszystko.
- Praca porządkowa: normalizacja logów, redakcja danych, mapowanie usług.

_Kiedy koszty rosną:_ jeśli przechwytujesz pełne payloady zamiast metadanych — zacznij od agregacji i samplingowania.

## Werdykt per segment zespołu
- Mały zespół bez SRE: **Priorytet** — metryki podstawowe + alert na błędy krytyczne.  
- Rozproszona architektura mikroserwisów: **Priorytet** — strukturalne logi z traceId i centralny collector (np. OpenTelemetry).  
- Zespół z dużym ruchem/hiperskładowaniem: **Priorytet** — strategia samplingowa i retencja binarna (krótkie pełne logi, długie agregaty).

## Jak mierzyłem/na jakich źródłach opieram rekomendacje
Rekomendacje opierają się na publicznych best practices, np. specyfikacji OpenTelemetry dla logów i powszechnych zasad alertowania (threshold + for + eskalacja). Dla szczegółów implementacyjnych zobacz specyfikację [OpenTelemetry docs](https://opentelemetry.io/docs/specs/otel/logs/) — jeśli nie jesteś pewien, czy twój stack wspiera konkretne pola (traceId, resource attributes), sprawdź dokumentację kolektora/SDK, który używasz.

## Jednoznaczna puenta
**Zacznij prosto: metryki (wykrycie) + logi strukturalne z korelacją (diagnostyka).** Dopiero potem dodawaj złożone reguły, kosztowne retencje i automatyczne playbooki.

## Prosty next step (co zrobić zaraz)
- Dodaj jedną metrykę zdrowia i jeden alert (deadline: dziś).  
- Wprowadź traceId do logów (deadline: w tym tygodniu).  
- Przeczytaj specyfikację logów: [OpenTelemetry docs](https://opentelemetry.io/docs/specs/otel/logs/).

## Co zrobić, jeśli coś jest niepewne
Nie jesteś pewien kompatybilności swojego frameworka z OpenTelemetry? Sprawdź dokumentację SDK kolektora lub przetestuj lokalnie: wypuść testowy trace + log z traceId i zobacz, czy kolektor przekazuje pole dalej. Jeśli dokumentacja nie odpowiada, uruchom prosty PoC z kolektorem FluentBit/OTel Collector i zweryfikuj zachowanie.

## Podsumowanie
Idealne dla zespołów, które potrzebują szybkiego wykrywania i diagnozy błędów: **prostota + korelacja**. Będzie frustrować, jeśli priorytetem są tylko pełne zrzuty danych bez strategii retencji — w takim przypadku wybierz najpierw agregację i sampling, a potem rozbudowę stacka.
