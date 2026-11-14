#!/usr/bin/env python3
"""agnos-perf-center: the traceability matrix of an AGNOS process and its sources, as one self-contained HTML page.

Procedure and options: ../SKILL.md.
Python >= 3.9, standard library only. Knows the AGNOS ID grammar and the process index's format,
nothing of the product being developed. --call-graph loads callgraph.py beside it. Kept free of quality findings.
"""
import argparse
import datetime
import fnmatch
import html
import importlib.util
import json
import os
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))    # scorecard.py, beside this script
import scorecard  # noqa: E402
import agnos_layout  # noqa: E402 the process folder's names, generated beside this script

# A literal written more than once is a named constant.
DURATION_FORMAT = ".3f"    # Seconds, three decimals
KEY_UNCOVERED = "uncovered"
KEY_COVERED = "covered"
KEY_INDIRECT = "indirect"
KEY_UNDEFINED = "undefined"
KEY_COVERAGE = "coverage"
KEY_KIND = "kind"
KEY_TYPE = "type"
KEY_FIRST = "first"
KEY_LAST = "last"
KEY_STATUS = "status"
KEY_TITLE = "title"
KEY_CODE = "code"
KEY_GLOBAL = "global"
ENCODING = "utf-8"
KEY_APPEND = "append"
STORE_TRUE = "store_true"
KEY_ELEMENT = "element"
KEY_CONTAINS = "contains"
KEY_REFS = "refs"
KEY_SEMANTIC = "semantic"
KEY_REPLACE = "replace"
TYPE_TASK = "TASK"
TYPE_RQ = "RQ"
TIER_RE = re.compile(r"^- \*\*Tier\*\*:\s*([SML])\b")     # A task's tier, as the AGNOS template writes it
KEY_DELIVERY = "delivery"

INDEX_NAME = agnos_layout.INDEX
DEFAULT_OUT_NAME = agnos_layout.PERF_CENTER_PAGE
TYPES = ("FTR", "RQ", "ADR", "DEC", "PLAN", "TASK")
ID_PATTERN = r"(?:FTR|RQ|ADR|DEC|PLAN|TASK)-[A-Z]{3}-[0-9]{3}"
NUMBER_LENGTH = 3
INDEX_TITLE_FIELD = 3                          # "ID|first-last|status|title": the title is the fourth field
INDEX_FIELDS = INDEX_TITLE_FIELD + 1
PREFIX_CUT = -(NUMBER_LENGTH + 1)              # "RQ-ABC-001"[:PREFIX_CUT] == "RQ-ABC"
LINE_TEXT_MAX = 200                            # characters of a line kept as evidence

# What a source folder holds that can carry an ID; every list is replaceable from the command
# line.
DEFAULT_EXTENSIONS = frozenset(
    ".c .cc .cpp .cxx .c++ .h .hh .hpp .hxx .h++ .inl .ipp .tpp .m .mm .cs .fs .vb .java .kt .kts .scala .groovy "
    ".gradle .go .rs .swift .dart .py .pyi .pyw .rb .php .pl .pm .lua .r .jl .ex .exs .erl .hs .clj .js .jsx .mjs "
    ".cjs .ts .tsx .vue .svelte .html .htm .css .scss .sass .less .sql .sh .bash .zsh .fish .ps1 .psm1 .psd1 .bat .cmd "
    ".cmake .mk .yml .yaml .toml .ini .cfg .xml .proto .graphql .tf .glsl .hlsl .metal .cu .asm .s .v .sv .vhd".split())
DEFAULT_NAMES = frozenset({"CMakeLists.txt", "Makefile", "makefile", "GNUmakefile", "Dockerfile", "Jenkinsfile",
                           "Rakefile", "Gemfile", "meson.build", "BUILD", "BUILD.bazel", "WORKSPACE"})
DEFAULT_EXCLUDES = (".git", ".hg", ".svn", "node_modules", "build", "build-*", "build_*", "cmake-build-*", "dist",
                    "out", "_deps", ".venv", "venv", "__pycache__", ".idea", ".vs", ".vscode", "target", "bin", "obj")
LIST_SEPARATOR = ", "                          # How a scan list is printed
ORIGIN_DEFAULT, ORIGIN_USER, ORIGIN_ALWAYS = "default", "user", "always"
MAX_SOURCE_BYTES = 2 * 1024 * 1024            # a larger file is taken as generated or as data
BINARY_PROBE_BYTES = 8192                      # a NUL byte in this head marks a binary file

