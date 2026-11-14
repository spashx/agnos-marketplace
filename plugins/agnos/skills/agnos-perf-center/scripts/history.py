"""agnos-perf-center history: who worked on the process elements and on the code, from the repository's git history.

Loaded by perf_center.py only with --history.
Python >= 3.9, standard library only; git is read through its command line, never through a library. Kept free of
quality findings.
"""
import datetime
import json
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

# A literal written more than once is a named constant.
ENCODING = "utf-8"
ERRORS = "replace"
HEAD = "HEAD"
KEY_NAME = "name"
KEY_EMAIL = "email"
KEY_KIND = "kind"
KEY_COMMITS = "commits"
KEY_CO_COMMITS = "coCommits"
KIND_HUMAN = "human"
KIND_AGENT = "agent"
KIND_TOGETHER = "together"
MERGED_BY_EMAIL = "email"
MERGED_BY_MAILMAP = "mailmap"
KEY_NAMES = "names"
KEY_EMAILS = "emails"
KEY_HASH = "hash"
KEY_PARENTS = "parents"
KEY_RAW = "raw"
KEY_AUTHOR = "author"
KEY_DATE = "date"
KEY_SUBJECT = "subject"
KEY_CO_AUTHORS = "coAuthors"
KEY_SPELLINGS = "spellings"
REV_PARSE = "rev-parse"
TOPO_ORDER = "--topo-order"

AGENTS_PATH = Path(__file__).resolve().parent.parent / "assets" / "agents.json"

# The causes for which the page is built without history.
CAUSE_NO_GIT = "git is not installed"
CAUSE_NO_TREE = "the process folder is not inside a git working tree"
CAUSE_NO_COMMIT = "the repository has no commit"

# One record per commit, its fields split by unit separators; %aN and %aE apply .mailmap.
RECORD = "\x1e"
FIELD = "\x1f"
TRAILER_SEPARATOR = "\x1d"
LOG_FIELDS = ("%H", "%P", "%an", "%ae", "%aN", "%aE", "%aI", "%s",
              "%(trailers:key=Co-authored-by,valueonly,separator=%x1d)")
LOG_FORMAT = RECORD + "%x1f".join(LOG_FIELDS) + FIELD
SHORT_HASH = 10
CONTACT_RE = re.compile(r"^([^<>]*)<([^<>]*)>\s*$")
MAILMAP_CHUNK = 200                                # contacts per `git check-mailmap`, within the command-line limit

# Zero-context patches with renames, paths written as they are, every parent of a merge walked.
QUOTE_OFF = ("-c", "core.quotepath=false")
PATCH_OPTIONS = ("-p", "-U0", "-M", "--no-color", "--no-ext-diff", "--no-textconv")
WALK_OPTIONS = ("-m", "--parents")
HUNK_RE = re.compile(r"^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@")
DIFF_PREFIX = "diff --git "
SECOND_SIDE = " b/"
OLD_PREFIX = "--- "
NEW_PREFIX = "+++ "
RENAME_FROM = "rename from "
RENAME_TO = "rename to "
NULL_PATH = "/dev/null"
SIDE_PREFIX = 2                                    # "a/" or "b/" before a path of a patch
NO_NEWLINE = "\\"                                  # "\ No newline at end of file", inside a hunk
MAX_AGE = "--max-age="
UTC_MARK = "Z"
UTC_OFFSET = "+00:00"
QUOTE = '"'
ESCAPE_RE = re.compile(rb"\\([0-7]{3}|.)")
ESCAPES = {b"t": b"\t", b"n": b"\n", b"r": b"\r", b"a": b"\a", b"b": b"\b", b"f": b"\f", b"v": b"\v"}
OCTAL = 8
OCTAL_DIGITS = 3

# The status and tier lines of a task, read in the hunks the history already follows.
MARK_PREFIX = "- **"
MARK_RE = re.compile(r"- \*\*(Status|Tier)\*\*:(.*)")
FIELD_STATUS = "Status"
FIELD_TIER = "Tier"
SIGN_ADDED = "+"
SIGN_REMOVED = "-"

# The rows of the friction log at HEAD, each with the commit that added it.
BLAME_HEADER_RE = re.compile(r"^([0-9a-f]{40,64}) \d+ \d+")
BLAME_TEXT = "\t"
TABLE_MARK = "|"
TABLE_RULE_RE = re.compile(r"^[\s|:-]+$")
FRICTION_ROW_RE = re.compile(r"^\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([A-Z]{3})" + r"\s*\|\s*(\d+)" * 4 + r"\s*\|\s*$")


class HistoryUnavailable(Exception):
    """The repository cannot give a history; the page is built without one."""


class GitError(Exception):
    """A git command failed."""


def git(args, cwd):
    """The standard output of one git command run in cwd."""
    try:
        done = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True, encoding=ENCODING,
                              errors=ERRORS, check=False)
    except FileNotFoundError:
        raise HistoryUnavailable(CAUSE_NO_GIT) from None
    if done.returncode != 0:
        raise GitError(done.stderr.strip() or f"git {args[0]} failed")
    return done.stdout


# ---- repository --------------------------------------------------------------------------------------------------
class Repository:
    """The working tree holding a folder: its top folder and whether it is a shallow clone."""

    def __init__(self, top, shallow):
        self.top = top
        self.shallow = shallow


