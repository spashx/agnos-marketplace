"""agnos-perf-center call graph: the functions and calls of the scanned source files, parsed with tree-sitter.

perf_center.py loads this file only for --call-graph: it imports the standard library only, py-tree-sitter and the grammar wheels when it runs.
Languages are data, assets/callgraph/languages.json and one query file each.
"""
import importlib
import json
import re
from pathlib import Path

# A literal written more than once is a named constant.
KEY_SCOPE = "scope"
ENCODING = "utf-8"
KEY_REPLACE = "replace"
KEY_SCOPES = "scopes"
KEY_SCOPE_INDEX = "scope_index"
KEY_FUNCTIONS = "functions"
KEY_CALLS = "calls"
KEY_NODE = "node"
KEY_FILE = "file"
KEY_FIRST = "first"
KEY_LAST = "last"
KEY_QUALIFIED = "qualified"
KEY_NAME = "name"
KEY_TEXT = "text"

SKILL_DIR = Path(__file__).resolve().parent.parent
ASSETS_DIR = SKILL_DIR / "assets" / "callgraph"
LANGUAGES_PATH = ASSETS_DIR / "languages.json"
REQUIREMENTS_PATH = SKILL_DIR / "requirements-callgraph.txt"
CORE_PACKAGE = "tree-sitter"
CORE_MODULE = "tree_sitter"
LANGUAGE_FUNCTION = "language"     # what a grammar wheel exposes, unless its table entry names another "function"
TABLE_NOTE_PREFIX = "_"            # a key of the language table that is a note, not a language

# The fixed capture names of a query file.
DEFINITION, DEFINITION_NAME = "definition", "definition.name"
SCOPE, SCOPE_NAME = KEY_SCOPE, "scope.name"
CALL, CALL_NAME = "call", "call.name"
COMMENT = "comment"
KEY_PREFIX = "fn"                                  # a function's key: fn:<file>:<first line>
MAX_AMBIGUOUS = 5                                  # candidates linked at most for one ambiguous call
NAMESPACE_KIND, CLASS_KIND = "namespace", "class"  # the box kinds of a scope
NO_SCOPE = -1                                      # the scope index of a function without box
FOLDER_SEPARATOR = "/"                             # in the shown paths of the files
TEMPLATE_ARGS_RE = re.compile(r"<[^<>]*>")         # innermost template or generic arguments, removed until none is left
MEMBER_RE = re.compile(r"::|\.|->")                # what separates a called name from its receiver or qualifier
# a name a call can be resolved by; "(*fp)" is not one; "$" and a leading "#" for JavaScript
NAME_RE = re.compile(r"^[~#]?[A-Za-z_$][\w$]*$|^operator\W")
SPACE_RE = re.compile(r"\s+")


# ---- py-tree-sitter ----------------------------------------------------------------------------------------------
class TreeSitter:
    """The version-specific part of py-tree-sitter's API, in one place (written for 0.25). Raises
    ImportError when the package is not installed."""

    def __init__(self):
        self.api = importlib.import_module(CORE_MODULE)

    def language(self, grammar_module, function):
        return self.api.Language(getattr(grammar_module, function)())

    def query(self, language, text):
        return self.api.Query(language, text)

    def parse(self, language, data):
        return self.api.Parser(language).parse(data).root_node

    def matches(self, query, node):
        """The query's matches under the node: [(pattern index, {capture name: [nodes]})]."""
        return self.api.QueryCursor(query).matches(node)


# ---- languages ---------------------------------------------------------------------------------------------------
class Grammar:
    """One language of the table, loaded: its name, tree-sitter language, compiled query, scope separator and the box
    kind of each scope node type."""

    def __init__(self, name, entry, language, query):
        self.name = name
        self.language = language
        self.query = query
        self.separator = entry["separator"]
        self.scopes = entry.get(KEY_SCOPES, {})


def load_table(path=LANGUAGES_PATH):
    """The language table: {language: {extensions, package, module, query, separator[, scopes][, function]}}."""
    table = json.loads(Path(path).read_text(encoding=ENCODING))
    return {name: entry for name, entry in table.items() if not name.startswith(TABLE_NOTE_PREFIX)}


def load_grammars(table, api):
    """({extension: Grammar}, [package of each language whose grammar wheel is not installed])."""
    grammars, missing = {}, []
    for name, entry in table.items():
        try:
            module = importlib.import_module(entry["module"])
        except ImportError:
            missing.append(entry["package"])
            continue
        language = api.language(module, entry.get("function", LANGUAGE_FUNCTION))
        query = api.query(language, (ASSETS_DIR / entry["query"]).read_text(encoding=ENCODING))
        grammar = Grammar(name, entry, language, query)
        for extension in entry["extensions"]:
            grammars[extension] = grammar
    return grammars, missing


