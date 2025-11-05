<#
Scaffold sitemap structure for ProjektBezKodu.pl

- Creates directories and index.md pages for all sitemap hubs & leaves.
- Parses affiliate-programs.json to build /narzedzia/[slug]/ subtrees.
- Generates robots.txt and sitemap XML placeholders.

Params:
  -Root      : Target root directory (default .\ProjektBezKodu)
  -JsonPath  : Path to affiliate JSON (default .\affiliate-programs.json)
  -Domain    : Canonical site URL (default https://projektbezkodu.pl)
  -Force     : Overwrite existing files (switch)

Tested with PowerShell 7+, should work on Windows PowerShell 5+.
#>

param(
  [string]$Root = ".\ProjektBezKodu",
  [string]$JsonPath = ".\affiliate-programs.json",
  [string]$Domain = "https://projektbezkodu.pl",
  [switch]$Force
)

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Path $Root -Force | Out-Null

# ---------------------------
# Helpers
# ---------------------------

function To-TitleCase([string]$text) {
  if ([string]::IsNullOrWhiteSpace($text)) { return "Strona" }
  $t = ($text -replace '-', ' ')
  # Respect common acronyms
  $t = $t -replace '\bpl\b','PL' -replace '\bseo\b','SEO' -replace '\bcwv\b','CWV' -replace '\bcms\b','CMS' -replace '\bcro\b','CRO' -replace '\bai\b','AI' -replace '\bga4\b','GA4'
  return (Get-Culture).TextInfo.ToTitleCase($t.ToLower())
}

# Create a directory and an index.md inside it
function New-Index {
  param(
    [Parameter(Mandatory=$true)][AllowEmptyString()][string]$RelUrl,
    [string]$Title
  )
  $RelUrl = $RelUrl.Trim('/')  # e.g. 'narzedzia/webflow/recenzja'
  $dirPath = if ($RelUrl) { Join-Path $Root ($RelUrl -replace '/', [IO.Path]::DirectorySeparatorChar) } else { $Root }
  New-Item -ItemType Directory -Path $dirPath -Force | Out-Null

  if (-not $Title -or $Title.Trim().Length -eq 0) {
    $last = if ($RelUrl) { ($RelUrl.Split('/') | Where-Object { $_ })[-1] } else { "Strona Główna" }
    $Title = To-TitleCase($last)
  }
  $indexPath = Join-Path $dirPath "index.md"
  $pathForFm = if ($RelUrl) { "/$RelUrl/" } else { "/" }

  if (-not (Test-Path $indexPath) -or $Force) {
    $slug = if ($RelUrl) { ($RelUrl.Split('/') | Where-Object { $_ })[-1] } else { "" }
    $content = @"
---
title: '$Title'
slug: '$slug'
path: '$pathForFm'
draft: true
date: '$(Get-Date -Format "yyyy-MM-dd")'
---

# $Title

> Placeholder page for **$Title** at `$pathForFm`.
"@
    $content | Set-Content -Path $indexPath -Encoding utf8
    $script:PagesCreated++
  }
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

$PagesCreated = 0

# ---------------------------
# Static top-level pages
# ---------------------------

# Home + system pages
$StaticRoots = @(
  @{ path="";            title="ProjektBezKodu – Strona główna" },
  @{ path="o-nas";       title=$null },
  @{ path="kontakt";     title=$null },
  @{ path="newsletter";  title=$null },
  @{ path="mapa-strony"; title=$null },
  @{ path="polityka-prywatnosci"; title=$null },
  @{ path="regulamin";   title=$null },
  @{ path="zasady-afiliacji"; title=$null },
  @{ path="szukaj";      title=$null }
)
$StaticRoots | ForEach-Object {
  New-Index -RelUrl $_.path -Title $_.title
}

# Category hubs
$Categories = @(
  "site-builders","creative-tools","stock-media","image-cdn","forms","email",
  "seo-performance","ux-cro","automation","ecommerce","hosting-pl","landing-builders"
)
$Categories | ForEach-Object {
    $name = To-TitleCase $_
    New-Index -RelUrl "kategoria/$_" -Title "Kategoria: $name"
}

# Cornerstones / evergreen
$Cornerstones = @(
  "seo/przewodnik",
  "wydajnosc/przewodnik",
  "design-bez-kodu",
  "lead-gen/przewodnik",
  "cms-bez-kodu",
  "ecommerce-bez-kodu",
  "automatyzacje/przewodnik",
  "ai/przewodnik"
)
$Cornerstones | ForEach-Object { New-Index -RelUrl $_ -Title $null }

# Collection indexes
$Collections = @("narzedzia","poradniki","artykuly","porownania","przypadki-uzycia","szablony","do-pobrania","glossary","sciezki")
$Collections | ForEach-Object { New-Index -RelUrl $_ -Title $null }

# Glossary & learning paths
$GlossaryTerms = @("cms","cdn","cwv","schema","webhook")
$GlossaryTerms | ForEach-Object { New-Index -RelUrl "glossary/$_" -Title $null }

$LearningPaths = @("webflow-30-dni","framer-14-dni")
$LearningPaths | ForEach-Object { New-Index -RelUrl "sciezki/$_" -Title $null }

# Templates
$TemplatePages = @("webflow-saas","framer-agencja","relume-design-system")
$TemplatePages | ForEach-Object { New-Index -RelUrl "szablony/$_" -Title $null }

# Downloads (lead magnets)
$Downloads = @("checklista-seo","kalkulator-wyceny","brief-projektu","roadmapy","automatyzacje","polityka-cookies","prompty-ai")
$Downloads | ForEach-Object { New-Index -RelUrl "do-pobrania/$_" -Title $null }

# Case studies
$CaseStudies = @("saas-b2b","edukacja-kurs","agencja-kreatywna","d2c","ngo","webflow-b2b","framer-landing","relume-end-to-end","sklep-kursy-nocode","sklep-pl-inpost")
$CaseStudies | ForEach-Object { New-Index -RelUrl "przypadki-uzycia/$_" -Title $null }

# Comparisons (money pages)
$Comparisons = @(
  "webflow-vs-framer",
  "webflow-vs-wordpress",
  "framer-vs-wordpress",
  "wix-vs-webflow",
  "squarespace-vs-wix",
  "dorik-vs-carrd",
  "relume-vs-flowbase",
  "kapwing-vs-veed",
  "shutterstock-vs-envato-elements",
  "envato-elements-vs-creative-market",
  "storyblocks-vs-envato-video",
  "mailerlite-vs-convertkit",
  "getresponse-vs-mailerlite",
  "beehiiv-vs-convertkit",
  "semrush-vs-surfer",
  "fathom-vs-plausible-vs-ga4",
  "typeform-vs-tally-vs-jotform",
  "uploadcare-vs-cloudimage-vs-imageengine",
  "bunnycdn-vs-cloudflare",
  "unbounce-vs-instapage-vs-leadpages",
  "softr-vs-glide-vs-bubble",
  "shopify-vs-webflow-ecommerce",
  "nazwa-pl-vs-home-pl",
  "hostinger-vs-kinsta"
)
$Comparisons | ForEach-Object { New-Index -RelUrl "porownania/$_" -Title $null }

# ---------------------------
# Tools from affiliate JSON
# ---------------------------

# Default subpages for each tool hub
$DefaultSubpages = @("recenzja","cennik","alternatywy","faq")

# Slugs that DO NOT get a /cennik/
$NoPricing = @("canva-empower","plausible","bigcommerce","zapier","ovhcloud","freepik")

# Extra subpages by slug (from sitemap plan)
$ExtraBySlug = @{
  "webflow"              = @("seo","wydajnosc","cms-blog","ecommerce-pl","integracje","szablony");
  "framer"               = @("seo","ai-landing","formularze","szablony","animacje");
  "wix"                  = @("szablony");
  "squarespace"          = @("szablony");
  "dorik"                = @("onepage-templates","formularze-platnosci");
  "carrd"                = @("link-in-bio");
  "webnode"              = @("prosta-strona-pl");
  "relume"               = @("sitemap-ai","design-tokens","webflow-integracja","komponenty");
  "jetboost"             = @("cms-filtry-wyszukiwarka");
  "flowbase"             = @("komponenty-szablony");
  "adobe-creative-cloud" = @("express-vs-canva");
  "mailerlite"           = @("migracja","automatyzacje");
  "beehiiv"              = @("monetyzacja");
  "uploadcare"           = @("integracje");
  "bunny-net"            = @("statyczny-hosting-cdn");
  "jotform"              = @("integracje");
  "tally"                = @("kody-znizkowe");
  "semrush"              = @("keyword-research");
  "make"                 = @("scenariusze");
  "zapier"               = @("oferta-uslug");
  "shopify"              = @("platnosci-pl-inpost");
  "nazwa-pl"             = @("kody-rabatowe")
}

# Collect slugs from JSON (fallback to hardcoded if JSON missing)
$ProgramSlugs = @()
if (Test-Path $JsonPath) {
  try {
    $json = Get-Content $JsonPath -Raw | ConvertFrom-Json
    foreach ($cat in $json.categories) {
      foreach ($p in $cat.programs) { if ($p.slug) { $ProgramSlugs += $p.slug } }
    }
    $ProgramSlugs = $ProgramSlugs | Sort-Object -Unique
  } catch {
    Write-Warning "Nie udało się odczytać JSON: $_"
  }
}

if ($ProgramSlugs.Count -eq 0) {
  Write-Warning "Brak JSON lub pusty – używam listy zapasowej slugów."
  $ProgramSlugs = @(
    "webflow","framer","wix","squarespace","dorik","carrd","webnode","relume","jetboost","flowbase",
    "adobe-creative-cloud","canva-empower","descript","kapwing","veed",
    "shutterstock","envato-elements","creative-market","depositphotos","storyblocks","icons8","freepik",
    "uploadcare","cloudimage","imageengine","bunny-net",
    "jotform","typeform","tally","paperform",
    "mailerlite","getresponse","convertkit","aweber","beehiiv",
    "semrush","surfer","fathom","plausible",
    "hotjar","vwo","convert-com",
    "make","zapier","softr","bubble","glide","outseta","memberstack",
    "shopify","bigcommerce",
    "nazwa-pl","hostinger","home-pl","cyber-folks","ovhcloud","kinsta",
    "unbounce","leadpages","instapage"
  )
}

# Create /narzedzia/ trees
foreach ($slug in $ProgramSlugs) {
  New-Index -RelUrl "narzedzia/$slug" -Title (To-TitleCase($slug))

  # Decide which default subpages to include
  $subs = @()
  foreach ($s in $DefaultSubpages) {
    if ($s -eq "cennik" -and ($NoPricing -contains $slug)) { continue }
    $subs += $s
  }

  foreach ($sub in $subs) {
    New-Index -RelUrl "narzedzia/$slug/$sub" -Title (To-TitleCase("$slug $sub"))
  }

  if ($ExtraBySlug.ContainsKey($slug)) {
    foreach ($extra in $ExtraBySlug[$slug]) {
      New-Index -RelUrl "narzedzia/$slug/$extra" -Title (To-TitleCase("$slug $extra"))
    }
  }
}

# ---------------------------
# robots.txt and sitemaps
# ---------------------------

# robots.txt
$robots = @"
User-agent: *
Allow: /
Sitemap: $Domain/sitemap.xml
"@
New-TextFile -RelPath "robots.txt" -Content $robots

# /sitemap.xml (index)
$sitemapIndex = @"
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>$Domain/sitemaps/sitemap-static.xml</loc></sitemap>
  <sitemap><loc>$Domain/sitemaps/sitemap-kategorie.xml</loc></sitemap>
  <sitemap><loc>$Domain/sitemaps/sitemap-narzedzia.xml</loc></sitemap>
  <sitemap><loc>$Domain/sitemaps/sitemap-porownania.xml</loc></sitemap>
  <sitemap><loc>$Domain/sitemaps/sitemap-case-studies.xml</loc></sitemap>
  <sitemap><loc>$Domain/sitemaps/sitemap-szablony.xml</loc></sitemap>
  <sitemap><loc>$Domain/sitemaps/sitemap-downloads.xml</loc></sitemap>
  <sitemap><loc>$Domain/sitemaps/sitemap-glossary.xml</loc></sitemap>
</sitemapindex>
"@
New-TextFile -RelPath "sitemap.xml" -Content $sitemapIndex

# Placeholder child sitemaps
$childMaps = @(
  "sitemaps/sitemap-static.xml",
  "sitemaps/sitemap-kategorie.xml",
  "sitemaps/sitemap-narzedzia.xml",
  "sitemaps/sitemap-porownania.xml",
  "sitemaps/sitemap-case-studies.xml",
  "sitemaps/sitemap-szablony.xml",
  "sitemaps/sitemap-downloads.xml",
  "sitemaps/sitemap-glossary.xml"
)
$emptyUrlset = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
foreach ($m in $childMaps) { New-TextFile -RelPath $m -Content $emptyUrlset }

Write-Host "Done. Pages created (new or overwritten): $PagesCreated" -ForegroundColor Green
Write-Host "Root: $(Resolve-Path $Root)"
