<#
.SYNOPSIS
  Line budget of the improvement target.
.DESCRIPTION
  Run from the project's root. Prints `target=<path> ceiling=<N> lines=<n> left=<n>`. Exit code 0
  within the ceiling, 1 on a missing or out-of-project declaration (message on the error stream),
  2 over the ceiling. Keeps no state. budget.sh gives the same output.
#>
$ErrorActionPreference = 'Stop'

$REPORT_PREFIX = 'agnos-self-improvement: '
$ENTRY_FILES = @('CLAUDE.md', 'AGENTS.md')
$GIT_DIR = '.git'
$DECLARATION_PATTERN = '`([^`]+)` is the improvement target(?:, at most (\d+) lines)?'
$INSTRUCTIONS_NAME = 'agnos-sw-eng.instructions.md'
$INSTRUCTIONS_CEILING_PATTERN = 'SHALL NOT exceed (\d+) lines'
$ABSOLUTE_PATTERN = '^([/\\]|[A-Za-z]:)'
$SEGMENT_SEPARATORS = '[/\\]'
$PARENT_SEGMENT = '..'
$CURRENT_SEGMENT = '.'
$DEFAULT_CEILING = 100
$EXIT_ERROR = 1
$EXIT_OVER = 2
$UTF8 = New-Object System.Text.UTF8Encoding($false)

# Reports the cause on the error stream and exits 1.
function Stop-Budget([string]$Message) {
  [Console]::Error.WriteLine("$REPORT_PREFIX$Message")
  exit $EXIT_ERROR
}

function Read-Text([string]$Path) { return [System.IO.File]::ReadAllText($Path, $UTF8) }

# The nearest folder holding .git, from the current folder up.
function Get-GitRoot {
  $folder = (Get-Location).ProviderPath
  while ($folder) {
    if (Test-Path -LiteralPath (Join-Path $folder $GIT_DIR)) { return $folder }
    $folder = Split-Path -Parent $folder
  }
  Stop-Budget 'no git repository at or above the current folder'
}

# The first declaration in CLAUDE.md, then AGENTS.md; no fallback.
function Get-Declaration([string]$Root) {
  foreach ($name in $ENTRY_FILES) {
    $entry = Join-Path $Root $name
    if (Test-Path -LiteralPath $entry -PathType Leaf) {
      $match = [regex]::Match((Read-Text $entry), $DECLARATION_PATTERN)
      if ($match.Success) { return $match }
    }
  }
  Stop-Budget "no '``<path>`` is the improvement target' declaration in $($ENTRY_FILES -join ' or ')"
}

# Refuses an absolute path or one climbing above the git root, on its text alone.
function Assert-Inside([string]$Relative) {
  $depth = 0
  $outside = $Relative -match $ABSOLUTE_PATTERN
  foreach ($segment in ($Relative -split $SEGMENT_SEPARATORS)) {
    if ($segment -eq $PARENT_SEGMENT) { $depth-- } elseif ($segment -and $segment -ne $CURRENT_SEGMENT) { $depth++ }
    if ($depth -lt 0) { $outside = $true }
  }
  if ($outside) { Stop-Budget "the improvement target $Relative lies outside the project" }
}

# The instructions file's own ceiling, else the declared one, else 100.
function Get-Ceiling([string]$Path, [string]$Declared) {
  if ((Split-Path -Leaf $Path) -eq $INSTRUCTIONS_NAME) {
    if (Test-Path -LiteralPath $Path -PathType Leaf) {
      $match = [regex]::Match((Read-Text $Path), $INSTRUCTIONS_CEILING_PATTERN)
      if ($match.Success) { return [int]$match.Groups[1].Value }
    }
    Stop-Budget "$INSTRUCTIONS_NAME states no 'SHALL NOT exceed <N> lines' ceiling"
  }
  if ($Declared) { return [int]$Declared }
  return $DEFAULT_CEILING
}

# The target's lines, a last line without line ending included; 0 when not created yet.
function Get-LineCount([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) { return 0 }
  $text = Read-Text $Path
  if ($text.Length -eq 0) { return 0 }
  $count = ([regex]::Matches($text, "`n")).Count
  if (-not $text.EndsWith("`n")) { $count++ }
  return $count
}

$root = Get-GitRoot
$declaration = Get-Declaration $root
$relative = $declaration.Groups[1].Value
Assert-Inside $relative
$path = Join-Path $root $relative
$ceiling = Get-Ceiling $path $declaration.Groups[2].Value
$lines = Get-LineCount $path
$left = $ceiling - $lines
Write-Output "target=$relative ceiling=$ceiling lines=$lines left=$left"
if ($left -lt 0) { exit $EXIT_OVER }
exit 0
