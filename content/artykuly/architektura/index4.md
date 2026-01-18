---
title: 'Single source of truth: gdzie trzymać dane, żeby nie zabić się duplikatami'
slug: single-source-of-truth-gdzie-trzymac-dane-bez-duplikatow
path: /single-source-of-truth-gdzie-trzymac-dane-bez-duplikatow
template: default
draft: false
date: '2026-01-15'
hero:
  heading: 'Single source of truth: gdzie trzymać dane, żeby nie zabić się duplikatami'
  subheading: >-
    Proste reguły wyboru miejsca przechowywania danych — dla zespołów
    produktowych i architektów
seo:
  title: Single source of truth — jak i gdzie trzymać dane
  description: >-
    Praktyczny przewodnik: SSOT, MDM, event store i data warehouse — kiedy
    wybrać które rozwiązanie.
  keywords:
    - single source of truth
    - SSOT
    - master data management
    - data architecture
meta:
  summaryBullets:
    - >-
      Werdykt: jedno źródło prawdy działa najlepiej, jeśli zaakceptujesz
      kompromisy
    - 'Dla kogo: ma sens dla systemów z wieloma konsumentami danych'
    - 'Start: wybierz system rekordu i wyegzekwuj przepływy'
    - 'Ryzyko: vendor lock-in i koszty synchronizacji'
  primaryCta:
    label: Czytaj o różnicy SOR i SOT
    href: https://www.ibm.com/think/topics/system-of-record-vs-source-of-truth
  updatedAt: '2026-01-15'
taxonomy:
  categories:
    - architektura
    - data
  tags:
    - SSOT
    - MDM
    - event-sourcing
---

## Obietnica decyzji dla kogo i po co

Ten artykuł da Ci krótką, praktyczną odpowiedź: **gdzie trzymać „źródło prawdy”** w systemie, żeby ograniczyć duplikaty i ból synchronizacji. Przydatne dla product ownerów, architektów danych i inżynierów odpowiedzialnych za integracje.

## Szybkie pytania (i od razu kierunek)

