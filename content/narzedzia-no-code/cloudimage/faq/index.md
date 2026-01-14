---
title: Cloudimage FAQ
slug: faq
path: /narzedzia/cloudimage/faq
template: default
type: tool
date: '2026-01-07'
seo:
  title: >-
    Cloudimage FAQ: odpowiedzi na najczęstsze pytania (wdrożenie, cache,
    bezpieczeństwo, ceny)
  description: >-
    Praktyczne FAQ o Cloudimage: jak działa podmiana URL, cache i invalidation,
    WebP/JPG/PNG, WordPress i Next.js, CNAME+SSL, bezpieczeństwo tokena, GDPR,
    limity i koszty.
  keywords:
    - Cloudimage
    - CDN obrazów
    - optymalizacja obrazów
    - cache invalidation
    - WebP
    - WordPress
    - Next.js
meta:
  format: faq
  updatedAt: '2026-01-07'
  hasAffiliateLinks: false
  topics:
    - performance
    - obrazy
    - cdn
    - seo
  summaryBullets:
    - >-
      Cloudimage działa przez podmianę URL i transformacje „w locie” – nie
      musisz ręcznie produkować miniatur.
    - >-
      Cache nie odświeży się sam, gdy podmienisz plik u źródła – użyj zmiany URL
      (np. parametr vh) albo invalidation.
    - >-
      Największe koszty robi CDN traffic i liczba unikalnych wariantów, które
      generujesz w szablonach.
taxonomy:
  categories:
    - Narzędzia
  tags:
    - Cloudimage
    - CDN
    - Optymlizacja obrazów
    - Web Performance
hero:
  heading: Cloudimage FAQ
  subheading: Wpis roboczy w katalogu narzędzi; pełną treść dodamy przed publikacją.
  image:
    src: /img/article_image.jpeg
    alt: Abstrakcyjna wizualizacja danych i dashboardów na tle jeziora
---

Cloudimage jest narzędziem, które ma działać „bez dramatu”: podmieniasz URL-e obrazów, dodajesz parametry w linku i nagle strona ładuje się szybciej. I to jest prawda. Ale większość pytań pojawia się dopiero przy dwóch tematach: **cache** i **bezpieczeństwo tokena**.

Jeśli chcesz najszybszy start bez grzebania w ciemno:
- Załóż test (trial) i przepuść przez Cloudimage 20–50 najczęściej oglądanych obrazów.
- Od razu ustal strategię odświeżania (vh / invalidation), bo inaczej będziesz „gasić pożary”.
- Ustal jeden standard parametrów (preset/rule), żeby zespół nie generował przypadkowych wariantów URL.

## Czy Cloudimage to CDN czy optymalizator obrazów?

