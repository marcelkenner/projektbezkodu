---
title: "Cennik bunny.net: ile zapłacisz za CDN, storage i optymalizację"
slug: "cennik"
path: "/narzedzia/bunny-net/cennik/"
draft: false
template: "default"
type: "pricing"
date: "2026-01-02"
hero:
  heading: "Cennik bunny.net: proste liczby, które da się policzyć przed wdrożeniem"
  subheading: "Werdykt: jeśli Twoi użytkownicy są głównie w Polsce i UE, bunny.net prawie zawsze da się obronić kosztowo. Płacisz głównie za realny transfer, a minimum miesięczne jest symboliczne — o ile pilnujesz salda."
seo:
  title: "bunny.net — cennik CDN, Bunny Storage, Optimizer i Shield (2026): stawki i przykłady"
  description: "Konkretny przewodnik po kosztach bunny.net: stawki CDN per region, Volume vs Standard, koszty Bunny Storage i replikacji, Optimizer za $9.50/stronę oraz przykłady wyliczeń dla PL."
  canonical: "/narzedzia/bunny-net/cennik/"
  image: null
meta:
  updatedAt: "2026-01-02"
  hasAffiliateLinks: false
  topics:
    - "CDN"
    - "Cennik"
    - "Wydajność strony"
    - "Obrazy"
    - "Storage"
  summaryBullets:
    - "CDN Standard: UE/NA $0.010/GB; Azja/Oceania $0.030/GB; Am. Płd. $0.045/GB; ME/Afryka $0.060/GB"
    - "CDN Volume: od $0.005/GB (duże wolumeny, mniej PoP-ów)"
    - "Bunny Storage HDD: od $0.01/GB + dopłaty za replikację regionów"
    - "Bunny Optimizer: $9.50/mies. za stronę (bez limitów requestów i obrazów)"
  metrics:
    - label: "Minimum"
      value: "$1/mies."
      description: "Naliczane, gdy masz aktywne strefy i zużycie jest < $1"
    - label: "UE/NA CDN"
      value: "$0.010/GB"
      description: "Standard network"
    - label: "Optimizer"
      value: "$9.50/mies."
      description: "Za stronę, bez limitów"
taxonomy:
  categories:
    - "Narzędzia"
  tags:
    - "bunny.net"
    - "CDN"
    - "cennik"
    - "storage"
    - "optymalizacja obrazów"
---

# bunny.net — cennik

Jeśli chcesz wiedzieć, czy bunny.net „zje Ci budżet”, ta strona jest po to, żebyś policzył to w 3 minuty i nie wdrażał na ślepo.

W skrócie: największy koszt to **transfer na CDN**. Reszta to dodatki (storage, optymalizacja obrazów, bezpieczeństwo). Dla polskiego rynku kluczowe jest jedno: **stawki w Europie są niskie**, ale region ma znaczenie.

## Najpierw prawda o rozliczeniach (żeby nie było zaskoczeń)

bunny.net działa w modelu pre-paid: doładowujesz konto i koszty schodzą z salda.

