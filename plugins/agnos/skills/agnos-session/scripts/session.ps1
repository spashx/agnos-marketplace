<#
.SYNOPSIS
  Writes and reads the AGNOS session state, and appends the session's friction-metrics row.
.DESCRIPTION
  init --tri <TRI> --tests <true|false> | show | close <questions> <recoveries> <re-tiered> <verification>
  Run from the project's root. Exit code 0 on success, 1 on error, with nothing written (message on the error stream).
  session.sh gives the same bytes.
#>
param(
  [Parameter(Position = 0)][string]$Command = '',
  [Parameter(ValueFromRemainingArguments = $true)][string[]]$Rest = @()
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$REPORT_PREFIX = 'agnos-session: '
$USAGE = 'usage: session init --tri <TRI> --tests <true|false> | show | close <questions> <recoveries> <re-tiered> <verification>'
$TRI_ARGUMENT = '--tri'
$TESTS_ARGUMENT = '--tests'
$TRI_PATTERN = '^[A-Z]{3}$'
$TESTS_VALUES = @('true', 'false')
$COUNTER_PATTERN = '^[0-9]+$'
$COUNTERS = 4
$KEY_PATTERN = '^([a-z_]+): (.*)$'
$TRI_KEY = 'tri'
$DATE_FORMAT = 'yyyy-MM-dd'
$LF = "`n"
$CRLF = "`r`n"
$CR_BYTE = 13
$LF_BYTE = 10
# The title and header of the log agnos-perf-center reads.
$LOG_HEADER = "# AGNOS Session Friction Metrics Log$LF$LF" +
  "| Date | TRI | AskUserQuestion | Error Recovery | Re-tiered | Verification discrepancies |$LF" +
  "|------|-----|:---:|:---:|:---:|:---:|$LF"
$UTF8 = New-Object System.Text.UTF8Encoding $false     # UTF-8 without BOM
# Every path of the process folder comes from the generated agnos-layout.ps1.
. (Join-Path $PSScriptRoot 'agnos-layout.ps1')
$STATE_PATH = "$AGNOS_FOLDER/$AGNOS_SESSION_STATE"
$LOG_PATH = "$AGNOS_FOLDER/$AGNOS_METRICS_LOG"

# A path of the project, from the folder the script was run in.
function Get-ProjectPath([string]$Path) { return [System.IO.Path]::Combine((Get-Location).Path, $Path) }

# PowerShell 7 sets IsLinux or IsMacOS; Windows PowerShell 5.1 has neither.
function Get-Platform {
  if ((Test-Path variable:IsLinux) -and $IsLinux) { return 'linux' }
  if ((Test-Path variable:IsMacOS) -and $IsMacOS) { return 'macos' }
  return 'windows'
}

# Validates both arguments, then rewrites the whole state and prints its table.
function Invoke-Init([string[]]$Arguments) {
  $values = @{}
  for ($i = 0; $i -lt $Arguments.Count; $i += 2) {
    $name = $Arguments[$i]
    if ($name -cne $TRI_ARGUMENT -and $name -cne $TESTS_ARGUMENT) { throw "unknown argument: $name" }
    if ($i + 1 -ge $Arguments.Count) { throw "$name needs a value" }
    $values[$name] = $Arguments[$i + 1]
  }
  if (-not $values.ContainsKey($TRI_ARGUMENT) -or $values[$TRI_ARGUMENT] -cnotmatch $TRI_PATTERN) {
    throw "$TRI_ARGUMENT must be three uppercase letters"
  }
  if (-not $values.ContainsKey($TESTS_ARGUMENT) -or $TESTS_VALUES -cnotcontains $values[$TESTS_ARGUMENT]) {
    throw "$TESTS_ARGUMENT must be true or false"
  }
  if (-not (Test-Path -LiteralPath (Get-ProjectPath $AGNOS_FOLDER) -PathType Container)) {
    throw "$AGNOS_FOLDER folder not found: run from the project's root, or call agnos-init"
  }
  $state = [ordered]@{ tri = $values[$TRI_ARGUMENT]; tests = $values[$TESTS_ARGUMENT]; platform = (Get-Platform) }
  $path = Get-ProjectPath $STATE_PATH
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $path) | Out-Null
  $text = ''
  foreach ($key in $state.Keys) { $text += "${key}: $($state[$key])$LF" }
  [System.IO.File]::WriteAllText($path, $text, $UTF8)
  Write-Output "$($REPORT_PREFIX)wrote $STATE_PATH"
  Write-Output '| Variable | Value |'
  Write-Output '|---|---|'
  foreach ($key in $state.Keys) { Write-Output "| $key | $($state[$key]) |" }
}

# The keys and values of the state, in file order.
function Read-State {
  $path = Get-ProjectPath $STATE_PATH
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { throw "$STATE_PATH not found: run agnos-session init first" }
  $state = [ordered]@{}
  foreach ($line in [System.IO.File]::ReadAllLines($path)) {
    if ($line -cmatch $KEY_PATTERN) { $state[$Matches[1]] = $Matches[2] }
  }
  return $state
}

# The state on one line.
function Invoke-Show([string[]]$Arguments) {
  if ($Arguments.Count -ne 0) { throw $USAGE }
  $state = Read-State
  Write-Output ((@($state.Keys) | ForEach-Object { "$_=$($state[$_])" }) -join ' ')
}

# The line ending of the log's first line, LF when it has none.
function Get-Eol([byte[]]$Bytes) {
  $at = [System.Array]::IndexOf($Bytes, [byte]$LF_BYTE)
  if ($at -gt 0 -and $Bytes[$at - 1] -eq $CR_BYTE) { return $CRLF }
  return $LF
}

# Validates the counters, then appends the row, creating the log with its header if absent.
function Invoke-Close([string[]]$Arguments) {
  if ($Arguments.Count -ne $COUNTERS) { throw "close needs $COUNTERS counters" }
  foreach ($counter in $Arguments) {
    if ($counter -cnotmatch $COUNTER_PATTERN) { throw "not a non-negative integer: $counter" }
  }
  $state = Read-State
  if (-not $state.Contains($TRI_KEY)) { throw "no $TRI_KEY in $STATE_PATH" }
  $row = "| $(Get-Date -Format $DATE_FORMAT) | $($state[$TRI_KEY]) | $($Arguments -join ' | ') |"
  $path = Get-ProjectPath $LOG_PATH
  if (Test-Path -LiteralPath $path -PathType Leaf) {
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $eol = Get-Eol $bytes
    $text = "$row$eol"
    if ($bytes.Length -gt 0 -and $bytes[$bytes.Length - 1] -ne $LF_BYTE) { $text = "$eol$text" }
    [System.IO.File]::AppendAllText($path, $text, $UTF8)
  } else {
    [System.IO.File]::WriteAllText($path, "$LOG_HEADER$row$LF", $UTF8)
  }
  Write-Output $row
}

try {
  switch -CaseSensitive ($Command) {
    'init' { Invoke-Init $Rest }
    'show' { Invoke-Show $Rest }
    'close' { Invoke-Close $Rest }
    default { throw $USAGE }
  }
  exit 0
} catch {
  [Console]::Error.WriteLine("$REPORT_PREFIX$($_.Exception.Message)")
  exit 1
}
