---
title: 'Sekcje: Formularze'
slug: formularze
path: /artykuly/biblioteka-komponentow/formularze/
draft: true
template: default
type: template
date: '2026-01-14'
hero:
  heading: 'Sekcje: Formularze'
  subheading: Jak grupować pola, żeby formularze były czytelne i dostępne
seo:
  title: Sekcje w formularzach — jak i kiedy używać
  description: >-
    Praktyczny przewodnik po sekcjach formularzy: fieldset, legend, role ARIA i
    wzorce projektowe.
  keywords:
    - formularze
    - fieldset
    - legend
    - accessibility
    - formularz sekcje
meta:
  summaryBullets:
    - >-
      Werdykt: prosty wzorzec: fieldset + legend, gdy grupujesz powiązane
      kontrolki.
    - 'Dla kogo: zespoły UI/UX, frontend‑y, twórcy design systemów.'
    - 'Start: sprawdź element <fieldset> na MDN i popraw brak legendy.'
  primaryCta:
    label: 'Dokumentacja MDN: fieldset'
    href: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset
  updatedAt: '2026-01-14'
taxonomy:
  categories:
    - biblioteka komponentów
    - formularze
  tags:
    - evergreen
    - biblioteka
---

## Obietnica decyzji i grupa docelowa

**Krótko:** gdy grupujesz powiązane pola (radiobuttony, checkboxy, ustawienia), stosuj semanticzny <fieldset> z <legend> — to najprostszy sposób, żeby formularze były dostępne i łatwiejsze w utrzymaniu. Artykuł jest dla projektantów, frontend‑developerów i właścicieli design systemów, którym zależy na szybkim werdykcie i konkretnych krokach startowych.

## Szybkie pytania i natychmiastowy kierunek

- Czy grupować radiobuttony lub checkboxy? — **Tak: fieldset + legend.**  
- Czy zamiast fieldset można użyć nagłówka i div? — _Można_, ale wymaga dodatkowej pracy z ARIA i testami; fieldset jest zwykle prostszy i bezpieczniejszy.  
- Czy brak legendy to problem? — **Tak**: brak legendy przy fieldset często jest traktowany jako błąd dostępności i warto to naprawić. ([[powermapper.com](https://www.powermapper.com](https://www.powermapper.com/products/sortsite/rules/acchtmlfieldsetnolegend/?utm_source=openai)/products/sortsite/rules/acchtmlfieldsetnolegend/?utm_source=openai))

## Czym są sekcje formularzy (krótko)

Sekcja formularza to logiczne grupowanie powiązanych kontrolek, np. dane kontaktowe, adres wysyłki, preferencje. W HTML istnieje natywny kontener <fieldset> z podpisem <legend>, który pełni rolę podpisu grupy i ma implicite rolę accessibility `group`. W praktyce czytniki ekranu ogłaszają, że kilka kontrolek należy do tej samej grupy, a legenda wyjaśnia ich kontekst. Zobacz dokumentację MDN: [<fieldset> — MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset). ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset?utm_source=openai).org/en-US/docs/Web/HTML/Element/fieldset?utm_source=openai))

### Jak zacząć (3‑minutowy start)

1. Zidentyfikuj zestaw kontrolek o wspólnym celu (np. "Metody płatności").  
2. Owiń je w `<fieldset>` i dodaj pierwsze dziecko `<legend>` z krótkim opisem (1–6 słów).  
3. Szybki test: uruchom czytnik ekranu i sprawdź, czy legenda jest ogłoszona; jeśli nie, sprawdź strukturę DOM i pozycję legendy (musi być pierwszym dzieckiem). ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset?utm_source=openai).org/en-US/docs/Web/HTML/Element/fieldset?utm_source=openai))

## Fakt → Skutek → Werdykt: fieldset i legend

Fakt: `<fieldset>` ma semantykę grupy i implicite rolę `group`. ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset?utm_source=openai).org/en-US/docs/Web/HTML/Element/fieldset?utm_source=openai))  
Skutek: czytniki ekranu i narzędzia wspomagające lepiej przedstawiają relację między kontrolkami.  
Werdykt: **używaj fieldset+legend, gdy grupa wymaga opisu** — to minimalna praca za lepszą dostępność.