Są dwa „twarde” fakty, które musisz znać:
- Jest **minimum $1 miesięcznie**, jeśli masz aktywne strefy (gdy zużycie < $1, zostanie zaokrąglone do $1). Szczegóły w [billingu](https://support.bunny.net/hc/en-us/articles/360000235911-How-does-the-bunny-net-credit-and-billing-system-work).
- Musisz trzymać **dodatnie saldo**, bo przy braku doładowania konto może zostać zawieszone, a dane w storage skasowane po kilku dniach. To też jest opisane wprost w [billingu](https://support.bunny.net/hc/en-us/articles/360000235911-How-does-the-bunny-net-credit-and-billing-system-work).

Wniosek jest prosty: to jest tani model, ale nie „samogrający”. Ustaw auto-doładowanie i masz spokój.

## Szybki kalkulator kosztów

Najprostszy wzór na miesięczny koszt wygląda tak:

Koszt CDN = transfer wychodzący (GB) × stawka regionu  
Koszt Storage = średnia ilość danych (GB) × stawka (i ewentualna replikacja)  
Dodatki = Optimizer + Shield + (opcjonalnie) Scripting/WebSockets  
Finalnie: jeśli suma < $1 i masz aktywne strefy, i tak zapłacisz $1.

Uwaga praktyczna: 1 TB to około 1024 GB. Jeśli liczysz „na szybko” w Excelu, pomnóż TB × 1024.

## CDN: stawki, które najczęściej decydują o wszystkim

To jest ta część, która najbardziej obchodzi polskie firmy.

### Standard network (regionalne stawki za GB)

Oficjalne stawki w kalkulatorze (CDN Standard) są rozpisane per region w [tabeli](https://docs.bunny.net/docs/stream-pricing):

| Region ruchu | Stawka | Komentarz-werdykt |
|---|---:|---|
| Europa & Ameryka Płn. | $0.010/GB | Najlepszy scenariusz dla PL — to się prawie zawsze spina |
| Azja & Oceania | $0.030/GB | 3× drożej — globalne SaaS-y muszą to policzyć |
| Ameryka Płd. | $0.045/GB | Koszt już „czuć”, zwłaszcza przy obrazach i wideo |
| Bliski Wschód & Afryka | $0.060/GB | Najdrożej — bez liczenia możesz przepalić budżet |

Co jest liczone? Zasadniczo outbound (to, co pobierają użytkownicy). Transfer przychodzący z Twojego serwera do bunny.net jest opisany jako darmowy w [billingu](https://support.bunny.net/hc/en-us/articles/360000235911-How-does-the-bunny-net-credit-and-billing-system-work).

### Volume network (gdy serwujesz duże pliki)

Volume jest po to, żeby taniej dowozić duże paczki: downloady, wideo, ciężkie zasoby. Z technicznego punktu widzenia różni się głównie siecią (mniej PoP-ów), co bunny.net opisuje w [wyjaśnieniu](https://support.bunny.net/hc/en-us/articles/360000200331-What-is-the-difference-between-Standard-and-Volume-tier-zones).

Stawki w kalkulatorze CDN (Volume) są progowe w [tabeli](https://docs.bunny.net/docs/stream-pricing):

| Transfer/mies. | Stawka | Komentarz-werdykt |
|---|---:|---|
| 0–500 TB | $0.005/GB | Minimum sensu Volume — 2× taniej niż UE Standard |
| 500–1000 TB | $0.004/GB | Dla dużej skali robi różnicę w fakturze |
| 1000–2000 TB | $0.002/GB | To już poziom „dużych mediów” |
| 2000 TB+ | kontakt sprzedaż | Negocjacje enterprise |

Werdykt: dla typowego polskiego biznesu Standard w UE jest tak tani, że Volume ma sens dopiero, gdy naprawdę serwujesz duże wolumeny albo duże pliki.

## Przykłady wyliczeń (żebyś zobaczył to na liczbach)

### Strona firmowa / blog w PL (100 GB/mies. w UE)

100 GB × $0.010 = $1.00

W praktyce: to jest granica minimum. Jeśli zużyjesz mniej, i tak wejdziesz w $1 minimalnego rozliczenia.

### Sklep lub content (500 GB/mies. w UE)

500 GB × $0.010 = $5.00

To jest realistyczny poziom, na którym CDN już „robi robotę”, a koszt dalej jest mały w porównaniu do hostingu i reklam.

### SaaS z ruchem globalnym (1 TB/mies. do Azji/Oceanii)

1 TB ≈ 1024 GB  
1024 GB × $0.030 = $30.72

To nie jest katastrofa, ale to jest moment, w którym regiony zaczynają dyktować decyzje: cache, kompresja i optymalizacja obrazów przestają być „miłe”, a stają się finansowo konieczne.

### Duże pliki na Volume (10 TB/mies.)

10 TB ≈ 10 × 1024 = 10240 GB  
10240 GB × $0.005 = $51.20

Wniosek: przy dużych plikach Volume bywa bezlitosne dla kosztów na plus, ale musisz zaakceptować, że to nie jest „najniższa latencja wszędzie”.

## Bunny Storage: koszt przechowywania i replikacji

Jeśli trzymasz media (WordPress/WooCommerce, pliki do pobrania, assety aplikacji), storage jest drugim składnikiem rachunku.

W kalkulatorze w dokumentacji widać prosty punkt odniesienia: **HDD storage $0.01/GB** (przykład regionu Frankfurt) oraz koszty replikacji regionów w [kalkulatorze](https://docs.bunny.net/docs/stream-pricing).

W opisie cen storage bunny.net podaje model „per region”: **$0.01/GB per region dla pierwszych dwóch regionów i $0.005/GB za każdy kolejny** (czyli replikacja podnosi koszt liniowo). To jest streszczone na stronie cenowej storage w [zajawce](https://bunny.net/pricing/storage/) (warto ją otworzyć w przeglądarce).

Przykład (200 GB danych):
- 1 region: 200 × $0.01 = $2.00/mies.
- 2 regiony: 200 × ($0.01 + $0.01) = 200 × $0.02 = $4.00/mies.
- 3 regiony: 200 × ($0.01 + $0.01 + $0.005) = 200 × $0.025 = $5.00/mies.

Uczciwy wniosek: replikacja to nie „opcja bezpieczeństwa za darmo”. Jeśli chcesz wieloregionową odporność, płacisz — i dobrze, bo to jest policzalne.

Ważne: billing storage jest naliczany proporcjonalnie do czasu użycia (zwykle okres < 24h), więc dane, które wrzucisz i skasujesz, nie muszą być liczone jak pełny miesiąc. To jest opisane w sekcji storage billing w [billingu](https://support.bunny.net/hc/en-us/articles/360000235911-How-does-the-bunny-net-credit-and-billing-system-work).

## Bunny Optimizer: stała cena, gdy masz ciężkie obrazy

Optimizer to bardzo polski problem: sklepy i blogi mają dużo zdjęć i „niby wszystko działa”, tylko strona jest ociężała.

Tu pricing jest brutalnie prosty: **$9.50/mies. za stronę**, a w cenie są nielimitowane requesty, optymalizacje i przetworzone obrazy. bunny.net pisze to wprost w [opisie](https://support.bunny.net/hc/en-us/articles/360020557500-Understanding-the-Bunny-Optimizer).

Co dostajesz w praktyce: konwersję do WebP, optymalizację pod desktop/mobile, minifikację CSS/JS oraz manipulacje obrazów „w locie” przez parametry. To też jest opisane w [Optimizerze](https://support.bunny.net/hc/en-us/articles/360020557500-Understanding-the-Bunny-Optimizer) i w [Dynamic Image API](https://docs.bunny.net/docs/stream-image-processing).

Werdykt: jeśli obrazy są Twoim największym „wagowym” problemem, te $9.50 często zwraca się w kosztach transferu i w wyniku SEO szybciej, niż ludzie chcą przyznać.

## Bunny Shield: koszt ochrony (WAF/DDoS/rate limiting)

Jeśli chcesz ochrony na edge, Bunny Shield jest osobnym modułem, ale działa „podpięty” do CDN (nie jako produkt całkowicie osobny). To jest opisane w [wprowadzeniu do Shield](https://support.bunny.net/hc/en-us/articles/22699526402332-Understanding-and-enabling-Bunny-Shield).

bunny.net ma też poziomy planów (Basic/Advanced/Business/Enterprise) opisane w [planach Shield](https://support.bunny.net/hc/en-us/articles/22701872233884-Understanding-and-Altering-Shield-Plans). Konkretne liczby limitów i overage są prezentowane na stronie produktu Shield w tabeli planów: [Shield](https://bunny.net/shield/).

Werdykt: Shield ma sens, gdy realnie cierpisz od botów, skrobania, nadużyć lub boisz się ataków. Jeśli Twoja strona to „katalog i formularz”, zwykle wygrywa najpierw dobry cache + podstawowe ograniczenia, a Shield dorzucasz dopiero, gdy masz uzasadnienie.

## Dodatki, które potrafią wejść na fakturę

### Edge Scripting (gdy zaczynasz robić logikę na edge)

Jeśli używasz Edge Scripting, płacisz za CPU time i liczbę requestów. Cennik jest jawny: **$0.02 / 1000s CPU** i **$0.20 / milion requestów** w [pricingu](https://docs.bunny.net/docs/edge-scripting-pricing).

To jest tanie, dopóki nie robisz ciężkiej logiki na każdym żądaniu. Rób to świadomie.

### WebSockets (gdy masz real-time)

WebSockets mają darmowy poziom 500 równoległych połączeń na strefę, a wyższe limity są miesięcznymi dopłatami. Tabela jest wprost w [WebSockets pricing](https://docs.bunny.net/docs/cdn-websockets). Transfer WebSocket jest liczony jak zwykły transfer CDN.

## Jak nie przepłacić (bez kombinowania)

Największe oszczędności w bunny.net nie biorą się z „magicznych ustawień”, tylko z trzech decyzji:

Po pierwsze: cache’uj agresywnie to, co statyczne, bo każda poprawa HIT rate to mniej uderzeń w origin i mniej transferu „bez sensu”.

Po drugie: jeśli sprzedajesz globalnie, przestań udawać, że region nie ma znaczenia. Policzenie Azji vs UE to różnica rzędu 3× na stawce.

Po trzecie: obrazy traktuj jak koszt finansowy, nie estetykę. Jeśli obrazki są ciężkie, Optimizer potrafi być najszybszym zwrotem.

## Podsumowanie: ile to będzie kosztować w Twoim przypadku

Jeśli Twoja publiczność jest głównie w Polsce/UE, to jest typowy obraz:

Mała strona: zwykle wylądujesz na minimum $1 albo kilku dolarach transferu.  
Sklep / content: najczęściej kilka–kilkanaście dolarów CDN + ewentualnie $9.50 za Optimizer.  
SaaS globalny: koszt rośnie głównie przez regiony droższe i duże media, więc liczenie i optymalizacja to obowiązek.

Jeśli chcesz teraz podjąć decyzję bez teorii, zrób najprostszy test: podepnij CDN tylko pod obrazy i pliki statyczne, policz transfer po tygodniu, a potem dopiero decyduj o Optimizerze i storage. To jest najtańszy sposób, żeby „poczuć” koszty w swojej rzeczywistości.

Dalej: /narzedzia/bunny-net/alternatywy/ i /narzedzia/bunny-net/statyczny-hosting-cdn/
