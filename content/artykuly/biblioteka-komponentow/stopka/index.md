---
title: "Sekcje: Stopka"
slug: sekcje-stopka
path: /artykuly/biblioteka-komponentow/sekcje-stopka/
draft: false
template: default
type: template
date: "2026-01-15"
hero:
  heading: "Sekcje: Stopka"
  subheading: Krótki przewodnik projektowy — co wkładać do stopki i dlaczego
seo:
  title: "Sekcje: Stopka — co zawrzeć w stopce strony"
  description: "Praktyczny przewodnik po stopkach: elementy, dostępność, treść i typowe\
    \ błędy. Krótko, z przykładami i decyzjami projektowymi."
  keywords:
  - stopka
  - footer
  - dostępność
  - projektowanie stron
  - biblioteka komponentów
meta:
  summaryBullets:
  - "Werdykt: prosta stopka z prawami autorskimi i linkami prawnymi wystarcza w większości\
    \ serwisów."
  - "Dla kogo: e-commerce i serwisy korporacyjne potrzebują rozbudowanej, informacyjnej\
    \ stopki; blogy i landing page — kompaktowej."
  - "Start: umieść `<footer>` jako bezpośredniego potomka `<body>` i dodaj linki do\
    \ polityk + kontakt."
  primaryCta:
    label: "MDN: footer element"
    href: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer
  updatedAt: "2026-01-15"
  author: Redakcja UX
  difficulty: łatwy
taxonomy:
  tags:
  - evergreen
  - biblioteka
---

## Obietnica decyzji
**Krótko:** projektuj stopkę tak, żeby spełniała trzy zadania: informowała o prawach i politykach, ułatwiała kontakt oraz nie przeszkadzała w nawigacji. Jeśli masz ograniczony czas — postaw na minimalną stopkę z linkami prawnymi i kontaktem.  

## Kilka szybkich pytań (i natychmiastowa odpowiedź)
- Czy stopka potrzebuje mega-mapy strony? **Nie** — chyba że prowadzisz duży serwis informacyjny lub sklep z tysiącami produktów.  
- Czy używać `<footer>` czy `role="contentinfo"`? **Preferuj `<footer>`**; dodaj `role="contentinfo"` tylko przy wsparciu starych przeglądarek/screen readerów. ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/contentinfo_role?utm_source=openai).org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/contentinfo_role?utm_source=openai))  
- Czy jedna stopka na stronę to wymóg? **Tak** — jedna najwyższego poziomu `contentinfo` na dokument. Jeśli masz dodatkowe stopki w artykułach, oznacz je etykietą (`aria-label`). ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/contentinfo_role?utm_source=openai).org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/contentinfo_role?utm_source=openai))

## Czym jest stopka (krótko, technicznie)
Element HTML `<footer>` opisuje obszar stopki dla najbliższego kontenera; jeśli jest bezpośrednio pod `<body>`, to odnosi się do całej strony. W praktyce to miejsce na prawa autorskie, linki do polityk, kontakt i ewentualnie nawigację pomocniczą. Z punktu widzenia dostępności to landmark typu `contentinfo`. _Co to znaczy w praktyce_: screen reader może szybko przeskoczyć do stopki, więc nie upychaj tam powiadomień ani treści, które użytkownik musi natychmiast przeczytać. ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer?utm_source=openai).org/en-US/docs/Web/HTML/Element/footer?utm_source=openai))

### Krótki przykład startu (kod)
Uproszczony szkielet stopki:
```html
<footer>
  <small>© 2026 Twoja Firma</small>
  <nav aria-label="Linki w stopce">
    <a href="/kontakt">Kontakt</a>
    <a href="/polityka-prywatnosci">Polityka prywatności</a>
    <a href="/regulamin">Regulamin</a>
  </nav>
</footer>
```
To wystarczy, by spełnić normy semantyczne i dostępność; dodaj `aria-label` jeśli masz wiele podobnych landmarków. ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/contentinfo_role?utm_source=openai).org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/contentinfo_role?utm_source=openai))

