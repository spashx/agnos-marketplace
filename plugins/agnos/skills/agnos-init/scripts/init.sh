#!/usr/bin/env bash
# agnos-init (bash): adds AGNOS to a project, the block of its entry-point files, its guide and its process folders.
# The session state is added to .gitignore.
# Usage: init.sh --target <project folder>
# Every entry-point file is checked before any write. Exit code 0 on success, 1 on error, with nothing
# written (message on the error stream). init.ps1 gives the same bytes.
set -u
export LC_ALL=C    # Files are handled as bytes

REPORT_PREFIX='agnos-init: '
BEGIN_PATTERN='^<!-- AGNOS:BEGIN'
END_MARKER='<!-- AGNOS:END -->'
CR=$(printf '\r')
END_PATTERN="^$END_MARKER$CR?\$"
ENTRY_FILES='CLAUDE.md AGENTS.md'
BLOCK_TEMPLATE='agnos.block.md'    # One block for every entry-point file
README='readme.md'
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
# Every name of the process folder comes from the generated agnos-layout.sh.
. "$SCRIPT_DIR/agnos-layout.sh"
GUIDE=$AGNOS_GUIDE
OWNED_FILES="$AGNOS_GUIDE $AGNOS_VERSION"    # Written into the process folder
GITIGNORE='.gitignore'
SESSION_STATE=$AGNOS_FOLDER/$AGNOS_SESSION_STATE    # Kept out of git
PROCESS_FOLDERS=''
for sub in $AGNOS_SUBFOLDERS; do PROCESS_FOLDERS="$PROCESS_FOLDERS $AGNOS_FOLDER/$sub"; done

fail() {
  echo "$REPORT_PREFIX$1" >&2
  exit 1
}

target=''
while [ $# -gt 0 ]; do
  case "$1" in
    --target) target=${2-}; shift 2 ;;
    *) fail "unknown argument: $1" ;;
  esac
done
[ -n "$target" ] || fail 'usage: init.sh --target <folder>'
[ -d "$target" ] || fail "target folder not found: $target"

work=$(mktemp -d) || fail 'no temporary folder'
trap 'rm -rf "$work"' EXIT

# Writes the one template of every entry-point file, in the file's line ending, with a final one.
write_block() {   # <file> <crlf|lf> <output>
  tr -d '\r' < "$SCRIPT_DIR/../assets/templates/$BLOCK_TEMPLATE" > "$3.lf"
  if [ "$2" = crlf ]; then awk '{ printf "%s\r\n", $0 }' "$3.lf" > "$3"; else cp "$3.lf" "$3"; fi
}