# The page's parts, beside this script in the skill folder.
SKILL_DIR = Path(__file__).resolve().parent.parent
ASSETS_DIR = SKILL_DIR / "assets"
TEMPLATE_PATH = ASSETS_DIR / "matrix.html"
TOKENS_PATH = ASSETS_DIR / "tokens.json"
KEY_LIBRARIES = "libraries"
LIBRARIES_PATH = ASSETS_DIR / "libraries.json"     # The libraries loaded from cdnjs
# AGNOS's one version, in a sibling skill of this one, as one SemVer 2.0.0 line
# (the regular expression of semver.org); the foot of the page shows `v.<major>.<minor>`.
VERSION_PATH = SKILL_DIR.parent / "agnos-init" / "assets" / "templates" / agnos_layout.VERSION
VERSION_PREFIX = "v."
SEMVER_RE = re.compile(r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)"
                       r"(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$")
CALLGRAPH_PATH = Path(__file__).resolve().parent / "callgraph.py"
CALLGRAPH_MODULE = "agnos_perf_center_callgraph"
HISTORY_PATH = Path(__file__).resolve().parent / "history.py"
HISTORY_MODULE = "agnos_perf_center_history"
MARKER_RE = re.compile(r"/\*@(TOKENS|CSS|SCRIPT)@\*/|@(TITLE|DATA_SCRIPT|LIBRARIES|APP_VERSION)@")
DATA_JSON_SUFFIX = ".json"          # The data alone, for any other tool
DATA_SCRIPT_SUFFIX = ".data.js"     # The same data, loaded by the page (a page from disk fetches no file)
DATA_GLOBAL = "window.AGNOS_PERF_CENTER_DATA"
SCRIPT_END_RE = re.compile(r"</(script)", re.IGNORECASE)
TOKEN_NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
THEMES = ("light", "dark")
TIMESTAMP_FORMAT = "%Y-%m-%dT%H:%MZ"

# An ID is not part of a longer word or number; a range is "<A> to <B>", "<A>–<B>", "<A>—<B>", "<A>..<B>"
# or "<A>-<B>".
ID_RE = re.compile(rf"(?<![A-Za-z0-9]){ID_PATTERN}(?![0-9])")
FULL_ID_RE = re.compile(rf"^{ID_PATTERN}$")
RANGE_RE = re.compile(rf"(?<![A-Za-z0-9])({ID_PATTERN})(?:\s+to\s+|\s*(?:–|—|\.\.|-)\s*)({ID_PATTERN})(?![0-9])")


class InputError(Exception):
    """An input the generator cannot work from."""


# ---- IDs ---------------------------------------------------------------------------------------------------------
def extract_ids(text, defined):
    """Every AGNOS ID of the text, a range of one type and trigram counting as the defined IDs between its two ends."""
    found = {m.group(0) for m in ID_RE.finditer(text)}
    for m in RANGE_RE.finditer(text):
        low, high = m.group(1), m.group(2)
        prefix = low[:PREFIX_CUT]
        if prefix != high[:PREFIX_CUT] or low >= high:
            continue
        lo, hi = int(low[PREFIX_CUT + 1:]), int(high[PREFIX_CUT + 1:])
        found.update(i for i in defined if i[:PREFIX_CUT] == prefix and lo < int(i[PREFIX_CUT + 1:]) < hi)
    return found


def id_type(element_id):
    return element_id.split("-", 1)[0]


def evidence(line_number, text):
    """A line kept as the proof of a link: its number and its text, trimmed."""
    return [line_number, text.strip()[:LINE_TEXT_MAX]]


# ---- model -------------------------------------------------------------------------------------------------------
class Model:
    """The traceability graph: elements (process elements, undefined IDs), source files, and the links between them."""

    def __init__(self):
        self.elements = {}   # id -> element dict, in index order
        self.edges = {}      # (source, target, kind) -> list of [line, text]; kind: contains | refs | code
        self.files = {}      # source path -> {"path", "ids"}

    def add_element(self, element):
        self.elements[element["id"]] = element

    def ensure(self, element_id):
        """The element of an ID, made an undefined element when the index does not define it."""
        if element_id not in self.elements:
            self.add_element({"id": element_id, KEY_KIND: KEY_UNDEFINED, KEY_TYPE: id_type(element_id),
                              "tri": element_id.split("-")[1], "doc": "", KEY_FIRST: 0, KEY_LAST: 0, KEY_STATUS: "",
                              KEY_TITLE: "Not defined in the index"})
        return self.elements[element_id]

    def add_edge(self, source, target, kind, proof=None):
        lines = self.edges.setdefault((source, target, kind), [])
        if proof is not None:
            lines.append(proof)


