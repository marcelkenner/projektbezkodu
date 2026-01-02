---
title: "bunny.net FAQ – najczęstsze pytania o CDN, Storage i Optimizer"
slug: "faq"
path: "/narzedzia/bunny-net/faq"
template: "default"
type: "guide"
seo:
  title: "bunny.net FAQ: CDN, Storage, SSL, cache i rozliczenia – odpowiedzi bez lania wody"
  description: "Najczęstsze pytania o bunny.net: jak działa billing na kredyty, minimalny koszt, SSL na własnej domenie, purge cache, WordPress, Bunny Storage i Optimizer."
  keywords:
    - "bunny.net"
    - "Bunny CDN"
    - "CDN"
    - "Bunny Storage"
    - "Bunny Optimizer"
    - "purge cache"
    - "SSL"
    - "WordPress"
  canonical: "https://twojadomena.pl/narzedzia/bunny-net/faq/"
  image:
meta:
  updatedAt: "2026-01-02"
  hasAffiliateLinks: false
  format: "faq"
  topics:
    - "CDN"
    - "Wydajność stron"
    - "WordPress"
    - "Hosting statyczny"
taxonomy:
  categories:
    - "Narzędzia"
  tags:
    - "CDN"
    - "Performance"
    - "WordPress"
    - "DevOps"
---

Jeśli szukasz krótkich, twardych odpowiedzi: bunny.net to jedna z najbardziej „zdroworozsądkowych” platform edge dla stron i aplikacji. Płacisz za użycie, konfigurujesz raz, a potem po prostu dowozisz szybkie assety bez pilnowania serwerów.

Poniżej masz FAQ, które realnie rozwiązuje 90% wątpliwości przed wdrożeniem.

## Czym jest bunny.net i co faktycznie kupuję?

bunny.net to zestaw usług „edge”: CDN do cache’owania i serwowania plików, Storage do trzymania plików blisko użytkownika, Optimizer do automatycznej optymalizacji obrazów i zasobów, plus kilka dodatków (np. funkcje pod WordPress, wideo, DNS).

W praktyce: jeśli Twoja strona ma obrazy, CSS/JS, fonty i zależy Ci na czasie ładowania — CDN jest tym elementem, który najszybciej daje „odczuwalny” efekt.

## Dla kogo bunny.net jest sensowny?

bunny.net ma sens, jeśli jesteś w jednej z tych grup:
freelancer / agencja i stawiasz strony marketingowe, portfolio, blogi, landing page’e
e-commerce i chcesz przyspieszyć obrazy, miniatury, pliki statyczne
SaaS / aplikacja webowa i chcesz odciążyć origin z assetów oraz mieć prosty cache

Jeśli masz bardzo dynamiczny serwis i prawie wszystko jest personalizowane per użytkownik — CDN nadal pomoże na statycznych elementach, ale cudów na HTML nie obiecujemy. CDN jest najlepszy tam, gdzie da się cache’ować.

## Czy bunny.net ma okres próbny?

Tak — bunny.net komunikuje 14-dniowy trial w materiałach produktowych. Najprostszy ruch: załóż konto, podepnij jedną strefę (Pull Zone) i wrzuć na stronę 10–20 najcięższych assetów (obrazy, JS, CSS). To wystarczy, żeby zobaczyć różnicę w Lighthouse i w realnych odczuciach.

## Jak działa rozliczanie? Czy to jest abonament?

Model jest pre-paid i pay-as-you-go: doładowujesz konto kredytami, a usługi pobierają saldo w miarę użycia.

Kluczowe fakty, które ratują nerwy:
bunny.net ma minimalne rozliczenie $1/mies. jeśli masz aktywne strefy (liczy się na całe konto, nie per strefa)
musisz utrzymywać dodatnie saldo — przy braku doładowania konto i strefy mogą zostać zawieszone, a dane w Storage mogą zostać usunięte po kilku dniach (to nie jest „straszak”, tylko realny mechanizm działania)

Jeśli traktujesz stronę jako biznes, włącz automatyczne doładowanie i zapomnij o temacie.

