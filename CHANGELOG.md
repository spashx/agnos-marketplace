# Changelog

All notable changes to this repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [3.6.2]

### Changed
- `README.md` overview illustration replaced: `assets/agnos-overview.png` is the new image, and its SVG sources stay in `assets/`, not delivered with the plugin
- END SESSION step 4 of the instructions recommends a context reset: once the steps are done and no task remains, the agent tells you to run the context-reset command (`/clear` on Claude Code and GitHub Copilot)

## [3.6.1]

### Added
- `agnos-meta-release` writes the plugin's author URL, homepage, repository and keywords in both manifests and in the catalogue's plugin entry, with the license and the category `software development` in that entry
- `agnos-meta-release` writes the plugin logo, `plugins/agnos/assets/agnos.svg`, generated from the brand colours of the perf center's tokens and declared as `logo` in both manifests
- `agnos-meta-plugin-proof` strict validation counts a validation whose only warning is the unknown field `logo` as passed, and its detail says so

### Changed
- `agnos-meta-release` catalogue: the description and the version move into a `metadata` block, and no description stays at its root
- `README.md` installs the plugin per tool: command lines for Claude Code and GitHub Copilot CLI, and the steps of each app and VS Code extension; it tells a plugin user not to clone the repository

### Fixed
- `agnos-meta-release` delivers the README's overview image from `assets/agnos-overview.png`, where the repository keeps it
- `AGNOS-GETTING-STARTED.md` corrected: the commit example shows the co-author trailer that `commit-task` writes, the `--sources` note says the project's root holds `agnos-process/`, and the pointer to the plugin README is removed

## [3.6.0]

### Added
- `agnos-meta-release` delivers a README in the plugin's folder, the one VS Code shows for the installed plugin

### Removed
- The marketplace serves Claude Code and GitHub Copilot only: its second catalogue and the documents' mentions of a third tool are withdrawn, to be delivered later

## [3.5.0]

### Added
- `agnos-meta-demo` demo: the replay engine commits the agents' co-authors and the agents alone, and verify checks them
- `agnos-meta-demo` demo: a simulated team of four, each person working mostly with an agent, with Claude Code and Copilot co-authors; verify checks the team, its roles and each person's share of agent commits
- `agnos-git-workflow` `commit-task` builds the commit message by script, with one co-author trailer naming the agent's harness and model
- `agnos-init` writes one block, the same for `CLAUDE.md` and `AGENTS.md`, whose question line names both tools
- The block explains how Claude Code and GitHub Copilot keep the process in context, and orders the agent to invoke it again after a compaction
- `agnos-perf-center` page: a `#view=<name>` fragment opens the view of any tab the page shows, else the Overview
- `agnos-meta-website` site: screenshots framed at 16:9, 1920 x 1080, and checked at build
- `agnos-meta-website` site: tour screenshots enlarged on click, as the examples are
- `agnos-meta-website` site: the tour sections named after their views, the Matrix first and linked to `#view=matrix`
- `agnos-meta-website` site: the tour stops in the Performance Center's order
- `agnos-meta-website` site: an example command in a console style under each start step, the French addressing the reader with "vous"
- `agnos-meta-website` site: the chain's Performance Center row without the demo's name

### Changed
- `agnos-meta-demo` demo: each of its ADRs holds a class diagram and a sequence diagram
- `agnos-meta-demo` demo: its functions cite their requirement in comments
- A Tier S task needs no written plan; Tier M and L tasks keep theirs, as the tier table of the instructions and of `AGNOS-GETTING-STARTED.md` states
- `README.md` explains what clear, automatic and manual compaction do to the process in Claude Code and GitHub Copilot, the risks and what to do
- `AGNOS-GETTING-STARTED.md` states the shared entry-point block, one session per conversation and the invocation again after a compaction
- `agnos-meta-website` site: its English text aligned on the French, French typos corrected
- `agnos-meta-website` site: quotes the renamed demo, its titles, its ADR excerpt and its commit