def install_command():
    """The command that installs the supported packages, the requirements file shown from the current folder."""
    try:
        shown = REQUIREMENTS_PATH.relative_to(Path.cwd().resolve())
    except ValueError:
        shown = REQUIREMENTS_PATH
    return f"pip install -r {shown.as_posix()}"


# ---- functions ---------------------------------------------------------------------------------------------------
def plain_name(text):
    """A declared or called name without its template arguments and spaces: 'h<int>' -> 'h'; the '::' a removed
    argument leaves at the end goes too, Rust's 'f::<u8>' -> 'f'."""
    text = SPACE_RE.sub("", text)
    while True:
        stripped = TEMPLATE_ARGS_RE.sub("", text)
        if stripped == text:
            return text.strip(":")
        text = stripped


def last_part(name):
    """The name a call is looked up by: the last part of 'a.b->c::d'."""
    return MEMBER_RE.split(name)[-1]


def captures_of(grammar, api, root):
    """The query's captures under the root, by kind: definitions and scopes as (node, name node), calls as (node,
    called expression node), comments as nodes; each node once."""
    found = {DEFINITION: {}, SCOPE: {}, CALL: {}, COMMENT: {}}
    for _, caps in api.matches(grammar.query, root):
        for kind, name in ((DEFINITION, DEFINITION_NAME), (SCOPE, SCOPE_NAME), (CALL, CALL_NAME), (COMMENT, None)):
            if kind in caps:
                node = caps[kind][0]
                found[kind][(node.start_byte, node.end_byte)] = (node, caps[name][0] if name else None)
                break
    return {kind: sorted(nodes.values(), key=lambda pair: pair[0].start_byte) for kind, nodes in found.items()}


def comment_tops(comments, lines):
    """{last row of a comment that starts its line: first row of the comment block ending there} (rows from 0). A
    comment that holds its line's end, as Rust's line comments do, ends at column 0 of the next row: its last row is the
    one before."""
    tops = {}
    for node, _ in comments:
        row, column = node.start_point
        if lines[row][:column].strip():
            continue                       # a comment after code on its line ends no block above a definition
        end_row, end_column = node.end_point
        last = end_row - 1 if end_column == 0 and end_row > row else end_row
        tops[last] = tops.get(row - 1, row)
    return tops


def block_top(tops, first_row):
    """The first row of the comment block ending on the row just above first_row, else first_row."""
    return tops.get(first_row - 1, first_row)


def text_of(node):
    return node.text.decode(ENCODING, KEY_REPLACE)


def scope_names(node, scopes):
    """The names of the scopes enclosing the node, outermost first."""
    return [plain_name(text_of(name)) for scope, name in scopes
            if scope.start_byte <= node.start_byte and node.end_byte <= scope.end_byte]


def file_functions(shown, grammar, api, data, cited, evidence):
    """The functions defined in one file, in line order, each with the IDs of its lines and of the comment block just
    above it; and the file's calls as (call node, called expression node)."""
    root = api.parse(grammar.language, data)
    lines = data.decode(ENCODING, KEY_REPLACE).split("\n")
    caps = captures_of(grammar, api, root)
    tops = comment_tops(caps[COMMENT], lines)
    functions = []
    separator = grammar.separator
    for node, name_node in caps[DEFINITION]:
        qualified = separator.join(scope_names(node, caps[SCOPE]) + [plain_name(text_of(name_node))])
        first, last = node.start_point[0] + 1, node.end_point[0] + 1
        top = block_top(tops, first - 1) + 1
        ids = {}
        for line, target, proof in cited.get(shown, ()):
            if top <= line <= last:
                ids.setdefault(target, []).append(proof)
        functions.append({KEY_FILE: shown, KEY_FIRST: first, KEY_LAST: last, KEY_QUALIFIED: qualified,
                          KEY_NAME: qualified.split(separator)[-1],
                          KEY_SCOPE: separator.join(qualified.split(separator)[:-1]),
                          LANGUAGE_FUNCTION: grammar.name, KEY_TEXT: evidence(first, lines[first - 1])[1], "ids": ids,
                          KEY_NODE: node})
    return functions, caps[CALL], declared_scopes(grammar, caps[SCOPE])


