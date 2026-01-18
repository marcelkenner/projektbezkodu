---
title: "Teksty alternatywne obrazów: checklisty i proces dla zespołów no-code"
slug: teksty-alternatywne-obrazow-no-code
path: /dostepnosc/teksty-alternatywne-obrazow-no-code
template: default
draft: false
date: "2026-01-15"
hero:
  heading: "Teksty alternatywne obrazów: checklisty i proces"
  subheading: Praktyczny przewodnik dla zespołów no-code
meta:
  summaryBullets:
  - "Krótkie reguły pisania altów: kiedy opisać, kiedy pominąć."
  - "Proces weryfikacji altów bez kodu: checklisty i role."
  - Najczęstsze błędy i szybkie poprawki do wdrożenia.
  primaryCta:
    label: "W3C: Teksty alternatywne"
    href: https://www.w3.org/WAI/alt/
  updatedAt: "2026-01-15"
  duration: 5–15 min
  author: Redakcja
seo:
  title: Teksty alternatywne obrazów — checklisty i proces dla zespołów no-code
  description: Konkretna instrukcja pisania i weryfikacji altów dla zespołów no-code.
    Checklisty, przykłady, typowe pułapki i proste testy.
  keywords:
  - alt text
  - accessibility
  - no-code
  - WCAG
  - dostępność cyfrowa
taxonomy:
  categories:
  - dostepnosc-cyfrowa
  tags:
  - no-code
  - accessibility
  - wcag
---

Dostaniesz prosty proces i checklistę, żeby zespół no-code (designer + PM + content) mógł napisać i zweryfikować alt-y obrazów w 5–15 minut na stronę/sekcję. **Jeżeli chcesz minimalnego ryzyka zgodności z WCAG → stosuj reguły tu opisane.**