# ---- process -----------------------------------------------------------------------------------------------------
def parse_index(index_path):
    """The rows of the process index: one element per 'ID|first-last|status|title' row, under its '@document' line."""
    rows, doc = [], ""
    for raw in index_path.read_text(encoding=ENCODING).splitlines():
        if raw.startswith("@"):
            doc = raw[1:].strip()
            continue
        parts = raw.split("|", INDEX_TITLE_FIELD)
        if len(parts) != INDEX_FIELDS or not FULL_ID_RE.match(parts[0]):
            continue
        first, _, last = parts[1].partition("-")
        rows.append({"id": parts[0], KEY_KIND: KEY_ELEMENT, KEY_TYPE: id_type(parts[0]), "tri": parts[0].split("-")[1],
                     "doc": doc, KEY_FIRST: int(first), KEY_LAST: int(last or first), KEY_STATUS: parts[2].strip(),
                     KEY_TITLE: parts[INDEX_TITLE_FIELD].strip()})
    return rows


def resolve_document(process_dir, doc):
    """A document path of the index: relative to the process folder's parent, else to the process folder itself."""
    candidates = [process_dir.parent / doc, process_dir / Path(*Path(doc).parts[1:]) if len(Path(doc).parts) > 1
                  else process_dir / doc, process_dir / doc]
    return next((c for c in candidates if c.is_file()), None)


def add_containment(model, members):
    """Links each element of one document to the element whose range most closely encloses its own."""
    for child in members:
        parents = [p for p in members if p is not child
                   and p[KEY_FIRST] <= child[KEY_FIRST] and child[KEY_LAST] <= p[KEY_LAST]
                   and (p[KEY_FIRST], p[KEY_LAST]) != (child[KEY_FIRST], child[KEY_LAST])]
        if parents:
            parent = min(parents, key=lambda p: p[KEY_LAST] - p[KEY_FIRST])
            model.add_edge(parent["id"], child["id"], KEY_CONTAINS)


def add_document_references(model, members, lines, defined):
    """Links each element to the IDs of its own lines: those of its range that no element it contains holds."""
    owner = [None] * (len(lines) + 1)
    for element in sorted(members, key=lambda e: e[KEY_LAST] - e[KEY_FIRST], reverse=True):
        for ln in range(element[KEY_FIRST], min(element[KEY_LAST], len(lines)) + 1):
            owner[ln] = element["id"]
    for ln, text in enumerate(lines, 1):
        if owner[ln] is None:
            continue
        for target in sorted(extract_ids(text, defined) - {owner[ln]}):
            model.ensure(target)
            model.add_edge(owner[ln], target, KEY_REFS, evidence(ln, text))


def build_process_model(process_dir):
    """The elements of the process folder's index, their containment and their references."""
    process_dir = Path(process_dir)
    index_path = process_dir / INDEX_NAME
    if not index_path.is_file():
        raise InputError(f"{index_path} not found: run the agnos-index skill first, or give the folder holding it")
    model = Model()
    rows = parse_index(index_path)
    for row in rows:
        model.add_element(row)
    defined = set(model.elements)
    by_doc = {}
    for row in rows:
        by_doc.setdefault(row["doc"], []).append(row)
    for doc, members in by_doc.items():
        add_containment(model, members)
        path = resolve_document(process_dir, doc)
        if path is None:
            print(f"agnos-perf-center: warning: {doc} not found, its references are not read", file=sys.stderr)
            continue
        lines = path.read_text(encoding=ENCODING, errors=KEY_REPLACE).splitlines()
        add_document_references(model, members, lines, defined)
    return model


# ---- sources -----------------------------------------------------------------------------------------------------
def is_excluded(name, excludes):
    return any(fnmatch.fnmatchcase(name, pattern) for pattern in excludes)


def source_files(root, extensions, excludes):
    """The files of a source folder to scan, in path order, excluded folders pruned."""
    found = []
    for folder, dirs, files in os.walk(root):
        dirs[:] = sorted(d for d in dirs if not is_excluded(d, excludes))
        for name in sorted(files):
            if is_excluded(name, excludes):
                continue
            if name in DEFAULT_NAMES or os.path.splitext(name)[1].lower() in extensions:
                found.append(Path(folder) / name)
    return found