## Co to jest Auto-Recharge i czy warto to włączyć?

Auto-Recharge to automatyczne doładowanie, które odpala się przy spadku salda do ustawionego progu.

Ważne szczegóły:
system uruchamia auto-doładowanie maksymalnie raz na 6 godzin (żeby nie „mielić” karty)
są ograniczone próby ponowienia płatności (w dokumentacji jest mowa o maks. 5 próbach)

Wniosek: jeśli nie chcesz obudzić się z niedziałającym CDN, Auto-Recharge jest ustawieniem „dla normalnych ludzi”.

Dokumentacja: https://support.bunny.net/hc/en-us/articles/8533751200796-Understanding-Auto-Recharge

## Czy mogę użyć własnej domeny typu cdn.mojadomena.pl i mieć SSL?

Tak. Standardowy, profesjonalny setup wygląda właśnie tak: cdn.twojadomena.pl → Bunny Pull Zone.

Fakt: żeby włączyć SSL, domena musi wskazywać na Bunny przez rekord CNAME, a Bunny ma integrację z Let’s Encrypt (auto-odnawiany cert) lub pozwala wgrać własny certyfikat.

Praktyczna wskazówka dla osób używających Cloudflare: jeśli masz włączone proxy (pomarańczowa chmurka) na rekordzie CNAME, walidacja SSL może się wysypać — Bunny wprost o tym uprzedza.

Dokumentacja: https://support.bunny.net/hc/en-us/articles/208517725-How-to-set-up-SSL-for-your-custom-domain-name  
Dokumentacja: https://support.bunny.net/hc/en-us/articles/207790279-How-to-set-up-a-custom-CDN-hostname

## Czy bunny.net daje statyczne IP albo rekord A?

Nie. Bunny wprost mówi, że nie wspiera statycznych IP ani rekordów A do routingu na CDN. Łączysz się przez CNAME.

Konsekwencja: jeśli koniecznie chcesz „apex” (twojadomena.pl bez www) na CDN, to najczęściej robisz:
www.twojadomena.pl jako CNAME do Bunny i przekierowanie z apex na www
albo przenosisz DNS do Bunny i używasz opcji typu CDN Acceleration (jeśli pasuje do Twojego setupu)

Dokumentacja: https://support.bunny.net/hc/en-us/articles/208517725-How-to-set-up-SSL-for-your-custom-domain-name

## Jak wyczyścić cache (purge) i czy jest API?

Masz dwa normalne scenariusze:
ręczne czyszczenie w panelu Pull Zone (przycisk „Purge Cache”)
purge po API (przydaje się, gdy publikujesz treści automatycznie albo masz CI/CD)

W API są osobne endpointy do purge — i są limity (rate limiting) na purge URL, więc nie projektuj systemu, który robi purge tysiąc razy na minutę.

Dokumentacja (panel): https://support.bunny.net/hc/en-us/articles/115003700071-How-to-purge-all-files-from-a-Pull-Zone  
Dokumentacja (API): https://docs.bunny.net/reference/purgepublic_indexpost  
Dokumentacja (API – Pull Zone Purge): https://docs.bunny.net/reference/pullzonepublic_purgecachepostbytag

## Czy CDN sam wykrywa zmiany plików na origin?

Nie. Bunny nie monitoruje Twojego origin pod kątem zmian. Jeśli plik jest już w cache, zostaje tam do wygaśnięcia Cache-Control albo do purge.

W praktyce: po deployu frontu albo po podmianie kluczowych assetów robisz purge albo stosujesz wersjonowanie plików (hash w nazwie). W 2026 to i tak najlepsza praktyka.

Dokumentacja: https://support.bunny.net/hc/en-us/articles/360020401791-Does-BunnyCDN-automatically-detect-when-a-file-is-changed

## Czy da się „rozgrzać” cache (cache warming / preloading)?

Nie — Bunny nie pozwala na preloading plików do cache. To ograniczenie jest celowe (fairness i dystrybucja).

Wniosek: jeśli masz duży launch, przygotuj się inaczej: wersjonowanie plików + normalny ruch użytkowników + sensowne TTL. CDN zrobi swoje, tylko nie „wstrzykniesz” mu cache sztucznie.

