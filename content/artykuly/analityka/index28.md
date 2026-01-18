---
title: "Eksperymenty before/after: jak mierzyć zmiany, gdy nie możesz zrobić A/B"
slug: eksperymenty-before-after-jak-mierzyc-zmiany-gdy-nie-mozesz-zrobic-a-b
path: /analityka/eksperymenty-before-after
template: default
draft: false
date: "2026-01-14"
hero:
  heading: "Eksperymenty before/after: wiarygodne alternatywy dla A/B testów"
  subheading: Kiedy losowanie nie wchodzi w grę — proste reguły, jak uzyskać sensowną
    miarę efektu
seo:
  title: Eksperymenty before/after — alternatywy dla A/B testów i kiedy je stosować
  description: Praktyczny przewodnik po before/after, difference‑in‑differences i
    innych metodach pomiaru efektu, gdy nie możesz przeprowadzić A/B testu.
  keywords:
  - before after
  - difference-in-differences
  - A/B testing alternatywy
  - analityka
meta:
  summaryBullets:
  - "Werdykt: krótko i konkretnie — kiedy before/after wystarczy, kiedy potrzebujesz\
    \ DID"
  - "Dla kogo: produkt, growth, analityka w firmach bez możliwości losowania"
  - "Start: pierwszy krok w 5 minut i co sprawdzić w danych"
  primaryCta:
    label: Przeczytaj o Difference‑in‑Differences
    href: https://www.publichealth.columbia.edu/research/population-health-methods/difference-difference-estimation
  updatedAt: "2026-01-14"
  author: Redakcja
  duration: 5 min
  hasAffiliateLinks: false
taxonomy:
  categories:
  - analityka
  - metody
  tags:
  - before-after
  - DID
  - eksperymenty
---

## Obietnica i do kogo to jest

Obietnica: dostaniesz jasne reguły, kiedy zrobić prosty before/after, a kiedy potrzebujesz bardziej złożonej metody (np. difference‑in‑differences). Ten tekst jest dla product managerów, analityków i growth‑managerów, którzy nie mogą losować użytkowników, ale chcą mierzyć zmianę.

## Kilka szybkich pytań i natychmiastowy kierunek

- Czy masz grupę porównawczą, która nie dostała zmiany? **Tak → rozważ DID.**  
- Masz tylko jedną serię danych przed i po, bez kontroli? **Tak → before/after, ale z dużymi zastrzeżeniami.**  
- Dane są niestabilne w czasie (sezonowość, trend)? **Nie ryzykuj prostego before/after → użyj przerwanych szeregów czasowych lub DID.**

## Czym jest before/after i skąd bierze się problem