## Fakt → Skutek → Werdykt (kluczowe obszary)
Fakt: `<footer>` przy `<body>` działa jako `contentinfo`.  
Skutek: narzędzia i czytniki ekranu rozpoznają go jako stopkę strony.  
Werdykt: **zawsze preferuj semantyczny `<footer>` zamiast jedynie ARIA**, z wyjątkiem znanych problemów w starszych VoiceOver — wtedy dorzuć `role="contentinfo"`. ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer?utm_source=openai).org/en-US/docs/Web/HTML/Element/footer?utm_source=openai))

Fakt: Zbyt wiele elementów w stopce zwiększa „szum” i obciąża użytkownika.  
Skutek: spada użyteczność mobilna i czytelność; użytkownik traci cel.  
Werdykt: **ogranicz treść do rzeczy istotnych**; jeżeli potrzebujesz dodatkowej nawigacji, rozważ sekcję „Przydatne linki” z kreską hierarchii informacji.

## Typy stopek — szybkie porównanie
| Typ stopki | Krótki opis | Mini-werdykt |
| --- | --- | --- |
| Minimalna | Copyright, kontakt, linki prawne | **Dobra dla landingów i blogów** |
| Rozbudowana (mega-footer) | Mapy serwisu, kategorie, newsletter, linki społecznościowe | **Dobra dla e-commerce/portali** |
| Artykułowa (lokalna) | Metadane artykułu, autor, data | **Dobra dla treści, nie zastępuje globalnej stopki** |

## Co zwykle dodawać (i co unikać)
Fakt: Linki do polityk i kontaktu są oczekiwane prawnie i użytecznie.  
Skutek: brak takich linków zwiększa liczbę zapytań do supportu i ryzyko problemów prawnych.  
Werdykt: **priorytet — polityka prywatności, regulamin, kontakt**.  
Unikaj: automatycznie rozwijanych okien w stopce, ciężkich widgetów (np. video autoplay), zbyt wielu elementów social media które odwracają uwagę.

## Plusy i typowe skargi z wdrożeń
Plusy:
- Użytkownicy znajdą polityki i kontakt w przewidywalnym miejscu.  
- Semantyczna stopka poprawia dostępność i SEO (porządek dokumentu).

Typowe skargi:
- „Stopka zajmuje pół ekranu na mobilce” — oznacza złe użycie kolumn i brak priorytetyzacji.  
- „Za dużo linków, nie wiem gdzie kliknąć” — symptom mega-footera bez hierarchii.

Syntetyczny wniosek: **lepsza prostota z opcją rozbudowy niż chaotyczna „wszystko na raz”**.

## Kiedy stopka może cię zawieść
- Gdy umieszczasz tam ważne CTA — użytkownicy oczekują, że CTA będą wcześniej na stronie; stopka to koniec ścieżki.  
- Gdy traktujesz stopkę jako magazyn treści SEO — zduplikowane, długie listy linków mogą zaszkodzić, zamiast pomóc.  
*Jeśli nie jesteś pewien* — sprawdź metryki click-through dla linków ze stopki w analytics; jeżeli > X% ruchu pochodzi z tych linków (ustal własny próg), rozważ przesunięcie ich wyżej.

## Krótka instrukcja: jak zacząć (5–15 min)
1. Dodaj semantyczny `<footer>` tuż przed `</body>`.  
2. Umieść minimum: copyright, link do polityki prywatności, kontakt.  
3. Przetestuj landmarky w czytniku ekranu lub rozszerzeniu do listy landmarków. (Sprawdź, czy istnieje tylko jeden top-level `contentinfo`.) ([[w3.org](https://www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/contentinfo.html?utm_source=openai)/WAI/ARIA/apg/patterns/landmarks/examples/contentinfo.html?utm_source=openai))

## Puenta
**Idealne dla większości serwisów:** prosta, semantyczna stopka z najważniejszymi linkami i kontaktem. **Będzie frustrować** właścicieli dużych sklepów i portali, którzy oczekują, że stopka sama rozwiąże discoverability — tu potrzebne są dodatkowe elementy nawigacyjne i dobre projektowanie informacji. _Jeśli masz dużą stronę, planuj mega-footer jako osobny element biblioteki komponentów i testuj go na mobilnych użytkownikach._

Źródła: [MDN: footer element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer). ([[developer.mozilla.org](https://developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer?utm_source=openai).org/en-US/docs/Web/HTML/Element/footer?utm_source=openai))