- Czy trzeba mieć jedno centralne miejsce na wszystkie dane? **Zazwyczaj tak** dla krytycznych encji (klient, produkt), jeśli system ma wielu konsumentów. ([[en.wikipedia.org](https://en.wikipedia](https://en.wikipedia.org/wiki/Single_source_of_truth?utm_source=openai).org/wiki/Single_source_of_truth?utm_source=openai))  
- Czy centralny SSOT wyeliminuje wszystkie problemy z danymi? **Nie** — rozwiązuje powtarzające się niezgodności, ale tworzy inne ryzyka (opóźnienia, vendor lock‑in). ([[ibm.com](https://www.ibm.com](https://www.ibm.com/think/topics/system-of-record-vs-source-of-truth?utm_source=openai)/think/topics/system-of-record-vs-source-of-truth?utm_source=openai))  
- Lepsze: MDM, Event Store czy Data Warehouse? **To zależy** od celu: MDM do zarządzania „golden record”, Event Store do historii i audytu, DW do raportów. ([[en.wikipedia.org](https://en.wikipedia](https://en.wikipedia.org/wiki/Golden_record_%28informatics%29?utm_source=openai).org/wiki/Golden_record_%28informatics%29?utm_source=openai))

## Czym jest single source of truth (SSOT)

SSOT to praktyka, w której dany element jest „mistrzowany” tylko w jednym miejscu — wszystkie inne systemy albo odwołują się do tego miejsca, albo czytają z kopii, za którą odpowiada master. W praktyce oznacza to mniejszą liczbę sprzecznych wartości i prostsze utrzymanie jakości danych. Definicję i klasyczne scenariusze znajdziesz w opisach pojęcia. ([[en.wikipedia.org](https://en.wikipedia](https://en.wikipedia.org/wiki/Single_source_of_truth?utm_source=openai).org/wiki/Single_source_of_truth?utm_source=openai))

### Krótka definicja i przykład

Definicja: SSOT = jeden autorytatywny rekord dla każdej encji (np. klient).  
Przykład w praktyce: baza CRM jako SSOT dla danych kontaktowych; system wysyłkowy pobiera adresy z CRM zamiast przechowywać własnej kopii.

## Jak zacząć (5‑minutowy plan startowy)

1. Wybierz najważniejszą encję (np. klient) i wskaż obecny "system of record".  
2. Udokumentuj regułę: kto może edytować, kto tylko czyta.  
3. Wdroż prostą integrację typu API lub webhook między systemami (pierwszy krok — czytanie z wybranego źródła).  
4. Monitoruj konflikty przez 2 tygodnie i zbieraj przypadki wyjątkowe.  
W praktyce: pierwszy tydzień to audyt źródeł danych; drugi tydzień — prosty read‑only proof‑of‑concept.

## Główne warianty techniczne i ich konsekwencje

Poniżej najczęściej spotykane podejścia — fakt → skutek → werdykt.

- Master Data Management (MDM): system, który konsoliduje aktualizacje z różnych systemów, tworzy „golden record” i syndykuje zmiany. Skutek: dobre www do zarządzania jakością, ale wymaga procesu decyzyjnego i E/SB lub pipeline'ów. **Werdykt**: wybierz, gdy masz heterogeniczne systemy biznesowe i potrzebujesz jednego ujednoliconego rekordu. ([[en.wikipedia.org](https://en.wikipedia](https://en.wikipedia.org/wiki/Golden_record_%28informatics%29?utm_source=openai).org/wiki/Golden_record_%28informatics%29?utm_source=openai))

- Event store / Event Sourcing: wszystkie zmiany są zapisywane jako zdarzenia; aktualny stan rekreowany jest z sekwencji zdarzeń. Skutek: pełna historia i deterministyczne odtwarzanie, ale inna mentalność wdrożenia. **Werdykt**: dobry, gdy potrzebujesz audytu i możliwości odtwarzania oraz gdy systemem rządzi domena zdarzeń. ([[docs.databricks.com](https://docs.databricks](https://docs.databricks.com/aws/en/lakehouse/ssot?utm_source=openai).com/aws/en/lakehouse/ssot?utm_source=openai))

- Data Warehouse (DW): skonsolidowany widok do raportów; często nie służy do aktualizacji operacyjnych. Skutek: świetne źródło raportowe, ale nie zawsze nadaje się jako SSOT do systemów operacyjnych. **Werdykt**: używaj jako „single version of truth” dla BI, nie jako authority dla systemów operacyjnych. ([[en.wikipedia.org](https://en.wikipedia](https://en.wikipedia.org/wiki/Single_version_of_the_truth?utm_source=openai).org/wiki/Single_version_of_the_truth?utm_source=openai))

## Porównanie: szybka tabela decyzji

| Rozwiązanie | Gdy warto wybrać | Mini‑werdykt |
| --- | --- | --- |
| MDM | wiele systemów źródłowych, potrzeba „golden record” | **Dobre** dla enterprise |
| Event Store | potrzeba audytu i odtwarzalności | **Dobre** dla domen event‑driven |
| Data Warehouse | raportowanie i analityka | **Dobre** tylko dla BI |
| Shared DB / Single DB | proste systemy, jeden właściciel | **Dobre** jeśli można zrezygnować z heterogeniczności |

## Typowe koszty i skargi po wdrożeniu

Fakt: centralizacja zmienia model odpowiedzialności — teraz potrzebujesz procesów właściciela danych. Skutek: kłopoty z governance, wolniejsze zmiany i ryzyko lock‑in. W praktyce: zespoły często narzekają na opóźnienia w deployach i trudności z testowaniem. **Werdykt**: zaakceptuj te koszty tylko jeśli korzyści w postaci spójności danych przewyższają straty.

## Kiedy SSOT to zły pomysł

- Gdy systemy są całkowicie niezależne i mają różne wymagania odnośnie szybkości zapisu: centralny master może stać się wąskim gardłem.  
- Gdy koszt synchronizacji przewyższa wartość biznesową spójności.  
_Jeśli nie jesteś pewien_, sprawdź metryki opóźnień i koszt integracji przed decyzją; audyt podejść do danych (kto i jak często modyfikuje encję) daje szybkie wskazanie, czy SSOT ma sens.

## Wiarygodne źródła i gdzie to sprawdzić

Definicje i klasyczne scenariusze SSOT znajdziesz w opisie zagadnienia. ([[en.wikipedia.org](https://en.wikipedia](https://en.wikipedia.org/wiki/Single_source_of_truth?utm_source=openai).org/wiki/Single_source_of_truth?utm_source=openai)) Różnice między systemem rekordu a źródłem prawdy dobrze wyjaśnia artykuł na stronie IBM — warto go przeczytać przed wyborem architektury. [artykuł IBM](https://www.ibm.com/think/topics/system-of-record-vs-source-of-truth). ([[ibm.com](https://www.ibm.com](https://www.ibm.com/think/topics/system-of-record-vs-source-of-truth?utm_source=openai)/think/topics/system-of-record-vs-source-of-truth?utm_source=openai))

Jeżeli jakieś stwierdzenie wydaje Ci się niepewne, kliknij do powyższych źródeł i porównaj ich rekomendacje z własnym stackiem — sprawdź, które systemy mogą pełnić rolę SOR (system of record) bez modyfikacji.

## Podsumowanie i jednoznaczna puenta

**Werdykt końcowy:** jeśli twój biznes ma wiele systemów, które muszą korzystać z tej samej encji i gotów jesteś zapłacić za governance i integracje — wprowadź SSOT. Jeśli masz prosty stack lub priorytetem jest niska latencja write‑ów — rozważ inne podejścia (shared DB lub świadoma duplikacja z mechanizmem rekonsyliacji). **Idealne dla** organizacji z rozproszonymi systemami i potrzebą spójnych danych; **Będzie frustrować** małe zespoły, które nie chcą zarządzać polityką zmian i synchronizacji.

**Prosty next step:** wskaż jedną encję, wybierz jej system of record i wdroż read‑only proof‑of‑concept na 2 tygodnie — zmierzyć konflikty i koszty synchronizacji.
