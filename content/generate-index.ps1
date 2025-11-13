# generate-index.ps1
# Uruchom z katalogu "content" (np. C:\Projects\projektbezkodu\content)

$ErrorActionPreference = 'Stop'

# Domyślna data publikacji
$date = '2024-12-09'

$basePath = Get-Location

function New-ContentPage {
    param(
        [string]$BasePath,
        [string]$RelativeDir,
        [string]$Title,
        [string]$Slug,
        [string]$UrlPath,
        [string]$HeroHeading,
        [string]$HeroSubheading,
        [string]$SeoTitle,
        [string]$SeoDescription,
        [string]$Template = 'article',
        [bool]$Draft = $false
    )

    $dirPath = Join-Path $BasePath $RelativeDir

    if (-not (Test-Path $dirPath)) {
        New-Item -ItemType Directory -Path $dirPath -Force | Out-Null
    }

    $filePath = Join-Path $dirPath 'index.md'
    $draftText = $Draft.ToString().ToLower()

    $frontMatterLines = @(
        '---'
        "title: ""$Title"""
        "slug: ""$Slug"""
        "path: ""$UrlPath"""
        "draft: $draftText"
        "template: ""$Template"""
        "date: ""$date"""
        'hero:'
        "  heading: ""$HeroHeading"""
        "  subheading: ""$HeroSubheading"""
        'seo:'
        "  title: ""$SeoTitle"""
        "  description: ""$SeoDescription"""
        '---'
        ''
        'Tu będzie treść artykułu.'
    )

    $frontMatter = $frontMatterLines -join "`r`n"

    Set-Content -Path $filePath -Value $frontMatter -Encoding UTF8
    Write-Host "Utworzono: $filePath"
}