def read_source(path):
    """The lines of a source file, or None for a binary or oversized one."""
    if path.stat().st_size > MAX_SOURCE_BYTES:
        return None
    data = path.read_bytes()
    if b"\x00" in data[:BINARY_PROBE_BYTES]:
        return None
    return data.decode(ENCODING, errors=KEY_REPLACE).splitlines()


def display_path(path, root, base):
    """A file's path as the page shows it: relative to the base folder, else prefixed by its source folder's name."""
    try:
        return path.resolve().relative_to(base.resolve()).as_posix()
    except ValueError:
        return (Path(root.resolve().name) / path.relative_to(root)).as_posix()


def link_file_lines(model, shown, lines, defined):
    """Links a source file to the IDs of its lines, with their numbers and texts; returns how many links it holds."""
    count = 0
    for ln, text in enumerate(lines, 1):
        for target in sorted(extract_ids(text, defined)):
            model.ensure(target)
            model.add_edge(shown, target, KEY_CODE, evidence(ln, text))
            count += 1
    return count


def scan_sources(model, roots, base=None, extensions=DEFAULT_EXTENSIONS, excludes=DEFAULT_EXCLUDES):
    """Links every scanned source file to the IDs its lines hold, with the line numbers and texts; returns the files
    scanned, [(shown path, path)], for the call graph (no second walk)."""
    base = Path(base) if base is not None else Path.cwd()
    defined = {i for i, e in model.elements.items() if e[KEY_KIND] == KEY_ELEMENT}
    extensions = {e.lower() if e.startswith(".") else "." + e.lower() for e in extensions}
    scanned = []
    for root in map(Path, roots):
        for path in source_files(root, extensions, excludes):
            lines = read_source(path)
            if lines is not None:
                shown = display_path(path, root, base)
                model.files[shown] = {"path": shown, "ids": link_file_lines(model, shown, lines, defined)}
                scanned.append((shown, path))
    return scanned


# A function cites the IDs its file cites on its lines, with the same proofs.
def code_citations(model):
    """{source file: [(line, ID, proof)]} in line order, from the files' code links."""
    cited = {}
    for (src, dst, kind), proofs in model.edges.items():
        if kind == KEY_CODE:
            cited.setdefault(src, []).extend((proof[0], dst, proof) for proof in proofs)
    return {path: sorted(lines) for path, lines in cited.items()}


# The module, and through it tree-sitter, are loaded only when asked for.
def load_module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def load_call_graph_module():
    return load_module(CALLGRAPH_MODULE, CALLGRAPH_PATH)


# The history module, and through it git, only with --history.
def load_history_module():
    return load_module(HISTORY_MODULE, HISTORY_PATH)


def history_depth(text):
    """The --history-depth value as a positive integer, or InputError."""
    if text is None:
        return None
    if not text.isdigit() or int(text) == 0:
        raise InputError(f"--history-depth must be a positive integer, not {text!r}")
    return int(text)


def task_tiers(process, model):
    """{task ID: (tier S, M or L, or None; [requirement IDs it cites])} in index order, the tier read from the task's
    lines in the working tree."""
    links = Links(model)
    lines_of = {}
    tasks = {}
    for element in model.elements.values():
        if element[KEY_KIND] != KEY_ELEMENT or element[KEY_TYPE] != TYPE_TASK:
            continue
        path = resolve_document(process, element["doc"])
        if path not in lines_of:
            lines_of[path] = path.read_text(encoding=ENCODING, errors=KEY_REPLACE).splitlines() if path else []
        own = lines_of[path][element[KEY_FIRST] - 1:element[KEY_LAST]]
        tier = next((m.group(1) for m in map(TIER_RE.match, own) if m), None)
        cited = sorted(t for t in links.refs_out.get(element["id"], ()) if model.elements[t][KEY_TYPE] == TYPE_RQ)
        tasks[element["id"]] = (tier, cited)
    return tasks


