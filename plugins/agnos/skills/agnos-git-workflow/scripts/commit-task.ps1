<#
.SYNOPSIS
  Builds the AGNOS commit message and its co-author trailer, and commits the staged changes.

.DESCRIPTION
  Message: `<Type>(<TRI>): [<Adr>/]<Task> <Description>`, a blank line, an optional `Iteration: <k>/<N>` trailer,
  then one `Co-Authored-By: <Harness>/<Model> <Email>` trailer. The values are taken as given, never normalised.
  Stages nothing: commits what is staged. With -DryRun, prints the message and commits nothing.

.OUTPUTS
  Exit 0: done (the message, or the commit's hash). Exit 1: an error on stderr, nothing committed.
#>
param(
    [string]$Task, [string]$Adr, [string]$Type, [string]$Description,
    [string]$Harness, [string]$Model, [string]$Email, [string]$Iteration,
    [switch]$DryRun
)

# The grammar's constants.
$TYPES = @('feat', 'fix', 'docs', 'refactor', 'test', 'chore', 'perf', 'build', 'ci', 'style')
$ITERATION_PATTERN = '^\d+/\d+$'
$TRI_PATTERN = '^TASK-([A-Z]{3})-'
$LF = "`n"

# One error, nothing committed.
function Fail([string]$text) {
    [Console]::Error.WriteLine($text)
    exit 1
}

$required = [ordered]@{ Task = $Task; Type = $Type; Description = $Description; Harness = $Harness; Model = $Model; Email = $Email }
foreach ($name in $required.Keys) {
    if ([string]::IsNullOrWhiteSpace($required[$name])) { Fail "Missing value: -$name" }
}

$validate = Join-Path $PSScriptRoot 'validate-ids.ps1'
& powershell -NoProfile -File $validate -Type TASK -Value $Task
if ($LASTEXITCODE -ne 0) { exit 1 }
if ($Adr) {
    & powershell -NoProfile -File $validate -Type ADR -Value $Adr
    if ($LASTEXITCODE -ne 0) { exit 1 }
}
if ($TYPES -cnotcontains $Type) { Fail "Invalid -Type '$Type'. Expected one of: $($TYPES -join ', ')" }
if ($Iteration -and $Iteration -notmatch $ITERATION_PATTERN) { Fail "Invalid -Iteration '$Iteration'. Expected format: 1/5" }

$tri = [regex]::Match($Task, $TRI_PATTERN).Groups[1].Value
$reference = if ($Adr) { "$Adr/$Task" } else { $Task }
$message = "$Type($tri): $reference $Description$LF$LF"
if ($Iteration) { $message += "Iteration: $Iteration$LF" }
$message += "Co-Authored-By: $Harness/$Model <$Email>$LF"

if ($DryRun) {
    [Console]::Out.Write($message)
    exit 0
}

$file = [System.IO.Path]::GetTempFileName()
try {
    [System.IO.File]::WriteAllText($file, $message, (New-Object System.Text.UTF8Encoding $false))
    git commit -q -F $file
    if ($LASTEXITCODE -ne 0) { exit 1 }
} finally {
    Remove-Item -LiteralPath $file -ErrorAction SilentlyContinue
}
git rev-parse --short HEAD
exit 0
