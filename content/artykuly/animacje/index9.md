---
title: "„Prefer reduced motion”: jak robić animacje, które nie wkurzają i są dostępne"
slug: animacje-9
path: /animacje-9
template: default
draft: false
date: "2026-01-15"
hero:
  heading: Prefer reduced motion — animacje, które nie denerwują użytkowników
  subheading: Praktyczne zasady dla zespołów produktowych i deweloperów
seo:
  title: Prefer reduced motion — jak projektować dostępne animacje
  description: "Kiedy i jak wyciszyć ruch w interfejsie: konkretne reguły, przykłady\
    \ CSS i procedura testowa zgodna z WCAG."
  keywords:
  - prefers-reduced-motion
  - dostępność
  - animacje
  - WCAG
  - CSS
meta:
  summaryBullets:
  - "Werdykt: wyłączaj nieistotny ruch; tonuj ważne przejścia."
  - "Dla kogo: zespoły produktowe i frontend devy — priorytet, gdy masz użytkowników\
    \ wrażliwych na ruch."
  - "Start: w 5 minut dodasz media query i zrobisz szybki test."
  primaryCta:
    label: Technika C39 na stronie W3C
    href: https://www.w3.org/WAI/WCAG21/Techniques/css/C39
  updatedAt: "2026-01-15"
  author: Redakcja UX
taxonomy:
  categories:
  - dostępność
  - frontend
---

## Obietnica decyzji — dla kogo ten tekst

Dla zespołów produktowych i frontendowych: **jeśli zależy ci na jakości i dostępności, upraszczaj lub wyłącz ruch nieistotny**. Ten artykuł daje jasne, wykonalne reguły i szybki plan działania.

## Najważniejsze pytania (i szybkie odpowiedzi)

- Czy zawsze wyłączać animacje?  
  **Nie** — wyłączaj nieistotny ruch; zachowaj łagodne przejścia tam, gdzie pomagają orientacji.  
- Co robić najpierw?  
  Dodaj media query `prefers-reduced-motion` i przetestuj przy włączonej opcji systemowej — to zajmuje ~5 minut.  