def build_history(args, process, model, scanned, graph):
    """The data file's history block, or None with a warning when the repository cannot be read."""
    module = load_history_module()
    documents = {}
    for element in model.elements.values():
        if element[KEY_KIND] == KEY_ELEMENT:
            path = resolve_document(process, element["doc"])
            if path is not None:
                documents.setdefault(path, []).append((element["id"], element[KEY_FIRST], element[KEY_LAST]))
    functions = [] if graph is None or graph.core_missing else \
        [(f["file"], f[KEY_FIRST], f[KEY_LAST]) for f in graph.functions]
    try:
        return module, module.build(process, documents, dict(scanned), functions, [process, *map(Path, args.sources)],
                                    args.history_since, depth=history_depth(args.history_depth),
                                    tasks=task_tiers(process, model), friction_log=agnos_layout.METRICS_LOG)
    except (module.HistoryUnavailable, module.GitError) as error:
        print(f"agnos-perf-center: warning: no history: {error}", file=sys.stderr)
        return module, None


# ---- coverage and findings -------------------------------------------------------------------------------------------
RULE_KEYS = ("uncovered", "untasked", "task-no-rq", "adr-no-rq", "empty", "isolated", "undefined", "untraced-files")
CONTAINED_TYPE = {"FTR": "RQ", "ADR": "DEC", "PLAN": "TASK"}       # what a container type is empty without
COVERING_TYPES = frozenset({"DEC", "TASK", "ADR", "PLAN", "FTR"})  # elements through which coverage is indirect


class Links:
    """The model's edges indexed per element: who it contains, references and is referenced by, and what code cites."""

    def __init__(self, model):
        self.children, self.parent, self.refs_out, self.refs_in, self.code_in = {}, {}, {}, {}, {}
        for (src, dst, kind) in model.edges:
            if kind == KEY_CONTAINS:
                self.children.setdefault(src, []).append(dst)
                self.parent[dst] = src
            elif kind == KEY_REFS:
                self.refs_out.setdefault(src, set()).add(dst)
                self.refs_in.setdefault(dst, set()).add(src)
            else:
                self.code_in.setdefault(dst, set()).add(src)

    def descendants(self, element_id):
        found, stack = [], list(self.children.get(element_id, []))
        while stack:
            child = stack.pop()
            found.append(child)
            stack.extend(self.children.get(child, []))
        return found

    def touched(self, element_id):
        """True when a refs or code edge touches the element."""
        return bool(self.refs_out.get(element_id) or self.refs_in.get(element_id) or self.code_in.get(element_id))


def rate(rq, links, model):
    """covered: code cites the requirement; indirect: code cites a decision, task, ADR, plan or feature linked to it or
    holding it (another requirement does not count); else uncovered."""
    if links.code_in.get(rq):
        return KEY_COVERED
    neighbours = links.refs_in.get(rq, set()) | links.refs_out.get(rq, set())
    ancestor = links.parent.get(rq)
    while ancestor:
        neighbours.add(ancestor)
        ancestor = links.parent.get(ancestor)
    if any(model.elements[n][KEY_TYPE] in COVERING_TYPES and links.code_in.get(n) for n in neighbours):
        return KEY_INDIRECT
    return KEY_UNCOVERED


def refs_to_type(links, model, element_id, wanted):
    return any(model.elements[t][KEY_TYPE] == wanted for t in links.refs_out.get(element_id, ()))


def is_untasked(rq, links, model):
    return not any(model.elements[s][KEY_TYPE] == TYPE_TASK for s in links.refs_in.get(rq, ()))


def is_adr_without_rq(adr, links, model):
    return not any(refs_to_type(links, model, x, TYPE_RQ) for x in [adr] + links.descendants(adr))


def is_empty(element, links, model):
    """A feature, ADR or plan that holds none of the elements of its contained type."""
    contained = CONTAINED_TYPE[element[KEY_TYPE]]
    return not any(model.elements[c][KEY_TYPE] == contained for c in links.children.get(element["id"], ()))


def is_isolated(element_id, links):
    return not any(links.touched(x) for x in [element_id] + links.descendants(element_id))


def ids_by_type(defined):
    return {t: [e["id"] for e in defined if e[KEY_TYPE] == t] for t in (TYPE_RQ, TYPE_TASK, "ADR")}


def element_findings(defined, coverage, links, model):
    """The findings of the rules on the elements the index defines, IDs in index order."""
    of_type = ids_by_type(defined)
    return {
        KEY_UNCOVERED: [rq for rq, r in coverage.items() if r == KEY_UNCOVERED],
        "untasked": [rq for rq in of_type[TYPE_RQ] if is_untasked(rq, links, model)],
        "task-no-rq": [t for t in of_type[TYPE_TASK] if not refs_to_type(links, model, t, TYPE_RQ)],
        "adr-no-rq": [a for a in of_type["ADR"] if is_adr_without_rq(a, links, model)],
        "empty": [e["id"] for e in defined if e[KEY_TYPE] in CONTAINED_TYPE and is_empty(e, links, model)],
        "isolated": [e["id"] for e in defined if is_isolated(e["id"], links)],
    }