def check_repository(folder):
    """The repository holding folder, or HistoryUnavailable naming why there is none to read."""
    git(["--version"], folder)
    try:
        top = Path(git([REV_PARSE, "--show-toplevel"], folder).strip())
    except GitError:
        raise HistoryUnavailable(CAUSE_NO_TREE) from None
    try:
        git([REV_PARSE, "--verify", "--quiet", HEAD], top)
    except GitError:
        raise HistoryUnavailable(CAUSE_NO_COMMIT) from None
    shallow = git([REV_PARSE, "--is-shallow-repository"], top).strip() == "true"
    return Repository(top, shallow)


# ---- agents ------------------------------------------------------------------------------------------------------
class AgentPatterns:
    """The patterns that class an identity as an agent, on its name and on its e-mail."""

    def __init__(self, names, emails):
        self.names = names
        self.emails = emails

    def is_agent(self, name, email):
        return any(p.search(name) for p in self.names) or any(p.search(email) for p in self.emails)


def compile_agent_patterns(spec):
    """AgentPatterns from {"name": [regex], "email": [regex]}, matched ignoring case."""
    return AgentPatterns([re.compile(p, re.I) for p in spec.get(KEY_NAME, [])],
                         [re.compile(p, re.I) for p in spec.get(KEY_EMAIL, [])])


def load_agent_patterns(path=AGENTS_PATH):
    return compile_agent_patterns(json.loads(Path(path).read_text(encoding=ENCODING)))


# ---- commits -----------------------------------------------------------------------------------------------------
# The commits of the history read, newest first.
def parse_contact(text):
    """(name, e-mail) of 'Name <e-mail>', or None."""
    m = CONTACT_RE.match(text)
    return (m.group(1).strip(), m.group(2)) if m else None


def utc_marked(date):
    """A date from git in one form, since git writes UTC as `+00:00` before 2.46 and as `Z` after."""
    return date[:-len(UTC_OFFSET)] + UTC_MARK if date.endswith(UTC_OFFSET) else date


def parse_header(record):
    """A commit of one log record: hash, parents, raw and mapped author, author date, subject, co-authors."""
    parts = record.split(FIELD)
    full, parents, raw_name, raw_mail, name, mail, date, subject, trailers = parts[:len(LOG_FIELDS)]
    co_authors = [c for c in (parse_contact(t) for t in trailers.split(TRAILER_SEPARATOR) if t.strip()) if c]
    return {KEY_HASH: full, KEY_PARENTS: parents.split(), KEY_RAW: (raw_name, raw_mail), KEY_AUTHOR: (name, mail),
            KEY_DATE: utc_marked(date), KEY_SUBJECT: subject, KEY_CO_AUTHORS: co_authors}


def log_args(since=None, depth=None, paths=(), options=()):
    """The options of `git log` for the history read: git applies both limits."""
    args = [*QUOTE_OFF, "log", f"--format={LOG_FORMAT}", TOPO_ORDER, *options]
    if since:
        args.append(f"--since={since}")
    if depth:
        args.append(f"--max-count={depth}")
    return args + ["--", *paths] if paths else args


def read_commits(repo, paths=(), since=None, depth=None):
    """The commits of the history read, newest first, merges included (they are walked, never credited)."""
    out = git(log_args(since, depth, paths), repo.top)
    return [parse_header(r) for r in out.split(RECORD) if r.strip()]


# ---- identities --------------------------------------------------------------------------------------------------
def map_contacts(repo, contacts):
    """{(name, e-mail): (name, e-mail) after .mailmap}, from `git check-mailmap`."""
    contacts = sorted(set(contacts))
    mapped = {}
    for start in range(0, len(contacts), MAILMAP_CHUNK):
        chunk = contacts[start:start + MAILMAP_CHUNK]
        lines = git(["check-mailmap", *(f"{n} <{m}>" for n, m in chunk)], repo.top).splitlines()
        for contact, line in zip(chunk, lines):
            mapped[contact] = parse_contact(line) or contact
    return mapped


class Identities:
    """The contributors of the history with every name and address seen: a human is one e-mail address, ignoring case;
    an agent is one name and e-mail, since the models of one vendor share a no-reply address."""

    def __init__(self, patterns):
        self.patterns = patterns
        self.by_key = {}

    def key_of(self, contact):
        name, mail = contact
        if self.patterns.is_agent(name, mail):
            return KIND_AGENT, f"{name.lower()} <{mail.lower()}>"
        return KIND_HUMAN, mail.lower()

    def add(self, raw, mapped, role):
        kind, key = self.key_of(mapped)
        person = self.by_key.setdefault(key, {KEY_KIND: kind, KEY_NAMES: Counter(), KEY_RAW: set(),
                                              KEY_SPELLINGS: set(), KEY_EMAILS: set(), MERGED_BY_MAILMAP: False,
                                              KEY_COMMITS: 0, KEY_CO_COMMITS: 0})
        person[KEY_NAMES][mapped[0]] += 1
        person[KEY_RAW].add(raw[0])
        person[KEY_SPELLINGS].add(mapped)
        person[KEY_EMAILS].update({raw[1].lower(), mapped[1].lower()})
        person[MERGED_BY_MAILMAP] |= raw != mapped
        person[role] += 1
        return key

    def people(self):
        """The identities as the data file holds them, by number of commits from the highest, then by name."""
        result = []
        for key, person in self.by_key.items():
            names = person[KEY_NAMES]
            name = min(names, key=lambda n, seen=names: (-seen[n], n))
            merged = ([MERGED_BY_EMAIL] if len(person[KEY_SPELLINGS]) > 1 else []) + \
                     ([MERGED_BY_MAILMAP] if person[MERGED_BY_MAILMAP] else [])
            result.append({"key": key, KEY_NAME: name, KEY_NAMES: sorted(set(names) | person[KEY_RAW]),
                           KEY_EMAILS: sorted(person[KEY_EMAILS]), "mergedBy": sorted(merged),
                           KEY_KIND: person[KEY_KIND], KEY_COMMITS: person[KEY_COMMITS],
                           KEY_CO_COMMITS: person[KEY_CO_COMMITS]})
        result.sort(key=lambda p: (-(p[KEY_COMMITS] + p[KEY_CO_COMMITS]), p[KEY_NAME], p["key"]))
        return result


