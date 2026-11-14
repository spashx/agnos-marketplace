#!/usr/bin/env bash
# Builds the AGNOS commit message and its co-author trailer, and commits the staged changes.
# Usage: commit-task.sh -Task <TASK> [-Adr <ADR>] -Type <type> -Description <text> -Harness <h> -Model <m> -Email <e>
#                       [-Iteration <k>/<N>] [-DryRun]
# Message: `<Type>(<TRI>): [<Adr>/]<Task> <Description>`, a blank line, an optional `Iteration: <k>/<N>` trailer,
# then one `Co-Authored-By: <Harness>/<Model> <Email>` trailer. The values are taken as given, never normalised.
# Stages nothing: commits what is staged. With -DryRun, prints the message and commits nothing.
# Exit 0: done (the message, or the commit's hash). Exit 1: an error on stderr, nothing committed.
set -u

# The grammar's constants.
TYPES="feat fix docs refactor test chore perf build ci style"
ITERATION_PATTERN='^[0-9]+/[0-9]+$'
here="$(cd "$(dirname "$0")" && pwd)"

# One error, nothing committed.
fail() {
  echo "$1" >&2
  exit 1
}

task="" adr="" type="" description="" harness="" model="" email="" iteration="" dry_run=0
while [ $# -gt 0 ]; do
  case "$1" in
    -Task) task="${2-}"; shift 2 || fail "Missing value: -Task" ;;
    -Adr) adr="${2-}"; shift 2 || fail "Missing value: -Adr" ;;
    -Type) type="${2-}"; shift 2 || fail "Missing value: -Type" ;;
    -Description) description="${2-}"; shift 2 || fail "Missing value: -Description" ;;
    -Harness) harness="${2-}"; shift 2 || fail "Missing value: -Harness" ;;
    -Model) model="${2-}"; shift 2 || fail "Missing value: -Model" ;;
    -Email) email="${2-}"; shift 2 || fail "Missing value: -Email" ;;
    -Iteration) iteration="${2-}"; shift 2 || fail "Missing value: -Iteration" ;;
    -DryRun) dry_run=1; shift ;;
    *) fail "Unknown argument: $1" ;;
  esac
done

for pair in "Task:$task" "Type:$type" "Description:$description" "Harness:$harness" "Model:$model" "Email:$email"; do
  value="${pair#*:}"
  [ -n "${value//[[:space:]]/}" ] || fail "Missing value: -${pair%%:*}"
done

bash "$here/validate-ids.sh" -Type TASK -Value "$task" || exit 1
if [ -n "$adr" ]; then
  bash "$here/validate-ids.sh" -Type ADR -Value "$adr" || exit 1
fi
case " $TYPES " in
  *" $type "*) ;;
  *) fail "Invalid -Type '$type'. Expected one of: ${TYPES// /, }" ;;
esac
if [ -n "$iteration" ] && ! [[ "$iteration" =~ $ITERATION_PATTERN ]]; then
  fail "Invalid -Iteration '$iteration'. Expected format: 1/5"
fi

tri="${task#TASK-}"
tri="${tri%%-*}"
reference="$task"
[ -n "$adr" ] && reference="$adr/$task"
message="$type($tri): $reference $description"$'\n\n'
[ -n "$iteration" ] && message+="Iteration: $iteration"$'\n'
message+="Co-Authored-By: $harness/$model <$email>"$'\n'

if [ "$dry_run" -eq 1 ]; then
  printf '%s' "$message"
  exit 0
fi

printf '%s' "$message" | git commit -q -F - || exit 1
git rev-parse --short HEAD