Fakt: brak legendy przy `<fieldset>` jest często zgłaszany jako problem zgodności z WCAG (np. przez narzędzia automatyczne). ([[powermapper.com](https://www.powermapper.com](https://www.powermapper.com/products/sortsite/rules/acchtmlfieldsetnolegend/?utm_source=openai)/products/sortsite/rules/acchtmlfieldsetnolegend/?utm_source=openai))  
Skutek: skanery i manualni testerzy mogą zwrócić uwagę, a część użytkowników korzystających z AT może nie zrozumieć celu grupy.  
Werdykt: **nie zostawiaj pustej legendy**; jeśli opis grupy rzeczywiście nie jest potrzebny, rozważ usunięcie fieldset zamiast pozostawiania go bez legendy.

## Alternatywy i kiedy ich użyć

- Nagłówek + div: przydatne, gdy layout wymusza niestandardową strukturę, ale wtedy musisz dodać role/aria‑label i przetestować zachowanie.  
- role="group" (ARIA): użyteczne przy custom‑widgetach, gdzie nie możesz użyć `<fieldset>`; jednak `role="group"` nie dostarcza wizualnego podpisu i nie zastępuje semantyki `<legend>`. ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset?utm_source=openai).org/en-US/docs/Web/HTML/Element/fieldset?utm_source=openai))

Tabela — porównanie wzorców

| Wzorzec | Dostępność | Mini-werdykt |
| --- | --- | --- |
| fieldset + legend | Najlepsza semantyka; czytniki ogłaszają grupę i podpis | **Rekomendowane** |
| heading + div (bez ARIA) | Brak semantyki grupy dla AT | _Uwaga: wymaga dodatkowych poprawek_ |
| div + role="group" + aria-label | Poprawia dostępność, ale wymaga testów | **Akceptowalne** gdy fieldset niemożliwy |

## Plusy, typowe skargi i synteza

Plusy:
- mniej kodu JS, prostsza implementacja (czysty HTML).  
- wsparcie dla `disabled` na poziomie całej grupy (łatwe wyłączanie).  
- lepsze wyniki w testach dostępności i mniejsza liczba fałszywych zgłoszeń.

Typowe skargi:
- trudności ze stylowaniem domyślnej legendy — rozwiązuje to CSS (np. reset pozycji, padding).  
- problemy w złożonych układach responsywnych — rozwiązanie: ukryć legendę wizualnie (dla AT zostawić ją dostępną) zamiast ją usuwać.

Synteza: fieldset+legend to niski koszt implementacyjny w zamian za realne korzyści dostępnościowe; problemy wizualne rozwiązuje się CSS‑em, nie rezygnując z semantyki.

## Werdykty per segment

- Formularze prostych ustawień (toggle, checkboxy): **fieldset+legend** — prosty i bezpieczny wybór.  
- Złożone, niestandardowe widgety (custom selecty): rozważ `role="group"` z `aria-labelledby`, testując zachowanie na czytnikach. ([[protocol.mozilla.org](https://protocol.mozilla](https://protocol.mozilla.org/components/detail/field-set?utm_source=openai).org/components/detail/field-set?utm_source=openai))  
- Gdy opis grupy jest zbędny: nie używaj fieldset; użyj standardowych etykiet i flow dokumentu.

## Jak sprawdzić zgodność (konkretne kroki)

1. Przejrzyj HTML i znajdź wszystkie `<fieldset>` — upewnij się, że każde ma `<legend>` jako pierwsze dziecko. ([[powermapper.com](https://www.powermapper.com](https://www.powermapper.com/products/sortsite/rules/acchtmlfieldsetnolegend/?utm_source=openai)/products/sortsite/rules/acchtmlfieldsetnolegend/?utm_source=openai))  
2. Uruchom automatyczny skaner WCAG w CI (narzędzia raportujące brak legendy są powszechne). ([[powermapper.com](https://www.powermapper.com](https://www.powermapper.com/products/sortsite/rules/acchtmlfieldsetnolegend/?utm_source=openai)/products/sortsite/rules/acchtmlfieldsetnolegend/?utm_source=openai))  
3. Przetestuj z czytnikiem ekranu (NVDA na Windows, VoiceOver na macOS) — sprawdź, czy legenda jest ogłaszana i czy nawigacja po grupie jest zrozumiała.

Jeżeli masz wątpliwości co do poprawności role="group" w niestandardowym komponencie, porównaj zachowanie z naturalnym `<fieldset>` w prostym przykładzie i użyj poradników implementacyjnych (np. zasoby projektowe Mozilli). ([[protocol.mozilla.org](https://protocol.mozilla](https://protocol.mozilla.org/components/detail/field-set?utm_source=openai).org/components/detail/field-set?utm_source=openai))

## Podsumowanie i prosty next step

**Idealne dla:** zespołów, które chcą prostego kodu i lepszej dostępności — wybierz **fieldset + legend**.  
**Będzie frustrować:** osoby, które chcą pełnej kontroli wizualnej bez modyfikacji CSS; to jednak kwestia stylowania, nie semantyki.

Prosty krok: przeszukaj swoje kluczowe formularze pod kątem `<fieldset>` bez `<legend>` i popraw te elementy; jako punkt startowy przeczytaj dokumentację MDN: [MDN: fieldset](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset). ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset?utm_source=openai).org/en-US/docs/Web/HTML/Element/fieldset?utm_source=openai))