def commit_kind(kinds):
    """human, agent or together, from the kinds of a commit's contributors."""
    if KIND_AGENT not in kinds:
        return KIND_HUMAN
    return KIND_AGENT if KIND_HUMAN not in kinds else KIND_TOGETHER


def listed_commit(commit, author, co, index, people):
    """A commit as the data file holds it: its author and co-authors as indexes into people, and its kind."""
    contributors = [index[author]] + [index[k] for k in co]
    return {KEY_HASH: commit[KEY_HASH][:SHORT_HASH], KEY_DATE: commit[KEY_DATE], KEY_SUBJECT: commit[KEY_SUBJECT],
            KEY_AUTHOR: index[author], KEY_CO_AUTHORS: [index[k] for k in co],
            KEY_KIND: commit_kind({people[i][KEY_KIND] for i in contributors})}


def identify(repo, commits, patterns):
    """(people, commits): the identities of the non-merge commits, and those commits with their author and co-authors
    as indexes into people and their kind; a merge's committer and author are never read as contributors."""
    authored = [c for c in commits if not is_merge(c)]
    mapped = map_contacts(repo, [a for c in authored for a in c[KEY_CO_AUTHORS]])
    identities = Identities(patterns)
    keys = []
    for commit in authored:
        author = identities.add(commit[KEY_RAW], commit[KEY_AUTHOR], KEY_COMMITS)
        co = [identities.add(a, mapped[a], KEY_CO_COMMITS) for a in commit[KEY_CO_AUTHORS]]
        keys.append((author, [k for k in dict.fromkeys(co) if k != author]))
    people = identities.people()
    index = {p.pop("key"): n for n, p in enumerate(people)}
    return people, [listed_commit(commit, author, co, index, people) for commit, (author, co) in zip(authored, keys)]