- Czy to część WCAG?  
  **Tak** — WCAG wymaga, by interakcyjne animacje dało się wyłączyć/ograniczyć. ([[w3.org](https://www.w3.org](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions?utm_source=openai)/WAI/WCAG21/Understanding/animation-from-interactions?utm_source=openai))

## Czym jest prefers-reduced-motion i dlaczego ma znaczenie

`prefers-reduced-motion` to zapytanie CSS wykrywające ustawienie systemowe użytkownika, który chce zmniejszyć ruch w interfejsie; pozwala zastosować alternatywne, statyczne lub łagodniejsze style. Zajrzyj na stronę MDN po definicję i przykłady: [strona MDN o prefers-reduced-motion](https://developer.mozilla.org/docs/Web/CSS/%40media/prefers-reduced-motion). ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/docs/Web/CSS/%40media/prefers-reduced-motion?utm_source=openai).org/docs/Web/CSS/%40media/prefers-reduced-motion?utm_source=openai))

Co to znaczy w praktyce: użytkownik w systemie (macOS/iOS/Windows/Android itp.) włącza „Reduce motion”, a Twoje CSS może wtedy np. zdjąć animację klatek lub skrócić czas przejść — bez ingerencji w funkcjonalność. ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/docs/Web/CSS/%40media/prefers-reduced-motion?utm_source=openai).org/docs/Web/CSS/%40media/prefers-reduced-motion?utm_source=openai))

## Jak zacząć w 5 minut

1. Dodaj w CSS wyciszający blok:
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation: none !important;
       transition: none !important;
     }
   }
   ```
2. Włącz w systemie opcję „Reduce Motion” i odpal stronę — sprawdź, czy treść/nawigacja nadal działa; to szybki test zgodny z techniką W3C. ([[w3.org](https://www.w3.org](https://www.w3.org/WAI/WCAG21/Techniques/css/C39?utm_source=openai)/WAI/WCAG21/Techniques/css/C39?utm_source=openai))
3. Rozważ odwrotną strategię: zdefiniuj domyślnie statyczne style, a animacje włączaj tylko gdy `no-preference` — to minimalizuje ryzyko pominięcia reguł.

### Przykład CSS: tonowanie, nie kasowanie (gdzie ruch pomaga)

```css
@media (prefers-reduced-motion: reduce) {
  .fade-in { opacity: 1; transition: none; }
  .carousel { transform: none; animation: none; }
}
```

Powód: nagłe usunięcie wszystkich efektów zdarza się rzadko; lepiej zamienić silne transformacje/skalowanie na prostą zmianę opacity lub statyczne pojawienie się.

## Fakty → Skutek → Werdykt (konkretne przypadki)

### Animacje wejścia (elementy pojawiające się na stronie)
Fakt: duże przesunięcia/skale są typowymi uruchamiaczami nudności. ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/docs/Web/CSS/%40media/prefers-reduced-motion?utm_source=openai).org/docs/Web/CSS/%40media/prefers-reduced-motion?utm_source=openai))  
Skutek: użytkownik z wrażliwością może opuścić stronę lub przegapić ważną treść.  
Werdykt: **wyłącz ruch wejścia lub zastąp prostszym „dissolve” / opacity**.

### Animacje sterowane interakcją (klik, hover, scroll)
Fakt: WCAG wymaga, żeby animacje wywołane przez interakcje dało się znieść/wyłączyć, jeśli nie są niezbędne. ([[w3.org](https://www.w3.org](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions?utm_source=openai)/WAI/WCAG21/Understanding/animation-from-interactions?utm_source=openai))  
Skutek: jeśli animacja jest „istotna” (np. pokazuje kolejność kroków), nie usuwaj jej; jeśli dekoracyjna — usuń.  
Werdykt: **rozróżniaj: essential vs decorative**; dokumentuj przypadki, gdzie animacja jest „essential”.

### Tabela szybkich decyzji

| Typ animacji | Wpływ na użytkownika | Mini-werdykt |
| --- | --- | --- |
| Duże panningi / scaling | Wysokie ryzyko nudności | **Wyłącz** |
| Delikatne cross-fade | Niskie ryzyko; pomaga orientacji | **Tonuj** |
| Animacje informacyjne (np. tooltip wejście) | Jeśli usunięcie zaburza komunikat | **Zachowaj z alternatywą** |
| Dekoracyjne cząstki/konfetti | Wyłącznie dekoracja | **Wyłącz** |

(Werdykt w tabeli: zalecenie praktyczne, zastosuj `prefers-reduced-motion`.) ([[w3.org](https://www.w3.org](https://www.w3.org/WAI/WCAG21/Techniques/css/C39?utm_source=openai)/WAI/WCAG21/Techniques/css/C39?utm_source=openai))

## Implementacja: kod, pułapki i testy

- Pułapka: używanie tylko JavaScript do kontroli animacji bez reagowania na media query — wtedy systemowe ustawienie może być zignorowane. Użyj CSS jako pierwszej linii obrony, a JS tylko do uzupełnienia. ([[w3.org](https://www.w3.org](https://www.w3.org/WAI/WCAG21/Techniques/css/C39?utm_source=openai)/WAI/WCAG21/Techniques/css/C39?utm_source=openai))  
- Test: w systemie włącz „Reduce Motion” i wykonaj scenariusze interakcyjne (klik, scroll) — W3C sugeruje taką procedurę testową. ([[w3.org](https://www.w3.org](https://www.w3.org/WAI/WCAG21/Techniques/css/C39?utm_source=openai)/WAI/WCAG21/Techniques/css/C39?utm_source=openai))

Krótki wzorzec JavaScript (reakcja na zmianę preferencji):
```js
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
function handleChange() {
  if (mq.matches) document.documentElement.classList.add('reduced-motion');
  else document.documentElement.classList.remove('reduced-motion');
}
mq.addEventListener?.('change', handleChange);
handleChange();
```
Uwaga: stary Internet Explorer nie ma `matchMedia` w tej formie — jeśli musisz wspierać niezwykle stare przeglądarki, zweryfikuj polifil.

## Plusy / typowe skargi — synteza

Plusy:
- Większe bezpieczeństwo użytkowników wrażliwych na ruch.  
- Prosty koszt wdrożenia: kilka linijek CSS i jeden test.  

Typowe skargi:
- „Strona wygląda nudniej” — w praktyce większość użytkowników docenia spójność i stabilność interfejsu.  
- „Animacje przestają pomagać w orientacji” — to sygnał, że animacja była _essential_; w takim przypadku zaprojektuj alternatywę (np. tekst lub ikonę wskazującą zmianę stanu).

## Werdykt i prosty next step

**Werdykt:** jeśli twoja aplikacja ma więcej niż 1000 użytkowników lub obsługuje krytyczne zadania (np. zdrowie, finanse), traktuj `prefers-reduced-motion` jako obowiązek. Jeśli produkt jest rozrywkowy i ma minimalny kontakt z interfejsami używanymi przez osoby wrażliwe — priorytet niższy, ale i tak zalecany. _Warunek:_ zawsze dokumentuj, które animacje uznajesz za „essential”. ([[w3.org](https://www.w3.org](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions?utm_source=openai)/WAI/WCAG21/Understanding/animation-from-interactions?utm_source=openai))

Prosty next step (1–2 linijki zadania, do wykonania w 5–15 minut):
- Dodaj blok `@media (prefers-reduced-motion: reduce)` z `animation: none` i `transition: none` oraz przetestuj na systemie. ([[w3.org](https://www.w3.org](https://www.w3.org/WAI/WCAG21/Techniques/css/C39?utm_source=openai)/WAI/WCAG21/Techniques/css/C39?utm_source=openai))

Źródła:
- MDN: dokumentacja `prefers-reduced-motion`. ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/docs/Web/CSS/%40media/prefers-reduced-motion?utm_source=openai).org/docs/Web/CSS/%40media/prefers-reduced-motion?utm_source=openai))  
- W3C: Technika C39 i wyjaśnienie kryterium WCAG 2.3.3. ([[w3.org](https://www.w3.org](https://www.w3.org/WAI/WCAG21/Techniques/css/C39?utm_source=openai)/WAI/WCAG21/Techniques/css/C39?utm_source=openai))