### Removed
- `agnos-meta-website` site: the index card without measures, its sizes, ratio, speed and bars removed
- `agnos-meta-website` site: the History note

## [3.4.0]

### Added
- `MANDATORY TITLE FORMAT` in the instructions: every artifact title is 2 to 8 words and a noun phrase, and a TASK title is one base-form action verb and its object; each title is checked against these rules before it is written
- `agnos-meta-website` maintainer skill: builds the AGNOS presentation website, a guided tour of the demo's Performance Center for CIOs, in English and French, from its Markdown text, design tokens and images; the build writes its folder only when every check passed
- `agnos-meta-website` site: three examples under the Overview (a requirement, an ADR and a plan), enlarged on click
- `agnos-meta-website` site: a third card on unique identifiers as keys, a design-system card with the demo's buttons, and the index card's measured speed per 100 artifacts

### Changed
- `agnos-session` runs its `session.sh` with `bash`, as the other skills do, when `powershell` is not found
- `agnos-perf-center` About topic: the tagline reads "Agentic efficiency by traceability", on the site too
- START SESSION step 2 stops and asks for `agnos-init` when `agnos-process/` is missing, before the session variables are asked
- A written plan is required for Tier S and Tier M tasks too, as it already was for Tier L
- Every decision of an ADR is written as a `Statement` (one sentence, active voice) and a `Rationale` (the reason and its evidence)
- The `## Diagram` section of an ADR holds at least two Mermaid diagrams: a class diagram of the entities and a sequence diagram of their interactions
- Traceability references are comments in every file outside `agnos-process/`; the artifacts of `agnos-process/` hold their own IDs as plain text
- `agnos-meta-demo` demo: its 12 decisions are written as Statement and Rationale, its ADRs cite their requirements as plain text, and its 68 artifact titles follow the title format

## [3.3.0]

### Added
- `agnos-session` skill: `init --tri <TRI> --tests <true|false>` writes `agnos-process/_sessionstate/session.yaml` whole, with `tri`, `tests` and the detected `platform`, and prints it; `show` prints the state on one line; `close` appends the session's friction-metrics row to `METRICS_LOG.md`, so the agent never writes these files itself
- `agnos-init` adds `agnos-process/_sessionstate/session.yaml` to the project's `.gitignore` when git's rules do not ignore it yet, and reports `.gitignore` created, added or unchanged

### Changed
- **BREAKING:** the session variable `unit_tests` is renamed `tests`, in `session.yaml` and in the instructions, which say "test" where they said "unit test" and no longer forbid renaming a session key. `init` rewrites the file whole, so a session start replaces the former key
- **BREAKING:** `agnos-process/_sessionstate/session.yaml` is no longer version-controlled; `METRICS_LOG.md` stays version-controlled. `agnos-init` never untracks a committed file: a project that committed `session.yaml` runs `git rm --cached agnos-process/_sessionstate/session.yaml` itself. There is no migration
- START SESSION asks for the trigram and the tests question, then invokes `agnos-session init`; END SESSION invokes `agnos-session close` for the metrics row

## [3.2.0]