# ---- line tracking -----------------------------------------------------------------------------------------------
def git_lines(args, cwd):
    """The output lines of one git command, read as bytes so that a carriage return inside a line stays in it."""
    try:
        process = subprocess.Popen(["git", *args], cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except FileNotFoundError:
        raise HistoryUnavailable(CAUSE_NO_GIT) from None
    with process:
        for raw in process.stdout:
            yield raw.rstrip(b"\n").decode(ENCODING, errors=ERRORS)
        error = process.stderr.read().decode(ENCODING, errors=ERRORS).strip()
    if process.returncode != 0:
        raise GitError(error or f"git {args[0]} failed")


def unquote(path):
    """A path as git writes it, quoted with C escapes when it holds a quote, a backslash or a control character."""
    if not (len(path) > 1 and path.startswith(QUOTE) and path.endswith(QUOTE)):
        return path

    def one(m):
        code = m.group(1)
        return bytes([int(code, OCTAL)]) if len(code) == OCTAL_DIGITS else ESCAPES.get(code, code)
    return ESCAPE_RE.sub(one, path[1:-1].encode(ENCODING)).decode(ENCODING, errors=ERRORS)


def side_path(text):
    """The path of a '--- a/x' or '+++ b/x' line, or None for /dev/null."""
    path = unquote(text)
    return None if path == NULL_PATH else path[SIDE_PREFIX:]


def same_path(header):
    """The path of 'diff --git a/x b/x' when both sides are the same path, else None (the next lines tell)."""
    rest = header[len(DIFF_PREFIX):]
    size = (len(rest) - len(SECOND_SIDE) - SIDE_PREFIX) // 2
    middle = SIDE_PREFIX + size
    first, second = rest[SIDE_PREFIX:middle], rest[middle + len(SECOND_SIDE):]
    return first if first == second and rest[middle:middle + len(SECOND_SIDE)] == SECOND_SIDE else None


class FileDiff:
    """One file of a patch: its old and new paths (None when absent), its hunks (old start, old count, new start,
    new count) and its marks (sign, line number on that side, field, value): the status and tier lines it changed."""

    def __init__(self, path):
        self.old = self.new = path
        self.hunks = []
        self.marks = []


def read_hunk_line(diff, line, old_next, new_next):
    """(old_next, new_next) after one changed line of a hunk, the numbers its next removed and added lines will have;
    a status or tier line is kept in diff's marks with its number."""
    removed = line.startswith(SIGN_REMOVED)
    m = MARK_RE.match(line, 1) if line.startswith(MARK_PREFIX, 1) else None
    if m:
        diff.marks.append((SIGN_REMOVED if removed else SIGN_ADDED, old_next if removed else new_next, m.group(1),
                           m.group(2).strip()))
    return (old_next + 1, new_next) if removed else (old_next, new_next + 1)


class PatchReader:
    """Reads a patch line by line: the entries so far, the current record's diffs, the current file's diff, how many
    lines of its hunk remain, and the numbers its next removed and added lines will have."""

    def __init__(self):
        self.entries = []
        self.diffs = None
        self.diff = None
        self.pending = 0
        self.old_next = self.new_next = 0

    def read(self, line):
        if self.pending:
            self.read_hunk(line)
        elif line.startswith(RECORD):
            self.diffs, self.diff = [], None
            self.entries.append((line[1:], self.diffs))
        else:
            self.read_file_line(line)

    def read_hunk(self, line):
        if not line.startswith(NO_NEWLINE):
            self.pending -= 1
            self.old_next, self.new_next = read_hunk_line(self.diff, line, self.old_next, self.new_next)

    def read_file_line(self, line):
        if self.diffs is None:
            self.diffs = []
            self.entries.append((None, self.diffs))
        if line.startswith(DIFF_PREFIX):
            self.diff = FileDiff(same_path(line))
            self.diffs.append(self.diff)
        elif self.diff is not None:
            self.read_diff_header(line)

    def read_diff_header(self, line):
        diff = self.diff
        if line.startswith(RENAME_FROM):
            diff.old = unquote(line[len(RENAME_FROM):])
        elif line.startswith(RENAME_TO):
            diff.new = unquote(line[len(RENAME_TO):])
        elif line.startswith(OLD_PREFIX):
            diff.old = side_path(line[len(OLD_PREFIX):])
        elif line.startswith(NEW_PREFIX):
            diff.new = side_path(line[len(NEW_PREFIX):])
        else:
            self.start_hunk(line)

    def start_hunk(self, line):
        m = HUNK_RE.match(line)
        if m:
            old_start, old_count, new_start, new_count = (int(g) if g is not None else 1 for g in m.groups())
            self.diff.hunks.append((old_start, old_count, new_start, new_count))
            self.pending = old_count + new_count
            self.old_next, self.new_next = old_start, new_start


def parse_patch(lines):
    """[(header record or None, [FileDiff])] in the order of the output; a hunk's lines are counted, never parsed as
    headers, so that a changed line that looks like a header is read as a line; its status and tier lines are kept
    as marks."""
    reader = PatchReader()
    for line in lines:
        reader.read(line)
    return reader.entries


def widened(span, start, end):
    """The span (first, last), or None, made to hold start to end."""
    return (start, end) if span is None else (min(span[0], start), max(span[1], end))


def hunk_touch(old_count, new_start, new_count, first, last):
    """(whether a hunk touches the range [first, last], the lines it changed there)."""
    if new_count:
        overlap = min(new_start + new_count - 1, last) - max(new_start, first) + 1
        if overlap > 0:
            return True, overlap + (old_count * overlap + new_count // 2) // new_count
        return False, 0
    if first <= new_start < last:
        return True, old_count
    return False, 0


def shift(first, last, hunks):
    """(the range [first, last] of a file's new version in its old version, or None when all its lines were added; the
    lines the hunks changed in it). The old range spans the unchanged lines of the range and the old lines of the hunks
    that touch it, as `git log -L` follows a range; a hunk's removed lines count in proportion of its added lines in the
    range, a pure removal inside the range counts whole."""
    span = None
    delta = changed = 0                        # old line = new line + delta, for the unchanged lines past the hunks
    position = first
    for old_start, old_count, new_start, new_count in hunks:
        start = new_start if new_count else new_start + 1
        if start > last:
            break
        unchanged = max(position, first)
        if unchanged <= start - 1:
            span = widened(span, unchanged + delta, min(start - 1, last) + delta)
        touched, lines = hunk_touch(old_count, new_start, new_count, first, last)
        changed += lines
        if touched and old_count:
            span = widened(span, old_start, old_start + old_count - 1)
        delta += old_count - new_count
        position = start + new_count
    if max(position, first) <= last:
        span = widened(span, max(position, first) + delta, last + delta)
    return span, changed


def note_marks(events, key, commit, diff, first, last, span):
    """Records in events {key: {commit: (added, removed, created)}} the status and tier lines the commit added in the
    task's range or removed from its old range, and whether it added the whole range."""
    added = [(field, value) for sign, n, field, value in diff.marks if sign == SIGN_ADDED and first <= n <= last]
    removed = [(field, value) for sign, n, field, value in diff.marks
               if sign == SIGN_REMOVED and span is not None and span[0] <= n <= span[1]]
    if added or removed or span is None:
        events.setdefault(key, {})[commit] = (added, removed, span is None)


class Watching:
    """The keys whose status and tier lines are noted as the commits change them, and where."""

    def __init__(self, events, keys):
        self.events = events
        self.keys = keys


NOT_WATCHING = Watching({}, frozenset())


def range_through(diff, first, last):
    """(the range in the diff's old version, the lines the diff changed in it); first None: the whole file."""
    if first is None:
        return (None, None), sum(old + new for _, old, _, new in diff.hunks)
    return shift(first, last, diff.hunks)


def carried_ranges(items, diff, commit, tally, watching):
    """The ranges of one file carried through its diff; each one touched is credited to commit, unless None."""
    kept = []
    for key, first, last in items:
        span, changed = range_through(diff, first, last)
        if commit is not None and changed:
            by_commit = tally.setdefault(key, {})
            by_commit[commit] = by_commit.get(commit, 0) + changed
        if commit is not None and key in watching.keys:
            note_marks(watching.events, key, commit, diff, first, last, span)
        if span is not None:
            kept.append((key, *span))
    return kept


def transform(state, diffs, commit, tally, watching=NOT_WATCHING):
    """The ranges of state, {path: [(key, first, last)]} in a version's coordinates (first None: the whole file), in the
    coordinates of the version the diffs start from; each range the diffs touch is credited to commit in tally, unless
    None; the watched ranges also note their marks."""
    by_new = {d.new: d for d in diffs if d.new is not None}
    moved = {}
    for path, items in state.items():
        diff = by_new.get(path)
        if diff is None:
            moved.setdefault(path, []).extend(items)
            continue
        kept = carried_ranges(items, diff, commit, tally, watching)
        if diff.old is not None and kept:
            moved.setdefault(diff.old, []).extend(kept)
    return moved


def union(into, state):
    """Adds state's ranges to into; a range of one key met twice spans both, since two children of a commit can carry
    it back slightly differently."""
    for path, items in state.items():
        by_key = {(key, first is None): (key, first, last) for key, first, last in into.get(path, [])}
        for key, first, last in items:
            seen = by_key.get((key, first is None))
            if seen is not None and first is not None:
                by_key[(key, False)] = (key, min(first, seen[1]), max(last, seen[2]))
            else:
                by_key[(key, first is None)] = (key, first, last)
        into[path] = sorted(by_key.values(), key=lambda item: (item[0], item[1] or 0))


def author_cutoff(repo, since):
    """The time stamp before which a commit was not authored in the period read, or None: git's --since
    is on the committer date, so the author date is checked here."""
    if not since:
        return None
    answer = git([REV_PARSE, f"--since={since}"], repo.top).strip()
    return int(answer[len(MAX_AGE):]) if answer.startswith(MAX_AGE) else None


def timestamp(commit):
    """The author time stamp of a commit; git writes UTC as 'Z', which Python reads only from 3.11."""
    date = commit[KEY_DATE]
    return datetime.datetime.fromisoformat(date[:-1] + UTC_OFFSET if date.endswith(UTC_MARK) else date).timestamp()


def authored_since(commit, cutoff):
    return cutoff is None or timestamp(commit) >= cutoff


def commit_groups(entries):
    """[(commit, [diffs per parent])] from the log's entries: git writes a merge once per parent, one after the
    other."""
    groups = []
    for record, diffs in entries:
        if record is None:
            continue
        commit = parse_header(record)
        if groups and groups[-1][0][KEY_HASH] == commit[KEY_HASH]:
            groups[-1][1].append(diffs)
        else:
            groups.append((commit, [diffs]))
    return groups


KEY_MERGE = "merge"


def is_merge(commit):
    """A merge, as git records it: the folders' history may show it with one parent, or none."""
    return commit.get(KEY_MERGE) or len(commit[KEY_PARENTS]) > 1


def merge_hashes(repo, since=None):
    """The merges of HEAD's history, from their true parents: the path-limited log rewrites a merge's parents and can
    leave it one."""
    return set(git(["rev-list", "--merges", HEAD, *([f"--since={since}"] if since else [])], repo.top).split())


def tracked_files(repo, paths):
    out = git([*QUOTE_OFF, "ls-files", "-z", "--", *paths], repo.top)
    return set(filter(None, out.split("\0")))


def working_tree_state(repo, ranges, wholes, paths, tally):
    """The tracked ranges and whole files in HEAD's coordinates: the uncommitted changes move them and credit no one."""
    tracked = tracked_files(repo, paths)
    state = {}
    for path, items in ranges.items():
        state.setdefault(path, []).extend(items)
    for path, keys in wholes.items():
        state.setdefault(path, []).extend((key, None, None) for key in keys)
    state = {path: items for path, items in state.items() if path in tracked}
    for _, diffs in parse_patch(git_lines([*QUOTE_OFF, "diff", *PATCH_OPTIONS, HEAD, "--", *paths], repo.top)):
        state = transform(state, diffs, None, tally)
    return state


def carry_to_parents(here, commit, per_parent, credited, walk):
    """Carries the ranges of a commit back to its parents; walk is (tally, the parents' states, watching)."""
    tally, states, watching = walk
    parents = commit[KEY_PARENTS]
    if not parents:
        transform(here, per_parent[0], credited, tally, watching)
        return
    for number, parent in enumerate(parents):
        diffs = per_parent[number] if number < len(per_parent) else []
        union(states.setdefault(parent, {}), transform(here, diffs, credited, tally, watching))


def read_history(repo, ranges, wholes, paths=(), since=None, depth=None, watching=NOT_WATCHING):
    """(commits, credits): the commits authored in the period read, newest first, merges included; and
    {key: {full hash: changed lines}}, the non-merge commits that changed each range. ranges is {path: [(key, first,
    last)]} and wholes {path: [key]}, at the working tree, paths relative to the top of the repository; paths limits
    the history read to these folders. The uncommitted changes credit no one. The watched keys note their status and
    tier lines, as those commits do."""
    tally = {}
    state = working_tree_state(repo, ranges, wholes, paths, tally)
    cutoff = author_cutoff(repo, since)
    merges = merge_hashes(repo, since)
    patch = git_lines(log_args(since, depth, paths, PATCH_OPTIONS + WALK_OPTIONS), repo.top)
    commits, states = [], {}
    for position, (commit, per_parent) in enumerate(commit_groups(parse_patch(patch))):
        here = state if position == 0 else states.pop(commit[KEY_HASH], None)
        commit[KEY_MERGE] = commit[KEY_HASH] in merges or len(commit[KEY_PARENTS]) > 1
        authored = authored_since(commit, cutoff)
        if authored:
            commits.append(commit)
        if here is not None:                                 # else reached by no commit read: nothing to carry back
            credited = commit[KEY_HASH] if authored and not commit[KEY_MERGE] else None
            carry_to_parents(here, commit, per_parent, credited, (tally, states, watching))
    return commits, tally


# ---- the commit graph --------------------------------------------------------------------------------------------
# The path-limited log's parents are rewritten by git's history simplification, so the graph
# is read by a light log of its own, with no path and no patch.
KEY_GRAPH = "graph"
KEY_BRANCHES = "branches"
KEY_NODES = "nodes"
KEY_BRANCH = "branch"
KEY_COMMIT = "commit"
DEFAULT_BRANCHES = ("main", "master")
GRAPH_FORMAT = RECORD + "%x1f".join(("%H", "%P", "%aI", "%s"))
TIP_FORMAT = "%(objectname)%1f%(refname:short)"
MERGE_NAMES = (re.compile(r"^Merge branch '([^']+)'"),                   # git merge
               re.compile(r"^Merge pull request #\d+ from [^/\s]+/(\S+)"),  # GitHub
               re.compile(r"^Merge (?!branch )(\S+) into \S+"))             # Merge X into Y


def read_graph(repo, since=None):
    """The commits of the repository from HEAD, newest first in topological order: hash, parents, date, subject."""
    out = git(["log", f"--format={GRAPH_FORMAT}", TOPO_ORDER, *([f"--since={since}"] if since else [])], repo.top)
    nodes = []
    for record in out.split(RECORD):
        if record.strip():
            full, parents, date, subject = record.rstrip("\n").split(FIELD)
            nodes.append({KEY_HASH: full, KEY_PARENTS: parents.split(), KEY_DATE: utc_marked(date), KEY_SUBJECT: subject})
    return nodes


def branch_tips(repo):
    """[(tip hash, name)] of the local branches, and the name of the branch checked out, or None."""
    out = git(["for-each-ref", f"--format={TIP_FORMAT}", "refs/heads"], repo.top)
    tips = [tuple(line.split(FIELD, 1)) for line in out.splitlines() if FIELD in line]
    try:
        current = git(["symbolic-ref", "-q", "--short", HEAD], repo.top).strip() or None
    except GitError:
        current = None                                       # a detached HEAD
    return tips, current


def merge_name(subject):
    """The branch a merge's message names as merged, or None."""
    for pattern in MERGE_NAMES:
        m = pattern.match(subject)
        if m:
            return m.group(1)
    return None


class BranchClaims:
    """The branch of each node so far, and the branches' names in the order found."""

    def __init__(self, nodes):
        self.nodes = nodes
        self.index = {n[KEY_HASH]: i for i, n in enumerate(nodes)}
        self.branch_of = [None] * len(nodes)
        self.names = []
        self.numbers = {}

    def number_of(self, name):
        if name is None or name not in self.numbers:
            self.names.append(name)
            if name is not None:
                self.numbers[name] = len(self.names) - 1
        return len(self.names) - 1 if name is None else self.numbers[name]

    def claim(self, start, name):
        """Follows the first parents from a node until a commit already claimed."""
        if start is None or self.branch_of[start] is not None:
            return
        number = self.number_of(name)
        i = start
        while i is not None and self.branch_of[i] is None:
            self.branch_of[i] = number
            parents = self.nodes[i][KEY_PARENTS]
            i = self.index.get(parents[0]) if parents else None


def assign_branches(nodes, tips, current):
    """(names, branch of each node): from the default branch's tip, the other tips oldest first, then the second parent
    of each merge naming its branch, newest first, the first parents are followed until a commit already claimed; the
    commits left take one unnamed branch (None) per first-parent chain."""
    claims = BranchClaims(nodes)
    present = {name: claims.index[tip] for tip, name in tips if tip in claims.index}
    default = next((b for b in DEFAULT_BRANCHES if b in present), current if current in present else None)
    if default is not None:
        claims.claim(present[default], default)
    for name in sorted((n for n in present if n != default), key=lambda n: (-present[n], n)):
        claims.claim(present[name], name)
    for node in nodes:
        name = merge_name(node[KEY_SUBJECT]) if len(node[KEY_PARENTS]) > 1 else None
        if name is not None:
            claims.claim(claims.index.get(node[KEY_PARENTS][1]), name)
    for i in range(len(nodes)):
        claims.claim(i, None)
    return claims.names, claims.branch_of


def graph_block(nodes, names, branch_of, position):
    """The data file's graph: the nodes down to the oldest commit of the timeline, each with its parents among them, its
    branch and its commit index, or, with no commit index, its date and subject; the branches in the order found."""
    last = max((i for i, n in enumerate(nodes) if n[KEY_HASH] in position), default=-1)
    kept = nodes[:last + 1]
    index = {n[KEY_HASH]: i for i, n in enumerate(kept)}
    used = sorted({branch_of[i] for i in range(len(kept))})
    renumber = {old: new for new, old in enumerate(used)}
    result = []
    for i, node in enumerate(kept):
        commit = position.get(node[KEY_HASH])
        item = {KEY_HASH: node[KEY_HASH][:SHORT_HASH], KEY_PARENTS: [index[p] for p in node[KEY_PARENTS] if p in index],
                KEY_BRANCH: renumber[branch_of[i]], KEY_COMMIT: commit}
        if commit is None:
            item[KEY_DATE] = node[KEY_DATE]
            item[KEY_SUBJECT] = node[KEY_SUBJECT]
        result.append(item)
    return {KEY_BRANCHES: [names[old] for old in used], KEY_NODES: result}


def build_graph(repo, since, position):
    nodes = read_graph(repo, since)
    tips, current = branch_tips(repo)
    names, branch_of = assign_branches(nodes, tips, current)
    return graph_block(nodes, names, branch_of, position)


# ---- the history block -------------------------------------------------------------------------------------------
KIND_ELEMENT = "elements"
KIND_FILE = "files"
KIND_FUNCTION = "functions"
KEY_LIMITS = "limits"
KEY_PEOPLE = "people"


def relative_to(path, top):
    """A path relative to the top of the repository, or None when it lies outside."""
    try:
        return Path(path).resolve().relative_to(top.resolve()).as_posix()
    except ValueError:
        return None


def ranges_to_track(top, documents, files, functions):
    """(ranges, wholes) of read_history: the process elements and the functions by their lines, the files whole; a
    path outside the repository is left out."""
    ranges, wholes = {}, {}
    for path, elements in documents.items():
        where = relative_to(path, top)
        if where is not None:
            ranges.setdefault(where, []).extend(((KIND_ELEMENT, i), first, last) for i, first, last in elements)
    where_of = {shown: relative_to(path, top) for shown, path in files.items()}
    for shown, where in where_of.items():
        if where is not None:
            wholes.setdefault(where, []).append((KIND_FILE, shown))
    for number, (shown, first, last) in enumerate(functions):
        if where_of.get(shown) is not None:
            ranges.setdefault(where_of[shown], []).append(((KIND_FUNCTION, number), first, last))
    return ranges, wholes


# ---- the delivery block ------------------------------------------------------------------------------------------
DELIVERY_PATH = Path(__file__).resolve().parent.parent / "assets" / "delivery.json"
KEY_DELIVERY = "delivery"
SETTINGS_COMMENT_KEY = "_comment"
DONE = "Done"
FIX_TYPE = "fix"
REASON_CREATED_DONE = "created-done"
REASON_ANNOTATED = "annotated"
REASON_REOPENED = "reopened"
REASON_NO_TIER = "no-tier"
DAY_LENGTH = 10                                    # "2026-10-27" at the head of an ISO author date: the author's day
SECONDS_PER_DAY = 86400
COMMIT_TYPE_RE = re.compile(r"^([a-z]+)(?:\([^)]*\))?!?:")
ID_RE = re.compile(r"(?<![A-Za-z0-9])(?:FTR|RQ|ADR|DEC|PLAN|TASK)-[A-Z]{3}-[0-9]{3}(?![0-9])")


def load_delivery_settings(path=DELIVERY_PATH):
    """The settings the data file carries: the file's own comment is not one of them."""
    settings = json.loads(Path(path).read_text(encoding=ENCODING))
    settings.pop(SETTINGS_COMMENT_KEY, None)
    return settings


def commit_type(subject):
    """The Conventional-Commits type of a subject ('feat' of 'feat(TRC): ...'), or None."""
    m = COMMIT_TYPE_RE.match(subject)
    return m.group(1) if m else None


def first_delivery(timeline):
    """(commit index, status value, created) of the first commit adding a status that starts with Done, or None."""
    for index, (added, _, created) in timeline:
        for field, value in added:
            if field == FIELD_STATUS and value.startswith(DONE):
                return index, value, created
    return None


def set_aside(timeline, index, value, created, tier):
    """Why a delivered task counts in no figure, or None: created Done, a comment after Done, its status left Done
    later, or no tier."""
    if created:
        return REASON_CREATED_DONE
    if value != DONE:
        return REASON_ANNOTATED
    if any(field == FIELD_STATUS and not v.startswith(DONE)
           for i, (added, _, _) in timeline if i > index for field, v in added):
        return REASON_REOPENED
    return None if tier else REASON_NO_TIER


def active_days(listed):
    """{person index as text: [day, ...]}: the days each identity authored or co-authored a commit."""
    days = {}
    for commit in listed:
        for person in [commit[KEY_AUTHOR], *commit[KEY_CO_AUTHORS]]:
            days.setdefault(person, set()).add(commit[KEY_DATE][:DAY_LENGTH])
    return {str(person): sorted(found) for person, found in sorted(days.items())}


class DeliveryReader:
    """What the delivery rows are read from: the commits authored in order, the marks noted, the lines changed in the
    scanned files per commit, the fix commits with the IDs they cite, and the rework window in seconds."""

    def __init__(self, events, tally, authored, settings):
        self.events = events
        self.authored = authored
        self.position = {c[KEY_HASH]: n for n, c in enumerate(authored)}
        self.file_lines = Counter()
        for (kind, _), by_commit in tally.items():
            if kind == KIND_FILE:
                self.file_lines.update(by_commit)
        self.fixes = [(n, set(ID_RE.findall(c[KEY_SUBJECT]))) for n, c in enumerate(authored)
                      if commit_type(c[KEY_SUBJECT]) == FIX_TYPE]
        self.window = settings["reworkDays"] * SECONDS_PER_DAY

    def reworked(self, index, cited):
        """A fix citing the task or a requirement it cites came within the window after its delivery."""
        limit = timestamp(self.authored[index]) + self.window
        return any(n > index and timestamp(self.authored[n]) <= limit and ids & cited for n, ids in self.fixes)

    def row(self, task_id, tier, requirements):
        """[ID, tier, re-tiered, commit index, lines changed, commit type, reworked, reason set aside or None], or None
        for a task not delivered in the history read."""
        by_commit = self.events.get((KIND_ELEMENT, task_id), {})
        timeline = sorted((self.position[h], e) for h, e in by_commit.items() if h in self.position)
        found = first_delivery(timeline)
        if found is None:
            return None
        index, value, created = found
        commit = self.authored[index]
        re_tiered = any(field == FIELD_TIER for _, (added, _, new) in timeline if not new for field, _ in added)
        return [task_id, tier, re_tiered, index, self.file_lines[commit[KEY_HASH]], commit_type(commit[KEY_SUBJECT]),
                self.reworked(index, {task_id, *requirements}), set_aside(timeline, index, value, created, tier)]


def delivery_block(tasks, events, tally, authored, listed, settings):
    """The data file's delivery block: each task delivered in the history read, as DeliveryReader.row gives it, in the
    order of tasks {ID: (tier or None, [requirement IDs])}; the active days of each identity; the settings
."""
    reader = DeliveryReader(events, tally, authored, settings)
    rows = (reader.row(task_id, tier, requirements) for task_id, (tier, requirements) in tasks.items())
    return {"tasks": [row for row in rows if row is not None], "activeDays": active_days(listed), "settings": settings}


def blamed_lines(repo, path):
    """[(commit hash, text)] of a file at HEAD, or nothing when HEAD does not hold it."""
    try:
        output = git(["blame", "--porcelain", HEAD, "--", path], repo.top)
    except GitError:
        return []
    lines, commit = [], None
    for line in output.splitlines():
        header = BLAME_HEADER_RE.match(line)
        if header:
            commit = header.group(1)
        elif line.startswith(BLAME_TEXT):
            lines.append((commit, line[len(BLAME_TEXT):].strip()))
    return lines


def friction_block(lines, position, merges, name):
    """[date, trigram, 4 counters, commit index] of each data row of the log's blamed lines; a
    row outside the history read is left out, a malformed row or one of a merge also named on the error stream, the log by
    its name."""
    rows, in_table = [], False
    for commit, text in lines:
        if not text.startswith(TABLE_MARK):
            continue
        if not in_table:
            in_table = bool(TABLE_RULE_RE.match(text))
            continue
        found = FRICTION_ROW_RE.match(text)
        if found is None or commit in merges:
            print(f"agnos-perf-center: warning: {name}: row left out: {text}", file=sys.stderr)
        elif commit in position:
            date, trigram, *counters = found.groups()
            rows.append([date, trigram, *map(int, counters), position[commit]])
    return rows


def interventions_of(tally, position, functions):
    """{kind: {name: [[commit index, lines changed]]}}, a function's kind only with a call graph."""
    interventions = {KIND_ELEMENT: {}, KIND_FILE: {}}
    if functions:
        interventions[KIND_FUNCTION] = {}
    for (kind, name), by_commit in tally.items():
        interventions[kind][str(name)] = sorted([position[h], lines] for h, lines in by_commit.items() if h in position)
    return interventions


def history_limits(since, depth, listed, shallow):
    """What limited the history read, and its first and last dates."""
    dates = [c[KEY_DATE] for c in listed]
    return {"since": since or None, "depth": depth or None, KEY_COMMITS: len(listed),
            "first": dates[0] if dates else None, "last": dates[-1] if dates else None, "shallow": shallow}


# agnos-qa-exception: PLR0913 the generator's one entry here: its tracked lists and limits are separate inputs
def build(folder, documents, files, functions, scope, since=None, *, depth=None, tasks=None, friction_log=None):
    """The data file's history block, for the repository holding folder. documents is {path: [(ID, first, last)]} of
    the process documents, files {shown path: path} of the scanned files, functions [(shown path, first, last)] of the
    call graph in its order (empty without one), scope the folders whose history is read; with tasks {ID: (tier,
    [requirement IDs])}, the block also holds the delivery. HistoryUnavailable or GitError when the
    repository cannot be read."""
    repo = check_repository(folder)
    ranges, wholes = ranges_to_track(repo.top, documents, files, functions)
    paths = sorted({p for p in (relative_to(f, repo.top) for f in scope) if p is not None}) or ["."]
    watching = Watching({}, frozenset((KIND_ELEMENT, t) for t in tasks or ()))
    commits, tally = read_history(repo, ranges, wholes, paths, since, depth, watching)
    authored = sorted((c for c in commits if not is_merge(c)), key=lambda c: (timestamp(c), c[KEY_HASH]))
    people, listed = identify(repo, authored, load_agent_patterns())
    position = {c[KEY_HASH]: n for n, c in enumerate(authored)}
    block = {KEY_LIMITS: history_limits(since, depth, listed, repo.shallow), KEY_PEOPLE: people, KEY_COMMITS: listed,
             "interventions": interventions_of(tally, position, functions),
             KEY_GRAPH: build_graph(repo, since, position)}
    if tasks is not None:
        block[KEY_DELIVERY] = delivery_block(tasks, watching.events, tally, authored, listed, load_delivery_settings())
        # The log's path in the folder is the caller's, from the layout, so that this module
        # imports only the standard library
        log = relative_to(Path(folder) / friction_log, repo.top)
        block[KEY_DELIVERY]["friction"] = friction_block(blamed_lines(repo, log), position,
                                                         {c[KEY_HASH] for c in commits if is_merge(c)}, Path(friction_log).name)
    return block


def summary(block):
    """The part of the generator's last line about the history, each noun singular for one
."""
    kinds = Counter(p[KEY_KIND] for p in block[KEY_PEOPLE])
    counts = ((block[KEY_LIMITS][KEY_COMMITS], "commit"), (kinds[KIND_HUMAN], "human"), (kinds[KIND_AGENT], "agent"))
    return "history: " + ", ".join(f"{n} {noun}{'' if n == 1 else 's'}" for n, noun in counts)
