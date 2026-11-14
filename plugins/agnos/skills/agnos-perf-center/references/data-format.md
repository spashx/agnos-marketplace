# agnos-perf-center: the data format


The contract of `<page>.json`, for any other tool. `<page>.data.js` holds the same data for the page. Both are generated.
`history` and `delivery` exist only with `--history`, `callGraph` only with `--call-graph`.

## `meta`
`title`, `generatedAt`, `process`, `sources`, `summary` (the generator's last line without its `; <page> written`), `libraries` (`name`, `version`, `licence`,
`global`, `use`).

## `elements`
One per FTR, RQ, ADR, DEC, PLAN, TASK and undefined ID: `id`, `type`, `kind`, `tri`, `title`, `status`, `doc`, `first`, `last`
(the document and its line range; `kind` tells an index element from an undefined ID).

## `edges`
Each `[from, to, kind, proofs]`, `kind` among `contains`, `refs`, `code`, and each proof `[line, text]`.

## `files`
The scanned files: `path`, `ids` (how many IDs each cites).

## `coverage`
`{requirement ID: "covered" | "indirect" | "uncovered"}`.

## `quality`
`score` and `grade` (null when no check weighs anything), `attention` (the score under which a check needs attention), `scale` (the grades and their thresholds), `risks`
(their weights), `verdicts`, `trigrams` (`{trigram: {score, grade, checks}}`, each check `key`, `population`, `findings` as a
count, `score`) and `checks`, each with `key`, `title`, `label`, `rule`, `risk`, `items` (what its findings are: `id`, `file`,
`function`), `population`, `findings` (the list), `score` (null with an empty population).

## `history`
- `limits`: `since`, `depth`, `commits`, `first`, `last`, `shallow`.
- `people`: `name`, `names`, `emails`, `mergedBy` among `email` and `mailmap`, `kind`, `commits` as author, `coCommits`.
- `commits`, in author-date order: `hash` of 10 characters, `date`, `subject`, `author` and `coAuthors` as indexes into `people`,
  `kind`.
- `interventions`: `elements` by ID, `files` by path and, with a call graph, `functions` by index into `callGraph.functions`,
  each a list of `[commit index, changed lines]`.
- `graph`: `branches` (names, `null` for an unnamed branch) and `nodes`, HEAD's commits newest first in topological order down to
  the oldest commit of `commits`, merges and commits outside the folders read included: `hash`, `parents` as node indexes,
  `branch`, `commit` index or `null`, and, only when it is `null`, `date` and `subject`. It is read by a second `git log` with no path, since a
  path-limited log rewrites parents and drops merges. A commit's branch is found by following first parents from the default
  branch's tip (`main`, `master`, else the branch checked out), the other local tips oldest first, then the second parent of each
  merge whose message names its branch (`Merge branch 'X'`, `Merge pull request #n from owner/X`, `Merge X into Y`); a commit keeps
  the first branch that reaches it.

## `delivery`
- `tasks`, each `[ID, tier, re-tiered, commit index into history.commits, lines changed in the scanned files, commit type or null,
  reworked, reason set aside or null]`.
- `activeDays`: `{person index: [day, …]}`.
- `settings`: a copy of `assets/delivery.json`.
- `friction`: the rows of `_sessionstate/METRICS_LOG.md` at HEAD read with `git blame`, each `[date, trigram, 4 counters by
  position, commit index]`; a row outside the history read is left out, a malformed row or one of a merge also named on the
  error stream.

## `callGraph`
- `functions`, each `[file index, first, last, qualified name, language index, first-line text, key suffix (0: none), scope index
  (-1: none)]`.
- `languages`: their names.
- `scopes`, each `[qualified name, kind, parent index (-1: none)]`.
- `calls`: one flat list of integers over all callers, in function order; per caller: caller - previous caller, callee count, then per callee: callee -
  caller, ambiguous + 2 * line count, each call-site line - the caller's first line.
- `ids`, each `[function index, ID, [lines]]`.
- `counts`: `functions`, `calls`, `ambiguous`, `external`.
