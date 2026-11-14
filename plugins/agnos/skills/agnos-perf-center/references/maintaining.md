# agnos-perf-center: maintaining the skill


## Generator details

- `--ext` and `--exclude` replace their default lists, which `--help` prints and every run reports.
- Exit code 1: no `process.idx.md`, a missing source folder, a broken design token, a history option without `--history`, or a
  depth that is not a positive integer.
- Without the call-graph packages, the summary says `call graph skipped: tree-sitter not installed, run: pip install -r …`. They
  are prebuilt wheels, no compiler needed.
- `--history-since` and `--history-depth` apply together. `no history: <cause>` means git is missing, the process folder is in
  no git working tree, or the repository has no commit.

## Tests

Running them needs Python 3.10 or later. `python -m unittest discover -s <this skill's folder>/tests -v`: a synthetic process in
`tests/fixtures/repo` plants one element of every finding. The page tests run in a headless Chromium-family browser (Edge,
Chrome, Chromium; `AGNOS_PERF_CENTER_BROWSER=<path>` to choose) and are skipped when none is found. The call-graph tests
(`tests/fixtures/repo/calls`) are skipped without the tree-sitter packages; `AGNOS_PERF_CENTER_PERF=1` adds the measure on a
generated tree of 20,000 functions and 100,000 calls (about a minute), and the measures of the history (`test_history_perf.py`,
2,000 commits) and of the delivery (`test_delivery_perf.py`, 1,000 tasks delivered).

## Libraries

The page loads Cytoscape.js (the Graph view) and Apache ECharts (the library charts) from `cdnjs.cloudflare.com`, at the
versions recorded in `assets/libraries.json` with their integrity hash; nothing is copied into
the skill or the page. The page needs the network once; the browser's cache usually serves the libraries afterwards.
Without them, the views that need them say so and the others work. To change a version: change its
version, URL and `integrity` together in `libraries.json` (the hash the cdnjs API publishes,
`https://api.cdnjs.com/libraries/<name>/<version>?fields=sri`), then run the tests, which need the network: without
cdnjs, the page tests are skipped.

## Brand, version and licences

The brand mark is one symbol of the template (`brand-mark`), coloured by the `brand-*` tokens; the About
topic shows it large with the name "AGNOS v.<major>.<minor>" and the tagline beside it, set by the tokens `text-wordmark`, `tracking-wordmark`,
`tracking-tagline`, `line-display` and `line-snug`. The foot of
the left panel shows "AGNOS v.<major>.<minor>", the version read at each generation from `agnos-init/assets/templates/VERSION.txt`, a file of the
sibling skill; absent or not one SemVer line, it shows the title alone. The Help dialog's Licenses
topic draws the application's licence and each library of `libraries.json` as badges: the tone of
a licence is its entry in `LICENCE_TONE` of `matrix.js` (any other licence takes the light tone), and a test fails when a
library's licence has none, so classify a new licence when adding a library. A badge of a tabled licence links to
`https://spdx.org/licenses/<id>.html`: check once that the new licence's address answers HTTP 200.

## Design system

Every colour, size and duration of the page is a token of `assets/tokens.json` (global → semantic → component); the CSS
and the script use only the `--s-*` and `--c-*` custom properties the generator writes from it. Change a value there,
never in `matrix.css` or `matrix.js` (a test fails on any raw colour, `px` or `ms` in them).