Dokumentacja: https://support.bunny.net/hc/en-us/articles/360012276699-Do-you-support-cache-warming-or-preloading-content-onto-the-CDN

## Czy bunny.net obsługuje WebSockets?

Tak. WebSockets można włączyć w ustawieniach Pull Zone.

Fakt, który warto zapamiętać: jest darmowy tier do 500 jednoczesnych połączeń, a potem są wyższe progi, jeśli naprawdę tego potrzebujesz.

Dokumentacja: https://support.bunny.net/hc/en-us/articles/360020401331-Do-you-support-WebSockets

## Czy bunny.net obsługuje range requests (np. pod wideo)?

Tak, range requests są wspierane dla treści cache’owanych i niecache’owanych.

W praktyce: do niecache’owanych treści Bunny zaleca włączyć opcję „Optimize for Video Delivery”, żeby range działał tak, jak oczekujesz.

Dokumentacja: https://support.bunny.net/hc/en-us/articles/360020401391-Do-you-support-range-requests

## Czy bunny.net obsługuje RTMP streaming?

Nie. RTMP nie jest obecnie wspierane (Bunny mówi, że rozważa opcje na przyszłość).

Jeśli Twoje „streaming” to HLS/DASH albo klasyczne wideo on-demand, to zwykle i tak idziesz inną drogą niż RTMP.

Dokumentacja: https://support.bunny.net/hc/en-us/articles/360012176700-Do-you-support-RTMP-streaming

## Czy mogę blokować kraje albo przekierowywać ruch?

Tak. Bunny ma ustawienia Traffic Manager, gdzie:
blokujesz kraje (blokada na poziomie DNS — zwracany jest 127.0.0.1)
możesz też używać „redirected countries” pod optymalizację kosztów/performance

Bunny opisuje też jak to działa: geolokalizacja na podstawie eDNS IP (lub IP resolvera) i wykorzystanie bazy MaxMind GeoIP2.

Dokumentacja: https://support.bunny.net/hc/en-us/articles/8721306086556-How-do-I-block-countries-from-accessing-my-CDN-pull-zone

## Czy jest lista IP do whitelistowania na firewallu?

Tak — są publiczne listy IP (IPv4 i IPv6) oraz wersje „plain”. Bunny uprzedza, że IP mogą się zmieniać, więc trzeba je monitorować.

Dokumentacja: https://support.bunny.net/hc/en-us/articles/24155254055964-Do-you-have-an-IP-whitelist

## Jak działa kompresja (gzip/Brotli/zstd) i jakie pliki są kompresowane?

Bunny kompresuje automatycznie w zależności od nagłówka Accept-Encoding i wspiera gzip, Brotli (br) oraz Zstandard (zstd). Kompresja jest gwarantowana dla określonych MIME types, a dodatkowo obejmuje typowe rozszerzenia typu .css, .js, .json, .xml, .svg, .html nawet przy „dziwnych” Content-Type.

To jest prosta oszczędność: mniejsze pliki = szybsze ładowanie i niższy koszt transferu.

Dokumentacja: https://support.bunny.net/hc/en-us/articles/115001200111-Which-MIME-types-does-BunnyCDN-support-for-compression

## Co daje Bunny Optimizer i kiedy ma sens?

Optimizer to płatny dodatek za stałą kwotę $9.50/mies. per strona, z nielimitowaną liczbą requestów, optymalizacji i przetworzonych obrazów.

Najważniejsze, praktyczne zachowanie: URL obrazka może zostać .jpg/.png, ale odpowiedź może wrócić jako WebP (sprawdzasz to w nagłówku Content-Type). To jest wygodne, bo nie musisz przebudowywać całej biblioteki mediów.

Kiedy to ma sens:
masz dużo obrazów i „z definicji” są ciężkie (sklepy, blogi, landing page’e)
nie masz czasu/ochoty dopinać osobnego pipeline do optymalizacji grafik

Kiedy to się nie opłaca:
już dziś trzymasz obrazy w sensownych rozmiarach, WebP/AVIF masz ogarnięte buildem, a strona jest lekka