# Każdy wpis to jedna konkretna strona z unikalnymi tekstami
$pages = @(

    # =======================
    # MAKE
    # =======================
    @{
        RelativeDir    = 'narzedzia\make'
        Title          = 'Make – automatyzacje no-code w praktyce'
        Slug           = 'make'
        UrlPath        = '/narzedzia/make/'
        HeroHeading    = 'Make – centrum automatyzacji dla rozsypanych narzędzi'
        HeroSubheading = 'Łączę CRM-y, maile i arkusze w jeden sensowny proces, bez dotykania API czy kodu.'
        SeoTitle       = 'Make – jak używam go do automatyzacji procesów'
        SeoDescription = 'Zobacz, jak Make pomaga mi ogarniać powtarzalne zadania: integracje, scenariusze i automatyzacje w małym i większym biznesie.'
    }
    @{
        RelativeDir    = 'narzedzia\make\recenzja'
        Title          = 'Make – recenzja'
        Slug           = 'recenzja'
        UrlPath        = '/narzedzia/make/recenzja/'
        HeroHeading    = 'Make – recenzja z perspektywy codziennej pracy'
        HeroSubheading = 'Liczy się to, ile kliknięć oszczędzam dziennie, a nie to, ile kolorowych konektorów jest w katalogu.'
        SeoTitle       = 'Make – recenzja oparta na realnych wdrożeniach'
        SeoDescription = 'Moje doświadczenia z Make: co automatyzuje dobrze, gdzie potrafi zaskoczyć i kiedy lepiej wybrać inne narzędzie.'
    }
    @{
        RelativeDir    = 'narzedzia\make\cennik'
        Title          = 'Make – cennik'
        Slug           = 'cennik'
        UrlPath        = '/narzedzia/make/cennik/'
        HeroHeading    = 'Make – cennik i limity policzone na scenariusze'
        HeroSubheading = 'Przeliczam operacje i kredyty na konkretne przepływy, zamiast zgadywać, czy plan będzie wystarczający do końca miesiąca.'
        SeoTitle       = 'Make – cennik i koszty utrzymania automatyzacji'
        SeoDescription = 'Dowiedz się, ile naprawdę kosztuje Make przy różnych wolumenach zadań, integracjach i środowiskach testowych.'
    }
    @{
        RelativeDir    = 'narzedzia\make\alternatywy'
        Title          = 'Make – alternatywy'
        Slug           = 'alternatywy'
        UrlPath        = '/narzedzia/make/alternatywy/'
        HeroHeading    = 'Alternatywy dla Make, gdy potrzebujesz czegoś prostszego lub mocniejszego'
        HeroSubheading = 'Porównuję inne platformy automatyzacji, żeby dobrać narzędzie do skali projektu, zespołu i budżetu.'
        SeoTitle       = 'Make – alternatywy dla różnych typów projektów'
        SeoDescription = 'Przegląd narzędzi, które mogą zastąpić Make w małych automatyzacjach, integracjach korporacyjnych i projektach no-code.'
    }
    @{
        RelativeDir    = 'narzedzia\make\faq'
        Title          = 'Make – FAQ'
        Slug           = 'faq'
        UrlPath        = '/narzedzia/make/faq/'
        HeroHeading    = 'Make – odpowiedzi na najczęstsze pytania przed startem'
        HeroSubheading = 'Wyjaśniam limity, bezpieczeństwo i typowe pułapki zanim zaczniesz podłączać pierwsze aplikacje.'
        SeoTitle       = 'Make – FAQ, ograniczenia i dobre praktyki'
        SeoDescription = 'Najczęstsze pytania o Make: jak liczone są operacje, co z danymi wrażliwymi i jak projektować stabilne scenariusze.'
    }
    @{
        RelativeDir    = 'narzedzia\make\scenariusze'
        Title          = 'Make – scenariusze'
        Slug           = 'scenariusze'
        UrlPath        = '/narzedzia/make/scenariusze/'
        HeroHeading    = 'Make – gotowe scenariusze, które możesz skopiować do swojego konta'
        HeroSubheading = 'Pokazuję przepływy, które faktycznie pracują w tle – od leadów z formularzy po automatyczne raporty i powiadomienia.'
        SeoTitle       = 'Make – przykładowe scenariusze automatyzacji'
        SeoDescription = 'Zainspiruj się konkretnymi scenariuszami Make do marketingu, sprzedaży, obsługi klienta i operacji w firmie.'
    }

    # =======================
    # ZAPIER
    # =======================
    @{
        RelativeDir    = 'narzedzia\zapier'
        Title          = 'Zapier – klasyk automatyzacji dla biznesu'
        Slug           = 'zapier'
        UrlPath        = '/narzedzia/zapier/'
        HeroHeading    = 'Zapier – klej, który spina Twoje aplikacje'
        HeroSubheading = 'Łączę Slacka, CRM i skrzynkę mailową w prostych automatyzacjach, które pracują za mnie także po godzinach.'
        SeoTitle       = 'Zapier – jak wykorzystuję go w codziennej pracy'
        SeoDescription = 'Opisuję, do czego realnie używam Zapiera: szybkie integracje, automatyzacje marketingu i ogarnianie powtarzalnych zadań.'
    }
    @{
        RelativeDir    = 'narzedzia\zapier\recenzja'
        Title          = 'Zapier – recenzja'
        Slug           = 'recenzja'
        UrlPath        = '/narzedzia/zapier/recenzja/'
        HeroHeading    = 'Zapier – recenzja z punktu widzenia małej firmy'
        HeroSubheading = 'Patrzę, ile czasu i błędów oszczędza mi Zapier w prostych, ale krytycznych procesach.'
        SeoTitle       = 'Zapier – recenzja po latach używania'
        SeoDescription = 'Plusy i minusy korzystania z Zapiera: wygoda, ograniczenia, stabilność i moment, w którym warto szukać czegoś innego.'
    }
    @{
        RelativeDir    = 'narzedzia\zapier\alternatywy'
        Title          = 'Zapier – alternatywy'
        Slug           = 'alternatywy'
        UrlPath        = '/narzedzia/zapier/alternatywy/'
        HeroHeading    = 'Co zamiast Zapiera, gdy ceny lub limity przestają się spinać'
        HeroSubheading = 'Zestawiam narzędzia, które lepiej radzą sobie z dużym ruchem, złożonymi flow lub niższym budżetem.'
        SeoTitle       = 'Zapier – alternatywy no-code do integracji'
        SeoDescription = 'Porównanie kluczowych alternatyw dla Zapiera: różnice w cenie, funkcjach, modelu rozliczeń i poziomie trudności.'
    }
    @{
        RelativeDir    = 'narzedzia\zapier\faq'
        Title          = 'Zapier – FAQ'
        Slug           = 'faq'
        UrlPath        = '/narzedzia/zapier/faq/'
        HeroHeading    = 'Zapier – odpowiedzi na pytania, które pojawiają się przy pierwszych automatyzacjach'
        HeroSubheading = 'Wyjaśniam, co liczy się jako zadanie, jak działają triggery i ile sensownie da się zrobić na darmowym planie.'
        SeoTitle       = 'Zapier – FAQ dla początkujących i zaawansowanych'
        SeoDescription = 'Najczęstsze pytania o Zapiera: bezpieczeństwo, integracje, limity, wersjonowanie scenariuszy i współpraca w zespole.'
    }
    @{
        RelativeDir    = 'narzedzia\zapier\oferta-uslug'
        Title          = 'Zapier – oferta usług wdrożeniowych'
        Slug           = 'oferta-uslug'
        UrlPath        = '/narzedzia/zapier/oferta-uslug/'
        HeroHeading    = 'Pomagam poukładać automatyzacje w Zapier tak, żeby naprawdę odciążyły zespół'
        HeroSubheading = 'Mapuję procesy, projektuję Zapy, wdrażam je na produkcję i zostawiam dokumentację zamiast chaosu.'
        SeoTitle       = 'Usługi wdrożenia Zapiera – projektowanie automatyzacji dla Twojej firmy'
        SeoDescription = 'Zobacz, jak mogę pomóc Ci poukładać automatyzacje w Zapier: od audytu procesów po stałe wsparcie i rozwój integracji.'
    }

    # =======================
    # SOFTR
    # =======================
    @{
        RelativeDir    = 'narzedzia\softr'
        Title          = 'Softr – budowanie aplikacji na Airtable bez kodu'
        Slug           = 'softr'
        UrlPath        = '/narzedzia/softr/'
        HeroHeading    = 'Softr – najszybsza droga od tabelki do aplikacji webowej'
        HeroSubheading = 'Zamiast briefować developerów, składam portal klienta albo panel wewnętrzny prosto z Airtable.'
        SeoTitle       = 'Softr – do czego używam go w projektach'
        SeoDescription = 'Pokazuję, kiedy Softr jest idealny: portale klientów, panele dla zespołu, katalogi i MVP aplikacji opartych na danych.'
    }
    @{
        RelativeDir    = 'narzedzia\softr\recenzja'
        Title          = 'Softr – recenzja'
        Slug           = 'recenzja'
        UrlPath        = '/narzedzia/softr/recenzja/'
        HeroHeading    = 'Softr – recenzja z perspektywy osoby od procesów, nie od pikseli'
        HeroSubheading = 'Interesuje mnie, czy klienci szybciej załatwią swoje sprawy, a zespół przestanie żyć w excelach.'
        SeoTitle       = 'Softr – recenzja po kilku wdrożeniach produkcyjnych'
        SeoDescription = 'Moje wrażenia z pracy w Softr: gdzie błyszczy, gdzie brakuje elastyczności i jak wypada w porównaniu z innymi builderami.'
    }
    @{
        RelativeDir    = 'narzedzia\softr\cennik'
        Title          = 'Softr – cennik'
        Slug           = 'cennik'
        UrlPath        = '/narzedzia/softr/cennik/'
        HeroHeading    = 'Softr – cennik przeliczony na realne projekty'
        HeroSubheading = 'Sprawdzam, ile kosztuje portal klienta, mały intranet czy MVP SaaS, a nie tylko plan Starter kontra Professional.'
        SeoTitle       = 'Softr – cennik i koszty utrzymania aplikacji'
        SeoDescription = 'Zobacz, jak kształtują się koszty Softr przy różnych liczbach użytkowników, widoków, integracji i środowisk.'
    }
    @{
        RelativeDir    = 'narzedzia\softr\alternatywy'
        Title          = 'Softr – alternatywy'
        Slug           = 'alternatywy'
        UrlPath        = '/narzedzia/softr/alternatywy/'
        HeroHeading    = 'Alternatywy dla Softr, gdy potrzebujesz więcej swobody albo innych baz danych'
        HeroSubheading = 'Porównuję buildery, które lepiej wspierają złożoną logikę, inne źródła danych lub pełne dopasowanie interfejsu.'
        SeoTitle       = 'Softr – alternatywy do budowy aplikacji bez kodu'
        SeoDescription = 'Przegląd narzędzi, które mogą zastąpić Softr przy budowaniu portali, aplikacji wewnętrznych i MVP produktów cyfrowych.'
    }
    @{
        RelativeDir    = 'narzedzia\softr\faq'
        Title          = 'Softr – FAQ'
        Slug           = 'faq'
        UrlPath        = '/narzedzia/softr/faq/'
        HeroHeading    = 'Softr – odpowiedzi na pytania, które zwykle słyszę od klientów'
        HeroSubheading = 'Od pytania o wydajność po migrację danych z Airtable – zbieram wszystko w jednym miejscu.'
        SeoTitle       = 'Softr – FAQ o wydajności, ograniczeniach i integracjach'
        SeoDescription = 'Najczęstsze pytania o Softr: limity, role użytkowników, bezpieczeństwo danych i scenariusze, w których lepiej wybrać inne narzędzie.'
    }

    # =======================
    # BUBBLE
    # =======================
    @{
        RelativeDir    = 'narzedzia\bubble'
        Title          = 'Bubble – budowa aplikacji webowych bez klasycznego developmentu'
        Slug           = 'bubble'
        UrlPath        = '/narzedzia/bubble/'
        HeroHeading    = 'Bubble – gdy Excel i prosty builder to już za mało'
        HeroSubheading = 'Projektuję pełnoprawne aplikacje webowe z logiką, workflowami i bazą danych, nadal bez pisania backendu.'
        SeoTitle       = 'Bubble – kiedy ma sens w projekcie'
        SeoDescription = 'Opisuję, w jakich projektach Bubble sprawdza się najlepiej: MVP SaaS, narzędzia wewnętrzne i produkty, które szybko ewoluują.'
    }
    @{
        RelativeDir    = 'narzedzia\bubble\recenzja'
        Title          = 'Bubble – recenzja'
        Slug           = 'recenzja'
        UrlPath        = '/narzedzia/bubble/recenzja/'
        HeroHeading    = 'Bubble – recenzja oczami osoby, która musi dowieźć produkt, nie tylko prototyp'
        HeroSubheading = 'Interesuje mnie, czy aplikacja zbudowana w Bubble da się utrzymać, rozwijać i przekazać innemu zespołowi.'
        SeoTitle       = 'Bubble – recenzja po budowie realnych aplikacji'
        SeoDescription = 'Moje doświadczenia z Bubble: krzywa uczenia, wydajność, wąskie gardła i sytuacje, w których no-code styka się z klasycznym developmentem.'
    }
    @{
        RelativeDir    = 'narzedzia\bubble\cennik'
        Title          = 'Bubble – cennik'
        Slug           = 'cennik'
        UrlPath        = '/narzedzia/bubble/cennik/'
        HeroHeading    = 'Bubble – cennik i koszty rosnącego produktu'
        HeroSubheading = 'Sprawdzam, jak zmienia się cena wraz z liczbą użytkowników, wersji środowisk i dodatkowymi wtyczkami.'
        SeoTitle       = 'Bubble – cennik planów i ukryte koszty'
        SeoDescription = 'Dowiedz się, ile kosztuje uruchomienie aplikacji w Bubble i z czym trzeba się liczyć, gdy produkt zaczyna rosnąć.'
    }
    @{
        RelativeDir    = 'narzedzia\bubble\alternatywy'
        Title          = 'Bubble – alternatywy'
        Slug           = 'alternatywy'
        UrlPath        = '/narzedzia/bubble/alternatywy/'
        HeroHeading    = 'Alternatywy dla Bubble, gdy nie potrzebujesz aż tyle mocy'
        HeroSubheading = 'Pokazuję narzędzia, które lepiej sprawdzą się przy prostszych portalach, marketplace-ach lub aplikacjach wewnętrznych.'
        SeoTitle       = 'Bubble – alternatywy no-code i low-code'
        SeoDescription = 'Przegląd platform, które mogą zastąpić Bubble, jeśli ważniejsze są prostota, niższy koszt lub szybkie wdrożenie.'
    }
    @{
        RelativeDir    = 'narzedzia\bubble\faq'
        Title          = 'Bubble – FAQ'
        Slug           = 'faq'
        UrlPath        = '/narzedzia/bubble/faq/'
        HeroHeading    = 'Bubble – odpowiedzi na pytania przed pierwszym dużym projektem'
        HeroSubheading = 'Rozjaśniam kwestie wydajności, skalowania, backupów i pracy zespołowej w jednym workspace.'
        SeoTitle       = 'Bubble – FAQ o skalowaniu, wydajności i ograniczeniach'
        SeoDescription = 'Najczęstsze pytania o Bubble: szybkość aplikacji, vendor lock-in, integracje z zewnętrznym backendem i migrację kodu.'
    }

    # =======================
    # GLIDE
    # =======================
    @{
        RelativeDir    = 'narzedzia\glide'
        Title          = 'Glide – aplikacje z arkusza kalkulacyjnego'
        Slug           = 'glide'
        UrlPath        = '/narzedzia/glide/'
        HeroHeading    = 'Glide – najszybszy sposób na mobilną aplikację z danych w arkuszu'
        HeroSubheading = 'Buduję proste aplikacje dla zespołu i klientów, startując od Google Sheets lub Airtable zamiast od repozytorium.'
        SeoTitle       = 'Glide – kiedy używam go w projektach'
        SeoDescription = 'Pokazuję, w jakich sytuacjach Glide sprawdza się najlepiej: proste CRM-y, katalogi, checklisty i aplikacje wewnętrzne.'
    }
    @{
        RelativeDir    = 'narzedzia\glide\recenzja'
        Title          = 'Glide – recenzja'
        Slug           = 'recenzja'
        UrlPath        = '/narzedzia/glide/recenzja/'
        HeroHeading    = 'Glide – recenzja z perspektywy szybkich MVP i narzędzi wewnętrznych'
        HeroSubheading = 'Sprawdzam, czy aplikacja z Glide jest wystarczająco wygodna w użyciu, żeby zespół naprawdę z niej korzystał.'
        SeoTitle       = 'Glide – recenzja po wdrożeniach w prawdziwych projektach'
        SeoDescription = 'Plusy i minusy Glide: prostota, ograniczenia layoutu, praca na danych i sytuacje, w których warto postawić na coś innego.'
    }
    @{
        RelativeDir    = 'narzedzia\glide\cennik'
        Title          = 'Glide – cennik'
        Slug           = 'cennik'
        UrlPath        = '/narzedzia/glide/cennik/'
        HeroHeading    = 'Glide – cennik widziany oczami małego zespołu'
        HeroSubheading = 'Porównuję koszty per użytkownik, per aplikacja i per projekt, zamiast skupiać się na nazwach planów.'
        SeoTitle       = 'Glide – cennik i koszty utrzymania aplikacji'
        SeoDescription = 'Dowiedz się, ile naprawdę kosztuje Glide przy rosnącej liczbie użytkowników, źródeł danych i tworzonych aplikacjach.'
    }
    @{
        RelativeDir    = 'narzedzia\glide\alternatywy'
        Title          = 'Glide – alternatywy'
        Slug           = 'alternatywy'
        UrlPath        = '/narzedzia/glide/alternatywy/'
        HeroHeading    = 'Alternatywy dla Glide, gdy potrzebujesz innego podejścia do aplikacji'
        HeroSubheading = 'Zestawiam buildery, które lepiej ogarniają customowy interfejs, zaawansowaną logikę lub inne typy baz danych.'
        SeoTitle       = 'Glide – alternatywy do budowy prostych aplikacji'
        SeoDescription = 'Przegląd narzędzi, które mogą zastąpić Glide w projektach mobilnych, wewnętrznych panelach i prostych CRM-ach.'
    }
    @{
        RelativeDir    = 'narzedzia\glide\faq'
        Title          = 'Glide – FAQ'
        Slug           = 'faq'
        UrlPath        = '/narzedzia/glide/faq/'
        HeroHeading    = 'Glide – odpowiedzi na pytania, które padają przed pierwszym wdrożeniem'
        HeroSubheading = 'Wyjaśniam limity wierszy, kwestie wydajności i to, co dzieje się z danymi, gdy projekt wychodzi poza MVP.'
        SeoTitle       = 'Glide – FAQ o limitach, danych i integracjach'
        SeoDescription = 'Najczęstsze pytania o Glide: jak działają limity, jakie źródła danych obsługuje i jak łączyć go z innymi narzędziami.'
    }

    # =======================
    # OUTSETA
    # =======================
    @{
        RelativeDir    = 'narzedzia\outseta'
        Title          = 'Outseta – zaplecze SaaS w jednym narzędziu'
        Slug           = 'outseta'
        UrlPath        = '/narzedzia/outseta/'
        HeroHeading    = 'Outseta – logowanie, subskrypcje i CRM w jednym miejscu'
        HeroSubheading = 'Zamiast kleić wiele usług, ogarniam płatności, konta użytkowników i wsparcie klienta w jednym panelu.'
        SeoTitle       = 'Outseta – do czego wykorzystuję ją w projektach SaaS'
        SeoDescription = 'Opisuję, kiedy Outseta ma największy sens: produkty subskrypcyjne, społeczności, aplikacje SaaS i projekty członkowskie.'
    }
    @{
        RelativeDir    = 'narzedzia\outseta\recenzja'
        Title          = 'Outseta – recenzja'
        Slug           = 'recenzja'
        UrlPath        = '/narzedzia/outseta/recenzja/'
        HeroHeading    = 'Outseta – recenzja z perspektywy twórcy produktów, a nie tylko marketera'
        HeroSubheading = 'Liczy się dla mnie to, czy mogę odpalić produkt szybciej, bez rezygnowania z porządku w danych o klientach.'
        SeoTitle       = 'Outseta – recenzja po wdrożeniach w realnych projektach'
        SeoDescription = 'Plusy i minusy Outseta: onboarding użytkowników, rozliczenia, wsparcie klienta i integracje z no-code builderami.'
    }
    @{
        RelativeDir    = 'narzedzia\outseta\cennik'
        Title          = 'Outseta – cennik'
        Slug           = 'cennik'
        UrlPath        = '/narzedzia/outseta/cennik/'
        HeroHeading    = 'Outseta – cennik w kontekście rosnącej bazy klientów'
        HeroSubheading = 'Sprawdzam, kiedy bardziej opłaca się pakiet all-in-one niż stos usług płatności, CRM i helpdesku.'
        SeoTitle       = 'Outseta – cennik i koszty utrzymania zaplecza SaaS'
        SeoDescription = 'Zobacz, ile kosztuje Outseta na start i jak zmienia się cena wraz ze wzrostem liczby użytkowników i przychodu.'
    }
    @{
        RelativeDir    = 'narzedzia\outseta\alternatywy'
        Title          = 'Outseta – alternatywy'
        Slug           = 'alternatywy'
        UrlPath        = '/narzedzia/outseta/alternatywy/'
        HeroHeading    = 'Alternatywy dla Outseta, gdy chcesz większą kontrolę nad stackiem'
        HeroSubheading = 'Porównuję rozwiązania, które pozwalają samodzielnie dobrać moduły płatności, CRM i wsparcia zamiast brać pakiet w całości.'
        SeoTitle       = 'Outseta – alternatywy dla zaplecza SaaS'
        SeoDescription = 'Przegląd narzędzi, które mogą zastąpić Outseta przy produktach subskrypcyjnych, społecznościach i aplikacjach webowych.'
    }
    @{
        RelativeDir    = 'narzedzia\outseta\faq'
        Title          = 'Outseta – FAQ'
        Slug           = 'faq'
        UrlPath        = '/narzedzia/outseta/faq/'
        HeroHeading    = 'Outseta – odpowiedzi na najczęstsze pytania przed wyborem platformy'
        HeroSubheading = 'Rozjaśniam kwestie podatków, walut, migracji z innych systemów i integracji z narzędziami no-code.'
        SeoTitle       = 'Outseta – FAQ o rozliczeniach, integracjach i migracjach'
        SeoDescription = 'Najczęstsze pytania o Outseta: obsługa wielu walut, integracje z builderami, migracja subskrypcji i bezpieczeństwo danych.'
    }

    # =======================
    # MEMBERSTACK
    # =======================
    @{
        RelativeDir    = 'narzedzia\memberstack'
        Title          = 'Memberstack – logowanie i subskrypcje dla stron no-code'
        Slug           = 'memberstack'
        UrlPath        = '/narzedzia/memberstack/'
        HeroHeading    = 'Memberstack – szybko dodaję logowanie i płatne treści do istniejącej strony'
        HeroSubheading = 'Buduję strefy członkowskie, kursy i społeczności na Webflow i innych builderach, bez własnego backendu.'
        SeoTitle       = 'Memberstack – w jakich projektach go używam'
        SeoDescription = 'Pokazuję, kiedy Memberstack ma sens: płatne treści, społeczności, proste SaaS-y i programy członkowskie.'
    }
    @{
        RelativeDir    = 'narzedzia\memberstack\recenzja'
        Title          = 'Memberstack – recenzja'
        Slug           = 'recenzja'
        UrlPath        = '/narzedzia/memberstack/recenzja/'
        HeroHeading    = 'Memberstack – recenzja z perspektywy twórcy produktów cyfrowych'
        HeroSubheading = 'Dla mnie ważne jest to, czy mogę szybko sprzedawać dostęp zamiast miesiącami dopieszczać backend logowania.'
        SeoTitle       = 'Memberstack – recenzja po wdrożeniach na żywych projektach'
        SeoDescription = 'Plusy i minusy Memberstack: elastyczność planów, UX logowania, integracje z builderami i wrażenia użytkowników.'
    }
    @{
        RelativeDir    = 'narzedzia\memberstack\cennik'
        Title          = 'Memberstack – cennik'
        Slug           = 'cennik'
        UrlPath        = '/narzedzia/memberstack/cennik/'
        HeroHeading    = 'Memberstack – cennik rozpisany na małe i większe społeczności'
        HeroSubheading = 'Przeliczam koszty na liczbę członków i przychód z subskrypcji, zamiast patrzeć tylko na limit projektów.'
        SeoTitle       = 'Memberstack – cennik i opłacalność przy różnych skalach'
        SeoDescription = 'Dowiedz się, jak działa cennik Memberstack i kiedy prowizje oraz limity zaczynają mocno wpływać na marżę.'
    }
    @{
        RelativeDir    = 'narzedzia\memberstack\alternatywy'
        Title          = 'Memberstack – alternatywy'
        Slug           = 'alternatywy'
        UrlPath        = '/narzedzia/memberstack/alternatywy/'
        HeroHeading    = 'Co zamiast Memberstack, gdy potrzebujesz innych płatności lub większej elastyczności'
        HeroSubheading = 'Porównuję narzędzia do stref członkowskich, które lepiej dogadują się z Twoim builderem lub modelem biznesowym.'
        SeoTitle       = 'Memberstack – alternatywy do budowy stref członkowskich'
        SeoDescription = 'Przegląd alternatywnych rozwiązań dla Memberstack: od prostych paywalli po rozbudowane platformy społecznościowe.'
    }
    @{
        RelativeDir    = 'narzedzia\memberstack\faq'
        Title          = 'Memberstack – FAQ'
        Slug           = 'faq'
        UrlPath        = '/narzedzia/memberstack/faq/'
        HeroHeading    = 'Memberstack – odpowiedzi na pytania przed startem społeczności'
        HeroSubheading = 'Wyjaśniam, jak działa logowanie, płatności, migracja użytkowników i integracje z istniejącą stroną.'
        SeoTitle       = 'Memberstack – FAQ o logowaniu, płatnościach i integracjach'
        SeoDescription = 'Najczęstsze pytania o Memberstack: obsługa planów, bezpieczeństwo danych, zgodność z RODO i współpraca z różnymi builderami.'
    }
)

foreach ($page in $pages) {
    New-ContentPage `
        -BasePath $basePath `
        -RelativeDir $page.RelativeDir `
        -Title $page.Title `
        -Slug $page.Slug `
        -UrlPath $page.UrlPath `
        -HeroHeading $page.HeroHeading `
        -HeroSubheading $page.HeroSubheading `
        -SeoTitle $page.SeoTitle `
        -SeoDescription $page.SeoDescription `
        -Template 'article' `
        -Draft:$false
}
