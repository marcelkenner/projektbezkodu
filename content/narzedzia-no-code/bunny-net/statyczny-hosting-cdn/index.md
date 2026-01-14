---
title: >-
  Statyczny hosting + CDN na bunny.net: najszybsza droga do globalnie szybkiej
  strony bez serwera
slug: statyczny-hosting-cdn
path: /narzedzia/bunny-net/statyczny-hosting-cdn/
draft: false
template: default
type: poradnik
date: '2026-01-02'
hero:
  heading: Statyczny hosting + CDN na bunny.net
  subheading: >-
    Masz stronę statyczną (Hugo, Astro, Next.js export, Vite)? bunny.net pozwala
    ją hostować i serwować z CDN w modelu „wrzuć pliki i działa” — bez serwera,
    bez platformowych sztuczek.
  primaryCta: Przetestuj bunny.net
  secondaryCta: Zobacz recenzję Bunny.net
  image:
    src: /img/article_image.jpeg
    alt: Abstrakcyjna wizualizacja danych i dashboardów na tle jeziora
seo:
  title: >-
    Statyczny hosting i CDN na bunny.net — jak wdrożyć krok po kroku (Edge
    Storage + Pull Zone)
  description: >-
    Konkretny przewodnik: jak hostować stronę statyczną na bunny.net, podpiąć
    CDN, własną domenę, SSL, cache i 404/SPА. Bez lania wody.
  keywords:
    - bunny.net
    - BunnyCDN
    - Edge Storage
    - hosting statyczny
    - CDN
    - strona statyczna
  canonical: /narzedzia/bunny-net/statyczny-hosting-cdn/
  image: /images/narzedzia/bunny-net/statyczny-hosting-cdn-og.png
meta:
  difficulty: Średni
  duration: 20–45 min
  tools:
    - bunny.net
    - FTP (opcjonalnie)
    - CI/CD (opcjonalnie)
  author: Redakcja
  updatedAt: '2026-01-02'
  hasAffiliateLinks: false
  primaryCta:
    label: Załóż konto w bunny.net
    href: https://bunny.net/
  secondaryCta:
    label: Przejdź do recenzji bunny.net
    href: /narzedzia/bunny-net/recenzja/
  format: Poradnik
  topics:
    - Hosting statyczny
    - CDN
    - DevOps
  summaryBullets:
    - Wrzuć build do Edge Storage
    - Podepnij Pull Zone jako CDN i cache
    - Ustaw własną domenę (CNAME) i SSL
    - Zautomatyzuj deploy + purge
  lessons:
    - Kiedy bunny.net ma sens jako hosting statyczny
    - Jak ustawić domenę i cache, żeby było szybko i stabilnie
    - Jak ogarnąć 404 i routing dla SPA bez bólu
taxonomy:
  categories:
    - Narzędzia
    - CDN
  tags:
    - bunny.net
    - bunnycdn
    - edge storage
    - hosting statyczny
    - devops
---

## Werdykt: bunny.net to świetny „hosting statyczny + CDN”, jeśli umiesz dowieźć build

Jeśli jesteś w teamie: freelancer/mała agencja/marketing z własnym devem i stawiasz strony, które mają po prostu ładować się szybko wszędzie — bunny.net jest bardzo mocnym układem. Dostajesz magazyn na pliki + CDN, a resztę (build i wrzucenie plików) robisz Ty.

Jeśli oczekujesz platformy „kliknij i masz preview, formularze, funkcje, SSR i magiczne deploye” — wtedy szybciej dogadasz się z Netlify/Vercel/Cloudflare Pages. bunny.net nie próbuje udawać, że jest PaaS. I to jest jego uczciwa przewaga.

Shareable one-liner: bunny.net wygrywa jako proste „wrzuć statyczne pliki + daj je przez CDN”, ale nie zastąpi platformy aplikacyjnej.

## Co dokładnie budujesz na bunny.net

W praktyce składasz to z dwóch klocków:

Pierwszy to magazyn na pliki (Edge Storage / Bunny Storage), gdzie trzymasz wygenerowany build strony: HTML, CSS, JS, obrazy, fonty.