# Writes in $work what the file should hold, and its action.
plan_file() {   # <file>
  file=$1
  path=$target/$file
  result=$work/$file
  if [ ! -e "$path" ]; then
    write_block "$file" lf "$result"
    echo created > "$result.action"
    return
  fi
  begins=$(grep -c "$BEGIN_PATTERN" "$path")
  ends=$(grep -cE "$END_PATTERN" "$path")
  eol=lf
  [ "$(head -n 1 "$path" | tail -c 2 | od -An -tx1 | tr -d ' ')" = 0d0a ] && eol=crlf
  write_block "$file" "$eol" "$result.block"
  if [ "$begins" -eq 0 ] && [ "$ends" -eq 0 ]; then
    eol_text='\n'
    [ "$eol" = crlf ] && eol_text='\r\n'
    {
      if [ -s "$path" ]; then
        cat "$path"
        [ "$(tail -c 1 "$path" | od -An -tx1 | tr -d ' ')" = 0a ] || printf "$eol_text"
        printf "$eol_text"
      fi
      cat "$result.block"
    } > "$result"
    echo added > "$result.action"
    return
  fi
  begin_line=$(grep -n "$BEGIN_PATTERN" "$path" | head -n 1 | cut -d: -f1)
  end_line=$(grep -nE "$END_PATTERN" "$path" | head -n 1 | cut -d: -f1)
  if [ "$begins" -ne 1 ] || [ "$ends" -ne 1 ] || [ "$end_line" -lt "$begin_line" ]; then
    fail "$file holds a damaged AGNOS block: repair its BEGIN and END lines, then call agnos-init again"
  fi
  block_size=$(wc -c < "$result.block")
  eol_size=1
  [ "$eol" = crlf ] && eol_size=2
  {
    head -n $((begin_line - 1)) "$path"
    head -c $((block_size - eol_size)) "$result.block"
    tail -n +"$end_line" "$path" | tail -c +$((${#END_MARKER} + 1))
  } > "$result"
  echo updated > "$result.action"
}

# Whether git tracks a path of the project; no git, or no repository, means untracked.
tracked() {   # <path>
  git -C "$target" ls-files --error-unmatch -- "$1" >/dev/null 2>&1
}

# Renames with git mv when tracked, so that the history follows, with a plain rename otherwise.
move_process_path() {   # <from> <to>
  if tracked "$1"; then
    git -C "$target" mv -- "$1" "$2" >/dev/null 2>&1 || fail "git mv $1 $2 failed"
  else
    mv "$target/$1" "$target/$2" || fail "cannot rename $1 to $2"
  fi
}

migrate=no
if [ "$AGNOS_LEGACY_FOLDER" != "$AGNOS_FOLDER" ] && [ -f "$target/$AGNOS_LEGACY_FOLDER/$AGNOS_LEGACY_INDEX" ]; then
  migrate=yes
  [ -e "$target/$AGNOS_FOLDER" ] && fail "both $AGNOS_LEGACY_FOLDER/ and $AGNOS_FOLDER/ exist: keep one, then call agnos-init again"
fi

for file in $ENTRY_FILES; do plan_file "$file"; done

if [ "$migrate" = yes ]; then
  move_process_path "$AGNOS_LEGACY_FOLDER" "$AGNOS_FOLDER"
  if [ "$AGNOS_LEGACY_INDEX" != "$AGNOS_INDEX" ]; then
    move_process_path "$AGNOS_FOLDER/$AGNOS_LEGACY_INDEX" "$AGNOS_FOLDER/$AGNOS_INDEX"
  fi
  echo "${REPORT_PREFIX}moved $AGNOS_LEGACY_FOLDER to $AGNOS_FOLDER"
fi

for file in $ENTRY_FILES; do
  path=$target/$file
  if [ -e "$path" ] && cmp -s "$work/$file" "$path"; then
    echo "${REPORT_PREFIX}unchanged $file"
  else
    cat "$work/$file" > "$path" || fail "cannot write $file"
    echo "$REPORT_PREFIX$(cat "$work/$file.action") $file"
  fi
done

for folder in $PROCESS_FOLDERS; do
  path=$target/$folder
  if [ ! -e "$path" ]; then
    mkdir -p "$path" && cat "$SCRIPT_DIR/../assets/templates/${folder##*/}.$README" > "$path/$README" || fail "cannot create $folder"
    echo "${REPORT_PREFIX}created $folder"
  fi
done

# AGNOS's own files, rewritten whole from their templates into the folder.
for owned in $OWNED_FILES; do
  owned_template=$SCRIPT_DIR/../assets/templates/$owned
  owned_path=$target/$AGNOS_FOLDER/$owned
  if [ ! -e "$owned_path" ]; then
    owned_action=created
  elif cmp -s "$owned_template" "$owned_path"; then
    owned_action=unchanged
  else
    owned_action=updated
  fi
  if [ "$owned_action" != unchanged ]; then
    cat "$owned_template" > "$owned_path" || fail "cannot write $AGNOS_FOLDER/$owned"
  fi
  echo "$REPORT_PREFIX$owned_action $AGNOS_FOLDER/$owned"
done

# A root guide a former init wrote goes; any other file of that name stays.
first_line() {   # <file>
  head -n 1 "$1" | tr -d '\r'
}
if [ -f "$target/$GUIDE" ] && [ "$(first_line "$target/$GUIDE")" = "$(first_line "$SCRIPT_DIR/../assets/templates/$GUIDE")" ]; then
  rm -f "$target/$GUIDE" || fail "cannot remove $GUIDE"
  echo "${REPORT_PREFIX}moved $GUIDE to $AGNOS_FOLDER/$GUIDE"
fi

# Whether git's rules ignore the session state, tracked or not; outside a git repository,
# whether .gitignore holds its line.
session_state_ignored() {
  if git -C "$target" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git -C "$target" check-ignore -q --no-index -- "$SESSION_STATE" >/dev/null 2>&1
    return
  fi
  [ -f "$target/$GITIGNORE" ] && tr -d '\r' < "$target/$GITIGNORE" | grep -qxF -- "$SESSION_STATE"
}

# The session state is kept out of git, unless a rule already ignores it.
gitignore_path=$target/$GITIGNORE
if session_state_ignored; then
  gitignore_action=unchanged
elif [ ! -e "$gitignore_path" ]; then
  printf '%s\n' "$SESSION_STATE" > "$gitignore_path" || fail "cannot write $GITIGNORE"
  gitignore_action=created
else
  eol_text='\n'
  [ "$(head -n 1 "$gitignore_path" | tail -c 2 | od -An -tx1 | tr -d ' ')" = 0d0a ] && eol_text='\r\n'
  {
    if [ -s "$gitignore_path" ] && [ "$(tail -c 1 "$gitignore_path" | od -An -tx1 | tr -d ' ')" != 0a ]; then printf "$eol_text"; fi
    printf "%s$eol_text" "$SESSION_STATE"
  } >> "$gitignore_path" || fail "cannot write $GITIGNORE"
  gitignore_action=added
fi
echo "$REPORT_PREFIX$gitignore_action $GITIGNORE"
exit 0