### Added
- `agnos-self-improvement` skill: the procedure of a recursive self-improvement effort, and `budget.ps1` / `budget.sh` giving the declared target's ceiling, line count and lines left; a rules file other than the instructions file gets 100 lines unless declared `at most <N> lines`
- `agnos-init` writes `AGNOS-GETTING-STARTED.md` at the project's root, the user's guide for a plugin user, and reports it created, updated or unchanged
- `agnos-meta-release` writes `<folder>.report.html` beside its JSON report: one self-contained page, its data embedded and escaped, drawn as text only, its styles from the perf center's design tokens
- `agnos-meta-release` checks the four manifests and catalogues by script, with no AI tool: required fields, plugin folders, the same name, version and description everywhere
- `agnos-meta-release` console: the problems, the lines to read, the mentions and the IDs outside comments, each with its file and line, and a last line giving `exit=` whatever the outcome
- `agnos-meta-plugin-proof` maintainer skill: proves a built marketplace by a real install in isolated Claude Code and GitHub Copilot configurations, on request with questions to their models and the delivered suites on Linux, publishing nothing
- `agnos-meta-release` writes a marketplace holding the plugin `agnos`, with its generated skill `agnos-process` and its agents, for Claude Code and GitHub Copilot
- `agnos-meta-release` maintainer skill: rehearses a release in a folder, from a commit, without AGNOS's own IDs, and proves it behaves as the repository does, publishing nothing
- `agnos-index` and `agnos-perf-center` show on their output line the time the run took, never written into the generated files
- `agnos-meta-qa` maintainer skill: a code quality report on request, as normalised JSON from pinned analysers, blocking
  nothing
- `agnos-init` skill: adds AGNOS to a project with one block in its `CLAUDE.md` and `AGENTS.md`, every other byte
  preserved, and its `process/` folders
- `agnos-index` skill: the index generators (PowerShell and bash) with shared golden tests
- `agnos-index` skill packaged and integrated into the process
- `agnos-perf-center` skill: the process model, with elements from the index, containment and the
  references of each element's own lines
- `agnos-perf-center` skill: the source scanner, with default or given extensions and exclusions
- `agnos-perf-center` skill: coverage and gaps, with the summary line
- `agnos-perf-center` skill: offline page assembly, with design tokens in three tiers and Cytoscape.js
  vendored
- `agnos-perf-center` page: overview, search, filters, sortable matrix with CSV export, gaps, detail
  panel and deep links
- `agnos-perf-center` page: interactive graph of the selection's links as a traceability flow
- `agnos-perf-center` skill packaged as `SKILL.md`, with its Claude Code pointer
- `agnos-perf-center` page: resizable panels, with widths remembered
- `agnos-perf-center` page: the data beside it, as `<page>.json` and `<page>.data.js`
- `agnos-perf-center` call graph: optional module behind `--call-graph`, with the tree-sitter adapter and
  the C and C++ queries
- `agnos-perf-center` call graph: call resolution by name, with callers, callees, ambiguous and external
  counts
- `agnos-perf-center` call graph: C#, Java, JavaScript and Node.js, Python and Rust
- `agnos-perf-center` call graph: functions in the page, in the graph and in the matrix
- `agnos-perf-center` graph: namespace and class boxes, enclosing boxes, and the box panel and deep links
- `agnos-perf-center` graph: toolbar groups Depth, Display and Implementation detail, and a search result's
  tooltip
- `agnos-perf-center` page: scrollbars for the central views
- `agnos-perf-center` matrix: resizable columns
- `agnos-perf-center` graph: readable relations with arrows, a drawn legend and explanatory tooltips
- `agnos-perf-center` graph: a colour per relation, finer links and selection frame
- `agnos-perf-center` matrix: columns from one model, Feature first by default
- `agnos-perf-center` matrix: movable columns, order remembered, Reset columns
- `agnos-perf-center` matrix: feature title under its ID
- `agnos-perf-center` detail panel: fixed band, and tags that filter the groups of links
- `agnos-perf-center` graph: finer wheel zoom from a design token
- `agnos-perf-center` Quality view: scored checks, overall score and grade, quality data block
- `agnos-perf-center` Quality view: check cards compact or detailed, expand and collapse all
- `agnos-perf-center` Quality view: report card, grade palette, grade in tab, sidebar and overview
- `agnos-perf-center` Quality view: radar, feature-area bars and coverage shares as SVG with tooltips
- `agnos-perf-center` Quality view: fits a 1440x900 window
- `agnos-perf-center` Quality view: grade colours follow the green-to-red scale of the Nutri-Score and DPE
  labels
