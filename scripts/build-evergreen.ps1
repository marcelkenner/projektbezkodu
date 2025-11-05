<#
build-evergreen.ps1
Creates evergreen, non-affiliate content scaffolding inside the current directory (default: .).

Usage:
  pwsh ./build-evergreen.ps1
  pwsh ./build-evergreen.ps1 -Force
  pwsh ./build-evergreen.ps1 -CreateStatics -Domain "https://projektbezkodu.pl"

Notes:
- Idempotent: won't overwrite index.md unless -Force is provided.
- Adds research "data/template.csv" + "metodyka.md" for /badania/* pages.
- Safe to run multiple times.
#>

param(
  [string]$Root = ".",
  [switch]$Force,
  [switch]$CreateStatics,
  [string]$Domain = "https://projektbezkodu.pl"
)

$ErrorActionPreference = "Stop"

# ---------------------------
# Helpers
# ---------------------------

function To-TitleCase([string]$text) {
  if ([string]::IsNullOrWhiteSpace($text)) { return "Strona" }
  $t = ($text -replace '-', ' ' -replace '/', ' ')
  $t = $t -replace '\bpl\b','PL' -replace '\bseo\b','SEO' -replace '\bcwv\b','CWV' -replace '\bcms\b','CMS' -replace '\bcro\b','CRO' -replace '\bai\b','AI' -replace '\bga4\b','GA4' -replace '\butm\b','UTM'
  return (Get-Culture).TextInfo.ToTitleCase($t.ToLower())
}

function New-TextFile {
  param(
    [Parameter(Mandatory=$true)][string]$RelPath,
    [Parameter(Mandatory=$true)][string]$Content
  )
  $fsPath = Join-Path $Root ($RelPath -replace '/', [IO.Path]::DirectorySeparatorChar)
  $dir = Split-Path $fsPath -Parent
  if ($dir) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  if (-not (Test-Path $fsPath) -or $Force) {
    $Content | Set-Content -Path $fsPath -Encoding utf8
  }
}

function New-Index {
  param(
    [string]$RelUrl = "",
    [string]$Title,
    [string]$Type = "article",
    [string[]]$Tags = @("evergreen")
  )
  if ($null -eq $RelUrl) { $RelUrl = "" }
  $RelUrl = $RelUrl.Trim('/')
  $dirPath = if ($RelUrl) { Join-Path $Root ($RelUrl -replace '/', [IO.Path]::DirectorySeparatorChar) } else { $Root }
  New-Item -ItemType Directory -Path $dirPath -Force | Out-Null

  if (-not $Title -or $Title.Trim().Length -eq 0) {
    $last = if ($RelUrl) { ($RelUrl.Split('/') | Where-Object { $_ })[-1] } else { "Strona Główna" }
    $Title = To-TitleCase($last)
  }
  $indexPath = Join-Path $dirPath "index.md"
  $pathForFm = if ($RelUrl) { "/$RelUrl/" } else { "/" }
  $slug = if ($RelUrl) { ($RelUrl.Split('/') | Where-Object { $_ })[-1] } else { "" }

  $tagsYaml = @()
  foreach ($t in $Tags) { $tagsYaml += "'$t'" }
  $tagsLine = "[" + ($tagsYaml -join ", ") + "]"

  if (-not (Test-Path $indexPath) -or $Force) {
    $content = @"
---
title: '$Title'
slug: '$slug'
path: '$pathForFm'
type: '$Type'
tags: $tagsLine
draft: true
date: '$(Get-Date -Format "yyyy-MM-dd")'
---

# $Title

> Placeholder for **$Title** at \`$pathForFm\`.  
> Type: \`$Type\` • Tags: $($Tags -join ", ").
"@
    $content | Set-Content -Path $indexPath -Encoding utf8
    $script:PagesCreated++
  }
}

function New-ResearchScaffold {
  param(
    [Parameter(Mandatory=$true)][string]$RelUrl,
    [string[]]$Columns = @("id","name","note")
  )
  $base = $RelUrl.Trim('/')
  $dataDir = Join-Path $Root ($base -replace '/', [IO.Path]::DirectorySeparatorChar)
  $dataDir = Join-Path $dataDir "data"
  New-Item -ItemType Directory -Path $dataDir -Force | Out-Null

  $csvPath = Join-Path $dataDir "template.csv"
  $csvHeader = ($Columns -join ",") + "`n"
  if (-not (Test-Path $csvPath) -or $Force) {
    $csvHeader | Set-Content -Path $csvPath -Encoding utf8
    $script:DataFilesCreated++
  }

  $metodykaPath = Join-Path (Join-Path $Root ($RelUrl -replace '/', [IO.Path]::DirectorySeparatorChar)) "metodyka.md"
  if (-not (Test-Path $metodykaPath) -or $Force) {
@"
---
title: 'Metodyka: $(To-TitleCase($RelUrl.Split('/')[-1]))'
path: '/$($RelUrl.Trim('/'))/metodyka/'
type: 'research-methods'
draft: true
date: '$(Get-Date -Format "yyyy-MM-dd")'
---

## Cel
Opisz cel badania i pytania badawcze.

## Próba i zbieranie danych
- Zakres domen/branż:
- Okres:
- Narzędzia/pomiary:
- Kryteria wykluczeń:

## Metryki
Wypełnij kolumny zgodnie z \`data/template.csv\`.

## Replikowalność
Jak powtórzyć badanie + źródła surowych danych.
"@ | Set-Content -Path $metodykaPath -Encoding utf8
  }
}

$PagesCreated = 0
$DataFilesCreated = 0

# Ensure root exists
New-Item -ItemType Directory -Path $Root -Force | Out-Null

# ---------------------------
# Evergreen hubs & pages
# ---------------------------

$Hubs = @(
  @{
    hub="biblioteka"; title="Biblioteka sekcji i wzorców"; type="hub"; tags=@("evergreen","patterns");
    children=@(
      @{ path="sekcje/hero";                       title="Sekcje: Hero";                         type="template"  },
      @{ path="sekcje/cta";                        title="Sekcje: CTA";                          type="template"  },
      @{ path="sekcje/oferta";                     title="Sekcje: Oferta i korzyści";            type="template"  },
      @{ path="sekcje/cennik";                     title="Sekcje: Cennik";                       type="template"  },
      @{ path="sekcje/review-testimonials";        title="Sekcje: Referencje i social proof";    type="template"  },
      @{ path="sekcje/faq";                        title="Sekcje: FAQ";                          type="template"  },
      @{ path="sekcje/portfolio";                  title="Sekcje: Portfolio/Case studies";       type="template"  },
      @{ path="sekcje/formularze";                 title="Sekcje: Formularze";                   type="template"  },
      @{ path="sekcje/stopka";                     title="Sekcje: Stopka";                       type="template"  },
      @{ path="sekcje/nawigacja";                  title="Sekcje: Nawigacja";                    type="template"  },
      @{ path="sekcje/blog-list";                  title="Sekcje: Lista wpisów";                 type="template"  },
      @{ path="sekcje/above-the-fold-checklist";   title="Above the fold – checklista";          type="checklist" }
    )
  },
  @{
    hub="microcopy"; title="UX writing i microcopy (PL)"; type="hub"; tags=@("evergreen","copy");
    children=@(
      @{ path="cta-biblioteka";                    title="Biblioteka CTA (PL)";                  type="directory" },
      @{ path="formularze-bledy";                  title="Komunikaty błędów w formularzach";     type="template"  },
      @{ path="koszyk-i-platnosci";                title="Copy: koszyk i płatności";             type="template"  },
      @{ path="cookies-bannery";                   title="Bannery cookies – wzory";              type="template"  },
      @{ path="ty-vs-panstwo";                     title="Styl: Ty czy Państwo?";                type="guide"     },
      @{ path="404-500";                            title="Strony 404/500 – szablony";            type="template"  },
      @{ path="headline-swipe-file";               title="Bank nagłówków (PL)";                  type="directory" },
      @{ path="faq-builder";                       title="Jak pisać FAQ, które sprzedaje";       type="guide"     },
      @{ path="polskie-cudzyslowy-i-typografia";   title="Cudzysłowy i typografia PL";           type="guide"     }
    )
  },
  @{
    hub="architektura"; title="Architektura informacji i nawigacja"; type="hub"; tags=@("evergreen","ia");
    children=@(
      @{ path="sitemap-szablony";                  title="Szablony mapy serwisu";                type="template"  },
      @{ path="menu-wzorce";                       title="Wzorce menu";                          type="guide"     },
      @{ path="strona-uslugowa-szkielet";          title="Szkielet strony usługowej";            type="template"  },
      @{ path="landing-framework-7-sekcji";        title="Landing: framework 7 sekcji";          type="guide"     },
      @{ path="blog-taksonomia";                   title="Taksonomia bloga: kategorie i tagi";   type="guide"     },
      @{ path="brief-kreatywny";                   title="Brief kreatywny (PL)";                 type="template"  },
      @{ path="warsztat-stakeholderow";            title="Warsztat ze stakeholderami: agenda";   type="guide"     }
    )
  },
  @{
    hub="wydajnosc"; title="Wydajność i Core Web Vitals"; type="hub"; tags=@("evergreen","performance");
    children=@(
      @{ path="budzet-wagowy";                     title="Budżet wagowy strony (kalkulator)";    type="calculator"},
      @{ path="obrazy-abc";                        title="Obrazy: formaty, rozmiary, lazy-load"; type="guide"     },
      @{ path="czcionki";                          title="Optymalizacja czcionek";               type="guide"     },
      @{ path="skrypty-zewnetrzne";                title="Minimalizowanie skryptów zewnętrznych";type="guide"     },
      @{ path="above-the-fold";                    title="Above the fold: co ładować krytycznie";type="checklist" },
      @{ path="cwv-audyt";                         title="Audyt Core Web Vitals – protokół";     type="template"  },
      @{ path="antywzorce";                        title="Antywzorce wydajności";                type="guide"     },
      @{ path="checklist-mobilna";                 title="Checklista wydajności mobilnej";       type="checklist" }
    )
  },
  @{
    hub="zgodnosc"; title="Dostępność i zgodność (WCAG/RODO)"; type="hub"; tags=@("evergreen","compliance");
    children=@(
      @{ path="wcag-quickstart";                   title="WCAG: szybki start (lista)";           type="checklist" },
      @{ path="kontrast-kolory";                   title="Kontrast i kolor";                     type="guide"     },
      @{ path="klawiatura-nawigacja";              title="Nawigacja klawiaturą";                 type="guide"     },
      @{ path="aria-podstawy";                     title="ARIA: podstawy";                       type="guide"     },
      @{ path="cookies-teksty";                    title="Teksty cookies (PL)";                  type="template"  },
      @{ path="rodo-formularze";                   title="RODO: klauzule i zgody (PL)";          type="template"  },
      @{ path="dokumentacja-wdrozenia";            title="Dokumentacja wdrożenia";               type="template"  },
      @{ path="checklist-dla-klienta";             title="Checklista dla właściciela strony";    type="checklist" }
    )
  },
  @{
    hub="lokalne-seo"; title="Lokalne SEO (PL)"; type="hub"; tags=@("evergreen","local-seo");
    children=@(
      @{ path="nap";                               title="NAP: nazwa, adres, telefon";           type="guide"     },
      @{ path="struktura-wizytowki";               title="Struktura wizytówki / kontaktu";       type="guide"     },
      @{ path="mapa-i-dojazd";                     title="Mapa i dojazd – lekka implementacja";  type="template"  },
      @{ path="recenzje-klientow";                 title="Opinie klientów – jak zbierać";        type="guide"     },
      @{ path="strony-miasta";                     title="Landing ‘Usługa w Mieście’";           type="template"  },
      @{ path="faq-local";                         title="FAQ dla usług lokalnych";              type="template"  },
      @{ path="schema-localbusiness";              title="Schema LocalBusiness – pola";          type="guide"     },
      @{ path="zdjecia-i-galerie";                 title="Zdjęcia i galerie – dobre praktyki";   type="guide"     }
    )
  },
  @{
    hub="analityka"; title="Analityka i eksperymenty"; type="hub"; tags=@("evergreen","analytics");
    children=@(
      @{ path="taksonomia-zdarzen";                title="Taksonomia zdarzeń (słownik)";         type="template"  },
      @{ path="cele-i-kpi";                        title="Cele i KPI dla stron";                 type="guide"     },
      @{ path="plan-pomiaru";                      title="Measurement plan (PL)";                type="template"  },
      @{ path="utmy-standaryzacja";                title="Standaryzacja UTM";                    type="template"  },
      @{ path="eksperyment-a-b";                   title="Jak projektować testy A/B";            type="guide"     },
      @{ path="kalendarz-raportow";                title="Kalendarz raportów";                   type="template"  },
      @{ path="dashboards-starter";                title="Starter dashboardów";                  type="template"  }
    )
  },
  @{
    hub="playbooki"; title="Playbooki branżowe (PL)"; type="hub"; tags=@("evergreen","playbooks");
    children=@(
      @{ path="dentysta";                          title="Playbook: dentysta";                   type="playbook"  },
      @{ path="kancelaria";                        title="Playbook: kancelaria prawna";          type="playbook"  },
      @{ path="ksiegowosc";                        title="Playbook: księgowość";                 type="playbook"  },
      @{ path="budowlanka";                        title="Playbook: budowlanka";                 type="playbook"  },
      @{ path="fryzjer-kosmetyka";                 title="Playbook: fryzjer/kosmetyka";          type="playbook"  },
      @{ path="szkola-jezykowa";                   title="Playbook: szkoła językowa";            type="playbook"  },
      @{ path="trener-kurs-online";                title="Playbook: trener/kurs online";         type="playbook"  },
      @{ path="ngo";                                title="Playbook: NGO";                        type="playbook"  },
      @{ path="it-software-house";                 title="Playbook: software house";             type="playbook"  },
      @{ path="hotel-gastro";                      title="Playbook: hotel/gastro";               type="playbook"  }
    )
  },
  @{
    hub="design-system"; title="Design system (agnostyczny)"; type="hub"; tags=@("evergreen","design-system");
    children=@(
      @{ path="typografia-pl";                     title="Typografia PL: fonty i ligatury";      type="guide"     },
      @{ path="siatka-i-spacing";                  title="Siatka i spacing";                     type="guide"     },
      @{ path="kolory-i-kontrast";                 title="Paleta kolorów i kontrast";            type="guide"     },
      @{ path="ikony-i-ilustracje";                title="Ikony i ilustracje";                   type="guide"     },
      @{ path="przyciski-i-stany";                 title="Przyciski i stany";                    type="template"  },
      @{ path="formularze";                        title="Formularze i walidacja";               type="template"  },
      @{ path="karty-i-listy";                     title="Karty i listy";                        type="template"  },
      @{ path="tokens-starter";                    title="Starter design tokens";                 type="template"  }
    )
  },
  @{
    hub="content"; title="Strategia treści i dystrybucja"; type="hub"; tags=@("evergreen","content");
    children=@(
      @{ path="kalendarium-12-tyg";                title="Kalendarium 12 tygodni";               type="template"  },
      @{ path="hub-spoke";                         title="Model hub & spoke";                     type="guide"     },
      @{ path="repurposing";                       title="Repurposing treści";                   type="guide"     },
      @{ path="outline-frameworks";                title="Szablony outline’ów artykułów";        type="template"  },
      @{ path="og-image-templates";                title="Szablony OG-image";                    type="template"  },
      @{ path="brand-voice";                       title="Głos marki (tone of voice)";           type="guide"     },
      @{ path="editorial-checklist";               title="Editorial checklist";                  type="checklist" }
    )
  },
  @{
    hub="proces"; title="Proces i zarządzanie projektem"; type="hub"; tags=@("evergreen","process");
    children=@(
      @{ path="7-krokow-wdrozenia";                title="7 kroków wdrożenia strony";            type="guide"     },
      @{ path="qa-checklist";                      title="QA checklist przed publikacją";        type="checklist" },
      @{ path="kickoff-workshop";                  title="Kickoff: agenda i materiały";          type="template"  },
      @{ path="oferta-i-umowa";                    title="Oferta i umowa (wzory)";               type="template"  },
      @{ path="wycena-kalkulator";                 title="Kalkulator wyceny";                    type="calculator"},
      @{ path="retencja-i-opieka";                 title="Retencja i opieka powdrożeniowa";      type="guide"     },
      @{ path="biblioteka-briefow";                title="Biblioteka briefów (branże)";          type="directory" }
    )
  },
  @{
    hub="badania"; title="Badania i raporty (PL)"; type="hub"; tags=@("evergreen","research");
    children=@(
      @{ path="stan-nocode-w-polsce";              title="Stan no‑code w Polsce (raport)";       type="research"; columns=@("company","segment","use_case","stack","team_size","budget_pln","notes") },
      @{ path="benchmark-szybkosci-pl";            title="Benchmark szybkości (CWV) – PL";       type="research"; columns=@("url","category","lcp_ms","cls","ttfb_ms","pagespeed_score","notes") },
      @{ path="ux-formularze-pl";                  title="UX formularzy w PL";                   type="research"; columns=@("site","form_type","fields_total","required_fields","optional_fields","conversion_rate","notes") },
      @{ path="copy-strony-glowne";                 title="Nagłówki na stronach głównych PL";     type="research"; columns=@("homepage_url","headline_text","subheadline","word_count","category","notes") },
      @{ path="wzorce-landingow";                  title="Wzorce landingów a konwersja";         type="research"; columns=@("landing_url","pattern","order","variant","conversion_proxy","notes") },
      @{ path="koszty-wdrozenia-pl";               title="Koszty wdrożenia stron w PL";          type="research"; columns=@("project_type","scope","price_pln_min","price_pln_max","lead_time_weeks","region","notes") }
    )
  },
  @{
    hub="narzedzia-dla-tworcow"; title="Narzędzia dla twórców (interaktywne)"; type="hub"; tags=@("evergreen","tools");
    children=@(
      @{ path="kalkulator-roi-szybkosci";          title="Kalkulator ROI szybkości";             type="calculator"},
      @{ path="headline-score-pl";                 title="Ocena nagłówków (PL)";                 type="tool"      },
      @{ path="contrast-tester";                   title="Tester kontrastu";                     type="tool"      },
      @{ path="utm-builder";                       title="Builder UTM";                          type="tool"      },
      @{ path="brief-generator";                   title="Generator briefu";                      type="tool"      },
      @{ path="sitemap-generator";                 title="Generator mapy serwisu";               type="tool"      },
      @{ path="pageweight-budget";                 title="Budżet wagowy – kalkulator";           type="calculator"},
      @{ path="launch-checker";                    title="Launch checker (interaktywny)";        type="checklist" }
    )
  },
  @{
    hub="zasoby"; title="Zasoby i katalogi (PL)"; type="hub"; tags=@("evergreen","resources");
    children=@(
      @{ path="agencje-nocode-pl";                 title="Katalog agencji no‑code (PL)";         type="directory" },
      @{ path="grupy-i-spolecznosci";              title="Grupy i społeczności";                 type="directory" },
      @{ path="wydarzenia-meetupy";                title="Wydarzenia i meet‑upy";                 type="directory" },
      @{ path="staze-i-praca";                     title="Staże i praca";                        type="directory" },
      @{ path="banery-og";                         title="Szablony banerów OG‑image";            type="template"  },
      @{ path="polskie-ikony-i-znaki";             title="Polskie ikony i znaki";                type="directory" },
      @{ path="prawne-wzory";                      title="Wzory dokumentów (PL)";                type="template"  }
    )
  }
)

# Create hubs and pages
foreach ($h in $Hubs) {
  New-Index -RelUrl $h.hub -Title $h.title -Type $h.type -Tags $h.tags
  foreach ($c in $h.children) {
    $rel = "$($h.hub)/$($c.path)"
    $tags = @("evergreen",$h.hub)
    if ($c.ContainsKey("columns")) { $tags += "research" }
    New-Index -RelUrl $rel -Title $c.title -Type $c.type -Tags $tags
    if ($c.ContainsKey("columns")) {
      New-ResearchScaffold -RelUrl $rel -Columns $c.columns
    }
  }
}

# ---------------------------
# Optional: Static files (robots + sitemap index)
# ---------------------------
if ($CreateStatics) {
  $robots = @"
User-agent: *
Allow: /
Sitemap: $Domain/sitemap.xml
"@
  New-TextFile -RelPath "robots.txt" -Content $robots

  $sitemapIndex = @"
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>$Domain/sitemaps/sitemap-static.xml</loc></sitemap>
  <sitemap><loc>$Domain/sitemaps/sitemap-evergreen.xml</loc></sitemap>
</sitemapindex>
"@
  New-TextFile -RelPath "sitemap.xml" -Content $sitemapIndex
  New-TextFile -RelPath "sitemaps/sitemap-static.xml" -Content '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
  New-TextFile -RelPath "sitemaps/sitemap-evergreen.xml" -Content '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
}

Write-Host "Evergreen scaffolding completed." -ForegroundColor Green
Write-Host ("Pages created (new or overwritten): {0}" -f $PagesCreated)
if ($DataFilesCreated -gt 0) { Write-Host ("Research data templates created: {0}" -f $DataFilesCreated) }
Write-Host ("Root: {0}" -f (Resolve-Path $Root))