Drugi to CDN w postaci [Pull Zone](https://support.bunny.net/hc/en-us/articles/207790269-How-to-create-your-first-Pull-Zone), które bierze te pliki jako origin, cachuje je na edge i wystawia pod publicznym adresem (na start zwykle w domenie b-cdn.net). Jeśli chcesz wyglądać profesjonalnie, podpinasz własną domenę typu cdn.twojadomena.pl albo nawet root domenę.

Ważny szczegół, który oszczędza czas: pliki w storage nie są z definicji publiczne. Publiczne dostarczanie robisz przez połączenie storage z CDN ([deliver files from Bunny Storage](https://support.bunny.net/hc/en-us/articles/8561433879964-How-to-access-and-deliver-files-from-Bunny-Storage)).

## Dla kogo to jest „oczywisty wybór”, a dla kogo nie

To jest dla Ciebie, jeśli:
Masz stronę statyczną lub możesz ją wystawić jako statyczną (np. marketing site, dokumentacja, landing, blog statyczny). Chcesz kontrolować cache i koszty, a nie żyć w platformowych limitach. Lubisz prostą architekturę: pliki + CDN.

To zacznie Cię irytować, jeśli:
Twoja strona jest dynamiczna i opiera się na SSR, funkcjach edge/serverless i preview per branch. Albo jeśli nie chcesz dotykać deploymentu w ogóle.

## Jak zacząć: szybka ścieżka, która działa w realnym życiu

Poniżej jest proces, który stosujemy najczęściej przy stronach marketingowych i dokumentacji. Daje stabilność, łatwy deploy i dobrą wydajność.

### Przygotuj build strony

Najpierw wygeneruj statyczny build lokalnie lub w CI:
Hugo/Astro/Eleventy: generujesz katalog /dist lub /public.
Next.js: używasz eksportu statycznego (jeśli pasuje do projektu).
Ważne: w finalnym katalogu ma być index.html i wszystkie assety, które do niego prowadzą.

### Utwórz Storage Zone i wrzuć pliki

Storage możesz obsłużyć na dwa proste sposoby:

1) FTP, jeśli chcesz „po ludzku” wrzucać pliki i szybko debugować (bunny opisuje bezpośredni dostęp FTP do Edge Storage: [FTP docs](https://docs.bunny.net/docs/edge-storage-ftp)).

2) API/automatyzacja, jeśli to ma być powtarzalne i bezklikalne (jest endpoint do uploadu plików: [Upload File](https://docs.bunny.net/reference/put_-storagezonename-path-filename)).

Minimalny cel: wrzuć index.html oraz katalogi z assetami, zachowując strukturę ścieżek.

### Połącz Storage z CDN: utwórz Pull Zone na Storage Zone

To jest moment, w którym „hosting” zaczyna działać dla użytkowników.

W panelu tworzenia Pull Zone wybierasz origin typu Storage Zone (to normalna opcja, nie hack). Wtedy CDN będzie uwierzytelniać się do storage, pobierać pliki i je cachować na edge ([opis origin typu Storage Zone w tworzeniu Pull Zone](https://support.bunny.net/hc/en-us/articles/207790269-How-to-create-your-first-Pull-Zone)).

Po utworzeniu dostajesz adres w stylu twojazona.b-cdn.net. Sprawdź:
- https://twojazona.b-cdn.net/ powinno zwrócić Twoją stronę,
- https://twojazona.b-cdn.net/assets/app.css powinno zwrócić asset.

Jeśli to działa, jesteś praktycznie gotowy.

### Podepnij własną domenę (i zrób to poprawnie)

Własna domena robi dwie rzeczy:
lepiej wygląda i lepiej działa z cookies/subdomenami (mniej przypadkowych problemów po stronie przeglądarki).

Proces jest prosty: dodajesz hostname w Pull Zone, bierzesz rekord CNAME i ustawiasz go w DNS ([custom CDN hostname — instrukcja krok po kroku](https://support.bunny.net/hc/en-us/articles/207790279-How-to-set-up-a-custom-CDN-hostname)). Jeśli używasz Cloudflare, nie włączaj proxy na tym rekordzie — to częsty powód, że „nie działa, a powinno”.

### Ustaw sensowne cache (żeby było szybko, ale nie „wiecznie zepsute”)

Najzdrowsza zasada dla stron statycznych:
- HTML: krótszy cache (albo kontrolowany), bo to on się zmienia przy każdej publikacji.
- Assety wersjonowane (np. app.8f3c1.css): długi cache, bo ich nazwy zmieniają się przy deployu.

Jeśli Twój generator robi fingerprinting nazw plików — masz łatwo. Jeśli nie robi, rozważ wdrożenie tego, bo to jest najtańszy „speed upgrade”, jaki istnieje.

Gdy potrzebujesz sterowania na poziomie reguł, bunny ma Edge Rules, które potrafią m.in. zmieniać origin URL i nagłówki. To jest przydatne, gdy chcesz dopiąć cache dokładnie pod swój schemat wersjonowania ([Edge Rules variable expansion](https://docs.bunny.net/docs/edge-rules-variable-expansion), [kolejność wykonywania reguł](https://docs.bunny.net/docs/edge-rules-ordering)).

### Ogarnij 404 i (jeśli trzeba) routing SPA

Dla klasycznej strony wielostronicowej wystarczy porządna strona 404. bunny pozwala ustawić własny 404 w storage przez folder bunnycdn_errors i plik 404.html ([custom 404 dla storage zone](https://support.bunny.net/hc/en-us/articles/360000332631-How-do-I-configure-a-custom-404-page-for-my-storage-zone)).

Dla SPA (React/Vue z routerem po stronie klienta) potrzebujesz innego zachowania: wejście na /cennik nie może kończyć się „twardym 404 z serwera”, tylko powinno wrócić index.html, a routing przejmie aplikacja.

Nie będziemy tu udawać, że istnieje jeden magiczny przełącznik, który działa identycznie w każdym setupie. Najczęściej robi się to Edge Rules (np. przepisywanie żądań bez rozszerzenia na /index.html) i testuje na Twoich ścieżkach. Jeśli masz nietypowe reguły routingu, poświęć 15 minut na testy w przeglądarce i w logach — to się zwraca.

Uwaga praktyczna: jeśli używasz narzędzi społecznościowych typu Bunny Launcher, one potrafią automatyzować SPA fallback, ale to nie jest oficjalny projekt bunny.net (to wyraźnie opisane w dokumentacji narzędzia). Traktuj to jako opcję „dla ludzi od CI”, nie jako fundament.

### Zautomatyzuj deploy: upload + purge i masz święty spokój

Jeśli publikujesz częściej niż raz na miesiąc, ręczne wrzucanie plików szybko zaczyna być karą.

Najprostszy automatyczny schemat wygląda tak:
CI buduje /dist → wrzuca pliki do storage przez API → robi purge cache na Pull Zone (bunny udostępnia operacje przez API, więc da się to zapiąć czysto w pipeline).

Jeśli chcesz zacząć bez bólu: zrób najpierw manualny deploy i upewnij się, że wszystko działa. Dopiero potem automatyzuj. To jest najszybsza droga do stabilnego procesu.

## Bezpieczeństwo: kiedy musisz się tym przejąć

Dla publicznej strony marketingowej zwykle nie ma dramatu.

Ale jeśli serwujesz pliki, które nie powinny krążyć publicznie (np. płatne materiały), bunny ma mechanizmy typu tokenizacja URL ([Token authentication](https://docs.bunny.net/docs/cdn-token-authentication-basic)). Wtedy kontrolujesz, kto i jak długo ma dostęp.

To nie jest „miły dodatek”. To jest różnica między kontrolowanym delivery a „ktoś wklei link na forum i masz problem”.

## Limity i rzeczy, które psują dzień

Edge Storage jest projektowane pod skalę, ale są praktyczne granice zdrowego rozsądku: liczba plików w katalogu, rozmiary, porządek w strukturze. bunny opisuje zalecenia (np. limity plików na katalog i rozmiar pliku) w dokumentacji storage ([Understanding Bunny Storage](https://support.bunny.net/hc/en-us/articles/360020488800-Understanding-Bunny-Storage)).

W praktyce:
Zrób wersjonowanie assetów, trzymaj porządek w katalogach, nie wrzucaj 200 tysięcy plików do jednego folderu — i wszystko działa latami.

## Podsumowanie: kiedy to jest „tak”, a kiedy „nie”

Jeśli budujesz strony statyczne i chcesz, żeby były szybkie globalnie, bunny.net jest jednym z najbardziej sensownych zestawów: storage + CDN, bez platformowego teatru.

Kto będzie zachwycony:
Freelancerzy i małe agencje od stron marketingowych, dokumentacji i blogów statycznych. Zespoły, które chcą prosto kontrolować cache i koszty. Ludzie, którzy wolą przewidywalną infrastrukturę niż „czary z deployem”.

Kto powinien wybrać coś innego:
Zespoły, które żyją z preview per branch, SSR i funkcji serverless. Projekty, które nie są w stanie dowieźć własnego pipeline’u, bo „to ma się samo”.

Najprostszy pierwszy krok:
Wrzuć jeden katalog z buildem do storage, podepnij Pull Zone, odpal stronę na b-cdn.net. Jak to kliknie w 5 minut, to znaczy, że to jest Twój kierunek.