def analyse(model):
    """The coverage of every requirement and the findings of each rule, IDs in index order, undefined IDs and files by
    name."""
    links = Links(model)
    defined = [e for e in model.elements.values() if e[KEY_KIND] == KEY_ELEMENT]
    coverage = {e["id"]: rate(e["id"], links, model) for e in defined if e[KEY_TYPE] == TYPE_RQ}
    findings = {
        **element_findings(defined, coverage, links, model),
        KEY_UNDEFINED: sorted(i for i, e in model.elements.items() if e[KEY_KIND] == KEY_UNDEFINED),
        "untraced-files": sorted(p for p, f in model.files.items() if not f["ids"]),
    }
    return {KEY_COVERAGE: coverage, "findings": findings}


def summary(model, analysis, quality):
    """The one line the generator ends with: element and file counts, coverage, the quality score."""
    defined = sum(e[KEY_KIND] == KEY_ELEMENT for e in model.elements.values())
    rated = list(analysis[KEY_COVERAGE].values())
    return (f"agnos-perf-center: {defined} elements, {len(model.files)} files; RQ {len(rated)}: covered "
            f"{rated.count(KEY_COVERED)}, indirect {rated.count(KEY_INDIRECT)}, "
            f"uncovered {rated.count(KEY_UNCOVERED)}; {scorecard.summary_part(quality)}")


# ---- design tokens -----------------------------------------------------------------------------------------------
def load_tokens(path):
    try:
        return json.loads(Path(path).read_text(encoding=ENCODING))
    except (OSError, ValueError) as error:
        raise InputError(f"design tokens {path}: {error}") from error


def global_value(tokens, ref, owner):
    if ref not in tokens[KEY_GLOBAL]:
        raise InputError(f"design token '{owner}' refers to '{ref}', which is not a global token")
    return tokens[KEY_GLOBAL][ref]


def tokens_css(tokens):
    """The custom properties of the page: --s-<semantic> per theme, --c-<component> as var(--s-<semantic>); an
    unresolved reference is an input error."""
    light, dark = [], []
    for name, ref in tokens[KEY_SEMANTIC].items():
        if not TOKEN_NAME_RE.match(name):
            raise InputError(f"design token name '{name}' is not kebab-case")
        if isinstance(ref, dict):
            if set(ref) != set(THEMES):
                raise InputError(f"design token '{name}' needs exactly a light and a dark value")
            light.append(f"  --s-{name}: {global_value(tokens, ref['light'], name)};")
            dark.append(f"  --s-{name}: {global_value(tokens, ref['dark'], name)};")
        else:
            light.append(f"  --s-{name}: {global_value(tokens, ref, name)};")
    for name, ref in tokens["component"].items():
        if not TOKEN_NAME_RE.match(name) or ref not in tokens[KEY_SEMANTIC]:
            raise InputError(f"component token '{name}' refers to '{ref}', which is not a semantic token")
        light.append(f"  --c-{name}: var(--s-{ref});")
    dark_block = ["  color-scheme: dark;", *dark]
    return "\n".join([":root {", "  color-scheme: light;", *light, "}", "@media (prefers-color-scheme: dark) {",
                      ':root:not([data-theme="light"]) {', *dark_block, "}", "}", ':root[data-theme="dark"] {',
                      *dark_block, "}"])


# ---- page --------------------------------------------------------------------------------------------------------
def load_libraries():
    """The libraries of the page, as `assets/libraries.json` records them."""
    try:
        return json.loads(Path(LIBRARIES_PATH).read_text(encoding=ENCODING))[KEY_LIBRARIES]
    except (OSError, ValueError, KeyError) as error:
        raise InputError(f"library record {LIBRARIES_PATH}: {error}") from error


def library_scripts(libraries):
    """One script element per library, from cdnjs, checked by its integrity hash."""
    return "\n".join(f'<script src="{html.escape(lib["url"])}" integrity="{html.escape(lib["integrity"])}" '
                     f'crossorigin="anonymous" referrerpolicy="no-referrer"></script>' for lib in libraries)


def library_meta(libraries):
    """What the page says of its libraries: name, version, licence, the global it defines and what needs it."""
    return [{k: lib[k] for k in ("name", "version", "licence", "global", "use")} for lib in libraries]


