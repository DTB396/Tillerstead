param(
    [string]$Root = (Get-Location).Path,
    [string]$ReportDir = ".\_audit"
)

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null

function Out-Report($name, $content) {
    $path = Join-Path $ReportDir $name
    $content | Out-File -FilePath $path -Encoding UTF8
    Write-Host "Wrote $path"
}

Write-Host "Auditing repo: $Root"

# --- 1) Find all YAML/YML and attempt to parse (flags syntax errors)
$yamlFiles = Get-ChildItem -Path $Root -Recurse -File -Include *.yml, *.yaml `
| Where-Object { $_.FullName -notmatch "\\(node_modules|vendor|_site)\\"

}

$yamlParseFailures = @()
foreach ($f in $yamlFiles) {
    try {
        # This catches many YAML errors quickly in PowerShell
        # Note: ConvertFrom-Yaml exists in PowerShell 7+. If missing, we still do basic checks below.
        if (Get-Command ConvertFrom-Yaml -ErrorAction SilentlyContinue) {
            Get-Content $f.FullName -Raw | ConvertFrom-Yaml | Out-Null
        }
        else {
            # fallback: basic invalid tab check + colon-in-key heuristics
            $raw = Get-Content $f.FullName -Raw
            if ($raw -match "`t") { throw "Contains TAB characters (YAML forbids tabs for indentation)." }
            if ($raw -match "^\s*[^#\r\n]+:\s*[^#\r\n]+:\s*[^#\r\n]+$" -and $raw -notmatch "^\s*https?://") {
                # heuristic only; won't catch everything
            }
        }
    }
    catch {
        $yamlParseFailures += [pscustomobject]@{
            file  = $f.FullName
            error = $_.Exception.Message
        }
    }
}
Out-Report "yaml-parse-failures.txt" ($yamlParseFailures | Format-List | Out-String)

# --- 2) Find files with front matter issues (--- blocks)
$fmFiles = Get-ChildItem -Path $Root -Recurse -File -Include *.html, *.md, *.markdown `
| Where-Object { $_.FullName -notmatch "\\(node_modules|vendor|_site)\\"
}

$frontMatterProblems = @()
foreach ($f in $fmFiles) {
    $lines = Get-Content $f.FullName -TotalCount 80
    if ($lines.Count -ge 2 -and $lines[0].Trim() -eq "---") {
        # find closing ---
        $closeIndex = ($lines | Select-String -Pattern "^\s*---\s*$" | Select-Object -Skip 1 -First 1).LineNumber
        if (-not $closeIndex) {
            $frontMatterProblems += [pscustomobject]@{
                file  = $f.FullName
                issue = "Front matter opens with --- but has no closing --- in first 80 lines."
            }
        }
    }
}
Out-Report "front-matter-problems.txt" ($frontMatterProblems | Format-List | Out-String)

# --- 3) Detect duplicate YAML “baseline” copies by hash
$hashes = @{}
$dupes = @()
foreach ($f in $yamlFiles) {
    $h = (Get-FileHash $f.FullName -Algorithm SHA256).Hash
    if ($hashes.ContainsKey($h)) {
        $dupes += [pscustomobject]@{
            hash = $h
            a    = $hashes[$h]
            b    = $f.FullName
        }
    }
    else {
        $hashes[$h] = $f.FullName
    }
}
Out-Report "yaml-duplicates-by-hash.txt" ($dupes | Format-Table -AutoSize | Out-String)

# --- 4) Detect encoding weirdness markers (common Windows mis-decode)
$encodingHits = @()
foreach ($f in (Get-ChildItem -Path $Root -Recurse -File -Include *.yml, *.yaml, *.html, *.md, *.scss, *.css `
        | Where-Object { $_.FullName -notmatch "\\(node_modules|vendor|_site)\\"
        })) {
    $raw = Get-Content $f.FullName -Raw
    if ($raw -match "â€” | â€™ | â€œ | â€� | Â ") {
    $encodingHits += $f.FullName
  }
}
Out-Report "encoding-suspects.txt" ($encodingHits | Sort-Object | Out-String)

# --- 5) CSS mismatch scan: "utility classes" referenced in includes/pages that you may not define
$utilityPatterns = @("md:grid-cols-", "sm:", "lg:", "xl:", "2xl:", "gap-\d+", "p-\d+", "rounded-\w+", "text-\w+")
$utilityHits = @()
foreach ($f in (Get-ChildItem -Path $Root -Recurse -File -Include *.html,*.md `
  | Where-Object { $_.FullName -notmatch "\\(node_modules | vendor | _site)\\"
})) {
  $raw = Get-Content $f.FullName -Raw
  foreach ($pat in $utilityPatterns) {
    if ($raw -match $pat) {
      $utilityHits += [pscustomobject]@{ file = $f.FullName; pattern = $pat }
    }
  }
}
Out-Report "possible-tailwind-utility-usage.txt" ($utilityHits | Sort-Object file,pattern | Format-Table -AutoSize | Out-String)

# --- 6) Jekyll dry run build (if available) – captures errors in one place
try {
  $jekyll = Get-Command bundle -ErrorAction SilentlyContinue
  if ($jekyll) {
    Write-Host "Running: bundle exec jekyll build --trace"
    $buildOut = & bundle exec jekyll build --trace 2>&1
    Out-Report "jekyll-build-trace.txt" ($buildOut | Out-String)
  } else {
    Out-Report "jekyll-build-trace.txt" "bundle not found in PATH"
  }
} catch {
  Out-Report "jekyll-build-trace.txt" ("Build threw exception:`n" + $_.Exception.Message)
}

Write-Host "`nAudit done. Review files in $ReportDir"