## 3 pytania, które rozstrzygamy szybko
- Czy obraz niesie informację nieobecną w tekście? — **tak** → napisz opis; **nie** → zrób alt="" (dekoracyjny). ([[getwcag.com](https://getwcag.com/en](https://getwcag.com/en/accessibility-guide/image-alt?utm_source=openai)/accessibility-guide/image-alt?utm_source=openai))  
- Czy obraz to wykres/infografika wymagająca pełnego opisu? — **tak** → dodaj dłuższy opis/tekst pod obrazem; **nie** → krótki alt wystarczy. [([w3.org](https://www.w3.org/WAI/alt/?utm_source=openai))](https://www.w3.org/WAI/alt/?utm_source=openai)  
- Czy obraz jest linkiem/ikoną? — **tak** → alt opisuje cel akcji (np. "Dodaj do koszyka"); **nie** → opisuje treść. ([[html-validate.org](https://html-validate](https://html-validate.org/rules/wcag/h37.html?utm_source=openai).org/rules/wcag/h37.html?utm_source=openai))

## Czym są teksty alternatywne (alt) i dlaczego to ważne
Alt to krótki tekst przypisany do obrazu, który zastępuje obraz dla osób używających czytników ekranu lub gdy obraz się nie załaduje. W praktyce: jeśli obraz przekazuje informację konieczną do zrozumienia treści, alt musi tę informację oddać; jeśli obraz jest dekoracją, powinien być ukryty dla AT przez alt="". To wymóg WCAG 1.1.1. [([w3.org](https://www.w3.org/WAI/alt/?utm_source=openai))](https://www.w3.org/WAI/alt/?utm_source=openai)

## Jak zacząć — szybka ścieżka dla zespołu no-code
### Kroki (5–15 min)
1. Przejdź stronę i oznacz obrazy: Informacyjne / Dekoracyjne / Funkcyjne (linki/ikonki).  
2. Dla każdego informacyjnego wpisz jedno zdanie-werdykt: "Co ma przekazać ten obraz?" → zamień na alt.  
3. Dla wykresów zapisz, co musi być zrozumiane bez obrazu; dodaj pod-obrazowy opis (kafel / caption).  
4. Przejrzyj alt-y w kontekście tekstu: jeśli tekst już mówi to samo, ustaw alt="" by uniknąć powtórzeń. ([[getwcag.com](https://getwcag.com/en](https://getwcag.com/en/accessibility-guide/image-redundant-alt?utm_source=openai)/accessibility-guide/image-redundant-alt?utm_source=openai))

## Checklist do odhaczenia (gotowe do wdrożenia)
- Każdy <img> ma atrybut alt (tekst lub alt=""). ([[html-validate.org](https://html-validate](https://html-validate.org/rules/wcag/h37.html?utm_source=openai).org/rules/wcag/h37.html?utm_source=openai))  
- Alt opisuje funkcję lub informację (nie opisuje wyglądu, jeśli to nieistotne). ([[getwcag.com](https://getwcag.com/en](https://getwcag.com/en/accessibility-guide/image-alt?utm_source=openai)/accessibility-guide/image-alt?utm_source=openai))  
- Ikony/CTA mają alt opisujący działanie (np. "Kup teraz").  
- Wykresy mają dodatkowy, pełniejszy opis w tekście lub aria-describedby.  
- Alt nie powtarza pobliskiego tekstu/napisu — wtedy ustaw alt="". ([[getwcag.com](https://getwcag.com/en](https://getwcag.com/en/accessibility-guide/image-redundant-alt?utm_source=openai)/accessibility-guide/image-redundant-alt?utm_source=openai))

## Fakty → Skutki → Werdykt
- Fakt: WCAG wymaga tekstów alternatywnych dla nie-tekstowej zawartości. Skutek: brak altów to błąd poziomu A. Werdykt: **nie pomijać altów na stronach publicznych**. [([w3.org](https://www.w3.org/WAI/alt/?utm_source=openai))](https://www.w3.org/WAI/alt/?utm_source=openai)  
- Fakt: dekoracyjne obrazy powinny mieć alt="" (null). Skutek: screenreadery je pomijają, użytkownik nie słyszy zbędnego szumu. Werdykt: **oznaczaj dekoracje jako null**. ([[w3c.github.io](https://w3c.github](https://w3c.github.io/wcag/techniques/failures/F39?utm_source=openai).io/wcag/techniques/failures/F39?utm_source=openai))  
- Fakt: powtarzanie tekstu z obrazu i z otoczenia tworzy duplikację głosu w czytnikach. Skutek: gorsze UX i większe obciążenie poznawcze. Werdykt: **gdy info jest już w tekście — alt=""**. ([[getwcag.com](https://getwcag.com/en](https://getwcag.com/en/accessibility-guide/image-redundant-alt?utm_source=openai)/accessibility-guide/image-redundant-alt?utm_source=openai))

## Krótka tabela porównawcza (mini-werdykt)
| Typ obrazu | Co napisać w alt | Mini-werdykt |
| --- | --- | --- |
| Dekoracja (tło, ozdoba) | alt="" | **POMIŃ** |
| Informacyjny (foto produktu, ilustracja) | cel/istota: 1 zdanie | **OPISZ** |
| Funkcyjny (ikonka link/CTA) | cel akcji ("Otwórz menu") | **OPISZ CEL** |
| Wykres/infografika | krótki alt + pełny opis w tekście | **DODAJ DŁUŻSZY OPIS** |

## Typowe błędy wdrożeniowe i jak je naprawić
- Alt = nazwa pliku lub "image" — naprawa: zastąp sensownym opisem celu obrazu.  
- Alt powtarza caption/tekst — naprawa: jeśli informacja już występuje, zostaw alt="". ([[getwcag.com](https://getwcag.com/en](https://getwcag.com/en/accessibility-guide/image-redundant-alt?utm_source=openai)/accessibility-guide/image-redundant-alt?utm_source=openai))  
- Brak opisu wykresów — naprawa: dodaj opis w tekście lub link do dłuższego opisu; test: zamknij oczy i przeczytaj, czy rozumiesz wykres. ([[getwcag.com](https://getwcag.com/en](https://getwcag.com/en/accessibility-guide/image-alt?utm_source=openai)/accessibility-guide/image-alt?utm_source=openai))

## Kiedy proces no-code może zawieść
- Gdy zespół nie ma przypisanych ról za alt (kto decyduje: content/UX?). Skutek: niespójność i jakościowe regresy. Werdykt: **wprowadź prostą regułę w ticketach** (np. "content wpisuje alt; UX weryfikuje").  
- Gdy CMS/no-code tool nie obsługuje opisów dłuższych (caption/aria-describedby). Skutek: wymagane obejścia (dodatkowy tekst obok obrazu). _Jeśli nie jesteś pewny wsparcia narzędzia — sprawdź dokumentację CMS lub inspektor atrybutów obrazu._ ([[uagc.edu](https://www.uagc.edu](https://www.uagc.edu/accessibility-resource-center/alt-text?utm_source=openai)/accessibility-resource-center/alt-text?utm_source=openai))

## Puenta — co robić teraz
**Idealne dla:** zespołów no-code, które chcą szybko zredukować ryzyko niezgodności WCAG i poprawić UX osób korzystających z czytników ekranu.  
**Będzie frustrować, wybierz inne rozwiązanie jeśli:** masz skomplikowane infografiki wymagające eksperckich opisów — wtedy plan pracy powinien uwzględniać copywritera/UX specjalistę.  

Podsumowanie: wprowadź prostą regułę „Informacyjne = opisz, Dekoracyjne = alt=''”, użyj tej checklisty jako kroków w zadaniach, a jeśli trzeba — odwołaj się do oficjalnych wytycznych [W3C alt guide](https://www.w3.org/WAI/alt/). [([w3.org](https://www.w3.org/WAI/alt/?utm_source=openai))](https://www.w3.org/WAI/alt/?utm_source=openai)