def version_label():
    """The version the foot of the page and the About name show, `v.<major>.<minor>`, from the version file; the empty string when the file
    is absent or is not one SemVer 2.0.0 line, so that both then show "AGNOS" alone and the run is not failed."""
    try:
        lines = Path(VERSION_PATH).read_text(encoding=ENCODING).splitlines()
    except (OSError, ValueError):
        return ""
    match = SEMVER_RE.match(lines[0]) if len(lines) == 1 else None
    return f"{VERSION_PREFIX}{match.group(1)}.{match.group(2)}" if match else ""


def page_elements(model):
    """The elements as the page reads them: those defined in index order, then the undefined ones by name."""
    defined = [e for e in model.elements.values() if e[KEY_KIND] == KEY_ELEMENT]
    undefined = sorted((e for e in model.elements.values() if e[KEY_KIND] == KEY_UNDEFINED), key=lambda e: e["id"])
    fields = ("id", KEY_KIND, KEY_TYPE, "tri", "doc", KEY_FIRST, KEY_LAST, KEY_STATUS, KEY_TITLE)
    return [{f: e[f] for f in fields} for e in defined + undefined]


# Everything the page shows, computed here; sorted so that two runs write the same bytes.
def page_data(model, analysis, quality, meta, call_graph=None, history=None):
    paths = sorted(model.files)
    data = {
        "meta": meta,
        "elements": page_elements(model),
        "files": [model.files[p] for p in paths],
        "edges": [[s, d, k, lines] for (s, d, k), lines in sorted(model.edges.items())],
        KEY_COVERAGE: analysis[KEY_COVERAGE],
        "quality": quality,
    }
    if call_graph is not None and not call_graph.core_missing:      # No key at all without a call graph
        data["callGraph"] = call_graph.page_data({p: n for n, p in enumerate(paths)})
    if history is not None:                                         # No key at all without a history
        data["history"] = {k: v for k, v in history.items() if k != KEY_DELIVERY}
        if KEY_DELIVERY in history:                                 # Beside the history
            data[KEY_DELIVERY] = history[KEY_DELIVERY]
    return data