def declared_scopes(grammar, scopes):
    """{qualified name: kind} of the scopes of one file whose node type has a box kind in the language table."""
    return {grammar.separator.join(scope_names(node, scopes)): grammar.scopes[node.type]
            for node, _ in scopes if node.type in grammar.scopes}


def call_sites(functions, calls):
    """(caller, called name, line) of each call whose name can be resolved, the caller being the innermost function
    holding the call; nodes in start order, one sweep with a stack of the open functions."""
    sites, stack, pending = [], [], list(reversed(functions))
    for call, expression in calls:
        while pending and pending[-1][KEY_NODE].start_byte <= call.start_byte:
            function = pending.pop()
            while stack and stack[-1][KEY_NODE].end_byte <= function[KEY_NODE].start_byte:
                stack.pop()
            stack.append(function)
        while stack and stack[-1][KEY_NODE].end_byte <= call.start_byte:
            stack.pop()
        name = last_part(plain_name(text_of(expression)))
        if stack and NAME_RE.match(name):
            sites.append((stack[-1], name, call.start_point[0] + 1))
    return sites


# ---- resolution --------------------------------------------------------------------------------------------------
def folder_of(path):
    return path.rpartition(FOLDER_SEPARATOR)[0]


def preferred(caller, candidates, separator):
    """The candidates of the first non-empty level: the caller's class, its namespace, its file, its folder, the
    project."""
    scope = caller[KEY_SCOPE]
    namespace = scope.rpartition(separator)[0]
    levels = (
        lambda f: scope and f[KEY_SCOPE] == scope,
        lambda f: namespace and f[KEY_SCOPE] == namespace,
        lambda f: f[KEY_FILE] == caller[KEY_FILE],
        lambda f: folder_of(f[KEY_FILE]) == folder_of(caller[KEY_FILE]),
    )
    for level in levels:
        chosen = [f for f in candidates if level(f)]
        if chosen:
            return chosen
    return candidates


def resolve(graph, sites, separators):
    """Links each (caller, called name) to its definitions, in the caller's language: one plain link, two to five
    ambiguous ones, else none and counted as ambiguous; no definition counts as external."""
    index = {id(f): n for n, f in enumerate(graph.functions)}
    definitions = {}
    for function in graph.functions:
        definitions.setdefault((function[LANGUAGE_FUNCTION], function[KEY_NAME]), []).append(function)
    grouped = {}
    for caller, name, line in sites:
        grouped.setdefault((index[id(caller)], name), []).append(line)
    links = {}
    for (caller_index, name), lines in grouped.items():
        caller = graph.functions[caller_index]
        candidates = definitions.get((caller[LANGUAGE_FUNCTION], name), [])
        chosen = preferred(caller, candidates, separators[caller[LANGUAGE_FUNCTION]]) if candidates else []
        if not chosen:
            graph.external += 1
        elif len(chosen) > MAX_AMBIGUOUS:
            graph.ambiguous += 1
        else:
            ambiguous = len(chosen) > 1
            graph.ambiguous += int(ambiguous)
            for callee in chosen:
                link = links.setdefault((caller_index, index[id(callee)]), [ambiguous, set()])
                link[1].update(lines)
    graph.calls = [[caller, callee, ambiguous, sorted(lines)] for (caller, callee), (ambiguous, lines)
                   in sorted(links.items())]


def assign_keys(functions):
    """fn:<file>:<first line>, made unique by '.<n>' when two definitions start on one line."""
    taken = set()
    for function in functions:
        key = f"{KEY_PREFIX}:{function[KEY_FILE]}:{function[KEY_FIRST]}"
        candidate, n = key, 1
        while candidate in taken:
            n += 1
            candidate = f"{key}.{n}"
        taken.add(candidate)
        function["key"] = candidate
        function["dup"] = n if n > 1 else 0


def assign_scopes(graph, declared, grammars):
    """graph.scopes, [qualified name, kind, parent index] of each scope holding a function, in name order, and each
    function's scope_index (NO_SCOPE: none, or a language without scopes). A part of a function's scope that no
    scanned file declares is a class when it is the innermost part, else a namespace; a class guess wins over a
    namespace one."""
    kinds = {}
    for function in graph.functions:
        grammar = grammars[function[LANGUAGE_FUNCTION]]
        if not (grammar.scopes and function[KEY_SCOPE]):
            continue
        parts = function[KEY_SCOPE].split(grammar.separator)
        for n in range(len(parts)):
            name = grammar.separator.join(parts[:n + 1])
            was_class = kinds.get(name, (None,))[0] == CLASS_KIND
            guessed = CLASS_KIND if was_class or n == len(parts) - 1 else NAMESPACE_KIND
            kinds[name] = (declared.get(name, guessed), grammar.separator)
    index = {name: n for n, name in enumerate(sorted(kinds))}
    graph.scopes = [[name, kind, index.get(name.rpartition(separator)[0], NO_SCOPE)]
                    for name, (kind, separator) in sorted(kinds.items())]
    for function in graph.functions:
        scoped = grammars[function[LANGUAGE_FUNCTION]].scopes
        function[KEY_SCOPE_INDEX] = index.get(function[KEY_SCOPE], NO_SCOPE) if scoped else NO_SCOPE


