<# 
Tworzenie wpisów słownika (no-code) w formacie:
---
title: "<Tytuł>"
slug: "<slug-z-tytułu>"
path: "/glossary/<slug>/"
draft: false
template: "glossary"
date: "YYYY-MM-DD"
---
<Treść po polsku>

Używa katalogu, w którym leży skrypt.
#>

[CmdletBinding(DefaultParameterSetName = 'Single')]
param(
    # Tryb pojedynczy
    [Parameter(Mandatory = $true, ParameterSetName = 'Single')]
    [string]$Title,

    [Parameter(Mandatory = $true, ParameterSetName = 'Single')]
    [string]$Description,

    [Parameter(ParameterSetName = 'Single')]
    [string]$Date = (Get-Date -Format 'yyyy-MM-dd'),

    # Tryb wsadowy (CSV z kolumnami: Title,Description,Date)
    [Parameter(Mandatory = $true, ParameterSetName = 'Bulk')]
    [string]$CsvPath,

    # Nadpisywanie istniejącego index.md
    [switch]$Overwrite
)

# Ustal katalog pracy: tam, gdzie leży skrypt
$BasePath = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }

function Convert-ToSlug {
    param([Parameter(Mandatory = $true)][string]$InputText)

    # 1) Normalizacja i usunięcie znaków diakrytycznych (poza 'ł/Ł' – mapujemy ręcznie)
    $normalized = $InputText.Normalize([Text.NormalizationForm]::FormD)
    $sb = New-Object System.Text.StringBuilder
    foreach ($ch in $normalized.ToCharArray()) {
        $cat = [Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch)
        if ($cat -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
            [void]$sb.Append($ch)
        }
    }
    $noDiacritics = $sb.ToString()

    # 2) Ręczne mapowanie polskich wyjątków
    $noDiacritics = $noDiacritics.
        Replace('ł','l').Replace('Ł','L').
        Replace('ß','ss')

    # 3) Małe litery
    $lower = $noDiacritics.ToLowerInvariant()

    # 4) Spacje/underscores → myślniki
    $hyphens = ($lower -replace '[\s_]+','-')

    # 5) Usunięcie niedozwolonych znaków
    $clean = ($hyphens -replace '[^a-z0-9\-]','')

    # 6) Redukcja wielokrotnych myślników i obcięcie brzegów
    $slug = ($clean -replace '-{2,}','-').Trim('-')

    if ([string]::IsNullOrWhiteSpace($slug)) { throw "Nie można wygenerować slug’a z tekstu: '$InputText'." }
    return $slug
}

function New-GlossaryItem {
    param(
        [Parameter(Mandatory = $true)][string]$T,
        [Parameter(Mandatory = $true)][string]$D,
        [Parameter(Mandatory = $true)][string]$DateStr,
        [switch]$Force
    )

    # Walidacja daty (format YYYY-MM-DD)
    try {
        [void][DateTime]::ParseExact($DateStr, 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture)
    } catch {
        throw "Data '$DateStr' nie jest w formacie 'yyyy-MM-dd'."
    }

    $slug = Convert-ToSlug -InputText $T
    $folderPath = Join-Path $BasePath $slug
    if (-not (Test-Path $folderPath)) {
        New-Item -ItemType Directory -Path $folderPath | Out-Null
    }

    $filePath = Join-Path $folderPath 'index.md'
    if ((Test-Path $filePath) -and -not $Force) {
        Write-Warning "Plik już istnieje: $filePath  (użyj -Overwrite aby nadpisać)"
        return
    }

    # Zabezpieczenie podwójnych cudzysłowów w tytule
    $safeTitle = $T -replace '"','\"'

    $content = @"
---
title: "$safeTitle"
slug: "$slug"
path: "/glossary/$slug/"
draft: false
template: "glossary"
date: "$DateStr"
---

$D
"@

    # UTF-8 (bez BOM w PS7+; w PS5.1 może dodać BOM – jeśli to problem, użyj PS7)
    Set-Content -Path $filePath -Value $content -Encoding utf8
    Write-Host "✔ Utworzono: $filePath"
}

# Wykonanie: tryb pojedynczy lub wsadowy
switch ($PSCmdlet.ParameterSetName) {
    'Single' {
        New-GlossaryItem -T $Title -D $Description -DateStr $Date -Force:$Overwrite
    }
    'Bulk' {
        if (-not (Test-Path $CsvPath)) { throw "Nie znaleziono pliku CSV: $CsvPath" }
        $rows = Import-Csv -Path $CsvPath
        foreach ($row in $rows) {
            $t = $row.Title
            $d = $row.Description
            $dt = if ($row.Date) { $row.Date } else { (Get-Date -Format 'yyyy-MM-dd') }

            if ([string]::IsNullOrWhiteSpace($t) -or [string]::IsNullOrWhiteSpace($d)) {
                Write-Warning "Pominięto wiersz (brak Title lub Description)."
                continue
            }
            try {
                New-GlossaryItem -T $t -D $d -DateStr $dt -Force:$Overwrite
            } catch {
                Write-Warning "Błąd dla '$t': $($_.Exception.Message)"
            }
        }
    }
}