def embed_json(data):
    """JSON safe inside a <script> element: no '<' at all, so no file content can close the block."""
    return json.dumps(data, sort_keys=True, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")


def embed_script(code):
    return SCRIPT_END_RE.sub(r"<\\/\1", code)


def render_page(title, data_script):
    """The page: the template with its markers replaced in one pass, so inserted text is never scanned again;
    data_script is the file name of the data script written beside it."""
    parts = {
        "TOKENS": tokens_css(load_tokens(TOKENS_PATH)),
        "CSS": (ASSETS_DIR / "matrix.css").read_text(encoding=ENCODING),
        "LIBRARIES": library_scripts(load_libraries()),
        "SCRIPT": embed_script((ASSETS_DIR / "matrix.js").read_text(encoding=ENCODING)),
        "TITLE": html.escape(title),
        "DATA_SCRIPT": html.escape(data_script),
        "APP_VERSION": html.escape(version_label()),                # The version of the foot and of the About name, never in the data
    }
    template = TEMPLATE_PATH.read_text(encoding=ENCODING)
    return MARKER_RE.sub(lambda m: parts[m.group(1) or m.group(2)], template)


def data_paths(page_path):
    """(<page>.json, <page>.data.js) beside the page ( as amended)."""
    stem = page_path.stem
    return page_path.with_name(stem + DATA_JSON_SUFFIX), page_path.with_name(stem + DATA_SCRIPT_SUFFIX)


def write_outputs(path, data, title):
    """The page and its two data files, the same JSON in both."""
    json_path, script_path = data_paths(path)
    text = embed_json(data)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(render_page(title, script_path.name), encoding=ENCODING, newline="\n")
    json_path.write_text(text + "\n", encoding=ENCODING, newline="\n")
    script_path.write_text(f"{DATA_GLOBAL} = {text};\n", encoding=ENCODING, newline="\n")


# ---- command line ------------------------------------------------------------------------------------------------
def parse_args(argv):
    parser = argparse.ArgumentParser(prog="perf_center.py", description="AGNOS performance center")
    parser.add_argument("--process", required=True, help=f"AGNOS process folder holding {INDEX_NAME}")
    parser.add_argument("--sources", required=True, action=KEY_APPEND, help="source folder to scan (repeatable)")
    parser.add_argument("--out", help=f"output page (default: <process>/{DEFAULT_OUT_NAME})")
    # The default lists are shown, so the user knows what a replacement drops.
    parser.add_argument("--ext", action=KEY_APPEND,
                        help="source extension to scan, replaces the default list (repeatable); default: "
                             f"{LIST_SEPARATOR.join(sorted(DEFAULT_EXTENSIONS))}; always scanned, whatever --ext: "
                             f"{LIST_SEPARATOR.join(sorted(DEFAULT_NAMES))}")
    parser.add_argument("--exclude", action=KEY_APPEND,
                        help="file or folder name pattern to skip, replaces the default list (repeatable); default: "
                             f"{LIST_SEPARATOR.join(DEFAULT_EXCLUDES)}")
    parser.add_argument("--title", help="page title (default: the name of the process folder's parent)")
    parser.add_argument("--generated-at", help="generation time shown by the page (default: now, UTC); fixing it "
                                               "makes the output reproducible")
    parser.add_argument("--call-graph", action=STORE_TRUE,
                        help="add the functions and calls of the sources, parsed with tree-sitter")
    parser.add_argument("--history", action=STORE_TRUE,
                        help="add who worked on each element and on the code, read from git")
    parser.add_argument("--history-since", help="with --history: only the commits authored since this date or duration "
                                                "(a form git reads: 6.months, 2.weeks, 2026-01-01)")
    parser.add_argument("--history-depth", help="with --history: only the N most recent commits")
    return parser.parse_args(argv)


def check_sources(sources):
    missing = [s for s in sources if not Path(s).is_dir()]
    if missing:
        raise InputError("source folder not found: " + ", ".join(missing))


def check_history_options(args):
    if not args.history and (args.history_since is not None or args.history_depth is not None):
        raise InputError("--history-since and --history-depth need --history")
    history_depth(args.history_depth)


def print_scan_lists(extensions, user_extensions, excludes, user_excludes):
    """Prints the lists in effect, each saying whether it is the default or the user's, before the summary line."""
    origin = lambda given: ORIGIN_USER if given else ORIGIN_DEFAULT  # noqa: E731
    print(f"agnos-perf-center: scanned extensions ({origin(user_extensions)}): {LIST_SEPARATOR.join(sorted(extensions))}")
    print(f"agnos-perf-center: scanned names ({ORIGIN_ALWAYS}): {LIST_SEPARATOR.join(sorted(DEFAULT_NAMES))}")
    print(f"agnos-perf-center: excluded ({origin(user_excludes)}): {LIST_SEPARATOR.join(excludes)}")


def main(argv=None):
    started = time.perf_counter()
    args = parse_args(argv)
    process = Path(args.process)
    out = Path(args.out) if args.out else process / DEFAULT_OUT_NAME
    title = args.title or process.resolve().parent.name
    generated_at = args.generated_at or datetime.datetime.now(datetime.timezone.utc).strftime(TIMESTAMP_FORMAT)
    try:
        check_sources(args.sources)
        check_history_options(args)
        model = build_process_model(process)
        extensions, excludes = args.ext or DEFAULT_EXTENSIONS, args.exclude or DEFAULT_EXCLUDES
        scanned = scan_sources(model, args.sources, extensions=extensions, excludes=excludes)
        analysis = analyse(model)
        graph = None
        if args.call_graph:
            graph = load_call_graph_module().analyse(scanned, code_citations(model), evidence)
        scored = graph if graph is not None and not graph.core_missing else None
        quality = scorecard.build(model, analysis, scorecard.load_scoring(), scored)
        line = summary(model, analysis, quality)
        if graph is not None:
            line += "; " + graph.summary()
        history = None
        if args.history:
            module, history = build_history(args, process, model, scanned, graph)
            if history is not None:
                line += "; " + module.summary(history)
        meta = {KEY_TITLE: title, "generatedAt": generated_at, "process": process.as_posix(),
                "sources": [Path(s).as_posix() for s in args.sources], "summary": line,
                KEY_LIBRARIES: library_meta(load_libraries())}
        data = page_data(model, analysis, quality, meta, graph, history)
    except (InputError, scorecard.ScoringError) as error:
        print(f"agnos-perf-center: {error}", file=sys.stderr)
        return 1
    write_outputs(out, data, title)
    print_scan_lists(extensions, args.ext, excludes, args.exclude)
    # The duration is printed only, never put in the generated files.
    print(f"{line}; {out.as_posix()} written in {time.perf_counter() - started:{DURATION_FORMAT}} s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