# ---- the call graph ----------------------------------------------------------------------------------------------
class CallGraph:
    """The functions and calls found, the ambiguous and external call counts, and the packages that were missing."""

    def __init__(self):
        self.functions = []
        self.calls = []
        self.scopes = []
        self.ambiguous = 0
        self.external = 0
        self.core_missing = False
        self.missing = []

    def summary(self):
        """The part of the generator's last line about the call graph."""
        if self.core_missing:
            return f"call graph skipped: {CORE_PACKAGE} not installed, run: {install_command()}"
        line = (f"call graph: {len(self.functions)} functions, {len(self.calls)} calls, ambiguous {self.ambiguous}, "
                f"external {self.external}")
        if self.missing:
            line += f"; skipped: {', '.join(self.missing)} not installed, run: {install_command()}"
        return line

    def page_data(self, file_index):
        """The call graph as the page reads it, names stored once:
        functions [file index, first, last, qualified name, language index, first-line text, key suffix (0: none),
        scope index (-1: none)]; scopes [qualified name, kind, parent index (-1: none)];
        calls, one flat list of integers per caller in function order: caller - previous caller, callee count, then per
        callee: callee - caller, ambiguous + 2 * line count, each call-site line - the caller's first line;
        ids [function index, ID, [lines]] (the proofs' texts are the file's). The functions citing no ID are the
        findings of the quality block's "functions traced" check, stored there once."""
        languages = sorted({f[LANGUAGE_FUNCTION] for f in self.functions})
        functions = [[file_index[f[KEY_FILE]], f[KEY_FIRST], f[KEY_LAST], f[KEY_QUALIFIED],
                      languages.index(f[LANGUAGE_FUNCTION]), f[KEY_TEXT], f["dup"], f[KEY_SCOPE_INDEX]]
                     for f in self.functions]
        by_caller = {}
        for caller, callee, ambiguous, lines in self.calls:
            by_caller.setdefault(caller, []).append((callee, ambiguous, lines))
        calls, previous = [], 0
        for caller, callees in by_caller.items():
            first = self.functions[caller][KEY_FIRST]
            calls += [caller - previous, len(callees)]
            for callee, ambiguous, lines in callees:
                calls += [callee - caller, int(ambiguous) + 2 * len(lines), *(line - first for line in lines)]
            previous = caller
        ids = [[n, target, [proof[0] for proof in proofs]] for n, f in enumerate(self.functions)
               for target, proofs in sorted(f["ids"].items())]
        return {KEY_FUNCTIONS: functions, "languages": languages, KEY_SCOPES: self.scopes, KEY_CALLS: calls, "ids": ids,
                "counts": {KEY_FUNCTIONS: len(self.functions), KEY_CALLS: len(self.calls), "ambiguous": self.ambiguous,
                           "external": self.external}}


def analyse(files, cited, evidence, table=None):
    """The call graph of the scanned files [(shown path, path)], for the languages whose packages are installed;
    cited: {shown path: [(line, ID, proof)]}, the file's ID citations; evidence(line, text): a proof line. Functions
    come in file path, then line order."""
    graph = CallGraph()
    try:
        api = TreeSitter()
    except ImportError:
        graph.core_missing = True
        return graph
    grammars, graph.missing = load_grammars(load_table() if table is None else table, api)
    sites, declared = [], {}
    for shown, path in sorted(files):
        grammar = grammars.get(path.suffix.lower())
        if grammar is not None:
            functions, calls, scopes = file_functions(shown, grammar, api, path.read_bytes(), cited, evidence)
            graph.functions += functions
            sites += call_sites(functions, calls)
            for name, kind in scopes.items():
                declared.setdefault(name, kind)
    assign_keys(graph.functions)
    assign_scopes(graph, declared, {g.name: g for g in grammars.values()})
    resolve(graph, sites, {g.name: g.separator for g in grammars.values()})
    for function in graph.functions:
        del function[KEY_NODE]
    return graph
