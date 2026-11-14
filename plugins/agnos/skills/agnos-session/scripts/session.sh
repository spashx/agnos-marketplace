#!/usr/bin/env bash
# agnos-session (bash): writes and reads the AGNOS session state, and appends the session's friction-metrics row.
# Usage: session.sh init --tri <TRI> --tests <true|false> | show | close <questions> <recoveries> <re-tiered> <verification>
# Run from the project's root. Exit code 0 on success, 1 on error, with nothing written (message on the error stream).
# session.ps1 gives the same bytes.
set -u
export LC_ALL=C    # [A-Z] and [0-9] match ASCII only

REPORT_PREFIX='agnos-session: '
USAGE='usage: session init --tri <TRI> --tests <true|false> | show | close <questions> <recoveries> <re-tiered> <verification>'
TRI_ARGUMENT='--tri'
TESTS_ARGUMENT='--tests'
COUNTERS=4
TRI_KEY='tri'
DATE_FORMAT='+%Y-%m-%d'
CR=$(printf '\r')
CRLF_HEX='0d0a'
LF_HEX='0a'
# The title and header of the log agnos-perf-center reads.
LOG_TITLE='# AGNOS Session Friction Metrics Log'
LOG_COLUMNS='| Date | TRI | AskUserQuestion | Error Recovery | Re-tiered | Verification discrepancies |'
LOG_RULE='|------|-----|:---:|:---:|:---:|:---:|'
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
# Every path of the process folder comes from the generated agnos-layout.sh.
. "$SCRIPT_DIR/agnos-layout.sh"
STATE_PATH=$AGNOS_FOLDER/$AGNOS_SESSION_STATE
LOG_PATH=$AGNOS_FOLDER/$AGNOS_METRICS_LOG

fail() {
  echo "$REPORT_PREFIX$1" >&2
  exit 1
}

# The platform from `uname -s`; any other system is refused.
detect_platform() {
  case "$(uname -s)" in
    Linux) echo linux ;;
    Darwin) echo macos ;;
    MINGW*|MSYS*|CYGWIN*) echo windows ;;
    *) return 1 ;;
  esac
}

# Validates both arguments, then rewrites the whole state and prints its table.
cmd_init() {
  tri=''
  tests=''
  while [ $# -gt 0 ]; do
    case "$1" in
      "$TRI_ARGUMENT"|"$TESTS_ARGUMENT")
        [ $# -ge 2 ] || fail "$1 needs a value"
        if [ "$1" = "$TRI_ARGUMENT" ]; then tri=$2; else tests=$2; fi
        shift 2 ;;
      *) fail "unknown argument: $1" ;;
    esac
  done
  case "$tri" in [A-Z][A-Z][A-Z]) ;; *) fail "$TRI_ARGUMENT must be three uppercase letters" ;; esac
  case "$tests" in true|false) ;; *) fail "$TESTS_ARGUMENT must be true or false" ;; esac
  [ -d "$AGNOS_FOLDER" ] || fail "$AGNOS_FOLDER folder not found: run from the project's root, or call agnos-init"
  platform=$(detect_platform) || fail "unknown system: $(uname -s)"
  mkdir -p "$(dirname "$STATE_PATH")" || fail "cannot create $(dirname "$STATE_PATH")"
  printf 'tri: %s\ntests: %s\nplatform: %s\n' "$tri" "$tests" "$platform" > "$STATE_PATH" || fail "cannot write $STATE_PATH"
  echo "${REPORT_PREFIX}wrote $STATE_PATH"
  echo '| Variable | Value |'
  echo '|---|---|'
  printf '| tri | %s |\n| tests | %s |\n| platform | %s |\n' "$tri" "$tests" "$platform"
}

# Stops when the state is absent.
require_state() {
  [ -f "$STATE_PATH" ] || fail "$STATE_PATH not found: run agnos-session init first"
}

# The state on one line, its keys in file order.
cmd_show() {
  [ $# -eq 0 ] || fail "$USAGE"
  require_state
  line=''
  while IFS= read -r entry || [ -n "$entry" ]; do
    entry=${entry%"$CR"}
    case "$entry" in *': '*) ;; *) continue ;; esac
    key=${entry%%': '*}
    case "$key" in ''|*[!a-z_]*) continue ;; esac
    line="$line${line:+ }$key=${entry#*': '}"
  done < "$STATE_PATH"
  echo "$line"
}

# The hexadecimal of a file's bytes from stdin, without spaces.
hex() {
  od -An -tx1 | tr -d ' \n'
}

# Validates the counters, then appends the row, creating the log with its header if absent.
cmd_close() {
  [ $# -eq "$COUNTERS" ] || fail "close needs $COUNTERS counters"
  for counter in "$@"; do
    case "$counter" in ''|*[!0-9]*) fail "not a non-negative integer: $counter" ;; esac
  done
  require_state
  tri=$(sed -n "s/^$TRI_KEY: //p" "$STATE_PATH" | tr -d '\r' | head -n 1)
  [ -n "$tri" ] || fail "no $TRI_KEY in $STATE_PATH"
  row="| $(date "$DATE_FORMAT") | $tri | $1 | $2 | $3 | $4 |"
  if [ -f "$LOG_PATH" ]; then
    eol='\n'
    [ "$(head -n 1 "$LOG_PATH" | tail -c 2 | hex)" = "$CRLF_HEX" ] && eol='\r\n'
    {
      if [ -s "$LOG_PATH" ] && [ "$(tail -c 1 "$LOG_PATH" | hex)" != "$LF_HEX" ]; then printf "$eol"; fi
      printf "%s$eol" "$row"
    } >> "$LOG_PATH" || fail "cannot write $LOG_PATH"
  else
    printf '%s\n\n%s\n%s\n%s\n' "$LOG_TITLE" "$LOG_COLUMNS" "$LOG_RULE" "$row" > "$LOG_PATH" || fail "cannot write $LOG_PATH"
  fi
  echo "$row"
}

[ $# -ge 1 ] || fail "$USAGE"
command=$1
shift
case "$command" in
  init) cmd_init "$@" ;;
  show) cmd_show "$@" ;;
  close) cmd_close "$@" ;;
  *) fail "$USAGE" ;;
esac
exit 0
