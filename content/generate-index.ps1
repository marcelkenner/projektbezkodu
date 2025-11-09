# Ustaw katalog bazowy projektu
$basePath = "C:\Projects\projektbezkodu\content"

$pages = @(
    # MAILERLITE
    @{
        RelativePath = "narzedzia\mailerlite"
        Markdown = @'
---
title: "MailerLite – email marketing z automatyzacją i landing page’ami"
slug: "mailerlite"
path: "/narzedzia/mailerlite/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "MailerLite – prosty start z newsletterem i automatyzacją"
  subheading: "Zakładam konto, importuję listę, ustawiam pierwsze automaty i kampanie, a platforma pilnuje wysyłek i statystyk."
seo:
  title: "MailerLite – czym jest i kiedy warto go użyć"
  description: "Przegląd funkcji MailerLite: kreator newsletterów, automatyzacje, strony docelowe, formularze i prosty cennik oparty o liczbę subskrybentów."
---
'@
    },
    @{
        RelativePath = "narzedzia\mailerlite\recenzja"
        Markdown = @'
---
title: "MailerLite – recenzja"
slug: "recenzja"
path: "/narzedzia/mailerlite/recenzja/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "MailerLite – recenzja w stylu „co mam z tego ja”"
  subheading: "Sprawdzam, jak w praktyce działają kampanie, automaty, segmentacja i kreator landing page’y, gdy ogarniasz email marketing samodzielnie."
seo:
  title: "MailerLite – recenzja z perspektywy małych biznesów i twórców"
  description: "Plusy i minusy MailerLite: deliverability, wygoda edytora, ograniczenia automatyzacji i to, kiedy lepiej rozejrzeć się za czymś cięższym kalibrem."
---
'@
    },
    @{
        RelativePath = "narzedzia\mailerlite\cennik"
        Markdown = @'
---
title: "MailerLite – cennik"
slug: "cennik"
path: "/narzedzia/mailerlite/cennik/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "MailerLite – cennik rozpisany na realne listy i scenariusze"
  subheading: "Patrzę, jak zmienia się koszt przy rosnącej liczbie subskrybentów i jakie funkcje dostajesz w darmowym oraz płatnych planach."
seo:
  title: "MailerLite – cennik i opłacalność przy różnych wielkościach listy"
  description: "Tłumaczę model cenowy MailerLite: darmowy plan, skoki cenowe przy wzroście bazy oraz kiedy wyjdzie taniej niż u konkurencji."
---
'@
    },
    @{
        RelativePath = "narzedzia\mailerlite\alternatywy"
        Markdown = @'
---
title: "MailerLite – alternatywy"
slug: "alternatywy"
path: "/narzedzia/mailerlite/alternatywy/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "Alternatywy dla MailerLite – co wybrać, gdy rośniesz lub potrzebujesz więcej"
  subheading: "Porównuję MailerLite z innymi narzędziami email marketingowymi pod kątem ceny, automatyzacji i integracji."
seo:
  title: "MailerLite – najlepsze alternatywy dla newsletterów i automatyzacji"
  description: "Przegląd narzędzi podobnych do MailerLite, które lepiej sprawdzą się w e-commerce, zaawansowanej analityce albo dużych bazach."
---
'@
    },
    @{
        RelativePath = "narzedzia\mailerlite\faq"
        Markdown = @'
---
title: "MailerLite – FAQ"
slug: "faq"
path: "/narzedzia/mailerlite/faq/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "MailerLite – najczęstsze pytania przed startem z newsletterem"
  subheading: "Od migracji kontaktów, przez limity, po RODO i integracje z innymi narzędziami."
seo:
  title: "MailerLite – FAQ dla osób przechodzących na tę platformę"
  description: "Zbieram odpowiedzi na powtarzające się pytania o MailerLite: bezpieczeństwo, wsparcie, deliverability i codzienną pracę z systemem."
---
'@
    },
    @{
        RelativePath = "narzedzia\mailerlite\migracja"
        Markdown = @'
---
title: "MailerLite – migracja z innych systemów"
slug: "migracja"
path: "/narzedzia/mailerlite/migracja/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "Migracja do MailerLite – jak przenieść listę, szablony i automaty"
  subheading: "Przerabiam scenariusze przejścia z Mailchimp, GetResponse, ConvertKit i innych narzędzi bez blokowania wysyłek."
seo:
  title: "MailerLite – poradnik migracji krok po kroku"
  description: "Jak przygotować eksport, oczyścić bazę, odwzorować segmenty i automaty, żeby zmiana na MailerLite była możliwie bezbolesna."
---
'@
    },
    @{
        RelativePath = "narzedzia\mailerlite\automatyzacje"
        Markdown = @'
---
title: "MailerLite – automatyzacje"
slug: "automatyzacje"
path: "/narzedzia/mailerlite/automatyzacje/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "Automatyzacje w MailerLite – co da się zautomatyzować bez developera"
  subheading: "Buduję sekwencje powitalne, lead nurturing i kampanie sprzedażowe na wizualnym edytorze workflow."
seo:
  title: "MailerLite – przykłady automatyzacji i dobre praktyki"
  description: "Przegląd najważniejszych typów automatyzacji w MailerLite, gotowe scenariusze i wskazówki, jak nie utonąć w zbyt skomplikowanych ścieżkach."
---
'@
    },

    # GETRESPONSE
    @{
        RelativePath = "narzedzia\getresponse"
        Markdown = @'
---
title: "GetResponse – platforma marketing automation z emailami i webinarami"
slug: "getresponse"
path: "/narzedzia/getresponse/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "GetResponse – email, automatyzacje, lejki i webinary w jednym miejscu"
  subheading: "Zamiast sklejać kilka narzędzi, buduję kampanie, lejki sprzedażowe i webinary w jednym panelu."
seo:
  title: "GetResponse – czym jest i komu się opłaca"
  description: "Opisuję kluczowe możliwości GetResponse: zaawansowane automatyzacje, lejki, webinary, landing page’e i integracje z e-commerce."
---
'@
    },
    @{
        RelativePath = "narzedzia\getresponse\recenzja"
        Markdown = @'
---
title: "GetResponse – recenzja"
slug: "recenzja"
path: "/narzedzia/getresponse/recenzja/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "GetResponse – recenzja z punktu widzenia małego biznesu online"
  subheading: "Sprawdzam, jak faktycznie pracuje się na automatyzacjach, webinarach i lejku konwersji, gdy masz ograniczony czas i zespół."
seo:
  title: "GetResponse – recenzja z naciskiem na automatyzacje i lejki"
  description: "Plusy i minusy GetResponse: elastyczność automatyzacji, jakość szablonów, intuicyjność panelu i gdzie pojawia się „bloat” funkcji."
---
'@
    },
    @{
        RelativePath = "narzedzia\getresponse\cennik"
        Markdown = @'
---
title: "GetResponse – cennik"
slug: "cennik"
path: "/narzedzia/getresponse/cennik/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "GetResponse – cennik rozbity na plany i funkcje"
  subheading: "Pokazuję, co realnie dostajesz w tańszych planach, a za co dopłacasz, gdy potrzebujesz webinarów czy mocnych automatyzacji."
seo:
  title: "GetResponse – cennik i ukryte koszty w praktyce"
  description: "Analizuję ceny GetResponse, dodatki (np. webinary) i progi kontaktów, żeby łatwiej było policzyć, kiedy ta platforma ma sens finansowo."
---
'@
    },
    @{
        RelativePath = "narzedzia\getresponse\alternatywy"
        Markdown = @'
---
title: "GetResponse – alternatywy"
slug: "alternatywy"
path: "/narzedzia/getresponse/alternatywy/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "Alternatywy dla GetResponse – gdy lejek to za dużo lub za mało"
  subheading: "Porównuję GetResponse z prostszymi narzędziami do newslettera oraz cięższymi kombajnami marketing automation."
seo:
  title: "GetResponse – przegląd alternatyw dla różnych typów biznesów"
  description: "Kiedy zamiast GetResponse wybrać lżejsze narzędzie typu MailerLite, a kiedy rozważyć system klasy enterprise lub rozwiązanie stricte e-commerce."
---
'@
    },
    @{
        RelativePath = "narzedzia\getresponse\faq"
        Markdown = @'
---
title: "GetResponse – FAQ"
slug: "faq"
path: "/narzedzia/getresponse/faq/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "GetResponse – odpowiedzi na najczęstsze pytania"
  subheading: "Jak działa rozliczanie za kontakty, co z RODO, integracjami i przeniesieniem automatyzacji z innego systemu."
seo:
  title: "GetResponse – FAQ dla osób testujących platformę"
  description: "Zbieram praktyczne odpowiedzi o GetResponse: od pierwszej konfiguracji, przez import listy, po wsparcie techniczne i anulowanie planu."
---
'@
    },

    # CONVERTKIT / KIT
    @{
        RelativePath = "narzedzia\convertkit"
        Markdown = @'
---
title: "ConvertKit (Kit) – email marketing dla twórców"
slug: "convertkit"
path: "/narzedzia/convertkit/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "ConvertKit / Kit – newsletter i automaty dla twórców treści"
  subheading: "Buduję proste lejki, sprzedaję produkty cyfrowe i prowadzę newsletter bez rozpraszacza w postaci zbędnych funkcji."
seo:
  title: "ConvertKit (Kit) – czym różni się od klasycznych narzędzi do newslettera"
  description: "Przegląd funkcji ConvertKit / Kit: wizualne automatyzacje, tagowanie, sprzedaż produktów i subskrypcji, nacisk na twórców i soloprzedsiębiorców."
---
'@
    },
    @{
        RelativePath = "narzedzia\convertkit\recenzja"
        Markdown = @'
---
title: "ConvertKit (Kit) – recenzja"
slug: "recenzja"
path: "/narzedzia/convertkit/recenzja/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "ConvertKit – recenzja pod kątem pracy twórcy, nie korporacji"
  subheading: "Sprawdzam, jak wygodnie da się ogarniać newsletter, sprzedaż produktów i automaty, kiedy działasz solo lub z małym zespołem."
seo:
  title: "ConvertKit – recenzja z perspektywy twórców i newsletterów premium"
  description: "Plusy i minusy ConvertKit: tagowanie zamiast list, prostota edytora, ograniczenia w raportach oraz jak wypada przy bardziej złożonych lejkach."
---
'@
    },
    @{
        RelativePath = "narzedzia\convertkit\cennik"
        Markdown = @'
---
title: "ConvertKit – cennik"
slug: "cennik"
path: "/narzedzia/convertkit/cennik/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "ConvertKit – cennik w kontekście przychodów z newslettera"
  subheading: "Patrzę, ile kosztuje trzymanie rosnącej bazy, gdy zarabiasz na produktach, subskrypcjach lub sponsoringach."
seo:
  title: "ConvertKit – cennik i opłacalność dla twórców"
  description: "Analizuję, jak ConvertKit skaluje się cenowo wraz z liczbą subskrybentów i przychodami z listy, oraz kiedy plan wyżej ma sens."
---
'@
    },
    @{
        RelativePath = "narzedzia\convertkit\alternatywy"
        Markdown = @'
---
title: "ConvertKit – alternatywy"
slug: "alternatywy"
path: "/narzedzia/convertkit/alternatywy/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "Alternatywy dla ConvertKit – gdy potrzebujesz taniej lub bardziej „all-in-one”"
  subheading: "Porównuję ConvertKit z narzędziami nastawionymi na e-commerce, „all-in-one” i darmowe newslettery."
seo:
  title: "ConvertKit – przegląd alternatyw dla różnych typów newsletterów"
  description: "Kiedy lepiej wybrać MailerLite, beehiiv, Substack czy klasyczne narzędzie email marketingowe zamiast ConvertKit."
---
'@
    },
    @{
        RelativePath = "narzedzia\convertkit\faq"
        Markdown = @'
---
title: "ConvertKit – FAQ"
slug: "faq"
path: "/narzedzia/convertkit/faq/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "ConvertKit – odpowiedzi na pytania twórców newsletterów"
  subheading: "Jak działa tagowanie, płatne newslettery, sprzedaż produktów i integracje z platformami dla twórców."
seo:
  title: "ConvertKit – FAQ dla osób przenoszących newsletter"
  description: "Przegląd najczęstszych pytań o ConvertKit: migracja z innych narzędzi, płatności, RODO, deliverability i obsługa wielu projektów."
---
'@
    },

    # AWEBER
    @{
        RelativePath = "narzedzia\aweber"
        Markdown = @'
---
title: "AWeber – klasyczny email marketing dla małych firm"
slug: "aweber"
path: "/narzedzia/aweber/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "AWeber – newsletter, szablony i automaty dla małego biznesu"
  subheading: "Stawiam pierwsze kampanie na gotowych szablonach i prostych automatach bez zagłębiania się w kombajny marketing automation."
seo:
  title: "AWeber – czym jest i komu nadal się opłaca"
  description: "Przegląd możliwości AWeber: tworzenie kampanii, landing page’y, proste automatyzacje, web push i podstawowe funkcje e-commerce."
---
'@
    },
    @{
        RelativePath = "narzedzia\aweber\recenzja"
        Markdown = @'
---
title: "AWeber – recenzja"
slug: "recenzja"
path: "/narzedzia/aweber/recenzja/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "AWeber – recenzja z perspektywy małej firmy i blogera"
  subheading: "Sprawdzam, czy „klasyk” rynku email marketingu wciąż dowozi pod kątem deliverability, prostoty i ceny."
seo:
  title: "AWeber – recenzja w praktycznym użyciu"
  description: "Analizuję AWeber: wygodę edytora, jakość szablonów, automatyzacje oraz czy opłaca się w porównaniu z młodszą konkurencją."
---
'@
    },
    @{
        RelativePath = "narzedzia\aweber\cennik"
        Markdown = @'
---
title: "AWeber – cennik"
slug: "cennik"
path: "/narzedzia/aweber/cennik/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "AWeber – cennik i realne koszty newslettera"
  subheading: "Rozpisuję darmowy i płatne plany na liczbę subskrybentów oraz funkcje, które odblokowują."
seo:
  title: "AWeber – cennik i opłacalność dla małych firm"
  description: "Jak AWeber wypada cenowo na tle innych narzędzi, gdzie zaczynają się limity i kiedy dopłata do wyższego planu ma sens."
---
'@
    },
    @{
        RelativePath = "narzedzia\aweber\alternatywy"
        Markdown = @'
---
title: "AWeber – alternatywy"
slug: "alternatywy"
path: "/narzedzia/aweber/alternatywy/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "Alternatywy dla AWeber – kiedy warto się przenieść"
  subheading: "Porównuję AWeber z nowszymi narzędziami, które lepiej ogarniają automatyzacje, ecommerce lub treści dla twórców."
seo:
  title: "AWeber – przegląd alternatyw i konkurencji"
  description: "Pomagam wybrać narzędzie zamiast AWeber w zależności od tego, czy ważniejsze są ceny, automaty, ecommerce czy monetyzacja newslettera."
---
'@
    },
    @{
        RelativePath = "narzedzia\aweber\faq"
        Markdown = @'
---
title: "AWeber – FAQ"
slug: "faq"
path: "/narzedzia/aweber/faq/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "AWeber – odpowiedzi na najczęstsze pytania"
  subheading: "Limity kontaktów, migracja, RODO, integracje z CMS-ami i platformami sklepów – wszystko w jednym miejscu."
seo:
  title: "AWeber – FAQ dla osób startujących z narzędziem"
  description: "Najważniejsze pytania o AWeber: jak zacząć, jak importować kontakty, jak działają automaty i na co uważać przy rezygnacji."
---
'@
    },

    # BEEHIIV
    @{
        RelativePath = "narzedzia\beehiiv"
        Markdown = @'
---
title: "beehiiv – platforma newsletterowa z naciskiem na wzrost i monetyzację"
slug: "beehiiv"
path: "/narzedzia/beehiiv/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "beehiiv – newsletter, strona i monetyzacja w jednym"
  subheading: "Prowadzę newsletter, mam od razu stronę www, system poleceń i wbudowane opcje zarabiania na treściach."
seo:
  title: "beehiiv – czym jest i dla kogo jest ta platforma"
  description: "Opisuję możliwości beehiiv: edytor newslettera, blog na subdomenie lub własnej domenie, system poleceń, analitykę i narzędzia wzrostu."
---
'@
    },
    @{
        RelativePath = "narzedzia\beehiiv\recenzja"
        Markdown = @'
---
title: "beehiiv – recenzja"
slug: "recenzja"
path: "/narzedzia/beehiiv/recenzja/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "beehiiv – recenzja z perspektywy twórcy newslettera"
  subheading: "Sprawdzam, jak w praktyce działają migracja z innej platformy, edytor, rekomendacje innych newsletterów i wbudowana sieć reklamowa."
seo:
  title: "beehiiv – recenzja skoncentrowana na wzroście listy i zarabianiu"
  description: "Plusy i minusy beehiiv: narzędzia wzrostu, monetyzacja, ograniczenia w automatyzacjach i dla kogo platforma jest za prosta lub za rozbudowana."
---
'@
    },
    @{
        RelativePath = "narzedzia\beehiiv\cennik"
        Markdown = @'
---
title: "beehiiv – cennik"
slug: "cennik"
path: "/narzedzia/beehiiv/cennik/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "beehiiv – cennik w kontekście przychodów z newslettera"
  subheading: "Patrzę, jak rośnie koszt wraz z bazą subskrybentów i jakie możliwości monetyzacji pomagają ten koszt zrównoważyć."
seo:
  title: "beehiiv – cennik i model biznesowy newslettera"
  description: "Tłumaczę, jak działają plany beehiiv, na co uważać przy skokach cenowych i jak wliczyć w to przychody z reklam, poleceń i subskrypcji."
---
'@
    },
    @{
        RelativePath = "narzedzia\beehiiv\alternatywy"
        Markdown = @'
---
title: "beehiiv – alternatywy"
slug: "alternatywy"
path: "/narzedzia/beehiiv/alternatywy/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "Alternatywy dla beehiiv – co wybrać, jeśli newsletter to nie wszystko"
  subheading: "Porównuję beehiiv z ConvertKit, MailerLite, Substackiem i klasycznymi narzędziami email marketingowymi."
seo:
  title: "beehiiv – przegląd alternatyw dla różnych modeli newslettera"
  description: "Kiedy beehiiv ma sens, a kiedy lepiej postawić na platformę twórców, mocne automatyzacje albo prosty system do darmowego newslettera."
---
'@
    },
    @{
        RelativePath = "narzedzia\beehiiv\faq"
        Markdown = @'
---
title: "beehiiv – FAQ"
slug: "faq"
path: "/narzedzia/beehiiv/faq/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "beehiiv – najczęstsze pytania o start i migrację"
  subheading: "Jak przenieść listę, co z płatnymi subskrypcjami, własną domeną, RODO i integracjami."
seo:
  title: "beehiiv – FAQ dla osób przenoszących newsletter"
  description: "Zbieram odpowiedzi na praktyczne pytania o beehiiv: migracja, konfiguracja domeny, rozliczenia, limity i współpraca z reklamodawcami."
---
'@
    },
    @{
        RelativePath = "narzedzia\beehiiv\monetyzacja"
        Markdown = @'
---
title: "beehiiv – monetyzacja newslettera"
slug: "monetyzacja"
path: "/narzedzia/beehiiv/monetyzacja/"
draft: false
template: "article"
date: "2024-12-09"
hero:
  heading: "Monetyzacja w beehiiv – reklamy, polecenia i płatne subskrypcje"
  subheading: "Rozkładam na czynniki pierwsze sieć reklamową, program referencyjny i płatne newslettery, żeby zobaczyć, co realnie może zarobić twórca."
seo:
  title: "beehiiv – jak zarabiać na newsletterze"
  description: "Przegląd sposobów monetyzacji w beehiiv: ad network, sponsoring, polecenia innych newsletterów i modele płatnych treści."
---
'@
    }
)

foreach ($page in $pages) {
    $targetDir = Join-Path $basePath $page.RelativePath

    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    $filePath = Join-Path $targetDir "index.md"

    # Nadpisze istniejący index.md – jeśli chcesz tego uniknąć, dodaj warunek Test-Path tutaj.
    $page.Markdown | Set-Content -LiteralPath $filePath -Encoding UTF8
}
