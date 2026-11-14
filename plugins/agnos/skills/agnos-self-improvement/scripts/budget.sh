#!/usr/bin/env bash
# agnos-self-improvement (bash): line budget of the improvement target.
# Run from the project's root. Prints `target=<path> ceiling=<N> lines=<n> left=<n>`. Exit code 0
# within the ceiling, 1 on a missing or out-of-project declaration (message on the error stream),
# 2 over the ceiling. Keeps no state. budget.ps1 gives the same output.
set -u
export LC_ALL=C

REPORT_PREFIX='agnos-self-improvement: '
ENTRY_FILES='CLAUDE.md AGENTS.md'
GIT_DIR='.git'
DECLARATION_PATTERN='`[^`]+` is the improvement target(, at most [0-9]+ lines)?'
INSTRUCTIONS_NAME='agnos-sw-eng.instructions.md'
INSTRUCTIONS_CEILING_PATTERN='SHALL NOT exceed [0-9]+ lines'
PARENT_SEGMENT='..'
CURRENT_SEGMENT='.'
DEFAULT_CEILING=100
EXIT_ERROR=1
EXIT_OVER=2

# Reports the cause on the error stream and exits 1.
fail() {
  echo "$REPORT_PREFIX$1" >&2
  exit "$EXIT_ERROR"
}

# The nearest folder holding .git, from the current folder up.
git_root() {
  local folder=$PWD
  while :; do
    if [ -e "$folder/$GIT_DIR" ]; then echo "$folder"; return; fi
    [ "$folder" = / ] && break
    folder=$(dirname "$folder")
  done
  fail 'no git repository at or above the current folder'
}

# The first declaration in CLAUDE.md, then AGENTS.md; no fallback.
declaration() {
  local name found
  for name in $ENTRY_FILES; do
    if [ -f "$1/$name" ]; then
      found=$(grep -oE "$DECLARATION_PATTERN" "$1/$name" | head -n 1)
      if [ -n "$found" ]; then echo "$found"; return; fi
    fi
  done
  fail "no '\`<path>\` is the improvement target' declaration in ${ENTRY_FILES// / or }"
}

# Refuses an absolute path or one climbing above the git root, on its text alone.
assert_inside() {
  local depth=0 outside='' segment
  case "$1" in /*|\\*|[A-Za-z]:*) outside=1 ;; esac
  for segment in $(printf '%s' "$1" | tr '/\\' '  '); do
    if [ "$segment" = "$PARENT_SEGMENT" ]; then depth=$((depth - 1))
    elif [ "$segment" != "$CURRENT_SEGMENT" ]; then depth=$((depth + 1)); fi
    [ "$depth" -lt 0 ] && outside=1
  done
  [ -n "$outside" ] && fail "the improvement target $1 lies outside the project"
  return 0
}

# The instructions file's own ceiling, else the declared one, else 100.
ceiling_of() {
  local found
  if [ "$(basename "$1")" = "$INSTRUCTIONS_NAME" ]; then
    [ -f "$1" ] && found=$(grep -oE "$INSTRUCTIONS_CEILING_PATTERN" "$1" | head -n 1 | grep -oE '[0-9]+')
    [ -n "${found:-}" ] || fail "$INSTRUCTIONS_NAME states no 'SHALL NOT exceed <N> lines' ceiling"
    echo "$found"
  elif [ -n "$2" ]; then echo "$2"
  else echo "$DEFAULT_CEILING"; fi
}

# The target's lines, a last line without line ending included; 0 when not created yet.
line_count() {
  if [ -f "$1" ]; then awk 'END { print NR }' "$1"; else echo 0; fi
}

root=$(git_root) || exit "$EXIT_ERROR"
found=$(declaration "$root") || exit "$EXIT_ERROR"
relative=${found#\`}
relative=${relative%%\`*}
declared=$(printf '%s' "$found" | grep -oE 'at most [0-9]+' | grep -oE '[0-9]+')
assert_inside "$relative"
path="$root/$relative"
ceiling=$(ceiling_of "$path" "$declared") || exit "$EXIT_ERROR"
lines=$(line_count "$path")
left=$((ceiling - lines))
echo "target=$relative ceiling=$ceiling lines=$lines left=$left"
[ "$left" -lt 0 ] && exit "$EXIT_OVER"
exit 0
