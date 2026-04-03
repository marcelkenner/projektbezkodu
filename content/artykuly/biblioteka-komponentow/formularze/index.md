---
title: Sekcje w formularzach — jak i kiedy ich używać
slug: sekcje-formularzy
path: /artykuly/biblioteka-komponentow/sekcje-formularzy/
draft: false
template: default
type: template
date: "2026-04-03"
hero:
  heading: "Sekcje: Formularze"
  subheading: Jak grupować pola, żeby formularze były czytelne i dostępne
seo:
  title: Sekcje w formularzach — jak i kiedy używać
  description: "Praktyczny przewodnik po sekcjach formularzy: fieldset, legend, role\
    \ ARIA i wzorce projektowe."
  keywords:
  - formularze
  - fieldset
  - legend
  - accessibility
  - sekcje formularzy
meta:
  summaryBullets:
  - "Werdykt: prosty wzorzec fieldset + legend do grupowania powiązanych kontrolek."
  - "Dla kogo: zespoły UI/UX, frontend‑y, twórcy design systemów."
  - "Start: sprawdź fieldset i legend w MDN i wykonaj szybki test dostępności."
  primaryCta:
    label: "Dokumentacja MDN: fieldset"
    href: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset
  updatedAt: "2026-04-03"
taxonomy:
  categories:
  - biblioteka komponentów
  - formularze
  tags:
  - evergreen
  - biblioteka
---

## Werdykty decyzji

**Werdykt:** jeśli grupujesz powiązane kontrole (np. radiobuttony, checkboxy, ustawienia), użyj semantycznego fieldset z legend. To najprostszy sposób, by formularze były dostępne i łatwiejsze w utrzymaniu. W praktyce oznacza to jasny kontekst dla użytkowników wspomagających oraz dla testerów dostępności. Zasada ta znajduje potwierdzenie w materiałach MDN i w specyfikacjach dotyczących grupowania elementów formularza.

- Uwaga: brak legendy przy fieldset bywa zgłaszany jako problem zgodności z WCAG. W praktyce prowadzi to do utrudnień dla AT i może obniżać oceny dostępności. Nie zostawiaj pustej legendy; jeśli opis grupy nie jest potrzebny, rozważ inny sposób organizacji treści, zamiast pozostawiać fieldset bez podpisu.

## Dla kogo to ma sens

- Zespoły UI/UX, frontendowi programiści, twórcy design systemów, którzy dążą do prostych, bezpiecznych rozwiązań. Fieldset i legenda to minimalny koszt implementacyjny z widocznymi korzyściami dla dostępności.
- Projekty, w których grupa kontrolek ma wspólny kontekst i potrzebny jest zrozumiały podpis. Dzięki temu czytniki ekranu ogłaszają całą grupę jako jedną jednostkę, a legenda wyjaśnia kontekst.

## Alternatywy i kiedy ich użyć

- Nagłówek + div: przydatne, gdy układ wymusza niestandardową strukturę, ale wtedy trzeba dodać role/aria-label i przetestować zachowanie.
- `role="group"` (ARIA): użyteczne w niestandardowych widgetach, gdzie nie można użyć `<fieldset>`; jednak rolą `group` brakuje wizualnego podpisu i nie zastępuje semantyki `<fieldset>`.

Tabela — porównanie wzorców

| Wzorzec | Dostępność | Wady i uwagi |
| --- | --- | --- |
| fieldset + legend | Najlepsza semantyka; czytniki ogłaszają grupę i podpis | Rekomendowany w większości przypadków; wymaga legendy |
| heading + div (bez ARIA) | Brak semantyki grupy dla AT | Wymaga dodatkowego dopasowania ARIA i testów |
| div + role="group" + aria-label | Poprawia dostępność, ale trzeba przetestować | Akceptowalne, gdy fieldset nie jest możliwy |

## Jak podjąć decyzję

- Jeśli grupa ukrywa wspólny cel i wymaga podpisu kontekstowego, wybierz fieldset + legend. To najprostszy sposób na zapewnienie semantyki i łatwości stosowania.  
- W niestandardowych widgetach, gdzie legendy nie pokazują się w naturalny sposób, rozważ `role="group"` z `aria-labelledby`, ale przetestuj zachowanie na różnych czytnikach.  
- Gdy opis grupy nie jest potrzebny, unikaj fieldset i użyj standardowego układu etykiet, pozostawiając logiczne grupowanie w obrębie dokumentu bez dodatkowego kontenera.

### Szybki start (3-minutowy plan)

1) Zidentyfikuj kontrolek o wspólnym celu (np. „Metody płatności”).  
2) Owiń je w `<fieldset>` i dodaj `<legend>` z krótkim opisem (1–6 słów).  
3) Uruchom prosty test z urządzeniami wspomagającymi — legenda powinna być czytelnie ogłaszana jako pierwsza w grupie.  

## Jak zacząć

- Otwórz najważniejsze formularze i sprawdź, czy każda grupa ma sensowny podpis w legendzie.  
- Upewnij się, że legenda jest pierwszym dzieckiem `<fieldset>` i że opis odpowiada wspólnemu celowi grupy.  
- Przetestuj z czytnikiem ekranu (NVDA, VoiceOver) oraz z automatycznymi skanerami WCAG w CI. Niewłaściwie podpisane grupy najczęściej wykazują błędy potwierdzane przez narzędzia do testów dostępności.

_Jeżeli korzystasz z niestandardowych komponentów, porównaj zachowanie z prostym, natywnym przykładem fieldset + legend i opieraj implementację na praktykach dostępności._

## Najczęstsze ryzyka

- Brak legendy w fieldset prowadzi do niskiej dostępności i błędnych interpretacji grupy przez AT. Zawsze dodawaj podpis.
- Złożone układy responsywne mogą wymagać dodatkowych stylów CSS, jeśli chcesz wizualnie ukryć legendę, pozostawiając ją dostępną dla AT. To kwestia stylowania, nie semantyki.

## Start/risk — praktyczne podsumowanie

- Silny wybór dla prostych i bezpiecznych formularzy: fieldset + legenda. Zyskujesz prosty, przewidywalny sposób na zdefiniowanie grupy kontrolek i wpływ na lepsze testy dostępności. Polecane w większości scenariuszy.
- W przypadku skomplikowanych, niestandardowych widgetów: rozważ ARIA i role, ale pamiętaj, że nie zawsze zastąpią legendę. Zawsze testuj na co najmniej dwóch czytnikach i w CI.
- Sprawdzaj, czy każdy fieldset ma legendę, i w razie potrzeby prostuj istniejące formularze. To dobra praktyka do weryfikacji.