- `agnos-docs-sync` skill: the report of the changes since each entry-point document's last change
- `agnos-docs-sync` skill, its Claude Code pointer and the Haiku sub-agent
- `agnos-design-system` skill: the design-system template packaged as a skill
- `AGENTS.md`: the entry point for every AI agent
- `agnos-demo` demo: replay engine, process documents of the three sessions, Python service,
  TypeScript client and command-line tool, README, cast and scenario
- `agnos-demo` demo: verification script of its requirements, and the `agnos-demo` skill
  with build and verify sub-commands
- `agnos-perf-center` page: the Spans brand mark in the header, an About topic with the design's lockup and the addresses of this app and its link buttons, a Licenses topic whose licences are coloured local badges, and the foot of the left panel naming the application and its version
- `agnos-perf-center` page: one `AGNOS v.<major>.<minor>` label in the foot and in About, and the licence badges link to their SPDX entries
- `agnos-perf-center` page: dark theme in four surface layers, with the fragile colours given dark variants and their contrast tested
- `agnos-perf-center` shows the scanned extensions, scanned names and excluded names on every run, each marked as the default or the user's list, and `--help` prints the default lists
- `agnos-meta-release-prep` maintainer skill: checks the working tree and the index, syncs the documents with `agnos-meta-docs-sync`, shows the diff, the unreleased entries and a proposed SemVer 2.0.0 version, records the approved version and commits it, publishing nothing
- `agnos-perf-center` score: the "Functions traced" check weighs medium in the quality score
- The Definition of Done gains, for S, M and L, the item that every new function, method and class cites its requirement ID in its doc comment or in the comment just above it
- `agnos-meta-release` reads the version from the version file, in SemVer 2.0.0 (refused when absent or invalid), and reports the changelog's unreleased entries without failing
- `agnos-init` writes `agnos-process/AGNOS-GETTING-STARTED.md` and the version file `agnos-process/VERSION.txt`

### Changed
- The RECURSIVE SELF-IMPROVEMENT SESSIONS section and END SESSION step 3 invoke `agnos-self-improvement`; the improvement target is always declared by the project, with no fallback on the instructions file, and rules older than the effort may be revised
- `agnos-init`'s success step gives two steps: open a new conversation, so that it reads the block, then ask it for an AGNOS session; the step names `AGNOS-GETTING-STARTED.md` as the guide to read meanwhile
- The `agnos-init` block tells the agent to read `process/project-rules.md` when it exists, and names it the improvement target. Initialised projects call `agnos-init` again to update
- The process's self-improvement goes into the improvement target, the file the project's AGNOS block names (created if absent), and into the instructions file otherwise, never into a file of an installed plugin
- A test run's `Verification` field states how many tests were skipped and why: a skipped test is not a passed test
- `README.md` and `GETTING_STARTED.MD` address plugin users, and the README states what was tested per tool and system
- `agnos-init` writes a block naming the skill `agnos-process`, with no path, and no longer takes a toolkit input. Initialised projects install the plugin and call `agnos-init` again to update
- The delivered skills name their files from their own folder, with no `.github/skills/` path
- The sub-agent of `agnos-meta-docs-sync` is defined once in `.github/agents/`, read by GitHub Copilot, and `.claude/agents/` holds a pointer to it for Claude Code
- `agnos-init` writes a `readme.md` saying what each `process/` folder it creates holds, instead of a `.gitkeep`
- The citations of `CHANGELOG.md`, of the skills' documents and of the scripts' help are in comments, as MANDATORY TRACEABILITY asks, and `agnos-meta-docs-sync` writes them so
- `agnos-perf-center` Delivery: the Rework and Friction marks of "Points over time" are amber and red with a dark outline, so they
  stand out inside and outside periods A and B
- `agnos-init`: the `CLAUDE.md` block orders the agent to read the instructions first, as the `AGENTS.md` block does, instead
  of an `@` import that may not load. Initialised projects call `agnos-init` again to update
