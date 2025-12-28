<#
.SYNOPSIS
  Repo audit for Jekyll sites: YAML, front matter, dupes, encoding suspects, and build trace.

.DESCRIPTION
  -Fast mode runs quick checks suitable for pre-commit.
  Full mode runs deeper checks including Ruby Psych YAML parsing and Jekyll build trace.

.NOTES
  PowerShell 5.1+ compatible.
  Uses Ruby Psych (same YAML parser Jekyll uses) when ruby is available (full mode).
#>

[CmdletBinding()]
param(
  [string]$Root = (Get-Location).Path,
  [string]$ReportDir = ".\_audit",
  [switch]$Fast
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

function Ensure-Dir([string]$Path) {
  New-Item -ItemType Directory -Force -Path $Path | Out-Null
}

function Out-Report([string]$Name, [object]$Content) {
  $path = Join-Path $ReportDir $Name

  $text =
  if ($null -eq $Content) { "" }
  elseif ($Content -is [string]) { $Content }
  else { ($Content | Out-String) }

  $text | Out-File -FilePath $path -Encoding UTF8
  Write-Host ("Wrote " + $path)
}

function Try-GetCommand([string]$Name) {
  Get-Command $Name -ErrorAction SilentlyContinue
}

function Read-FileRawSafe([string]$Path) {
  try {
    $bytes = [System.IO.File]::ReadAllBytes($Path)
    return [System.Text.Encoding]::UTF8.GetString($bytes)
  }
  catch {
    return (Get-Content -Raw -Path $Path -ErrorAction SilentlyContinue)
  }
}

function Get-RepoFiles {
  param(
    [string[]]$Include,
    [string[]]$ExcludeDirNames
  )

  $excludeRegex = "\\(" + (($ExcludeDirNames | ForEach-Object { [regex]::Escape($_) }) -join "|") + ")\\"


  Get-ChildItem -Path $Root -Recurse -File -Include $Include |
  Where-Object { $_.FullName -notmatch $excludeRegex }
}

function Get-Sha256([string]$Path) {
  (Get-FileHash -Algorithm SHA256 -Path $Path).Hash
}

function Invoke-RubyYamlFileCheck {
  param([string]$YamlPath)

  $ruby = Try-GetCommand "ruby"
  if (-not $ruby) { return "ruby not found" }

  $script = @"
begin
  require 'yaml'
  YAML.load_file(ARGV[0])
  puts 'OK'
rescue Exception => e
  puts e.message
  exit 1
end
"@

  $tmp = [System.IO.Path]::GetTempFileName() + ".rb"
  [System.IO.File]::WriteAllText($tmp, $script, [System.Text.Encoding]::UTF8)

  try {
    $out = & ruby $tmp $YamlPath 2>&1
    if ($LASTEXITCODE -ne 0) { return ($out | Out-String).Trim() }
    return $null
  }
  finally {
    Remove-Item -Force -ErrorAction SilentlyContinue $tmp
  }
}

function Invoke-RubyYamlStringCheck {
  param([string]$YamlString)

  $ruby = Try-GetCommand "ruby"
  if (-not $ruby) { return "ruby not found" }

  $script = @"
begin
  require 'yaml'
  y = STDIN.read
  YAML.safe_load(y, aliases: true)
  puts 'OK'
rescue Exception => e
  puts e.message
  exit 1
end
"@

  $tmp = [System.IO.Path]::GetTempFileName() + ".rb"
  [System.IO.File]::WriteAllText($tmp, $script, [System.Text.Encoding]::UTF8)

  try {
    $out = $YamlString | & ruby $tmp 2>&1
    if ($LASTEXITCODE -ne 0) { return ($out | Out-String).Trim() }
    return $null
  }
  finally {
    Remove-Item -Force -ErrorAction SilentlyContinue $tmp
  }
}

function Extract-FrontMatterYaml {
  param([string]$RawText)

  if (-not $RawText) { return $null }

  $lines = $RawText -split "`r?`n"
  if ($lines.Count -lt 3) { return $null }
  if ($lines[0].Trim() -ne "---") { return $null }

  $close = $null
  for ($i = 1; $i -lt $lines.Count; $i++) {
    if ($lines[$i].Trim() -eq "---") { $close = $i; break }
  }

  if ($null -eq $close) { return "__NO_CLOSE__" }
  if ($close -le 1) { return "" }

  return ($lines[1..($close - 1)] -join "`n")
}

function Find-FrontMatterCloseProblems {
  param([object[]]$Files, [int]$MaxLines = 200)

  $problems = New-Object System.Collections.Generic.List[object]
  foreach ($f in $Files) {
    # Fast path: only read first MaxLines lines
    $lines = @(Get-Content -Path $f.FullName -TotalCount $MaxLines -ErrorAction SilentlyContinue)
    if ($lines.Count -ge 1 -and $lines[0].Trim() -eq "---") {
      $closeCount = ($lines | Select-String -Pattern '^\s*---\s*$').Count
      if ($closeCount -lt 2) {
        $problems.Add([pscustomobject]@{
            file  = $f.FullName
            issue = "Front matter opens with --- but has no closing --- within first $MaxLines lines."
          })
      }
    }
  }
  return $problems
}

function Quick-YamlTabScan {
  param([object[]]$Files)

  $hits = New-Object System.Collections.Generic.List[object]
  foreach ($f in $Files) {
    $raw = Read-FileRawSafe $f.FullName
    if ($raw -match "`t") {
      $hits.Add([pscustomobject]@{
          file  = $f.FullName
          error = "Contains TAB characters (YAML forbids tabs for indentation)."
        })
    }
  }
  return $hits
}

# ----------------------------
# Start
# ----------------------------
$ExcludeDirs = @("node_modules", "vendor", "_site", ".git", ".bundle", ".jekyll-cache")

Ensure-Dir $ReportDir

Write-Host ("Auditing repo: " + $Root + ($(if ($Fast) { " (FAST)" } else { "" })))
Out-Report "audit-meta.txt" ("Root: $Root`r`nMode: " + ($(if ($Fast) { "FAST" } else { "FULL" })) + "`r`nDate: " + (Get-Date).ToString("yyyy-MM-dd HH:mm:ss"))

# Filesets
$yamlFiles = Get-RepoFiles -Include @("*.yml", "*.yaml") -ExcludeDirNames $ExcludeDirs
$fmFiles = Get-RepoFiles -Include @("*.html", "*.md", "*.markdown") -ExcludeDirNames $ExcludeDirs
$markupFiles = Get-RepoFiles -Include @("*.html", "*.md") -ExcludeDirNames $ExcludeDirs
$scanFiles = Get-RepoFiles -Include @("*.yml", "*.yaml", "*.html", "*.md", "*.scss", "*.css", "*.js") -ExcludeDirNames $ExcludeDirs

# ----------------------------
# 1) YAML checks
#   FAST: tabs-only scan (cheap)
#   FULL: Ruby Psych load_file for all YAML
# ----------------------------
$yamlParseFailures = New-Object System.Collections.Generic.List[object]

# Always do a tab scan (catches a lot of YAML failures quickly)
$tabHits = Quick-YamlTabScan -Files $yamlFiles
foreach ($h in $tabHits) { $yamlParseFailures.Add($h) }

if (-not $Fast) {
  foreach ($f in $yamlFiles) {
    $err = Invoke-RubyYamlFileCheck -YamlPath $f.FullName
    if ($err -and $err -ne "ruby not found") {
      $yamlParseFailures.Add([pscustomobject]@{ file = $f.FullName; error = $err })
    }
  }
}

Out-Report "yaml-parse-failures.txt" ($yamlParseFailures | Sort-Object file | Format-List | Out-String)

# ----------------------------
# 2) Front matter checks
#   FAST: only check open/close markers within first N lines
#   FULL: also YAML-parse the FM block via Ruby Psych
# ----------------------------
$frontMatterProblems = New-Object System.Collections.Generic.List[object]

$closeProblems = Find-FrontMatterCloseProblems -Files $fmFiles -MaxLines 200
foreach ($p in $closeProblems) { $frontMatterProblems.Add($p) }

if (-not $Fast) {
  foreach ($f in $fmFiles) {
    $raw = Read-FileRawSafe $f.FullName
    $yaml = Extract-FrontMatterYaml $raw

    if ($yaml -eq "__NO_CLOSE__") {
      # already reported by fast scan most likely, but keep consistent
      $frontMatterProblems.Add([pscustomobject]@{ file = $f.FullName; issue = "Front matter opens with --- but has no closing ---." })
      continue
    }

    if ($yaml -ne $null -and $yaml.Trim().Length -gt 0) {
      $err = Invoke-RubyYamlStringCheck -YamlString $yaml
      if ($err -and $err -ne "ruby not found") {
        $frontMatterProblems.Add([pscustomobject]@{ file = $f.FullName; issue = "Front matter YAML parse failed"; error = $err })
      }
    }
  }
}

Out-Report "front-matter-problems.txt" ($frontMatterProblems | Sort-Object file | Format-List | Out-String)

# ----------------------------
# 3) Duplicate YAML + baseline vs _data overlap (FULL only)
# ----------------------------
if (-not $Fast) {
  $hashToFiles = @{}
  foreach ($f in $yamlFiles) {
    $h = Get-Sha256 $f.FullName
    if (-not $hashToFiles.ContainsKey($h)) {
      $hashToFiles[$h] = New-Object System.Collections.Generic.List[string]
    }
    $hashToFiles[$h].Add($f.FullName)
  }

  $dupes = New-Object System.Collections.Generic.List[object]
  foreach ($kvp in $hashToFiles.GetEnumerator()) {
    if ($kvp.Value.Count -gt 1) {
      $dupes.Add([pscustomobject]@{
          hash  = $kvp.Key
          count = $kvp.Value.Count
          files = ($kvp.Value -join "`n")
        })
    }
  }
  Out-Report "yaml-duplicates-by-hash.txt" ($dupes | Sort-Object count -Descending | Format-List | Out-String)

  $baseline = $yamlFiles | Where-Object { $_.FullName -match "\\docs\\baseline\\" }
  $data = $yamlFiles | Where-Object { $_.FullName -match "\\_data\\" }

  $baselineByName = @{}
  foreach ($f in $baseline) { $baselineByName[$f.Name] = $f.FullName }

  $baselineDataOverlap = New-Object System.Collections.Generic.List[object]
  foreach ($d in $data) {
    if ($baselineByName.ContainsKey($d.Name)) {
      $bPath = $baselineByName[$d.Name]
      $baselineDataOverlap.Add([pscustomobject]@{
          name     = $d.Name
          baseline = $bPath
          data     = $d.FullName
          sameHash = ((Get-Sha256 $bPath) -eq (Get-Sha256 $d.FullName))
        })
    }
  }
  Out-Report "baseline-vs-data-overlap.txt" ($baselineDataOverlap | Sort-Object name | Format-Table -AutoSize | Out-String)
}
else {
  # keep file present for tooling consistency
  Out-Report "yaml-duplicates-by-hash.txt" "FAST mode: skipped"
  Out-Report "baseline-vs-data-overlap.txt" "FAST mode: skipped"
}

# ----------------------------
# 4) Encoding suspects
#   FAST: check a smaller subset (config + pages + includes + sass)
#   FULL: scan broad file set
# ----------------------------
$encodingHits = New-Object System.Collections.Generic.List[object]
$mojibakeCharPattern = "[\u00A0\u00C2\u00C3\u00E2\u2013\u2014\u2018\u2019\u201C\u201D]"

$targets =
if ($Fast) {
  $fastTargets = @()
  $fastTargets += (Get-RepoFiles -Include @("_config.yml", "*.md", "*.html", "*.scss") -ExcludeDirNames $ExcludeDirs)
  $fastTargets | Sort-Object -Property FullName -Unique
}
else {
  $scanFiles
}

foreach ($f in $targets) {
  $raw = Read-FileRawSafe $f.FullName
  if ($raw -match $mojibakeCharPattern) {
    $encodingHits.Add([pscustomobject]@{
        file = $f.FullName
        note = "Contains characters commonly seen in encoding/mojibake issues."
      })
  }
}
Out-Report "encoding-suspects.txt" ($encodingHits | Sort-Object file | Format-Table -AutoSize | Out-String)

# ----------------------------
# 5) Utility-class scan
# ----------------------------
$utilityTokens = @(
  "sm:", "md:", "lg:", "xl:", "2xl:",
  "md:grid-cols-", "grid-cols-",
  "gap-", "p-", "px-", "py-", "rounded-", "text-"
)

$utilityHits = New-Object System.Collections.Generic.List[object]
foreach ($f in $markupFiles) {
  $raw = Read-FileRawSafe $f.FullName
  foreach ($tok in $utilityTokens) {
    if ($raw -like ("*" + $tok + "*")) {
      $utilityHits.Add([pscustomobject]@{ file = $f.FullName; token = $tok })
    }
  }
}
Out-Report "possible-utility-usage.txt" ($utilityHits | Sort-Object file, token | Format-Table -AutoSize | Out-String)

# ----------------------------
# 6) Jekyll build trace (FULL only)
# ----------------------------
if (-not $Fast) {
  $jekyllReport = New-Object System.Collections.Generic.List[string]
  try {
    $bundle = Try-GetCommand "bundle"
    if (-not $bundle) {
      $jekyllReport.Add("bundle not found in PATH")
    }
    else {
      Push-Location $Root
      try {
        $jekyllReport.Add("Running: bundle exec jekyll build --trace")
        $out = & bundle exec jekyll build --trace 2>&1
        $jekyllReport.Add(($out | Out-String))
      }
      finally { Pop-Location }
    }
  }
  catch {
    $jekyllReport.Add("Build threw exception:")
    $jekyllReport.Add($_.Exception.Message)
  }
  Out-Report "jekyll-build-trace.txt" ($jekyllReport -join "`r`n")
}
else {
  Out-Report "jekyll-build-trace.txt" "FAST mode: skipped"
}

# ----------------------------
# 7) Scripts inventory (FULL only)
# ----------------------------
if (-not $Fast) {
  $scriptsDir = Join-Path $Root "scripts"
  if (Test-Path $scriptsDir) {
    $scripts = Get-ChildItem -Path $scriptsDir -File | Sort-Object Name | Select-Object Name, Length, LastWriteTime
    Out-Report "scripts-inventory.txt" ($scripts | Format-Table -AutoSize | Out-String)
  }
  else {
    Out-Report "scripts-inventory.txt" "No ./scripts directory found."
  }
}
else {
  Out-Report "scripts-inventory.txt" "FAST mode: skipped"
}

Write-Host ""
Write-Host ("Audit done. Review files in " + $ReportDir)
Write-Host "Key outputs:"
Write-Host (" - " + (Join-Path $ReportDir "yaml-parse-failures.txt"))
Write-Host (" - " + (Join-Path $ReportDir "front-matter-problems.txt"))
Write-Host (" - " + (Join-Path $ReportDir "encoding-suspects.txt"))
Write-Host (" - " + (Join-Path $ReportDir "jekyll-build-trace.txt"))