Before/after to najprostsza metoda: mierzysz metrykę przed zmianą i po niej — różnica to efekt. Problem: w czasie może dziać się wiele innych rzeczy (trend, sezonowość, kampanie marketingowe). Dlatego analityka społeczna/econometrics stosuje quasi‑eksperymenty, np. **Difference‑in‑Differences (DID)** — technikę, która porównuje zmianę u grupy, która dostała interwencję, z równoczesną zmianą u grupy kontrolnej, dzięki czemu odfiltrowuje wspólne trendy. Praktyczne wprowadzenie do DID znajdziesz na stronie [Columbia Public Health](https://www.publichealth.columbia.edu/research/population-health-methods/difference-difference-estimation). ([[publichealth.columbia.edu](https://www.publichealth](https://www.publichealth.columbia.edu/research/population-health-methods/difference-difference-estimation?utm_source=openai).columbia.edu/research/population-health-methods/difference-difference-estimation?utm_source=openai))

### Co to znaczy "grupa porównawcza" w praktyce
Grupa porównawcza to użytkownicy lub segment, którzy nie doświadczyli zmiany, ale byli podobni przed interwencją. W praktyce możesz użyć regionu geograficznego, kohorty czasowej lub segmentu produktowego.

## Jak zacząć w 5 minut (praktyczna ścieżka)
1. Wyciągnij kluczową metrykę na tydzień/dzień przed i po zmianie (miarka spójna).  
2. Sprawdź trend: rysunek linii metryki 6–8 punktów przed i po.  
3. Znajdź candidate kontrolny: inny region/segment, który nie dostał zmiany.  
4. Policzyj prosty before/after i porównaj z różnicą w grupie kontrolnej (DID).  
5. Zrób sanity check: czy przed zmianą oba segmenty miały podobny trend? Jeśli nie — wynik będzie podejrzany.  

Jeśli nie masz grupy kontrolnej, zapisz to jawnie i traktuj wynik jako opisowy, nie przyczynowy.

## Fakt → Skutek → Werdykt (metody najczęściej używane)

Fakt: prosty before/after jest najszybszy i wymaga najmniej danych.  
Skutek: łatwo dostać mylne wnioski, jeśli poza testem wydarzy się coś jeszcze.  
Werdykt: **Użyj before/after tylko jako wstępne wskazanie; nie ogłaszaj sukcesu na jego podstawie.**

Fakt: DID wymaga grupy kontrolnej i zakłada równoległe trendy przed interwencją. ([[dimewiki.worldbank.org](https://dimewiki.worldbank](https://dimewiki.worldbank.org/Difference-in-Differences?utm_source=openai).org/Difference-in-Differences?utm_source=openai))  
Skutek: jeśli założenie jest spełnione, DID daje znacznie bardziej wiarygodną estymację wpływu.  
Werdykt: **DID to domyślny wybór, kiedy masz porównywalną grupę i dane przed interwencją.**

Fakt: gdy masz długie szeregi czasowe, interrupted time series (ITS) kontroluje trend i sezonowość.  
Skutek: ITS może wykryć natychmiastowe i długofalowe zmiany, ale wymaga wystarczająco dużo punktów przed i po.  
Werdykt: **ITS jest lepsze niż before/after, gdy masz historyczne dane sięgające kilku okresów przed zmianą.**

Fakt: jakościowe metody (ankiety, wywiady) nie dają efektu przyczynowego, ale uzupełniają liczby. ([[userpilot.com](https://userpilot.com/blog](https://userpilot.com/blog/alternatives-to-ab-testing/?utm_source=openai)/alternatives-to-ab-testing/?utm_source=openai))  
Skutek: szybkie feedbacky pomagają wyjaśnić mechanizm zmiany.  
Werdykt: **łącz liczby z jakościowymi insightami; same ankiety nie zastąpią kontroli statystycznej.**

## Tabela: szybkie porównanie metod

| Metoda | Kiedy działa | Mini‑werdykt |
| --- | --- | --- |
| Before/After | brak kontroli, szybka weryfikacja | **Tylko wstęp** |
| Difference‑in‑Differences | masz kontrolę, podobny trend przed | **Zalecane** |
| Interrupted Time Series | długie szeregi, stabilne punkty przed | **Silne gdy dane są** |
| Matching / PSM | gdy kontrola jest inna, potrzeba wyrównania cech | **Użyteczne z ostrożnością** |

## Typowe problemy i jak je wykryć

- Nieregularne próbkowanie danych — sprawdź, czy metryka mierzona jest tak samo przed i po.  
- Niespełnione założenie „parallel trends” w DID — zrób test placebo (porównaj wcześniejsze okresy). ([[dimewiki.worldbank.org](https://dimewiki.worldbank](https://dimewiki.worldbank.org/Difference-in-Differences?utm_source=openai).org/Difference-in-Differences?utm_source=openai))  
- Zewnętrzne zmienne (kampania marketingowa, awaria) — przekaż w raporcie listę wydarzeń, które mogły wpłynąć.  

Jeżeli nie możesz szybko potwierdzić, czy założenia są spełnione, napisz o tym jawnie i zaproponuj dodatkowe analizy (placebo, różne okna czasowe, sensitivity).

## Plusy, minusy i typowe skargi po wdrożeniach

Plusy:
- Szybkie before/after daje natychmiastowy sygnał.  
- DID poprawia wiarygodność bez losowania.  
- ITS pokazuje dynamikę efektu w czasie.

Minusy / skargi:
- Często brak wystarczającej liczby punktów przed zmianą.  
- Trudność w znalezieniu prawdziwie porównywalnej grupy.  
- Rezultaty bywają polityczne: różne zespoły interpretują te same liczby inaczej.

Synteza: **Jeśli możesz zebrać dane historyczne i znaleźć przyzwoitą grupę kontrolną — zacznij od DID. Jeśli masz tylko jednorazowy before/after — traktuj wynik jako hipotezę do dalszego testowania.**

## Przykładowy workflow po decyzji (krótko)
1. Zidentyfikuj metrykę główną i horyzont (np. 30 dni przed/po).  
2. Wybierz metodę (before/after → DID → ITS).  
3. Przedstaw wyniki z testami sanity (parallel trends, placebo).  
4. Udokumentuj ograniczenia i zaplanuj kolejny krok: randomizacja albo kolejny pomiar.

## Źródła i dalsza lektura
- Strona z praktycznym opisem **Difference‑in‑Differences** na Columbia Public Health. (Przydatne do zrozumienia założeń i testów). ([[publichealth.columbia.edu](https://www.publichealth](https://www.publichealth.columbia.edu/research/population-health-methods/difference-difference-estimation?utm_source=openai).columbia.edu/research/population-health-methods/difference-difference-estimation?utm_source=openai))  
- Przewodnik DIME o DID — konkretne wskazówki implementacyjne. ([[dimewiki.worldbank.org](https://dimewiki.worldbank](https://dimewiki.worldbank.org/Difference-in-Differences?utm_source=openai).org/Difference-in-Differences?utm_source=openai))  
- Artykuł o alternatywach do A/B testów (ankiety, beta, feature flags). ([[userpilot.com](https://userpilot.com/blog](https://userpilot.com/blog/alternatives-to-ab-testing/?utm_source=openai)/alternatives-to-ab-testing/?utm_source=openai))

## Krótka puenta — co zrobić teraz

**Idealne dla ciebie:** masz dane z okresu przed zmianą i możesz znaleźć porównywalną grupę → **zrób DID**.  
**Będzie frustrować:** masz tylko pojedynczy pomiar przed i po i brak kontekstu → wyniki będą mało wiarygodne; zamiast ogłaszać sukces, zaplanuj dalsze testy.  
Prosty next step: otwórz wykres metryki 6–8 punktów przed i po oraz sprawdź, czy możesz wskazać kontrolę — jeśli tak, zacznij od DID ([przewodnik Columbia](https://www.publichealth.columbia.edu/research/population-health-methods/difference-difference-estimation)). ([[publichealth.columbia.edu](https://www.publichealth](https://www.publichealth.columbia.edu/research/population-health-methods/difference-difference-estimation?utm_source=openai).columbia.edu/research/population-health-methods/difference-difference-estimation?utm_source=openai))