Dokumentacja: https://support.bunny.net/hc/en-us/articles/360020557500-Understanding-the-Bunny-Optimizer

## Czy Bunny Storage jest publiczny? Jak to się łączy z CDN?

Domyślnie pliki w Bunny Storage są prywatne — dostęp przez API/interfejs po haśle. Żeby serwować je publicznie, łączysz Storage z Pull Zone (CDN wtedy autoryzuje i cache’uje pliki).

Bunny mówi to wprost: serwowanie publicznego ruchu bezpośrednio ze Storage (z pominięciem CDN) narusza Terms of Service i może skończyć się zawieszeniem konta. To jest logiczne — Storage to nie „publiczny hosting plików”, tylko warstwa danych pod CDN.

Dokumentacja: https://support.bunny.net/hc/en-us/articles/8561433879964-How-to-access-and-deliver-files-from-Bunny-Storage

## Czy jest oficjalna wtyczka WordPress i co potrafi?

Tak. Jest oficjalna wtyczka na WordPress.org, która obejmuje CDN, offloading mediów, Optimizer, Stream i nawet hosting fontów.

Jeśli jesteś na WP i chcesz minimum tarcia: wtyczka jest najkrótszą drogą do „wdrożone i działa”.

Warto zauważyć: w FAQ wtyczki jest jasno napisane, że Bunny Fonts nie udostępnia ani nie śledzi danych osobowych (kontekst GDPR).

Wtyczka: https://wordpress.org/plugins/bunnycdn/

## Czy offloading w WordPress działa z zewnętrznym DNS (np. Cloudflare)?

Nie w tym wariancie, który Bunny opisuje jako „Offloader”. Dokumentacja mówi jasno: offloading jest wspierany przy użyciu oficjalnej wtyczki oraz przy zarządzaniu DNS przez bunny.net z włączonym CDN Acceleration. Zewnętrzny DNS i „mieszane” wtyczki odpadają.

Wniosek: jeśli chcesz offload do Bunny Storage „na serio”, licz się z przeniesieniem DNS albo wybierz inne podejście.

Dokumentacja: https://support.bunny.net/hc/en-us/articles/12936040570012-How-to-enable-Content-Offloading-in-the-bunny-net-WordPress-plugin

## bunny.net a GDPR: czy da się to ułożyć „po europejsku”?

Da się — ale jak zawsze, to Ty jesteś administratorem danych i to Ty musisz to poukładać w swojej dokumentacji.

Twarde fakty:
bunny.net publikuje DPA zgodne z art. 28 GDPR (umowa powierzenia)
w DPA jest opisane m.in. rodzaje danych w logach oraz opcje prywatności (np. wyłączenie logowania lub anonimizacja IP)
DPA opisuje też, że w panelu można sterować lokalizacjami PoP (np. wyłączyć lokalizacje poza UE)

DPA: https://tcf-ventures.b-cdn.net/.legal/.dpa/bunny.net%20DPA%20v2%2017%20Mar%202024.pdf

## Czy są limity liczby stref (zones) na koncie?

Tak. Bunny ma limit liczby stref (Pull Zones i inne typy). W dokumentacji jest wskazane, że dla kont założonych od 2024 limit wynosi 500 stref.

Dla większości firm i tak jest to „limit abstrakcyjny”, ale warto wiedzieć, że istnieje.

Dokumentacja: https://support.bunny.net/hc/en-us/articles/360020141752-Is-there-a-limit-on-the-maximum-number-of-Pull-Zones-per-account

## Szybka podpowiedź na koniec: od czego zacząć?

Jeśli chcesz to zrobić bez kombinowania:
załóż Pull Zone pod statyczne zasoby (obrazy/CSS/JS)
ustaw własny hostname cdn.twojadomena.pl + darmowy SSL
włącz Auto-Recharge
po pierwszym deployu zrób purge i sprawdź nagłówki (czy leci przez CDN)

To jest ten typ wdrożenia, który realnie da Ci „wow” w 1 dzień, bez przepalania tygodnia na tuning.