- A session starts when the user asks for it, as it already closed: START SESSION no longer runs by itself
- The skill `agnos-trace` is now `agnos-perf-center`, since it monitors the process's execution on a project. Its script is
  `perf_center.py`, its outputs `PERF-CENTER.*`, its page title "Performance center". Projects must update their ignore rules,
  and a reader's saved page preferences reset once.
- `agnos-perf-center` scripts and page script: no open quality finding, with the same data generated
- `agnos-perf-center` page skeleton: a plain `div` for the tabs and `fieldset` for the filter groups
- `agnos-index`'s error without `process/`, START SESSION, `README.md` and `GETTING_STARTED.MD` say to call `agnos-init`
- The demo is an initialised project: its first commit holds the `CLAUDE.md` and `AGENTS.md` written by `agnos-init`
- The demo holds the project only, with no other AGNOS file, and `agnos-meta-demo` runs the skills on it from this
  repository
- Maintainer skills renamed `agnos-meta-demo` and `agnos-meta-docs-sync`, with the sub-agent; the prefix `agnos-meta-` is
  the only criterion that marks them
- `agnos-perf-center` graph and legend styling: thicker relation samples, triangle arrows on contains links,
  opaque legend samples, group labels and faint frames
- `README.md` rewritten and `GETTING_STARTED.MD` aligned with `agnos-index`, `agnos-perf-center` and
  `agnos-design-system`
- `CLAUDE.md` aligned on the four skills
- Design-system dependencies on UI requirements; one task re-tiered to M
- The process folder is `agnos-process/`, with its index `process.idx.md`, in place of `process/`; `agnos-init` moves an existing `process/` with `git mv` when it is tracked, and exits 1 when both folders exist
- The generated process skill is `agnos-instructions`; `layout.json` declares the process folder once, `layout.py` writes its copies and checks them, and the scripts read those copies

### Fixed
- `agnos-meta-release` output holds what is declared: no bytecode written by its checks, and a stray file fails the rehearsal
- `agnos-init` accepts an absolute target on Windows, and `agnos-meta-release` no longer takes two failures for the same behaviour
- `agnos-perf-center` writes dates in one form whatever git's version, and the delivered suites run on Linux
- `agnos-perf-center` matrix: headers of the list columns aligned left with their cells
- `agnos-perf-center` graph: one global box for what stands in no named namespace, instead of one box per
  file
- `agnos-perf-center` Untraced functions list: long function names end in an ellipsis
- `agnos-perf-center` graph: relation tooltip delay halved to 1 s
- `agnos-perf-center` graph: the unreadable Whole graph control removed from the toolbar
- `agnos-perf-center` reads the version from the layout's copy, and the layout check accepts `agnos_layout.<NAME>`

### Removed
- `GETTING_STARTED.MD` leaves the repository root and the release: the user's guide is `AGNOS-GETTING-STARTED.md`, which `agnos-init` writes into each project, and README, CONTRIBUTING and the issue template link to it
- `agnos-perf-center` "gaps" view and wording in the page, data and docs, replaced by the Quality view,
  checks and findings

## [v3.1]

### Changed
- Section 4 ("Code Implementation and Quality") rewording: "All" → "ALL" and "Every" → "EVERY"
  for emphasis consistency with the rest of the file's SHALL/MANDATORY language.

### Removed
- `chat_mode` session state variable and all references to it (session-start question, schema,
  variable-kind table, "Chat Verbosity" guidance) from
  `.github/instructions/agnos-sw-eng.instructions.md`, `README.md`, `GETTING_STARTED.MD`, and
  `process/_sessionstate/session.yaml`.
Consider using a dedicated harness like [caveman](https://github.com/juliusbrussee/caveman) to manage chat verbosity.
- redondant "versions" removed almost everywhere. only CHANGELOG.md and releases relate to version.



