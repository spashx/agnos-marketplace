---
name: agnos-perf-center
description: "AGNOS performance center: monitors how the process runs on a project (not code speed). From process and source folders, writes an HTML page and its data: artifacts, coverage, quality score, findings. USE FOR: checking MANDATORY TRACEABILITY at session end or before a release; what cites a requirement; with --call-graph, its functions; with --history, who changed what and what was delivered."
argument-hint: "--process <dir> --sources <dir> [--sources <dir>...] [--out <file>] [--ext <.x>...] [--exclude <pattern>...] [--title <t>] [--generated-at <t>] [--call-graph] [--history [--history-since <date|duration>] [--history-depth <n>]]"
---

# AGNOS Performance Center


Needs Python 3.9 or later, standard library only. It knows only the AGNOS ID grammar and index format, so it works on any AGNOS
project. Run it; do not read the scripts. `<skill-folder>` is the folder holding this file.

1. Invoke the `agnos-index` skill first: the matrix reads `process.idx.md`, never the documents' headings.
2. From the project's root (`python` on `windows`, `python3` on `linux` / `macos`):
   `python <skill-folder>/scripts/perf_center.py --process process --sources <source folder>`

| Parameter | Meaning |
|---|---|
| `--process <dir>` | The folder holding `process.idx.md` |
| `--sources <dir>` | Repeatable: every folder whose files should carry IDs (code, tests, build, CI). Not a documentation folder quoting IDs as examples: they would be counted. |
| `--out <file>` | Default `<process>/PERF-CENTER.html` |
| `--ext .x`, `--exclude <pattern>` | Repeatable; each **replaces** its default list (`--help` shows them), at the user's responsibility |
| `--title <t>`, `--generated-at <t>` | The page's title; a fixed timestamp makes the page byte-identical |
| `--call-graph` | Adds functions and calls. Needs once `pip install -r <skill-folder>/requirements-callgraph.txt`; without it the page is written without them |
| `--history` | Adds who changed what and the deliveries, from git |
| `--history-since <date or duration>`, `--history-depth <n>` | Limit the history read (`6.months`, `2026-01-01`); only with `--history` |

**Outputs:** the page, `<page>.json` and `<page>.data.js` beside it: generated, never edit them; the project decides whether to commit or ignore
them; share the three together. The page loads its libraries from cdnjs, so it needs the network once. A link can open it
on an element, `<page>#RQ-XXX-001`, or on a view, `<page>#view=<tab>` (`matrix`, `graph`, `quality`…, any tab the page shows).

**Exit codes:**
- `0`: written. The last line reads `agnos-perf-center: <n> elements, <n> files; RQ <n>: covered <n>, indirect <n>, uncovered <n>;
  quality: <grade> <score>/10; checks: <key> <score>, …; findings <n>; <page> written in <s.mmm> s`, with the call graph and the history before
  the page when asked. A `no history: <cause>` warning on the error stream still means the page is written.
- `1`: input error on the error stream, nothing written. Apply the Error Recovery Protocol.

**Report** to the user the line as it is, the `scanned extensions`, `scanned names` and `excluded` lines before it, saying whether each is the default or the user's, the checks scoring under 10, and the path of the page, which tells the rest to its reader.

**When asked to explain or maintain, read only the file concerned:**

| Question | File |
|---|---|
| What a finding, a check, a score, the call graph, the history or a delivery figure means | `references/rules.md` |
| What `<page>.json` holds | `references/data-format.md` |
| How to run the tests, change a library or a visual value | `references/maintaining.md` |