To jedno i drugie, w praktyce w jednym workflow: **CDN + transformacje i kompresja**. CDN przyspiesza dostarczanie globalnie i trzyma kopie na edge, a Cloudimage robi resizowanie/kompresję „w locie” i też to cache’uje. Z punktu widzenia strony: dostajesz szybsze ładowanie i mniej roboty operacyjnej. Z punktu widzenia wdrożenia: nadal musisz pilnować cache’owania i wersjonowania zasobów (bo CDN nie zgadnie, że plik u źródła się zmienił). Zobacz opis działania cache i odświeżania w [CDN basics](https://docs.cloudimage.io/caching-and-acceleration/cdn-basics).

## Czy muszę przenosić obrazy do Cloudimage, żeby to działało?

Nie. Typowy scenariusz to „origin” (Twoje obecne miejsce: serwer, bucket, CMS) + Cloudimage jako warstwa dostarczania. W praktyce: **zostawiasz pliki tam, gdzie są, a zmienia się sposób ich serwowania**.

Jeśli jednak chcesz mieć porządek „w jednym miejscu”, Cloudimage ma też opcje związane z przechowywaniem (cloud storage / asset library), ale to jest decyzja organizacyjna, nie wymóg techniczny. Informacje o storage są częścią nowych planów na stronie [new plans & pricing](https://www.cloudimage.io/new-q3-2025).

## Jakie formaty plików mogę wrzucić jako „origin”?

Cloudimage wspiera długą listę formatów wejściowych (origin), w tym m.in. PSD, AVIF, BMP, GIF, HEIC, ICO, JPG/JPEG2000, PDF, PNG, SVG, TIFF, WebP. Pełną listę masz w [Input formats](https://docs.cloudimage.io/transformations/input-formats).

Wniosek praktyczny: jeśli pracujesz w e-commerce i dostajesz od dostawców „dziwne” pliki (HEIC, TIFF, czasem PDF), Cloudimage zwykle to ogarnie bez dodatkowej konwersji po Twojej stronie.

## Jakie formaty Cloudimage realnie dostarcza użytkownikowi?

W dokumentacji formatów wyjściowych masz klasykę: JPG, PNG, WebP i opcję trzymania „oryginału” (tam, gdzie ma to sens). Zobacz [Image formats](https://docs.cloudimage.io/transformations/image-compression/image-formats).

Co ważne: w dokumentacji pojawia się wątek WebP w dwóch miejscach i brzmi to lekko niespójnie (jedna część mówi o aktywacji w panelu, a inna o „domyślnie najszybszym formacie”). Bez filozofii: **masz kontrolę** przez ustawienia w konsoli i przez parametr `force_format`, więc możesz to ustawić tak, żeby zachowywało się przewidywalnie.

## Jak sterować jakością i kompresją?

Najprościej:
- `q=0..100` – jakość/kompresja (im niżej, tym lżej, ale bardziej widać straty).
- `optipress=1..3` – algorytm Optipress dobierający kompresję pod „wizualnie OK”.
- `force_format=jpg/png/webp/original` – wymuszenie formatu wyjściowego.

To są konkrety z dokumentacji [Image formats](https://docs.cloudimage.io/transformations/image-compression/image-formats).

Praktyczny werdykt: dla większości sklepów i landingów startowe ustawienie typu **q ~ 80–90** plus WebP tam, gdzie ma sens, daje świetny kompromis. Jeśli sprzedajesz produkt premium i zdjęcia są „święte”, trzymaj wyższe q i testuj na kilku kluczowych produktach, a nie na całym katalogu w ciemno.

## Czy muszę generować miniatury i warianty ręcznie?

Nie, to jest właśnie sens Cloudimage: generujesz warianty parametrami w URL, a system je cache’uje. Ale jest haczyk, o którym ludzie uczą się późno: **każdy unikalny URL to potencjalnie nowy wariant do wygenerowania i trzymania w cache**.

Wniosek: jeśli w projekcie 5 osób zacznie „na oko” dopisywać parametry, zrobisz chaos. Dlatego warto od razu ustalić standardy przez [Presets](https://docs.cloudimage.io/setup/shortening-urls/presets) i [Rules](https://docs.cloudimage.io/setup/shortening-urls/rules).

## Jak odświeżyć obraz, gdy podmieniłem plik u źródła?

Masz dwa sensowne podejścia:

Pierwsze (najprostsze): zmieniasz URL, żeby wymusić świeży fetch. Dokumentacja pokazuje to przez dodanie parametru wersji, np. `vh=xx`, żeby URL był unikalny i cache się przebudował: [CDN basics](https://docs.cloudimage.io/caching-and-acceleration/cdn-basics).

Drugie (bardziej „systemowe”): robisz invalidation. W panelu albo przez API usuwasz z cache wskazany obraz (albo całość — ostrożnie). Zobacz [Invalidation API](https://docs.cloudimage.io/caching-and-acceleration/invalidation-api).

Mocny wniosek: jeśli masz CMS lub PIM, gdzie pliki podmieniają się „pod tym samym adresem”, to **vh albo invalidation to nie opcja, tylko obowiązek**. Inaczej użytkownicy będą widzieć stare zdjęcia mimo że „u Ciebie już jest nowe”.

## Czym się różni invalidation „original” vs „all” i kiedy używać którego?

„Original” czyści wskazane URL-e źródłowe. „All” czyści całą pamięć podręczną dla tokena i zmusza Cloudimage do pobrania wszystkiego na nowo.

To działa, ale ma koszt: po „all” pierwsze wejścia są wolniejsze, bo cache się odbudowuje. Dokumentacja mówi to wprost w kontekście invalidation: [Invalidation API](https://docs.cloudimage.io/caching-and-acceleration/invalidation-api) i opis w [CDN basics](https://docs.cloudimage.io/caching-and-acceleration/cdn-basics).

Werdykt: „all” traktuj jak gaśnicę. „Original” + wersjonowanie URL to codzienna higiena.

## Czy da się ustawić TTL/cache per obraz?

Tak — dokumentacja opisuje parametr `ci_cache=X` (sekundy), który nadpisuje `max-age` i `s-maxage` dla konkretnego zasobu. Zobacz [Caching interval](https://docs.cloudimage.io/caching-and-acceleration/caching-interval).

W praktyce: to jest przydatne, jeśli masz część obrazów „prawie stałych” (logo, UI) i część „często zmienianych” (banery). Możesz im nadać różne zachowanie bez przebudowy całej infrastruktury.

## Po co mi Warmup API i kiedy to ma sens?

Warmup API jest po to, żeby **nie czekać na pierwszy request użytkownika**, tylko wcześniej wygenerować i zcache’ować warianty. Cloudimage rekomenduje warmup m.in. przy starcie nowej kolekcji tysięcy/milionów obrazów, przy uploadzie, przy bardzo dużych plikach (np. duże GIF-y), albo gdy „first load” też ma być szybki: [Warmup API](https://docs.cloudimage.io/caching-and-acceleration/warmup-api).

Werdykt: jeśli robisz premierę sklepu / kampanii i wiesz, że w pierwszej godzinie wpadnie ruch, warmup to jest różnica między „wow, szybko” a „czemu pierwszym ludziom muli”.

## Jak zabezpieczyć token, żeby ktoś nie robił mi transformacji „za darmo”?

Są dwa filary:

Pierwszy: whitelist domen źródłowych (origin). Wtedy Cloudimage nie będzie fetchował obrazów z dowolnego internetu. Zobacz [Domain whitelisting](https://docs.cloudimage.io/setup/security/token-security/domain-whitelisting).

Drugi: podpisywanie URL-i (HMAC). Cloudimage opisuje „URL signature” jako SHA-1 HMAC, a po włączeniu **wszystkie niepodpisane URL-e przestają działać**. Zobacz [URL signature](https://docs.cloudimage.io/setup/security/token-security/url-signature) oraz temat „sealing” jeśli chcesz chronić tylko część parametrów: [URL sealing](https://docs.cloudimage.io/setup/security/token-security/url-sealing).

Mocny wniosek: jeśli jesteś e-commerce z ruchem płatnym i publicznymi adresami obrazów, to brak zabezpieczeń to proszenie się o kłopoty. Nie zawsze się wydarzy, ale jak się wydarzy, boli.

## Czy Cloudimage wspiera własną domenę (CNAME) i SSL?

Tak — w nowych planach masz „Custom CNAME with SSL certificate” (np. Essential: 1 CNAME + SSL, Grow: 2, Scale: 5). Szczegóły są na stronie [new plans & pricing](https://www.cloudimage.io/new-q3-2025).

W praktyce: własna domena daje porządek, łatwiejsze polityki bezpieczeństwa i „bardziej premium” setup (szczególnie gdy nie chcesz obcego hosta w adresach zasobów).

## WordPress: czy jest wtyczka i jak to działa?

Tak, i tu warto być precyzyjnym: oficjalna dokumentacja opisuje wtyczkę Scaleflex VXP dla WordPress oraz dwa tryby:
- JavaScript Mode (m.in. lazy loading, generowanie `srcset` przez `ci-src` i integracja z biblioteką responsive)
- Standard Mode (podmiana `src` bez JS)

To masz opisane w [Wordpress](https://docs.cloudimage.io/implementation/cms-plugins/wordpress), a sama biblioteka responsive jest na GitHubie: [js-cloudimage-responsive](https://github.com/scaleflex/js-cloudimage-responsive).

Ważny detal z praktyki: na WordPress.org widać też starszą wtyczkę „Cloudimage Responsive Plugin”, ale jest oznaczona jako legacy i nieutrzymywana. Jeśli zaczynasz dziś, trzymaj się aktualnego kierunku (Scaleflex VXP). Zobacz listing: [Cloudimage Responsive Plugin (legacy)](https://wordpress.org/plugins/cloudimage-responsive/).

## Next.js / React: czy da się to sensownie zintegrować?

Tak, ale podejście zależy od tego, jak bardzo chcesz „natywnie” iść w ekosystem Next.

Jeśli chcesz najprościej: używasz zwykłych `img` (albo własnego komponentu) i generujesz URL-e Cloudimage z parametrami + `srcset`. Jeśli chcesz iść bardziej „nextowo”, Cloudimage ma dedykowaną bibliotekę dla Next: [next-cloudimage-responsive](https://github.com/scaleflex/next-cloudimage-responsive).

Werdykt: dla zespołu marketingowego i prostych stron firmowych najczęściej wygrywa prostota (URL + srcset). Dla aplikacji produktowych, gdzie i tak masz komponenty UI i pipeline obrazów, biblioteka Next potrafi skrócić czas wdrożenia.

## Czy Cloudimage obsługuje też „nie-obrazy”, np. CSS/JS przez CDN?

Tak — dokumentacja opisuje tryb proxy dla static content (np. `func=proxy`), żeby serwować pliki typu CSS/JS przez CDN Cloudimage: [Static content](https://docs.cloudimage.io/transformations/static-content).

Uczciwy werdykt: to jest wygodne jako „bonus”, ale jeśli masz już poukładany CDN pod statyczne assety, nie rób rewolucji tylko po to, żeby „wszystko było w jednym”.

## Co oznacza „Visual Operations credits” i czy to wpływa na koszty?

To są kredyty na operacje AI i wideo (np. background removal, auto-tagging, smart alt text, transkodowanie wideo per sekunda). Tabela w dokumentacji mówi też wprost, że kredyty są ważne 12 miesięcy i że wartości mogą się zmieniać wraz z kosztem modeli: [Usage](https://docs.cloudimage.io/account-management/usage).

Wniosek: klasyczna optymalizacja obrazów (resize/kompresja) to jedno, a AI/wideo to osobny budżet. Jeśli kupujesz Cloudimage „dla performance”, nie daj się rozproszyć bajerami — włączysz je dopiero, gdy masz policzony efekt.

## Jak wyglądają koszty i co zwykle „zjada” budżet?

W nowych planach masz pakiety (storage + CDN traffic + kredyty) i stawkę overuse za GB CDN. Przykładowo: Essential ma 100 GB CDN/mies. i $0.75/GB overuse, Grow $0.50/GB, Scale $0.25/GB. Szczegóły: [new plans & pricing](https://www.cloudimage.io/new-q3-2025).

Najczęstszy realny koszt to po prostu ruch (szczególnie, jeśli masz dużo obrazów w listingach produktów). Drugi koszt, o którym ludzie zapominają: generowanie zbyt wielu unikalnych wariantów URL w szablonach. Da się to opanować standardami (presets/rules).

## Czy Cloudimage jest zgodne z GDPR?

Scaleflex (firma stojąca za Cloudimage) deklaruje zgodność z GDPR w help center: [Are you EU GDPR compliant?](https://scaleflex.zendesk.com/hc/en-gb/articles/360009527919-Are-you-EU-GDPR-compliant). W globalnej polityce prywatności jest też opis podejścia do danych jako procesora, m.in. pseudonimizacja IP i możliwość usuwania danych związanych z obrazem z cache/serwerów/CDN poprzez mechanizmy invalidation: [Global Privacy Policy](https://legal-2024.scaleflex.com/privacy/global-privacy-policy).

Uczciwa rada: jeśli działasz w branży regulowanej albo masz duże compliance po stronie klienta, nie kończ tematu na „badge’u GDPR” — poproś o DPA i sprawdź warunki retencji danych w dokumentach prawnych.

## Dlaczego widzę placeholder Cloudimage zamiast mojego obrazka?

Najczęstszy powód jest banalny: origin nie został znaleziony (zły URL, problem z dostępem do serwera, błędna konfiguracja). Scaleflex ma do tego osobny artykuł z listą przyczyn: [default placeholder](https://scaleflex.zendesk.com/hc/en-gb/articles/4405756356370-Why-do-I-see-the-Cloudimage-default-placeholder-instead-of-my-images).

Werdykt: jeśli widzisz placeholder, to nie „Cloudimage nie działa”, tylko **Twoje źródło jest niedostępne lub źle wskazane**. To zwykle naprawia się w 10–20 minut po stronie konfiguracji domen/storage.

## Gdzie szukać kolejnego kroku, jeśli nadal się waham?

Jeśli jesteś na etapie decyzji, przejdź do:
- Recenzji: /narzedzia/cloudimage/recenzja/
- Cennika i opłacalności: /narzedzia/cloudimage/cennik/
- Alternatyw: /narzedzia/cloudimage/alternatywy/

A jeśli Cloudimage pasuje do Twojego scenariusza, zrób najprostszy test: odpal trial i podepnij jeden szablon/listing, gdzie obrazy realnie bolą performance. To najszybciej daje odpowiedź, czy „to jest to”.
